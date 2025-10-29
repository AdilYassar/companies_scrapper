const axios = require('axios');
const BaseScraper = require('../base/BaseScraper');

class ApiScraper extends BaseScraper {
  constructor(config) {
    super(config);
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.endpoint = config.endpoint;
    this.headers = {
      'Content-Type': 'application/json',
      ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      ...config.headers
    };
  }
  
  async scrape() {
    try {
      this.log('info', `Starting API scraping of ${this.baseUrl}`);
      
      const companies = await this.fetchFromApi();
      
      this.results = companies.map(company => this.normalizeCompanyData(company));
      
      this.log('info', `API scraping completed`, {
        companies_found: this.results.length
      });
      
      return this.results;
    } catch (error) {
      this.handleError(error, { url: this.baseUrl });
      throw error;
    }
  }
  
  async fetchFromApi() {
    const url = this.endpoint || this.baseUrl;
    
    const response = await this.retry(async () => {
      return await axios.get(url, {
        headers: this.headers,
        timeout: this.config.timeout || 30000,
        params: this.buildApiParams()
      });
    });
    
    if (response.status !== 200) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return this.parseApiResponse(response.data);
  }
  
  buildApiParams() {
    // Override in subclasses for specific API parameters
    return this.config.params || {};
  }
  
  parseApiResponse(data) {
    // Default parsing - override in subclasses for specific API formats
    if (Array.isArray(data)) {
      return data;
    }
    
    if (data.results && Array.isArray(data.results)) {
      return data.results;
    }
    
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }
    
    // Try to find companies in nested objects
    const findCompanies = (obj) => {
      if (Array.isArray(obj)) {
        return obj;
      }
      
      if (typeof obj === 'object' && obj !== null) {
        for (const value of Object.values(obj)) {
          if (Array.isArray(value)) {
            return value;
          }
        }
      }
      
      return [];
    };
    
    return findCompanies(data);
  }
  
  // Method for paginated API calls
  async scrapeWithPagination(maxPages = 10) {
    const allCompanies = [];
    let currentPage = 1;
    let hasNextPage = true;
    
    while (hasNextPage && currentPage <= maxPages) {
      try {
        this.log('info', `Fetching API page ${currentPage}`);
        
        const response = await this.fetchApiPage(currentPage);
        const companies = this.parseApiResponse(response);
        
        allCompanies.push(...companies);
        
        // Check if there are more pages
        hasNextPage = this.hasNextPage(response, companies);
        currentPage++;
        
        // Rate limiting
        await this.sleep(1000);
        
      } catch (error) {
        this.log('error', `Failed to fetch API page ${currentPage}`, { error: error.message });
        hasNextPage = false;
      }
    }
    
    return allCompanies;
  }
  
  async fetchApiPage(page) {
    const params = {
      ...this.buildApiParams(),
      page,
      limit: this.config.pageSize || 50
    };
    
    const response = await this.retry(async () => {
      return await axios.get(this.endpoint || this.baseUrl, {
        headers: this.headers,
        params,
        timeout: this.config.timeout || 30000
      });
    });
    
    return response.data;
  }
  
  hasNextPage(response, companies) {
    // Check if there are more pages based on response structure
    if (response.pagination) {
      return response.pagination.hasNext || response.pagination.page < response.pagination.totalPages;
    }
    
    if (response.meta) {
      return response.meta.current_page < response.meta.total_pages;
    }
    
    // If we got fewer results than expected, probably no more pages
    return companies.length >= (this.config.pageSize || 50);
  }
  
  // Method for authenticated API calls
  async authenticate() {
    if (!this.config.authEndpoint || !this.config.authCredentials) {
      return;
    }
    
    try {
      const response = await axios.post(this.config.authEndpoint, this.config.authCredentials, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.data.token) {
        this.headers.Authorization = `Bearer ${response.data.token}`;
        this.log('info', 'API authentication successful');
      }
    } catch (error) {
      this.log('error', 'API authentication failed', { error: error.message });
      throw error;
    }
  }
}

module.exports = ApiScraper;
