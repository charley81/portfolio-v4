# Portfolio Implementation Plan

**Status:** Awaiting approval and blocking inputs  
**Scope:** One complete, production-ready portfolio page at `/`  
**Approved design:** Figma page `final`, frame `christopher-harley-portfolio` (`164:3`)  
**Plan destination:** This file is the only implementation plan for the page. No section-level specs or plans will be created.

## 1. Goal and user-visible outcome

Replace the Astro starter with Christopher Harley's complete one-page portfolio, matching the approved Figma frame while remaining usable from 320px through wide desktop, meeting WCAG 2.2 AA, generating static output, and shipping minimal browser JavaScript. The page will include semantic navigation, masthead, capabilities, about, skills, experience, selected work, contact form, and footer; production-only, privacy-conscious PostHog tracking; and a repeatable Netlify delivery pipeline.

The first stable product checkpoint will be deployed to a **new, unaliased Netlify production URL** for review. The existing `christopherharley.com` site, DNS, domain assignment, and current production project will remain untouched until a separately approved cutover.

## 2. Sources of truth and precedence

1. The current user request.
2. Approved Figma canvas `164:2` and frame `164:3`.
3. `AGENTS.md`.
4. Existing repository conventions.

Implementation must not invent copy, URLs, project facts, assets, form behavior, analytics events, or responsive interaction patterns. Items not defined by those sources are approval gates in section 12.

## 3. Repository audit

### Current repository state

- Git branch: `master` at `71a6cca` (`Initial commit from Astro`).
- No Git remote is configured.
- Pre-existing user changes that must be preserved:
  - Modified `AGENTS.md`.
  - Untracked empty `docs/plan.md`.
  - Untracked empty `docs/specs/` directory.
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
- No `.env.example` exists. `.gitignore` ignores `.env` and `.env.production`, but not all local environment variants or `.netlify/`.

### Baseline verification actually completed

- `pnpm build` passes.
- The baseline builds one static route, `/index.html`, with no generated JavaScript.
- Generated output contains only the starter page and starter assets.
- No tests, lint, type-check, accessibility scan, Lighthouse audit, or deployment could be run because those systems are absent.

## 4. Figma audit

The Figma desktop MCP was used for metadata, design context, variables, screenshots, and recursive motion inspection.

### Approved frame

- One approved desktop frame is present on page `final`:
  - Node: `164:3`
  - Size: `1440 × 5201`
  - Background: `#000305`
- No mobile, tablet, or wide-desktop frames/variants are present on the approved page.
- Recursive motion inspection returned no animated nodes.

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

The 1440px layout uses 100px side/section padding, a 1240px content width, repeated 40px section-heading gaps, 24–64px internal spacing, and horizontal rows that will need deliberate narrow-screen reflow.

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

Two visible SVG assets are supplied through the Figma asset server and must be copied locally during implementation, without redrawing or substitution:

- Availability status dot: `1d275cac7e2f0d65c92dff66c0b56ce8d2b81530.svg`.
- Project arrow-up-right: `cb9d4e8bab3eee484dd1b6b4602ebd8081cd9b6d.svg`.

The full-page screenshot is a visual reference only and must never be embedded as an implementation asset.

### Design/content issues discovered

- About nodes `164:61`, `164:62`, and `164:63` contain the exact same long paragraph. This appears to be unresolved or duplicated copy.
- Visible labels exist for LinkedIn, GitHub, email, resume, and three projects, but Figma provides no destination URLs.
- No resume PDF, favicon, social-sharing image, or canonical SEO copy is supplied.
- The form's submission service, recipient, success state, failure state, and spam strategy are not defined.
- Several strings use a hyphen where an em dash may have been intended (for example, `experiences-from`, `service-experience`, and `opportunities-including`). They will not be silently corrected.
- The footer is fixed to `© 2025 Christopher Harley`; whether it should remain literal or become current-year output is unresolved.
- The Download Resume underline uses `#3157FF` in generated design context while the shared `primary` variable is `#1E90FF`; this requires confirmation or an explicitly documented one-off token.
- `#425261` against `#000305` measures approximately `2.57:1`. It is acceptable for decorative rules but is below the WCAG 2.2 AA `3:1` non-text contrast requirement when used as an essential form-control boundary. The name input currently uses that border color and will require an accessible adjustment or additional affordance.
- The desktop frame contains no hover, focus, active, form validation, success/error, or mobile navigation states. Those states must be defined from accessibility requirements and approved behavior, not guessed.

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

