import { test as base, Page } from '@playwright/test';

// 1. Define the types for your custom fixtures
type MyFixtures = {
  authenticatedPage: Page;
};

/**
 * Extend basic test by providing custom fixtures.
 * Passing <MyFixtures> tells TypeScript that 'authenticatedPage' is a valid property.
 */
export const test = base.extend<MyFixtures>({
  // This fixture will automatically run setup before your test blocks execute
  authenticatedPage: async ({ page }, use) => {
    // Perform login or initial setup
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // We assume login logic would go here if needed
    // For now, we pass the authenticated page instance down to the test execution track
    await use(page);
  },
});

export { expect } from '@playwright/test';