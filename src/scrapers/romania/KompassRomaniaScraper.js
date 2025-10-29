const DynamicScraper = require('../strategies/DynamicScraper');

class KompassRomaniaScraper extends DynamicScraper {
  constructor(config) {
    super({
      baseUrl: 'https://ro.kompass.com',
      selectors: {
        company: '.company-item, .result-item, .listing-item',
        company_name: '.company-name, .business-name, h3, .title',
        address: '.address, .location, .street',
        phone: '.phone, .tel, .telephone',
        website: '.website a, .url a, a[href*="http"]',
        email: '.email, .mail, a[href^="mailto:"]',
        description: '.description, .summary, .about'
      },
      waitForSelector: '.company-item, .result-item, .listing-item',
      ...config
    });
    
    this.categories = config.categories || [
      'software-development',
      'it-consulting',
      'web-development', 
      'mobile-apps',
      'digital-marketing'
    ];
    
    this.cities = config.cities || ['București', 'Cluj-Napoca', 'Timișoara', 'Iași'];
    this.maxPages = config.maxPages || 5;
  }
  
  async scrape() {
    try {
      this.log('info', 'Starting Kompass Romania scraping', {
        categories: this.categories,
        cities: this.cities
      });
      
      const allCompanies = [];
      
      for (const category of this.categories) {
        for (const city of this.cities) {
          this.log('info', `Scraping ${category} in ${city}`);
          
          const searchUrl = `${this.baseUrl}/search/${category}/${city}`;
          const companies = await this.scrapeCategory(category, city, searchUrl);
          allCompanies.push(...companies);
          
          await this.sleep(3000);
        }
      }
      
      this.results = allCompanies.map(company => this.normalizeCompanyData(company));
      
      this.log('info', 'Kompass Romania scraping completed', {
        total_companies: this.results.length
      });
      
      return this.results;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async scrapeCategory(category, city, baseUrl) {
    const companies = [];
    
    try {
      await this.launchBrowser();
      await this.page.goto(baseUrl, { waitUntil: 'networkidle2' });
      
      // Wait for results
      await this.page.waitForSelector('.company-item, .result-item', { timeout: 10000 });
      
      // Extract companies
      const pageCompanies = await this.page.evaluate(() => {
        const companies = [];
        const elements = document.querySelectorAll('.company-item, .result-item, .listing-item');
        
        elements.forEach(element => {
          const company = {};
          company.company_name = element.querySelector('.company-name, .business-name, h3')?.textContent?.trim();
          company.address = element.querySelector('.address, .location')?.textContent?.trim();
          company.phone = element.querySelector('.phone, .tel')?.textContent?.trim();
          company.website = element.querySelector('.website a, .url a')?.href;
          company.email = element.querySelector('.email, a[href^="mailto:"]')?.textContent?.trim();
          company.description = element.querySelector('.description, .summary')?.textContent?.trim();
          company.source_platform = 'kompass_romania';
          company.country = 'RO';
          
          if (company.company_name) {
            companies.push(company);
          }
        });
        
        return companies;
      });
      
      companies.push(...pageCompanies);
      
    } catch (error) {
      this.log('warn', `Failed to scrape category ${category} in ${city}`, { error: error.message });
    }
    
    return companies;
  }
}

module.exports = KompassRomaniaScraper;
