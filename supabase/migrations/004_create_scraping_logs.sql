-- Create scraping_logs table
CREATE TABLE scraping_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES scraping_jobs(id) ON DELETE CASCADE,
  
  -- Log Details
  log_level VARCHAR(20) NOT NULL, -- debug, info, warning, error, critical
  message TEXT NOT NULL,
  
  -- Context
  scraper_name VARCHAR(100),
  url TEXT,
  http_status INTEGER,
  
  -- Additional Data
  metadata JSONB,
  error_details JSONB,
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_logs_job ON scraping_logs(job_id);
CREATE INDEX idx_logs_level ON scraping_logs(log_level);
CREATE INDEX idx_logs_created ON scraping_logs(created_at DESC);
-- Partition by month for better performance
CREATE INDEX idx_logs_created_month ON scraping_logs(DATE_TRUNC('month', created_at));
