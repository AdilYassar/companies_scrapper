const ApiScraper = require('../strategies/ApiScraper');

class InfoCamereScraper extends ApiScraper {
  constructor(config) {
    super({
      baseUrl: 'https://api.infocamere.it',
      endpoint: '/api/v1/companies',
      apiKey: config.apiKey,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      ...config
    });
    
    this.regions = config.regions || ['Lombardia', 'Lazio', 'Piemonte'];
    this.maxPages = config.maxPages || 5;
  }
  
  async scrape() {
    try {
      this.log('info', 'Starting InfoCamere API scraping', {
        regions: this.regions
      });
      
      // Authenticate if needed
      await this.authenticate();
      
      const allCompanies = [];
      
      for (const region of this.regions) {
        this.log('info', `Scraping region: ${region}`);
        
        const companies = await this.scrapeRegion(region);
        allCompanies.push(...companies);
        
        // Rate limiting between regions
        await this.sleep(3000);
      }
      
      this.results = allCompanies.map(company => this.normalizeCompanyData(company));
      
      this.log('info', 'InfoCamere scraping completed', {
        total_companies: this.results.length,
        regions_scraped: this.regions.length
      });
      
      return this.results;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async scrapeRegion(region) {
    const companies = [];
    
    try {
      // Build API parameters for region search
      const params = this.buildRegionParams(region);
      
      // Fetch companies from API
      const response = await this.fetchRegionData(params);
      const regionCompanies = this.parseApiResponse(response);
      
      companies.push(...regionCompanies);
      
    } catch (error) {
      this.log('warn', `Failed to scrape region ${region}`, { error: error.message });
    }
    
    return companies;
  }
  
  buildRegionParams(region) {
    return {
      region: region,
      sector: '62', // ATECO code for software
      status: 'active',
      limit: 100,
      offset: 0
    };
  }
  
  async fetchRegionData(params) {
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
    // InfoCamere API response structure
    if (data.companies && Array.isArray(data.companies)) {
      return data.companies.map(company => this.parseCompanyData(company));
    }
    
    if (data.results && Array.isArray(data.results)) {
      return data.results.map(company => this.parseCompanyData(company));
    }
    
    return [];
  }
  
  parseCompanyData(companyData) {
    return {
      company_name: companyData.denominazione || companyData.name,
      legal_name: companyData.denominazione || companyData.name,
      tax_id: companyData.partita_iva || companyData.tax_id,
      registration_number: companyData.numero_rea || companyData.registration_number,
      address: companyData.sede_legale || companyData.address,
      city: companyData.comune || companyData.city,
      region: companyData.regione || companyData.region,
      legal_form: companyData.forma_giuridica || companyData.legal_form,
      registration_date: companyData.data_iscrizione || companyData.registration_date,
      share_capital: companyData.capitale_sociale || companyData.share_capital,
      status: companyData.stato || companyData.status,
      industry_codes: companyData.codici_ateco || companyData.industry_codes,
      source_platform: 'infocamere',
      source_url: this.baseUrl,
      country: 'IT'
    };
  }
  
  // Override normalizeCompanyData for InfoCamere specifics
  normalizeCompanyData(rawData) {
    const normalized = super.normalizeCompanyData(rawData);
    
    // Clean Italian tax ID
    if (normalized.tax_id) {
      normalized.tax_id = this.cleanItalianTaxId(normalized.tax_id);
    }
    
    // Clean REA number
    if (normalized.registration_number) {
      normalized.registration_number = this.cleanREANumber(normalized.registration_number);
    }
    
    // Parse industry codes
    if (rawData.industry_codes) {
      normalized.industry_codes = this.parseIndustryCodes(rawData.industry_codes);
    }
    
    // Parse registration date
    if (rawData.registration_date) {
      normalized.registration_date = this.parseApiDate(rawData.registration_date);
    }
    
    // Parse share capital
    if (rawData.share_capital) {
      normalized.share_capital = this.parseApiShareCapital(rawData.share_capital);
    }
    
    return normalized;
  }
  
  cleanItalianTaxId(taxId) {
    if (!taxId) return null;
    
    // Remove IT prefix and clean up
    taxId = taxId.replace(/^IT/, '').replace(/\s+/g, '');
    
    // Validate Italian Partita IVA format (11 digits)
    if (/^[0-9]{11}$/.test(taxId)) {
      return taxId;
    }
    
    return null;
  }
  
  cleanREANumber(reaNumber) {
    if (!reaNumber) return null;
    
    // Clean up REA number format
    return reaNumber.replace(/\s+/g, '').trim();
  }
  
  parseIndustryCodes(codes) {
    if (!codes) return null;
    
    if (Array.isArray(codes)) {
      return codes;
    }
    
    if (typeof codes === 'string') {
      return codes.split(',').map(code => code.trim());
    }
    
    return null;
  }
  
  parseApiDate(dateString) {
    if (!dateString) return null;
    
    try {
      // Handle various date formats from API
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (error) {
      this.log('warn', 'Failed to parse API date', { dateString, error: error.message });
    }
    
    return null;
  }
  
  parseApiShareCapital(capitalData) {
    if (!capitalData) return null;
    
    try {
      if (typeof capitalData === 'number') {
        return capitalData;
      }
      
      if (typeof capitalData === 'string') {
        const match = capitalData.match(/[\d.,]+/);
        if (match) {
          return parseFloat(match[0].replace(',', '.'));
        }
      }
    } catch (error) {
      this.log('warn', 'Failed to parse API share capital', { capitalData, error: error.message });
    }
    
    return null;
  }
}

module.exports = InfoCamereScraper;
