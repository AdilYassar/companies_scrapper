const StaticScraper = require('../strategies/StaticScraper');

class TestScraper extends StaticScraper {
  constructor(config) {
    super({
      baseUrl: 'https://httpbin.org',
      selectors: {
        company: '.company-item, .result-item',
        company_name: '.company-name, .title',
        website: '.website a',
        email: '.email',
        phone: '.phone'
      },
      ...config
    });
    
    this.testData = [
      {
        company_name: 'Test Company 1',
        website: 'https://example1.com',
        email: 'contact@example1.com',
        phone: '+1234567890',
        address: '123 Test Street, Test City',
        country: 'IT'
      },
      {
        company_name: 'Test Company 2', 
        website: 'https://example2.com',
        email: 'info@example2.com',
        phone: '+0987654321',
        address: '456 Demo Avenue, Demo City',
        country: 'RO'
      }
    ];
  }
  
  async scrape() {
    try {
      this.log('info', 'Starting test scraping with mock data');
      
      // Simulate some processing time
      await this.sleep(1000);
      
      // Return test data
      this.results = this.testData.map(company => this.normalizeCompanyData(company));
      
      this.log('info', 'Test scraping completed', {
        total_companies: this.results.length
      });
      
      return this.results;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
}

module.exports = TestScraper;
