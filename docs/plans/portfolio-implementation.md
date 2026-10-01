# Portfolio Implementation Plan

**Status:** Recruiter-ready release verified on the unaliased Netlify review deployment; domain cutover is not authorized
**Scope:** One complete, production-ready portfolio page at `/`
**Approved design:** Figma page `final`, frame `christopher-harley-portfolio` (`164:3`)
**Plan destination:** This file is the only implementation plan for the page. No section-level specs or plans will be created.

## 1. Goal and user-visible outcome

Replace the Astro starter with Christopher Harley's complete one-page portfolio, matching the approved Figma frame while remaining usable from 320px through wide desktop, meeting WCAG 2.2 AA, generating static output, and shipping minimal browser JavaScript. The page will include semantic navigation, masthead, capabilities, about, skills, experience, selected work, contact form, and footer; production-only, privacy-conscious PostHog tracking; and a repeatable Netlify delivery pipeline.

The first stable product checkpoint will be deployed to the supplied, unaliased Netlify production URL (`https://statuesque-kangaroo-16f795.netlify.app/`) for review. The existing `christopherharley.com` site, DNS, domain assignment, and current production project will remain untouched until a separately approved cutover.

## 2. Sources of truth and precedence

1. The current user request.
2. Approved Figma canvas `164:2` and frame `164:3`.
3. `AGENTS.md`.
4. Existing repository conventions.

Implementation must not invent copy, URLs, project facts, assets, form behavior, analytics events, or responsive interaction patterns. Items not defined by those sources are approval gates in section 12.

## 3. Repository audit

### Current repository state

- Git branch: `main` at `7aec50e` (`init`), tracking `origin/main`.
- `origin` is configured as `https://github.com/charley81/portfolio-v4.git` for fetch and push.
- Local history includes the original Astro commit `71a6cca`; the previously modified `AGENTS.md`, empty `docs/plan.md`, and initial implementation plan are committed in `7aec50e`.
- The approved implementation is now present in the working tree together with the user-supplied `public/favicon.ico` and `public/resume.pdf`; no commit or deployment has been made.
- Package manager: pnpm, established by `pnpm-lock.yaml` v9 and `pnpm-workspace.yaml`; `package.json` has no `packageManager` field.
- Local tools observed:
  - Node `v24.19.0`.
  - pnpm `10.32.1`.
- Runtime dependency: Astro `^7.3.5`, locked to `7.3.5`.
- `tsconfig.json` extends `astro/tsconfigs/strict`; strict TypeScript is already enabled.
- `astro.config.mjs` is the empty default configuration; Astro currently builds static output.
- Source is the untouched Astro Basics starter:
  - `src/pages/index.astro`
  - `src/layouts/Layout.astro`
  - `src/components/Welcome.astro`
  - Starter SVGs and favicons.
- No StyleX integration, content model, analytics layer, form backend, responsive portfolio code, or approved portfolio assets exist.
- No formatting, lint, Astro check, test, accessibility, or Lighthouse scripts/configuration exist.
- `@astrojs/check` and TypeScript are not installed; `pnpm astro check --help` stopped at Astro's install prompt and no dependency was added.
- No `netlify.toml`, `.netlify/state.json`, Git-connected deployment configuration, or Netlify site link exists.
- The globally installed `netlify` wrapper is broken because it references a removed Node `22.14.0` executable. Deployment must use a project-pinned CLI or the Netlify UI/Git integration instead of that wrapper.
- The supplied separate Netlify project is `statuesque-kangaroo-16f795`, currently serving the Astro starter at `https://statuesque-kangaroo-16f795.netlify.app/` with HTTP 200 and title `Astro Basics`.
- `https://christopherharley.com/` independently returns HTTP 200 with title `Christopher Harley - Design Engineer`; its response differs from the supplied Netlify project, confirming the review site is currently separate from the live domain.
- No `.env.example` exists. `.gitignore` ignores `.env` and `.env.production`, but not all local environment variants or `.netlify/`.

### Baseline verification actually completed

- `pnpm build` passes.
- The baseline builds one static route, `/index.html`, with no generated JavaScript.
- Generated output contains only the starter page and starter assets.
- No tests, lint, type-check, accessibility scan, Lighthouse audit, or deployment could be run because those systems are absent.

## 4. Figma audit

The Figma desktop MCP was used for metadata, design context, variables, screenshots, and recursive motion inspection.

### Approved frames

- Desktop frame on page `final`:
  - Node: `164:3`
  - Size after the About-copy update: `1440 × 5203`
  - Background: `#000305`
- Exact mobile page frame on the same page:
  - Node: `164:162`
  - Name: `christopher-harley-portfolio-mobile-exact`
  - Size: `390 × 5245`
  - Background: `#000305`
- Exact mobile navigation open state:
  - Node: `141:4`
  - Name: `christopher-harley-mobile-nav-open`
  - Size: `390 × 844`
  - Full-height dark surface with close control, six numbered navigation links, full-width resume action, social links, and availability status.
- No separate tablet or wide-desktop frame is present. Responsive behavior between the exact 390px and 1440px anchors will be content-driven and verified at 768, 1024, and 1920px without changing their established hierarchy.
- Recursive motion inspection returned no animated nodes for the desktop page, mobile page, or open-menu state.

