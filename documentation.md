Project Overview :

Web Scraping Server - Comprehensive Documentation
Project Overview
A production-ready Node.js web scraping server with country-based dynamic scraping capabilities, built with modern JavaScript libraries and scalable architecture.

Project Structure
scraping-server/
├── src/
│   ├── config/
│   │   ├── index.js                 # Central configuration management
│   │   ├── scraper.config.js        # Scraper-specific settings
│   │   ├── proxy.config.js          # Proxy rotation configuration
│   │   └── countries.config.js      # Country-specific rules & selectors
│   │
│   ├── scrapers/
│   │   ├── base/
│   │   │   ├── BaseScraper.js       # Abstract scraper class
│   │   │   └── ScraperFactory.js    # Factory pattern for scraper creation
│   │   │
│   │   ├── strategies/
│   │   │   ├── StaticScraper.js     # Cheerio-based static scraping
│   │   │   ├── DynamicScraper.js    # Puppeteer for JS-heavy sites
│   │   │   └── ApiScraper.js        # Direct API extraction
│   │   │
│   │   └── adapters/
│   │       ├── CountryAdapter.js    # Country-specific adaptations
│   │       └── SelectorAdapter.js   # Dynamic selector mapping
│   │
│   ├── middleware/
│   │   ├── rateLimiter.js           # Request rate limiting
│   │   ├── auth.js                  # API authentication
│   │   ├── validation.js            # Request validation
│   │   ├── errorHandler.js          # Global error handling
│   │   └── requestLogger.js         # Request/response logging
│   │
│   ├── services/
│   │   ├── ProxyService.js          # Proxy rotation & management
│   │   ├── CacheService.js          # Redis-based caching
│   │   ├── QueueService.js          # Bull queue for job processing
│   │   ├── StorageService.js        # Data persistence layer
│   │   └── NotificationService.js   # Webhook/event notifications
│   │
│   ├── utils/
│   │   ├── parser.js                # HTML/JSON parsing utilities
│   │   ├── validator.js             # Data validation helpers
│   │   ├── sanitizer.js             # Data sanitization
│   │   ├── retry.js                 # Retry logic with backoff
│   │   └── logger.js                # Winston logger setup
│   │
│   ├── routes/
│   │   ├── index.js                 # Route aggregator
│   │   ├── scrape.routes.js         # Scraping endpoints
│   │   ├── jobs.routes.js           # Job management endpoints
│   │   └── health.routes.js         # Health check endpoints
│   │
│   ├── controllers/
│   │   ├── ScrapeController.js      # Scraping request handlers
│   │   ├── JobController.js         # Job management handlers
│   │   └── HealthController.js      # Health check handlers
│   │
│   ├── models/
│   │   ├── ScrapingJob.js           # Job data model
│   │   ├── ScrapingResult.js        # Result data model
│   │   └── ScrapingLog.js           # Logging data model
│   │
│   └── app.js                       # Express app setup
│
├── tests/
│   ├── unit/
│   │   ├── scrapers/
│   │   ├── services/
│   │   └── utils/
│   │
│   └── integration/
│       ├── api.test.js
│       └── scraping.test.js
│
├── scripts/
│   ├── seed-countries.js            # Seed country configurations
│   ├── test-scraper.js              # Manual scraper testing
│   └── cleanup.js                   # Cache/queue cleanup
│
├── docs/
│   ├── API.md                       # API documentation
│   ├── ARCHITECTURE.md              # Architecture decisions
│   ├── DEPLOYMENT.md                # Deployment guide
│   └── COUNTRIES.md                 # Country-specific guide
│
├── .env.example                     # Environment variables template
├── .gitignore
├── package.json
├── Dockerfile
├── docker-compose.yml
└── README.md

Required Libraries & Dependencies
Core Dependencies
json{
  "express": "^4.18.2",
  "dotenv": "^16.3.1",
  "helmet": "^7.1.0",
  "cors": "^2.8.5",
  "compression": "^1.7.4"
}
Scraping Libraries
json{
  "cheerio": "^1.0.0-rc.12",          // Fast HTML parsing
  "puppeteer": "^21.5.0",              // Headless browser
  "playwright": "^1.40.0",             // Alternative to Puppeteer
  "axios": "^1.6.2",                   // HTTP client
  "got": "^13.0.0",                    // Alternative HTTP client
  "jsdom": "^23.0.1"                   // DOM manipulation
}
Proxy & Anti-Detection
json{
  "puppeteer-extra": "^3.3.6",
  "puppeteer-extra-plugin-stealth": "^2.11.2",
  "puppeteer-extra-plugin-adblocker": "^2.13.6",
  "proxy-chain": "^2.4.0",
  "rotating-proxy": "^2.0.0"
}
Queue & Job Processing
json{
  "bull": "^4.12.0",                   // Redis-based queue
  "bullmq": "^5.0.0",                  // Alternative queue system
  "agenda": "^5.0.0"                   // MongoDB-based scheduling
}
Caching & Storage
json{
  "redis": "^4.6.11",
  "ioredis": "^5.3.2",
  "mongoose": "^8.0.3",                // MongoDB ODM
  "pg": "^8.11.3",                     // PostgreSQL client
  "sequelize": "^6.35.2"               // SQL ORM
}
Validation & Sanitization
json{
  "joi": "^17.11.0",                   // Schema validation
  "validator": "^13.11.0",             // String validation
  "xss": "^1.0.14",                    // XSS prevention
  "dompurify": "^3.0.6"                // HTML sanitization
}
Utilities
json{
  "winston": "^3.11.0",                // Logging
  "morgan": "^1.10.0",                 // HTTP request logger
  "express-rate-limit": "^7.1.5",      // Rate limiting
  "express-validator": "^7.0.1",       // Request validation
  "lodash": "^4.17.21",                // Utility functions
  "moment": "^2.29.4",                 // Date manipulation
  "uuid": "^9.0.1"                     // UUID generation
}
Development Dependencies
json{
  "nodemon": "^3.0.2",
  "jest": "^29.7.0",
  "supertest": "^6.3.3",
  "eslint": "^8.55.0",
  "prettier": "^3.1.1",
  "husky": "^8.0.3"
}

Key Features & Capabilities
1. Multi-Strategy Scraping

Static HTML scraping (Cheerio) - Fast, low resource
Dynamic JavaScript rendering (Puppeteer/Playwright) - Full browser
API extraction - Direct data access
Hybrid approach based on target complexity

2. Country-Based Dynamic Configuration

Country-specific selectors and rules
Localized proxy support
Currency/language adaptation
Timezone handling
Regional compliance (GDPR, CCPA)

3. Anti-Detection Mechanisms

User-agent rotation
Browser fingerprint randomization
Proxy rotation (datacenter, residential, mobile)
Request timing randomization
Cookie/session management
Headless detection evasion

4. Scalability & Performance

Redis caching layer
Bull queue for distributed processing
Connection pooling
Batch processing
Parallel scraping with concurrency limits

5. Reliability & Resilience

Exponential backoff retry logic
Circuit breaker pattern
Request timeout handling
Error recovery strategies
Health monitoring

6. Data Pipeline

HTML parsing & extraction
Data validation & sanitization
Schema transformation
Deduplication
Storage persistence


Technical Architecture Decisions
Why This Stack?
Cheerio over Raw Regex:

jQuery-like syntax for familiar DOM traversal
10x faster than Puppeteer for static content
Low memory footprint

Puppeteer + Playwright:

Puppeteer: More mature, better documentation
Playwright: Multi-browser support, better for testing
Both for redundancy and target-specific optimization

Bull Queue:

Redis-backed for high performance
Built-in retry mechanisms
Job prioritization
Rate limiting per job type
Dashboard UI available

Redis + MongoDB Hybrid:

Redis: Hot cache, session storage, rate limiting
MongoDB: Job history, results, flexible schema

Proxy Rotation Strategy:

Datacenter proxies: Fast, cheap (general use)
Residential proxies: High success rate (strict sites)
Mobile proxies: Highest success (premium targets)


1-Day Development Timeline
Hour 0-2: Setup & Foundation ✅

Initialize Node.js project
Install core dependencies
Setup folder structure
Configure ESLint/Prettier
Create .env configuration
Setup Docker Compose (Redis, MongoDB)

Hour 2-4: Core Scraping Engine 🔧

Implement BaseScraper abstract class
Create ScraperFactory
Build StaticScraper (Cheerio)
Build DynamicScraper (Puppeteer)
Implement retry logic with backoff

Hour 4-6: Country Configuration System 🌍

Design country configuration schema
Create CountryAdapter
Build SelectorAdapter
Implement 3-5 country presets (US, UK, CA, AU, DE)
Add country detection logic

Hour 6-8: Services Layer ⚙️

ProxyService with rotation
CacheService (Redis integration)
QueueService (Bull setup)
StorageService (MongoDB/PostgreSQL)

Hour 8-10: API & Middleware 🔌

Express app setup
Route definitions
Controllers implementation
Rate limiting middleware
Authentication middleware
Validation middleware

Hour 10-12: Queue & Job Processing 📋

Bull queue configuration
Job processors
Job status tracking
Webhook notifications
Error handling

Hour 12-14: Testing & Debugging 🧪

Unit tests for scrapers
Integration tests for API
Test with real targets
Fix critical bugs
Performance profiling

Hour 14-16: Documentation & Deployment 📚

API documentation (Swagger/Postman)
README with examples
Docker configuration
Environment setup guide
Deployment checklist

Hour 16-18: Polish & Optimization ✨

Code cleanup
Performance optimization
Add logging/monitoring
Security hardening
Final testing

Hour 18-24: Buffer & Contingency 🛡️

Handle unexpected issues
Additional feature requests
Extended testing
Documentation refinement


API Endpoint Design
Core Endpoints
POST /api/v1/scrape

Immediate scraping request
Country parameter
Target URL
Selector configuration

POST /api/v1/scrape/async

Queued scraping job
Returns job ID
Background processing

GET /api/v1/jobs/:jobId

Job status checking
Result retrieval

GET /api/v1/jobs

List all jobs
Filter by country/status

DELETE /api/v1/jobs/:jobId

Cancel job
Clean up resources

GET /api/v1/health

Service health check
Queue status
Cache status


Configuration Examples
Country Configuration Schema
javascript{
  countryCode: 'US',
  locale: 'en-US',
  currency: 'USD',
  timezone: 'America/New_York',
  proxyType: 'residential',
  headers: {
    'Accept-Language': 'en-US,en;q=0.9',
  },
  selectors: {
    // Dynamic selectors per target
  },
  rateLimits: {
    requestsPerMinute: 60,
    concurrency: 5
  },
  compliance: {
    respectRobotsTxt: true,
    userAgent: 'CustomBot/1.0'
  }
}

Resource Requirements
Development Environment

Node.js 18+ (LTS)
Redis 7.x
MongoDB 6.x or PostgreSQL 15.x
Docker & Docker Compose
16GB RAM minimum
Multi-core CPU (4+ cores recommended)

Third-Party Services (Optional)

Proxy provider (BrightData, Oxylabs, SmartProxy)
Monitoring (Sentry, DataDog, New Relic)
Cloud deployment (AWS, GCP, DigitalOcean)


Security Considerations

API Authentication: JWT or API keys
Rate Limiting: Prevent abuse
Input Validation: Prevent injection attacks
Proxy Authentication: Secure proxy credentials
Data Encryption: Encrypt sensitive data at rest
HTTPS Only: Force secure connections
CORS Configuration: Restrict origins
Helmet.js: Security headers


Performance Targets

Static Scraping: < 500ms per page
Dynamic Scraping: < 3s per page
API Response Time: < 100ms
Queue Processing: 100+ jobs/minute
Cache Hit Rate: > 80%
Uptime: 99.9%


Monitoring & Observability

Winston logging (file + console)
Request/response logging
Error tracking (Sentry)
Performance metrics (StatsD)
Queue dashboard (Bull Board)
Health check endpoints
Alert notifications


Next Steps After Documentation Review

