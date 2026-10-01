# Christopher Harley Portfolio

A static, one-page portfolio built with Astro, strict TypeScript, and StyleX. The implementation follows the approved desktop and mobile Figma frames and uses only small native browser scripts for the mobile menu, contact form enhancement, and gated analytics.

## Requirements

- Node.js 22.14.0 (see `.nvmrc`)
- pnpm 10.32.1

## Setup

```sh
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev --background
```

Use `pnpm astro dev status`, `pnpm astro dev logs`, and `pnpm astro dev stop` to manage the background development server.

PostHog is optional. Leave both values blank during local development:

```ini
PUBLIC_POSTHOG_KEY=
PUBLIC_POSTHOG_HOST=
```

Analytics is included only when Astro is building for production, Netlify sets `CONTEXT=production`, and both public PostHog values are present. Development and deploy previews remain silent.

## Commands

| Command               | Purpose                                                   |
| --------------------- | --------------------------------------------------------- |
| `pnpm dev`            | Start Astro's development server                          |
| `pnpm build`          | Generate the static site in `dist/`                       |
| `pnpm preview`        | Preview the production build                              |
| `pnpm format:check`   | Check formatting                                          |
| `pnpm lint`           | Run ESLint                                                |
| `pnpm check`          | Run Astro and TypeScript diagnostics                      |
| `pnpm test:e2e`       | Run portfolio behavior tests                              |
| `pnpm test:a11y`      | Run axe accessibility tests                               |
| `pnpm test:analytics` | Verify deploy-preview and production analytics boundaries |
| `pnpm test:deployed`  | Run the read-only deployed-site suite                     |
| `pnpm lighthouse`     | Run Lighthouse CI against `dist/`                         |
| `pnpm verify`         | Run the complete local verification sequence              |

Lighthouse targets 95+ Performance and 100 Accessibility and Best Practices. Before domain cutover, the intentional `noindex` policy lowers the SEO category to 0.69 solely because the page is blocked from indexing; that audit remains a warning until cutover authorization removes the block.

Install Playwright's Chromium build once before browser tests:

```sh
pnpm exec playwright install chromium
```

### Deployed-site verification

Set `PLAYWRIGHT_BASE_URL` to run the dedicated suite against a deployed site without starting the local Astro build and preview server:

```sh
PLAYWRIGHT_BASE_URL=https://statuesque-kangaroo-16f795.netlify.app pnpm test:deployed
```

The deployed suite is read-only and safe to rerun. It installs network interception before every page load to block PostHog analytics, never submits the contact form, and checks external destinations by their `href` values instead of visiting them. Without `PLAYWRIGHT_BASE_URL`, existing Playwright suites retain the local `http://127.0.0.1:4321` build and preview lifecycle.

## Forms

The contact form uses Netlify Forms with a honeypot. JavaScript progressively enhances submission with inline pending, success, and failure feedback; native form submission remains available when JavaScript is disabled. Configure form notification delivery to `chrisharley81@gmail.com` in the Netlify site controls.

## Deployment safety

`netlify.toml` publishes the static `dist/` directory. The review target is the separate Netlify site at `https://statuesque-kangaroo-16f795.netlify.app/`.

The site intentionally remains `noindex` in both metadata and `public/robots.txt`. Do not attach `christopherharley.com`, change DNS, remove the noindex policy, or alter the current live project without a separate, explicit cutover approval.

A production deployment requires separate approval and can then use:

```sh
pnpm netlify:deploy:prod
```
