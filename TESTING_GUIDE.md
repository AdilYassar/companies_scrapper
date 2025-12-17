# Testing Scripts

This directory contains scripts to run the containers and tests for easy verification.

## Prerequisites

1. **Docker & Docker Compose**: Install Docker Desktop
2. **Node.js**: For running Selenium tests
3. **Chrome/Firefox**: For Selenium WebDriver

## Quick Start

### 1. Build and Run All Services

```powershell
# Build and start all containers
docker-compose up --build -d

# Check container status
docker-compose ps

# View logs
docker-compose logs -f
```

### 2. Run Selenium Tests

```powershell
# Navigate to selenium tests directory
cd selenium-tests

# Install dependencies
npm install

# Run all tests
npm test

# Run tests with specific browser
$env:BROWSER="chrome"; npm test
$env:BROWSER="firefox"; npm test

# Run tests in headless mode
$env:HEADLESS="true"; npm test
```

### 3. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/v1

## Container Commands

### Start Services
```powershell
docker-compose up -d
```

### Stop Services
```powershell
docker-compose down
```

### Restart Services
```powershell
docker-compose restart
```

### View Container Logs
```powershell
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs database
```

### Scale Services
```powershell
# Scale backend to 3 instances
docker-compose up --scale backend=3 -d
```

## Health Checks

### Check All Services
```powershell
# Backend health
curl http://localhost:3001/health

# Frontend availability
curl http://localhost:3000

# Database connection
docker-compose exec database pg_isready -U postgres

# Redis connection
docker-compose exec redis redis-cli ping
```

## Development Commands

### Build Individual Services
```powershell
# Backend
docker build -f Dockerfile -t companies-scraper-backend .

# Frontend  
docker build -f Dockerfile.frontend -t companies-scraper-frontend .

# Database
docker build -f Dockerfile.database -t companies-scraper-database .
```

### Run Individual Containers
```powershell
# Backend
docker run -p 3001:3001 companies-scraper-backend

# Frontend
docker run -p 3000:80 companies-scraper-frontend

# Database
docker run -p 5432:5432 companies-scraper-database
```

## Troubleshooting

### Container Issues
```powershell
# Check container status
docker-compose ps

# View detailed logs
docker-compose logs --tail=100 [service-name]

# Restart problematic service
docker-compose restart [service-name]

# Rebuild and restart
docker-compose up --build [service-name]
```

### Network Issues
```powershell
# Check network connectivity
docker network ls
docker network inspect scrapper_scraper-network

# Test inter-service communication
docker-compose exec backend ping database
docker-compose exec backend ping redis
```

### Database Issues
```powershell
# Connect to database
docker-compose exec database psql -U postgres -d companies_scraper

# Check database logs
docker-compose logs database

# Reset database
docker-compose down
docker volume rm scrapper_postgres_data
docker-compose up -d
```

### Test Issues
```powershell
# Debug Selenium tests
$env:DEBUG="selenium*"; npm test

# Run specific test file
npx mocha test/homepage.test.js --timeout 30000

# Run tests with screenshots
$env:TAKE_SCREENSHOTS="true"; npm test
```

## Environment Variables

### Docker Compose Environment
Create `.env.docker` file:
```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:postgres@database:5432/companies_scraper
REDIS_URL=redis://redis:6379
```

### Selenium Test Environment
```powershell
$env:BROWSER="chrome"          # chrome, firefox
$env:HEADLESS="true"           # true, false
$env:BASE_URL="http://localhost:3000"
$env:TAKE_SCREENSHOTS="true"   # true, false
```
