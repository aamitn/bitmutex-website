# E2E Testing Implementation Guide

## What's Included

This E2E testing setup provides comprehensive coverage for your Next.js 16 Bitmutex client application:

### Test Suites (6 files, 100+ test cases)

1. **home.spec.ts** - Home page and navigation
   - Page loading and structure
   - Navigation links
   - Dark mode toggle
   - CTA buttons
   - SEO and accessibility

2. **blog.spec.ts** - Blog section
   - Blog listing and post count
   - Blog post viewing
   - Table of contents
   - Reading time and view count
   - Related posts
   - Sharing functionality

3. **navigation.spec.ts** - Navigation and routing
   - Main navigation paths
   - Mobile menu functionality
   - Breadcrumb navigation
   - Footer links
   - Browser back/forward

4. **responsive.spec.ts** - Responsive design
   - Desktop (1920px, 1280px)
   - Tablet (768px)
   - Mobile (375px)
   - Touch-friendly targets
   - Image optimization
   - Text readability

5. **forms.spec.ts** - Form interactions
   - Contact/Connect form
   - Form validation
   - Field validation
   - Error handling
   - Form submission
   - Mobile form usability

6. **accessibility-performance.spec.ts** - Quality assurance
   - WCAG accessibility compliance
   - Keyboard navigation
   - Screen reader support
   - Performance metrics
   - SEO elements
   - Resource optimization

## Quick Setup

### 1. Install Dependencies

```bash
cd client
npm install --save-dev @playwright/test
```

### 2. Install Browsers

```bash
npx playwright install
```

### 3. Run Tests

```bash
npm run test:e2e
```

## NPM Scripts Available

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test suites
npm run test:e2e:home       # Home page tests
npm run test:e2e:blog       # Blog tests
npm run test:e2e:nav        # Navigation tests
npm run test:e2e:responsive # Responsive design tests
npm run test:e2e:forms      # Form tests
npm run test:e2e:a11y       # Accessibility & performance tests

# Debug and inspection
npm run test:e2e:headed     # Run with browser visible
npm run test:e2e:debug      # Debug mode with Inspector
npm run test:e2e:ui         # Interactive UI mode
npm run test:e2e:report     # View last test report
```

## File Structure

```
client/
├── e2e/
│   ├── README.md                              # Detailed E2E guide
│   ├── .gitignore                             # Test artifacts ignore
│   ├── run-tests.sh                           # Local test runner
│   ├── fixtures.ts                            # Test fixtures
│   ├── pages.ts                               # Page Object Models (1000+ LOC)
│   ├── home.spec.ts                           # Home page tests
│   ├── blog.spec.ts                           # Blog tests
│   ├── navigation.spec.ts                     # Navigation tests
│   ├── responsive.spec.ts                     # Responsive design tests
│   ├── forms.spec.ts                          # Form tests
│   └── accessibility-performance.spec.ts      # Quality assurance tests
├── playwright.config.ts                       # Playwright configuration
├── package.json                               # Updated with E2E scripts
└── ...
```

## Key Features

### 1. Page Object Models
Pre-built page objects for common interactions:
- **HomePage** - Home page navigation and features
- **BlogPage** - Blog listing and filtering
- **BlogPostPage** - Article reading experience
- **Navigation** - Global navigation
- **FormPage** - Form interactions
- **ResponsiveHelper** - Responsive testing
- **SearchPage** - Search functionality

### 2. Multi-Browser Testing
Automatically tests across:
- ✅ Chromium
- ✅ Firefox
- ✅ WebKit (Safari)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

### 3. Responsive Testing
Built-in testing for:
- Desktop (1920px, 1280px)
- Tablet (768px)
- Mobile (375px)
- Android devices
- iOS devices

### 4. Accessibility Testing
- Heading hierarchy
- Keyboard navigation
- Color contrast
- ARIA labels
- Semantic HTML
- Form accessibility

### 5. Performance Testing
- Page load times
- Core Web Vitals (FCP, CLS)
- Network request optimization
- Console error monitoring
- Asset optimization

### 6. CI/CD Integration
GitHub Actions workflow that:
- Runs on push and pull requests
- Tests multiple Node versions
- Generates reports
- Posts results to PR comments
- Retries on failure

## Configuration Files

### playwright.config.ts
Main configuration file with:
- Base URL configuration
- Browser setup
- Device emulation
- Reporter configuration
- Web server setup
- Timeout settings

### .github/workflows/e2e-tests.yml
CI/CD workflow that:
- Runs on all pushes and PRs
- Tests on Node 18 and 20
- Generates HTML reports
- Posts results to GitHub
- Stores artifacts

## Page Objects Reference

### HomePage
```typescript
const homePage = new HomePage(page);
await homePage.goto();
await homePage.navigateToBlog();
await homePage.toggleDarkMode();
```

### BlogPage
```typescript
const blogPage = new BlogPage(page);
await blogPage.goto();
const count = await blogPage.getPostCount();
await blogPage.openFirstPost();
```

### BlogPostPage
```typescript
const postPage = new BlogPostPage(page);
await postPage.goto('article-slug');
const title = await postPage.getTitle();
await postPage.shareOnTwitter();
```

### FormPage
```typescript
const formPage = new FormPage(page);
await formPage.fillTextField('Name', 'John Doe');
await formPage.fillEmailField('john@example.com');
await formPage.submitForm();
```

## Running Tests Locally

### 1. Start Dev Server (if not already running)
```bash
npm run dev
```

### 2. In another terminal, run tests
```bash
npm run test:e2e
```

### 3. View Results
```bash
npm run test:e2e:report
```

## CI/CD Pipeline

Tests automatically run when you:
1. Push to `main` or `develop` branches
2. Create a pull request to `main` or `develop`
3. Tests run on Node 18 and 20

### Viewing Results
1. Go to GitHub Actions tab in your repository
2. Click the workflow run
3. View test results and download reports
4. Reports are also posted as PR comments

## Writing New Tests

### Basic Test Template
```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from './pages';

