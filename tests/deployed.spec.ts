import AxeBuilder from '@axe-core/playwright';
import { expect, test as base } from '@playwright/test';
import type { Page } from '@playwright/test';
import {
  aboutParagraphs,
  capabilities,
  contact,
  experience,
  masthead,
  navigation,
  projects,
  site,
  skills,
} from '../src/content/portfolio';

const deployedBaseURL = process.env.PLAYWRIGHT_BASE_URL?.trim();
const firstPartyOrigin = new URL(deployedBaseURL || 'http://127.0.0.1:4321')
  .origin;

const responsiveViewports = [
  { width: 320, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 1000 },
  { width: 1920, height: 1080 },
] as const;

const requiredAssets = [
  '/resume.pdf',
  '/favicon.ico',
  '/assets/arrow-up-right-desktop.svg',
  '/assets/arrow-up-right-mobile.svg',
  '/assets/close.svg',
  '/assets/menu.svg',
  '/assets/status-dot-desktop.svg',
  '/assets/status-dot-mobile.svg',
] as const;

const isPostHogURL = (value: string): boolean => {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    const isPostHogHost =
      hostname === 'posthog.com' || hostname.endsWith('.posthog.com');
    const isFirstPartyProxy =
      url.origin === firstPartyOrigin &&
      (url.pathname === '/posthog' || url.pathname.startsWith('/posthog/'));

    return isPostHogHost || isFirstPartyProxy;
  } catch {
    return false;
  }
};

const isExpectedPostHogDiagnostic = (
  message: string,
  locationURL = '',
): boolean =>
  isPostHogURL(locationURL) || message.toLowerCase().includes('posthog');

class DeployedPage {
  readonly page: Page;
  blockedPostHogRequestCount = 0;
  private installed = false;
  private readonly consoleErrors: string[] = [];
  private readonly externalNavigations: string[] = [];
  private readonly firstPartyFailures: string[] = [];
  private readonly firstPartyHttpErrors: string[] = [];
  private readonly firstPartyPosts: string[] = [];
  private readonly pageErrors: string[] = [];

  constructor(page: Page) {
    this.page = page;
  }

  get postHogGuardInstalled(): boolean {
    return this.installed;
  }

  async installGuards(): Promise<void> {
    await this.page.route('**/*', async (route) => {
      if (isPostHogURL(route.request().url())) {
        this.blockedPostHogRequestCount += 1;
        await route.abort('blockedbyclient');
        return;
      }

      await route.continue();
    });

    this.page.on('console', (message) => {
      if (message.type() !== 'error') return;
      if (
        isExpectedPostHogDiagnostic(
          message.text(),
          message.location().url ?? '',
        )
      ) {
        return;
      }

      this.consoleErrors.push(message.text());
    });

    this.page.on('pageerror', (error) => {
      if (isExpectedPostHogDiagnostic(error.message, error.stack)) return;
      this.pageErrors.push(error.message);
    });

    this.page.on('request', (request) => {
      if (isPostHogURL(request.url())) return;

      const url = new URL(request.url());
      if (url.origin === firstPartyOrigin && request.method() === 'POST') {
        this.firstPartyPosts.push(`${request.method()} ${url.pathname}`);
      }
    });

    this.page.on('requestfailed', (request) => {
      if (isPostHogURL(request.url())) return;

      const url = new URL(request.url());
      if (url.origin === firstPartyOrigin) {
        this.firstPartyFailures.push(
          `${request.method()} ${url.pathname}: ${request.failure()?.errorText ?? 'unknown failure'}`,
        );
      }
    });

    this.page.on('response', (response) => {
      if (isPostHogURL(response.url())) return;

      const url = new URL(response.url());
      if (url.origin === firstPartyOrigin && response.status() >= 400) {
        this.firstPartyHttpErrors.push(
          `${response.status()} ${response.request().method()} ${url.pathname}`,
        );
      }
    });

    this.page.on('framenavigated', (frame) => {
      if (frame !== this.page.mainFrame() || frame.url() === 'about:blank') {
        return;
      }

      const url = new URL(frame.url());
      if (url.origin !== firstPartyOrigin) {
        this.externalNavigations.push(url.origin);
      }
    });

    this.installed = true;
  }

  async goto(path = '/'): Promise<void> {
    expect(
      this.installed,
      'PostHog interception must be installed before deployed navigation',
    ).toBe(true);

    const response = await this.page.goto(path, { waitUntil: 'load' });
    expect(response, `Expected a document response for ${path}`).not.toBeNull();
    expect(response?.ok(), `Expected a successful response for ${path}`).toBe(
      true,
    );
  }

  expectNoMutationsOrRuntimeErrors(): void {
    expect(this.firstPartyPosts, 'No first-party POST is allowed').toEqual([]);
    expect(
      this.externalNavigations,
      'External destinations must be inspected by href only',
    ).toEqual([]);
    expect(this.pageErrors, 'Unexpected page errors').toEqual([]);
    expect(this.consoleErrors, 'Unexpected console errors').toEqual([]);
    expect(this.firstPartyFailures, 'Unexpected first-party failures').toEqual(
      [],
    );
    expect(
      this.firstPartyHttpErrors,
      'Unexpected first-party HTTP errors',
    ).toEqual([]);
  }
}

