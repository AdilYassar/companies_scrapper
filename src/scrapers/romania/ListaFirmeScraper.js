const StaticScraper = require('../strategies/StaticScraper');

class ListaFirmeScraper extends StaticScraper {
  constructor(config) {
    super({
      baseUrl: 'https://www.listafirme.ro',
      selectors: {
        company: '.company-item, .firma-item, .result-item, .listing-item',
        company_name: '.company-name, .denumire-firma, .title, h3',
        cui: '.cui, .cod-unic-identificare, .tax-id',
        registration_number: '.numar-registrul-comertului, .registration-number',
        address: '.adresa, .sediu-social, .address',
        phone: '.telefon, .phone, .tel',
        website: '.website, .site-web, .url a',
        email: '.email, .contact-email, .mail'
      },
      ...config
    });
    
    this.categories = config.categories || [
      'dezvoltare-software',
      'outsourcing-it',
      'consultanta-it',
      'web-design',
      'aplicatii-mobile'
    ];
    
    this.cities = config.cities || ['București', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Brașov'];
    this.maxPages = config.maxPages || 5;
  }
  
  async scrape() {
    try {
      this.log('info', 'Starting Lista Firme scraping', {
        categories: this.categories,
        cities: this.cities
      });
      
      const allCompanies = [];
      
      for (const category of this.categories) {
        for (const city of this.cities) {
          this.log('info', `Scraping ${category} in ${city}`);
          
          const searchUrl = `${this.baseUrl}/search?q=${encodeURIComponent(category)}&location=${encodeURIComponent(city)}`;
          const companies = await this.scrapeCategory(category, city, searchUrl);
          allCompanies.push(...companies);
          
          // Rate limiting between searches
          await this.sleep(3000);
        }
      }
      
      this.results = allCompanies.map(company => this.normalizeCompanyData(company));
      
      this.log('info', 'Lista Firme scraping completed', {
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
    
    $('.company-item, .firma-item').each((index, element) => {
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
    company.company_name = $element.find('.company-name, .denumire-firma').text().trim();
    
    // Extract CUI (Romanian tax ID)
    company.cui = $element.find('.cui, .cod-unic-identificare').text().trim();
    
    // Extract registration number
    company.registration_number = $element.find('.numar-registrul-comertului').text().trim();
    
    // Extract address
    const addressText = $element.find('.adresa, .sediu-social').text().trim();
    company.address = addressText;
    company.city = this.extractCityFromAddress(addressText);
    
    // Extract contact information
    company.phone = $element.find('.telefon, .phone').text().trim();
    company.email = $element.find('.email, .contact-email').text().trim();
    company.website = $element.find('.website, .site-web a').attr('href');
    
    // Extract additional details
    company.description = $element.find('.descriere, .description').text().trim();
    company.industry = this.categorizeIndustry($element);
    
    // Set source information
    company.source_platform = 'listafirme';
    company.source_url = sourceUrl;
    company.country = 'RO';
    
    return company;
  }
  
  extractCityFromAddress(address) {
    if (!address) return null;
    
    // Try to extract city from Romanian address format
    // Look for pattern: "City, County" (e.g., "Cluj-Napoca, Cluj")
    const cityMatch = address.match(/([A-Za-zăâîșțĂÂÎȘȚ\s-]+),\s*[A-Za-zăâîșțĂÂÎȘȚ\s]+$/);
    if (cityMatch) {
      return cityMatch[1].trim();
    }
    
    // Fallback: look for common Romanian city names
    const romanianCities = ['București', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Brașov', 'Constanța', 'Craiova'];
    for (const city of romanianCities) {
      if (address.includes(city)) {
        return city;
      }
    }
    
    return null;
  }
  
  categorizeIndustry($element) {
    // Try to determine industry from company name or description
    const text = ($element.find('.company-name').text() + ' ' + $element.find('.descriere').text()).toLowerCase();
    
    if (text.includes('software') || text.includes('dezvoltare')) {
      return 'Software Development';
    }
    if (text.includes('outsourcing') || text.includes('externalizare')) {
      return 'IT Outsourcing';
    }
    if (text.includes('consultanta') || text.includes('consulting')) {
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
  
  // Override normalizeCompanyData for Romania-specific formatting
  normalizeCompanyData(rawData) {
    const normalized = super.normalizeCompanyData(rawData);
    
    // Clean Romanian CUI
    if (normalized.cui) {
      normalized.cui = this.cleanRomanianCUI(normalized.cui);
    }
    
    // Clean Romanian phone numbers
    if (normalized.phone) {
      normalized.phone = this.normalizeRomanianPhone(normalized.phone);
    }
    
    // Clean Romanian addresses
    if (normalized.address) {
      normalized.address = this.cleanRomanianAddress(normalized.address);
    }
    
    // Set industry if not already set
    if (!normalized.industry && rawData.industry) {
      normalized.industry = rawData.industry;
    }
    
    // Map CUI to tax_id for consistency
    if (normalized.cui && !normalized.tax_id) {
      normalized.tax_id = normalized.cui;
    }
    
    return normalized;
  }
  
  cleanRomanianCUI(cui) {
    if (!cui) return null;
    
    // Clean up CUI format (2-10 digits)
    cui = cui.replace(/\s+/g, '');
    
    // Validate Romanian CUI format
    if (/^[0-9]{2,10}$/.test(cui)) {
      return cui;
    }
    
    return null;
  }
  
  normalizeRomanianPhone(phone) {
    if (!phone) return null;
    
    // Remove common Romanian phone prefixes and clean up
    phone = phone.replace(/^\+40/, '').replace(/^40/, '').replace(/\s+/g, '');
    
    // Validate Romanian phone number format
    if (/^[0-9]{9,10}$/.test(phone)) {
      return phone;
    }
    
    return null;
  }
  
  cleanRomanianAddress(address) {
    if (!address) return null;
    
    // Clean up common Romanian address formatting issues
    return address
      .replace(/\s+/g, ' ')
      .replace(/,\s*,/g, ',')
      .trim();
  }
}

module.exports = ListaFirmeScraper;
