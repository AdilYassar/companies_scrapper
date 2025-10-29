const ScraperFactory = require('../../src/scrapers/base/ScraperFactory');
const SupabaseService = require('../../src/services/SupabaseService');
const DeduplicationService = require('../../src/services/DeduplicationService');

class RomaniaScraperTester {
  constructor() {
    this.scrapers = ['listafirme', 'onrc'];
    this.cities = ['București', 'Cluj-Napoca']; // Limit for testing
  }
  
  async testScrapers() {
    console.log('🇷🇴 Testing Romania scrapers...');
    
    const allCompanies = [];
    
    for (const scraperName of this.scrapers) {
      console.log(`\n📊 Testing ${scraperName} scraper...`);
      
      try {
        const scraper = ScraperFactory.createScraper(scraperName, {
          cities: this.cities,
          maxPages: 1 // Limit for testing
        });
        
        const companies = await scraper.scrape();
        console.log(`  ✅ Found ${companies.length} companies`);
        
        allCompanies.push(...companies);
        
        // Show sample data
        if (companies.length > 0) {
          console.log('  📋 Sample company:');
          console.log(`    Name: ${companies[0].company_name}`);
          console.log(`    City: ${companies[0].city}`);
          console.log(`    CUI: ${companies[0].cui || 'N/A'}`);
          console.log(`    Website: ${companies[0].website || 'N/A'}`);
          console.log(`    Quality Score: ${companies[0].data_quality_score || 'N/A'}`);
        }
        
      } catch (error) {
        console.error(`  ❌ ${scraperName} failed:`, error.message);
      }
    }
    
    console.log(`\n📈 Total companies found: ${allCompanies.length}`);
    
    if (allCompanies.length > 0) {
      // Test deduplication
      console.log('\n🔄 Testing deduplication...');
      const deduplicationResult = await DeduplicationService.processCompanies(allCompanies);
      console.log(`  Original: ${deduplicationResult.original}`);
      console.log(`  Duplicates found: ${deduplicationResult.duplicates}`);
      console.log(`  Final: ${deduplicationResult.merged}`);
      
      // Test database save
      console.log('\n💾 Testing database save...');
      try {
        const savedCompanies = await SupabaseService.upsertCompanies(deduplicationResult.companies);
        console.log(`  ✅ Saved ${savedCompanies.length} companies to database`);
      } catch (error) {
        console.error('  ❌ Database save failed:', error.message);
      }
    }
    
    console.log('\n✅ Romania scraper testing completed!');
  }
}

// Run test if called directly
if (require.main === module) {
  const tester = new RomaniaScraperTester();
  tester.testScrapers()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}

module.exports = RomaniaScraperTester;