type DeployedFixtures = {
  deployedPage: DeployedPage;
};

const test = base.extend<DeployedFixtures>({
  deployedPage: async ({ page }, use) => {
    const deployedPage = new DeployedPage(page);
    await deployedPage.installGuards();
    await use(deployedPage);
    deployedPage.expectNoMutationsOrRuntimeErrors();
  },
});

test.skip(
  !deployedBaseURL,
  'Set PLAYWRIGHT_BASE_URL to run the deployed-site suite.',
);

test('installs the PostHog guard before the first deployed navigation', async ({
  deployedPage,
}) => {
  expect(isPostHogURL('https://us.i.posthog.com/e/')).toBe(true);
  expect(isPostHogURL('https://eu.i.posthog.com/decide/')).toBe(true);
  expect(isPostHogURL(`${firstPartyOrigin}/posthog/e/`)).toBe(true);
  expect(deployedPage.postHogGuardInstalled).toBe(true);

  await deployedPage.goto();
});

test('renders the approved metadata, content, and destinations', async ({
  deployedPage,
}) => {
  const { page } = deployedPage;
  await deployedPage.goto();

  await expect(page).toHaveTitle(site.title);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, nofollow',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    site.canonicalUrl,
  );
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    masthead.heading,
  );
  await expect(page.locator('astro-island')).toHaveCount(0);

  for (const item of navigation) {
    await expect(page.locator(`#${item.id}`)).toBeVisible();
  }

  for (const capability of capabilities) {
    await expect(page.locator('#capabilities')).toContainText(capability.title);
    await expect(page.locator('#capabilities')).toContainText(
      capability.description,
    );
  }

  for (const paragraph of aboutParagraphs) {
    await expect(page.locator('#about')).toContainText(paragraph);
  }

  for (const skill of skills) {
    await expect(page.locator('#skills')).toContainText(skill.category);
    await expect(page.locator('#skills')).toContainText(skill.tools);
  }

  for (const item of experience) {
    await expect(page.locator('#experience')).toContainText(item.title);
    await expect(page.locator('#experience')).toContainText(item.description);
  }

  await expect(page.locator('#work article')).toHaveCount(projects.length);
  for (const project of projects) {
    await expect(page.locator('#work')).toContainText(project.category);
    await expect(page.locator('#work')).toContainText(project.title);
    await expect(page.locator('#work')).toContainText(project.description);
    await expect(page.locator('#work')).toContainText(project.technologies);
    await expect(
      page.getByRole('link', { name: new RegExp(`${project.title} project`) }),
    ).toHaveAttribute('href', project.href);
  }

  await expect(page.locator('#contact')).toContainText(contact.heading);
  await expect(page.locator('#contact')).toContainText(contact.description);
  await expect(page.locator('footer')).toContainText(
    '© 2025 Christopher Harley',
  );

  const internalHrefs = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      [...new Set(links.map((link) => link.getAttribute('href')))].sort(),
    );
  expect(internalHrefs).toEqual(
    [
      '#about',
      '#capabilities',
      '#contact',
      '#experience',
      '#main-content',
      '#skills',
      '#top',
      '#work',
    ].sort(),
  );

  for (const item of navigation) {
    await expect(
      page.locator(
        `nav[aria-label="Primary navigation"] a[href="#${item.id}"]`,
      ),
    ).toHaveAttribute('href', `#${item.id}`);
    await expect(
      page.locator(`nav[aria-label="Mobile navigation"] a[href="#${item.id}"]`),
    ).toHaveAttribute('href', `#${item.id}`);
  }

  await expect(page.locator(`a[href="${site.resumeHref}"]`)).toHaveCount(5);
  await expect(page.locator(`a[href="${site.emailHref}"]`)).not.toHaveCount(0);
  await expect(page.locator(`a[href="${site.linkedInHref}"]`)).toHaveCount(3);
  await expect(page.locator(`a[href="${site.githubHref}"]`)).toHaveCount(3);
});

test('serves robots, required assets, and security headers', async ({
  deployedPage,
}) => {
  const { page } = deployedPage;
  await deployedPage.goto();

  const documentResponse = await page.request.get('/');
  expect(documentResponse.ok()).toBe(true);
  const headers = documentResponse.headers();
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['permissions-policy']).toBe(
    'camera=(), geolocation=(), microphone=()',
  );

  const robotsResponse = await page.request.get('/robots.txt');
  expect(robotsResponse.ok()).toBe(true);
  const robots = await robotsResponse.text();
  expect(robots).toMatch(/User-agent:\s*\*/i);
  expect(robots).toMatch(/Disallow:\s*\//i);

  for (const asset of requiredAssets) {
    const response = await page.request.get(asset);
    expect(response.ok(), `Expected ${asset} to return successfully`).toBe(
      true,
    );
    expect(new URL(response.url()).origin).toBe(firstPartyOrigin);
  }
});