Approve architecture - Confirm structure meets requirements
Prioritize features - Essential vs. nice-to-have
Define test targets - Specific websites to scrape
Finalize country list - Which countries to support initially
Begin implementation - Start with Hour 0-2 foundation


Ready to proceed with implementation? Let me know if you want to adjust the timeline, modify the architecture, or need clarification on any component before we start coding.RetryClaude does not have the ability to run the code it generates yet.Aokay so major website for itlay and romania our main target is romania and itlay okay? so make sure you add in a way to target those website that have the data of those countries okay ? for example linkedin etc or countries specific website that have all the software companies data okay  ? we will use supabase as a databaseWeb Scraping Server - Italy & Romania Focus (Supabase Edition)
Updated Project Overview
Production-ready Node.js scraping server specifically designed to extract software company data from Italy and Romania, targeting both international platforms (LinkedIn) and country-specific business directories, with Supabase as the primary database.

Target Data Sources
🇮🇹 Italy - Primary Sources
International Platforms

LinkedIn - Italian software companies
Crunchbase - Italian tech startups
Clutch.co - Italian software development companies

Italy-Specific Directories

Registro Imprese (registroimprese.it) - Official Italian business registry
Pagine Gialle (paginegialle.it) - Italian business directory
InfoCamere - Chamber of Commerce database
Italian Tech Alliance - Tech company association
Milano Finanza - Business intelligence
Startup Italia - Italian startup ecosystem
Digital360 - IT companies directory

Regional Directories

Milan: Assolombarda, Milano Digital Week
Rome: Lazio Innova, Rome Startup
Turin: Torino Wireless
Bologna: Bologna Business School directory


🇷🇴 Romania - Primary Sources
International Platforms

LinkedIn - Romanian software companies
Crunchbase - Romanian tech startups
Clutch.co - Romanian software developers

Romania-Specific Directories

ONRC (onrc.ro) - Official Romanian Trade Registry
Termene.ro - Romanian business database
Listafirme.ro - Company directory
Romanian Outsourcing Association - IT outsourcing companies
ANIS (anis.ro) - Software & Services Industry Association
Techsylvania - Romanian tech ecosystem
Romania-Insider.com - Business directory
StartupBlink Romania - Startup database

Regional Directories

Bucharest: Bucharest Tech Week, Hubgets
Cluj-Napoca: Cluj IT Cluster, Transylvania IT
Timișoara: Timișoara Tech Hub
Iași: Iași Tech Community


Updated Project Structure
scraping-server/
├── src/
│   ├── config/
│   │   ├── index.js
│   │   ├── supabase.config.js           # Supabase configuration
│   │   ├── targets.config.js            # Target websites configuration
│   │   ├── italy.config.js              # Italy-specific settings
│   │   └── romania.config.js            # Romania-specific settings
│   │
│   ├── scrapers/
│   │   ├── base/
│   │   │   ├── BaseScraper.js
│   │   │   ├── ScraperFactory.js
│   │   │   └── CountryScraperBase.js    # Country-specific base class
│   │   │
│   │   ├── platforms/
│   │   │   ├── LinkedInScraper.js       # LinkedIn scraping logic
│   │   │   ├── CrunchbaseScraper.js     # Crunchbase scraping
│   │   │   └── ClutchScraper.js         # Clutch.co scraping
│   │   │
│   │   ├── italy/
│   │   │   ├── RegistroImpreseScraper.js
│   │   │   ├── PagineGialleScraper.js
│   │   │   ├── InfoCamereScraper.js
│   │   │   ├── StartupItaliaScraper.js
│   │   │   └── ItalianTechScraper.js
│   │   │
│   │   ├── romania/
│   │   │   ├── ONRCScraper.js
│   │   │   ├── TermeneScraper.js
│   │   │   ├── ListaFirmeScraper.js
│   │   │   ├── ANISScraper.js
│   │   │   └── RomanianOutsourcingScraper.js
│   │   │
│   │   └── strategies/
│   │       ├── StaticScraper.js
│   │       ├── DynamicScraper.js
│   │       ├── ApiScraper.js
│   │       └── AuthenticatedScraper.js   # For login-required sites
│   │
│   ├── parsers/
│   │   ├── CompanyDataParser.js         # Normalize company data
│   │   ├── ContactParser.js             # Extract contact info
│   │   ├── AddressParser.js             # Parse addresses
│   │   └── TaxIdParser.js               # VAT/Tax ID extraction
│   │
│   ├── services/
│   │   ├── SupabaseService.js           # Supabase CRUD operations
│   │   ├── DeduplicationService.js      # Prevent duplicate entries
│   │   ├── EnrichmentService.js         # Data enrichment logic
│   │   ├── ProxyService.js
│   │   ├── CacheService.js
│   │   ├── QueueService.js
│   │   └── NotificationService.js
│   │
│   ├── models/
│   │   ├── Company.model.js             # Company data schema
│   │   ├── ScrapingJob.model.js
│   │   └── ScrapingLog.model.js
│   │
│   ├── middleware/
│   │   ├── rateLimiter.js
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── countryValidator.js          # Validate country-specific data
│   │   ├── errorHandler.js
│   │   └── requestLogger.js
│   │
│   ├── utils/
│   │   ├── parser.js
│   │   ├── validator.js
│   │   ├── sanitizer.js
│   │   ├── retry.js
│   │   ├── logger.js
│   │   ├── italianUtils.js              # Italian-specific helpers
│   │   └── romanianUtils.js             # Romanian-specific helpers
│   │
│   ├── routes/
│   │   ├── index.js
│   │   ├── scrape.routes.js
│   │   ├── companies.routes.js          # Company CRUD endpoints
│   │   ├── italy.routes.js              # Italy-specific endpoints
│   │   ├── romania.routes.js            # Romania-specific endpoints
│   │   ├── jobs.routes.js
│   │   └── health.routes.js
│   │
│   ├── controllers/
│   │   ├── ScrapeController.js
│   │   ├── CompanyController.js
│   │   ├── ItalyController.js
│   │   ├── RomaniaController.js
│   │   └── JobController.js
│   │
│   └── app.js
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_create_companies.sql
│   │   ├── 002_create_contacts.sql
│   │   ├── 003_create_scraping_jobs.sql
│   │   ├── 004_create_scraping_logs.sql
│   │   └── 005_create_indexes.sql
│   │
│   ├── seed/
│   │   ├── italy_sources.sql
│   │   └── romania_sources.sql
│   │
│   └── functions/
│       ├── deduplicate_companies.sql
│       └── merge_company_data.sql
│
├── data/
│   ├── selectors/
│   │   ├── linkedin.json
│   │   ├── italy-sources.json
│   │   └── romania-sources.json
│   │
│   └── mappings/
│       ├── italy-regions.json
│       └── romania-regions.json
│
├── scripts/
│   ├── seed-targets.js
│   ├── test-italy-scrapers.js
│   ├── test-romania-scrapers.js
│   └── export-companies.js
│
├── docs/
│   ├── API.md
│   ├── ITALY_SOURCES.md
│   ├── ROMANIA_SOURCES.md
│   ├── DATA_SCHEMA.md
│   └── DEPLOYMENT.md
│
└── tests/
    ├── unit/
    │   ├── scrapers/italy/
    │   └── scrapers/romania/
    └── integration/

Updated Dependencies
Add Supabase & Country-Specific Libraries
json{
  "@supabase/supabase-js": "^2.39.0",    // Supabase client
  "libphonenumber-js": "^1.10.51",       // Phone number parsing
  "email-validator": "^2.0.4",           // Email validation
  "vat-validator": "^1.3.0",             // EU VAT validation
  "iban": "^0.0.14",                     // IBAN validation (EU banking)
  "country-iso": "^1.1.2",               // ISO country codes
  "i18n-iso-countries": "^7.7.0",        // Country name translations
  "moment-timezone": "^0.5.43",          // Timezone handling
  "natural": "^6.10.1",                  // NLP for company descriptions
  "string-similarity": "^4.0.4"          // Fuzzy matching for deduplication
}

Supabase Database Schema
Table: companies
sqlCREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Info
  company_name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255),
  brand_names TEXT[], -- Array of trading names
  
  -- Country & Location
  country VARCHAR(2) NOT NULL, -- 'IT' or 'RO'
  region VARCHAR(100), -- Lombardy, Transylvania, etc.
  city VARCHAR(100),
  address TEXT,
  postal_code VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Business Registration
  tax_id VARCHAR(50), -- Partita IVA (IT) or CUI (RO)
  registration_number VARCHAR(50), -- REA (IT) or Registration Code (RO)
  vat_number VARCHAR(50),
  legal_form VARCHAR(100), -- SRL, SPA, etc.
  registration_date DATE,
  
  -- Company Details
  industry VARCHAR(100),
  sub_industries TEXT[],
  company_size VARCHAR(50), -- 1-10, 11-50, 51-200, etc.
  employee_count INTEGER,
  founded_year INTEGER,
  
  -- Contact Information
  website VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  linkedin_url VARCHAR(255),
  facebook_url VARCHAR(255),
  twitter_url VARCHAR(255),
  
  -- Business Info
  description TEXT,
  services TEXT[],
  technologies TEXT[], -- Programming languages, frameworks
  certifications TEXT[], -- ISO, etc.
  
  -- Financial (if available)
  annual_revenue DECIMAL(15, 2),
  revenue_currency VARCHAR(3),
  
  -- Data Source Tracking
  source_platform VARCHAR(100), -- 'linkedin', 'registro_imprese', etc.
  source_url TEXT,
  data_quality_score INTEGER, -- 0-100
  last_verified_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  scraped_at TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  
  -- Search & Indexing
  search_vector TSVECTOR,
  
  UNIQUE(tax_id, country)
);

CREATE INDEX idx_companies_country ON companies(country);
CREATE INDEX idx_companies_city ON companies(city);
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_companies_search ON companies USING GIN(search_vector);
CREATE INDEX idx_companies_tax_id ON companies(tax_id);
Table: company_contacts
sqlCREATE TABLE company_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  
  full_name VARCHAR(255),
  position VARCHAR(255),
  department VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  linkedin_url VARCHAR(255),
  
  is_primary BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contacts_company ON company_contacts(company_id);
Table: scraping_jobs
sqlCREATE TABLE scraping_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  job_type VARCHAR(50), -- 'italy', 'romania', 'linkedin'
  target_platform VARCHAR(100),
  country VARCHAR(2),
  
  status VARCHAR(50), -- 'pending', 'running', 'completed', 'failed'
  priority INTEGER DEFAULT 0,
  
  config JSONB, -- Job-specific configuration
  results_summary JSONB, -- Stats about scraped data
  
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  companies_found INTEGER DEFAULT 0,
  companies_new INTEGER DEFAULT 0,
  companies_updated INTEGER DEFAULT 0,
  
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_jobs_status ON scraping_jobs(status);
CREATE INDEX idx_jobs_country ON scraping_jobs(country);
Table: scraping_logs
sqlCREATE TABLE scraping_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES scraping_jobs(id) ON DELETE CASCADE,
  
  log_level VARCHAR(20), -- 'info', 'warning', 'error'
  message TEXT,
  metadata JSONB,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_logs_job ON scraping_logs(job_id);
CREATE INDEX idx_logs_level ON scraping_logs(log_level);
Table: data_sources
sqlCREATE TABLE data_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  name VARCHAR(255) NOT NULL,
  country VARCHAR(2),
  url TEXT,
  platform_type VARCHAR(50), -- 'directory', 'registry', 'social'
  
  scraper_class VARCHAR(100), -- Which scraper to use
  is_active BOOLEAN DEFAULT TRUE,
  requires_auth BOOLEAN DEFAULT FALSE,
  
  rate_limit_per_minute INTEGER,
  last_scraped_at TIMESTAMP,
  next_scrape_at TIMESTAMP,
  
  success_rate DECIMAL(5, 2), -- Percentage
  avg_companies_per_scrape INTEGER,
  
  config JSONB, -- Source-specific settings
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

