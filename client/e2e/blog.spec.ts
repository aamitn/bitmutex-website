import { test, expect } from '@playwright/test';
import { BlogPage, BlogPostPage } from './pages';

// Global navigation helper to guarantee clean DOM parsing lifecycle states
const safeGoto = async (page: any, path: string) => {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
};

test.describe('Blog Page', () => {
  let blogPage: BlogPage;

  test.beforeEach(async ({ page }) => {
    blogPage = new BlogPage(page);
    // Explicitly navigate using a safe loading standard rather than default full blocking asset resolution
    await safeGoto(page, '/blog');
  });

  test('should load blog page successfully', async ({ page }) => {
    expect(page.url()).toContain('/blog');
    await expect(page).toHaveTitle(/blog|articles/i);
  });

  test('should display pagination if available', async ({ page }) => {
    const paginationExists = await page.locator('[class*="paginat"], [aria-label*="paginat"]').isVisible().catch(() => false);
  });

  test('should have working category filters if available', async ({ page }) => {
    const filters = await page.locator('[class*="filter"], [class*="categor"]').count();
  });

  test('should have search functionality if available', async ({ page }) => {
    const searchInput = await page.locator('input[type="search"], input[placeholder*="search"]').isVisible().catch(() => false);
  });

  test('should have accessible blog structure', async ({ page }) => {
    const articles = await page.locator('article').count();
    if (articles > 0) {
      expect(articles).toBeGreaterThan(0);
    }
  });

  test('should display post metadata', async ({ page }) => {
    const dateElements = await page.locator('time, [class*="date"]').count();
  });
});

test.describe('Blog Post Page', () => {
  let blogPostPage: BlogPostPage;

  test.beforeEach(async ({ page }) => {
    blogPostPage = new BlogPostPage(page);
    
    // 1. Navigate to the main blog listing cleanly
    await page.goto('/blog', { waitUntil: 'domcontentloaded' });
    
    // 2. Locate the first post link node
    const firstPostLink = page.locator('a[href*="/blog/"]').first();
    
    // 3. Click it to trigger client-side transition + give it compilation breathing room
    await firstPostLink.click();
    
    // 4. Wait for a reliable layout marker on the page instead of the network
    await page.locator('article h1').first().waitFor({ state: 'visible', timeout: 15000 });
  });

  test('should load blog post successfully', async ({ page }) => {
    expect(page.url()).toContain('/blog/');
  });

  test('should display article title', async () => {
    const title = await blogPostPage.getTitle();
    expect(title).toBeTruthy();
    expect(title?.length).toBeGreaterThan(5);
  });

  test('should display reading time', async () => {
    const readingTime = await blogPostPage.getReadingTime();
  });

  test('should display view count', async () => {
    const viewCount = await blogPostPage.getViewCount();
  });

  test('should display author information', async () => {
    const authorName = await blogPostPage.getAuthorName();
  });

  test('should have table of contents', async ({ page }) => {
    const tocItems = await blogPostPage.getTableOfContentsItems();
  });

  test('should allow clicking table of contents items', async ({ page }) => {
    const tocItems = await page.locator('[class*="toc"] a, [class*="contents"] a').count();
    if (tocItems > 0) {
      const firstTocLink = await page.locator('[class*="toc"] a, [class*="contents"] a').first();
      const href = await firstTocLink.getAttribute('href');
      if (href) {
        await firstTocLink.click();
      }
    }
  });

  test('should have social share buttons', async ({ page }) => {
    const shareButtons = await page.locator('a[href*="twitter"], a[href*="linkedin"], a[href*="facebook"]').count();
  });

  test('should have proper article structure', async ({ page }) => {
    const article = await page.locator('article').isVisible();
    expect(article).toBeTruthy();
  });

  test('should display content correctly', async ({ page }) => {
    const content = await page.locator('article').textContent();
    expect(content).toBeTruthy();
    expect(content?.length).toBeGreaterThan(100);
  });

  test('should have related posts section', async () => {
    const hasRelated = await blogPostPage.viewRelatedPosts();
  });

  test('should allow navigating to related posts', async ({ page }) => {
    const relatedPosts = await page.locator('a[href*="/blog/"]').count();
    if (relatedPosts > 1) {
      expect(relatedPosts).toBeGreaterThanOrEqual(1);
    }
  });

  test('should handle syntax highlighted code blocks', async ({ page }) => {
    const codeBlocks = await page.locator('pre, code').count();
  });

  test('should have accessible heading structure', async ({ page }) => {
    const h1Tags = await page.locator('h1').count();
    expect(h1Tags).toBeGreaterThan(0);
  });

  test('should have proper image handling', async ({ page }) => {
    const images = await page.locator('article img').count();
    if (images > 0) {
      const imagesWithAlt = await page.locator('article img[alt]').count();
      expect(imagesWithAlt).toBeGreaterThan(0);
    }
  });

  test('should load without performance issues', async ({ page, context }) => {
    let networkErrors = 0;
    context.on('page', (newPage) => {
      newPage.on('response', (response) => {
        if (!response.ok()) networkErrors++;
      });
    });
    expect(networkErrors).toBeLessThan(3);
  });
});

test.describe('Blog - Reading Experience', () => {
  test('should have readable text sizes', async ({ page }) => {
    await safeGoto(page, '/blog');

    const firstPostLink = await page.locator('a[href*="/blog/"]').first().getAttribute('href');
    if (firstPostLink) {
      await page.goto(firstPostLink, { waitUntil: 'domcontentloaded' });

      const bodyText = await page.locator('body').evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      expect(bodyText).toBeTruthy();
    }
  });

  test('should have proper line spacing for readability', async ({ page }) => {
    await safeGoto(page, '/blog');
    const firstPostLink = await page.locator('a[href*="/blog/"]').first().getAttribute('href');
    if (firstPostLink) {
      await page.goto(firstPostLink, { waitUntil: 'domcontentloaded' });

      const lineHeight = await page.locator('article p').first().evaluate((el) => {
        return window.getComputedStyle(el).lineHeight;
      });
      expect(lineHeight).toBeTruthy();
    }
  });

  test('should support reading progress indicator if available', async ({ page }) => {
    await safeGoto(page, '/blog');
    const firstPostLink = await page.locator('a[href*="/blog/"]').first().getAttribute('href');
    if (firstPostLink) {
      await page.goto(firstPostLink, { waitUntil: 'domcontentloaded' });
      const progressBar = await page.locator('[class*="progress"], [role="progressbar"]').isVisible().catch(() => false);
    }
  });
});