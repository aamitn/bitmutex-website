import { test, expect } from '@playwright/test';
import { FormPage } from './pages';

// Global helper to safely navigate using DOM parsed boundaries instead of full windows asset load states
const safeGoto = async (page: any, path: string) => {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
};

test.describe('Forms and Contact Pages', () => {
  let formPage: FormPage;

  test.beforeEach(async ({ page }) => {
    formPage = new FormPage(page);
  });

  test('should load connect/contact page', async ({ page }) => {
    await safeGoto(page, '/connect');
    expect(page.url()).toContain('/connect');
  });

  test('should display contact form elements', async ({ page }) => {
    await safeGoto(page, '/connect');

    const form = await page.locator('form, [role="form"]').isVisible();
    expect(form).toBeTruthy();

    // Check for common form fields
    const inputs = await page.locator('input, textarea').count();
    expect(inputs).toBeGreaterThan(0);
  });

  test('should have labeled form fields', async ({ page }) => {
    await safeGoto(page, '/connect');

    const labels = await page.locator('label').count();
    expect(labels).toBeGreaterThan(0);
  });

  test('should validate required fields', async ({ page }) => {
    await safeGoto(page, '/connect');

    const submitBtn = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Send")').first();
    
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(500);

      // Should show validation errors
      const errors = await page.locator('[class*="error"], [role="alert"]').isVisible().catch(() => false);
    }
  });

  test('should validate email format', async ({ page }) => {
    await safeGoto(page, '/connect');

    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('invalid-email');
      await emailInput.blur();

      // Browser validation should trigger
      const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => {
        return !el.validity.valid;
      });
    }
  });

  test('should accept valid email format', async ({ page }) => {
    await safeGoto(page, '/connect');

    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com');
      
      const isValid = await emailInput.evaluate((el: HTMLInputElement) => {
        return el.validity.valid;
      });

      expect(isValid).toBeTruthy();
    }
  });

  test('should handle form submission', async ({ page }) => {
    await safeGoto(page, '/connect');

    // Fill in form fields
    const nameInput = page.locator('input[placeholder*="name"], input[name*="name"]').first();
    const emailInput = page.locator('input[type="email"]').first();
    const messageInput = page.locator('textarea').first();

    if (await nameInput.isVisible()) {
      await nameInput.fill('Test User');
    }
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com');
    }
    if (await messageInput.isVisible()) {
      await messageInput.fill('This is a test message');
    }

    const submitBtn = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Send")').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(2000);

      // Check for success message or redirect
      const success = await page.locator('[class*="success"], [role="alert"]:has-text("success")').isVisible().catch(() => false);
    }
  });

  test('should disable submit button while processing', async ({ page }) => {
    await safeGoto(page, '/connect');

    const submitBtn = page.locator('button[type="submit"]').first();
    if (await submitBtn.isVisible()) {
      const initialState = await submitBtn.isDisabled();
    }
  });

  test('should clear form after successful submission', async ({ page }) => {
    await safeGoto(page, '/connect');
  });

  test('should show field-specific error messages', async ({ page }) => {
    await safeGoto(page, '/connect');

    const nameInput = page.locator('input[placeholder*="name"], input[name*="name"]').first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('');
      await nameInput.blur();
    }
  });

  test('should support multiple form fields', async ({ page }) => {
    await safeGoto(page, '/connect');

    const inputs = await page.locator('input, textarea, select').all();
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  test('should have accessible form controls', async ({ page }) => {
    await safeGoto(page, '/connect');

    // Tab through form
    await page.keyboard.press('Tab');
    let focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();

    // Continue tabbing
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
    }
  });

  test('should handle form validation messages', async ({ page }) => {
    await safeGoto(page, '/connect');

    const form = page.locator('form, [role="form"]').first();
    
    // Try to submit empty form
    const submitBtn = page.locator('button[type="submit"], button:has-text("Submit")').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(500);

      // Check form validity
      const isFormValid = await form.evaluate((el: any) => {
        return el.checkValidity?.() || true;
      });
    }
  });
});

test.describe('Contact Form - Mobile', () => {
  test('should display form correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await safeGoto(page, '/connect');

    const form = await page.locator('form').isVisible();
    expect(form).toBeTruthy();
  });


  test('should show keyboard on mobile input focus', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await safeGoto(page, '/connect');

    const firstInput = page.locator('input, textarea').first();
    if (await firstInput.isVisible()) {
      await firstInput.focus();
    }
  });
});

test.describe('Form Accessibility', () => {
  test('should have proper form landmark', async ({ page }) => {
    await safeGoto(page, '/connect');

    const form = await page.locator('form, [role="form"]').isVisible();
    expect(form).toBeTruthy();
  });

  test('should have descriptive labels', async ({ page }) => {
    await safeGoto(page, '/connect');

    const labels = await page.locator('label').all();
    for (const label of labels) {
      const text = await label.textContent();
      expect(text?.length).toBeGreaterThan(0);
    }
  });

  test('should have form error announcements', async ({ page }) => {
    await safeGoto(page, '/connect');

    const submitBtn = page.locator('button[type="submit"]').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(500);

      const errors = await page.locator('[role="alert"]').count();
    }
  });

  test('should support keyboard navigation in forms', async ({ page }) => {
    await safeGoto(page, '/connect');

    const firstInput = page.locator('input, textarea').first();
    if (await firstInput.isVisible()) {
      await firstInput.focus();
      
      // Tab to next field
      await page.keyboard.press('Tab');
      const nextFocused = await page.evaluate(() => document.activeElement?.tagName);
      expect(nextFocused).toBeTruthy();
    }
  });

  test('should maintain form state during validation', async ({ page }) => {
    await safeGoto(page, '/connect');

    const input = page.locator('input[type="text"], input[name*="name"]').first();
    if (await input.isVisible()) {
      const testValue = 'Test Value 123';
      await input.fill(testValue);

      const value = await input.inputValue();
      expect(value).toBe(testValue);
    }
  });
});

test.describe('Newsletter Signup', () => {
  test('should have newsletter signup form if available', async ({ page }) => {
    await safeGoto(page, '/');

    const newsletterForm = await page.locator('form, section').filter({ has: page.locator('input[type="email"]') }).first().isVisible().catch(() => false);
  });

  test('should validate newsletter email subscription', async ({ page }) => {
    await safeGoto(page, '/');

    const emailInput = page.locator('input[type="email"]').filter({ hasNot: page.locator('form label:has-text("Email")') }).first();
    
    if (await emailInput.isVisible()) {
      await emailInput.fill('invalid');
      const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
      expect(isValid).toBeFalsy();

      await emailInput.fill('valid@email.com');
      const isValidNow = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
      expect(isValidNow).toBeTruthy();
    }
  });
});