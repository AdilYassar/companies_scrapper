-- Create company_contacts table
CREATE TABLE company_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Contact Information
  full_name VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  position VARCHAR(255),
  department VARCHAR(100),
  seniority_level VARCHAR(50), -- C-Level, Director, Manager, etc.
  
  -- Contact Details
  email VARCHAR(255),
  phone VARCHAR(50),
  mobile VARCHAR(50),
  linkedin_url VARCHAR(255),
  
  -- Status
  is_primary BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Source
  source_platform VARCHAR(100),
  source_url TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_contact_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_contacts_company ON company_contacts(company_id);
CREATE INDEX idx_contacts_email ON company_contacts(email);
CREATE INDEX idx_contacts_primary ON company_contacts(is_primary) WHERE is_primary = TRUE;
