# Web Scraping Server - Italy & Romania Software Companies

A production-ready Node.js web scraping server designed to extract comprehensive software company data from Italy and Romania, targeting both international platforms (LinkedIn, Crunchbase) and country-specific business registries.

## 🎯 Features

- **Multi-Source Scraping**: 10+ data sources per country
- **Crunchbase Integration**: Startup and funding data via API
- **Country-Specific Data**: Normalized for Italian and Romanian business standards
- **Automatic Deduplication**: Smart duplicate detection and merging
- **RESTful API**: Comprehensive endpoints for data access
- **Queue Processing**: Background job processing with Bull
- **Real-time Progress**: Job status tracking and monitoring
- **Data Export**: CSV/JSON export capabilities
- **Proxy Support**: Country-specific proxy configuration
- **GDPR Compliant**: Secure data handling

## 🏗️ Architecture

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

## 📊 Data Sources

### 🇮🇹 Italy Sources
- **Registro Imprese** - Official Italian Business Registry
- **Pagine Gialle** - Italian Yellow Pages
- **InfoCamere** - Chamber of Commerce database
- **Crunchbase** - Startup and funding data

### 🇷🇴 Romania Sources
- **ONRC** - Romanian Trade Registry
- **Lista Firme** - Romanian business directory
- **ANIS** - Romanian IT Association
- **Crunchbase** - Startup and funding data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (LTS)
- Supabase account
- Redis instance
- 16GB RAM minimum
- Multi-core CPU (4+ cores recommended)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd scraping-server
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp env.example .env
# Edit .env with your credentials
```

4. **Initialize database**
```bash
npm run db:migrate
npm run db:seed
```

5. **Start the server**
```bash
npm run dev
```

6. **Start worker (in separate terminal)**
```bash
npm run worker
```

## 🔧 Configuration

### Environment Variables

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# LinkedIn Configuration (Disabled for security reasons)
# LINKEDIN_EMAIL=your-linkedin-email
# LINKEDIN_PASSWORD=your-linkedin-password

# API Security
API_KEY=your-secret-api-key
```

## 📡 API Endpoints

### Base URL: `http://localhost:3000/api/v1`

### Authentication
All endpoints require API key in header:
```
X-API-Key: your-secret-api-key
```

### Scraping Endpoints

#### **POST /scrape/italy**
Start Italy scraping job
```json
{
  "sources": ["pagine_gialle", "registro_imprese"],
  "cities": ["Milano", "Roma"],
  "async": true
}
```

#### **POST /scrape/romania**
Start Romania scraping job
```json
{
  "sources": ["listafirme", "onrc"],
  "cities": ["București", "Cluj-Napoca"],
  "async": true
}
```


### Company Endpoints

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

#### **GET /companies/export/csv**
Export companies to CSV

### Job Management

#### **GET /scrape/jobs**
List all scraping jobs

#### **GET /scrape/jobs/:jobId**
Get job status and progress

#### **DELETE /scrape/jobs/:jobId**
Cancel a job

## 🧪 Testing

### Test Italy Scrapers
```bash
npm run scrape:italy
npm run test:proxies
```

### Test Romania Scrapers
```bash
npm run scrape:romania
```

### Run Unit Tests
```bash
npm test
```

### Run Integration Tests
```bash
npm run test:integration
```

## 📈 Expected Results

After 24 hours of operation, you should have:

### Italy Data
- ✅ 1,500-2,500 Italian software companies
- ✅ 3+ data sources operational
- ✅ 70%+ data completeness
- ✅ Major cities covered (Milano, Roma, Torino, Bologna)

### Romania Data
- ✅ 1,500-2,500 Romanian software companies
- ✅ 3+ data sources operational
- ✅ 70%+ data completeness
- ✅ Major cities covered (București, Cluj-Napoca, Timișoara, Iași)

### Crunchbase Enhancement
- ✅ 200-500 companies from both countries
- ✅ Enhanced data (funding information, startup details)
- ✅ 80%+ data accuracy

## 🔒 Security & Compliance

- **GDPR Compliant**: Only public business data
- **Rate Limiting**: Respects source rate limits
- **API Authentication**: Secure API key authentication
- **Data Encryption**: HTTPS only in production
- **Input Validation**: Comprehensive request validation

## 📊 Monitoring

### Key Metrics
- Jobs completed/hour
- Average scraping time per source
- Success rate by source
- Data quality scores
- API response times

### Health Check
```bash
curl http://localhost:3000/health
```

## 🛠️ Development

### Project Structure
```
scraping-server/
├── src/
│   ├── config/           # Configuration files
│   ├── scrapers/         # Scraper implementations
│   ├── services/         # Business logic services
│   ├── controllers/      # API controllers
│   ├── middleware/       # Express middleware
│   ├── routes/          # API routes
│   └── utils/           # Utility functions
├── supabase/            # Database migrations
├── scripts/             # Setup and testing scripts
└── tests/               # Test files
```

### Adding New Scrapers

1. Create scraper class extending `BaseScraper`
2. Implement `scrape()` and `parse()` methods
3. Register in `ScraperFactory`
4. Add to configuration

### Adding New Data Sources

1. Create scraper for the source
2. Add to `data_sources` table
3. Update configuration files
4. Test with real data

## 🚀 Deployment

### Docker Deployment
```bash
docker-compose up -d
```

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Redis connection tested
- [ ] API key generated and secured
- [ ] CORS origins configured
- [ ] Rate limits configured
- [ ] SSL certificate installed
- [ ] Monitoring setup

## 📞 Support

### Getting Help
- Check documentation first
- Review troubleshooting guide
- Check GitHub issues
- Contact development team

### Reporting Bugs
```markdown
**Bug Report Template**
- Title: Brief description
- Environment: Development/Production
- Steps to reproduce
- Expected behavior
- Actual behavior
- Error messages/logs
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 🎉 Acknowledgments

- Supabase for the database platform
- Puppeteer for browser automation
- Cheerio for HTML parsing
- Bull for job queue management

---

**Ready to start scraping? Let's build the most comprehensive database of Italian and Romanian software companies! 🚀**
