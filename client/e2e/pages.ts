import { expect, Locator, Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string, readyTestId?: string) {
    await this.page.goto(path, {
      waitUntil: 'domcontentloaded', // Fast DOM lifecycle checkpoint
      timeout: 60000,
    });

    // Wait for hydration/frame settle
    await this.page.waitForTimeout(150);

    if (readyTestId) {
      await expect(this.page.getByTestId(readyTestId)).toBeVisible({
        timeout: 15000,
      });
    }
  }

  async clickAndWaitForUrl(locator: Locator, url: string | RegExp) {
    await Promise.all([
      this.page.waitForURL(url, { timeout: 30000 }),
      locator.click(),
    ]);
  }

  async waitForReady(testId: string) {
    await expect(this.page.getByTestId(testId)).toBeVisible();
  }

  async safeClick(locator: Locator) {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();
    await locator.click();
  }

  async textContent(locator: Locator) {
    await expect(locator).toBeVisible();
    return locator.textContent();
  }
}

// ✅ BlogPage Object Model
export class BlogPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async getPostCount() {
    return await this.page.locator('article, [class*="post"]').count();
  }

  async openFirstPost() {
    const firstPostLink = this.page.locator('a[href*="/blog/"]').first();
    await firstPostLink.click();
  }

  async navigateToNextPage() {
    const nextButton = this.page.locator('[class*="next"], [aria-label*="next"]').first();
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }
}

// ✅ BlogPostPage Object Model
export class BlogPostPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async getTitle() {
    const titleLocator = this.page.locator('h1').first();
    return await titleLocator.textContent();
  }

  async getReadingTime() {
    const element = this.page.locator('text=/min read/i').first();
    return (await element.isVisible()) ? await element.textContent() : null;
  }

  async getViewCount() {
    const element = this.page.locator('text=/views/i').first();
    return (await element.isVisible()) ? await element.textContent() : null;
  }

  async getAuthorName() {
    const element = this.page.locator('[class*="author"]').first();
    return (await element.isVisible()) ? await element.textContent() : null;
  }

  async getTableOfContentsItems() {
    return await this.page.locator('[class*="toc"] a, [class*="contents"] a').count();
  }

  async viewRelatedPosts() {
    return await this.page.locator('text=/related/i').first().isVisible().catch(() => false);
  }
}

// ✅ FormPage Object Model (For forms.spec.ts)
export class FormPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
}

// ✅ HomePage Object Model (For home.spec.ts)
export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async isHeroSectionVisible() {
    return await this.page.locator('section').first().isVisible();
  }

  // ✅ FIX: Swapped direct page overrides to inherit parent class goto rules safely
  async navigateToBlog() { await this.goto('/blog'); }
  async navigateToServices() { await this.goto('/services'); }
  async navigateToProjects() { await this.goto('/projects'); }
  async navigateToIndustries() { await this.goto('/industries'); }
  async navigateToDashboard() { await this.goto('/dashboard'); }
  async navigateToConnect() { await this.goto('/connect'); }

  async isDarkModeEnabled() { 
    return await this.page.locator('html').getAttribute('class').then(c => c?.includes('dark') || false); 
  }
  
  async toggleDarkMode() {
    const toggle = this.page.locator('[class*="theme"], [class*="mode"]').first();
    if (await toggle.isVisible()) await toggle.click();
  }
}

// ✅ Navigation Object Model (For navigation.spec.ts)
export class Navigation extends BasePage {
  constructor(page: Page) {
    super(page);
  }
}

// ✅ ResponsiveHelper Object Model (For responsive.spec.ts)
export class ResponsiveHelper extends BasePage {
  constructor(page: Page) {
    super(page);
  }
}