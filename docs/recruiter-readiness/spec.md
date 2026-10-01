# Recruiter-Ready Release Specification

**Status:** Approved for implementation

**Target source branch:** `release/recruiter-ready`

**Review deployment:** <https://statuesque-kangaroo-16f795.netlify.app/>

**Domain cutover:** Explicitly excluded

## What

Turn the separate Netlify review deployment into a repeatably verified release candidate that can be shared directly with recruiters and hiring managers. Netlify Forms and privacy-conscious PostHog analytics are already operational and verified. The remaining work is to add a non-mutating deployed-site test mode, complete deployed responsive/accessibility/performance review, record durable release and rollback evidence, and promote the source through an approved pull request while preserving the existing `christopherharley.com` deployment and the temporary site's `noindex` policy.

## Context

The approved Astro/StyleX portfolio is committed on `main` at `cd4b98fbdde860a68af69bac9dd3f560a87d3458`. Netlify published that commit to the separate review project as production deploy `6abdb32ec509b3bcbd95329e`. The immediately preceding ready deploy is `6abda6c5312b340c045178e3` and is the current rollback candidate.

The page has already passed local formatting, linting, Astro/TypeScript checking, static build, Playwright behavior tests, axe checks, production/deploy-preview analytics-boundary tests, and Lighthouse CI. It has no Astro islands and uses only small native scripts for the mobile dialog, contact-form enhancement, and gated analytics.

Operational readiness completed before this specification revision:

- Netlify form detection is enabled and the generated `contact` form is registered.
- Netlify post-processing removed the detection-only form attributes from served HTML while preserving the hidden `form-name=contact` contract.
- One controlled synthetic submission returned HTTP 200, displayed the approved inline success state, appeared as the only Netlify form submission, and generated the configured email notification.
- The user confirmed notification receipt at `chrisharley81@gmail.com`.
- A controlled blocked-network test displayed the approved inline failure state without creating another Netlify submission.
- PostHog production variables are configured in Netlify without entering source control or chat.
- All seven approved portfolio events were observed in production and marked verified.
- The five-insight `Portfolio outcome analytics` dashboard executes without warnings.
- An inherited GeoIP transformation was discovered and disabled. Subsequent verification events contained no GeoIP, identification, current URL, referrer, session ID, or form-content properties.

The review deployment remains `noindex, nofollow`, has a blocking `robots.txt`, and has no custom domain. The user approved keeping that policy until a separate `christopherharley.com` cutover task enables indexing. The existing custom-domain site must remain untouched throughout this release.

The approved Figma desktop frame `164:3`, mobile frame `164:162`, and open-menu frame `141:4` remain authoritative. This release contains no visual redesign or content change.

## Requirements

### R1 — Preserve release and domain isolation

- Create source changes only on `release/recruiter-ready`, branched from the current `main` without modifying or discarding pre-existing user work.
- Promote changes through a pull request; do not push release changes directly to `main`.
- Do not merge, publish, or deploy the release branch without the user's separate approval at the applicable gate.
- Target only the Netlify project `statuesque-kangaroo-16f795`.
- Do not alter the Netlify project, domain assignment, DNS, aliases, TLS configuration, or published deploy serving `christopherharley.com`.
- Retain `noindex, nofollow` metadata and the blocking `robots.txt` on the temporary Netlify hostname.
- Attach no custom domain during this work.

### R2 — Preserve verified Forms behavior

- Retain the existing semantic form contract, honeypot, URL-encoded submission, native fallback, and progressive enhancement.
- Retain the approved inline pending, success, and failure behavior.
- Make no additional production form submission during repeatable automation or implementation verification.
- Treat the already confirmed synthetic submission and inbox delivery as the release's singular live form test.
- Never place form values, submission content, recipient configuration, or email addresses into analytics payloads or test output beyond existing approved public contact copy.

### R3 — Preserve verified PostHog privacy boundaries

- Keep PostHog enabled only for Netlify production-context builds with both configured public variables.
- Keep development and deploy-preview builds silent.
- Retain the typed event/property allowlist, anonymous memory-only persistence, and disabled autocapture, automatic pageviews, page-leave capture, session recording, surveys, experiments, identification, profiles, referrer storage, and campaign storage.
- Keep the project-level GeoIP transformation disabled.
- Do not expose, print, commit, snapshot, or document the project token.
- Do not add new analytics events or properties in this release.

### R4 — Add a non-mutating remote Playwright mode