### Page structure

1. Header (`164:4`), 90px high.
2. Masthead (`164:15`).
3. Capabilities / “WHAT I DO” (`164:38`).
4. About (`164:57`).
5. Skills (`164:66`).
6. Experience (`164:88`).
7. Recent work (`164:101`).
8. Contact and form (`164:130`).
9. Footer (`164:158`).

The 1440px layout uses 100px side/section padding, a 1240px content width, repeated 40px section-heading gaps, and 24–64px internal spacing. The 390px frame defines the narrow-screen reflow directly: 20px horizontal gutters, 48px section padding, 32px section-heading gaps, stacked capability/skill/contact layouts, 12–15px body/utility type, a 36px masthead heading, and a 32px menu control.

### Design tokens and typography

Figma exposes five color variables:

- `light`: `#FCFCFD`
- `light-grey`: `#6D859C`
- `dark-grey`: `#425261`
- `primary`: `#1E90FF`
- `dark`: `#000305`

Typography:

- Instrument Sans Regular/Bold for display headings and body copy.
- Space Mono Regular/Bold for navigation, labels, metadata, and links.
- Desktop type sizes observed: 16px body/utility, 24px section and row headings, 40px project/contact headings, and 56px masthead heading.
- No font files are provided by the repository or Figma context.

### Design assets

Visible SVG assets are supplied through the Figma asset server and must be copied locally during implementation, without redrawing or substitution:

- Desktop availability status dot: `1d275cac7e2f0d65c92dff66c0b56ce8d2b81530.svg`.
- Desktop project arrow-up-right: `cb9d4e8bab3eee484dd1b6b4602ebd8081cd9b6d.svg`.
- Mobile menu icon: `e6000e9fa2ab538cc9117556d4eec79cb6356ef2.svg`.
- Mobile close icon: `defb47147efab24b45e6fdc556d0f803c46817d2.svg`.
- Mobile availability status dot: `c33c4693b01f19a9cf346d67672f8cd3a1313e74.svg`.
- Mobile project arrow-up-right: `0776b8f1e734eb0c34a11068fe62611b99f12d38.svg`.

No icon library is needed: the exact Figma SVGs are the approved source and avoid an unnecessary dependency. The full-page screenshots are visual references only and must never be embedded as implementation assets.

### Design/content issues discovered

- About nodes `164:61`, `164:62`, and `164:63` now contain distinct, completed copy; this update was verified through Figma design context.
- Approved contact destinations supplied by the user:
  - LinkedIn: `https://www.linkedin.com/in/charley81`
  - GitHub: `https://github.com/charley81`
  - Email: `chrisharley81@gmail.com`
- Approved project scope is temporarily limited to two entries:
  - BASSMENT: `https://clubbassment.com/`
  - Marsh & Ember: `https://marshandember.netlify.app/`
- Cape & Canopy and Merge Konflict are both out of scope. Omitting the first Figma project is an explicitly approved content deviation until a future third project is ready.
- The resume exists at `public/resume.pdf`; it is a non-empty two-page PDF.
- The approved favicon is present at `public/favicon.ico`; it contains 16px, 32px, and 48px CH-on-blue variants and was visually verified. The existing starter `public/favicon.svg` must be removed or unreferenced so it cannot override the approved icon.
- A social-sharing image is explicitly deferred until a later update. Initial Open Graph/Twitter metadata will omit image tags rather than invent or substitute an asset.
- Netlify Forms is approved with recipient `chrisharley81@gmail.com`, honeypot spam protection, success message `Thanks for reaching out, I’ll be in touch immediately`, and failure message `Something went wrong. Please try again or email me directly at chrisharley81@gmail.com.`
- The user approved retaining Figma's visible punctuation, literal `© 2025 Christopher Harley`, `#3157FF` Download Resume underline, and form-control colors exactly as designed. No resting-state contrast color substitution is approved; required focus visibility will be verified without changing those resting colors.
- The open mobile menu is fully specified by node `141:4`. Implement it as a native modal dialog matching the 390×844 design, with the exact Figma menu/close assets, focus containment, Escape dismissal, focus restoration, background scroll lock, and dismissal after activating a navigation link.
- The frames contain no hover, focus, active, form validation, or success/error states. Those states will use the established Figma tokens, semantic HTML, and WCAG behavior without altering approved resting-state colors.

## 5. Constraints and non-goals

### Required constraints

- Astro static output; no server adapter or persistent server runtime.
- Strict TypeScript remains enabled.
- Astro components by default; no React integration unless a later approved requirement proves it necessary.
- StyleX is the component styling system. True document globals are limited to reset, font faces, root defaults, selection, and accessibility utilities.
- No `client:*` hydration directives unless a requirement cannot be met with semantic HTML, CSS, and a small native script.
- Local, typed content.
- WCAG 2.2 AA, keyboard operation, visible focus, reduced-motion support, and no two-dimensional scrolling at 320px or 200% zoom.
- PostHog loads only for a Netlify production-context build when both approved public environment variables exist.
- No identification, session replay, free-form text, email addresses, query strings, or other personal data in analytics.
- The current `christopherharley.com` deployment, DNS, and domain configuration remain unchanged.

### Non-goals

