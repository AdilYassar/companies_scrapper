const ScraperFactory = require('../../src/scrapers/base/ScraperFactory');

async function testNewScrapers() {
  console.log('🚀 Testing New Real Website Scrapers...\n');
  
  const scrapers = [
    { name: 'Kompass Italy', type: 'kompass_italy', country: 'IT' },
    { name: 'Startup Italia', type: 'startup_italia', country: 'IT' },
    { name: 'Kompass Romania', type: 'kompass_romania', country: 'RO' },
    { name: 'ANIS Romania', type: 'anis', country: 'RO' }
  ];
  
  for (const scraperInfo of scrapers) {
    try {
      console.log(`📊 Testing ${scraperInfo.name}...`);
      
      const scraper = ScraperFactory.createScraper(scraperInfo.type, {
        country: scraperInfo.country,
        maxPages: 1 // Limit for testing
      });
      
      const companies = await scraper.scrape();
      
      console.log(`  ✅ Found ${companies.length} companies`);
      
      if (companies.length > 0) {
        console.log(`  📋 Sample: ${companies[0].company_name}`);
        console.log(`  🌐 Website: ${companies[0].website || 'N/A'}`);
        console.log(`  📧 Email: ${companies[0].email || 'N/A'}`);
        console.log(`  📍 Country: ${companies[0].country}`);
        console.log('');
      }
      
    } catch (error) {
      console.log(`  ❌ ${scraperInfo.name} failed: ${error.message}`);
      console.log('');
    }
  }
  
  console.log('✅ New scrapers testing completed!\n');
}

// Run the test
testNewScrapers();
