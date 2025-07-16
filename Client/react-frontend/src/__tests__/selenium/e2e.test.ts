import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'chromedriver';
import { Options } from 'selenium-webdriver/chrome';

jest.setTimeout(60000); // Increase timeout for Selenium tests

describe('Movie Booking App E2E Tests', () => {
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

  test('Home page loads correctly', async () => {
    const title = await driver.getTitle();
    expect(title).toContain('Movie Booking');
  });

  test('Navigate to Movie List', async () => {
    // Find and click the Movies link in the navigation
    await driver.findElement(By.linkText('Movies')).click();
    
    // Wait for page to load
    await driver.wait(until.elementLocated(By.css('h5')), 10000);
    
    // Check that we're on the movies page
    const headerText = await driver.findElement(By.css('h5')).getText();
    expect(headerText).toContain('Movies');
  });

  test('Navigate to Bookings page', async () => {
    // Find and click the Bookings link in the navigation
    await driver.findElement(By.linkText('My Bookings')).click();
    
    // Wait for page to load
    await driver.wait(until.elementLocated(By.css('h5')), 10000);
    
    // Check that we're on the bookings page
    const headerText = await driver.findElement(By.css('h5')).getText();
    expect(headerText).toContain('My Bookings');
  });

  // Test viewing a movie detail
  test('View movie details', async () => {
    // Navigate to movies page
    await driver.findElement(By.linkText('Movies')).click();
    await driver.wait(until.elementLocated(By.css('.MuiCard-root')), 10000);
    
    // Click on the first movie's "View Details" button
    await driver.findElement(By.xpath("//button[contains(text(), 'View Details')]")).click();
    
    // Wait for movie details page to load
    await driver.wait(until.elementLocated(By.css('h4')), 10000);
    
    // Check that movie details are displayed
    const movieTitle = await driver.findElement(By.css('h4')).getText();
    expect(movieTitle.length).toBeGreaterThan(0);
    
    // Check that the booking form is present
    const bookingForm = await driver.findElement(By.css('form'));
    expect(bookingForm).toBeDefined();
  });
});