- A CMS, server-rendered Astro mode, React island architecture, or generic design system.
- Separate page/section specifications.
- Blog, project detail routes, admin UI, authentication, or localization.
- Domain cutover, DNS edits, ownership changes, billing changes, or destructive Netlify operations.
- Inventing missing content or visual assets.

## 6. Proposed architecture and decisions for approval

### Rendering and component model

- Render the entire page statically from `src/pages/index.astro` and `src/layouts/Layout.astro`.
- Split markup only at meaningful semantic units: site header, masthead, capabilities, about, skills, experience, selected work, contact, and footer.
- Keep all portfolio content in one typed module so copy, destinations, project facts, and analytics identifiers are reviewable independently from markup.
- Use semantic landmarks and elements: one `h1`, ordered `h2` section headings, `<nav>`, lists where content is list-like, `<a>` for destinations, and native `<form>`, `<label>`, `<input>`, and `<textarea>` elements.

### StyleX integration

- Use `@stylexjs/stylex` and the official `@stylexjs/unplugin` Vite adapter through `astro.config.mjs`.
- Before full-page work, prove the integration with the smallest representative production build containing:
  - `stylex.defineVars` semantic tokens.
  - An Astro component consuming a `*.stylex.ts` module.
  - A responsive media query.
  - A `:hover`/`:focus-visible` pseudo-state.
  - Stable extracted CSS in `dist/`.
- Enable CSS layers only after verifying the resulting Astro/StyleX cascade and development behavior.
- Do not add Tailwind or preserve starter component CSS.

### Responsive behavior

- Treat the 390px mobile frame and 1440px desktop frame as exact visual anchors.
- Center a maximum 1440px page canvas on wide screens; preserve the 1240px desktop content width and interpolate gutters/layout only between the two approved anchors.
- At narrow widths, follow Figma's 20px gutters, 48px section padding, stacked content, mobile typography, wrapped social links, full-width form controls, and menu button.
- At desktop widths, preserve the full navigation, sidebar placement, multi-column rows, 100px gutters, and desktop typography.
- Use content-driven breakpoints to prevent collisions between the exact anchors; verify tablet behavior at 768 and 1024px rather than inventing a separate visual direction.
- Permit long project technology lists and headings to wrap naturally.
- Preserve content order and anchor navigation at 320, 375, 390, 768, 1024, 1440, and 1920 CSS pixels.
- Do not add smooth scrolling or decorative animation; the Figma motion inventory is empty.
- Implement the approved open menu from node `141:4` as a full-viewport native dialog at mobile widths; desktop retains the inline navigation.

### Minimal browser JavaScript

- No hydrated framework components.
- One small native mobile-menu module to open/close the dialog, restore focus, dismiss after navigation, and preserve native Escape/focus behavior; no UI framework.
- One small analytics module, included only in approved production builds.
- One small progressively enhanced form module for approved Netlify Forms inline success/error feedback. Native form submission remains the fallback.

### Approved PostHog measurement plan

Track only outcomes that answer whether the portfolio helps visitors understand the work and make contact:

- `portfolio_viewed` — one explicit, property-free denominator event per page load.
- `portfolio_navigation_clicked` — controlled properties `destination` (`capabilities`, `about`, `skills`, `experience`, `work`, `contact`) and `location` (`desktop_header`, `mobile_menu`).
- `portfolio_project_opened` — controlled `project` (`bassment`, `marsh_ember`).
- `portfolio_resume_opened` — controlled `location` (`desktop_header`, `masthead`, `about`, `contact`).
- `portfolio_contact_method_clicked` — controlled `method` (`email`, `linkedin`, `github`) and `location` (`masthead`, `mobile_menu`, `contact`).
- `portfolio_contact_form_submitted` — property-free, success only.
- `portfolio_contact_form_failed` — controlled `reason` (`network`, `service`, `unknown`) so form reliability can be monitored without capturing form contents.

Privacy and reliability rules:

- Disable autocapture, automatic pageviews/page-leave, session recording, user identification, and person profiles.
- Use memory-only persistence and never call `identify()`.
- Strip or normalize default URL/referrer properties before sending so query strings, hashes, and external referrers are never captured.
- Never capture names, email addresses, message contents, arbitrary visible text, or free-form error text.
- Add explicit `data-analytics-*` attributes and centralize event names/property unions in TypeScript.
- Analytics failure must never delay or prevent navigation or form submission.
- Gate inclusion on Astro production build, Netlify `CONTEXT=production`, `PUBLIC_POSTHOG_KEY`, and `PUBLIC_POSTHOG_HOST`.
- If the key or host is absent, the production page remains fully functional and sends no events.

This supports four useful funnels without excess surveillance: portfolio view → project interest, resume interest, direct contact, and successful form contact.

### Deployment proposal

- Add a reproducible project-local Netlify CLI instead of using the broken global wrapper.
- Link only the supplied separate Netlify project `statuesque-kangaroo-16f795` and deploy to `https://statuesque-kangaroo-16f795.netlify.app/` during implementation.
- Add no custom domain or alias.
- Keep the new site `noindex` until explicit cutover approval.
- Use static `dist/` output; do not install `@astrojs/netlify`.
- Use the confirmed GitHub `main` branch for Git-connected production deployment after the plan, checks, and deployment action receive approval.

