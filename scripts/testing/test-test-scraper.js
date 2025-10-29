const ScraperFactory = require('../../src/scrapers/base/ScraperFactory');

async function testTestScraper() {
  console.log('🧪 Testing Test Scraper...\n');
  
  try {
    const scraper = ScraperFactory.createScraper('test', {
      country: 'IT'
    });
    
    console.log('📊 Running test scraper...');
    const companies = await scraper.scrape();
    
    console.log(`  ✅ Found ${companies.length} companies`);
    
    if (companies.length > 0) {
      console.log('\n📋 Sample company data:');
      companies.forEach((company, index) => {
        console.log(`  ${index + 1}. ${company.company_name}`);
        console.log(`     Website: ${company.website || 'N/A'}`);
        console.log(`     Email: ${company.email || 'N/A'}`);
        console.log(`     Phone: ${company.phone || 'N/A'}`);
        console.log(`     Country: ${company.country || 'N/A'}`);
        console.log(`     Quality Score: ${company.data_quality_score || 'N/A'}`);
        console.log('');
      });
    }
    
    console.log('✅ Test scraper testing completed!\n');
    
  } catch (error) {
    console.error('❌ Test scraper failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testTestScraper();
