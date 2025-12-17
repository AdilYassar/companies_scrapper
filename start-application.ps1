# Start all services and run tests
Write-Host "🚀 Starting Companies Scraper Application..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Yellow

# Check if Docker is running
Write-Host "📋 Checking Docker status..." -ForegroundColor Cyan
try {
    docker --version | Out-Null
    Write-Host "✅ Docker is available" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Build and start all services
Write-Host "🔨 Building and starting all services..." -ForegroundColor Cyan
docker-compose down --remove-orphans
docker-compose up --build -d

# Wait for services to start
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

# Check service status
Write-Host "🔍 Checking service status..." -ForegroundColor Cyan
docker-compose ps

# Health checks
Write-Host "🏥 Running health checks..." -ForegroundColor Cyan

# Check backend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend API is healthy" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Backend API returned status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Backend API health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Check frontend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend is healthy" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Frontend returned status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Frontend health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Check database
try {
    $dbStatus = docker-compose exec -T database pg_isready -U postgres
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database is healthy" -ForegroundColor Green
    } else {
        Write-Host "❌ Database health check failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Database health check error: $($_.Exception.Message)" -ForegroundColor Red
}

# Check Redis
try {
    $redisStatus = docker-compose exec -T redis redis-cli ping
    if ($redisStatus -eq "PONG") {
        Write-Host "✅ Redis is healthy" -ForegroundColor Green
    } else {
        Write-Host "❌ Redis health check failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Redis health check error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🌐 Application URLs:" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend API: http://localhost:3001" -ForegroundColor White
Write-Host "API Docs: http://localhost:3001/api/v1" -ForegroundColor White

Write-Host "`n📋 Container Status:" -ForegroundColor Cyan
docker-compose ps

Write-Host "`n🔥 Services are ready!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Yellow

# Offer to run Selenium tests
$runTests = Read-Host "Would you like to run Selenium tests? (y/N)"
if ($runTests -eq "y" -or $runTests -eq "Y") {
    Write-Host "`n🧪 Running Selenium Tests..." -ForegroundColor Cyan
    Set-Location "selenium-tests"
    
    # Install dependencies if needed
    if (!(Test-Path "node_modules")) {
        Write-Host "📦 Installing test dependencies..." -ForegroundColor Cyan
        npm install
    }
    
    # Run tests
    $env:BASE_URL = "http://localhost:3000"
    $env:BROWSER = "chrome"
    $env:HEADLESS = "true"
    
    npm test
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ All Selenium tests passed!" -ForegroundColor Green
    } else {
        Write-Host "❌ Some Selenium tests failed. Check test-results/ for details." -ForegroundColor Red
    }
    
    Set-Location ".."
}

Write-Host "`n🎉 Setup complete!" -ForegroundColor Green
Write-Host "You can now use the application at http://localhost:3000" -ForegroundColor White
