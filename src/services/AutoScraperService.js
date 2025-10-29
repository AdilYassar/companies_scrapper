const PagineGialleRealScraper = require('../scrapers/italy/PagineGialleRealScraper');
const ANISScraper = require('../scrapers/romania/ANISScraper');
const SupabaseService = require('./SupabaseService');

class AutoScraperService {
  constructor() {
    this.isRunning = false;
    this.scrapingInterval = null;
    this.supabaseService = new SupabaseService();
  }

  async startAutoScraping() {
    if (this.isRunning) return;
    
    console.log('🚀 Starting Auto-Scraping Service...');
    this.isRunning = true;
    
    // Start immediate scraping
    await this.runScrapingCycle();
    
    // Set up periodic scraping (every 6 hours)
    this.scrapingInterval = setInterval(async () => {
      await this.runScrapingCycle();
    }, 6 * 60 * 60 * 1000); // 6 hours
    
    console.log('✅ Auto-Scraping Service started! Will scrape every 6 hours.');
  }

  async runScrapingCycle() {
    try {
      console.log('📊 Starting scraping cycle...');
      
      // Italy scraping
      const italyScraper = new PagineGialleRealScraper({
        categories: ['software-house', 'sviluppo-software', 'consulenza-informatica'],
        cities: ['Milano', 'Roma', 'Torino', 'Bologna', 'Firenze'],
        maxPages: 3
      });
      
      const italyCompanies = await italyScraper.scrape();
      console.log(`🇮🇹 Found ${italyCompanies.length} Italian companies`);
      
      // Romania scraping
      const romaniaScraper = new ANISScraper({
        categories: ['software-development', 'it-services', 'consulting', 'outsourcing'],
        maxPages: 3
      });
      
      const romaniaCompanies = await romaniaScraper.scrape();
      console.log(`🇷🇴 Found ${romaniaCompanies.length} Romanian companies`);
      
      // Combine all companies
      const allCompanies = [...italyCompanies, ...romaniaCompanies];
      
      // Store in database
      const stored = await this.storeCompanies(allCompanies);
      
      console.log(`✅ Scraping cycle completed! Stored ${stored} companies to database.`);
      
    } catch (error) {
      console.error('❌ Auto-scraping failed:', error.message);
    }
  }

  async storeCompanies(companies) {
    try {
      console.log(`💾 Storing ${companies.length} companies to database...`);
      
      // Store companies using SupabaseService
      const stored = await this.supabaseService.storeCompanies(companies);
      
      console.log(`🎉 Successfully stored ${stored} companies to database!`);
      return stored;
    } catch (error) {
      console.error('❌ Failed to store companies:', error.message);
      return 0;
    }
  }

  stopAutoScraping() {
    if (this.scrapingInterval) {
      clearInterval(this.scrapingInterval);
      this.scrapingInterval = null;
    }
    this.isRunning = false;
    console.log('🛑 Auto-Scraping Service stopped.');
  }
}

module.exports = new AutoScraperService();
