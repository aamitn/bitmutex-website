#!/bin/bash

# E2E Testing Script for Bitmutex Client

set -e

echo "================================"
echo "Starting E2E Testing Suite"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
  echo -e "${GREEN}✓${NC} $1"
}

print_info() {
  echo -e "${YELLOW}ℹ${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

# Check if Node is installed
if ! command -v node &> /dev/null; then
  print_error "Node.js is not installed"
  exit 1
fi

print_status "Node.js found: $(node -v)"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  print_info "Installing dependencies..."
  npm install
  print_status "Dependencies installed"
fi

# Install Playwright browsers if needed
print_info "Installing Playwright browsers..."
npx playwright install chromium firefox webkit

# Check if dev server is running or start it
print_info "Starting development server..."
npm run dev > /dev/null 2>&1 &
DEV_PID=$!

# Wait for server to be ready
sleep 5

# Check if server is responding
if ! curl -s http://localhost:3000 > /dev/null; then
  print_error "Development server failed to start"
  kill $DEV_PID 2>/dev/null || true
  exit 1
fi

print_status "Development server started (PID: $DEV_PID)"

# Run tests based on argument
TEST_TYPE=${1:-all}

case $TEST_TYPE in
  all)
    print_info "Running all E2E tests..."
    npx playwright test
    ;;
  home)
    print_info "Running home page tests..."
    npx playwright test home.spec.ts
    ;;
  blog)
    print_info "Running blog tests..."
    npx playwright test blog.spec.ts
    ;;
  nav)
    print_info "Running navigation tests..."
    npx playwright test navigation.spec.ts
    ;;
  responsive)
    print_info "Running responsive tests..."
    npx playwright test responsive.spec.ts
    ;;
  forms)
    print_info "Running form tests..."
    npx playwright test forms.spec.ts
    ;;
  a11y)
    print_info "Running accessibility tests..."
    npx playwright test accessibility-performance.spec.ts
    ;;
  headed)
    print_info "Running tests in headed mode..."
    npx playwright test --headed
    ;;
  debug)
    print_info "Running tests in debug mode..."
    npx playwright test --debug
    ;;
  *)
    print_error "Unknown test type: $TEST_TYPE"
    kill $DEV_PID 2>/dev/null || true
    exit 1
    ;;
esac

TEST_RESULT=$?

# Kill dev server
print_info "Shutting down development server..."
kill $DEV_PID 2>/dev/null || true

# Report results
if [ $TEST_RESULT -eq 0 ]; then
  print_status "All tests passed!"
  exit 0
else
  print_error "Some tests failed"
  exit 1
fi
