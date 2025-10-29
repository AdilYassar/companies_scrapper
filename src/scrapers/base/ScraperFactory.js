const StaticScraper = require('../strategies/StaticScraper');
const DynamicScraper = require('../strategies/DynamicScraper');
const ApiScraper = require('../strategies/ApiScraper');

// Italy scrapers
const PagineGialleScraper = require('../italy/PagineGialleScraper');
const RegistroImpreseScraper = require('../italy/RegistroImpreseScraper');
const InfoCamereScraper = require('../italy/InfoCamereScraper');
const KompassScraper = require('../italy/KompassScraper');
const StartupItaliaScraper = require('../italy/StartupItaliaScraper');

// Romania scrapers
const ListaFirmeScraper = require('../romania/ListaFirmeScraper');
const ONRCScraper = require('../romania/ONRCScraper');
const ANISScraper = require('../romania/ANISScraper');
const KompassRomaniaScraper = require('../romania/KompassRomaniaScraper');

// Platform scrapers
const CrunchbaseScraper = require('../platforms/CrunchbaseScraper');

// Test scrapers
const TestScraper = require('../test/TestScraper');

class ScraperFactory {
  static createScraper(type, config = {}) {
    const scraperMap = {
      // Strategy scrapers
      'static': StaticScraper,
      'dynamic': DynamicScraper,
      'api': ApiScraper,
      
      // Italy scrapers
      'pagine_gialle': PagineGialleScraper,
      'registro_imprese': RegistroImpreseScraper,
      'infocamere': InfoCamereScraper,
      'kompass_italy': KompassScraper,
      'startup_italia': StartupItaliaScraper,
      
      // Romania scrapers
      'listafirme': ListaFirmeScraper,
      'onrc': ONRCScraper,
      'anis': ANISScraper,
      'kompass_romania': KompassRomaniaScraper,
      
      // Platform scrapers
      'crunchbase': CrunchbaseScraper,
      
      // Test scrapers
      'test': TestScraper,
    };
    
    const ScraperClass = scraperMap[type];
    if (!ScraperClass) {
      throw new Error(`Unknown scraper type: ${type}`);
    }
    
    return new ScraperClass(config);
  }
  
  static getAvailableScrapers() {
    return {
      strategies: ['static', 'dynamic', 'api'],
      italy: ['pagine_gialle', 'registro_imprese', 'infocamere'],
      romania: ['listafirme', 'onrc', 'anis'],
      platforms: ['crunchbase']
    };
  }
  
  static createCountryScrapers(country, config = {}) {
    const scrapers = [];
    
    if (country === 'IT') {
      scrapers.push(
        this.createScraper('pagine_gialle', config),
        this.createScraper('registro_imprese', config)
      );
    } else if (country === 'RO') {
      scrapers.push(
        this.createScraper('listafirme', config),
        this.createScraper('onrc', config)
      );
    }
    
    return scrapers;
  }
  
  static createPlatformScrapers(platforms, config = {}) {
    return platforms.map(platform => this.createScraper(platform, config));
  }
}

module.exports = ScraperFactory;
