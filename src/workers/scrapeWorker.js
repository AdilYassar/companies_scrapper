const Queue = require('bull');
const ScraperFactory = require('../scrapers/base/ScraperFactory');
const SupabaseService = require('../services/SupabaseService');
const DeduplicationService = require('../services/DeduplicationService');
const queueConfig = require('../config/queue.config');

// Create queue
const scrapeQueue = new Queue('scraping jobs', {
  redis: queueConfig.redis,
  defaultJobOptions: queueConfig.defaultJobOptions,
  settings: queueConfig.settings,
});

// Process jobs
scrapeQueue.process('italy_full', queueConfig.concurrency, async (job) => {
  console.log(`🇮🇹 Processing Italy scraping job ${job.id}`);
  
  try {
    // Update job status
    await SupabaseService.updateScrapingJob(job.data.jobId, {
      status: 'running',
      started_at: new Date().toISOString(),
      progress_percentage: 0
    });
    
    const { sources = ['pagine_gialle', 'registro_imprese'], cities = [] } = job.data.config;
    const allCompanies = [];
    
    // Process each source
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      const progress = Math.round((i / sources.length) * 100);
      
      console.log(`  📊 Scraping ${source}...`);
      
      try {
        const scraper = ScraperFactory.createScraper(source, { cities });
        const companies = await scraper.scrape();
        allCompanies.push(...companies);
        
        // Update progress
        await SupabaseService.updateScrapingJob(job.data.jobId, {
          progress_percentage: progress,
          companies_found: allCompanies.length
        });
        
        console.log(`  ✅ ${source}: ${companies.length} companies found`);
        
      } catch (error) {
        console.error(`  ❌ ${source} failed:`, error.message);
        await SupabaseService.createScrapingLog({
          job_id: job.data.jobId,
          log_level: 'error',
          message: `Scraper ${source} failed`,
          scraper_name: source,
          error_details: { error: error.message, stack: error.stack }
        });
      }
    }
    
    // Deduplicate companies
    console.log('🔄 Deduplicating companies...');
    const deduplicationResult = await DeduplicationService.processCompanies(allCompanies);
    
    // Save to database
    console.log('💾 Saving companies to database...');
    const savedCompanies = await SupabaseService.upsertCompanies(deduplicationResult.companies);
    
    // Update job completion
    await SupabaseService.updateScrapingJob(job.data.jobId, {
      status: 'completed',
      completed_at: new Date().toISOString(),
      progress_percentage: 100,
      companies_found: allCompanies.length,
      companies_new: deduplicationResult.companies.length,
      results_summary: {
        original: deduplicationResult.original,
        duplicates: deduplicationResult.duplicates,
        final: deduplicationResult.merged
      }
    });
    
    console.log(`✅ Italy job ${job.id} completed: ${savedCompanies.length} companies saved`);
    
  } catch (error) {
    console.error(`❌ Italy job ${job.id} failed:`, error);
    
    await SupabaseService.updateScrapingJob(job.data.jobId, {
      status: 'failed',
      completed_at: new Date().toISOString(),
      error_message: error.message,
      error_stack: error.stack
    });
    
    throw error;
  }
});

scrapeQueue.process('romania_full', queueConfig.concurrency, async (job) => {
  console.log(`🇷🇴 Processing Romania scraping job ${job.id}`);
  
  try {
    // Update job status
    await SupabaseService.updateScrapingJob(job.data.jobId, {
      status: 'running',
      started_at: new Date().toISOString(),
      progress_percentage: 0
    });
    
    const { sources = ['listafirme', 'onrc'], cities = [] } = job.data.config;
    const allCompanies = [];
    
    // Process each source
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      const progress = Math.round((i / sources.length) * 100);
      
      console.log(`  📊 Scraping ${source}...`);
      
      try {
        const scraper = ScraperFactory.createScraper(source, { cities });
        const companies = await scraper.scrape();
        allCompanies.push(...companies);
        
        // Update progress
        await SupabaseService.updateScrapingJob(job.data.jobId, {
          progress_percentage: progress,
          companies_found: allCompanies.length
        });
        
        console.log(`  ✅ ${source}: ${companies.length} companies found`);
        
      } catch (error) {
        console.error(`  ❌ ${source} failed:`, error.message);
        await SupabaseService.createScrapingLog({
          job_id: job.data.jobId,
          log_level: 'error',
          message: `Scraper ${source} failed`,
          scraper_name: source,
          error_details: { error: error.message, stack: error.stack }
        });
      }
    }
    
    // Deduplicate companies
    console.log('🔄 Deduplicating companies...');
    const deduplicationResult = await DeduplicationService.processCompanies(allCompanies);
    
    // Save to database
    console.log('💾 Saving companies to database...');
    const savedCompanies = await SupabaseService.upsertCompanies(deduplicationResult.companies);
    
    // Update job completion
    await SupabaseService.updateScrapingJob(job.data.jobId, {
      status: 'completed',
      completed_at: new Date().toISOString(),
      progress_percentage: 100,
      companies_found: allCompanies.length,
      companies_new: deduplicationResult.companies.length,
      results_summary: {
        original: deduplicationResult.original,
        duplicates: deduplicationResult.duplicates,
        final: deduplicationResult.merged
      }
    });
    
    console.log(`✅ Romania job ${job.id} completed: ${savedCompanies.length} companies saved`);
    
  } catch (error) {
    console.error(`❌ Romania job ${job.id} failed:`, error);
    
    await SupabaseService.updateScrapingJob(job.data.jobId, {
      status: 'failed',
      completed_at: new Date().toISOString(),
      error_message: error.message,
      error_stack: error.stack
    });
    
    throw error;
  }
});

// Queue event handlers
scrapeQueue.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

scrapeQueue.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message);
});

scrapeQueue.on('stalled', (job) => {
  console.warn(`⚠️ Job ${job.id} stalled`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing queue...');
  await scrapeQueue.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing queue...');
  await scrapeQueue.close();
  process.exit(0);
});

console.log('🚀 Scrape worker started');
console.log(`📊 Concurrency: ${queueConfig.concurrency}`);
console.log(`🔗 Redis: ${queueConfig.redis.host}:${queueConfig.redis.port}`);

module.exports = scrapeQueue;
