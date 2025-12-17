const { expect } = require('chai');
const { By } = require('selenium-webdriver');
const WebDriverManager = require('../utils/WebDriverManager');

describe('Homepage Tests', function() {
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
    await driverManager.navigateToPage('/');
  });

  describe('Page Load Tests', function() {
    it('should load the homepage successfully', async function() {
      const title = await driverManager.getPageTitle();
      expect(title).to.equal('Companies Scraper');
    });

    it('should display the correct hero title', async function() {
      const heroTitle = await driverManager.getElementText(By.className('hero-title'));
      expect(heroTitle).to.equal('Companies Scraper');
    });

    it('should display the hero subtitle', async function() {
      const heroSubtitle = await driverManager.getElementText(By.className('hero-subtitle'));
      expect(heroSubtitle).to.include('Advanced web scraping platform');
    });

    it('should display navigation menu', async function() {
      const navbar = await driverManager.waitForElement(By.className('navbar'));
      expect(await navbar.isDisplayed()).to.be.true;
    });
  });

  describe('Navigation Tests', function() {
    it('should navigate to Companies page when clicking View Companies button', async function() {
      await driverManager.clickElement(By.linkText('View Companies'));
      const currentUrl = await driverManager.getCurrentUrl();
      expect(currentUrl).to.include('/companies');
    });

    it('should navigate to Scraping page when clicking Start Scraping button', async function() {
      await driverManager.clickElement(By.linkText('Start Scraping'));
      const currentUrl = await driverManager.getCurrentUrl();
      expect(currentUrl).to.include('/scraping');
    });

    it('should navigate using navbar links', async function() {
      // Test Companies link
      await driverManager.clickElement(By.linkText('Companies'));
      let currentUrl = await driverManager.getCurrentUrl();
      expect(currentUrl).to.include('/companies');

      // Test Scraping Jobs link
      await driverManager.clickElement(By.linkText('Scraping Jobs'));
      currentUrl = await driverManager.getCurrentUrl();
      expect(currentUrl).to.include('/scraping');

      // Test Home link
      await driverManager.clickElement(By.linkText('Home'));
      currentUrl = await driverManager.getCurrentUrl();
      expect(currentUrl).to.not.include('/companies');
      expect(currentUrl).to.not.include('/scraping');
    });
  });

  describe('Content Display Tests', function() {
    it('should display stats section with numbers', async function() {
      const statsSection = await driverManager.waitForElement(By.className('stats-section'));
      expect(await statsSection.isDisplayed()).to.be.true;

      const statNumbers = await driverManager.driver.findElements(By.className('stat-number'));
      expect(statNumbers.length).to.be.at.least(4);
    });

    it('should display features section', async function() {
      const featuresSection = await driverManager.waitForElement(By.className('features-section'));
      expect(await featuresSection.isDisplayed()).to.be.true;

      const featureIcons = await driverManager.driver.findElements(By.className('feature-icon'));
      expect(featureIcons.length).to.be.at.least(3);
    });

    it('should display footer with correct information', async function() {
      const footer = await driverManager.waitForElement(By.tagName('footer'));
      expect(await footer.isDisplayed()).to.be.true;

      const footerText = await footer.getText();
      expect(footerText).to.include('Companies Scraper');
      expect(footerText).to.include(new Date().getFullYear().toString());
    });
  });

  describe('Responsive Design Tests', function() {
    it('should display mobile menu toggle on small screens', async function() {
      // Resize to mobile viewport
      await driverManager.driver.manage().window().setRect({ width: 768, height: 1024 });
      
      const menuToggle = await driverManager.waitForElement(By.className('navbar-toggler'));
      expect(await menuToggle.isDisplayed()).to.be.true;
    });

    it('should hide mobile menu toggle on desktop screens', async function() {
      // Resize to desktop viewport
      await driverManager.driver.manage().window().setRect({ width: 1920, height: 1080 });
      
      // Check if navbar items are visible
      const navbarNav = await driverManager.waitForElement(By.id('navbarNav'));
      expect(await navbarNav.isDisplayed()).to.be.true;
    });
  });
});
