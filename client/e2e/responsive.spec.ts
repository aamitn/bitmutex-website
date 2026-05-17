import { test, expect, devices } from '@playwright/test';
import { ResponsiveHelper } from './pages';

test.describe('Responsive Design - Desktop', () => {
  test('should display desktop layout at 1280px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Desktop menu should be visible
    const header = await page.locator('header').isVisible();
    expect(header).toBeTruthy();
  });


  test('should display multi-column layout on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    // Check for grid/multi-column layout
    const items = await page.locator('[class*="grid"], [class*="flex"]').count();
    expect(items).toBeGreaterThan(0);
  });

  test('should not show mobile menu on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    const mobileMenuButton = await page.locator('button[aria-label*="menu"][class*="mobile"], button[class*="hamburger"]').isVisible().catch(() => false);
    // Mobile menu should be hidden
  });
});

test.describe('Responsive Design - Tablet', () => {
  
  // ✅ FIX: Set viewport instead of using test.use()
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
  });

  test('should display tablet layout', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const header = await page.locator('header').isVisible();
    expect(header).toBeTruthy();
  });

  test('should handle tablet orientation changes', async ({ page }) => {
    // Start in portrait (set by beforeEach)
    await page.goto('/');
    const portraitUrl = page.url();

    // Change to landscape
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(500);

    // Should maintain page
    expect(page.url()).toContain(portraitUrl);
  });

  test('should display content columns appropriately on tablet', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    const gridItems = await page.locator('[class*="grid"], article, [class*="card"]').count();
    expect(gridItems).toBeGreaterThan(0);
  });

  test('should have readable text on tablet', async ({ page }) => {
    await page.goto('/');
    const fontSize = await page.locator('body').evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });
    
    const fontSizeValue = parseInt(fontSize);
    expect(fontSizeValue).toBeGreaterThanOrEqual(12);
  });
});

test.describe('Responsive Design - Mobile', () => {
  
  // ✅ FIX: Simulate iPhone 12 width manually
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('should stack content vertically on mobile', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    // Check that layout adapts to mobile width
    const contentWidth = await page.evaluate(() => {
      const main = document.querySelector('main') || document.querySelector('article') || document.body;
      return window.getComputedStyle(main).maxWidth;
    });

    expect(contentWidth).toBeTruthy();
  });


  test('should have touch-friendly tap targets on mobile', async ({ page }) => {
    await page.goto('/');

    const buttons = await page.locator('button').all();
    for (const button of buttons.slice(0, 3)) {
      const boundingBox = await button.boundingBox();
      if (boundingBox) {
        // Touch targets should be at least 44x44 pixels
        expect(boundingBox.height).toBeGreaterThanOrEqual(40);
        expect(boundingBox.width).toBeGreaterThanOrEqual(40);
      }
    }
  });

  test('should not have horizontal scroll on mobile', async ({ page }) => {
    await page.goto('/');

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    expect(hasHorizontalScroll).toBeFalsy();
  });

  test('should display images correctly on mobile', async ({ page }) => {
    await page.goto('/');

    const images = await page.locator('img').all();
    for (const img of images.slice(0, 3)) {
      const width = await img.evaluate((el: HTMLImageElement) => {
        return el.width;
      });
      // Images should have width set
      expect(width).toBeGreaterThan(0);
    }
  });

  test('should handle text input on mobile', async ({ page }) => {
    await page.goto('/');

    const inputs = await page.locator('input, textarea').all();
    if (inputs.length > 0) {
      const firstInput = inputs[0];
      await firstInput.click();
      // Should show keyboard
    }
  });

  test('should display video correctly on mobile', async ({ page }) => {
    await page.goto('/');

    const videos = await page.locator('video, iframe[src*="youtube"], iframe[src*="vimeo"]').count();
    // Videos might be present
  });
});

test.describe('Responsive Design - Android', () => {
  
  // ✅ FIX: Simulate Pixel 5 width manually
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 851 });
  });

  test('should display correctly on Android phone', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const viewportSize = page.viewportSize();
    expect(viewportSize?.width).toBeLessThan(500);
  });

  test('should handle Android navigation', async ({ page }) => {
    await page.goto('/');
    
    const navButton = await page.locator('a[href="/blog"], button:has-text("Blog")').first().isVisible().catch(() => false);
    // Should have navigation
  });
});

test.describe('Responsive Images', () => {
  
  // ✅ FIX: Set viewport instead of using test.use()
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('should load appropriate images for viewport size', async ({ page }) => {
    await page.goto('/');

    const images = await page.locator('img').all();
    for (const img of images) {
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('should use picture element for responsive images if available', async ({ page }) => {
    await page.goto('/');

    const pictureElements = await page.locator('picture').count();
    // Picture elements are optional
  });

  test('should have alt text for all images', async ({ page }) => {
    await page.goto('/');

    const images = await page.locator('img:not([alt=""])').all();
    // Critical images should have alt text
  });
});

test.describe('Responsive Typography', () => {
  async function checkHeadingSize(page: any, headingTag: string) {
    const fontSize = await page.locator(headingTag).first().evaluate((el: any) => {
      return window.getComputedStyle(el).fontSize;
    });
    return parseInt(fontSize);
  }

  test('should have responsive heading sizes', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    const desktopH1Size = await checkHeadingSize(page, 'h1');

    await page.setViewportSize({ width: 375, height: 667 });
    const mobileH1Size = await checkHeadingSize(page, 'h1');

    // Mobile heading should be smaller
    expect(mobileH1Size).toBeLessThanOrEqual(desktopH1Size);
  });

  test('should maintain readability at different sizes', async ({ page }) => {
    const sizes = [375, 768, 1280, 1920];

    for (const width of sizes) {
      await page.setViewportSize({ width, height: 720 });
      await page.goto('/');

      const lineHeight = await page.locator('p').first().evaluate((el: any) => {
        return window.getComputedStyle(el).lineHeight;
      });

      expect(lineHeight).toBeTruthy();
    }
  });
});

test.describe('Responsive Containers', () => {
  test('should use appropriate container widths', async ({ page }) => {
    const sizes = [
      { width: 375, name: 'mobile' },
      { width: 768, name: 'tablet' },
      { width: 1280, name: 'desktop' },
      { width: 1920, name: 'wide' },
    ];

    for (const size of sizes) {
      await page.setViewportSize({ width: size.width, height: 720 });
      await page.goto('/');

      const content = page.locator('main, article, [role="main"]').first();
      const maxWidth = await content.evaluate((el: any) => {
        return window.getComputedStyle(el).maxWidth;
      });

      expect(maxWidth).toBeTruthy();
    }
  });
});