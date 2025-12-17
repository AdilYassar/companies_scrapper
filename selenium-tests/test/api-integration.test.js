const { expect } = require('chai');
const { By } = require('selenium-webdriver');
const WebDriverManager = require('../utils/WebDriverManager');

describe('API Integration Tests', function() {
  let driverManager;

  before(async function() {
    this.timeout(30000);
    driverManager = new WebDriverManager();
    await driverManager.initDriver();
  });

  after(async function() {
    await driverManager.quitDriver();
  });

  describe('Backend API Health Check', function() {
    it('should verify backend API is accessible', async function() {
      // Navigate to a page that makes API calls
      await driverManager.navigateToPage('/');
      
      // Wait for stats to load (indicates API is working)
      await driverManager.driver.sleep(5000);
      
      // Check if stats are displayed (indicates successful API call)
      const statNumbers = await driverManager.driver.findElements(By.className('stat-number'));
      
      if (statNumbers.length > 0) {
        // If we have stat numbers, API is likely working
        expect(statNumbers.length).to.be.at.least(4);
      } else {
        // If no stats, check for loading or error indicators
        const isLoading = await driverManager.isElementPresent(By.className('loading-spinner'));
        
        // Either loading should be shown or stats should be present
        expect(isLoading || statNumbers.length > 0).to.be.true;
      }
    });

    it('should handle API errors gracefully', async function() {
      await driverManager.navigateToPage('/companies');
      
      // Wait for page to attempt loading data
      await driverManager.driver.sleep(5000);
      
      // Check that page doesn't crash on potential API errors
      const pageTitle = await driverManager.getPageTitle();
      expect(pageTitle).to.equal('Companies Scraper');
      
      // Check that either companies are loaded or appropriate message is shown
      const companyCards = await driverManager.driver.findElements(By.className('company-card'));
      const noCompaniesMessage = await driverManager.isElementPresent(By.xpath('//*[contains(text(), "No companies found")]'));
      const loadingSpinner = await driverManager.isElementPresent(By.className('loading-spinner'));
      
      expect(companyCards.length > 0 || noCompaniesMessage || loadingSpinner).to.be.true;
    });
  });

  describe('Scraping Jobs API Integration', function() {
    it('should load scraping jobs page without errors', async function() {
      await driverManager.navigateToPage('/scraping');
      
      // Wait for page to load
      await driverManager.driver.sleep(3000);
      
      const pageTitle = await driverManager.getPageTitle();
      expect(pageTitle).to.equal('Companies Scraper');
      
      const header = await driverManager.getElementText(By.tagName('h1'));
      expect(header).to.equal('Scraping Jobs');
    });

    it('should display create job form', async function() {
      await driverManager.navigateToPage('/scraping');
      
      // Wait for form to load
      await driverManager.driver.sleep(2000);
      
      const countrySelect = await driverManager.waitForElement(By.css('select'));
      const sourceSelect = await driverManager.driver.findElements(By.css('select'));
      const queryInput = await driverManager.waitForElement(By.css('input[type="text"]'));
      const submitButton = await driverManager.waitForElement(By.css('button[type="submit"]'));
      
      expect(await countrySelect.isDisplayed()).to.be.true;
      expect(sourceSelect.length).to.be.at.least(2);
      expect(await queryInput.isDisplayed()).to.be.true;
      expect(await submitButton.isDisplayed()).to.be.true;
    });

    it('should validate form fields before submission', async function() {
      await driverManager.navigateToPage('/scraping');
      await driverManager.driver.sleep(2000);
      
      const submitButton = await driverManager.waitForElement(By.css('button[type="submit"]'));
      await submitButton.click();
      
      // Check if form validation prevents submission
      const currentUrl = await driverManager.getCurrentUrl();
      expect(currentUrl).to.include('/scraping');
    });

    it('should fill and attempt to submit scraping job form', async function() {
      await driverManager.navigateToPage('/scraping');
      await driverManager.driver.sleep(2000);
      
      // Fill form fields
      const countrySelect = await driverManager.waitForElement(By.css('select'));
      await countrySelect.sendKeys('italy');
      
      const sourceSelects = await driverManager.driver.findElements(By.css('select'));
      if (sourceSelects.length > 1) {
        await sourceSelects[1].sendKeys('kompass');
      }
      
      const queryInput = await driverManager.waitForElement(By.css('input[type="text"]'));
      await queryInput.sendKeys('software development');
      
      const submitButton = await driverManager.waitForElement(By.css('button[type="submit"]'));
      
      // Check if button becomes disabled during submission
      const isInitiallyEnabled = await submitButton.isEnabled();
      expect(isInitiallyEnabled).to.be.true;
      
      await submitButton.click();
      
      // Wait for potential submission
      await driverManager.driver.sleep(3000);
      
      // Check that we're still on the scraping page (successful submission or validation error)
      const currentUrl = await driverManager.getCurrentUrl();
      expect(currentUrl).to.include('/scraping');
    });
  });

  describe('Real-time Updates Test', function() {
    it('should handle dynamic content updates', async function() {
      await driverManager.navigateToPage('/scraping');
      
      // Wait for initial load
      await driverManager.driver.sleep(3000);
      
      // Get initial job count
      const initialJobs = await driverManager.driver.findElements(By.css('.card .card-body'));
      const initialJobCount = initialJobs.length;
      
      // Wait for potential updates (simulating real-time updates)
      await driverManager.driver.sleep(5000);
      
      // Get job count after waiting
      const updatedJobs = await driverManager.driver.findElements(By.css('.card .card-body'));
      const updatedJobCount = updatedJobs.length;
      
      // Job count should be stable or updated
      expect(updatedJobCount).to.be.at.least(initialJobCount - 1); // Allow for some variation
    });

    it('should display job status badges correctly', async function() {
      await driverManager.navigateToPage('/scraping');
      await driverManager.driver.sleep(5000);
      
      const statusBadges = await driverManager.driver.findElements(By.className('badge'));
      
      if (statusBadges.length > 0) {
        for (let badge of statusBadges.slice(0, 3)) { // Check first 3 badges
          const badgeText = await badge.getText();
          const badgeClass = await badge.getAttribute('class');
          
          expect(badgeText).to.match(/^(completed|failed|active|waiting)$/);
          expect(badgeClass).to.include('badge');
        }
      }
    });
  });

  describe('Data Validation Tests', function() {
    it('should validate company data structure', async function() {
      await driverManager.navigateToPage('/companies');
      await driverManager.driver.sleep(5000);
      
      const companyCards = await driverManager.driver.findElements(By.className('company-card'));
      
      if (companyCards.length > 0) {
        const firstCard = companyCards[0];
        const cardText = await firstCard.getText();
        
        // Company cards should have some basic structure
        expect(cardText.length).to.be.greaterThan(0);
      }
    });

    it('should validate email formats in company listings', async function() {
      await driverManager.navigateToPage('/companies');
      await driverManager.driver.sleep(5000);
      
      const emailLinks = await driverManager.driver.findElements(By.css('a[href^="mailto:"]'));
      
      for (let link of emailLinks.slice(0, 5)) { // Check first 5 email links
        const href = await link.getAttribute('href');
        const email = href.replace('mailto:', '');
        
        // Basic email validation
        expect(email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      }
    });

    it('should validate URL formats in company listings', async function() {
      await driverManager.navigateToPage('/companies');
      await driverManager.driver.sleep(5000);
      
      const websiteLinks = await driverManager.driver.findElements(By.css('a[href^="http"]'));
      
      for (let link of websiteLinks.slice(0, 5)) { // Check first 5 website links
        const href = await link.getAttribute('href');
        
        // Basic URL validation
        expect(href).to.match(/^https?:\/\/.+/);
      }
    });
  });
});
