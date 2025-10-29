const ApiScraper = require('../strategies/ApiScraper');

class CrunchbaseScraper extends ApiScraper {
  constructor(config) {
    super({
      baseUrl: 'https://api.crunchbase.com',
      endpoint: '/api/v4/entities/organizations',
      apiKey: config.apiKey,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      ...config
    });
    
    this.countries = config.countries || ['Italy', 'Romania'];
    this.maxPages = config.maxPages || 3;
  }
  
  async scrape() {
    try {
      this.log('info', 'Starting Crunchbase API scraping', {
        countries: this.countries
      });
      
      const allCompanies = [];
      
      for (const country of this.countries) {
        this.log('info', `Scraping country: ${country}`);
        
        const companies = await this.scrapeCountry(country);
        allCompanies.push(...companies);
        
        // Rate limiting between countries
        await this.sleep(5000);
      }
      
      this.results = allCompanies.map(company => this.normalizeCompanyData(company));
      
      this.log('info', 'Crunchbase scraping completed', {
        total_companies: this.results.length,
        countries_scraped: this.countries.length
      });
      
      return this.results;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async scrapeCountry(country) {
    const companies = [];
    
    try {
      // Build API parameters for country search
      const params = this.buildCountryParams(country);
      
      // Fetch companies from API
      const response = await this.fetchCountryData(params);
      const countryCompanies = this.parseApiResponse(response);
      
      companies.push(...countryCompanies);
      
    } catch (error) {
      this.log('warn', `Failed to scrape country ${country}`, { error: error.message });
    }
    
    return companies;
  }
  
  buildCountryParams(country) {
    return {
      location_identifiers: country,
      organization_types: ['company'],
      categories: ['software', 'information_technology'],
      limit: 100,
      offset: 0
    };
  }
  
  async fetchCountryData(params) {
    const url = `${this.endpoint}/search`;
    
    const response = await this.retry(async () => {
      return await axios.get(url, {
        headers: this.headers,
        params,
        timeout: this.config.timeout || 30000
      });
    });
    
    return response.data;
  }
  
  parseApiResponse(data) {
    // Crunchbase API response structure
    if (data.entities && Array.isArray(data.entities)) {
      return data.entities.map(entity => this.parseCompanyData(entity));
    }
    
    if (data.results && Array.isArray(data.results)) {
      return data.results.map(result => this.parseCompanyData(result));
    }
    
    return [];
  }
  
  parseCompanyData(entity) {
    const properties = entity.properties || {};
    
    return {
      company_name: properties.name,
      legal_name: properties.name,
      description: properties.short_description,
      website: properties.website,
      founded_year: properties.founded_on?.year,
      headquarters: properties.headquarters?.city,
      country: properties.headquarters?.country,
      industry: properties.categories?.[0],
      employee_count: properties.num_employees,
      funding_total: properties.total_funding_usd,
      last_funding_date: properties.last_funding_date,
      linkedin_url: properties.linkedin,
      twitter_url: properties.twitter,
      facebook_url: properties.facebook,
      source_platform: 'crunchbase',
      source_url: `https://www.crunchbase.com/organization/${properties.identifier}`,
      country: this.mapCountryCode(properties.headquarters?.country)
    };
  }
  
  mapCountryCode(countryName) {
    const countryMap = {
      'Italy': 'IT',
      'Romania': 'RO',
      'United States': 'US',
      'United Kingdom': 'GB'
    };
    
    return countryMap[countryName] || countryName;
  }
  
  // Override normalizeCompanyData for Crunchbase specifics
  normalizeCompanyData(rawData) {
    const normalized = super.normalizeCompanyData(rawData);
    
    // Parse employee count
    if (rawData.employee_count) {
      normalized.employee_count = this.parseEmployeeCount(rawData.employee_count);
      normalized.company_size = this.categorizeCompanySize(normalized.employee_count);
    }
    
    // Parse funding information
    if (rawData.funding_total) {
      normalized.funding_total = this.parseFundingAmount(rawData.funding_total);
    }
    
    // Parse founded year
    if (rawData.founded_year) {
      normalized.founded_year = rawData.founded_year;
    }
    
    // Parse headquarters
    if (rawData.headquarters) {
      normalized.city = rawData.headquarters;
    }
    
    // Set industry
    if (rawData.industry) {
      normalized.industry = rawData.industry;
    }
    
    return normalized;
  }
  
  parseEmployeeCount(employeeData) {
    if (typeof employeeData === 'number') {
      return employeeData;
    }
    
    if (typeof employeeData === 'string') {
      // Extract number from text like "51-200 employees"
      const match = employeeData.match(/(\d+)/);
      return match ? parseInt(match[1]) : null;
    }
    
    return null;
  }
  
  categorizeCompanySize(employeeCount) {
    if (!employeeCount) return null;
    
    if (employeeCount <= 10) return '1-10';
    if (employeeCount <= 50) return '11-50';
    if (employeeCount <= 200) return '51-200';
    if (employeeCount <= 500) return '201-500';
    if (employeeCount <= 1000) return '501-1000';
    return '1001+';
  }
  
  parseFundingAmount(fundingData) {
    if (typeof fundingData === 'number') {
      return fundingData;
    }
    
    if (typeof fundingData === 'string') {
      // Extract number from text like "$1.5M" or "$1,500,000"
      const match = fundingData.match(/[\d,]+/);
      if (match) {
        return parseInt(match[0].replace(/,/g, ''));
      }
    }
    
    return null;
  }
}

module.exports = CrunchbaseScraper;
