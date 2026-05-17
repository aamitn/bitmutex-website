import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  // More stable for Next.js SSR/RSC in CI
  workers: process.env.CI ? 1 : '50%',

  // Global timeout per test
  timeout: 60 * 1000,

  expect: {
    timeout: 10 * 1000,
  },

  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],

  use: {
    baseURL:
      process.env.PLAYWRIGHT_TEST_BASE_URL ||
      'http://localhost:3000',

    trace: 'on-first-retry',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

    actionTimeout: 15 * 1000,

    navigationTimeout: 30 * 1000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },

    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 7'],
      },
    },

    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 15'],
      },
    },
  ],

  webServer: {
    command: 'pnpm dev',

    url: 'http://localhost:3000',

    reuseExistingServer: !process.env.CI,

    timeout: 180 * 1000,

    stdout: 'pipe',

    stderr: 'pipe',
  },
});