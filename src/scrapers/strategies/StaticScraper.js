const cheerio = require('cheerio');
const axios = require('axios');
const BaseScraper = require('../base/BaseScraper');

class StaticScraper extends BaseScraper {
  constructor(config) {
    super(config);
    this.baseUrl = config.baseUrl;
    this.selectors = config.selectors || {};
    this.headers = config.headers || {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };
  }
  
  async scrape() {
    try {
      this.log('info', `Starting static scraping of ${this.baseUrl}`);
      
      const html = await this.fetchPage(this.baseUrl);
      const companies = await this.parse(html);
      
      this.results = companies.map(company => this.normalizeCompanyData(company));
      
      this.log('info', `Static scraping completed`, {
        companies_found: this.results.length
      });
      
      return this.results;
    } catch (error) {
      this.handleError(error, { url: this.baseUrl });
      throw error;
    }
  }
  
  async fetchPage(url, options = {}) {
    return this.retry(async () => {
      // Get proxy configuration for the country
      const proxy = this.getAxiosProxy(this.config.country || 'IT');
      
      const requestConfig = {
        headers: this.headers,
        timeout: this.config.timeout || 30000,
        ...options
      };
      
      // Add proxy if configured
      if (proxy) {
        requestConfig.proxy = proxy;
        this.log('info', `Using proxy for ${this.config.country}: ${proxy.host}:${proxy.port}`);
      }
      
      const response = await axios.get(url, requestConfig);
      
      if (response.status !== 200) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.data;
    });
  }
  
  async parse(html) {
    const $ = cheerio.load(html);
    const companies = [];
    
    // Default selectors for common patterns
    const companyElements = $(this.selectors.company || '.company, .vcard, .listing-item');
    
    companyElements.each((index, element) => {
      try {
        const company = this.extractCompanyData($, $(element));
        if (company && company.company_name) {
          companies.push(company);
        }
      } catch (error) {
        this.log('warn', 'Failed to parse company element', { error: error.message, index });
      }
    });
    
    return companies;
  }
  
  extractCompanyData($, $element) {
    const company = {};
    
    // Extract basic company information
    company.company_name = this.extractText($element, this.selectors.company_name || '.company-name, .fn, h3');
    company.legal_name = this.extractText($element, this.selectors.legal_name || '.legal-name');
    company.tax_id = this.extractText($element, this.selectors.tax_id || '.tax-id, .partita-iva, .cui');
    company.website = this.extractHref($element, this.selectors.website || '.website, .url a');
    company.email = this.extractText($element, this.selectors.email || '.email, .contact-email');
    company.phone = this.extractText($element, this.selectors.phone || '.phone, .tel');
    company.address = this.extractText($element, this.selectors.address || '.address, .adr');
    company.city = this.extractText($element, this.selectors.city || '.city, .locality');
    company.description = this.extractText($element, this.selectors.description || '.description, .summary');
    
    // Extract source information
    company.source_platform = this.name.toLowerCase();
    company.source_url = this.baseUrl;
    
    return company;
  }
  
  extractText($element, selector) {
    if (!selector) return null;
    const text = $element.find(selector).first().text();
    return text ? text.trim() : null;
  }
  
  extractHref($element, selector) {
    if (!selector) return null;
    const href = $element.find(selector).first().attr('href');
    return href ? href.trim() : null;
  }
  
  // Method to scrape multiple pages with pagination
  async scrapeWithPagination(baseUrl, maxPages = 10) {
    const allCompanies = [];
    let currentPage = 1;
    let hasNextPage = true;
    
    while (hasNextPage && currentPage <= maxPages) {
      try {
        const pageUrl = this.buildPageUrl(baseUrl, currentPage);
        this.log('info', `Scraping page ${currentPage}`, { url: pageUrl });
        
        const html = await this.fetchPage(pageUrl);
        const companies = await this.parse(html);
        
        allCompanies.push(...companies);
        
        // Check if there's a next page
        hasNextPage = this.hasNextPage(html);
        currentPage++;
        
        // Rate limiting
        await this.sleep(2000);
        
      } catch (error) {
        this.log('error', `Failed to scrape page ${currentPage}`, { error: error.message });
        hasNextPage = false;
      }
    }
    
    return allCompanies;
  }
  
  buildPageUrl(baseUrl, page) {
    // Override this method in subclasses for specific pagination patterns
    if (baseUrl.includes('?')) {
      return `${baseUrl}&page=${page}`;
    }
    return `${baseUrl}?page=${page}`;
  }
  
  hasNextPage(html) {
    const $ = cheerio.load(html);
    // Look for common "next page" indicators
    return $('.next, .pagination-next, [rel="next"]').length > 0;
  }
}

module.exports = StaticScraper;
