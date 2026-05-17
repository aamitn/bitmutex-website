# E2E Testing Guide - Bitmutex Client

Complete end-to-end testing suite for the Next.js 16 frontend application using Playwright.

## Overview

This testing suite provides comprehensive coverage for:

- ✅ **Home Page** - Navigation, hero sections, CTAs
- ✅ **Blog** - Post listings, article reading, table of contents
- ✅ **Navigation** - Menu navigation, breadcrumbs, footer links
- ✅ **Responsive Design** - Mobile, tablet, desktop viewports
- ✅ **Forms** - Contact forms, validation, submission
- ✅ **Accessibility** - WCAG compliance, keyboard navigation
- ✅ **Performance** - Load times, Core Web Vitals, resource optimization
- ✅ **SEO** - Meta tags, structured data, canonical URLs

## Installation

### 1. Install Playwright

```bash
cd client
npm install --save-dev @playwright/test
```

### 2. Install Browsers

```bash
npx playwright install
```

### 3. Verify Installation

```bash
npx playwright --version
```

## Project Structure

```
client/
├── e2e/
│   ├── fixtures.ts              # Test fixtures and custom setup
│   ├── pages.ts                 # Page Object Models
│   ├── home.spec.ts             # Home page tests
│   ├── blog.spec.ts             # Blog page tests
│   ├── navigation.spec.ts        # Navigation tests
│   ├── responsive.spec.ts        # Responsive design tests
│   ├── forms.spec.ts            # Form interaction tests
│   ├── accessibility-performance.spec.ts  # A11y & performance tests
│   ├── run-tests.sh             # Local test runner script
│   └── .gitignore               # Git ignore for test artifacts
├── playwright.config.ts         # Playwright configuration
└── ...
```

## Quick Start

### Run All Tests

```bash
npm run test:e2e
```

### Run Specific Test Suite

```bash
# Home page tests
npm run test:e2e:home

# Blog tests
npm run test:e2e:blog

# Navigation tests
npm run test:e2e:nav

# Responsive design tests
npm run test:e2e:responsive

# Form tests
npm run test:e2e:forms

# Accessibility & Performance tests
npm run test:e2e:a11y
```

### Run in Headed Mode (See Browser)

```bash
npm run test:e2e:headed
```

### Run in Debug Mode

```bash
npm run test:e2e:debug
```

### Run Specific File

```bash
npx playwright test e2e/home.spec.ts
```

### Run Tests with Specific Browser

```bash
# Chromium only
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# Safari only
npx playwright test --project=webkit

# Mobile Chrome
npx playwright test --project="Mobile Chrome"

# Mobile Safari
npx playwright test --project="Mobile Safari"
```

## Configuration

### Environment Variables

Create a `.env.test` file in the `client` directory:

```env
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000
PLAYWRIGHT_TEST_TIMEOUT=30000
PLAYWRIGHT_TEST_RETRIES=2
```

### Playwright Configuration

Edit `playwright.config.ts` to customize:

- Base URL
- Browsers and devices
- Timeouts
- Retries
- Reporters
- Web server configuration

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from './pages';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    
    // Your test assertions
    expect(true).toBeTruthy();
  });
});
```

### Using Page Objects

```typescript
import { BlogPage } from './pages';

test('should open first blog post', async ({ page }) => {
  const blogPage = new BlogPage(page);
  await blogPage.goto();
  
  const postCount = await blogPage.getPostCount();
  expect(postCount).toBeGreaterThan(0);
  
  await blogPage.openFirstPost();
});
```

### Responsive Testing

```typescript
test('should work on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  
  // Your mobile-specific assertions
});
```

### Using Fixtures

```typescript
import { test } from './fixtures';

test('should work with custom fixture', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/dashboard');
  // Page is already authenticated
});
```

## Available Page Objects

### HomePage
- `goto()` - Navigate to home
- `navigateToBlog()` - Go to blog
- `navigateToServices()` - Go to services
- `toggleDarkMode()` - Toggle dark mode
- `isDarkModeEnabled()` - Check dark mode status

### BlogPage
- `goto()` - Navigate to blog listing
- `getPostCount()` - Get number of posts
- `openFirstPost()` - Open first post
- `searchPosts(query)` - Search posts
- `filterByCategory(category)` - Filter by category

### BlogPostPage
- `goto(slug)` - Go to specific post
- `getTitle()` - Get article title
- `getReadingTime()` - Get estimated reading time
- `shareOnTwitter()` - Share on Twitter
- `clickTableOfContentsItem(text)` - Click TOC item

### FormPage
- `fillTextField(label, value)` - Fill text input
- `fillEmailField(email)` - Fill email field
- `fillPhoneField(phone)` - Fill phone field
- `submitForm()` - Submit form
- `getSuccessMessage()` - Get success message

### Navigation
- `openMenu()` - Open mobile menu
- `navigateTo(path)` - Navigate to path
- `goBack()` - Browser back
- `goForward()` - Browser forward

### ResponsiveHelper
- `setViewport(name)` - Set viewport size
- `getImages()` - Get image count
- `checkTextReadability()` - Check readability

## Test Reports

### View HTML Report

```bash
npx playwright show-report
```

The HTML report includes:
- Test results and status
- Screenshots on failure
- Video recordings
- Detailed logs
- Timeline

### CI/CD Integration

Tests run automatically on:
- Push to `main` or `develop`
- Pull requests

View results in GitHub Actions tab.

## Best Practices

### 1. Use Page Objects
```typescript
// ✅ Good
const homePage = new HomePage(page);
await homePage.goto();

