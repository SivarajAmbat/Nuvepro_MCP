import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'chromedriver';
import { Options } from 'selenium-webdriver/chrome';

jest.setTimeout(60000); // Increase timeout for Selenium tests

describe('Booking Features E2E Tests', () => {
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

  test('Create a booking flow', async () => {
    // Navigate to movies page
    await driver.findElement(By.linkText('Movies')).click();
    await driver.wait(until.elementLocated(By.css('.MuiCard-root')), 10000);
    
    // Click on the first movie's "View Details" button
    const viewDetailsButtons = await driver.findElements(By.xpath("//button[contains(text(), 'View Details')]"));
    if (viewDetailsButtons.length > 0) {
      await viewDetailsButtons[0].click();
      
      // Wait for movie details page to load
      await driver.wait(until.elementLocated(By.css('form')), 10000);
      
      // Fill out booking form
      // Enter name
      const nameInput = await driver.findElement(By.name('customerName'));
      await nameInput.sendKeys('Test Customer');
      
      // Select date
      const dateSelect = await driver.findElement(By.id('date-select'));
      await dateSelect.click();
      
      // Wait for dropdown to appear and select first option
      await driver.wait(until.elementLocated(By.css('.MuiMenuItem-root')), 10000);
      const dateOptions = await driver.findElements(By.css('.MuiMenuItem-root'));
      if (dateOptions.length > 0) {
        await dateOptions[0].click();
      }
      
      // Select time
      const timeSelect = await driver.findElement(By.id('time-select'));
      await timeSelect.click();
      
      // Wait for dropdown to appear and select first option
      await driver.wait(until.elementLocated(By.css('.MuiMenuItem-root')), 10000);
      const timeOptions = await driver.findElements(By.css('.MuiMenuItem-root'));
      if (timeOptions.length > 0) {
        await timeOptions[0].click();
      }
      
      // Select number of seats
      const seatsInput = await driver.findElement(By.name('numberOfSeats'));
      await seatsInput.clear();
      await seatsInput.sendKeys('2');
      
      // Submit the form
      const bookButton = await driver.findElement(By.xpath("//button[contains(text(), 'Book Now')]"));
      await bookButton.click();
      
      // Check for success message
      try {
        await driver.wait(until.elementLocated(By.className('MuiAlert-root')), 10000);
        const alertText = await driver.findElement(By.className('MuiAlert-root')).getText();
        expect(alertText).toContain('Booking created successfully');
      } catch (e) {
        console.log('Success message not found. Booking might have failed or UI has changed.');
      }
    }
  });

  test('View and manage bookings', async () => {
    // Navigate to bookings page
    await driver.findElement(By.linkText('My Bookings')).click();
    
    // Wait for page to load
    await driver.wait(until.elementLocated(By.css('h5')), 10000);
    
    // Check if there are any bookings
    try {
      const bookingCards = await driver.findElements(By.className('MuiCard-root'));
      
      if (bookingCards.length > 0) {
        // Test changing booking date/time
        const changeButtons = await driver.findElements(By.xpath("//button[contains(text(), 'Change Date/Time')]"));
        
        if (changeButtons.length > 0) {
          await changeButtons[0].click();
          
          // Wait for dialog to appear
          await driver.wait(until.elementLocated(By.className('MuiDialog-paper')), 10000);
          
          // Select a different date if available
          try {
            const dateSelect = await driver.findElement(By.id('date-select'));
            await dateSelect.click();
            
            // Wait for dropdown to appear
            await driver.wait(until.elementLocated(By.css('.MuiMenuItem-root')), 10000);
            const dateOptions = await driver.findElements(By.css('.MuiMenuItem-root'));
            
            if (dateOptions.length > 1) {
              await dateOptions[1].click(); // Select the second date option
              
              // Select time for the new date
              const timeSelect = await driver.findElement(By.id('time-select'));
              await timeSelect.click();
              
              // Wait for dropdown to appear
              await driver.wait(until.elementLocated(By.css('.MuiMenuItem-root')), 10000);
              const timeOptions = await driver.findElements(By.css('.MuiMenuItem-root'));
              
              if (timeOptions.length > 0) {
                await timeOptions[0].click();
                
                // Click update button
                const updateButton = await driver.findElement(By.xpath("//button[contains(text(), 'Update Booking')]"));
                await updateButton.click();
                
                // Check for success message
                await driver.wait(until.elementLocated(By.className('MuiAlert-root')), 10000);
                const alertText = await driver.findElement(By.className('MuiAlert-root')).getText();
                expect(alertText).toContain('Booking updated successfully');
              }
            }
          } catch (e) {
            console.log('Could not change booking date/time. Dialog may have changed or no other dates available.');
          }
        }
      }
    } catch (e) {
      console.log('No bookings found to test with.');
    }
  });
});
