import { expect, test } from '@playwright/test';

const decodePostBody = (body: string | null): string => {
  if (!body) return '';

  const encodedData = new URLSearchParams(body).get('data');
  if (!encodedData) return decodeURIComponent(body);

  try {
    return Buffer.from(encodedData, 'base64').toString('utf8');
  } catch {
    return decodeURIComponent(encodedData);
  }
};

test('honors the production gate and emits only controlled analytics data', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'userAgentData', {
      configurable: true,
      value: {
        brands: [{ brand: 'Google Chrome', version: '135' }],
        mobile: false,
        platform: 'macOS',
      },
    });
  });

  const requests: string[] = [];

  await page.route('http://127.0.0.1:4321/posthog/**', async (route) => {
    requests.push(decodePostBody(route.request().postData()));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{}',
    });
  });

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/?private=query-value#private-fragment');

  if (process.env.ANALYTICS_EXPECTED !== 'enabled') {
    await page.waitForTimeout(300);
    expect(requests).toEqual([]);
    await expect(page.locator('[data-posthog-key]')).toHaveCount(0);
    return;
  }

  await expect(page.locator('[data-posthog-key]')).toHaveCount(1);
  await expect.poll(() => requests.join('\n')).toContain('portfolio_viewed');

  await page.evaluate(() => {
    document.addEventListener('click', (event) => event.preventDefault(), {
      capture: true,
      once: true,
    });
  });
  await page
    .locator(
      'nav[aria-label="Primary navigation"] [data-analytics-destination="work"]',
    )
    .click();

  await page.evaluate(() => {
    document.dispatchEvent(
      new CustomEvent('portfolio:analytics', {
        detail: { event: 'portfolio_contact_form_failed', reason: 'network' },
      }),
    );
  });

  await expect
    .poll(() => requests.join('\n'))
    .toContain('portfolio_navigation_clicked');
  await expect
    .poll(() => requests.join('\n'))
    .toContain('portfolio_contact_form_failed');

  const payloads = requests.join('\n');
  expect(payloads).toContain('"destination":"work"');
  expect(payloads).toContain('"location":"desktop_header"');
  expect(payloads).toContain('"reason":"network"');
  expect(payloads).not.toContain('private=query-value');
  expect(payloads).not.toContain('private-fragment');
  expect(payloads).not.toContain('$current_url');
  expect(payloads).not.toContain('$referrer');
  expect(payloads).not.toContain('chrisharley81@gmail.com');
});
