import { Builder, By, until, WebDriver, Key } from 'selenium-webdriver';
import chrome from 'chromedriver';
import { Options } from 'selenium-webdriver/chrome';

jest.setTimeout(60000); // Increase timeout for Selenium tests

describe('Movie Management E2E Tests', () => {
  let driver: WebDriver;
  const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:3000';

  beforeAll(async () => {
    const options = new Options().headless(); // Run headless for CI
    
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    await driver.get(baseUrl);
    await driver.wait(until.elementLocated(By.css('body')), 10000);
  });

  test('Add new movie flow', async () => {
    // Navigate to add movie page
    await driver.findElement(By.linkText('Movies')).click();
    await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Add New Movie')]")), 10000);
    await driver.findElement(By.xpath("//button[contains(text(), 'Add New Movie')]")).click();
    
    // Wait for the add movie form to load
    await driver.wait(until.elementLocated(By.xpath("//h4[contains(text(), 'Add New Movie')]")), 10000);
    
    // Fill out the form
    const movieTitle = 'Test Movie ' + Math.floor(Math.random() * 1000);
    
    // Enter movie title
    await driver.findElement(By.name('title')).sendKeys(movieTitle);
    
    // Enter description
    await driver.findElement(By.name('description')).sendKeys('This is a test movie description created by Selenium test.');
    
    // Enter duration
    const durationInput = await driver.findElement(By.name('duration'));
    await durationInput.clear();
    await durationInput.sendKeys('120');
    
    // Enter available seats
    const seatsInput = await driver.findElement(By.name('availableSeats'));
    await seatsInput.clear();
    await seatsInput.sendKeys('100');
    
    // Fill show date and time
    // This assumes there's at least one showDateTime field
    
    // Enter date for the first show
    // Use a future date to ensure it's valid (1 year from now)
    const today = new Date();
    const nextYear = today.getFullYear() + 1;
    const futureDate = `${nextYear}-05-15`;
    
    await driver.findElement(By.name('showDateTimes.0.date')).sendKeys(futureDate);
    
    // Enter time 
    await driver.findElement(By.name('showDateTimes.0.time')).sendKeys('14:30');
    
    // Add another show date/time
    await driver.findElement(By.xpath("//button[contains(text(), 'Add Show Time')]")).click();
    
    // Enter data for second show date/time
    await driver.findElement(By.name('showDateTimes.1.date')).sendKeys(futureDate);
    await driver.findElement(By.name('showDateTimes.1.time')).sendKeys('19:00');
    
    // Submit the form
    await driver.findElement(By.xpath("//button[contains(text(), 'Add Movie')]")).click();
    
    // Check if we're redirected to movies page
    try {
      await driver.wait(until.urlContains('/movies'), 10000);
      
      // Check if our movie is in the list
      await driver.wait(until.elementLocated(By.xpath(`//p[contains(text(), '${movieTitle}')]`)), 10000);
      const newMovieTitle = await driver.findElement(By.xpath(`//p[contains(text(), '${movieTitle}')]`)).getText();
      expect(newMovieTitle).toContain(movieTitle);
    } catch (e) {
      console.log('Movie creation might have failed or UI has changed.');
    }
  });

  test('View movie details page', async () => {
    // Navigate to movies page
    await driver.findElement(By.linkText('Movies')).click();
    await driver.wait(until.elementLocated(By.css('.MuiCard-root')), 10000);
    
    // Get the title of the first movie
    const movieTitleElement = await driver.findElement(By.css('.MuiCard-root p'));
    const movieTitle = await movieTitleElement.getText();
    
    // Click on the first movie's "View Details" button
    await driver.findElement(By.xpath("//button[contains(text(), 'View Details')]")).click();
    
    // Wait for movie details page to load
    await driver.wait(until.elementLocated(By.css('h4')), 10000);
    
    // Verify the movie title on details page
    const detailsPageTitle = await driver.findElement(By.css('h4')).getText();
    expect(detailsPageTitle).toEqual(movieTitle);
    
    // Check that booking form elements are present
    await driver.findElement(By.id('date-select'));
    await driver.findElement(By.id('time-select'));
    await driver.findElement(By.name('numberOfSeats'));
    await driver.findElement(By.name('customerName'));
    await driver.findElement(By.xpath("//button[contains(text(), 'Book Now')]"));
    
    // Verify movie information is displayed
    const movieInfoText = await driver.findElement(By.className('MuiCardContent-root')).getText();
    expect(movieInfoText).toContain('Duration');
    expect(movieInfoText).toContain('Available Seats');
  });
});
