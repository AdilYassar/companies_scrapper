const DynamicScraper = require('../strategies/DynamicScraper');

class ONRCScraper extends DynamicScraper {
  constructor(config) {
    super({
      baseUrl: 'https://www.onrc.ro',
      selectors: {
        company: '.company-result, .search-result',
        company_name: '.denumire-firma, .company-name',
        cui: '.cod-unic-identificare, .cui',
        registration_number: '.numar-registrul-comertului',
        address: '.sediu-social, .address',
        legal_form: '.forma-juridica, .legal-form'
      },
      waitForSelector: '.search-results, .company-result',
      ...config
    });
    
    this.counties = config.counties || ['București', 'Cluj', 'Timiș', 'Iași'];
    this.maxPages = config.maxPages || 3;
  }
  
  async scrape() {
    try {
      this.log('info', 'Starting ONRC scraping', {
        counties: this.counties
      });
      
      const allCompanies = [];
      
      for (const county of this.counties) {
        this.log('info', `Scraping county: ${county}`);
        
        const companies = await this.scrapeCounty(county);
        allCompanies.push(...companies);
        
        // Rate limiting between counties
        await this.sleep(5000);
      }
      
      this.results = allCompanies.map(company => this.normalizeCompanyData(company));
      
      this.log('info', 'ONRC scraping completed', {
        total_companies: this.results.length,
        counties_scraped: this.counties.length
      });
      
      return this.results;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async scrapeCounty(county) {
    const companies = [];
    
    try {
      // Ensure browser is launched
      if (!this.browser || !this.page) {
        await this.launchBrowser();
      }
      
      // Navigate to search page
      await this.page.goto(`${this.baseUrl}/cautare`, { waitUntil: 'networkidle2' });
      
      // Fill search form
      await this.fillSearchForm(county);
      
      // Wait for results
      await this.page.waitForSelector('.search-results', { timeout: 10000 });
      
      // Scrape results
      const countyCompanies = await this.scrapeSearchResults();
      companies.push(...countyCompanies);
      
    } catch (error) {
      this.log('warn', `Failed to scrape county ${county}`, { error: error.message });
    }
    
    return companies;
  }
  
  async fillSearchForm(county) {
    try {
      // Wait for page to be ready
      await this.page.waitForSelector('body', { timeout: 10000 });
      
      // Try multiple selectors for county
      const countySelectors = [
        'select[name="judet"]',
        'select[name="county"]',
        'select[name="region"]',
        '#judet',
        '#county',
        '.county-select'
      ];
      
      let countySelected = false;
      for (const selector of countySelectors) {
        try {
          await this.page.select(selector, county);
          countySelected = true;
          this.log('info', `County selected using selector: ${selector}`);
          break;
        } catch (error) {
          continue;
        }
      }
      
      if (!countySelected) {
        // Try to find and click on county option
        const countyOptions = await this.page.$$eval('option', options => 
          options.map(opt => ({ value: opt.value, text: opt.textContent }))
        );
        
        const matchingCounty = countyOptions.find(opt => 
          opt.text.toLowerCase().includes(county.toLowerCase())
        );
        
        if (matchingCounty) {
          await this.page.select('select', matchingCounty.value);
          countySelected = true;
        }
      }
      
      // Try multiple selectors for CAEN codes
      const caenSelectors = [
        'select[name="caen"]',
        'select[name="code"]',
        'select[name="industry"]',
        '#caen',
        '#code'
      ];
      
      let caenSelected = false;
      for (const selector of caenSelectors) {
        try {
          await this.page.select(selector, '6201'); // Software development
          caenSelected = true;
          this.log('info', `CAEN code selected using selector: ${selector}`);
          break;
        } catch (error) {
          continue;
        }
      }
      
      // Try to submit form with multiple button selectors
      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button:contains("Caută")',
        'button:contains("Search")',
        '.submit-btn',
        '#submit',
        '.search-btn'
      ];
      
      let formSubmitted = false;
      for (const selector of submitSelectors) {
        try {
          await this.page.click(selector);
          formSubmitted = true;
          this.log('info', `Form submitted using selector: ${selector}`);
          break;
        } catch (error) {
          continue;
        }
      }
      
      if (!formSubmitted) {
        // Try pressing Enter on the form
        await this.page.keyboard.press('Enter');
        formSubmitted = true;
      }
      
      // Wait for results with multiple selectors
      const resultSelectors = [
        '.search-results',
        '.results',
        '.company-list',
        '.search-list',
        '.result-list',
        '.companies'
      ];
      
      let resultsFound = false;
      for (const selector of resultSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 10000 });
          resultsFound = true;
          this.log('info', `Results found using selector: ${selector}`);
          break;
        } catch (error) {
          continue;
        }
      }
      