## 7. Dependency plan

Versions below were checked during this audit and should be resolved into `pnpm-lock.yaml` using pnpm. Use version ranges consistent with the current manifest and rely on the lockfile for reproducibility.

### Runtime dependencies

- `@stylexjs/stylex` (`0.19.1` observed).
- `posthog-js` (`1.435.1` observed).
- Approved self-hosted font packages, proposed:
  - `@fontsource-variable/instrument-sans` (`5.3.0` observed).
  - `@fontsource/space-mono` (`5.3.0` observed).

### Development dependencies

- `@stylexjs/unplugin` (`0.19.1` observed) and compatible `unplugin` `2.3.11`.
- `@astrojs/check` (`0.9.10` observed).
- TypeScript 6 (`6.0.3` observed); TypeScript 7 is excluded because the observed `@astrojs/check` peer range supports TypeScript 5 or 6.
- Formatting/linting: Prettier, `prettier-plugin-astro`, ESLint, `eslint-plugin-astro`, and the compatible peer packages required by the selected official configuration.
- End-to-end/accessibility: `@playwright/test` and `@axe-core/playwright`.
- Performance: `@lhci/cli`.
- Deployment: project-local `netlify-cli`.

Dependencies must be rechecked for peer compatibility when installed. No dependency is added merely for convenience when a browser/Astro primitive is sufficient.

## 8. Planned file changes

Exact paths may be reduced if a file would add no meaningful boundary, but new styling systems or runtime frameworks must not be added.

### Root configuration

- `package.json` — package-manager field, dependencies, and explicit scripts.
- `pnpm-lock.yaml` — pnpm-resolved dependency graph.
- `astro.config.mjs` — StyleX Vite plugin, static site metadata, typed public env schema where appropriate, and verified CSS/build settings.
- `tsconfig.json` — retain strict base; add only test/tool includes if required.
- `.nvmrc` — pin an Astro/Netlify-compatible Node 22 LTS release (proposed `22.23.3`).
- `.gitignore` — ignore `.netlify/`, Playwright/Lighthouse artifacts, and local env variants while allowing `.env.example`.
- `.env.example` — document `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` without values.
- `netlify.toml` — `pnpm build`, `dist`, Node/pnpm settings if needed, security headers, and immutable caching for fingerprinted assets.
- `eslint.config.js` — Astro/TypeScript lint configuration.
- `.prettierrc.mjs` and `.prettierignore` — repository formatting contract.
- `playwright.config.ts` — production-build preview server and target browser projects.
- `lighthouserc.cjs` — production output audit and required category thresholds.

### Application

- `src/pages/index.astro` — complete page composition and page-level IDs/landmarks.
- `src/layouts/Layout.astro` — language, approved text metadata, canonical/robots policy, approved `.ico` favicon, font imports, skip link, analytics inclusion, and document shell; omit social-image metadata until an approved asset exists.
- `src/content/portfolio.ts` — typed approved copy, destinations, projects, skills, and experience.
- `src/content/types.ts` — shared content and analytics-safe identifier types if the model is large enough to justify a separate file.
- `src/components/SiteHeader.astro`
- `src/components/Masthead.astro`
- `src/components/Capabilities.astro`
- `src/components/About.astro`
- `src/components/Skills.astro`
- `src/components/Experience.astro`
- `src/components/SelectedWork.astro`
- `src/components/Contact.astro`
- `src/components/SiteFooter.astro`
- `src/components/Analytics.astro` — build-time production gate only.
- `src/styles/tokens.stylex.ts` — semantic color, type, spacing, border, and layout variables translated from Figma.
- `src/styles/global.css` — font faces/imports as approved, reset, document defaults, selection, and small accessibility globals.
- Component-local `*.stylex.ts` modules where styles belong to a semantic component; consolidate repeated section/row patterns rather than duplicating them.
- `src/analytics/events.ts` — approved event names and payload types.
- `src/analytics/posthog.ts` — privacy-conscious initialization and explicit event delegation.
- `src/scripts/mobile-menu.ts` — minimal native dialog lifecycle and same-page-link dismissal.
- `src/scripts/contact-form.ts` — approved Netlify Forms progressive enhancement.

### Static assets

- `public/assets/status-dot.svg` and any required responsive variant — exact Figma export(s).
- `public/assets/arrow-up-right.svg` and any required responsive variant — exact Figma export(s).
- `public/assets/menu.svg` and `public/assets/close.svg` — exact mobile Figma exports.
- `public/resume.pdf` — supplied, non-empty two-page resume.
- `public/favicon.ico` — supplied and verified approved favicon; do not substitute an icon-library glyph.
- Social-sharing image intentionally deferred; add no `og:image`/`twitter:image` placeholder.
- `public/robots.txt` — `noindex` policy before cutover; changed only in the separately approved cutover.

### Tests

- `tests/portfolio.spec.ts` — landmarks, headings, navigation, destinations, keyboard order, focus visibility, viewport overflow, form validation, and reduced motion.
- `tests/accessibility.spec.ts` — axe checks at representative desktop/mobile widths and critical interaction states.
- `tests/analytics.spec.ts` — production/preview boundary and event payload/privacy checks using controlled request interception.
- Optional stable visual snapshots for the 1440px approved frame and one approved mobile layout after responsive behavior is confirmed.