Target Configuration Examples
data/selectors/italy-sources.json
json{
  "registro_imprese": {
    "name": "Registro Imprese",
    "baseUrl": "https://www.registroimprese.it",
    "requiresAuth": false,
    "rateLimit": 30,
    "selectors": {
      "companyName": ".company-name",
      "taxId": ".partita-iva",
      "address": ".sede-legale",
      "description": ".oggetto-sociale"
    },
    "searchParams": {
      "sector": "software",
      "regions": ["Lombardia", "Lazio", "Piemonte", "Emilia-Romagna"]
    }
  },
  "pagine_gialle": {
    "name": "Pagine Gialle",
    "baseUrl": "https://www.paginegialle.it",
    "requiresAuth": false,
    "rateLimit": 60,
    "categories": [
      "software-house",
      "sviluppo-software",
      "consulenza-informatica",
      "web-agency"
    ],
    "cities": ["Milano", "Roma", "Torino", "Bologna", "Firenze"]
  },
  "linkedin_italy": {
    "name": "LinkedIn Italy",
    "baseUrl": "https://www.linkedin.com",
    "requiresAuth": true,
    "rateLimit": 20,
    "searchFilters": {
      "location": "Italy",
      "industry": ["Software Development", "IT Services", "Computer Software"],
      "companySize": ["11-50", "51-200", "201-500", "501-1000", "1001+"]
    }
  }
}
data/selectors/romania-sources.json
json{
  "onrc": {
    "name": "ONRC - Romanian Trade Registry",
    "baseUrl": "https://www.onrc.ro",
    "requiresAuth": false,
    "rateLimit": 30,
    "selectors": {
      "companyName": ".denumire-firma",
      "cui": ".cod-unic-identificare",
      "registrationCode": ".numar-registrul-comertului",
      "address": ".sediu-social"
    },
    "searchParams": {
      "caen": ["6201", "6202", "6209"], // Software development CAEN codes
      "counties": ["București", "Cluj", "Timiș", "Iași"]
    }
  },
  "listafirme": {
    "name": "Lista Firme",
    "baseUrl": "https://www.listafirme.ro",
    "requiresAuth": false,
    "rateLimit": 60,
    "categories": [
      "dezvoltare-software",
      "outsourcing-it",
      "consultanta-it"
    ],
    "cities": ["București", "Cluj-Napoca", "Timișoara", "Iași", "Brașov"]
  },
  "anis": {
    "name": "ANIS - Romanian IT Association",
    "baseUrl": "https://www.anis.ro",
    "requiresAuth": false,
    "rateLimit": 30,
    "memberDirectory": "/membri",
    "companyTypes": ["software-development", "it-services", "outsourcing"]
  },
  "linkedin_romania": {
    "name": "LinkedIn Romania",
    "baseUrl": "https://www.linkedin.com",
    "requiresAuth": true,
    "rateLimit": 20,
    "searchFilters": {
      "location": "Romania",
      "industry": ["Software Development", "IT Services", "Computer Software"],
      "companySize": ["11-50", "51-200", "201-500", "501-1000", "1001+"]
    }
  }
}

LinkedIn Scraping Strategy
Challenges

Authentication Required - Need LinkedIn account
Rate Limiting - Very aggressive (20-30 requests/hour)
Anti-Bot Detection - Advanced fingerprinting
Dynamic Content - Heavy JavaScript rendering
Legal Considerations - Terms of Service restrictions

Solutions
Option 1: Official LinkedIn API (Recommended)
javascript// Uses LinkedIn Marketing Developer Platform
// Requires Partnership application
// Rate limits: Generous
// Data: Official, clean, reliable
Option 2: Puppeteer with Stealth
javascript// Browser automation with anti-detection
// Slow but effective
// Requires proxy rotation
// Risk of account ban
Option 3: Third-Party APIs
javascript// Services like:
// - Phantombuster
// - Apify
// - ScrapingBee with LinkedIn support
// Cost: $50-500/month
// Benefit: No infrastructure needed
```

### LinkedIn Data Points to Extract
- Company name
- Industry
- Company size (employee range)
- Headquarters location
- Founded year
- Website
- Description
- Specialties
- Employee listings (for contacts)

---

## Italy-Specific Considerations

### Data Standards
- **Tax ID (Partita IVA)**: 11 digits (format: IT + 11 numbers)
- **REA Number**: Regional registration (e.g., "MI-1234567")
- **Legal Forms**: SRL, SPA, SAPA, SNC, SAS
- **Regions**: 20 regions, focus on tech hubs (Lombardia, Lazio, Piemonte)

### Language Handling
- Italian language content
- UTF-8 encoding for special characters (à, è, ì, ò, ù)
- Italian address formats

### Key Cities for Software Companies
1. Milano (Milan) - Tech capital
2. Roma (Rome) - Startups & government
3. Torino (Turin) - Engineering
4. Bologna - Innovation hub
5. Firenze (Florence) - Digital agencies

---

## Romania-Specific Considerations

### Data Standards
- **CUI (Cod Unic de Identificare)**: 2-10 digits
- **Registration Number**: Format: "J##/####/YYYY"
- **CAEN Codes**: 6201, 6202, 6209 for software
- **Legal Forms**: SRL, SA, PFA, SNC

### Language Handling
- Romanian language content
- UTF-8 encoding for diacritics (ă, â, î, ș, ț)
- Romanian address formats

### Key Cities for Software Companies
1. București (Bucharest) - Largest tech hub
2. Cluj-Napoca - "Silicon Valley of Romania"
3. Timișoara - Western tech hub
4. Iași - Growing tech scene
5. Brașov - Emerging hub

---

## Updated 1-Day Timeline (Italy & Romania Focus)

### **Hour 0-2: Setup & Supabase** ✅
- Initialize Node.js project
- Install dependencies (including Supabase client)
- Setup Supabase project & tables
- Run migrations
- Configure environment variables
- Setup folder structure

### **Hour 2-4: Core Scraping Engine** 🔧
- Implement BaseScraper
- Create ScraperFactory
- Build StaticScraper (Cheerio)
- Build DynamicScraper (Puppeteer)
- Implement retry logic

### **Hour 4-7: Country-Specific Scrapers** 🇮🇹🇷🇴
**Italy (Hour 4-5.5):**
- RegistroImpreseScraper
- PagineGialleScraper
- Test with real Italian sites

**Romania (Hour 5.5-7):**
- ONRCScraper or TermeneScraper
- ListaFirmeScraper
- Test with real Romanian sites

### **Hour 7-9: LinkedIn Scraper** 💼
- Choose strategy (API vs Puppeteer)
- Implement LinkedInScraper
- Add authentication handling
- Test with Italy & Romania filters
- Implement rate limiting

### **Hour 9-11: Data Processing & Supabase** 📊
- CompanyDataParser (normalize data)
- DeduplicationService
- SupabaseService (CRUD operations)
- EnrichmentService
- Test data pipeline

### **Hour 11-13: API & Endpoints** 🔌
- Express routes
- Italy-specific endpoints
- Romania-specific endpoints
- Company CRUD endpoints
- Validation middleware

### **Hour 13-15: Queue & Batch Processing** 📋
- Bull queue setup
- Job processors for each country
- Scheduled scraping jobs
- Progress tracking

### **Hour 15-17: Testing & Data Validation** 🧪
- Test Italy scrapers with real data
- Test Romania scrapers with real data
- Validate data quality
- Check deduplication
- Export sample dataset

### **Hour 17-19: Polish & Documentation** ✨
- API documentation
- Data schema documentation
- Italy sources guide
- Romania sources guide
- Deployment guide

### **Hour 19-24: Buffer & Optimization** 🛡️
- Performance tuning
- Error handling improvements
- Additional sources if time permits
- Final testing
- Data export to CSV

---

## API Endpoints (Italy & Romania Focus)

### Italy Endpoints
```
POST   /api/v1/italy/scrape              # Scrape all Italian sources
POST   /api/v1/italy/scrape/registro     # Registro Imprese only
POST   /api/v1/italy/scrape/paginegialle # Pagine Gialle only
GET    /api/v1/italy/companies           # Get Italian companies
GET    /api/v1/italy/stats               # Italian data statistics
```

### Romania Endpoints
```
POST   /api/v1/romania/scrape            # Scrape all Romanian sources
POST   /api/v1/romania/scrape/onrc       # ONRC only
POST   /api/v1/romania/scrape/listafirme # Lista Firme only
GET    /api/v1/romania/companies         # Get Romanian companies
GET    /api/v1/romania/stats             # Romanian data statistics
```

### LinkedIn Endpoints
```
POST   /api/v1/linkedin/scrape/italy     # LinkedIn Italy companies
POST   /api/v1/linkedin/scrape/romania   # LinkedIn Romania companies
```

### Company Endpoints
```
GET    /api/v1/companies                 # All companies (filtered)
GET    /api/v1/companies/:id             # Single company
PUT    /api/v1/companies/:id             # Update company
DELETE /api/v1/companies/:id             # Delete company
GET    /api/v1/companies/export/csv      # Export to CSV
GET    /api/v1/companies/stats           # Overall statistics

Data Quality & Enrichment
Deduplication Strategy

Exact Match: Tax ID (Partita IVA / CUI)
Fuzzy Match: Company name + city (80% similarity)
URL Match: Website domain comparison
Merge Logic: Keep most complete record

Data Enrichment Pipeline

Geocoding: Convert addresses to lat/lng
Industry Classification: Standardize industry names
Size Estimation: Normalize employee counts
Contact Validation: Verify emails/phones
Social Profile Matching: Link LinkedIn/Facebook

Data Quality Score (0-100)

Has tax ID: +20 points
Has website: +15 points
Has email: +15 points
Has phone: +10 points
Has address: +10 points
Has description: +10 points
Has employee count: +10 points
Has verified contacts: +10 points


Environment Variables
bash# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# LinkedIn (if using official API)
LINKEDIN_CLIENT_ID=your-client-id
LINKEDIN_CLIENT_SECRET=your-client-secret
LINKEDIN_ACCESS_TOKEN=your-access-token

# LinkedIn (if using scraping)
LINKEDIN_EMAIL=your-linkedin-email
LINKEDIN_PASSWORD=your-linkedin-password

# Proxies (for Italy/Romania)
ITALY_PROXY_URL=http://proxy-it:8080
ROMANIA_PROXY_URL=http://proxy-ro:8080

# Redis
REDIS_URL=redis://localhost:6379

# API
PORT=3000
NODE_ENV=production
API_KEY=your-secret-api-key

# Rate Limiting
ITALY_RATE_LIMIT=60
ROMANIA_RATE_LIMIT=60
LINKEDIN_RATE_LIMIT=20

Success Metrics
After 1 Day, You Should Have:
Italy:

✅ 500-2000 Italian software companies
✅ At least 3 data sources working
✅ 70%+ data completeness

Romania:

✅ 500-2000 Romanian software companies
✅ At least 3 data sources working
✅ 70%+ data completeness

LinkedIn:

✅ 200-500 companies from both countries
✅ Enhanced data (employee counts, descriptions)

Infrastructure:

✅ Supabase database fully configured
✅ API endpoints functional
✅ Queue processing 100+ jobs/hour
✅ Deduplication working
✅ Export capability to CSV


Next Steps

Confirm Supabase setup - Create project & get credentials
Priority order - Which country to start with?
LinkedIn strategy - API access or scraping?
Data requirements - Which fields are most critical?
Begin implementation - Start Hour 0-2








Technical implementation:

