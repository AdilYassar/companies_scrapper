# Test CI/CD Pipeline Locally
# This script helps verify the CI/CD pipeline configuration before pushing to GitHub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CI/CD Pipeline Local Testing Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path ".github/workflows/ci-cd.yml")) {
    Write-Host "Error: ci-cd.yml not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Found CI/CD workflow file" -ForegroundColor Green
Write-Host ""

# Test 1: Validate YAML syntax (if yamllint is available)
Write-Host "Test 1: Validating YAML syntax..." -ForegroundColor Yellow
try {
    # Try to validate with PowerShell (basic check)
    $yamlContent = Get-Content ".github/workflows/ci-cd.yml" -Raw
    if ($yamlContent -match "name:" -and $yamlContent -match "on:" -and $yamlContent -match "jobs:") {
        Write-Host "YAML structure looks valid" -ForegroundColor Green
    } else {
        Write-Host "Warning: YAML structure may have issues" -ForegroundColor Yellow
    }
} catch {
        Write-Host "Could not validate YAML syntax" -ForegroundColor Yellow
}
Write-Host ""

# Test 2: Check if required files exist
Write-Host "Test 2: Checking required files..." -ForegroundColor Yellow
$requiredFiles = @(
    "Dockerfile",
    "Dockerfile.frontend",
    "Dockerfile.database",
    "docker-compose.yml",
    "package.json",
    "frontend/package.json",
    "k8s/namespace.yaml",
    "k8s/backend-deployment.yaml",
    "k8s/frontend-deployment.yaml",
    "k8s/database-deployment.yaml"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  [OK] $file" -ForegroundColor Green
    } else {
        Write-Host "  [MISSING] $file" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if ($allFilesExist) {
    Write-Host "All required files exist" -ForegroundColor Green
} else {
    Write-Host "Some required files are missing" -ForegroundColor Red
}
Write-Host ""

# Test 3: Check package.json scripts
Write-Host "Test 3: Checking package.json scripts..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    $requiredScripts = @("start", "test", "lint")
    
    foreach ($script in $requiredScripts) {
        if ($packageJson.scripts.PSObject.Properties.Name -contains $script) {
            Write-Host "  [OK] npm run $script" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  npm run $script (not found)" -ForegroundColor Yellow
        }
    }
}
Write-Host ""

# Test 4: Check frontend package.json
Write-Host "Test 4: Checking frontend package.json..." -ForegroundColor Yellow
if (Test-Path "frontend/package.json") {
    $frontendPackageJson = Get-Content "frontend/package.json" | ConvertFrom-Json
    $requiredFrontendScripts = @("start", "build", "test")
    
    foreach ($script in $requiredFrontendScripts) {
        if ($frontendPackageJson.scripts.PSObject.Properties.Name -contains $script) {
            Write-Host "  [OK] npm run $script (frontend)" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  npm run $script (not found)" -ForegroundColor Yellow
        }
    }
}
Write-Host ""

# Test 5: Validate Dockerfiles
Write-Host "Test 5: Validating Dockerfiles..." -ForegroundColor Yellow
$dockerfiles = @("Dockerfile", "Dockerfile.frontend", "Dockerfile.database")
foreach ($dockerfile in $dockerfiles) {
    if (Test-Path $dockerfile) {
        $content = Get-Content $dockerfile -Raw
        if ($content -match "FROM" -and $content -match "WORKDIR") {
            Write-Host "  [OK] $dockerfile (valid structure)" -ForegroundColor Green
        } else {
            Write-Host "  [WARN] $dockerfile (may have issues)" -ForegroundColor Yellow
        }
    }
}
Write-Host ""

# Test 6: Check Kubernetes manifests
Write-Host "Test 6: Checking Kubernetes manifests..." -ForegroundColor Yellow
$k8sFiles = Get-ChildItem -Path "k8s" -Filter "*.yaml" -ErrorAction SilentlyContinue
if ($k8sFiles) {
    Write-Host "  [OK] Found $($k8sFiles.Count) Kubernetes manifest files" -ForegroundColor Green
    foreach ($file in $k8sFiles) {
        Write-Host "    - $($file.Name)" -ForegroundColor Gray
    }
} else {
    Write-Host "  [WARN] No Kubernetes manifest files found" -ForegroundColor Yellow
}
Write-Host ""

# Test 7: Check for GitHub Secrets (informational)
Write-Host "Test 7: GitHub Secrets Configuration (for reference)..." -ForegroundColor Yellow
Write-Host "  Required secrets for full pipeline:" -ForegroundColor Cyan
Write-Host "    - DOCKER_USERNAME" -ForegroundColor Gray
Write-Host "    - DOCKER_PASSWORD" -ForegroundColor Gray
Write-Host "    - AZURE_CREDENTIALS" -ForegroundColor Gray
Write-Host "    - AZURE_RESOURCE_GROUP" -ForegroundColor Gray
Write-Host "    - AKS_CLUSTER_NAME" -ForegroundColor Gray
Write-Host ""
Write-Host "  Info: Configure these in: GitHub Repo > Settings > Secrets and variables > Actions" -ForegroundColor Cyan
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Review any warnings above" -ForegroundColor White
Write-Host "2. Configure GitHub Secrets if deploying to AKS" -ForegroundColor White
Write-Host "3. Push to GitHub to trigger the pipeline:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Update CI/CD pipeline'" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Monitor pipeline at: https://github.com/YOUR_USERNAME/YOUR_REPO/actions" -ForegroundColor White
Write-Host ""
Write-Host "Local validation complete!" -ForegroundColor Green
Write-Host ""
