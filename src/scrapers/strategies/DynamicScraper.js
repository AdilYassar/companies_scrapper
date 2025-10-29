const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const BaseScraper = require('../base/BaseScraper');

// Add stealth plugin
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

class DynamicScraper extends BaseScraper {
  constructor(config) {
    super(config);
    this.baseUrl = config.baseUrl;
    this.selectors = config.selectors || {};
    this.browser = null;
    this.page = null;
    this.waitForSelector = config.waitForSelector || '.company, .listing-item';
    this.scrollDelay = config.scrollDelay || 1000;
  }
  
  async scrape() {
    try {
      this.log('info', `Starting dynamic scraping of ${this.baseUrl}`);
      
      await this.launchBrowser();
      const companies = await this.scrapePage();
      
      this.results = companies.map(company => this.normalizeCompanyData(company));
      
      this.log('info', `Dynamic scraping completed`, {
        companies_found: this.results.length
      });
      
      return this.results;
    } catch (error) {
      this.handleError(error, { url: this.baseUrl });
      throw error;
    } finally {
      await this.closeBrowser();
    }
  }
  
  async launchBrowser() {
    try {
      // Get proxy configuration for the country
      const proxy = this.getPuppeteerProxy(this.config.country || 'IT');
      
      const browserOptions = {
        headless: this.config.puppeteerHeadless !== false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          ...(this.config.puppeteerArgs || [])
        ]
      };
      
      // Add proxy configuration if available
      if (proxy) {
        browserOptions.proxy = proxy;
        this.log('info', `Using proxy for ${this.config.country}: ${proxy.server}`);
      }
      
      this.browser = await puppeteer.launch(browserOptions);
      
      if (!this.browser) {
        throw new Error('Failed to launch browser - browser object is null');
      }
      
      this.page = await this.browser.newPage();
      
      if (!this.page) {
        throw new Error('Failed to create new page - page object is null');
      }
      
      // Set user agent
      await this.page.setUserAgent(
        this.config.userAgent || 
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );
      
      // Set viewport
      await this.page.setViewport({ width: 1920, height: 1080 });
      
      // Set extra headers
      if (this.config.headers) {
        await this.page.setExtraHTTPHeaders(this.config.headers);
      }
      
      this.log('info', 'Browser launched successfully');
      
    } catch (error) {
      this.log('error', 'Failed to launch browser', { error: error.message });
      throw new Error(`Browser initialization failed: ${error.message}`);
    }
  }
  
  async scrapePage() {
    try {
      if (!this.page) {
        throw new Error('Page not initialized - browser may have failed to launch');
      }

      // Try multiple navigation strategies
      let navigationSuccess = false;
      const navigationStrategies = [
        { waitUntil: 'domcontentloaded', timeout: 15000 },
        { waitUntil: 'load', timeout: 20000 },
        { waitUntil: 'networkidle0', timeout: 25000 }
      ];

      for (const strategy of navigationStrategies) {
        try {
          await this.page.goto(this.baseUrl, strategy);
          navigationSuccess = true;
          this.log('info', `Navigation successful with strategy: ${strategy.waitUntil}`);
          break;
        } catch (error) {
          this.log('warn', `Navigation failed with ${strategy.waitUntil}, trying next strategy`);
          continue;
        }
      }

      if (!navigationSuccess) {
        throw new Error('All navigation strategies failed');
      }
      
      // Wait for content to load with fallback
      try {
        await this.page.waitForSelector(this.waitForSelector, { timeout: 10000 });
      } catch (selectorError) {
        this.log('warn', `Selector ${this.waitForSelector} not found, trying alternative selectors`);
        // Try alternative selectors
        const alternativeSelectors = ['.company', '.vcard', '.listing-item', '.result', '.item'];
        let found = false;
        for (const selector of alternativeSelectors) {
          try {
            await this.page.waitForSelector(selector, { timeout: 2000 });
            found = true;
            break;
          } catch (e) {
            continue;
          }
        }
        if (!found) {
          this.log('warn', 'No company elements found on page');
          return [];
        }
      }
      
      // Scroll to load more content if needed
      await this.scrollToLoadContent();
      
      // Extract company data with multiple selector strategies
      const companies = await this.page.evaluate((selectors) => {
        const companies = [];
        
        // Try multiple company container selectors
        const containerSelectors = [
          '.company', '.vcard', '.listing-item', '.result', '.item',
          '.company-item', '.firma-item', '.search-result', '.company-result',
          '.business', '.enterprise', '.firm', '.organization'
        ];
        
        let companyElements = [];
        for (const selector of containerSelectors) {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            companyElements = elements;
            console.log(`Found ${elements.length} companies using selector: ${selector}`);
            break;
          }
        }
        
        companyElements.forEach((element, index) => {
          try {
            const company = {};
            
            // Extract company name with multiple selectors
            const nameSelectors = [
              selectors.company_name || '.company-name, .fn, h3, .title, .name',
              '.business-name', '.firm-name', '.enterprise-name',
              'h1', 'h2', 'h3', 'h4', '.heading'
            ];
            
            for (const nameSelector of nameSelectors) {
              const nameElement = element.querySelector(nameSelector);
              if (nameElement && nameElement.textContent.trim()) {
                company.company_name = nameElement.textContent.trim();
                break;
              }
            }
            
            // Extract other fields with fallback selectors
            company.legal_name = this.extractText(element, selectors.legal_name || '.legal-name, .official-name');
            company.tax_id = this.extractText(element, selectors.tax_id || '.tax-id, .partita-iva, .cui, .vat-number');
            company.website = this.extractHref(element, selectors.website || '.website, .url a, .site a, a[href*="http"]');
            company.email = this.extractText(element, selectors.email || '.email, .contact-email, .mail, a[href^="mailto:"]');
            company.phone = this.extractText(element, selectors.phone || '.phone, .tel, .telephone, a[href^="tel:"]');
            company.address = this.extractText(element, selectors.address || '.address, .adr, .location, .street');
            company.city = this.extractText(element, selectors.city || '.city, .locality, .town');
            company.description = this.extractText(element, selectors.description || '.description, .summary, .about, .info');
            
            // Try to extract any additional information
            company.industry = this.extractText(element, '.industry, .sector, .category, .type');
            company.employees = this.extractText(element, '.employees, .staff, .size');
            company.founded = this.extractText(element, '.founded, .established, .year');
            company.revenue = this.extractText(element, '.revenue, .turnover, .sales');
            
            if (company.company_name && company.company_name.length > 2) {
              companies.push(company);
            }
          } catch (error) {
            console.warn(`Failed to parse company element ${index}:`, error);
          }
        });
        
        console.log(`Extracted ${companies.length} companies total`);
        return companies;
      }, this.selectors);
      
      return companies;
    } catch (error) {
      this.log('error', 'Failed to scrape page', { error: error.message, url: this.baseUrl });
      throw error;
    }
  }
  
  async scrollToLoadContent() {
    let previousHeight = 0;
    let currentHeight = await this.page.evaluate('document.body.scrollHeight');
    
    while (currentHeight > previousHeight) {
      previousHeight = currentHeight;
      
      // Scroll down
      await this.page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      
      // Wait for content to load
      await this.sleep(this.scrollDelay);
      
      // Check if new content loaded
      currentHeight = await this.page.evaluate('document.body.scrollHeight');
    }
  }
  
  async scrapeWithPagination(maxPages = 10) {
    const allCompanies = [];
    let currentPage = 1;
    let hasNextPage = true;
    
    while (hasNextPage && currentPage <= maxPages) {
      try {
        const pageUrl = this.buildPageUrl(this.baseUrl, currentPage);
        this.log('info', `Scraping page ${currentPage}`, { url: pageUrl });
        
        await this.page.goto(pageUrl, { waitUntil: 'networkidle2' });
        await this.scrollToLoadContent();
        
        const companies = await this.scrapePage();
        allCompanies.push(...companies);
        
        // Check for next page
        hasNextPage = await this.page.evaluate(() => {
          return document.querySelector('.next, .pagination-next, [rel="next"]') !== null;
        });
        
        currentPage++;
        await this.sleep(2000); // Rate limiting
        
      } catch (error) {
        this.log('error', `Failed to scrape page ${currentPage}`, { error: error.message });
        hasNextPage = false;
      }
    }
    
    return allCompanies;
  }
  
  buildPageUrl(baseUrl, page) {
    if (baseUrl.includes('?')) {
      return `${baseUrl}&page=${page}`;
    }
    return `${baseUrl}?page=${page}`;
  }
  
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
  
  // Helper methods for text extraction
  extractText(element, selector) {
    if (!selector || !element) return null;
    try {
      const found = element.querySelector(selector);
      return found ? found.textContent.trim() : null;
    } catch (error) {
      return null;
    }
  }
  
  extractHref(element, selector) {
    if (!selector || !element) return null;
    try {
      const found = element.querySelector(selector);
      return found ? found.href : null;
    } catch (error) {
      return null;
    }
  }
}

module.exports = DynamicScraper;
