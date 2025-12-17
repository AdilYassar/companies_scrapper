@echo off
REM Selenium Test Runner Script for Windows
REM Usage: run-tests.bat [browser] [headless]

REM Set default values
set BROWSER=%1
if "%BROWSER%"=="" set BROWSER=chrome

set HEADLESS=%2
if "%HEADLESS%"=="" set HEADLESS=false

set BASE_URL=%BASE_URL%
if "%BASE_URL%"=="" set BASE_URL=http://localhost:3000

echo Starting Selenium Tests...
echo Browser: %BROWSER%
echo Headless: %HEADLESS%
echo Base URL: %BASE_URL%
echo ==========================

REM Create directories
if not exist "screenshots" mkdir screenshots
if not exist "test-results" mkdir test-results

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Run tests
echo Running tests...
npm test

REM Check if tests passed
if %ERRORLEVEL% EQU 0 (
    echo ==========================
    echo ✅ All tests passed!
    echo Test report generated in test-results/
) else (
    echo ==========================
    echo ❌ Some tests failed!
    echo Check test-results/ for detailed report
    exit /b 1
)