- `playwright.config.ts` must accept an explicit `PLAYWRIGHT_BASE_URL`.
- When `PLAYWRIGHT_BASE_URL` is present, Playwright must use that URL and must not start the local Astro build/preview web server.
- When the variable is absent, all existing local suites must continue using `http://127.0.0.1:4321` and the existing build/preview lifecycle.
- Add `tests/deployed.spec.ts` as a dedicated remote suite.
- Add a `test:deployed` package script scoped only to `tests/deployed.spec.ts`.
- Document the exact remote command and its read-only boundary in `README.md`.

### R5 — Keep deployed automation read-only

Before every deployed page load, the remote suite must install a route that blocks PostHog ingestion hosts inside Playwright so automated page views and interactions do not reach PostHog. The suite must not read, print, or assert against the embedded project token.

The deployed suite may:

- Load the review page.
- Inspect metadata, markup, computed styles, headers, links, and controls.
- Activate same-page navigation.
- Open and close the mobile dialog.
- Request first-party static assets and the resume.
- Run axe against representative page states.

The deployed suite must not:

- Submit the contact form.
- Dispatch form-outcome analytics events.
- Allow PostHog ingestion requests to leave the browser context.
- Navigate to external project, social, email, or resume destinations when href inspection is sufficient.
- Modify Netlify, PostHog, DNS, domain, form, or submission state.

The suite must verify:

- Approved title, canonical URL, `noindex, nofollow`, and blocking `robots.txt`.
- One logical `h1`, approved section/project content, and literal footer content.
- Approved internal, project, resume, email, LinkedIn, and GitHub hrefs.
- Same-page desktop navigation and mobile-dialog navigation.
- Keyboard opening/dismissal, Escape handling, focus restoration, skip-link focus, and visible focus treatment.
- Reduced-motion behavior.
- No horizontal overflow at 320, 375, 390, 768, 1024, 1440, and 1920 CSS pixels.
- Form controls, labels, honeypot, hidden form name, and submit control without submitting.
- Successful first-party responses for the page, resume, favicon, and required SVG assets.
- Expected security headers.
- No unexpected page errors, console errors, failed first-party requests, or first-party HTTP error responses.
- No `astro-island` output.
- No axe violations on representative desktop, mobile, and open-dialog states.

### R6 — Complete deployed release review

After the release commit is merged to `main` and Netlify publishes it to the review project:

- Confirm the new ready deploy references the merged release commit.
- Record the new deploy ID, published time, URL, and immediately previous ready deploy ID.
- Run the deployed suite against the canonical review URL.
- Review the deployed site at 320, 375, 390, 768, 1024, 1440, and 1920 CSS pixels.
- Compare the 390px and 1440px renders against the approved Figma frames; visual changes are not expected.
- Verify keyboard flow, focus visibility, reduced motion, mobile-dialog behavior, absence of horizontal overflow, approved destinations, resume delivery, assets, headers, and console/network health.
- Run deployed Lighthouse three times. Performance must be at least 95; Accessibility and Best Practices must be 100. SEO may remain below 100 solely because of the approved temporary indexing block.
- Verify `christopherharley.com` before and after publication and confirm it still serves the pre-existing portfolio.
- Preserve the immediately previous ready Netlify deploy as the rollback target.

### R7 — Record durable release evidence

Update `docs/plans/portfolio-implementation.md` only after verification is complete. Record:

- Release branch, pull request, merged commit, and review URL.
- Current deploy ID and immediate rollback deploy ID.
- Netlify form registration, singular submission count, inline success/failure results, and user-confirmed inbox delivery without copying submission contents.
- PostHog enabled/verified status, all seven verified events, dashboard link, disabled GeoIP transformation, and post-change privacy result without recording project values.
- Commands and results for local checks, deployed Playwright, axe, responsive review, and Lighthouse.
- Confirmation that the temporary hostname remains `noindex` and `christopherharley.com` remains unchanged.
- Any deviation, failure, rollback, or unresolved risk.

## Design

### Source changes

Expected source changes are intentionally narrow:

- `playwright.config.ts`
  - Read `PLAYWRIGHT_BASE_URL` once.
  - Set `use.baseURL` to the supplied remote URL or the existing local URL.
  - Omit `webServer` only in remote mode.
  - Preserve the current browser, user agent, retries, workers, tracing, and reporter behavior.
- `tests/deployed.spec.ts`
  - Add only non-mutating deployed checks.
  - Install PostHog route blocking before every navigation.
  - Centralize first-party console/network monitoring so expected blocked PostHog requests are not reported as site failures.
  - Keep production form fields empty and never click the submit control.
  - Use href assertions rather than external navigation.
