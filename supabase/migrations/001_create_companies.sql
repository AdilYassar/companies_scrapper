-- Create companies table
CREATE TABLE companies (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Information
  company_name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255),
  brand_names TEXT[], -- Array of trading names
  slug VARCHAR(255) UNIQUE, -- URL-friendly identifier
  
  -- Country & Location
  country VARCHAR(2) NOT NULL CHECK (country IN ('IT', 'RO')),
  region VARCHAR(100), -- Lombardia, Cluj, etc.
  city VARCHAR(100),
  address TEXT,
  postal_code VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Business Registration
  tax_id VARCHAR(50), -- Partita IVA (IT) or CUI (RO)
  registration_number VARCHAR(50), -- REA (IT) or J##/####/YYYY (RO)
  vat_number VARCHAR(50), -- EU VAT number
  fiscal_code VARCHAR(50), -- Codice Fiscale (IT only)
  legal_form VARCHAR(100), -- SRL, SPA, SA, etc.
  registration_date DATE,
  share_capital DECIMAL(15, 2),
  
  -- Industry Classification
  industry VARCHAR(100),
  sub_industries TEXT[],
  industry_codes TEXT[], -- ATECO (IT) or CAEN (RO) codes
  
  -- Company Size
  company_size VARCHAR(50), -- '1-10', '11-50', '51-200', etc.
  employee_count INTEGER,
  employee_range_min INTEGER,
  employee_range_max INTEGER,
  founded_year INTEGER,
  
  -- Contact Information
  website VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  fax VARCHAR(50),
  
  -- Social Media
  linkedin_url VARCHAR(255),
  facebook_url VARCHAR(255),
  twitter_url VARCHAR(255),
  instagram_url VARCHAR(255),
  github_url VARCHAR(255),
  
  -- Business Information
  description TEXT,
  short_description TEXT,
  services TEXT[],
  technologies TEXT[], -- Programming languages, frameworks
  certifications TEXT[], -- ISO 9001, etc.
  specialties TEXT[],
  
  -- Financial Information (if available)
  annual_revenue DECIMAL(15, 2),
  revenue_currency VARCHAR(3) DEFAULT 'EUR',
  revenue_year INTEGER,
  
  -- Legal Representatives (Italy/Romania specific)
  legal_representatives JSONB, -- Array of {name, role, since}
  
  -- Data Source Tracking
  source_platform VARCHAR(100), -- 'linkedin', 'registro_imprese', etc.
  source_url TEXT,
  source_data JSONB, -- Raw data from source
  data_quality_score INTEGER CHECK (data_quality_score BETWEEN 0 AND 100),
  completeness_score INTEGER CHECK (completeness_score BETWEEN 0 AND 100),
  last_verified_at TIMESTAMP,
  
  -- Enrichment Status
  is_enriched BOOLEAN DEFAULT FALSE,
  enrichment_sources TEXT[], -- Sources used for enrichment
  
  -- Verification & Status
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by VARCHAR(100),
  verified_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  status VARCHAR(50) DEFAULT 'active', -- active, inactive, closed
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  scraped_at TIMESTAMP,
  
  -- Full Text Search
  search_vector TSVECTOR,
  
  -- Constraints
  CONSTRAINT unique_tax_id_country UNIQUE(tax_id, country),
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Indexes for Performance
CREATE INDEX idx_companies_country ON companies(country);
CREATE INDEX idx_companies_city ON companies(city);
CREATE INDEX idx_companies_region ON companies(region);
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_companies_tax_id ON companies(tax_id);
CREATE INDEX idx_companies_source ON companies(source_platform);
CREATE INDEX idx_companies_created ON companies(created_at DESC);
CREATE INDEX idx_companies_search ON companies USING GIN(search_vector);
CREATE INDEX idx_companies_active ON companies(is_active) WHERE is_active = TRUE;