### Starter cleanup

Remove only after replacements exist:

- `src/components/Welcome.astro`
- `src/assets/astro.svg`
- `src/assets/background.svg`
- Remove or stop referencing the starter `public/favicon.svg`; retain the supplied `public/favicon.ico`.
- Replace the starter `README.md` with project setup, commands, environment, deployment, and cutover-safety documentation.

Do not modify or remove pre-existing `docs/plan.md`, `docs/specs/`, or the user's `AGENTS.md` changes as part of implementation.

## 9. Ordered implementation phases

### Phase 0 — Resolve production blockers

**Goal:** Make all content, interaction, analytics, and deployment inputs explicit before implementation.

- [x] Plan approved; desktop/mobile responsive anchors are confirmed.
- [x] Resolve every item in section 12 that affects content or behavior.
- [x] Git remote and production branch confirmed: `origin/main`.
- [x] Separate Netlify review project confirmed: `statuesque-kangaroo-16f795`; linkage/deployment still requires the normal deployment approval gate.
- [x] Confirm PostHog project host/key availability; values are configured in Netlify and were not copied into chat, source, or logs.
- [x] Record final decisions in this plan's Decisions Log.

**Acceptance criteria**

- No required copy, URL, asset, form behavior, analytics event, or deployment destination remains implicit.
- Domain cutover remains explicitly excluded.

**Verify**

- Review section 12 with the user and mark each blocker resolved or intentionally deferred.
- `git status --short --branch` still shows all pre-existing changes intact.

### Phase 1 — Establish the reproducible foundation

**Goal:** Prove Astro 7 + strict TypeScript + StyleX static production output and establish the quality/deployment toolchain before building the page.

- [x] Add the approved dependencies and package scripts using pnpm only.
- [x] Pin pnpm and Node versions without weakening existing engine requirements.
- [x] Configure formatting, linting, Astro check, Playwright, axe, Lighthouse CI, env documentation, and Netlify static build settings.
- [x] Implement the representative StyleX integration proof using semantic tokens, responsive rules, and pseudo-states.
- [x] Verify StyleX development CSS loading, production extraction/layer order, and absence of hydration.
- [x] Add safe default security headers; defer CSP until the real PostHog host is known.
- [x] Keep deployment indexing disabled and leave all custom domains untouched.

**Primary files**

`package.json`, `pnpm-lock.yaml`, `astro.config.mjs`, `tsconfig.json`, `.nvmrc`, `.gitignore`, `.env.example`, `netlify.toml`, lint/format/test configs, `src/styles/tokens.stylex.ts`, and a temporary representative component removed or absorbed by Phase 2.

**Acceptance criteria**

- A clean checkout installs with the frozen lockfile and builds static output.
- StyleX tokens, responsive rules, and pseudo-states appear correctly in production CSS.
- No React, Tailwind, server adapter, `client:*`, or `astro-island` output exists.
- Development does not emit PostHog traffic.
- All new scripts are documented and deterministic.

**Verify**

```sh
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm check
pnpm build
! rg -n '<astro-island' dist/index.html
```

### Phase 2 — Freeze approved content and assets

**Goal:** Create one typed, reviewable source of truth for the complete page and make every Figma asset local.

- [x] Transcribe approved Figma copy into `src/content/portfolio.ts`.
- [x] Add approved destination URLs and stable analytics-safe identifiers; visible/free-form text is never used as an event payload.
- [x] Copy every exact desktop/mobile Figma SVG asset locally and verify non-empty files, root dimensions, call sites, and rendered geometry; no icon library added.
- [x] Retain and wire `public/resume.pdf` and `public/favicon.ico`; social-image tags intentionally deferred.
- [x] Add self-hosted Instrument Sans and Space Mono with the required weights.
- [x] Define semantic StyleX tokens from the approved Figma values.

**Acceptance criteria**

- All visible content and destinations are typed and traceable to Figma or explicit user input.
- No production code references `localhost:3845`, temporary Figma URLs, placeholder links, or starter assets.
- Every visible asset has a local file and intended semantic/alternative-text treatment.

**Verify**

```sh
pnpm check
pnpm lint
rg -n 'localhost:3845|example\.com|TODO|FIXME' src public
find public/assets -type f -size +0 -print
```

The `rg` command must return no unapproved placeholders or temporary asset references.

### Phase 3 — Implement the complete page in one pass

**Goal:** Replace the starter with the full approved page, not a series of independently designed sections.

- [x] Build all page landmarks and meaningful components against the complete Figma frames.
- [x] Apply shared section/row patterns and component-specific StyleX modules.
- [x] Implement the approved responsive reflow across the full page as one coordinated system.
- [x] Implement the exact mobile open-menu state as a native modal dialog with keyboard focus containment, Escape/close/link dismissal, focus restoration, and scroll lock.
- [x] Add native anchor navigation, skip link, semantic heading outline, external-link behavior, visible focus, and reduced-motion handling.
- [x] Implement the Netlify form markup and native validation.
- [x] Remove starter code/assets after the full page replacement exists.
- [x] Complete desktop/mobile visual correction passes against Figma screenshots.