      if (!resultsFound) {
        this.log('warn', 'No results container found, continuing anyway');
      }
      
    } catch (error) {
      this.log('warn', 'Failed to fill search form', { error: error.message });
      throw error;
    }
  }
  
  async scrapeSearchResults() {
    const companies = [];
    let currentPage = 1;
    
    while (currentPage <= this.maxPages) {
      try {
        this.log('info', `Scraping page ${currentPage}`);
        
        // Extract companies from current page
        const pageCompanies = await this.page.evaluate((selectors) => {
          const companies = [];
          const companyElements = document.querySelectorAll('.company-result, .search-result');
          
          companyElements.forEach((element) => {
            try {
              const company = {};
              
              // Extract company information
              company.company_name = this.extractText(element, selectors.company_name);
              company.legal_name = company.company_name; // Same in Romanian registry
              company.cui = this.extractText(element, selectors.cui);
              company.registration_number = this.extractText(element, selectors.registration_number);
              company.address = this.extractText(element, selectors.address);
              company.legal_form = this.extractText(element, selectors.legal_form);
              
              // Extract additional details
              company.registration_date = this.extractText(element, '.data-înregistrare');
              company.share_capital = this.extractText(element, '.capital-social');
              company.status = this.extractText(element, '.stare');
              company.caen_codes = this.extractText(element, '.coduri-caen');
              
              if (company.company_name) {
                companies.push(company);
              }
            } catch (error) {
              console.warn('Failed to parse company element:', error);
            }
          });
          
          return companies;
        }, this.selectors);
        
        companies.push(...pageCompanies);
        
        // Check if there's a next page
        const hasNextPage = await this.page.evaluate(() => {
          return document.querySelector('.pagination .next:not(.disabled)') !== null;
        });
        
        if (!hasNextPage) {
          break;
        }
        
        // Navigate to next page
        await this.page.click('.pagination .next');
        await this.page.waitForSelector('.search-results', { timeout: 10000 });
        
        currentPage++;
        await this.sleep(3000); // Rate limiting
        
      } catch (error) {
        this.log('warn', `Failed to scrape page ${currentPage}`, { error: error.message });
        break;
      }
    }
    
    return companies;
  }
  
  // Override normalizeCompanyData for Romanian registry specifics
  normalizeCompanyData(rawData) {
    const normalized = super.normalizeCompanyData(rawData);
    
    // Clean Romanian CUI
    if (normalized.cui) {
      normalized.cui = this.cleanRomanianCUI(normalized.cui);
    }
    
    // Clean registration number
    if (normalized.registration_number) {
      normalized.registration_number = this.cleanRegistrationNumber(normalized.registration_number);
    }
    
    // Set source information
    normalized.source_platform = 'onrc';
    normalized.country = 'RO';
    
    // Parse registration date
    if (rawData.registration_date) {
      normalized.registration_date = this.parseRomanianDate(rawData.registration_date);
    }
    
    // Parse share capital
    if (rawData.share_capital) {
      normalized.share_capital = this.parseShareCapital(rawData.share_capital);
    }
    
    // Parse CAEN codes
    if (rawData.caen_codes) {
      normalized.industry_codes = this.parseCAENCodes(rawData.caen_codes);
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
  
  cleanRegistrationNumber(regNumber) {
    if (!regNumber) return null;
    
    // Clean up registration number format (J##/####/YYYY)
    return regNumber.replace(/\s+/g, '').trim();
  }
  
  parseRomanianDate(dateString) {
    if (!dateString) return null;
    
    try {
      // Romanian date format: DD.MM.YYYY
      const parts = dateString.split('.');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return new Date(year, month - 1, day).toISOString().split('T')[0];
      }
    } catch (error) {
      this.log('warn', 'Failed to parse Romanian date', { dateString, error: error.message });
    }
    
    return null;
  }
  
  parseShareCapital(capitalString) {
    if (!capitalString) return null;
    
    try {
      // Extract numeric value from Romanian currency format
      const match = capitalString.match(/[\d.,]+/);
      if (match) {
        return parseFloat(match[0].replace(',', '.'));
      }
    } catch (error) {
      this.log('warn', 'Failed to parse share capital', { capitalString, error: error.message });
    }
    
    return null;
  }
  
  parseCAENCodes(codesString) {
    if (!codesString) return null;
    
    try {
      // Parse CAEN codes (e.g., "6201, 6202, 6209")
      return codesString.split(',').map(code => code.trim());
    } catch (error) {
      this.log('warn', 'Failed to parse CAEN codes', { codesString, error: error.message });
    }
    
    return null;
  }
}

module.exports = ONRCScraper;