// ❌ Avoid
await page.goto('/');
```

### 2. Wait for Network
```typescript
// ✅ Good
await page.goto('/', { waitUntil: 'domcontentloaded' });

// ❌ Avoid
await page.goto('/');
```

### 3. Use Proper Locators
```typescript
// ✅ Good - Semantic locators
page.locator('button:has-text("Submit")')
page.locator('input[type="email"]')

// ❌ Avoid - Fragile selectors
page.locator('div.form > div > input')
```

### 4. Handle Waits Properly
```typescript
// ✅ Good
await page.waitForLoadState('domcontentloaded');
await page.waitForSelector('[data-testid="loaded"]');

// ❌ Avoid
await page.waitForTimeout(5000);
```

### 5. Test User Behavior
```typescript
// ✅ Good - User actions
await page.click('button');
await page.fill('input', 'text');
await page.press('Enter');

// ❌ Avoid - Direct manipulation
await page.evaluate(() => document.querySelector('button').click());
```

## Debugging

### Debug Mode
```bash
npx playwright test --debug
```

### Headed Mode with Slowdown
```bash
npx playwright test --headed --slow-mo=1000
```

### Generate Trace
```bash
npx playwright test --trace=on
```

View trace:
```bash
npx playwright show-trace trace.zip
```

### Inspector
```bash
PWDEBUG=1 npx playwright test
```

## Common Issues

### Tests Timeout
```typescript
test('long running test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  
  // Your test code
}, { timeout: 60000 });
```

### Flaky Tests
```typescript
// Retry specific test
test.describe('Flaky tests', () => {
  test.describe.configure({ retries: 3 });
  
  test('retry this', async ({ page }) => {
    // Test code
  });
});
```

### Selectors Not Found
```typescript
// Wait for element
await page.waitForSelector('selector', { timeout: 5000 });

// Or use locator
const element = page.locator('text=Expected text');
await element.waitFor({ state: 'visible' });
```

## Performance Testing

### Monitor Network
```typescript
test('should load with good performance', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(3000);
});
```

### Check Resources
```typescript
test('should minimize requests', async ({ page }) => {
  let requestCount = 0;
  page.on('request', () => requestCount++);
  
  await page.goto('/');
  expect(requestCount).toBeLessThan(50);
});
```

## Accessibility Testing

### Keyboard Navigation
```typescript
test('should be keyboard navigable', async ({ page }) => {
  await page.goto('/');
  
  // Tab through elements
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
  }
});
```

### Screen Reader Testing
```typescript
test('should have proper ARIA labels', async ({ page }) => {
  const button = page.locator('button').first();
  const ariaLabel = await button.getAttribute('aria-label');
  expect(ariaLabel).toBeTruthy();
});
```

## Continuous Integration

Tests automatically run on:
- **Push events** to main/develop branches
- **Pull requests** against main/develop
- **Multiple Node versions** (18.x, 20.x)
- **Multiple browsers** (Chromium, Firefox, WebKit)
- **Mobile viewports** (iPhone 12, Pixel 5)

Results are posted as GitHub comments on PRs.

## Maintenance

### Update Playwright
```bash
npm install -D @playwright/test@latest
npx playwright install
```

### Update Locators
Use Codegen to update selectors:
```bash
npx playwright codegen http://localhost:3000
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/intro)
- [Debugging](https://playwright.dev/docs/debug)
- [Test Reporters](https://playwright.dev/docs/test-reporters)

## Contributing

When adding new features:

1. Write E2E tests first
2. Update Page Objects if needed
3. Add tests to appropriate spec file
4. Run full test suite: `npm run test:e2e`
5. Ensure all tests pass before PR

## Support

For issues or questions:
- Check Playwright docs
- Review existing tests for examples
- Run tests in debug mode
- Check GitHub issues
