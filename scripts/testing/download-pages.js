const puppeteer = require('puppeteer-extra');
const fs = require('fs');
const path = require('path');

// Add stealth plugin
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function downloadPages() {
  console.log('📥 Downloading HTML pages from real websites...\n');
  
  const sites = [
    {
      name: 'Kompass Italy',
      url: 'https://it.kompass.com',
      searchUrl: 'https://it.kompass.com/search/software-development/italy'
    },
    {
      name: 'Startup Italia', 
      url: 'https://startupitalia.eu',
      searchUrl: 'https://startupitalia.eu/startups'
    },
    {
      name: 'ANIS Romania',
      url: 'https://www.anis.ro',
      searchUrl: 'https://www.anis.ro/en/members/'
    },
    {
      name: 'Kompass Romania',
      url: 'https://ro.kompass.com', 
      searchUrl: 'https://ro.kompass.com/search/software-development/romania'
    },
    {
      name: 'Pagine Gialle Italy',
      url: 'https://www.paginegialle.it',
      searchUrl: 'https://www.paginegialle.it/ricerca/software-house/milano'
    }
  ];
  
  const browser = await puppeteer.launch({ 
    headless: false, // Show browser for debugging
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  for (const site of sites) {
    try {
      console.log(`📊 Downloading ${site.name}...`);
      
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1920, height: 1080 });
      
      // Navigate to the page
      await page.goto(site.searchUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Wait a bit for dynamic content
      await page.waitForTimeout(3000);
      
      // Get the HTML content
      const html = await page.content();
      
      // Save to file
      const filename = `${site.name.toLowerCase().replace(/\s+/g, '_')}.html`;
      const filepath = path.join(__dirname, 'downloaded_pages', filename);
      
      // Create directory if it doesn't exist
      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filepath, html);
      console.log(`  ✅ Saved to: ${filepath}`);
      
      // Also save a screenshot
      const screenshotPath = path.join(__dirname, 'downloaded_pages', `${site.name.toLowerCase().replace(/\s+/g, '_')}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`  📸 Screenshot: ${screenshotPath}`);
      
      await page.close();
      
    } catch (error) {
      console.log(`  ❌ Failed to download ${site.name}: ${error.message}`);
    }
  }
  
  await browser.close();
  console.log('\n✅ All pages downloaded! Check the downloaded_pages folder.');
}

// Run the download
downloadPages().catch(console.error);
