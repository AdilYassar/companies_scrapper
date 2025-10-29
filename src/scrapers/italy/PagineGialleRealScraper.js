const StaticScraper = require('../strategies/StaticScraper');

class PagineGialleRealScraper extends StaticScraper {
  constructor(config) {
    super({
      baseUrl: 'https://www.paginegialle.it',
      selectors: {
        company: '.search-itm',
        company_name: '.search-itm__rag',
        category: '.search-itm__category',
        address: '.search-itm__adr',
        description: '.search-itm__dsc',
        phone: '.search-itm__tel',
        website: '.search-itm__web a',
        email: '.search-itm__email'
      },
      ...config
    });
    
    this.categories = config.categories || [
      'software-house',
      'sviluppo-software',
      'consulenza-informatica',
      'web-agency',
      'sviluppo-app-mobile'
    ];
    
    this.cities = config.cities || ['Milano', 'Roma', 'Torino', 'Bologna', 'Firenze'];
    this.maxPages = config.maxPages || 5;
  }
  
  async scrape() {
    try {
      this.log('info', 'Starting Pagine Gialle REAL scraping', {
        categories: this.categories,
        cities: this.cities
      });
      
      const allCompanies = [];
      
      for (const category of this.categories) {
        for (const city of this.cities) {
          this.log('info', `Scraping ${category} in ${city}`);
          
          const searchUrl = `${this.baseUrl}/ricerca/${category}/${city.toLowerCase()}`;
          const companies = await this.scrapeCategory(category, city, searchUrl);
          allCompanies.push(...companies);
          
          await this.sleep(3000);
        }
      }
      
      this.results = allCompanies.map(company => this.normalizeCompanyData(company));
      
      this.log('info', 'Pagine Gialle REAL scraping completed', {
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
      const html = await this.fetchPage(baseUrl);
      const $ = require('cheerio').load(html);
      
      $('.search-itm').each((index, element) => {
        try {
          const company = this.extractCompanyData($, $(element), baseUrl);
          if (company && company.company_name) {
            companies.push(company);
          }
        } catch (error) {
          this.log('warn', 'Failed to parse company element', { error: error.message, index });
        }
      });
      
    } catch (error) {
      this.log('warn', `Failed to scrape category ${category} in ${city}`, { error: error.message });
    }
    
    return companies;
  }
  
  extractCompanyData($, $element, sourceUrl) {
    const company = {};
    
    // Extract company name
    company.company_name = $element.find('.search-itm__rag').text().trim();
    
    // Extract category
    company.category = $element.find('.search-itm__category').text().trim();
    
    // Extract address
    company.address = $element.find('.search-itm__adr').text().trim();
    
    // Extract description
    company.description = $element.find('.search-itm__dsc').text().trim();
    
    // Extract phone
    company.phone = $element.find('.search-itm__tel').text().trim();
    
    // Extract website
    company.website = $element.find('.search-itm__web a').attr('href');
    
    // Extract email
    company.email = $element.find('.search-itm__email').text().trim();
    
    // Set source information
    company.source_platform = 'pagine_gialle';
    company.source_url = sourceUrl;
    company.country = 'IT';
    
    return company;
  }
}

module.exports = PagineGialleRealScraper;