test.describe('Feature Name', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should do something', async () => {
    // Your test code
    expect(true).toBeTruthy();
  });
});
```

### Best Practices
- ✅ Use Page Objects instead of raw page interactions
- ✅ Wait for network idle: `await page.waitForLoadState('domcontentloaded')`
- ✅ Use semantic locators: `page.locator('button:has-text("Submit")')`
- ✅ Test user behavior, not implementation
- ✅ Make tests independent and isolated
- ✅ Use descriptive test names
- ✅ Group related tests with `test.describe()`

## Debugging Tests

### Headed Mode (See Browser)
```bash
npm run test:e2e:headed
```

### Debug Mode (With Inspector)
```bash
npm run test:e2e:debug
```

### UI Mode (Interactive)
```bash
npm run test:e2e:ui
```

### Slow Motion
```bash
npx playwright test --slow-mo=1000
```

### Specific Test Only
```bash
npx playwright test e2e/home.spec.ts -g "should load home page"
```

## Environment Variables

Create `.env.test` file:
```env
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000
PLAYWRIGHT_TEST_TIMEOUT=30000
```

## Troubleshooting

### Tests Timeout
```typescript
test('long running test', async ({ page }) => {
  test.setTimeout(60000);
  // Test code
});
```

### Flaky Tests
```typescript
test.describe('Flaky suite', () => {
  test.describe.configure({ retries: 3 });
  
  test('retry this', async ({ page }) => {
    // Test code
  });
});
```

### Port Already in Use
Kill process on port 3000:
```bash
# Linux/Mac
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Test Coverage

Current coverage includes:
- ✅ 15+ Home page tests
- ✅ 12+ Blog page tests
- ✅ 12+ Navigation tests
- ✅ 20+ Responsive design tests
- ✅ 15+ Form tests
- ✅ 20+ Accessibility & performance tests

**Total: 94 test cases across 6 suites**

## Next Steps

1. Install Playwright: `npm install --save-dev @playwright/test`
2. Install browsers: `npx playwright install`
3. Run tests: `npm run test:e2e`
4. View report: `npm run test:e2e:report`
5. Add to CI/CD: Tests run automatically on GitHub

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [Test Configuration](https://playwright.dev/docs/test-configuration)
- [API Reference](https://playwright.dev/docs/api/intro)

## Support & Maintenance

### Regular Updates
Keep Playwright updated:
```bash
npm update @playwright/test
npx playwright install
```

### Adding New Tests
1. Identify feature to test
2. Create test in appropriate spec file
3. Use existing Page Objects when possible
4. Run: `npm run test:e2e`
5. Verify all tests pass

### Updating Page Objects
When UI changes:
1. Update selectors in `pages.ts`
2. Add new methods as needed
3. Run tests: `npm run test:e2e`

## Conclusion

You now have a production-ready E2E testing suite with:
- ✅ 94 test cases
- ✅ Multi-browser support
- ✅ Responsive design testing
- ✅ Accessibility validation
- ✅ Performance monitoring
- ✅ CI/CD integration
- ✅ Detailed reporting
- ✅ Full documentation

Start testing: `npm run test:e2e`
