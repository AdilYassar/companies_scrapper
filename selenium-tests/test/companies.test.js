const { expect } = require('chai');
const { By } = require('selenium-webdriver');
const WebDriverManager = require('../utils/WebDriverManager');

describe('Companies Page Tests', function() {
  let driverManager;

  before(async function() {
    this.timeout(30000);
    driverManager = new WebDriverManager();
    await driverManager.initDriver();
  });

  after(async function() {
    await driverManager.quitDriver();
  });

  beforeEach(async function() {
    await driverManager.navigateToPage('/companies');
  });

  describe('Page Load Tests', function() {
    it('should load the companies page successfully', async function() {
      const title = await driverManager.getPageTitle();
      expect(title).to.equal('Companies Scraper');
    });

    it('should display the companies directory header', async function() {
      const header = await driverManager.getElementText(By.tagName('h1'));
      expect(header).to.equal('Companies Directory');
    });

    it('should display the filter section', async function() {
      const filterSection = await driverManager.waitForElement(By.className('filter-section'));
      expect(await filterSection.isDisplayed()).to.be.true;
    });
  });

  describe('Filter Functionality Tests', function() {
    it('should have country filter dropdown', async function() {
      const countryFilter = await driverManager.waitForElement(By.css('select[value=""]'));
      expect(await countryFilter.isDisplayed()).to.be.true;
      
      const options = await countryFilter.findElements(By.tagName('option'));
      expect(options.length).to.be.at.least(3); // All Countries, Italy, Romania
    });

    it('should filter companies by country', async function() {
      const countryFilter = await driverManager.waitForElement(By.css('select'));
      await countryFilter.sendKeys('italy');
      
      // Wait for potential results to load
      await driverManager.driver.sleep(2000);
      
      const currentUrl = await driverManager.getCurrentUrl();
      expect(currentUrl).to.include('/companies');
    });

    it('should have search input field', async function() {
      const searchInput = await driverManager.waitForElement(By.css('input[type="text"]'));
      expect(await searchInput.isDisplayed()).to.be.true;
      
      const placeholder = await searchInput.getAttribute('placeholder');
      expect(placeholder).to.include('Search');
    });

    it('should filter companies by search term', async function() {
      const searchInput = await driverManager.waitForElement(By.css('input[type="text"]'));
      await searchInput.sendKeys('software');
      
      // Wait for potential results to load
      await driverManager.driver.sleep(2000);
      
      const currentUrl = await driverManager.getCurrentUrl();
      expect(currentUrl).to.include('/companies');
    });
  });

  describe('Companies Display Tests', function() {
    it('should display refresh button', async function() {
      const refreshButton = await driverManager.waitForElement(By.xpath('//button[contains(text(), "Refresh")]'));
      expect(await refreshButton.isDisplayed()).to.be.true;
      expect(await refreshButton.isEnabled()).to.be.true;
    });

    it('should handle no companies found scenario', async function() {
      // Enter a search term that likely won't return results
      const searchInput = await driverManager.waitForElement(By.css('input[type="text"]'));
      await searchInput.sendKeys('nonexistentcompany12345');
      
      await driverManager.driver.sleep(3000);
      
      // Check if "No companies found" message appears or companies list is empty
      const isNoCompaniesMessage = await driverManager.isElementPresent(By.xpath('//*[contains(text(), "No companies found")]'));
      const companyCards = await driverManager.driver.findElements(By.className('company-card'));
      
      expect(isNoCompaniesMessage || companyCards.length === 0).to.be.true;
    });

    it('should display pagination when there are multiple pages', async function() {
      // Clear search to show all companies
      const searchInput = await driverManager.waitForElement(By.css('input[type="text"]'));
      await searchInput.clear();
      
      await driverManager.driver.sleep(2000);
      
      // Check if pagination exists
      const hasPagination = await driverManager.isElementPresent(By.className('pagination'));
      
      // Pagination may or may not exist depending on data
      if (hasPagination) {
        const pagination = await driverManager.waitForElement(By.className('pagination'));
        expect(await pagination.isDisplayed()).to.be.true;
      }
    });
  });

  describe('Company Card Tests', function() {
    it('should display company cards with proper structure', async function() {
      await driverManager.driver.sleep(3000); // Wait for potential data load
      
      const companyCards = await driverManager.driver.findElements(By.className('company-card'));
      
      if (companyCards.length > 0) {
        const firstCard = companyCards[0];
        
        // Check for company name
        const companyName = await firstCard.findElements(By.className('company-name'));
        expect(companyName.length).to.be.at.least(1);
        
        // Check for company country
        const companyCountry = await firstCard.findElements(By.className('company-country'));
        expect(companyCountry.length).to.be.at.least(1);
      }
    });

    it('should validate email links in company cards', async function() {
      await driverManager.driver.sleep(3000);
      
      const emailLinks = await driverManager.driver.findElements(By.css('a[href^="mailto:"]'));
      
      if (emailLinks.length > 0) {
        const firstEmailLink = emailLinks[0];
        const href = await firstEmailLink.getAttribute('href');
        expect(href).to.match(/^mailto:.+@.+\..+/);
      }
    });

    it('should validate website links in company cards', async function() {
      await driverManager.driver.sleep(3000);
      
      const websiteLinks = await driverManager.driver.findElements(By.css('a[target="_blank"]'));
      
      if (websiteLinks.length > 0) {
        for (let link of websiteLinks.slice(0, 3)) { // Check first 3 links
          const href = await link.getAttribute('href');
          expect(href).to.match(/^https?:\/\/.+/);
          
          const target = await link.getAttribute('target');
          expect(target).to.equal('_blank');
          
          const rel = await link.getAttribute('rel');
          expect(rel).to.include('noopener');
        }
      }
    });
  });

  describe('User Interaction Tests', function() {
    it('should refresh companies list when refresh button is clicked', async function() {
      const refreshButton = await driverManager.waitForElement(By.xpath('//button[contains(text(), "Refresh")]'));
      
      await refreshButton.click();
      await driverManager.driver.sleep(2000);
      
      // Check that the page is still on companies route
      const currentUrl = await driverManager.getCurrentUrl();
      expect(currentUrl).to.include('/companies');
    });

    it('should clear search when empty string is entered', async function() {
      const searchInput = await driverManager.waitForElement(By.css('input[type="text"]'));
      
      // First enter some text
      await searchInput.sendKeys('test');
      await driverManager.driver.sleep(1000);
      
      // Then clear it
      await searchInput.clear();
      await driverManager.driver.sleep(1000);
      
      const inputValue = await searchInput.getAttribute('value');
      expect(inputValue).to.equal('');
    });
  });
});
