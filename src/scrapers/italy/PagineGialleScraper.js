const StaticScraper = require('../strategies/StaticScraper');

class PagineGialleScraper extends StaticScraper {
  constructor(config) {
    super({
      baseUrl: 'https://www.paginegialle.it',
      selectors: {
        company: '.vcard, .listing-item, .result-item, .company-card',
        company_name: '.fn, .company-name, .business-name, h3, .title',
        address: '.adr, .address, .location',
        phone: '.tel, .phone, .telephone',
        website: '.url a, .website a, a[href*="http"]',
        description: '.summary, .description, .about'
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
      this.log('info', 'Starting Pagine Gialle scraping', {
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
          
          // Rate limiting between searches
          await this.sleep(3000);
        }
      }
      
      this.results = allCompanies.map(company => this.normalizeCompanyData(company));
      
      this.log('info', 'Pagine Gialle scraping completed', {
        total_companies: this.results.length,
        categories_scraped: this.categories.length,
        cities_scraped: this.cities.length
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
      // Scrape first page
      const firstPageCompanies = await this.scrapePage(baseUrl);
      companies.push(...firstPageCompanies);
      
      // Scrape additional pages if available
      for (let page = 2; page <= this.maxPages; page++) {
        const pageUrl = `${baseUrl}?page=${page}`;
        const pageCompanies = await this.scrapePage(pageUrl);
        
        if (pageCompanies.length === 0) {
          break; // No more pages
        }
        
        companies.push(...pageCompanies);
        await this.sleep(2000); // Rate limiting
      }
      
    } catch (error) {
      this.log('warn', `Failed to scrape category ${category} in ${city}`, { error: error.message });
    }
    
    return companies;
  }
  
  async scrapePage(url) {
    const html = await this.fetchPage(url);
    const $ = require('cheerio').load(html);
    const companies = [];
    
    $('.vcard').each((index, element) => {
      try {
        const company = this.extractCompanyData($, $(element), url);
        if (company && company.company_name) {
          companies.push(company);
        }
      } catch (error) {
        this.log('warn', 'Failed to parse company element', { error: error.message, index });
      }
    });
    
    return companies;
  }
  
  extractCompanyData($, $element, sourceUrl) {
    const company = {};
    
    // Extract company name
    company.company_name = $element.find('.fn').text().trim();
    
    // Extract address
    const addressText = $element.find('.adr').text().trim();
    company.address = addressText;
    company.city = this.extractCityFromAddress(addressText);
    
    // Extract phone
    company.phone = $element.find('.tel').text().trim();
    
    // Extract website
    const websiteElement = $element.find('.url a');
    company.website = websiteElement.attr('href');
    
    // Extract description
    company.description = $element.find('.summary').text().trim();
    
    // Set source information
    company.source_platform = 'pagine_gialle';
    company.source_url = sourceUrl;
    company.country = 'IT';
    
    // Extract additional details if available
    company.industry = this.categorizeIndustry($element);
    
    return company;
  }
  
  extractCityFromAddress(address) {
    if (!address) return null;
    
    // Try to extract city from Italian address format
    // Look for pattern: "CAP City" (e.g., "20100 Milano")
    const cityMatch = address.match(/\d{5}\s+([A-Za-zàèéìòù\s]+)/);
    if (cityMatch) {
      return cityMatch[1].trim();
    }
    
    // Fallback: look for common Italian city names
    const italianCities = ['Milano', 'Roma', 'Torino', 'Bologna', 'Firenze', 'Napoli', 'Venezia'];
    for (const city of italianCities) {
      if (address.includes(city)) {
        return city;
      }
    }
    
    return null;
  }
  
  categorizeIndustry($element) {
    // Try to determine industry from company name or description
    const text = ($element.find('.fn').text() + ' ' + $element.find('.summary').text()).toLowerCase();
    
    if (text.includes('software') || text.includes('sviluppo')) {
      return 'Software Development';
    }
    if (text.includes('consulenza') || text.includes('consulting')) {
      return 'IT Consulting';
    }
    if (text.includes('web') || text.includes('digital')) {
      return 'Web Development';
    }
    if (text.includes('mobile') || text.includes('app')) {
      return 'Mobile Development';
    }
    
    return 'IT Services';
  }
  
  // Override normalizeCompanyData for Italy-specific formatting
  normalizeCompanyData(rawData) {
    const normalized = super.normalizeCompanyData(rawData);
    
    // Clean Italian phone numbers
    if (normalized.phone) {
      normalized.phone = this.normalizeItalianPhone(normalized.phone);
    }
    
    // Clean Italian addresses
    if (normalized.address) {
      normalized.address = this.cleanItalianAddress(normalized.address);
    }
    
    // Set industry if not already set
    if (!normalized.industry && rawData.industry) {
      normalized.industry = rawData.industry;
    }
    
    return normalized;
  }
  
  normalizeItalianPhone(phone) {
    if (!phone) return null;
    
    // Remove common Italian phone prefixes and clean up
    phone = phone.replace(/^\+39/, '').replace(/^39/, '').replace(/\s+/g, '');
    
    // Validate Italian phone number format
    if (/^[0-9]{10,11}$/.test(phone)) {
      return phone;
    }
    
    return null;
  }
  
  cleanItalianAddress(address) {
    if (!address) return null;
    
    // Clean up common Italian address formatting issues
    return address
      .replace(/\s+/g, ' ')
      .replace(/,\s*,/g, ',')
      .trim();
  }
}

module.exports = PagineGialleScraper;