### Responsive behavior proposal

Because Figma provides only a 1440px frame, the following is a proposed translation and is an approval item:

- Center a maximum 1440px page canvas on wide screens; preserve the 1240px desktop content width and use fluid `clamp()` gutters below 1440px.
- Keep all primary navigation destinations visible without a JavaScript hamburger: progressively wrap/stack the header and navigation at narrower widths.
- Reflow masthead sidebar content beneath the introduction.
- Convert capabilities and skills rows from multi-column to stacked content while preserving index/category order.
- Stack contact columns and make controls full width.
- Permit long project technology lists and headings to wrap naturally.
- Preserve content order and anchor navigation at 320, 375, 768, 1024, 1440, and 1920 CSS pixels.
- Do not add smooth scrolling or decorative animation; the Figma motion inventory is empty.

### Minimal browser JavaScript

- No hydrated framework components.
- One small analytics module, included only in approved production builds.
- One small progressively enhanced form module only if Netlify Forms and inline success/error feedback are approved. Native form submission remains the fallback.

### Analytics proposal

- Use `posthog-js` with autocapture, automatic pageviews, session recording, and person profiles disabled.
- Use memory-only persistence unless the user approves another privacy model.
- Add explicit `data-analytics-*` attributes to approved outcomes and centralize event names/payload types.
- Gate inclusion on all of:
  - Astro production build.
  - Netlify `CONTEXT=production`.
  - `PUBLIC_POSTHOG_KEY` present.
  - `PUBLIC_POSTHOG_HOST` present.
- The exact event list must be approved before implementation (section 12).

### Deployment proposal

- Add a reproducible project-local Netlify CLI instead of using the broken global wrapper.
- Create/link a new Netlify site under the approved team and retain only its generated `*.netlify.app` URL during implementation.
- Add no custom domain or alias.
- Keep the new site `noindex` until explicit cutover approval.
- Use static `dist/` output; do not install `@astrojs/netlify`.
- Treat branch naming and Git-connected production deployment as blocked until a remote and production branch are confirmed.

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
- `src/layouts/Layout.astro` — language, metadata, canonical/robots policy, favicons, font imports, skip link, analytics inclusion, and document shell.
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
- `src/scripts/contact-form.ts` — only if enhanced Netlify form feedback is approved.

### Static assets

- `public/assets/status-dot.svg` — exact Figma export.
- `public/assets/arrow-up-right.svg` — exact Figma export.
- `public/resume/<approved-file-name>.pdf` — user-supplied resume.
- Approved favicon and social-sharing assets at user-confirmed paths.
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
- Starter favicon files when approved replacements are available.
- Replace the starter `README.md` with project setup, commands, environment, deployment, and cutover-safety documentation.

Do not modify or remove pre-existing `docs/plan.md`, `docs/specs/`, or the user's `AGENTS.md` changes as part of implementation.

## 9. Ordered implementation phases

### Phase 0 — Resolve production blockers

**Goal:** Make all content, interaction, analytics, and deployment inputs explicit before implementation.

- [ ] Approve this plan and the responsive proposal.
- [ ] Resolve every item in section 12 that affects content or behavior.
- [ ] Confirm the Git remote and production branch strategy.
- [ ] Confirm the separate Netlify team/site strategy and authorization to create/link a site.
- [ ] Confirm PostHog project host/key availability; do not copy credentials into chat, source, or logs.
- [ ] Record final decisions in this plan's Decisions Log before code changes.

**Acceptance criteria**

- No required copy, URL, asset, form behavior, analytics event, or deployment destination remains implicit.
- Domain cutover remains explicitly excluded.

**Verify**

- Review section 12 with the user and mark each blocker resolved or intentionally deferred.
- `git status --short --branch` still shows all pre-existing changes intact.

### Phase 1 — Establish the reproducible foundation

**Goal:** Prove Astro 7 + strict TypeScript + StyleX static production output and establish the quality/deployment toolchain before building the page.