**Acceptance criteria**

- The entire approved content hierarchy is present in one static page.
- Desktop at 1440px closely matches Figma hierarchy, dimensions, typography, color, spacing, rules, and alignment.
- Layout works without horizontal page scrolling at 320, 375, 768, 1024, 1440, and 1920px and at 200% zoom.
- All controls and links work by keyboard with visible focus; the mobile dialog opens, contains focus, closes with Escape/button/link activation, and restores focus to the trigger.
- There is exactly one `h1`; headings are ordered; form controls have programmatic labels.
- There are no framework hydration scripts.

**Verify**

```sh
pnpm format:check
pnpm lint
pnpm check
pnpm build
pnpm test:e2e
pnpm test:a11y
! rg -n '<astro-island' dist/index.html
```

#### Deployment checkpoint 1 — First stable full-page build

After all Phase 3 checks pass and the user separately approves deployment:

1. Link only the supplied Netlify project `statuesque-kangaroo-16f795`; do not link or alter the current domain project.
2. Deploy the static build to `https://statuesque-kangaroo-16f795.netlify.app/`.
3. Keep `robots.txt` set to noindex and do not add a custom domain.
4. Smoke-test `/`, every internal anchor, approved external links, assets, keyboard navigation, and response/security headers.
5. Before and after deployment, verify `christopherharley.com` still resolves to and serves the pre-existing site; make no DNS or Netlify domain changes.
6. Record the deploy URL and deploy ID in the plan Decisions/Checkpoint Log.

Proposed command after site linkage:

```sh
pnpm netlify:deploy:prod
```

### Phase 4 — Complete form and approved analytics behavior

**Goal:** Add only the browser behavior required for contact submission and intentional, privacy-safe outcome tracking.

- [x] Implement the Netlify Forms integration, native fallback, honeypot, and accessible pending/success/error states.
- [x] Initialize PostHog only when the production-context gate and both public variables pass.
- [x] Implement only the approved typed events and bounded enum-like properties, with an explicit automatic-property allowlist.
- [x] Confirm analytics failure never blocks links, navigation, or form submission.
- [x] Confirm development and Netlify deploy-preview builds contain no active PostHog initialization or requests.
- [x] Add deployment environment variables through Netlify controls; no project values were placed in source files, documentation, or logs.

**Acceptance criteria**

- Form success and failure are understandable visually and programmatically, and repeated submission is controlled.
- Analytics contains no PII, free-form form values, email addresses, query strings, session replay, user identification, or unapproved events.
- Development and deploy-preview contexts are silent.
- Production emits the approved view/outcome events once per intended interaction and navigation still succeeds if PostHog is unavailable.
- Analytics reports can calculate view-to-project, view-to-resume, view-to-contact, and form-success funnels without storing personal or free-form data.

**Verify**

```sh
pnpm check
pnpm build
pnpm test:e2e
pnpm test:a11y
pnpm test:analytics
```

Tests must cover missing env vars, `CONTEXT=deploy-preview`, `CONTEXT=production`, property scrubbing, one-event semantics, blocked PostHog requests, form validation, controlled form success, and controlled network/service failure.

#### Deployment checkpoint 2 — Integrated production URL

After checks and separate approval, deploy to the same unaliased Netlify production URL, verify the form through Netlify's supported test path, and inspect PostHog debug/live events using only synthetic, non-personal test data. Confirm the current domain remains unchanged.

### Phase 5 — Fidelity, accessibility, performance, and release-candidate hardening

**Goal:** Correct discrepancies and produce a green, reviewable release candidate.

- [x] Run full-page visual review at 320, 375, 390, 768, 1024, 1440, and 1920px.
- [x] Compare the 390px and 1440px renders section-by-section with Figma; correct typography, spacing, alignment, wrapping, borders, and asset geometry.
- [x] Review equivalent reflow at 200% zoom, keyboard-only operation, and reduced motion.
- [x] Run axe at desktop/mobile widths, the open dialog, and form-feedback state.
- [x] Validate internal navigation, local files, external project destinations, and controlled form behavior; LinkedIn's automated request returns its expected anti-bot `999`, while the exact href is browser-tested.
- [x] Audit generated HTML/CSS/JS, hydration, console errors, asset sizes, font loading, and PostHog boundaries.
- [x] Run Lighthouse against production output: 1.00 Performance, 1.00 Accessibility, and 1.00 Best Practices across all three runs; SEO is 0.69 solely because the explicitly required pre-cutover `noindex` fails crawlability.
- [x] Self-review the complete Git diff for secrets, placeholders, accidental churn, generated output, and pre-existing-user-change preservation.
- [x] Update `README.md` and this living plan with setup, commands, decisions, and verified deviations; deploy IDs remain pending deployment approval.

**Acceptance criteria**

- Lighthouse: at least 95 Performance and 100 Accessibility, Best Practices, and SEO, unless an environmental limitation is documented with evidence.
- No axe violations in tested states.
- No unexpected console errors, failed first-party assets, or horizontal overflow.
- No unexpected client JavaScript or hydration.
- All Figma assets are exact, local, non-empty, correctly placed, and correctly proportioned.
- Any approved design deviation is documented with its accessibility or technical reason.

**Verify**