- `package.json`
  - Add `test:deployed` without changing existing command behavior.
- `README.md`
  - Document `PLAYWRIGHT_BASE_URL=https://statuesque-kangaroo-16f795.netlify.app pnpm test:deployed`.
  - State that the suite blocks analytics, never submits the form, and is safe to rerun.
- `docs/plans/portfolio-implementation.md`
  - Update only after final operational verification, using identifiers and outcomes rather than secrets or synthetic form content.

No application component, copy, style, asset, form handler, analytics implementation, Figma-derived layout, or build dependency should change unless a failing release check demonstrates a focused defect. Any such defect requires a regression test and must stay within the approved design and privacy invariants.

### Remote-mode configuration

Remote mode is selected solely by `PLAYWRIGHT_BASE_URL`:

1. Local mode remains the default and starts the existing Astro preview server.
2. Remote mode uses the supplied URL and omits `webServer`.
3. The dedicated script selects only `tests/deployed.spec.ts` so local form-mocking and analytics payload tests cannot accidentally run against production.
4. The deployed suite installs network interception before `page.goto()` to prevent PostHog ingestion.
5. First-party health checks treat only the review origin as first party and never follow third-party destinations.

### Promotion and deployment flow

1. Use this approved specification as the implementation source of truth.
2. Create `release/recruiter-ready` from current `main`.
3. Implement the narrow source changes and run local verification.
4. Commit, push, and open a pull request after explicit approval.
5. Review and merge the pull request after explicit approval.
6. Let the existing Netlify Git integration publish merged `main` to the separate review project.
7. Run deployed verification and record evidence.
8. If deployed verification fails materially, restore the immediately previous ready deploy and fix forward on a focused branch.

## Decisions

### Keep the temporary hostname unindexed

- **Choice:** Retain `noindex, nofollow` and blocking `robots.txt` until domain cutover.
- **Alternative:** Index the temporary Netlify hostname immediately.
- **Reason:** Indexing both the temporary hostname and later custom domain creates avoidable duplicate/canonical transition risk. The user approved enabling indexing with the separate domain cutover.
- **Reversibility:** Reversible during the explicitly approved cutover task.

### Use a pull-request promotion workflow

- **Choice:** Implement on `release/recruiter-ready`, open a PR, and merge only after review.
- **Alternative:** Push changes directly to `main` or manually publish branch output as the production deploy.
- **Reason:** The PR keeps source reviewable and lets the existing Git-connected Netlify pipeline publish an auditable merged commit.
- **Reversibility:** The merge commit can be reverted; Netlify retains the preceding ready deploy for immediate restoration.

### Block analytics inside deployed automation

- **Choice:** Intercept and abort PostHog ingestion requests before any remote page load.
- **Alternative:** Allow test traffic and filter it later, or disable production analytics temporarily.
- **Reason:** The page intentionally sends `portfolio_viewed` on load. Blocking at the browser boundary keeps the repeatable suite non-mutating without changing production configuration or polluting analytics.
- **Reversibility:** Test-only and fully reversible.

### Never automate another live form submission

- **Choice:** Inspect the production form but do not submit it in the deployed suite.
- **Alternative:** Submit on every run or delete and recreate a test submission.
- **Reason:** One controlled submission already proved the full service and notification path. Repetition creates inbox noise, retained records, and quota usage without adding meaningful confidence.
- **Reversibility:** A future explicitly acknowledged operational test may be run if the integration changes.

### Keep design and application behavior unchanged

- **Choice:** Treat approved Figma frames and the current implementation as immutable release inputs.
- **Alternative:** combine recruiter readiness with visual, copy, analytics, or interaction revisions.
- **Reason:** The current page is already design-faithful and locally verified. Mixing redesign with release hardening increases regression and review risk.
- **Reversibility:** Future content or design work can use a separate specification.

### Keep social-sharing imagery deferred

- **Choice:** Continue omitting `og:image` and `twitter:image`.
- **Alternative:** invent or approximate a sharing asset.
- **Reason:** No approved image exists, and inventing one would violate the design source of truth.
- **Reversibility:** Add an approved 1200×630 asset in a separate scoped change.

## Versions and authoritative references

No dependency change is planned. The release uses the versions already locked in the repository:

- Node.js `22.14.0` for Netlify builds
- pnpm `10.32.1`
- Astro `^7.3.5`
- Playwright `^1.63.0`
- axe Playwright `^4.13.0`
- Lighthouse CI `^0.15.1`
- Netlify CLI `^27.10.2`
- PostHog JS `^1.435.3`