test('desktop same-page navigation reaches every approved section', async ({
  deployedPage,
}) => {
  const { page } = deployedPage;
  await page.setViewportSize({ width: 1440, height: 1000 });
  await deployedPage.goto();

  for (const item of navigation) {
    await page
      .locator(`nav[aria-label="Primary navigation"] a[href="#${item.id}"]`)
      .click();
    await expect(page).toHaveURL(new RegExp(`#${item.id}$`));
    await expect(page.locator(`#${item.id}`)).toBeVisible();
  }
});

test('mobile-dialog navigation reaches every approved section', async ({
  deployedPage,
}) => {
  const { page } = deployedPage;
  await page.setViewportSize({ width: 390, height: 844 });
  await deployedPage.goto();

  const trigger = page.getByRole('button', { name: 'Open navigation menu' });
  const dialog = page.getByRole('dialog', { name: 'Mobile navigation' });

  for (const item of navigation) {
    await trigger.click();
    await expect(dialog).toBeVisible();
    await dialog.locator(`a[href="#${item.id}"]`).click();
    await expect(dialog).not.toBeVisible();
    await expect(page).toHaveURL(new RegExp(`#${item.id}$`));
  }
});

test('mobile dialog supports keyboard close, Escape, and focus restoration', async ({
  deployedPage,
}) => {
  const { page } = deployedPage;
  await page.setViewportSize({ width: 390, height: 844 });
  await deployedPage.goto();

  const trigger = page.getByRole('button', { name: 'Open navigation menu' });
  const closeButton = page.getByRole('button', {
    name: 'Close navigation menu',
  });
  const dialog = page.getByRole('dialog', { name: 'Mobile navigation' });

  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(dialog).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');

  await closeButton.focus();
  await page.keyboard.press('Enter');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');

  await page.keyboard.press('Enter');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('skip link receives visible keyboard focus', async ({ deployedPage }) => {
  const { page } = deployedPage;
  await deployedPage.goto();
  await page.keyboard.press('Tab');

  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skipLink).toBeFocused();
  const focusStyle = await skipLink.evaluate((element) => {
    const style = getComputedStyle(element);
    const bounds = element.getBoundingClientRect();
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
      top: bounds.top,
    };
  });

  expect(focusStyle.outlineStyle).toBe('solid');
  expect(focusStyle.outlineWidth).toBeGreaterThanOrEqual(2);
  expect(focusStyle.top).toBeGreaterThanOrEqual(0);
});

test('reduced motion removes meaningful transition duration', async ({
  deployedPage,
}) => {
  const { page } = deployedPage;
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await deployedPage.goto();

  const durations = await page
    .getByRole('link', { name: 'Skip to main content' })
    .evaluate((element) =>
      getComputedStyle(element)
        .transitionDuration.split(',')
        .map((duration) => Number.parseFloat(duration)),
    );
  expect(durations.every((duration) => duration <= 0.00001)).toBe(true);
});

for (const viewport of responsiveViewports) {
  test(`has no horizontal overflow at ${viewport.width}px`, async ({
    deployedPage,
  }) => {
    const { page } = deployedPage;
    await page.setViewportSize(viewport);
    await deployedPage.goto();

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
}

test('exposes the complete form contract without submitting', async ({
  deployedPage,
}) => {
  const { page } = deployedPage;
  await deployedPage.goto();

  const form = page.locator('form[name="contact"]');
  await expect(form).toHaveAttribute('method', /post/i);
  await expect(form).toHaveAttribute('action', '/');
  await expect(
    form.locator('input[type="hidden"][name="form-name"]'),
  ).toHaveValue('contact');

  const honeypot = form.locator('input[name="bot-field"]');
  await expect(honeypot).toHaveAttribute('tabindex', '-1');
  await expect(honeypot).toHaveAttribute('autocomplete', 'off');

  for (const label of ['Name', 'Email', 'Message']) {
    const control = form.getByLabel(label, { exact: true });
    await expect(control).toHaveAttribute('required', '');
    await expect(control).toHaveValue('');
  }

  const submit = form.getByRole('button', { name: 'Send message →' });
  await expect(submit).toHaveAttribute('type', 'submit');
  await expect(submit).toBeEnabled();
});

const expectNoAxeViolations = async (page: Page): Promise<void> => {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
};

test('has no axe violations in representative deployed states', async ({
  deployedPage,
}) => {
  const { page } = deployedPage;

  await page.setViewportSize({ width: 1440, height: 1000 });
  await deployedPage.goto();
  await expectNoAxeViolations(page);

  await page.setViewportSize({ width: 390, height: 844 });
  await deployedPage.goto();
  await expectNoAxeViolations(page);

  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await expect(
    page.getByRole('dialog', { name: 'Mobile navigation' }),
  ).toBeVisible();
  await expectNoAxeViolations(page);
});
