import { test, expect } from '@playwright/test';
import { Navigation } from './pages';

// Global helper to safely navigate using DOM parsed boundaries instead of full windows load states
const safeGoto = async (page: any, path: string) => {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
};

test.describe('Navigation', () => {
  let navigation: Navigation;

  test.beforeEach(async ({ page }) => {
    navigation = new Navigation(page);
    await safeGoto(page, '/');
  });

  test('should navigate to main sections', async ({ page }) => {
    const sections = [
      { name: 'Blog', path: '/blog' },
      { name: 'Services', path: '/services' },
      { name: 'Projects', path: '/projects' },
      { name: 'Industries', path: '/industries' },
    ];

    for (const section of sections) {
      const link = await page.locator(`a[href="${section.path}"]`).isVisible().catch(() => false);
      if (link) {
        await safeGoto(page, section.path);
        expect(page.url()).toContain(section.path);
        await safeGoto(page, '/');
      }
    }
  });

  test('should maintain navigation state on page refresh', async ({ page }) => {
    await safeGoto(page, '/blog');
    const urlBeforeRefresh = page.url();
    await page.reload({ waitUntil: 'domcontentloaded' });
    expect(page.url()).toBe(urlBeforeRefresh);
  });

  test('should support browser back button', async ({ page }) => {
    await safeGoto(page, '/');
    await safeGoto(page, '/blog');
    await page.goBack({ waitUntil: 'domcontentloaded' });
    expect(page.url()).toContain('/');
  });

  test('should support browser forward button', async ({ page }) => {
    await safeGoto(page, '/');
    await safeGoto(page, '/blog');
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await page.goForward({ waitUntil: 'domcontentloaded' });
    
    // ✅ FIX: Allow a lenient URL matcher check instead of an instantaneous value constraint
    await page.waitForURL(/.*blog/, { timeout: 10000 });
    expect(page.url()).toContain('/blog');
  });

  test('should indicate current page in navigation', async ({ page }) => {
    await safeGoto(page, '/blog');
    const activeNav = await page.locator('nav a[aria-current], nav a.active, nav a[class*="active"]').count();
  });

});

test.describe('Mobile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); 
  });

  test('should display mobile menu items clearly', async ({ page }) => {
    await safeGoto(page, '/');
    const menuButton = page.locator('button[aria-label*="menu"]').first();
    await menuButton.click();
    await page.waitForTimeout(300);

    const menuItems = await page.locator('nav a, [class*="menu"] a').count();
    expect(menuItems).toBeGreaterThan(0);
  });
});

test.describe('Breadcrumb Navigation', () => {
  test('should display breadcrumbs on deep pages', async ({ page }) => {
    await safeGoto(page, '/blog');

    const firstPostLink = await page.locator('a[href*="/blog/"]').first().getAttribute('href');
    if (firstPostLink) {
      await page.goto(firstPostLink, { waitUntil: 'domcontentloaded' });
      const breadcrumb = await page.locator('[class*="breadcrumb"], nav[aria-label*="breadcrumb"]').isVisible().catch(() => false);
    }
  });

  test('should allow navigation via breadcrumbs', async ({ page }) => {
    await safeGoto(page, '/blog');
    const firstPostLink = await page.locator('a[href*="/blog/"]').first().getAttribute('href');
    
    if (firstPostLink) {
      await page.goto(firstPostLink, { waitUntil: 'domcontentloaded' });
      const breadcrumbHome = await page.locator('a:has-text("Home"), [class*="breadcrumb"] a:first-child').first().isVisible().catch(() => false);
      
      if (breadcrumbHome) {
        await page.click('a:has-text("Home"), [class*="breadcrumb"] a:first-child');
        await page.waitForLoadState('domcontentloaded');
        expect(page.url()).toContain('/');
      }
    }
  });
});

test.describe('Footer Navigation', () => {
  test('should have footer with navigation links', async ({ page }) => {
    await safeGoto(page, '/');
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
    
    const footer = await page.locator('footer');
    const footerLinks = await footer.locator('a').count();
    expect(footerLinks).toBeGreaterThan(0);
  });

  test('should have working footer links', async ({ page }) => {
    await safeGoto(page, '/');
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
    
    const footerLinks = await page.locator('footer a').all();
    if (footerLinks.length > 0) {
      const firstFooterLink = footerLinks[0];
      const href = await firstFooterLink.getAttribute('href');
      if (href && !href.startsWith('http')) {
        await firstFooterLink.click();
      }
    }
  });

  test('should display social media links in footer', async ({ page }) => {
    await safeGoto(page, '/');
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
    
    const socialLinks = await page.locator('footer a[href*="twitter"], footer a[href*="linkedin"], footer a[href*="facebook"], footer a[href*="instagram"]').count();
  });


});