Authoritative references:

- Playwright configuration and `webServer`: <https://playwright.dev/docs/test-configuration>
- Playwright network interception: <https://playwright.dev/docs/network>
- Netlify Forms setup: <https://docs.netlify.com/manage/forms/setup/>
- Netlify form notifications: <https://docs.netlify.com/manage/forms/notifications/>
- PostHog JavaScript configuration: <https://posthog.com/docs/libraries/js/config>

Project-specific privacy and release requirements override generic service defaults.

## Invariants

- `christopherharley.com` continues serving the pre-existing portfolio throughout this release.
- The review hostname remains unaliased and unindexed.
- Astro output remains static and contains no `astro-island` hydration.
- StyleX remains the only component styling system.
- The approved Figma hierarchy, copy, colors, assets, destinations, form appearance, and responsive behavior do not change.
- Contact submission remains functional with and without JavaScript.
- Repeatable tests create no Netlify submissions, emails, PostHog events, or external navigation side effects.
- Analytics failure or interception never blocks navigation or form operation.
- No project token, Netlify credential, form content, mailbox content, `.netlify/` state, or generated report enters Git.

## Error Behavior

- If local regression checks fail, do not commit or open the PR; fix the defect and add a focused regression test where meaningful.
- If remote mode starts a local server, stop and correct configuration before using it against production.
- If a deployed test allows a PostHog request to complete or submits the form, stop the suite, record the mutation, and correct the test boundary before rerunning.
- If the merged Netlify deploy is not `ready`, do not run release acceptance against it; inspect build logs and keep the previous ready deploy published.
- If deployed smoke, axe, responsive, or Lighthouse checks regress materially, restore the previous ready deploy and fix forward.
- If `christopherharley.com` changes unexpectedly, stop all release work and restore the existing domain deployment before continuing.
- If the form or PostHog operational state differs from the verified baseline, treat it as a release blocker; do not create another live form submission without explicit approval.

## Testing Strategy

### Local regression

```sh
pnpm install --frozen-lockfile
pnpm verify
pnpm audit --prod
git diff --check
```

Existing local form tests continue using intercepted POST responses. Existing analytics tests continue using a controlled local ingestion endpoint and test token.

### Deployed non-mutating suite

```sh
PLAYWRIGHT_BASE_URL=https://statuesque-kangaroo-16f795.netlify.app pnpm test:deployed
```

The suite must prove that PostHog requests are intercepted before navigation and that no form submission occurs. It must not require or print any Netlify or PostHog credential.

### Deployed quality review

- Run the dedicated suite against the newly published ready deploy.
- Capture responsive screenshots at 320, 375, 390, 768, 1024, 1440, and 1920 CSS pixels for review; do not commit them.
- Compare 390px and 1440px against Figma frames `164:162` and `164:3`, and the mobile dialog against `141:4`.
- Run three deployed Lighthouse collections and apply the existing category thresholds.
- Recheck the review URL, `christopherharley.com`, deploy IDs, form count, and PostHog configuration using read-only inspection.
- Confirm the Netlify submission count remains exactly one after automated verification.

### Release acceptance

The release is recruiter-ready only when:

1. Local verification is green.
2. The PR is approved and merged.
3. The merged commit has a ready deploy on the review project.
4. The deployed suite, axe states, responsive review, and Lighthouse thresholds pass.
5. Netlify still has exactly the one acknowledged synthetic submission.
6. All seven PostHog events remain verified and GeoIP enrichment remains disabled.
7. The temporary site remains `noindex` and the custom-domain site remains unchanged.
8. Release and rollback evidence is recorded without secrets or form contents.

## Out of Scope

- Attaching, transferring, redirecting, or replacing `christopherharley.com`
- DNS, registrar, TLS, or domain-alias changes
- Removing `noindex`, changing `robots.txt`, adding a sitemap, Search Console submission, or indexing activation
- Additional live contact-form submissions
- Replacing Netlify Forms, changing notification recipients, or adding another form processor
- Adding reCAPTCHA, server functions, databases, or dependencies
- New PostHog events, properties, dashboards, identification, profiles, autocapture, session replay, surveys, experiments, or GeoIP enrichment
- Visual redesign, copy changes, additional projects, resume changes, or new Figma interpretation
- Inventing or adding a social-sharing image
- Dependency upgrades unrelated to a demonstrated release blocker
