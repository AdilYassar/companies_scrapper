const ScraperFactory = require('../scrapers/base/ScraperFactory');
const SupabaseService = require('../services/SupabaseService');
const DeduplicationService = require('../services/DeduplicationService');
const Queue = require('bull');
const queueConfig = require('../config/queue.config');

// Create queue instance
const scrapeQueue = new Queue('scraping jobs', {
  redis: queueConfig.redis,
  defaultJobOptions: queueConfig.defaultJobOptions,
  settings: queueConfig.settings,
});

class ScrapeController {
  // Scrape Italy companies
  async scrapeItaly(req, res) {
    try {
      const { sources = ['pagine_gialle', 'registro_imprese'], cities = [], async = true } = req.body;
      
      if (async) {
        // Create job and return immediately
        const job = await SupabaseService.createScrapingJob({
          job_type: 'italy_full',
          country: 'IT',
          status: 'pending',
          config: { sources, cities },
          created_by: req.user?.id || 'system'
        });
        
        // Add job to queue
        await scrapeQueue.add('italy_full', {
          jobId: job.id,
          config: { sources, cities }
        });
        
        res.json({
          success: true,
          job_id: job.id,
          message: 'Italy scraping job queued',
          estimated_time: '15 minutes'
        });
      } else {
        // Synchronous scraping
        const companies = await this.scrapeItalySync(sources, cities);
        
        res.json({
          success: true,
          companies_found: companies.length,
          companies: companies.slice(0, 10) // Return first 10 for preview
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // Scrape Romania companies
  async scrapeRomania(req, res) {
    try {
      const { sources = ['listafirme', 'onrc'], cities = [], async = true } = req.body;
      
      if (async) {
        // Create job and return immediately
        const job = await SupabaseService.createScrapingJob({
          job_type: 'romania_full',
          country: 'RO',
          status: 'pending',
          config: { sources, cities },
          created_by: req.user?.id || 'system'
        });
        
        // Add job to queue
        await scrapeQueue.add('romania_full', {
          jobId: job.id,
          config: { sources, cities }
        });
        
        res.json({
          success: true,
          job_id: job.id,
          message: 'Romania scraping job queued',
          estimated_time: '15 minutes'
        });
      } else {
        // Synchronous scraping
        const companies = await this.scrapeRomaniaSync(sources, cities);
        
        res.json({
          success: true,
          companies_found: companies.length,
          companies: companies.slice(0, 10) // Return first 10 for preview
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  
  // Get job status
  async getJobStatus(req, res) {
    try {
      const { jobId } = req.params;
      
      const job = await SupabaseService.getScrapingJob(jobId);
      
      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Job not found'
        });
      }
      
      res.json({
        success: true,
        job: {
          id: job.id,
          status: job.status,
          progress_percentage: job.progress_percentage,
          companies_found: job.companies_found,
          companies_new: job.companies_new,
          companies_updated: job.companies_updated,
          started_at: job.started_at,
          completed_at: job.completed_at,
          error_message: job.error_message
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // Get all jobs
  async getJobs(req, res) {
    try {
      const { status, country, job_type, page = 1, limit = 20 } = req.query;
      
      const jobs = await SupabaseService.getScrapingJobs({
        status,
        country,
        job_type
      });
      
      // Simple pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedJobs = jobs.slice(startIndex, endIndex);
      
      res.json({
        success: true,
        jobs: paginatedJobs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: jobs.length,
          pages: Math.ceil(jobs.length / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // Cancel job
  async cancelJob(req, res) {
    try {
      const { jobId } = req.params;
      
      const job = await SupabaseService.updateScrapingJob(jobId, {
        status: 'cancelled',
        completed_at: new Date().toISOString()
      });
      
      res.json({
        success: true,
        message: 'Job cancelled successfully',
        job: job
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // Synchronous Italy scraping
  async scrapeItalySync(sources, cities) {
    const allCompanies = [];
    
    for (const source of sources) {
      try {
        const scraper = ScraperFactory.createScraper(source, { cities });
        const companies = await scraper.scrape();
        allCompanies.push(...companies);
      } catch (error) {
        console.error(`Error scraping ${source}:`, error);
      }
    }
    
    // Deduplicate companies
    const deduplicationResult = await DeduplicationService.processCompanies(allCompanies);
    
    // Save to database
    if (deduplicationResult.companies.length > 0) {
      await SupabaseService.upsertCompanies(deduplicationResult.companies);
    }
    
    return deduplicationResult.companies;
  }
  
  // Synchronous Romania scraping
  async scrapeRomaniaSync(sources, cities) {
    const allCompanies = [];
    
    for (const source of sources) {
      try {
        const scraper = ScraperFactory.createScraper(source, { cities });
        const companies = await scraper.scrape();
        allCompanies.push(...companies);
      } catch (error) {
        console.error(`Error scraping ${source}:`, error);
      }
    }
    
    // Deduplicate companies
    const deduplicationResult = await DeduplicationService.processCompanies(allCompanies);
    
    // Save to database
    if (deduplicationResult.companies.length > 0) {
      await SupabaseService.upsertCompanies(deduplicationResult.companies);
    }
    
    return deduplicationResult.companies;
  }
  
}

module.exports = new ScrapeController();
