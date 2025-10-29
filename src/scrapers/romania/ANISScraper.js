const DynamicScraper = require('../strategies/DynamicScraper');

class ANISScraper extends DynamicScraper {
  constructor(config) {
    super({
      baseUrl: 'https://www.anis.ro',
      selectors: {
        company: '.member-item, .company-card, .result-item',
        company_name: '.member-name, .company-name, h3, .title',
        website: '.website a, .url a, a[href*="http"]',
        email: '.email, .mail, a[href^="mailto:"]',
        phone: '.phone, .tel, .telephone',
        address: '.address, .location, .street',
        description: '.description, .summary, .about',
        industry: '.industry, .sector, .category'
      },
      waitForSelector: '.member-item, .company-card, .result-item',
      ...config
    });
    
    this.categories = config.categories || [
      'software-development',
      'it-services',
      'consulting',
      'outsourcing',
      'digital-transformation'
    ];
    
    this.maxPages = config.maxPages || 3;
  }
  
  async scrape() {
    try {
      this.log('info', 'Starting ANIS scraping', {
        categories: this.categories
      });
      
      const allCompanies = [];
      
      for (const category of this.categories) {
        this.log('info', `Scraping ${category} members`);
        
        const searchUrl = `${this.baseUrl}/en/members/${category}`;
        const companies = await this.scrapeCategory(category, searchUrl);
        allCompanies.push(...companies);
        
        await this.sleep(2000);
      }
      
      this.results = allCompanies.map(company => this.normalizeCompanyData(company));
      
      this.log('info', 'ANIS scraping completed', {
        total_companies: this.results.length
      });
      
      return this.results;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async scrapeCategory(category, baseUrl) {
    const companies = [];
    
    try {
      await this.launchBrowser();
      await this.page.goto(baseUrl, { waitUntil: 'networkidle2' });
      
      // Wait for results
      await this.page.waitForSelector('.member-item, .company-card', { timeout: 10000 });
      
      // Extract companies
      const pageCompanies = await this.page.evaluate(() => {
        const companies = [];
        const elements = document.querySelectorAll('.member-item, .company-card, .result-item');
        
        elements.forEach(element => {
          const company = {};
          company.company_name = element.querySelector('.member-name, .company-name, h3')?.textContent?.trim();
          company.website = element.querySelector('.website a, .url a')?.href;
          company.email = element.querySelector('.email, a[href^="mailto:"]')?.textContent?.trim();
          company.phone = element.querySelector('.phone, .tel')?.textContent?.trim();
          company.address = element.querySelector('.address, .location')?.textContent?.trim();
          company.description = element.querySelector('.description, .summary')?.textContent?.trim();
          company.industry = element.querySelector('.industry, .sector')?.textContent?.trim();
          company.source_platform = 'anis';
          company.country = 'RO';
          
          if (company.company_name) {
            companies.push(company);
          }
        });
        
        return companies;
      });
      
      companies.push(...pageCompanies);
      
    } catch (error) {
      this.log('warn', `Failed to scrape category ${category}`, { error: error.message });
    }
    
    return companies;
  }
}

module.exports = ANISScraper;