- [ ] Add the approved dependencies and package scripts using pnpm only.
- [ ] Pin pnpm and Node versions without weakening existing engine requirements.
- [ ] Configure formatting, linting, Astro check, Playwright, axe, Lighthouse CI, env documentation, and Netlify static build settings.
- [ ] Implement the representative StyleX integration proof using semantic tokens, a responsive rule, and a pseudo-state.
- [ ] Verify StyleX development CSS loading, production extraction, layer order, and absence of hydration.
- [ ] Add safe default security headers; tune Content Security Policy only against actual generated assets and approved PostHog/form origins.
- [ ] Keep deployment indexing disabled and leave all custom domains untouched.

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

- [ ] Transcribe approved Figma copy into `src/content/portfolio.ts` after duplicate/copy decisions are resolved.
- [ ] Add approved destination URLs and stable analytics-safe identifiers; never use visible free-form text as event payload data.
- [ ] Copy the two exact Figma SVG assets locally and verify non-empty files, root dimensions, call sites, and rendered geometry.
- [ ] Add the approved resume, favicon, and social image.
- [ ] Add the approved self-hosted Instrument Sans and Space Mono sources and required weights only.
- [ ] Define semantic StyleX tokens from Figma values and documented accessibility adjustments.

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

- [ ] Build all page landmarks and meaningful components against the complete Figma frame.
- [ ] Apply shared section/row patterns and component-specific StyleX modules.
- [ ] Implement the approved responsive reflow across the full page as one coordinated system.
- [ ] Add native anchor navigation, skip link, semantic heading outline, external-link behavior, visible focus, and reduced-motion handling.
- [ ] Implement the contact form markup and native validation according to the approved form service/behavior.
- [ ] Remove starter code/assets only after the full page replaces them.
- [ ] Perform the first desktop/mobile visual correction pass against Figma screenshots.

**Acceptance criteria**

- The entire approved content hierarchy is present in one static page.
- Desktop at 1440px closely matches Figma hierarchy, dimensions, typography, color, spacing, rules, and alignment.
- Layout works without horizontal page scrolling at 320, 375, 768, 1024, 1440, and 1920px and at 200% zoom.
- All controls and links work by keyboard with visible focus.
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

1. Create/link the approved **new** Netlify site; do not link or alter the current domain project.
2. Deploy the static build to that site's production `*.netlify.app` URL.
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

- [ ] Implement the approved static-compatible form integration, native fallback, spam protection, and accessible pending/success/error states.
- [ ] Initialize PostHog only when the production-context gate and both public variables pass.
- [ ] Implement only the approved typed events and bounded enum-like properties.
- [ ] Confirm analytics failure never blocks links, navigation, or form submission.
- [ ] Confirm development and Netlify deploy previews contain no active PostHog initialization or requests.
- [ ] Add deployment environment variables through Netlify controls, never source files or logs.

**Acceptance criteria**

- Form success and failure are understandable visually and programmatically, and repeated submission is controlled.
- Analytics contains no PII, free-form form values, email addresses, query strings, session replay, user identification, or unapproved events.
- Development and deploy-preview contexts are silent.
- Production emits one approved event per intended interaction and navigation still succeeds if PostHog is unavailable.

**Verify**

```sh
pnpm check
pnpm build
pnpm test:e2e
pnpm test:a11y
pnpm test:analytics
```

Tests must cover missing env vars, `CONTEXT=deploy-preview`, `CONTEXT=production`, blocked PostHog requests, form validation, controlled form success, and controlled network failure.

#### Deployment checkpoint 2 — Integrated production URL

After checks and separate approval, deploy to the same unaliased Netlify production URL, verify the form through Netlify's supported test path, and inspect PostHog debug/live events using only synthetic, non-personal test data. Confirm the current domain remains unchanged.

### Phase 5 — Fidelity, accessibility, performance, and release-candidate hardening

**Goal:** Correct discrepancies and produce a green, reviewable release candidate.

- [ ] Run full-page visual review at 320, 375, 768, 1024, 1440, and 1920px.
- [ ] Compare the 1440px render section-by-section with the Figma screenshot; correct typography, spacing, alignment, wrapping, borders, and asset geometry.
- [ ] Review at 200% zoom, keyboard-only, and reduced motion.
- [ ] Run axe at representative widths and interaction states.
- [ ] Validate all internal/external links and form behavior.
- [ ] Audit generated HTML/CSS/JS, hydration, console errors, network errors, asset sizes, font loading, and PostHog boundaries.
- [ ] Run Lighthouse against production output and investigate any score below target rather than weakening thresholds.
- [ ] Self-review the complete Git diff for secrets, placeholders, accidental churn, generated output, and pre-existing-user-change preservation.
- [ ] Update `README.md` and this living plan with final commands, decisions, deviations, and deploy IDs.

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