```sh
pnpm format:check
pnpm lint
pnpm check
pnpm build
pnpm test:e2e
pnpm test:a11y
pnpm test:analytics
pnpm lighthouse
pnpm verify
git diff --check
git status --short --branch
```

#### Deployment checkpoint 3 — Release candidate

Deploy the green commit to the same unaliased Netlify URL, rerun critical smoke tests against the deployed URL, and use Netlify's prior deploy as the immediate rollback target. Do not attach `christopherharley.com`.

### Phase 6 — Domain cutover (explicitly gated and not authorized by this plan approval)

No cutover work begins until the user gives a separate, explicit instruction after reviewing the release candidate.

A future cutover checklist must include:

- Capture current DNS records, domain assignments, current-site deploy ID, and rollback procedure.
- Confirm final canonical URL, indexing policy, analytics environment, and form delivery.
- Attach the domain without deleting the previous project/deploy.
- Verify TLS, redirects, canonical metadata, robots/sitemap policy, assets, form, analytics, and critical navigation.
- Monitor and retain a fast route back to the previous Netlify deploy/site.

## 10. Deployment safety and rollback

### Source rollback

- Keep each checkpoint in a focused commit once commit approval is separately granted.
- Revert the specific checkpoint commit instead of rewriting history.
- Preserve `AGENTS.md`, `docs/plan.md`, `docs/specs/`, and unrelated user work.
- Never commit `dist/`, `.netlify/`, local `.env*`, Playwright reports, or Lighthouse artifacts.

### Netlify rollback

- Deploy only after all required local checks pass and the user approves that deployment.
- Record each Netlify deploy ID and URL.
- Use Netlify's prior published deploy restoration for immediate rollback, then revert/fix source before the next build.
- If site creation/linkage is wrong, stop; do not delete sites, alter teams, or change billing without explicit authorization.

### Domain safety

- Use a separate Netlify site and its generated URL until cutover.
- Do not add domain aliases, edit DNS, transfer ownership, or detach the domain from its current site.
- Keep pre-cutover deployments noindex.
- Verify the existing public site before and after every new-site production deployment.

### Integration rollback

- StyleX proof fails: revert only StyleX configuration/dependency changes, document the incompatibility, and stop for a new approved integration decision; do not introduce a second styling system.
- PostHog fails: omit the analytics component when gating requirements are unmet; the portfolio and navigation remain functional.
- Form integration fails: retain semantic/native form markup, disable enhancement, and do not ship a misleading success state.
- Asset mismatch: restore the exact Figma export and rerun geometry/visual checks; do not redraw or substitute it.

## 11. Global definition of done

Implementation is complete only when:

1. The full page—not separate section deliverables—matches the approved desktop/mobile Figma frames, except for the documented omission of Cape & Canopy so the approved work list contains only BASSMENT and Marsh & Ember.
2. All content, links, assets, form behavior, and analytics events are approved and contain no placeholders.
3. Astro remains strict, static, and free of unnecessary hydration.
4. StyleX is the only component styling system and its production integration is proven.
5. WCAG 2.2 AA checks, required viewport checks, production build, Playwright, axe, and Lighthouse targets pass.
6. PostHog is silent outside the Netlify production context and sends only approved non-personal events.
7. The release candidate is deployed and smoke-tested on a separate Netlify URL.
8. `christopherharley.com` and its current production configuration remain unchanged.
9. The final diff contains no secrets, debug code, generated artifacts, accidental churn, or unresolved placeholders.
10. This plan and `README.md` accurately record setup, verification, deployment, deviations, and rollback information.

## 12. Remaining external setup

Implementation must not begin until the plan is explicitly approved. No design, content, asset, or interaction decisions remain blocked.

1. **PostHog environment — required before production analytics verification, not page implementation:** Create/select the PostHog project and configure its public project key and regional host in Netlify. If absent, analytics remains safely disabled and does not block page implementation or deployment.

## 13. Decisions and checkpoint log

