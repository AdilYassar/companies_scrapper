-- Create scraping_jobs table
CREATE TABLE scraping_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Job Configuration
  job_type VARCHAR(50) NOT NULL, -- 'italy_full', 'romania_full', 'linkedin', etc.
  target_platform VARCHAR(100), -- Specific source
  country VARCHAR(2), -- 'IT', 'RO', or NULL for multi-country
  
  -- Status & Progress
  status VARCHAR(50) DEFAULT 'pending', -- pending, queued, running, completed, failed, cancelled
  priority INTEGER DEFAULT 0, -- Higher = more priority
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  
  -- Configuration
  config JSONB, -- Job-specific settings (filters, limits, etc.)
  
  -- Results Summary
  results_summary JSONB, -- {companies_found, new, updated, failed, etc.}
  
  -- Timing
  scheduled_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  duration_seconds INTEGER,
  
  -- Statistics
  pages_scraped INTEGER DEFAULT 0,
  companies_found INTEGER DEFAULT 0,
  companies_new INTEGER DEFAULT 0,
  companies_updated INTEGER DEFAULT 0,
  companies_failed INTEGER DEFAULT 0,
  requests_made INTEGER DEFAULT 0,
  requests_failed INTEGER DEFAULT 0,
  
  -- Error Handling
  error_message TEXT,
  error_stack TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  
  -- Resource Usage
  memory_used_mb INTEGER,
  
  -- Metadata
  created_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_jobs_status ON scraping_jobs(status);
CREATE INDEX idx_jobs_country ON scraping_jobs(country);
CREATE INDEX idx_jobs_type ON scraping_jobs(job_type);
CREATE INDEX idx_jobs_created ON scraping_jobs(created_at DESC);
CREATE INDEX idx_jobs_scheduled ON scraping_jobs(scheduled_at) WHERE status = 'pending';
