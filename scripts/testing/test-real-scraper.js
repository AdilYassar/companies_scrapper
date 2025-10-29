const ScraperFactory = require('../../src/scrapers/base/ScraperFactory');

async function testRealScraper() {
  console.log('🎯 Testing REAL Pagine Gialle Scraper...\n');
  
  try {
    // Create a test scraper that uses the real HTML structure
    const TestScraper = require('../../src/scrapers/italy/PagineGialleRealScraper');
    
    const scraper = new TestScraper({
      categories: ['software-house'],
      cities: ['Milano'],
      maxPages: 1
    });
    
    console.log('📊 Running real scraper...');
    const companies = await scraper.scrape();
    
    console.log(`✅ Found ${companies.length} companies`);
    
    if (companies.length > 0) {
      console.log('\n📋 Sample companies:');
      companies.slice(0, 3).forEach((company, index) => {
        console.log(`  ${index + 1}. ${company.company_name}`);
        console.log(`     Category: ${company.category || 'N/A'}`);
        console.log(`     Address: ${company.address || 'N/A'}`);
        console.log(`     Description: ${company.description || 'N/A'}`);
        console.log(`     Website: ${company.website || 'N/A'}`);
        console.log(`     Phone: ${company.phone || 'N/A'}`);
        console.log(`     Quality Score: ${company.data_quality_score || 'N/A'}`);
        console.log('');
      });
    }
    
    console.log('✅ Real scraper testing completed!\n');
    
  } catch (error) {
    console.error('❌ Real scraper failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testRealScraper();