| Date | Decision/checkpoint | Evidence or deploy ID |
| --- | --- | --- |
| 2026-09-30 | Plan approved | User explicitly replied `approve plan` |
| Confirmed | About copy updated in Figma | Nodes `164:61`–`164:63` verified |
| Confirmed | Content and destination approval | Social/contact URLs, BASSMENT and Marsh & Ember URLs, and `public/resume.pdf` verified; Cape & Canopy/Merge Konflict deferred |
| Confirmed | Responsive behavior approval | Exact 390px mobile, 390×844 open-menu, and 1440px desktop states verified |
| Confirmed | Form and analytics behavior | Netlify Forms copy/behavior and privacy-conscious PostHog taxonomy approved |
| Confirmed | Fonts and SEO metadata | Fontsource and text/canonical/Open Graph defaults approved; favicon verified; social image explicitly deferred |
| Confirmed | Resting-state design colors | Preserve exact Figma form colors; verify focus visibility without resting-color substitution |
| Confirmed | Git/Netlify site strategy | Local `main` tracks `origin/main`; separate Netlify review project and live domain verified |
| 2026-09-30 | Local implementation checkpoint | Exact 390px/1440px geometry verified after the approved project omission; `pnpm verify` passed with 16 behavior tests, 3 axe state checks, deploy-preview/production analytics boundary tests, and Lighthouse 1.00/1.00/1.00 with the intentional noindex-only SEO warning |
| 2026-10-01 | Recruiter-readiness source promoted | Branch `release/recruiter-ready`, commit `f3e3754`, and [PR #1](https://github.com/charley81/portfolio-v4/pull/1) merged as `5667b743514d47b15c99e8649452fb7cdab8ab9a` |
| 2026-10-01 | Release-candidate deployment accepted | Review URL `https://statuesque-kangaroo-16f795.netlify.app/`; ready deploy `6abe2efce5860600083a3894`, published `2026-10-01T09:59:47.158Z` from merged `main` |
| 2026-10-01 | Rollback deploy preserved | Immediate previous ready production deploy `6abdb32ec509b3bcbd95329e` remains the rollback target |
| 2026-10-01 | Netlify badge removed | User approved disabling `built_with_badge_enabled` for only the review project after its injected HUD obscured the approved design; fresh HTML and the deployed regression suite confirm no HUD script or iframe |
| Not authorized | `christopherharley.com` domain cutover | Requires separate explicit approval |

### Recruiter-ready release evidence

#### Deployment and domain isolation

- The accepted Netlify production deploy is `ready`, uses branch `main`, context `production`, and commit `5667b743514d47b15c99e8649452fb7cdab8ab9a`.
- The review project has no custom domain or domain aliases. The temporary hostname still returns `noindex, nofollow`, and `robots.txt` contains `User-agent: *` plus `Disallow: /`.
- Final HTTP checks returned 200 for both the review URL and `https://christopherharley.com/`. Their titles remain distinct: the review site serves `Christopher Harley — Creative Frontend Developer`, while the existing domain continues serving `Christopher Harley - Design Engineer`.
- Netlify initially injected `/.netlify/scripts/hud?variant=public`, which displayed a non-Figma “Powered by Netlify” overlay. After explicit approval, only the review project's `built_with_badge_enabled` setting was disabled. No deploy, DNS, domain, Forms, or analytics setting changed. A deployed regression assertion now prevents the HUD script or an iframe from silently returning.

#### Forms

- Netlify still registers one `contact` form and exactly one submission—the previously acknowledged controlled synthetic submission.
- That submission returned HTTP 200, displayed the approved inline success state, and its notification delivery was confirmed by the user. The controlled blocked-network check displayed the approved inline failure state and created no submission.
- Recruiter-ready automation did not submit the form. The final submission count remained one.

#### PostHog

- Production analytics remains enabled only through the approved Netlify production-context gate. No project token or host value was recorded here.
- All seven approved events remain present and verified: `portfolio_viewed`, `portfolio_navigation_clicked`, `portfolio_project_opened`, `portfolio_resume_opened`, `portfolio_contact_method_clicked`, `portfolio_contact_form_submitted`, and `portfolio_contact_form_failed`.
- The five-tile [Portfolio outcome analytics dashboard](https://us.posthog.com/project/80336/dashboard/2156042) ran without warnings.
- The GeoIP transformation remains disabled. Post-disable event inspection found zero GeoIP, identified-user, current-URL, referrer, session-ID, form-content, or campaign values.
- Deployed Playwright and Lighthouse runs blocked PostHog endpoints; acceptance automation emitted no production analytics events.

#### Verification completed

- Pre-merge local release gate: `pnpm install --frozen-lockfile`, `pnpm verify`, `pnpm audit --prod`, `pnpm test`, hydration search, and `git diff --check` passed. The broad Playwright run reported 20 passed and 17 remote-only tests skipped as intended; the production dependency audit found no known vulnerabilities.
- Final deployed command: `PLAYWRIGHT_BASE_URL=https://statuesque-kangaroo-16f795.netlify.app pnpm test:deployed` — 17 passed after the badge setting change and again after adding the HUD/iframe regression assertion. This included axe checks for desktop, mobile, and open-dialog states; keyboard flow; focus visibility/restoration; reduced motion; first-party assets and headers; approved links; form structure without submission; and console/network health.
- Temporary screenshots were reviewed at 320, 375, 390, 768, 1024, 1440, and 1920 CSS pixels. No clipping, overlap, horizontal overflow, or unintended reflow was found.
- Figma screenshots from desktop node `164:3`, mobile node `164:162`, and open-menu node `141:4` were compared with the deployed 1440px, 390px, and 390×844 captures. Hierarchy, typography, spacing, alignment, colors, assets, and responsive behavior remain faithful. The shorter page height is the already approved consequence of omitting the deferred third project, not a release regression.
- Three deployed Lighthouse runs scored 99 Performance, 100 Accessibility, 100 Best Practices, and 69 SEO each. The SEO reduction is solely the approved temporary indexing block; the crawlability assertion remains intentionally non-actionable until domain cutover.

#### Deviations and remaining risk

- Netlify CLI's `sites:list --json` path terminated unexpectedly, so deployment identity was read through the authenticated, read-only Netlify API instead.
- The Figma desktop MCP connection initially timed out; the installed extension was updated/reconnected and the authoritative comparisons were then completed.
- No recruiter-readiness blocker remains. Domain cutover, indexing activation, sitemap/Search Console work, and social-sharing imagery remain separately gated or deferred.
