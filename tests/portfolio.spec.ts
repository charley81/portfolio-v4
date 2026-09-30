import { expect, test } from '@playwright/test';

const viewports = [
  { width: 320, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 720, height: 900 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 1000 },
  { width: 1920, height: 1080 },
] as const;

test('renders the approved content, metadata, and destinations', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page).toHaveTitle(
    'Christopher Harley — Creative Frontend Developer',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, nofollow',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://christopherharley.com/',
  );
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Creative Frontend Developer',
  );

  await expect(page.locator('#work article')).toHaveCount(2);
  await expect(page.locator('#work')).toContainText('BASSMENT');
  await expect(page.locator('#work')).toContainText('Marsh & Ember');
  await expect(page.locator('#work')).not.toContainText('Cape & Canopy');

  await expect(
    page.getByRole('link', { name: /BASSMENT project/ }),
  ).toHaveAttribute('href', 'https://clubbassment.com/');
  await expect(
    page.getByRole('link', { name: /Marsh & Ember project/ }),
  ).toHaveAttribute('href', 'https://marshandember.netlify.app/');
  await expect(page.locator('a[href="/resume.pdf"]')).not.toHaveCount(0);
  await expect(
    page.locator('a[href="mailto:chrisharley81@gmail.com"]'),
  ).not.toHaveCount(0);
  await expect(page.locator('footer')).toContainText(
    '© 2025 Christopher Harley',
  );
});

test('internal navigation reaches every section', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');

  for (const destination of [
    'capabilities',
    'about',
    'skills',
    'experience',
    'work',
    'contact',
  ]) {
    await page
      .locator(`nav[aria-label="Primary navigation"] a[href="#${destination}"]`)
      .click();
    await expect(page).toHaveURL(new RegExp(`#${destination}$`));
    await expect(page.locator(`#${destination}`)).toBeVisible();
  }
});

for (const viewport of viewports) {
  test(`has no horizontal page overflow at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
}

test('mobile navigation is keyboard-operable and restores focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const trigger = page.getByRole('button', { name: 'Open navigation menu' });
  const dialog = page.getByRole('dialog', { name: 'Mobile navigation' });

  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(dialog).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('body')).toHaveAttribute('data-menu-open', '');
  await expect(
    dialog.getByRole('link', { name: 'Capabilities' }),
  ).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('mobile navigation closes after same-page navigation', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await page.getByRole('dialog').getByRole('link', { name: 'Work' }).click();

  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page).toHaveURL(/#work$/);
});

test('keyboard focus is visibly indicated', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');

  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skipLink).toBeFocused();
  const outline = await skipLink.evaluate(
    (element) => getComputedStyle(element).outlineStyle,
  );
  expect(outline).toBe('solid');
});

test('contact form uses native validation and shows controlled success', async ({
  page,
}) => {
  await page.goto('/');
  const form = page.locator('[data-contact-form]');

  await form.getByRole('button', { name: 'Send message →' }).click();
  await expect(form.locator('#contact-name')).toBeFocused();

  await page.route('http://127.0.0.1:4321/', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 200, body: 'ok' });
      return;
    }
    await route.continue();
  });

  await form.locator('#contact-name').fill('Test Visitor');
  await form.locator('#contact-email').fill('visitor@example.test');
  await form.locator('#contact-message').fill('Controlled test message');
  await form.getByRole('button', { name: 'Send message →' }).click();

  await expect(form.locator('[data-form-success]')).toBeVisible();
  await expect(form.locator('[data-form-success]')).toHaveText(
    'Thanks for reaching out, I’ll be in touch immediately',
  );
  await expect(form.locator('#contact-name')).toHaveValue('');
});

test('contact form shows the approved failure message', async ({ page }) => {
  await page.goto('/');
  await page.route('http://127.0.0.1:4321/', async (route) => {
    if (route.request().method() === 'POST') {
      await route.abort('failed');
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
  await expect(form.locator('[data-form-failure]')).toContainText(
    'Something went wrong. Please try again or email me directly at chrisharley81@gmail.com.',
  );
});

test('reduced motion removes meaningful transition duration', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const duration = await page
    .getByRole('link', { name: 'Skip to main content' })
    .evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.00001);
});
