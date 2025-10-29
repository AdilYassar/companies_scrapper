const TestScraper = require('../../src/scrapers/italy/PagineGialleRealScraper');

async function testAllRealScrapers() {
  console.log('🚀 Testing ALL REAL Scrapers...\n');
  
  const scrapers = [
    { name: 'Pagine Gialle Italy', scraper: TestScraper, config: { categories: ['software-house'], cities: ['Milano', 'Roma'] } }
  ];
  
  for (const scraperInfo of scrapers) {
    try {
      console.log(`📊 Testing ${scraperInfo.name}...`);
      
      const scraper = new scraperInfo.scraper(scraperInfo.config);
      const companies = await scraper.scrape();
      
      console.log(`  ✅ Found ${companies.length} companies`);
      
      if (companies.length > 0) {
        console.log(`  📋 Sample: ${companies[0].company_name}`);
        console.log(`  📍 Address: ${companies[0].address || 'N/A'}`);
        console.log(`  📝 Description: ${companies[0].description || 'N/A'}`);
        console.log('');
      }
      
    } catch (error) {
      console.log(`  ❌ ${scraperInfo.name} failed: ${error.message}`);
    }
  }
  
  console.log('✅ ALL REAL SCRAPERS TESTING COMPLETED!\n');
}

testAllRealScrapers();