# Web Scraping Server - Italy & Romania Software Companies
## Complete Technical Documentation

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Project Structure](#project-structure)
4. [Target Data Sources](#target-data-sources)
5. [Database Schema (Supabase)](#database-schema-supabase)
6. [Dependencies & Libraries](#dependencies--libraries)
7. [Configuration Files](#configuration-files)
8. [Implementation Details](#implementation-details)
9. [API Endpoints](#api-endpoints)
10. [Data Pipeline](#data-pipeline)
11. [Security & Compliance](#security--compliance)
12. [Performance Optimization](#performance-optimization)
13. [1-Day Development Timeline](#1-day-development-timeline)
14. [Testing Strategy](#testing-strategy)
15. [Deployment Guide](#deployment-guide)
16. [Monitoring & Maintenance](#monitoring--maintenance)

---

## 🎯 Project Overview

### Mission
Build a production-ready Node.js web scraping server to extract comprehensive software company data from Italy and Romania, targeting both international platforms (LinkedIn, Crunchbase) and country-specific business registries.

### Primary Objectives
- **Italy Focus**: Extract 2000+ software companies from Italian sources
- **Romania Focus**: Extract 2000+ software companies from Romanian sources
- **Data Quality**: Achieve 70%+ completeness with deduplication
- **Timeline**: Fully functional system in 24 hours
- **Database**: Supabase (PostgreSQL) as primary storage

### Key Features
✅ Multi-source scraping (10+ data sources per country)
✅ LinkedIn integration for enhanced data
✅ Country-specific data normalization
✅ Automatic deduplication & data enrichment
✅ RESTful API with comprehensive endpoints
✅ Queue-based job processing
✅ Real-time progress tracking
✅ CSV/JSON export capabilities
✅ GDPR compliant data handling

---

## 🏗️ Architecture & Tech Stack

### Core Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | Node.js 18+ LTS | JavaScript runtime |
| Framework | Express.js 4.x | Web framework |
| Database | Supabase (PostgreSQL) | Primary data storage |
| Caching | Redis 7.x | Session & cache management |
| Queue | Bull + Redis | Background job processing |
| Scraping | Puppeteer + Cheerio | Browser automation & parsing |
| HTTP Client | Axios + Got | API requests |
| Validation | Joi + Validator.js | Input validation |
| Logging | Winston | Structured logging |

### Architecture Pattern
```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│         Express API Server          │
│  ┌──────────────────────────────┐  │
│  │     Middleware Layer         │  │
│  │  Auth | RateLimit | Validate │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │     Controllers Layer        │  │
│  └──────────────────────────────┘  │
└────────┬─────────────────┬──────────┘
         │                 │
         ▼                 ▼
┌────────────────┐  ┌─────────────┐
│  Queue System  │  │   Supabase  │
│  (Bull+Redis)  │  │  PostgreSQL │
└────────┬───────┘  └─────────────┘
         │
         ▼
┌──────────────────────────┐
│   Scraper Workers        │
│  ┌──────────────────┐    │
│  │  Italy Scrapers  │    │
│  ├──────────────────┤    │
│  │ Romania Scrapers │    │
│  ├──────────────────┤    │
│  │ LinkedIn Scraper │    │
│  └──────────────────┘    │
└──────────────────────────┘
```

---

## 📁 Project Structure

```
scraping-server/
├── src/
│   ├── config/
│   │   ├── index.js                      # Central configuration
│   │   ├── supabase.config.js            # Supabase connection
│   │   ├── redis.config.js               # Redis configuration
│   │   ├── queue.config.js               # Bull queue settings
│   │   ├── italy.config.js               # Italy-specific settings
│   │   ├── romania.config.js             # Romania-specific settings
│   │   └── sources.config.js             # Data source definitions
│   │
│   ├── scrapers/
│   │   ├── base/
│   │   │   ├── BaseScraper.js            # Abstract scraper class
│   │   │   ├── ScraperFactory.js         # Factory pattern
│   │   │   ├── CountryScraperBase.js     # Country-specific base
│   │   │   └── ScraperRegistry.js        # Scraper registration
│   │   │
│   │   ├── strategies/
│   │   │   ├── StaticScraper.js          # Cheerio-based (fast)
│   │   │   ├── DynamicScraper.js         # Puppeteer (JS-heavy)
│   │   │   ├── ApiScraper.js             # API-based extraction
│   │   │   └── AuthScraper.js            # Login-required sites
│   │   │
│   │   ├── platforms/
│   │   │   ├── LinkedInScraper.js        # LinkedIn scraping
│   │   │   ├── CrunchbaseScraper.js      # Crunchbase data
│   │   │   └── ClutchScraper.js          # Clutch.co ratings
│   │   │
│   │   ├── italy/
│   │   │   ├── RegistroImpreseScraper.js # Official registry
│   │   │   ├── PagineGialleScraper.js    # Yellow pages
│   │   │   ├── InfoCamereScraper.js      # Chamber of Commerce
│   │   │   ├── StartupItaliaScraper.js   # Startup directory
│   │   │   ├── Digital360Scraper.js      # IT directory
│   │   │   ├── AssolombardiaScraper.js   # Milan business
│   │   │   └── TorinoWirelessScraper.js  # Turin tech hub
│   │   │
│   │   └── romania/
│   │       ├── ONRCScraper.js            # Trade Registry
│   │       ├── TermeneScraper.js         # Business database
│   │       ├── ListaFirmeScraper.js      # Company directory
│   │       ├── ANISScraper.js            # IT Association
│   │       ├── RomanianOutsourcingScraper.js
│   │       ├── ClujITClusterScraper.js   # Cluj tech
│   │       └── TechsylvaniaScraper.js    # Startup ecosystem
│   │
│   ├── parsers/
│   │   ├── CompanyDataParser.js          # Normalize company data
│   │   ├── ContactParser.js              # Extract contacts
│   │   ├── AddressParser.js              # Parse addresses
│   │   ├── TaxIdParser.js                # VAT/Tax validation
│   │   ├── PhoneParser.js                # Phone normalization
│   │   ├── EmailParser.js                # Email validation
│   │   └── UrlParser.js                  # URL normalization
│   │
│   ├── services/
│   │   ├── SupabaseService.js            # Database operations
│   │   ├── DeduplicationService.js       # Duplicate detection
│   │   ├── EnrichmentService.js          # Data enhancement
│   │   ├── ValidationService.js          # Data validation
│   │   ├── GeocodingService.js           # Address → Lat/Lng
│   │   ├── ProxyService.js               # Proxy rotation
│   │   ├── CacheService.js               # Redis caching
│   │   ├── QueueService.js               # Job queue management
│   │   ├── NotificationService.js        # Webhooks/alerts
│   │   └── ExportService.js              # CSV/JSON export
│   │
│   ├── workers/
│   │   ├── scrapeWorker.js               # Main scraping worker
│   │   ├── enrichmentWorker.js           # Data enrichment worker
│   │   └── deduplicationWorker.js        # Dedup processor
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js            # API authentication
│   │   ├── rateLimit.middleware.js       # Rate limiting
│   │   ├── validation.middleware.js      # Request validation
│   │   ├── errorHandler.middleware.js    # Global error handler
│   │   ├── requestLogger.middleware.js   # HTTP logging
│   │   └── cors.middleware.js            # CORS configuration
│   │
│   ├── routes/
│   │   ├── index.js                      # Route aggregator
│   │   ├── scrape.routes.js              # Scraping endpoints
│   │   ├── companies.routes.js           # Company CRUD
│   │   ├── italy.routes.js               # Italy-specific
│   │   ├── romania.routes.js             # Romania-specific
│   │   ├── linkedin.routes.js            # LinkedIn endpoints
│   │   ├── jobs.routes.js                # Job management
│   │   ├── export.routes.js              # Export endpoints
│   │   └── health.routes.js              # Health checks
│   │
│   ├── controllers/
│   │   ├── ScrapeController.js           # Scraping logic
│   │   ├── CompanyController.js          # Company operations
│   │   ├── ItalyController.js            # Italy operations
│   │   ├── RomaniaController.js          # Romania operations
│   │   ├── JobController.js              # Job management
│   │   ├── ExportController.js           # Export handling
│   │   └── HealthController.js           # Health checks
│   │
│   ├── models/
│   │   ├── Company.model.js              # Company schema
│   │   ├── Contact.model.js              # Contact schema
│   │   ├── ScrapingJob.model.js          # Job schema
│   │   ├── ScrapingLog.model.js          # Log schema
│   │   └── DataSource.model.js           # Source schema
│   │
│   ├── utils/
│   │   ├── logger.js                     # Winston setup
│   │   ├── retry.js                      # Retry with backoff
│   │   ├── sanitizer.js                  # XSS prevention
│   │   ├── validator.js                  # Custom validators
│   │   ├── formatter.js                  # Data formatters
│   │   ├── constants.js                  # App constants
│   │   ├── helpers.js                    # Helper functions
│   │   ├── italianHelpers.js             # Italy-specific
│   │   └── romanianHelpers.js            # Romania-specific
│   │
│   ├── app.js                            # Express app setup
│   └── server.js                         # Server entry point
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_create_companies.sql
│   │   ├── 002_create_contacts.sql
│   │   ├── 003_create_scraping_jobs.sql
│   │   ├── 004_create_scraping_logs.sql
│   │   ├── 005_create_data_sources.sql
│   │   ├── 006_create_indexes.sql
│   │   ├── 007_create_functions.sql
│   │   └── 008_create_triggers.sql
│   │
│   ├── seed/
│   │   ├── italy_sources.sql
│   │   ├── romania_sources.sql
│   │   ├── italy_regions.sql
│   │   └── romania_counties.sql
│   │
│   └── functions/
│       ├── deduplicate_companies.sql
│       ├── merge_company_data.sql
│       ├── calculate_data_quality.sql
│       └── update_search_vector.sql
│
├── data/
│   ├── selectors/
│   │   ├── linkedin.json                 # LinkedIn selectors
│   │   ├── italy/
│   │   │   ├── registro_imprese.json
│   │   │   ├── pagine_gialle.json
│   │   │   └── infocamere.json
│   │   └── romania/
│   │       ├── onrc.json
│   │       ├── listafirme.json
│   │       └── anis.json
│   │
│   ├── mappings/
│   │   ├── italy_regions.json
│   │   ├── romania_counties.json
│   │   ├── industries.json
│   │   └── company_sizes.json
│   │
│   └── validation/
│       ├── italy_tax_patterns.json
│       └── romania_tax_patterns.json
│
├── scripts/
│   ├── setup/
│   │   ├── init-database.js              # Initialize Supabase
│   │   ├── seed-sources.js               # Seed data sources
│   │   └── create-indexes.js             # Create DB indexes
│   │
│   ├── testing/
│   │   ├── test-italy-scrapers.js
│   │   ├── test-romania-scrapers.js
│   │   ├── test-linkedin.js
│   │   └── validate-data.js
│   │
│   ├── maintenance/
│   │   ├── cleanup-cache.js
│   │   ├── backup-database.js
│   │   └── update-sources.js
│   │
│   └── export/
│       ├── export-companies-csv.js
│       ├── export-statistics.js
│       └── generate-report.js
│
├── tests/
│   ├── unit/
│   │   ├── scrapers/
│   │   │   ├── base.test.js
│   │   │   ├── italy.test.js
│   │   │   └── romania.test.js
│   │   ├── parsers/
│   │   │   ├── company.test.js
│   │   │   └── contact.test.js
│   │   ├── services/
│   │   │   ├── supabase.test.js
│   │   │   ├── deduplication.test.js
│   │   │   └── enrichment.test.js
│   │   └── utils/
│   │       ├── validator.test.js
│   │       └── sanitizer.test.js
│   │
│   ├── integration/
│   │   ├── api.test.js
│   │   ├── scraping.test.js
│   │   ├── queue.test.js
│   │   └── database.test.js
│   │
│   └── e2e/
│       ├── italy-pipeline.test.js
│       └── romania-pipeline.test.js
│
├── docs/
│   ├── API_REFERENCE.md                  # Complete API docs
│   ├── ITALY_SOURCES.md                  # Italian sources guide
│   ├── ROMANIA_SOURCES.md                # Romanian sources guide
│   ├── DATA_SCHEMA.md                    # Database schema
│   ├── DEPLOYMENT.md                     # Deployment guide
│   ├── ARCHITECTURE.md                   # Architecture decisions
│   ├── LINKEDIN_INTEGRATION.md           # LinkedIn setup
│   ├── TROUBLESHOOTING.md                # Common issues
│   └── CONTRIBUTING.md                   # Development guide
│
├── .env.example                          # Environment template
├── .env.development
├── .env.production
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── package.json
├── package-lock.json
├── Dockerfile
├── docker-compose.yml
├── docker-compose.dev.yml
└── README.md
```

---

## 🎯 Target Data Sources

### 🇮🇹 Italy - Primary Sources (10 Sources)

#### **Tier 1: Official Registries**

**1. Registro Imprese (registroimprese.it)**
- **Type**: Official Italian Business Registry
- **Access**: Public, no authentication
- **Data Quality**: ⭐⭐⭐⭐⭐ (Authoritative)
- **Rate Limit**: 30 requests/minute
- **Coverage**: All registered Italian companies
- **Key Data**: 
  - Partita IVA (Tax ID)
  - REA Number
  - Legal name & trading names
  - Registered office address
  - Legal form (SRL, SPA, etc.)
  - Registration date
  - Share capital
  - Business activity (ATECO code)
- **Scraping Strategy**: Static HTML (Cheerio)
- **Challenges**: CAPTCHA on high volume, requires session management

**2. InfoCamere**
- **Type**: Chamber of Commerce database
- **Access**: Paid API + Public search
- **Data Quality**: ⭐⭐⭐⭐⭐
- **Coverage**: Complete registry data
- **Key Data**: Same as Registro Imprese + financial data

#### **Tier 2: Business Directories**

**3. Pagine Gialle (paginegialle.it)**
- **Type**: Italian Yellow Pages
- **Access**: Public
- **Data Quality**: ⭐⭐⭐⭐
- **Rate Limit**: 60 requests/minute
- **Categories**: 
  - Software house
  - Sviluppo software
  - Consulenza informatica
  - Web agency
  - Sviluppo app mobile
- **Key Cities**: Milano, Roma, Torino, Bologna, Firenze
- **Key Data**: Company name, address, phone, website, description
- **Scraping Strategy**: Static HTML with pagination

**4. Pagine Bianche (paginebianche.it)**
- **Type**: Italian White Pages (complementary to Gialle)
- **Access**: Public
- **Coverage**: Business contact information

#### **Tier 3: Tech Communities & Associations**

**5. Italian Tech Alliance**
- **Website**: italiantechalliance.com
- **Type**: Tech company association
- **Member Directory**: 200+ companies
- **Data Quality**: ⭐⭐⭐⭐

**6. Digital360 (digital360.it)**
- **Type**: IT industry portal
- **Company Directory**: Software & IT services
- **Data Quality**: ⭐⭐⭐⭐

**7. Startup Italia**
- **Website**: startupitalia.eu
- **Type**: Startup ecosystem platform
- **Coverage**: 500+ Italian startups
- **Focus**: Early-stage software companies

#### **Tier 4: Regional Directories**

**8. Assolombarda (Milan)**
- **Website**: assolombarda.it
- **Coverage**: Lombardy region (largest tech hub)
- **Member Companies**: 6,000+ (filter for IT)

**9. Lazio Innova (Rome)**
- **Website**: lazioinnova.it
- **Coverage**: Lazio region startups
- **Focus**: Innovation & tech

**10. Torino Wireless (Turin)**
- **Website**: torinowireless.it
- **Coverage**: Piedmont tech ecosystem
- **Member Directory**: Engineering & software

---

### 🇷🇴 Romania - Primary Sources (10 Sources)

#### **Tier 1: Official Registries**

**1. ONRC - Romanian Trade Registry (onrc.ro)**
- **Type**: Official government registry
- **Access**: Public search + Paid API
- **Data Quality**: ⭐⭐⭐⭐⭐ (Authoritative)
- **Rate Limit**: 30 requests/minute (public)
- **Coverage**: All Romanian companies
- **Key Data**:
  - CUI (Cod Unic de Identificare) - Tax ID
  - Registration number (J##/####/YYYY)
  - Company name
  - Legal form (SRL, SA, etc.)
  - Registered office
  - Share capital
  - CAEN code (industry classification)
  - Registration date
  - Legal representatives
- **CAEN Codes for Software**: 6201, 6202, 6209
- **Scraping Strategy**: Dynamic (requires JavaScript rendering)
- **Challenges**: Heavy JavaScript, CAPTCHA protection

**2. Termene.ro**
- **Type**: Business information database
- **Access**: Freemium (basic free, detailed paid)
- **Data Quality**: ⭐⭐⭐⭐⭐
- **Coverage**: Complete Romanian business data
- **Key Data**: Financial statements, legal history, connections

#### **Tier 2: Business Directories**

**3. Listafirme.ro**
- **Type**: Comprehensive company directory
- **Access**: Public
- **Data Quality**: ⭐⭐⭐⭐
- **Rate Limit**: 60 requests/minute
- **Categories**:
  - Dezvoltare software
  - Outsourcing IT
  - Consultanta IT
  - Web design
- **Key Cities**: București, Cluj-Napoca, Timișoara, Iași, Brașov
- **Scraping Strategy**: Static HTML with category filtering

**4. Firmeno.ro**
- **Type**: Alternative directory
- **Coverage**: Similar to Listafirme
- **Unique Data**: Company reviews, ratings

#### **Tier 3: IT Associations**

**5. ANIS - Romanian Software & Services Association (anis.ro)**
- **Type**: Industry association
- **Access**: Public member directory
- **Data Quality**: ⭐⭐⭐⭐⭐
- **Coverage**: 130+ member companies (major IT players)
- **Key Data**: 
  - Company profiles
  - Services offered
  - Employee ranges
  - International presence
- **Focus**: Established software companies

**6. Romanian Outsourcing Association**
- **Website**: outsourcing.ro
- **Coverage**: IT outsourcing companies
- **Member Directory**: 50+ companies

#### **Tier 4: Regional Ecosystems**

**7. Cluj IT Cluster (clujit.ro)**
- **Location**: Cluj-Napoca ("Silicon Valley of Romania")
- **Coverage**: 300+ IT companies in Cluj area
- **Data Quality**: ⭐⭐⭐⭐
- **Key Data**: Detailed company profiles, job postings

**8. Timișoara Tech Hub**
- **Coverage**: Western Romania tech scene
- **Companies**: 100+ in Timișoara region

**9. Iași Tech Community**
- **Coverage**: Moldavia region
- **Focus**: Growing tech ecosystem

#### **Tier 5: Startup & Innovation**

**10. Techsylvania (techsylvania.ro)**
- **Type**: Tech conference + community
- **Coverage**: Romanian startup ecosystem
- **Directory**: Exhibitors, sponsors, startups

---

### 🌐 International Platforms (3 Sources)

#### **1. LinkedIn**
- **Coverage**: Global, filterable by country
- **Access**: Requires authentication
- **Rate Limit**: 20-30 requests/hour (very strict)
- **Data Quality**: ⭐⭐⭐⭐⭐
- **Search Filters**:
  - Location: Italy / Romania
  - Industry: Software Development, IT Services
  - Company Size: 11-50, 51-200, 201-500, 501+
- **Key Data**:
  - Company name
  - Industry
  - Company size (employee range)
  - Headquarters
  - Founded year
  - Website
  - Description
  - Specialties
  - Employee listings
- **Scraping Strategies**:
  - **Option A**: Official LinkedIn API (requires partnership)
  - **Option B**: Puppeteer with stealth (slow, risk of ban)
  - **Option C**: Third-party APIs (Phantombuster, Apify)

#### **2. Crunchbase**
- **Coverage**: Global startups & tech companies
- **Access**: Freemium (limited free, paid API)
- **Focus**: Funding, investors, growth metrics
- **Key Data**: Funding rounds, investors, acquisitions

#### **3. Clutch.co**
- **Coverage**: Global B2B service providers
- **Focus**: Software development, IT services
- **Key Data**: Company reviews, ratings, portfolios

---

## 🗄️ Database Schema (Supabase)

### **Table: companies**

```sql
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

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for search_vector
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.company_name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.legal_name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.city, '')), 'C') ||
    setweight(to_tsvector('english', array_to_string(NEW.services, ' ')), 'C');
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_search_vector 
  BEFORE INSERT OR UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();
```

### **Table: company_contacts**

```sql
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
  
  CONSTRAINT valid_contact_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})
);

CREATE INDEX idx_contacts_company ON company_contacts(company_id);
CREATE INDEX idx_contacts_email ON company_contacts(email);
CREATE INDEX idx_contacts_primary ON company_contacts(is_primary) WHERE is_primary = TRUE;

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON company_contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### **Table: scraping_jobs**

```sql
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

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON scraping_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### **Table: scraping_logs**

```sql
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
```

### **Table: data_sources**

```sql
CREATE TABLE data_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Source Information
  name VARCHAR(255) NOT NULL UNIQUE,
  display_name VARCHAR(255),
  country VARCHAR(2), -- NULL for international sources
  url TEXT,
  platform_type VARCHAR(50), -- 'directory', 'registry', 'social', 'api'
  
  -- Technical Configuration
  scraper_class VARCHAR(100), -- Which scraper class to use
  scraper_strategy VARCHAR(50), -- 'static', 'dynamic', 'api', 'auth'
  requires_auth BOOLEAN DEFAULT FALSE,
  requires_proxy BOOLEAN DEFAULT FALSE,
  
  -- Rate Limiting
  rate_limit_per_minute INTEGER DEFAULT 60,
  rate_limit_per_hour INTEGER,
  rate_limit_per_day INTEGER,
  concurrent_requests INTEGER DEFAULT 1,
  
  -- Scheduling
  is_active BOOLEAN DEFAULT TRUE,
  scraping_frequency VARCHAR(50), -- 'daily', 'weekly', 'monthly'
  last_scraped_at TIMESTAMP,
  next_scrape_at TIMESTAMP,
  
  -- Performance Metrics
  success_rate DECIMAL(5, 2), -- Percentage
  avg_response_time_ms INTEGER,
  avg_companies_per_scrape INTEGER,
  total_companies_scraped INTEGER DEFAULT 0,
  
  -- Configuration
  config JSONB, -- Selectors, filters, auth details
  headers JSONB, -- Custom HTTP headers
  
  -- Status
  status VARCHAR(50) DEFAULT 'active', -- active, maintenance, deprecated
  health_score INTEGER CHECK (health_score BETWEEN 0 AND 100),
  last_error TEXT,
  error_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Notes
  notes TEXT
);

CREATE INDEX idx_sources_country ON data_sources(country);
CREATE INDEX idx_sources_active ON data_sources(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_sources_next_scrape ON data_sources(next_scrape_at) WHERE is_active = TRUE;

CREATE TRIGGER update_sources_updated_at BEFORE UPDATE ON data_sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### **Table: company_duplicates**

```sql
CREATE TABLE company_duplicates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Companies
  company_id_1 UUID REFERENCES companies(id) ON DELETE CASCADE,
  company_id_2 UUID REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Similarity Metrics
  similarity_score DECIMAL(5, 2), -- 0-100%
  matching_fields TEXT[], -- ['name', 'tax_id', 'website']
  
  -- Decision
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, rejected, merged
  resolution VARCHAR(50), -- 'keep_1', 'keep_2', 'merge', 'both_valid'
  merged_into UUID REFERENCES companies(id) ON DELETE SET NULL,
  
  -- Metadata
  detected_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  resolved_by VARCHAR(100),
  
  CONSTRAINT different_companies CHECK (company_id_1 != company_id_2),
  CONSTRAINT unique_pair UNIQUE(company_id_1, company_id_2)
);

CREATE INDEX idx_duplicates_status ON company_duplicates(status);
CREATE INDEX idx_duplicates_company1 ON company_duplicates(company_id_1);
CREATE INDEX idx_duplicates_company2 ON company_duplicates(company_id_2);
```

### **Table: enrichment_queue**

```sql
CREATE TABLE enrichment_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Enrichment Type
  enrichment_type VARCHAR(50), -- 'geocoding', 'linkedin', 'social', 'financial'
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending',
  priority INTEGER DEFAULT 0,
  
  -- Results
  result JSONB,
  error_message TEXT,
  
  -- Timing
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  
  CONSTRAINT unique_company_enrichment UNIQUE(company_id, enrichment_type)
);

CREATE INDEX idx_enrichment_status ON enrichment_queue(status);
CREATE INDEX idx_enrichment_priority ON enrichment_queue(priority DESC, created_at ASC);
```

---

## 📦 Dependencies & Libraries

### **package.json**

```json
{
  "name": "scraping-server-italy-romania",
  "version": "1.0.0",
  "description": "Web scraping server for Italian and Romanian software companies",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix",
    "format": "prettier --write \"src/**/*.js\"",
    "db:migrate": "node scripts/setup/init-database.js",
    "db:seed": "node scripts/setup/seed-sources.js",
    "scrape:italy": "node scripts/testing/test-italy-scrapers.js",
    "scrape:romania": "node scripts/testing/test-romania-scrapers.js",
    "export:csv": "node scripts/export/export-companies-csv.js",
    "worker": "node src/workers/scrapeWorker.js"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "express": "^4.18.2",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "compression": "^1.7.4",
    "cheerio": "^1.0.0-rc.12",
    "puppeteer": "^21.5.0",
    "puppeteer-extra": "^3.3.6",
    "puppeteer-extra-plugin-stealth": "^2.11.2",
    "puppeteer-extra-plugin-adblocker": "^2.13.6",
    "playwright": "^1.40.0",
    "axios": "^1.6.2",
    "got": "^13.0.0",
    "tough-cookie": "^4.1.3",
    "jsdom": "^23.0.1",
    "bull": "^4.12.0",
    "ioredis": "^5.3.2",
    "redis": "^4.6.11",
    "joi": "^17.11.0",
    "validator": "^13.11.0",
    "xss": "^1.0.14",
    "dompurify": "^3.0.6",
    "libphonenumber-js": "^1.10.51",
    "email-validator": "^2.0.4",
    "iban": "^0.0.14",
    "country-iso": "^1.1.2",
    "i18n-iso-countries": "^7.7.0",
    "winston": "^3.11.0",
    "morgan": "^1.10.0",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "express-async-handler": "^1.2.0",
    "lodash": "^4.17.21",
    "moment": "^2.29.4",
    "moment-timezone": "^0.5.43",
    "uuid": "^9.0.1",
    "natural": "^6.10.1",
    "string-similarity": "^4.0.4",
    "csv-writer": "^1.6.0",
    "csv-parser": "^3.0.0",
    "fast-csv": "^5.0.1",
    "json2csv": "^6.0.0",
    "node-geocoder": "^4.3.0",
    "rotating-proxy": "^2.0.0",
    "proxy-chain": "^2.4.0",
    "rate-limiter-flexible": "^3.0.8",
    "p-queue": "^8.0.1",
    "p-retry": "^6.1.0",
    "bottleneck": "^2.19.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "eslint": "^8.55.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-plugin-import": "^2.29.1",
    "prettier": "^3.1.1",
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### **Library Usage Guide**

#### **Web Scraping**
- **Cheerio**: Fast HTML parsing for static content (80% of sources)
- **Puppeteer**: Full browser automation for JavaScript-heavy sites (15%)
- **Playwright**: Alternative to Puppeteer, better for testing (5%)
- **Axios/Got**: HTTP requests, cookie management

#### **Queue & Background Jobs**
- **Bull**: Redis-backed queue system
- **IORedis**: High-performance Redis client
- **p-queue**: In-memory queue for rate limiting
- **Bottleneck**: Rate limiting per source

#### **Data Validation**
- **Joi**: Schema validation for API requests
- **Validator.js**: String validation (emails, URLs, etc.)
- **libphonenumber-js**: International phone number validation
- **IBAN**: European bank account validation

#### **Data Processing**
- **Natural**: NLP for text similarity
- **string-similarity**: Fuzzy matching for deduplication
- **lodash**: Utility functions
- **moment/moment-timezone**: Date/time handling

#### **Export & Import**
- **json2csv**: JSON to CSV conversion
- **csv-writer**: Efficient CSV writing
- **fast-csv**: Fast CSV parsing

#### **Utilities**
- **Winston**: Structured logging
- **Morgan**: HTTP request logging
- **UUID**: Unique identifier generation

---

## ⚙️ Configuration Files

### **.env.example**

```bash
# Server Configuration
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000
API_VERSION=v1

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Queue Configuration
QUEUE_CONCURRENCY=5
QUEUE_MAX_RETRIES=3
QUEUE_RETRY_DELAY=5000

# LinkedIn Configuration (Choose one strategy)
# Option A: Official API
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_ACCESS_TOKEN=

# Option B: Scraping with Authentication
LINKEDIN_EMAIL=
LINKEDIN_PASSWORD=
LINKEDIN_SCRAPING_ENABLED=false

# Proxy Configuration
USE_PROXY=false
ITALY_PROXY_URL=
ROMANIA_PROXY_URL=
PROXY_USERNAME=
PROXY_PASSWORD=

# Rate Limiting (requests per minute)
ITALY_RATE_LIMIT=60
ROMANIA_RATE_LIMIT=60
LINKEDIN_RATE_LIMIT=20
GLOBAL_RATE_LIMIT=100

# Scraping Configuration
DEFAULT_TIMEOUT=30000
DEFAULT_USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
PUPPETEER_HEADLESS=true
PUPPETEER_ARGS=--no-sandbox,--disable-setuid-sandbox

# Italy-Specific Settings
ITALY_FOCUS_REGIONS=Lombardia,Lazio,Piemonte,Emilia-Romagna
ITALY_FOCUS_CITIES=Milano,Roma,Torino,Bologna

# Romania-Specific Settings
ROMANIA_FOCUS_COUNTIES=București,Cluj,Timiș,Iași
ROMANIA_FOCUS_CITIES=București,Cluj-Napoca,Timișoara,Iași

# Data Quality
MIN_DATA_QUALITY_SCORE=50
ENABLE_AUTO_ENRICHMENT=true
ENABLE_AUTO_DEDUPLICATION=true

# Geocoding (Optional)
GOOGLE_MAPS_API_KEY=
OPENCAGE_API_KEY=

# Monitoring & Logging
LOG_LEVEL=info
LOG_TO_FILE=true
LOG_FILE_PATH=./logs/app.log

# Sentry (Error Tracking - Optional)
SENTRY_DSN=

# API Security
API_KEY=your-secret-api-key
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=7d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
CORS_CREDENTIALS=true

# Export Configuration
EXPORT_MAX_ROWS=10000
EXPORT_PATH=./exports

# Development
DEBUG=false
MOCK_SCRAPERS=false
```

### **src/config/index.js**

```javascript
require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  apiVersion: process.env.API_VERSION || 'v1',
  
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
  },
  
  queue: {
    concurrency: parseInt(process.env.QUEUE_CONCURRENCY, 10) || 5,
    maxRetries: parseInt(process.env.QUEUE_MAX_RETRIES, 10) || 3,
    retryDelay: parseInt(process.env.QUEUE_RETRY_DELAY, 10) || 5000,
  },
  
  scraping: {
    timeout: parseInt(process.env.DEFAULT_TIMEOUT, 10) || 30000,
    userAgent: process.env.DEFAULT_USER_AGENT,
    puppeteerHeadless: process.env.PUPPETEER_HEADLESS !== 'false',
    puppeteerArgs: process.env.PUPPETEER_ARGS?.split(',') || [],
  },
  
  rateLimits: {
    italy: parseInt(process.env.ITALY_RATE_LIMIT, 10) || 60,
    romania: parseInt(process.env.ROMANIA_RATE_LIMIT, 10) || 60,
    linkedin: parseInt(process.env.LINKEDIN_RATE_LIMIT, 10) || 20,
    global: parseInt(process.env.GLOBAL_RATE_LIMIT, 10) || 100,
  },
  
  countries: {
    italy: {
      focusRegions: process.env.ITALY_FOCUS_REGIONS?.split(',') || [],
      focusCities: process.env.ITALY_FOCUS_CITIES?.split(',') || [],
    },
    romania: {
      focusCounties: process.env.ROMANIA_FOCUS_COUNTIES?.split(',') || [],
      focusCities: process.env.ROMANIA_FOCUS_CITIES?.split(',') || [],
    },
  },
  
  dataQuality: {
    minScore: parseInt(process.env.MIN_DATA_QUALITY_SCORE, 10) || 50,
    autoEnrichment: process.env.ENABLE_AUTO_ENRICHMENT === 'true',
    autoDeduplication: process.env.ENABLE_AUTO_DEDUPLICATION === 'true',
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    toFile: process.env.LOG_TO_FILE === 'true',
    filePath: process.env.LOG_FILE_PATH || './logs/app.log',
  },
  
  security: {
    apiKey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION || '7d',
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },
};
```

---

## 🛠️ Implementation Details

### **Scraper Base Class Pattern**

```javascript
// src/scrapers/base/BaseScraper.js

class BaseScraper {
  constructor(config) {
    this.config = config;
    this.name = this.constructor.name;
    this.results = [];
    this.errors = [];
  }
  
  // Abstract methods (must be implemented by subclasses)
  async scrape() {
    throw new Error('scrape() must be implemented');
  }
  
  async parse(html) {
    throw new Error('parse() must be implemented');
  }
  
  // Shared utility methods
  async retry(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await this.sleep(1000 * Math.pow(2, i)); // Exponential backoff
      }
    }
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  log(level, message, metadata = {}) {
    // Logging implementation
  }
}

module.exports = BaseScraper;
```

### **Country-Specific Scraper Example**

```javascript
// src/scrapers/italy/PagineGialleScraper.js

const cheerio = require('cheerio');
const axios = require('axios');
const BaseScraper = require('../base/BaseScraper');

class PagineGialleScraper extends BaseScraper {
  constructor(config) {
    super(config);
    this.baseUrl = 'https://www.paginegialle.it';
    this.categories = [
      'software-house',
      'sviluppo-software',
      'consulenza-informatica'
    ];
    this.cities = config.cities || ['Milano', 'Roma', 'Torino'];
  }
  
  async scrape() {
    const companies = [];
    
    for (const category of this.categories) {
      for (const city of this.cities) {
        this.log('info', `Scraping ${category} in ${city}`);
        
        const searchUrl = `${this.baseUrl}/ricerca/${category}/${city}`;
        const pageCompanies = await this.scrapePage(searchUrl);
        companies.push(...pageCompanies);
        
        await this.sleep(2000); // Rate limiting
      }
    }
    
    return companies;
  }
  
  async scrapePage(url) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const companies = [];
    
    $('.vcard').each((i, element) => {
      const company = this.parseCompany($, element);
      if (company) companies.push(company);
    });
    
    return companies;
  }
  
  parseCompany($, element) {
    const $el = $(element);
    
    return {
      company_name: $el.find('.fn').text().trim(),
      address: $el.find('.adr').text().trim(),
      city: this.extractCity($el.find('.adr').text()),
      phone: $el.find('.tel').text().trim(),
      website: $el.find('.url').attr('href'),
      source_platform: 'pagine_gialle',
      source_url: $el.find('a').first().attr('href'),
      country: 'IT',
    };
  }
  
  extractCity(address) {
    // Extract city from address string
    const match = address.match(/\d{5}\s+([A-Za-zàèéìòù\s]+)/);
    return match ? match[1].trim() : null;
  }
}

module.exports = PagineGialleScraper;
```

### **Data Pipeline Flow**

```
1. SCRAPING
   ├─> ScraperFactory creates appropriate scraper
   ├─> Scraper fetches raw HTML/data
   ├─> Parser extracts structured data
   └─> Raw data stored temporarily

2. VALIDATION
   ├─> Schema validation (Joi)
   ├─> Field-level validation (email, phone, tax ID)
   ├─> Data quality scoring
   └─> Invalid data flagged

3. NORMALIZATION
   ├─> Standardize formats (phone, address)
   ├─> Country-specific rules applied
   ├─> Industry classification
   └─> Company size categorization

4. DEDUPLICATION
   ├─> Tax ID exact match
   ├─> Fuzzy name matching (80% threshold)
   ├─> Website domain comparison
   └─> Merge or flag duplicates

5. ENRICHMENT
   ├─> Geocoding (address → lat/lng)
   ├─> Social media profile linking
   ├─> Industry enrichment
   └─> Contact discovery

6. STORAGE
   ├─> Insert into Supabase
   ├─> Update search vectors
   ├─> Cache in Redis
   └─> Log metadata
```

---

## 🌐 API Endpoints

### **Base URL**: `http://localhost:3000/api/v1`

### **Authentication**
All endpoints require API key in header:
```
X-API-Key: your-secret-api-key
```

### **Scraping Endpoints**

#### **POST /scrape/italy**
Start Italy scraping job
```json
Request:
{
  "sources": ["pagine_gialle", "registro_imprese"],
  "cities": ["Milano", "Roma"],
  "async": true
}

Response:
{
  "success": true,
  "job_id": "uuid",
  "message": "Italy scraping job queued",
  "estimated_time": "15 minutes"
}
```

#### **POST /scrape/romania**
Start Romania scraping job

#### **POST /scrape/linkedin**
Scrape LinkedIn for specific country
```json
{
  "country": "IT",
  "filters": {
    "company_size": ["51-200", "201-500"],
    "industry": ["Software Development"]
  }
}
```

#### **GET /scrape/status/:jobId**
Get job status and progress

### **Company Endpoints**

#### **GET /companies**
List companies with filters
```
Query params:
- country: IT | RO
- city: string
- industry: string
- min_employees: number
- max_employees: number
- has_website: boolean
- page: number
- limit: number
```

#### **GET /companies/:id**
Get single company details

#### **PUT /companies/:id**
Update company information

#### **DELETE /companies/:id**
Delete company

#### **GET /companies/export/csv**
Export companies to CSV

### **Statistics Endpoints**

#### **GET /stats/italy**
Italian companies statistics

#### **GET /stats/romania**
Romanian companies statistics

#### **GET /stats/overview**
Overall platform statistics

---

## ⏱️ 1-Day Development Timeline

### **Hour 0-2: Foundation** ✅
- [ ] Initialize Git repository
- [ ] Create project structure
- [ ] Install dependencies
- [ ] Setup Supabase project
- [ ] Run database migrations
- [ ] Configure environment variables
- [ ] Setup Redis locally
- [ ] Test database connection

### **Hour 2-4: Core Scraping Engine** 🔧
- [ ] Implement BaseScraper class
- [ ] Create ScraperFactory
- [ ] Build StaticScraper (Cheerio)
- [ ] Build DynamicScraper (Puppeteer)
- [ ] Implement retry logic
- [ ] Add rate limiting utilities

### **Hour 4-7: Italy Scrapers** 🇮🇹
- [ ] PagineGialleScraper (Hour 4-5)
- [ ] RegistroImpreseScraper (Hour 5-6)
- [ ] Test with real Italian websites (Hour 6-7)
- [ ] Fix bugs and adjust selectors

### **Hour 7-10: Romania Scrapers** 🇷🇴
- [ ] ListaFirmeScraper (Hour 7-8)
- [ ] TermeneScraper or ONRCScraper (Hour 8-9)
- [ ] Test with real Romanian websites (Hour 9-10)
- [ ] Fix bugs and adjust selectors

### **Hour 10-12: Data Processing** 📊
- [ ] CompanyDataParser
- [ ] DeduplicationService
- [ ] ValidationService
- [ ] SupabaseService (CRUD)
- [ ] Test data pipeline end-to-end

### **Hour 12-14: Queue & Workers** 📋
- [ ] Setup Bull queue
- [ ] Implement scrape worker
- [ ] Job status tracking
- [ ] Progress reporting
- [ ] Error handling

### **Hour 14-16: API Layer** 🔌
- [ ] Express routes setup
- [ ] Controllers implementation
- [ ] Middleware (auth, validation)
- [ ] Error handling
- [ ] API testing with Postman

### **Hour 16-18: LinkedIn Integration** 💼
- [ ] Choose strategy (API vs scraping)
- [ ] Implement LinkedInScraper
- [ ] Authentication handling
- [ ] Rate limiting
- [ ] Test with sample data

### **Hour 18-20: Testing & Data Validation** 🧪
- [ ] Run Italy scrapers (production test)
- [ ] Run Romania scrapers (production test)
- [ ] Validate data quality
- [ ] Check deduplication
- [ ] Export sample CSV

### **Hour 20-22: Documentation & Polish** ✨
- [ ] API documentation
- [ ] README with setup instructions
- [ ] Environment variables guide
- [ ] Deployment checklist
- [ ] Code cleanup

### **Hour 22-24: Buffer & Optimization** 🛡️
- [ ] Performance tuning
- [ ] Error handling improvements
- [ ] Add additional sources if time permits
- [ ] Final integration testing
- [ ] Prepare for deployment
- [ ] Data quality review

---

## 🧪 Testing Strategy

### **Unit Tests**

```javascript
// tests/unit/parsers/company.test.js
describe('CompanyDataParser', () => {
  test('should parse Italian company data correctly', () => {
    const rawData = {
      company_name: 'Tech Italia SRL',
      tax_id: 'IT12345678901',
      // ...
    };
    
    const parsed = CompanyDataParser.parse(rawData);
    expect(parsed.country).toBe('IT');
    expect(parsed.tax_id).toBe('12345678901');
  });
  
  test('should validate Italian Partita IVA format', () => {
    expect(TaxIdParser.validateItalianVAT('12345678901')).toBe(true);
    expect(TaxIdParser.validateItalianVAT('123')).toBe(false);
  });
});
```

### **Integration Tests**

```javascript
// tests/integration/scraping.test.js
describe('Italy Scraping Integration', () => {
  test('should scrape Pagine Gialle and save to database', async () => {
    const scraper = new PagineGialleScraper({ cities: ['Milano'] });
    const companies = await scraper.scrape();
    
    expect(companies.length).toBeGreaterThan(0);
    expect(companies[0]).toHaveProperty('company_name');
    expect(companies[0]).toHaveProperty('country', 'IT');
    
    // Save to database
    const saved = await SupabaseService.createCompany(companies[0]);
    expect(saved).toHaveProperty('id');
  }, 30000);
});
```

### **End-to-End Tests**

```javascript
// tests/e2e/italy-pipeline.test.js
describe('Italy Full Pipeline E2E', () => {
  test('should complete full scraping pipeline for Italy', async () => {
    // 1. Create job
    const job = await createScrapingJob({
      type: 'italy_full',
      sources: ['pagine_gialle']
    });
    
    // 2. Process job
    await processScrapingJob(job.id);
    
    // 3. Verify results
    const companies = await SupabaseService.getCompaniesByCountry('IT');
    expect(companies.length).toBeGreaterThan(0);
    
    // 4. Check data quality
    const avgScore = companies.reduce((sum, c) => sum + c.data_quality_score, 0) / companies.length;
    expect(avgScore).toBeGreaterThan(50);
  }, 120000);
});
```

---

## 🚀 Deployment Guide

### **Prerequisites**
- Node.js 18+ installed
- Supabase project created
- Redis instance (local or cloud)
- Domain/server for deployment

### **Local Development Setup**

```bash
# 1. Clone repository
git clone <repo-url>
cd scraping-server

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your credentials

# 4. Initialize database
npm run db:migrate
npm run db:seed

# 5. Start Redis (if local)
redis-server

# 6. Start development server
npm run dev

# 7. Start worker (in separate terminal)
npm run worker
```

### **Production Deployment (Docker)**

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Install Chromium for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy application
COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - REDIS_HOST=redis
    depends_on:
      - redis
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs
      - ./exports:/app/exports

  worker:
    build: .
    command: node src/workers/scrapeWorker.js
    environment:
      - NODE_ENV=production
      - REDIS_HOST=redis
    depends_on:
      - redis
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped

volumes:
  redis-data:
```

### **Deployment Checklist**

- [ ] Environment variables configured
- [ ] Supabase migrations run
- [ ] Redis connection tested
- [ ] API key generated and secured
- [ ] CORS origins configured
- [ ] Rate limits configured
- [ ] Logging configured
- [ ] Error monitoring setup (Sentry)
- [ ] SSL certificate installed
- [ ] Firewall rules configured
- [ ] Backup strategy implemented
- [ ] Monitoring dashboards setup

---

## 📊 Monitoring & Maintenance

### **Key Metrics to Monitor**

1. **Scraping Performance**
   - Jobs completed/hour
   - Average scraping time per source
   - Success rate by source
   - Error rate

2. **Data Quality**
   - Average data quality score
   - Companies with missing fields
   - Duplicate detection rate
   - Enrichment success rate

3. **System Health**
   - API response times
   - Queue length
   - Redis memory usage
   - Database connections
   - CPU/Memory usage

4. **Business Metrics**
   - Total companies scraped
   - New companies per day
   - Coverage by city/region
   - Data freshness

### **Monitoring Tools**

```javascript
// src/services/MonitoringService.js
class MonitoringService {
  async getSystemHealth() {
    return {
      api: await this.checkApiHealth(),
      database: await this.checkDatabaseHealth(),
      redis: await this.checkRedisHealth(),
      queue: await this.checkQueueHealth(),
      scrapers: await this.checkScrapersHealth()
    };
  }
  
  async checkDatabaseHealth() {
    const { data, error } = await supabase
      .from('companies')
      .select('count');
    
    return {
      status: error ? 'unhealthy' : 'healthy',
      totalCompanies: data?.[0]?.count || 0,
      responseTime: '...'
    };
  }
  
  async getScrapingStatistics(period = '24h') {
    const stats = await supabase
      .from('scraping_jobs')
      .select('status, country, job_type')
      .gte('created_at', moment().subtract(24, 'hours').toISOString());
    
    return {
      total: stats.data.length,
      completed: stats.data.filter(j => j.status === 'completed').length,
      failed: stats.data.filter(j => j.status === 'failed').length,
      byCountry: this.groupBy(stats.data, 'country')
    };
  }
}
```

### **Automated Maintenance Tasks**

```javascript
// scripts/maintenance/daily-maintenance.js

// Run daily at 3 AM
async function dailyMaintenance() {
  // 1. Clean old logs (>30 days)
  await cleanOldLogs(30);
  
  // 2. Update data source health scores
  await updateSourceHealthScores();
  
  // 3. Identify stale companies (not updated in 90 days)
  await flagStaleCompanies(90);
  
  // 4. Generate daily report
  await generateDailyReport();
  
  // 5. Backup database
  await backupDatabase();
  
  // 6. Clear Redis cache
  await clearExpiredCache();
}
```

---

## 🔐 Security & Compliance

### **Data Protection**

1. **GDPR Compliance (EU)**
   - Data minimization: Only collect necessary fields
   - Right to erasure: API endpoint to delete companies
   - Data portability: Export functionality
   - Consent: Only public business data
   - Privacy by design: Encrypted connections

2. **CCPA Compliance (if applicable)**
   - Transparency: Document what data is collected
   - Opt-out mechanism
   - Data deletion on request

### **Security Best Practices**

```javascript
// Implemented Security Measures

1. API Authentication
   - API key required for all endpoints
   - Rate limiting per API key
   - JWT for session management

2. Input Validation
   - Joi schema validation
   - SQL injection prevention (parameterized queries)
   - XSS prevention (sanitization)
   - CSRF protection

3. Data Encryption
   - HTTPS only in production
   - Encrypted environment variables
   - Secure cookie flags

4. Access Control
   - Role-based access (if multi-user)
   - Supabase Row Level Security (RLS)
   - API key rotation

5. Error Handling
   - Never expose stack traces in production
   - Generic error messages to clients
   - Detailed logging server-side

6. Dependencies
   - Regular npm audit
   - Automated dependency updates
   - Vulnerability scanning
```

### **Legal Considerations**

1. **Web Scraping Legality**
   - Only scrape publicly available data
   - Respect robots.txt
   - Honor rate limits
   - Don't bypass authentication
   - Commercial use disclaimer

2. **Terms of Service**
   - Review each source's ToS
   - LinkedIn: Use official API when possible
   - Avoid aggressive scraping
   - Implement polite scraping (delays, user agents)

3. **Data Usage**
   - Business information is generally public
   - Contact info: Use responsibly
   - No reselling of raw data
   - Attribution to sources

---

## 📈 Performance Optimization

### **Caching Strategy**

```javascript
// src/services/CacheService.js
class CacheService {
  // Cache company data for 24 hours
  async cacheCompany(companyId, data) {
    await redis.setex(
      `company:${companyId}`,
      86400, // 24 hours
      JSON.stringify(data)
    );
  }
  
  // Cache search results for 1 hour
  async cacheSearchResults(queryHash, results) {
    await redis.setex(
      `search:${queryHash}`,
      3600, // 1 hour
      JSON.stringify(results)
    );
  }
  
  // Cache scraped pages for 7 days
  async cacheScrapedPage(url, html) {
    await redis.setex(
      `page:${hash(url)}`,
      604800, // 7 days
      html
    );
  }
}
```

### **Database Optimization**

```sql
-- Add composite indexes for common queries
CREATE INDEX idx_companies_country_city ON companies(country, city);
CREATE INDEX idx_companies_industry_size ON companies(industry, company_size);

-- Partial indexes for active companies
CREATE INDEX idx_active_companies ON companies(id) WHERE is_active = TRUE;

-- Optimize full-text search
CREATE INDEX idx_companies_search_gin ON companies USING GIN(search_vector);

-- Partition large tables by country
CREATE TABLE companies_it PARTITION OF companies FOR VALUES IN ('IT');
CREATE TABLE companies_ro PARTITION OF companies FOR VALUES IN ('RO');
```

### **Scraping Optimization**

```javascript
// Parallel scraping with concurrency control
const pQueue = require('p-queue');

class OptimizedScraper {
  constructor() {
    this.queue = new pQueue({ concurrency: 5 });
  }
  
  async scrapeMultipleSources(sources) {
    const results = await Promise.all(
      sources.map(source => 
        this.queue.add(() => this.scrapeSingle(source))
      )
    );
    return results.flat();
  }
  
  // Use connection pooling
  async fetchWithPool(url) {
    const agent = new http.Agent({
      keepAlive: true,
      maxSockets: 10
    });
    return axios.get(url, { httpAgent: agent });
  }
}
```

---

## 📊 Expected Results After 1 Day

### **Italy Data Collection**

| Metric | Target | Notes |
|--------|--------|-------|
| Total Companies | 1,500-2,500 | Depends on sources implemented |
| Data Quality Avg | 70%+ | With basic enrichment |
| Unique Sources | 3-5 | Pagine Gialle, Registro Imprese, etc. |
| Cities Covered | 5-10 | Focus on major tech hubs |
| With Tax ID | 60%+ | From official registries |
| With Website | 50%+ | Variable by source |
| With Email | 30%+ | Limited availability |
| With Phone | 70%+ | High from directories |

### **Romania Data Collection**

| Metric | Target | Notes |
|--------|--------|-------|
| Total Companies | 1,500-2,500 | Similar to Italy |
| Data Quality Avg | 70%+ | With basic enrichment |
| Unique Sources | 3-5 | Lista Firme, ONRC, ANIS |
| Cities Covered | 5-10 | Bucharest, Cluj, Timișoara, etc. |
| With CUI | 70%+ | Better registry access |
| With Website | 50%+ | Variable by source |
| With Email | 30%+ | Limited availability |
| With Phone | 70%+ | High from directories |

### **LinkedIn Enhancement**

| Metric | Target | Notes |
|--------|--------|-------|
| Total Profiles | 200-500 | Rate limited |
| Enhanced Companies | 150-300 | Matching existing data |
| New Discoveries | 50-200 | Not in other sources |
| Employee Counts | 80%+ | Primary LinkedIn value |
| Descriptions | 90%+ | Usually complete |

### **System Performance**

| Metric | Target | Actual |
|--------|--------|--------|
| API Response Time | < 200ms | Monitor |
| Scraping Speed | 100+ companies/hour | Varies by source |
| Queue Processing | 50+ jobs/hour | Concurrent workers |
| Cache Hit Rate | > 60% | After initial scraping |
| Error Rate | < 5% | Target for production |
| Uptime | 99%+ | During 24h period |

---

## 🔄 Post-Launch Roadmap

### **Week 1: Stabilization**
- Monitor error rates
- Fix critical bugs
- Optimize slow scrapers
- Improve data quality
- Add missing fields

### **Week 2: Enhancement**
- Add more data sources (5+ per country)
- Implement advanced deduplication
- Add automatic data enrichment
- Improve geocoding accuracy
- Add company logos

### **Week 3: Features**
- Add data change tracking
- Implement company relationships
- Add financial data scraping
- Create company scoring algorithm
- Add email verification

### **Week 4: Scale**
- Add more countries (Spain, Germany)
- Implement distributed scraping
- Add ML-based data extraction
- Create data quality dashboard
- Implement A/B testing for scrapers

---

## 🆘 Troubleshooting Guide

### **Common Issues**

#### **1. Scraper Returns Empty Results**
```
Symptoms: Scraper completes but finds 0 companies
Causes:
  - Website structure changed
  - Selectors outdated
  - IP blocked
  - Rate limit hit

Solutions:
  - Inspect website manually
  - Update selectors in config
  - Use proxy
  - Increase delays between requests
```

#### **2. High Memory Usage**
```
Symptoms: Process crashes, slow performance
Causes:
  - Too many concurrent Puppeteer instances
  - Memory leaks in scraper
  - Large result sets not paginated

Solutions:
  - Reduce queue concurrency
  - Close Puppeteer instances properly
  - Implement pagination
  - Stream results instead of loading all
```

#### **3. Duplicate Companies**
```
Symptoms: Same company appears multiple times
Causes:
  - Deduplication not running
  - Different name formats
  - Missing tax IDs

Solutions:
  - Run manual deduplication script
  - Improve fuzzy matching threshold
  - Enhance name normalization
  - Prioritize sources with tax IDs
```

#### **4. LinkedIn Scraping Fails**
```
Symptoms: LinkedIn scraper returns errors
Causes:
  - Account banned
  - Rate limit exceeded
  - CAPTCHA triggered
  - Authentication expired

Solutions:
  - Use official API
  - Implement longer delays (5-10 min between requests)
  - Use residential proxies
  - Rotate LinkedIn accounts
  - Consider third-party services
```

#### **5. Slow Database Queries**
```
Symptoms: API endpoints timeout
Causes:
  - Missing indexes
  - Full table scans
  - Unoptimized queries

Solutions:
  - Add indexes on commonly queried fields
  - Use EXPLAIN ANALYZE to identify bottlenecks
  - Implement pagination
  - Add database query caching
```

---

## 📚 Additional Resources

### **Documentation Links**
- [Supabase Documentation](https://supabase.com/docs)
- [Puppeteer Documentation](https://pptr.dev/)
- [Cheerio Documentation](https://cheerio.js.org/)
- [Bull Queue Documentation](https://github.com/OptimalBits/bull)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

### **Useful Tools**
- [Selector Gadget](https://selectorgadget.com/) - CSS selector helper
- [Postman](https://www.postman.com/) - API testing
- [DBeaver](https://dbeaver.io/) - Database management
- [Redis Commander](https://joeferner.github.io/redis-commander/) - Redis GUI
- [Bull Board](https://github.com/felixmosh/bull-board) - Queue dashboard

### **Learning Resources**
- Web Scraping Best Practices
- Anti-Detection Techniques
- Data Quality Management
- ETL Pipeline Design
- RESTful API Design

---

## 🎓 Development Best Practices

### **Code Style**
```javascript
// Use descriptive variable names
const italianCompanies = await scrapeItaly(); // Good
const data = await scrape(); // Bad

// Handle errors explicitly
try {
  const result = await riskyOperation();
} catch (error) {
  logger.error('Operation failed', { error: error.message });
  throw new CustomError('Friendly error message');
}

// Use async/await over callbacks
async function fetchData() {
  const data = await api.get('/endpoint');
  return processData(data);
}

// Comment complex logic
// Extract VAT number from Italian tax ID format (IT + 11 digits)
const vatNumber = taxId.replace(/^IT/, '');
```

### **Git Workflow**
```bash
# Feature branches
git checkout -b feature/romania-onrc-scraper
git commit -m "feat: add ONRC scraper for Romania"
git push origin feature/romania-onrc-scraper

# Commit message format
# <type>: <description>
# Types: feat, fix, docs, style, refactor, test, chore
```

### **Environment Management**
```bash
# Never commit .env files
# Use different env files per environment
.env.development
.env.staging
.env.production

# Load appropriate env
NODE_ENV=production node src/server.js
```

---

## ✅ Final Checklist

### **Before Going Live**
- [ ] All environment variables configured
- [ ] Database migrations run successfully
- [ ] All scrapers tested with real data
- [ ] API endpoints tested (Postman/curl)
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Monitoring setup
- [ ] Backup strategy in place
- [ ] Documentation complete
- [ ] Security review completed
- [ ] Performance testing done
- [ ] Legal review (ToS compliance)

### **Launch Day**
- [ ] Deploy to production server
- [ ] Run initial scraping jobs
- [ ] Monitor error logs
- [ ] Check data quality
- [ ] Verify API availability
- [ ] Test critical workflows
- [ ] Document any issues
- [ ] Plan immediate fixes

### **Post-Launch (Week 1)**
- [ ] Daily monitoring of metrics
- [ ] Fix critical bugs
- [ ] Optimize slow operations
- [ ] Collect user feedback
- [ ] Plan feature enhancements
- [ ] Schedule regular scraping jobs
- [ ] Review data accuracy
- [ ] Update documentation

---

## 🎯 Success Criteria

**The project is successful if after 24 hours:**

✅ **Functionality**
- Italy scrapers collect 1,500+ companies
- Romania scrapers collect 1,500+ companies
- API endpoints respond correctly
- Queue processes jobs reliably
- Data exports to CSV

✅ **Quality**
- Average data quality score > 70%
- Duplicate rate < 5%
- Error rate < 5%
- API response time < 500ms

✅ **Coverage**
- 3+ Italian sources operational
- 3+ Romanian sources operational
- Major cities covered in both countries
- Key data fields populated (name, city, website)

✅ **Infrastructure**
- Supabase database functioning
- Redis caching working
- Queue processing stable
- Logs being written
- Monitoring operational

---

## 📞 Support & Contact

### **Getting Help**
- Check documentation first
- Review troubleshooting guide
- Check GitHub issues
- Contact development team

### **Reporting Bugs**
```markdown
**Bug Report Template**
- Title: Brief description
- Environment: Development/Production
- Steps to reproduce
- Expected behavior
- Actual behavior
- Error messages/logs
- Screenshots (if applicable)
```

### **Feature Requests**
```markdown
**Feature Request Template**
- Title: Feature name
- Problem it solves
- Proposed solution
- Alternative solutions
- Priority: High/Medium/Low
```

---

## 🎉 Conclusion

This documentation provides a complete blueprint for building a production-ready web scraping server for Italian and Romanian software companies in 24 hours. The system is designed to be:

- **Scalable**: Handle thousands of companies across multiple sources
- **Maintainable**: Clean architecture with separation of concerns
- **Reliable**: Error handling, retries, monitoring
- **Performant**: Caching, queue processing, database optimization
- **Compliant**: GDPR-aware, respects robots.txt, rate limiting

**Next Steps:**
1. Review this documentation thoroughly
2. Set up development environment
3. Follow the 24-hour timeline
4. Test each component as you build
5. Deploy and monitor

**Good luck with your scraping project! 🚀**

---

*Last Updated: 2025*
*Version: 1.0.0*
*Status: Ready for Implementation* 