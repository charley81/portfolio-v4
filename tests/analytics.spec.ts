import { expect, test } from '@playwright/test';

interface CapturedEvent {
  event?: string;
  properties?: Record<string, unknown>;
}

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

const parseCapturedEvents = (requests: string[]): CapturedEvent[] =>
  requests.flatMap((request) => {
    try {
      const payload: unknown = JSON.parse(request);
      if (typeof payload !== 'object' || payload === null) return [];

      if ('batch' in payload && Array.isArray(payload.batch)) {
        return payload.batch.filter(
          (event): event is CapturedEvent =>
            typeof event === 'object' && event !== null,
        );
      }

      return [payload as CapturedEvent];
    } catch {
      return [];
    }
  });

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
  await page.goto('/?private=query-value#private-fragment', {
    referer:
      'https://search.example/private-referrer-path?private=referrer-query#referrer-fragment',
  });

  if (process.env.ANALYTICS_EXPECTED !== 'enabled') {
    await page.waitForTimeout(300);
    expect(requests).toEqual([]);
    await expect(page.locator('[data-posthog-key]')).toHaveCount(0);
    return;
  }

  await expect(page.locator('[data-posthog-key]')).toHaveCount(1);
  await expect.poll(() => requests.join('\n')).toContain('portfolio_viewed');
  await expect.poll(() => requests.join('\n')).toContain('$pageview');

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
    document.addEventListener('click', (event) => event.preventDefault(), {
      capture: true,
      once: true,
    });
  });
  await page.getByRole('link', { name: /STILLROOM project/ }).click();

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
    .toContain('portfolio_project_opened');
  await expect
    .poll(() => requests.join('\n'))
    .toContain('portfolio_contact_form_failed');

  await page.evaluate(() => {
    history.replaceState(
      {},
      '',
      '/?private=second-query#second-private-fragment',
    );
    window.dispatchEvent(new PageTransitionEvent('pagehide'));
  });
  await expect.poll(() => requests.join('\n')).toContain('$pageleave');

  const capturedEvents = parseCapturedEvents(requests);
  const pageview = capturedEvents.find((event) => event.event === '$pageview');
  const pageleave = capturedEvents.find(
    (event) => event.event === '$pageleave',
  );
  const navigation = capturedEvents.find(
    (event) => event.event === 'portfolio_navigation_clicked',
  );
  const payloads = requests.join('\n');

  expect(pageview?.properties).toMatchObject({
    $current_url: 'http://127.0.0.1:4321/',
    $host: '127.0.0.1:4321',
    $pathname: '/',
    $referrer: 'https://search.example',
    $referring_domain: 'search.example',
  });
  expect(pageview?.properties?.$session_id).toEqual(expect.any(String));
  expect(pageview?.properties?.$window_id).toEqual(expect.any(String));
  expect(pageleave?.properties).toMatchObject({
    $prev_pageview_duration: expect.any(Number),
    $prev_pageview_pathname: '/',
    $session_id: expect.any(String),
  });
  expect(navigation?.properties).not.toHaveProperty('$current_url');
  expect(navigation?.properties).not.toHaveProperty('$referrer');

  expect(payloads).toContain('"destination":"work"');
  expect(payloads).toContain('"location":"desktop_header"');
  expect(payloads).toContain('"project":"stillroom"');
  expect(payloads).toContain('"reason":"network"');
  expect(payloads).not.toContain('private=query-value');
  expect(payloads).not.toContain('private-fragment');
  expect(payloads).not.toContain('private-referrer-path');
  expect(payloads).not.toContain('referrer-query');
  expect(payloads).not.toContain('referrer-fragment');
  expect(payloads).not.toContain('second-query');
  expect(payloads).not.toContain('second-private-fragment');
  expect(payloads).not.toContain('chrisharley81@gmail.com');
});
