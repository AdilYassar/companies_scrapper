# Stop all services
Write-Host "🛑 Stopping Companies Scraper Application..." -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Yellow

# Stop and remove containers
Write-Host "📋 Stopping all containers..." -ForegroundColor Cyan
docker-compose down

# Remove volumes (optional)
$removeVolumes = Read-Host "Would you like to remove all data volumes? This will delete all database data (y/N)"
if ($removeVolumes -eq "y" -or $removeVolumes -eq "Y") {
    Write-Host "🗑️ Removing volumes..." -ForegroundColor Cyan
    docker-compose down -v
    docker volume prune -f
}

# Remove images (optional)
$removeImages = Read-Host "Would you like to remove Docker images? (y/N)"
if ($removeImages -eq "y" -or $removeImages -eq "Y") {
    Write-Host "🗑️ Removing images..." -ForegroundColor Cyan
    docker-compose down --rmi all
}

# Clean up
Write-Host "🧹 Cleaning up..." -ForegroundColor Cyan
docker system prune -f

Write-Host "`n✅ Application stopped and cleaned up!" -ForegroundColor Green
