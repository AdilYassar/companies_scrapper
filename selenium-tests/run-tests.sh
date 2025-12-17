#!/bin/bash

# Selenium Test Runner Script
# Usage: ./run-tests.sh [browser] [headless]

# Set default values
BROWSER=${1:-chrome}
HEADLESS=${2:-false}
BASE_URL=${BASE_URL:-http://localhost:3000}

# Export environment variables
export BROWSER=$BROWSER
export HEADLESS=$HEADLESS
export BASE_URL=$BASE_URL

echo "Starting Selenium Tests..."
echo "Browser: $BROWSER"
echo "Headless: $HEADLESS"
echo "Base URL: $BASE_URL"
echo "=========================="

# Create screenshots directory
mkdir -p screenshots
mkdir -p test-results

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run tests
echo "Running tests..."
npm test

# Check if tests passed
if [ $? -eq 0 ]; then
    echo "=========================="
    echo "✅ All tests passed!"
    echo "Test report generated in test-results/"
else
    echo "=========================="
    echo "❌ Some tests failed!"
    echo "Check test-results/ for detailed report"
    exit 1
fi
