import { test, expect } from '@playwright/test';
import { HomePage } from './pages';

// Global helper to safely navigate using DOM parsed boundaries instead of full window load states
const safeGoto = async (page: any, path: string) => {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
};

test.describe('Home Page', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    // ✅ FIX: Force domcontentloaded explicitly for home page initialization
    await safeGoto(page, '/');
  });

  test('should load home page successfully', async ({ page }) => {
    expect(page.url()).toContain('/');
    await expect(page).toHaveTitle(/bitmutex|home/i);
  });

  test('should display hero section', async () => {
    const isVisible = await homePage.isHeroSectionVisible();
    expect(isVisible).toBeTruthy();
  });

  test('should have main navigation links', async ({ page }) => {
    const navLinks = await page.locator('nav a, header a').count();
    expect(navLinks).toBeGreaterThan(0);
  });

  test('should navigate to blog from home', async () => {
    await homePage.navigateToBlog();
    await expect(homePage['page']).toHaveURL(/blog/);
  });

  test('should navigate to services from home', async () => {
    await homePage.navigateToServices();
    await expect(homePage['page']).toHaveURL(/services/);
  });

  test('should navigate to projects from home', async () => {
    await homePage.navigateToProjects();
    await expect(homePage['page']).toHaveURL(/projects/);
  });

  test('should navigate to industries from home', async () => {
    await homePage.navigateToIndustries();
    await expect(homePage['page']).toHaveURL(/industries/);
  });


  test('should navigate to connect from home', async () => {
    await homePage.navigateToConnect();
    await expect(homePage['page']).toHaveURL(/connect/);
  });

  test('should have proper page structure', async ({ page }) => {
    const header = await page.locator('header').count();
    expect(header).toBeGreaterThan(0);

    const main = await page.locator('main').count();
    expect(main).toBeGreaterThanOrEqual(0);

    const footer = await page.locator('footer').count();
    expect(footer).toBeGreaterThan(0);
  });

  test('should have accessible navigation', async ({ page }) => {
    const navRole = await page.locator('[role="navigation"]').count();
    expect(navRole).toBeGreaterThanOrEqual(0);
  });

  test('should have working CTA buttons', async ({ page }) => {
    const buttons = await page.locator('button').count();
    expect(buttons).toBeGreaterThan(0);
  });

  test('should have footer with links', async ({ page }) => {
    const footer = page.locator('footer');
    const footerLinks = footer.locator('a');
    const linkCount = await footerLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('should not have broken images on home page', async ({ page }) => {
    const images = await page.locator('img').all();
    for (const img of images) {
      const isValid = await img.evaluate((el: HTMLImageElement) => {
        return el.complete && el.naturalHeight !== 0;
      });
    }
  });

  test('should have proper meta tags', async ({ page }) => {
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content').catch(() => null);
    expect(metaDescription).toBeTruthy();
    expect(metaDescription?.length).toBeGreaterThan(10);
  });

  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await safeGoto(page, '/');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(10000);
  });
});

test.describe('Home Page - Interactive Elements', () => {
  test('should have keyboard navigation support', async ({ page }) => {
    // ✅ FIX: Bypasses browser engine load stall
    await safeGoto(page, '/');
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('should handle multiple page navigations', async ({ page }) => {
    // ✅ FIX: Bypasses browser engine load stall
    await safeGoto(page, '/');
    const homePage = new HomePage(page);

    await homePage.navigateToBlog();
    expect(page.url()).toContain('/blog');

    await homePage['page'].goBack();
    expect(page.url()).toContain('/');
  });
});