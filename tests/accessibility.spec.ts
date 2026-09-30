import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const expectNoViolations = async (page: Page) => {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
};

test('desktop page has no detectable accessibility violations', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expectNoViolations(page);
});

test('mobile page and open navigation have no detectable accessibility violations', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expectNoViolations(page);

  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expectNoViolations(page);
});

test('contact failure feedback has no detectable accessibility violations', async ({
  page,
}) => {
  await page.goto('/');
  await page.route('http://127.0.0.1:4321/', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 503, body: 'unavailable' });
      return;
    }
    await route.continue();
  });

  const form = page.locator('[data-contact-form]');
  await form.locator('#contact-name').fill('Test Visitor');
  await form.locator('#contact-email').fill('visitor@example.test');
  await form.locator('#contact-message').fill('Controlled test message');
  await form.getByRole('button', { name: 'Send message →' }).click();
  await expect(form.locator('[data-form-failure]')).toBeVisible();

  await expectNoViolations(page);
});