1. The full page—not separate section deliverables—matches the approved Figma frame and approved responsive behavior.
2. All content, links, assets, form behavior, and analytics events are approved and contain no placeholders.
3. Astro remains strict, static, and free of unnecessary hydration.
4. StyleX is the only component styling system and its production integration is proven.
5. WCAG 2.2 AA checks, required viewport checks, production build, Playwright, axe, and Lighthouse targets pass.
6. PostHog is silent outside the Netlify production context and sends only approved non-personal events.
7. The release candidate is deployed and smoke-tested on a separate Netlify URL.
8. `christopherharley.com` and its current production configuration remain unchanged.
9. The final diff contains no secrets, debug code, generated artifacts, accidental churn, or unresolved placeholders.
10. This plan and `README.md` accurately record setup, verification, deployment, deviations, and rollback information.

## 12. Blocking questions and required inputs

Implementation must not begin until the plan is approved. Items marked **blocking** must also be resolved before the phase that owns them.

1. **About copy — blocking for Phase 2:** What should replace the duplicate paragraphs in Figma nodes `164:62` and `164:63`? Should node `164:61` remain as written?
2. **Destinations — blocking for Phase 2:** Provide the exact LinkedIn URL, GitHub URL, public contact email, resume filename/PDF, and destination for each project: Cape & Canopy, BASSMENT, and Marsh & Ember.
3. **Contact form — blocking for Phase 3/4:** Approve Netlify Forms as the static form service, or name the required service. Confirm the intended recipient, spam protection, and desired inline success/error copy.
4. **Responsive behavior — blocking for Phase 3:** Is there an approved mobile/tablet Figma frame elsewhere? If not, approve the CSS-only wrap/stack behavior in section 6, including a visible wrapped navigation instead of a hamburger.
5. **Fonts/assets — blocking for Phase 2:** Will canonical font, favicon, and social-sharing files be supplied? If not, approve self-hosting Instrument Sans and Space Mono through the listed Fontsource packages and provide/approve the favicon and social image direction.
6. **Copy details — blocking for Phase 2:** Confirm whether the visible hyphens should remain, whether the footer stays `© 2025` or uses the current year, and whether the `#3157FF` resume underline is intentional instead of shared primary `#1E90FF`.
7. **SEO — blocking for Phase 2:** Provide/approve the exact page title, meta description, canonical URL, and social-sharing text/image. The temporary Netlify URL will remain noindex regardless.
8. **Analytics — blocking for Phase 4:** Confirm the PostHog host and approve the event taxonomy. Proposed events, with only controlled identifiers, are:
   - `portfolio_navigation_clicked`
   - `portfolio_project_opened`
   - `portfolio_resume_opened`
   - `portfolio_contact_method_clicked`
   - `portfolio_contact_form_submitted` (success only)
9. **Accessibility adjustment — blocking for Phase 3:** Approve increasing the essential name-input boundary contrast (or adding an equivalent accessible affordance) while retaining `#425261` for decorative dividers.
10. **Git/Netlify — blocking for Deployment checkpoint 1:** Provide or authorize creation/linkage of the Git remote, confirm whether `master` should become `main`, identify the Netlify team, and approve creating a separate unaliased Netlify site. No existing site/domain will be linked or modified.

## 13. Decisions and checkpoint log

Update this section as the user approves decisions and deployments.

| Date | Decision/checkpoint | Evidence or deploy ID |
| --- | --- | --- |
| Pending | Plan approval | — |
| Pending | Content and destination approval | — |
| Pending | Responsive behavior approval | — |
| Pending | Form and analytics approval | — |
| Pending | Git/Netlify site strategy | — |
| Pending | Deployment checkpoint 1 | — |
| Pending | Deployment checkpoint 2 | — |
| Pending | Release-candidate deployment | — |
| Not authorized | `christopherharley.com` domain cutover | Requires separate explicit approval |
