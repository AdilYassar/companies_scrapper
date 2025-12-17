const { Builder, By, Key, until, WebDriver } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

class WebDriverManager {
  constructor() {
    this.driver = null;
    this.browser = process.env.BROWSER || 'chrome';
    this.headless = process.env.HEADLESS === 'true';
    this.baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  }

  async initDriver() {
    let options;
    
    switch (this.browser.toLowerCase()) {
      case 'firefox':
        options = new firefox.Options();
        if (this.headless) {
          options.addArguments('--headless');
        }
        this.driver = await new Builder()
          .forBrowser('firefox')
          .setFirefoxOptions(options)
          .build();
        break;
        
      case 'chrome':
      default:
        options = new chrome.Options();
        if (this.headless) {
          options.addArguments('--headless');
        }
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--disable-gpu');
        options.addArguments('--window-size=1920,1080');
        
        this.driver = await new Builder()
          .forBrowser('chrome')
          .setChromeOptions(options)
          .build();
        break;
    }
    
    await this.driver.manage().setTimeouts({
      implicit: 10000,
      pageLoad: 30000,
      script: 30000
    });
    
    return this.driver;
  }

  async quitDriver() {
    if (this.driver) {
      await this.driver.quit();
      this.driver = null;
    }
  }

  async navigateToPage(path = '') {
    const url = `${this.baseUrl}${path}`;
    await this.driver.get(url);
    await this.driver.wait(until.elementLocated(By.tagName('body')), 10000);
  }

  async waitForElement(locator, timeout = 10000) {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }

  async waitForElementVisible(locator, timeout = 10000) {
    const element = await this.waitForElement(locator, timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    return element;
  }

  async clickElement(locator) {
    const element = await this.waitForElementVisible(locator);
    await this.driver.wait(until.elementIsEnabled(element), 5000);
    await element.click();
    return element;
  }

  async typeInElement(locator, text) {
    const element = await this.waitForElementVisible(locator);
    await element.clear();
    await element.sendKeys(text);
    return element;
  }

  async getElementText(locator) {
    const element = await this.waitForElement(locator);
    return await element.getText();
  }

  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  async getPageTitle() {
    return await this.driver.getTitle();
  }

  async takeScreenshot(filename) {
    const screenshot = await this.driver.takeScreenshot();
    const fs = require('fs');
    fs.writeFileSync(`screenshots/${filename}`, screenshot, 'base64');
  }

  async isElementPresent(locator) {
    try {
      await this.driver.findElement(locator);
      return true;
    } catch (error) {
      return false;
    }
  }

  async scrollToElement(locator) {
    const element = await this.waitForElement(locator);
    await this.driver.executeScript('arguments[0].scrollIntoView(true);', element);
    return element;
  }
}

module.exports = WebDriverManager;
