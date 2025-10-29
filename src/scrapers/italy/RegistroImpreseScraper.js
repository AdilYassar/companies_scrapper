const DynamicScraper = require('../strategies/DynamicScraper');

class RegistroImpreseScraper extends DynamicScraper {
  constructor(config) {
    super({
      baseUrl: 'https://www.registroimprese.it',
      selectors: {
        company: '.company-result, .search-result',
        company_name: '.company-name, .denominazione',
        tax_id: '.partita-iva, .p-iva',
        registration_number: '.rea-number, .numero-rea',
        address: '.sede-legale, .address',
        legal_form: '.forma-giuridica, .legal-form'
      },
      waitForSelector: '.search-results, .company-result',
      ...config
    });
    
    this.regions = config.regions || ['Lombardia', 'Lazio', 'Piemonte', 'Emilia-Romagna'];
    this.maxPages = config.maxPages || 3;
  }
  
  async scrape() {
    try {
      this.log('info', 'Starting Registro Imprese scraping', {
        regions: this.regions
      });
      
      const allCompanies = [];
      
      for (const region of this.regions) {
        this.log('info', `Scraping region: ${region}`);
        
        const companies = await this.scrapeRegion(region);
        allCompanies.push(...companies);
        
        // Rate limiting between regions
        await this.sleep(5000);
      }
      
      this.results = allCompanies.map(company => this.normalizeCompanyData(company));
      
      this.log('info', 'Registro Imprese scraping completed', {
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
      // Ensure browser is launched
      if (!this.browser || !this.page) {
        await this.launchBrowser();
      }
      
      // Navigate to search page
      await this.page.goto(`${this.baseUrl}/ricerca`, { waitUntil: 'networkidle2' });
      
      // Fill search form
      await this.fillSearchForm(region);
      
      // Wait for results
      await this.page.waitForSelector('.search-results', { timeout: 10000 });
      
      // Scrape results
      const regionCompanies = await this.scrapeSearchResults();
      companies.push(...regionCompanies);
      
    } catch (error) {
      this.log('warn', `Failed to scrape region ${region}`, { error: error.message });
    }
    
    return companies;
  }
  
  async fillSearchForm(region) {
    try {
      // Wait for page to be ready
      await this.page.waitForSelector('body', { timeout: 10000 });
      
      // Try multiple selectors for region
      const regionSelectors = [
        'select[name="regione"]',
        'select[name="region"]',
        'select[name="area"]',
        '#region',
        '#regione',
        '.region-select'
      ];
      
      let regionSelected = false;
      for (const selector of regionSelectors) {
        try {
          await this.page.select(selector, region);
          regionSelected = true;
          this.log('info', `Region selected using selector: ${selector}`);
          break;
        } catch (error) {
          continue;
        }
      }
      
      if (!regionSelected) {
        // Try to find and click on region option
        const regionOptions = await this.page.$$eval('option', options => 
          options.map(opt => ({ value: opt.value, text: opt.textContent }))
        );
        
        const matchingRegion = regionOptions.find(opt => 
          opt.text.toLowerCase().includes(region.toLowerCase())
        );
        
        if (matchingRegion) {
          await this.page.select('select', matchingRegion.value);
          regionSelected = true;
        }
      }
      
      // Try multiple selectors for industry sector
      const sectorSelectors = [
        'select[name="settore"]',
        'select[name="sector"]',
        'select[name="industry"]',
        '#settore',
        '#sector'
      ];
      
      let sectorSelected = false;
      for (const selector of sectorSelectors) {
        try {
          await this.page.select(selector, '62'); // ATECO code for software
          sectorSelected = true;
          this.log('info', `Sector selected using selector: ${selector}`);
          break;
        } catch (error) {
          continue;
        }
      }
      
      // Try to submit form with multiple button selectors
      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button:contains("Cerca")',
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
              company.legal_name = company.company_name; // Same in Italian registry
              company.tax_id = this.extractText(element, selectors.tax_id);
              company.registration_number = this.extractText(element, selectors.registration_number);
              company.address = this.extractText(element, selectors.address);
              company.legal_form = this.extractText(element, selectors.legal_form);
              
              // Extract additional details
              company.registration_date = this.extractText(element, '.data-iscrizione');
              company.share_capital = this.extractText(element, '.capitale-sociale');
              company.status = this.extractText(element, '.stato');
              
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
  
  // Override normalizeCompanyData for Italian registry specifics
  normalizeCompanyData(rawData) {
    const normalized = super.normalizeCompanyData(rawData);
    
    // Clean Italian tax ID (Partita IVA)
    if (normalized.tax_id) {
      normalized.tax_id = this.cleanItalianTaxId(normalized.tax_id);
    }
    
    // Clean REA number
    if (normalized.registration_number) {
      normalized.registration_number = this.cleanREANumber(normalized.registration_number);
    }
    
    // Set source information
    normalized.source_platform = 'registro_imprese';
    normalized.country = 'IT';
    
    // Parse registration date
    if (rawData.registration_date) {
      normalized.registration_date = this.parseItalianDate(rawData.registration_date);
    }
    
    // Parse share capital
    if (rawData.share_capital) {
      normalized.share_capital = this.parseShareCapital(rawData.share_capital);
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
    
    // Clean up REA number format (e.g., "MI-1234567")
    return reaNumber.replace(/\s+/g, '').trim();
  }
  
  parseItalianDate(dateString) {
    if (!dateString) return null;
    
    try {
      // Italian date format: DD/MM/YYYY
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return new Date(year, month - 1, day).toISOString().split('T')[0];
      }
    } catch (error) {
      this.log('warn', 'Failed to parse Italian date', { dateString, error: error.message });
    }
    
    return null;
  }
  
  parseShareCapital(capitalString) {
    if (!capitalString) return null;
    
    try {
      // Extract numeric value from Italian currency format
      const match = capitalString.match(/[\d.,]+/);
      if (match) {
        return parseFloat(match[0].replace(',', '.'));
      }
    } catch (error) {
      this.log('warn', 'Failed to parse share capital', { capitalString, error: error.message });
    }
    
    return null;
  }
}

module.exports = RegistroImpreseScraper;
