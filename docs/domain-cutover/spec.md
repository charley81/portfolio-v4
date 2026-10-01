# Domain Cutover Specification

**Status:** Approved for implementation

**Source branch:** `release/domain-cutover`

**Canonical production domain:** <https://christopherharley.com/>

**Replacement Netlify project:** `statuesque-kangaroo-16f795` (`bbfc09eb-2782-41df-b4fa-23867635cd05`)

**Rollback Netlify project:** `christopherharley` (`2cc82b28-4cd1-4e52-a6d2-e76967a6f3bf`)

## What

Move `christopherharley.com` from the existing Netlify project to the verified Astro portfolio, make the new portfolio intentionally crawlable, and preserve a fast path back to the existing site. The cutover changes which Netlify project serves the domain; it does not transfer domain ownership, change registrars, replace nameservers, or recreate the DNS zone.

## Context

The recruiter-ready Astro portfolio is complete and verified at <https://statuesque-kangaroo-16f795.netlify.app/>. Its current production deploy is `6abe3bc6899c5e000882abc2`, built from merged `main` commit `50ada1cd9c7f32f03e0299835be93d35fd37ad1d`. The temporary hostname deliberately serves `noindex, nofollow` and a blocking `robots.txt`.

The public domain still serves the pre-existing portfolio from Netlify project `christopherharley`. Its ready production deploy is `6a95f94ed1df5700076ee53d`, built from commit `a05387612a11fd09c5bc17336e35500f2a39767f`. Its immutable deploy URL remains available at <https://6a95f94ed1df5700076ee53d--christopherharley.netlify.app/> and is the domain-level rollback target.

Read-only discovery on 2026-10-01 established:

- Both sites belong to the same authenticated Netlify team.
- `christopherharley.com` uses Netlify DNS through `dns1.p05.nsone.net`–`dns4.p05.nsone.net`.
- Netlify DNS zone `69a7b5588dff51529262cad5` contains only the two managed `NETLIFY` records for the apex and `www`; those records must not be edited or deleted.
- Apex and `www` currently resolve through the same Netlify edge addresses with a 120-second DNS TTL.
- The old site has enforced HTTPS and an issued Netlify-managed wildcard certificate covering `christopherharley.com` and `*.christopherharley.com`.
- The new project has no custom domain or aliases, retains exactly one acknowledged form submission, has production-only privacy-conscious PostHog configuration, and has passed the complete deployed acceptance suite.

Because DNS is already delegated to Netlify and the managed records continue pointing to Netlify's edge, this is an internal site reassignment rather than a DNS-provider migration. No registrar action or DNS propagation change is expected.

## Requirements

### R1 — Preserve release and approval gates

- Make source changes only on `release/domain-cutover`, based on current `origin/main`.
- Promote source through a pull request; do not push directly to `main`.
- Require separate approval before commit, push/PR, merge/publication, and the live domain reassignment.
- Do not combine the cutover with visual redesign, copy changes, resume changes, project additions, or new analytics behavior.
- Do not modify the live domain while the replacement build, deploy permalink, rollback baseline, or required checks are incomplete.

### R2 — Prepare an indexable canonical build

- Keep `https://christopherharley.com/` as the Astro `site`, canonical URL, and Open Graph URL.
- Remove the pre-cutover `noindex, nofollow` metadata; do not replace it with an `X-Robots-Tag` block.
- Change `robots.txt` to allow crawling and reference the canonical sitemap.
- Generate a standards-compliant sitemap containing only canonical absolute URLs.
- Add sitemap discovery in the document head and `robots.txt`.
- Permanently redirect the generated production hostname `statuesque-kangaroo-16f795.netlify.app` to the canonical custom domain while preserving the path.
- Do not redirect immutable deploy permalinks or deploy previews; they are required for pre-cutover verification and rollback diagnosis.
- Raise local Lighthouse SEO and crawlability assertions from the temporary warning/exception to release-blocking requirements.

### R3 — Preserve a safe pre-cutover state

After the source PR is merged and Netlify publishes the launch build, but before domain reassignment:

- Confirm the new ready deploy references the merged commit.
- Verify the replacement through its immutable deploy permalink, not through the generated production hostname that now redirects to the still-old custom domain.
- Run the non-mutating deployed suite, accessibility checks, responsive checks, and three Lighthouse runs against the immutable deploy.
- Confirm `christopherharley.com` and `www.christopherharley.com` still serve the old portfolio.
- Confirm the generated replacement hostname redirects to `https://christopherharley.com/`.
- Confirm the old ready deploy and immutable old deploy permalink remain available.
- Stop before cutover if any verification fails.

### R4 — Reassign only the domain binding

At the separately approved cutover gate:

- Capture fresh, filtered snapshots of both site records, both published deploy IDs, the DNS zone and managed record shapes, TLS state, apex/`www` responses, and the old/new page identities. Store operational snapshots outside Git and never include credentials or environment values.
- Remove `christopherharley.com` as the old project's primary custom domain, then immediately assign it as the new project's primary custom domain.
- Use Netlify's supported site-domain controls or authenticated API. Do not edit the registrar, nameservers, DNS zone, managed `NETLIFY` records, DNS TTL, billing, team ownership, repositories, build hooks, environment variables, or deploy history.
- Keep the apex as primary. Netlify must continue redirecting `www.christopherharley.com` to the apex.
- Require HTTPS and a valid Netlify-managed certificate for the apex and `www`.
- Keep the old project and ready deploy intact. Removing its custom-domain binding must be the only change to the old project.
- Do not delete either site, DNS zone, certificate, form, submission, deploy, repository link, or environment value.

### R5 — Preserve Forms and analytics boundaries

- Keep the new project's existing `contact` form, honeypot, URL-encoded submission, native fallback, progressive enhancement, notification configuration, and approved inline states unchanged.
- Do not make another live form submission. The one existing submission and user-confirmed inbox delivery remain the service-level proof.
- Confirm after cutover that the form is still registered and the submission count remains exactly one.
- Keep PostHog enabled only for Netlify production-context builds with both configured public values.
- Preserve anonymous memory-only persistence, the typed event/property allowlist, disabled GeoIP transformation, and all existing privacy exclusions.
- Deployed automation must continue blocking PostHog ingestion and must not submit the form or follow external destinations.

### R6 — Verify the live cutover

The cutover is accepted only when all of the following pass:

- `https://christopherharley.com/` returns 200 and serves the new Astro portfolio.
- `http://christopherharley.com/` upgrades to HTTPS.
- `https://www.christopherharley.com/` redirects to the apex canonical URL.
- `https://statuesque-kangaroo-16f795.netlify.app/` permanently redirects to the canonical domain.
- The old immutable deploy URL still returns the old portfolio and remains available for rollback.
- The apex certificate is valid, unexpired, trusted, and covers the required hostnames.
- The page has the approved canonical metadata and no indexing block.
- `robots.txt` allows crawling and references the canonical sitemap.
- The sitemap endpoint succeeds and contains the canonical homepage URL only once.
- Required assets, resume, headers, internal navigation, keyboard flow, mobile dialog, reduced motion, focus visibility, and console/network health pass.
- There is no horizontal overflow at 320, 375, 390, 768, 1024, 1440, or 1920 CSS pixels and no axe violation in the representative states.
- The production output remains static and contains no `astro-island` hydration.
- Three deployed Lighthouse runs score at least 95 Performance and 100 Accessibility, Best Practices, and SEO.
- The form count remains one, the PostHog privacy configuration remains intact, and automated checks create no external side effects.

### R7 — Roll back on a material failure

Initiate immediate domain rollback if the custom domain serves the wrong project, returns a persistent 4xx/5xx response, lacks trusted HTTPS, loses critical assets/navigation/form markup, exposes an indexing contradiction, or cannot pass the critical smoke checks within the cutover window.

Rollback procedure:

1. Remove the custom-domain binding from the replacement project.
2. Reassign `christopherharley.com` to old project `2cc82b28-4cd1-4e52-a6d2-e76967a6f3bf`.
3. Confirm the old ready deploy `6a95f94ed1df5700076ee53d` again serves the apex over trusted HTTPS and `www` redirects to the apex.
4. Confirm the DNS zone and its two managed records remained unchanged.
5. Leave the failed replacement deploy and project intact for diagnosis; do not delete evidence or attempt unrelated repairs during rollback.
6. Record the failure and fix forward through a new reviewed source change before attempting another cutover.

If the first domain-removal or assignment API operation fails without changing state, stop and inspect both site records before retrying. Never continue based on an assumed partial result.

### R8 — Record durable evidence

After successful cutover verification:

- Update `docs/plans/portfolio-implementation.md` with the source PR/merge, launch deploy ID, prior replacement deploy, old-site rollback deploy, cutover time, domain mapping, TLS result, indexing result, Forms/PostHog state, verification commands, and any deviation.
- Update this specification's status to implemented.
- Keep raw API snapshots, Lighthouse reports, and screenshots out of Git.
- Promote the evidence update through review. If that documentation-only merge triggers another Netlify build, confirm its deploy is ready and smoke-test the canonical site again.

## Design

### Source changes

The implementation is expected to change only:

- `astro.config.mjs`
  - Add the official `@astrojs/sitemap` integration using the existing canonical `site` value.
- `package.json` and `pnpm-lock.yaml`
  - Add `@astrojs/sitemap` as the only new dependency.
- `src/layouts/Layout.astro`
  - Remove the pre-cutover robots block.
  - Add `<link rel="sitemap" href="/sitemap-index.xml" />`.
- `public/robots.txt`
  - Allow crawling and reference `https://christopherharley.com/sitemap-index.xml`.
- `netlify.toml`
  - Add a forced, permanent, host-specific redirect from the generated production hostname to the canonical domain.
  - Preserve all existing build and security-header configuration.
- `lighthouserc.cjs`
  - Require 100 SEO and enable the crawlability assertion.
- `tests/portfolio.spec.ts`
  - Replace pre-cutover indexing assertions with canonical launch assertions and verify sitemap output.
- `tests/deployed.spec.ts`
  - Preserve all read-only protections while asserting live indexing, sitemap behavior, canonical host redirects, and the absence of the Netlify HUD.
- `README.md`
  - Replace temporary-host deployment guidance with canonical production and rollback-safe verification guidance.
- `docs/plans/portfolio-implementation.md`
  - Update only after live verification, as required by R8.

No Astro component, StyleX style, portfolio copy, visual asset, form handler, analytics event, or PostHog property should change.

### Sitemap approach

Use `@astrojs/sitemap` rather than a hand-maintained XML file. The site currently has one route, but the official integration derives absolute canonical URLs from the existing Astro `site` configuration and remains correct if approved pages are added later. It generates `sitemap-index.xml` and `sitemap-0.xml`; both must be verified in the production build.

### Host and redirect behavior

After the launch build is published:

| Host                                     | Before domain reassignment             | After domain reassignment          |
| ---------------------------------------- | -------------------------------------- | ---------------------------------- |
| `christopherharley.com`                  | Old portfolio                          | New Astro portfolio                |
| `www.christopherharley.com`              | Redirects to old apex                  | Redirects to new apex              |
| `statuesque-kangaroo-16f795.netlify.app` | Redirects to old custom-domain content | Redirects to new canonical content |
| New immutable deploy permalink           | New launch build                       | New launch build                   |
| Old immutable deploy permalink           | Old rollback build                     | Old rollback build                 |

The explicit generated-host redirect prevents a second crawlable copy after launch. Immutable deploy permalinks remain reachable for operational verification but are not linked or submitted for indexing.

### Operational cutover flow

1. Implement and locally verify the indexable launch build.
2. With approval, commit, push, and open a pull request.
3. Verify the deploy preview remains analytics-silent and introduces no visual/application regression.
4. With separate approval, merge to `main` and wait for a ready replacement production deploy.
5. Run pre-cutover acceptance against that deploy's immutable permalink; confirm the live domain is still old.
6. Present the exact ready deploy and rollback snapshot and obtain explicit domain-mutation approval.
7. Reassign the apex custom domain from the old project to the replacement project without changing DNS records.
8. Poll site mapping, TLS, apex, `www`, generated-host redirect, and critical assets until accepted or rollback is triggered.
9. Run the full non-mutating deployed suite and three Lighthouse collections against the canonical domain.
10. Recheck Forms, PostHog privacy settings, DNS record shapes, and the old immutable rollback deploy.
11. Record evidence in the plan and promote that documentation through review.
12. Provide the Search Console sitemap URL for user submission if authenticated Google Search Console access is unavailable.

## Decisions

### Keep Netlify DNS unchanged

- **Choice:** Reassign the custom domain between projects without changing nameservers or records.
- **Alternatives:** Rebuild the DNS zone, move to external DNS, or edit apex/`www` records manually.
- **Reason:** Both sites are already on the same Netlify team and the domain uses managed `NETLIFY` records. Direct DNS changes add propagation and outage risk without benefit.
- **Reversibility:** The custom-domain binding can be reassigned to the preserved old project.
- **Research:** Netlify documents that managed `NETLIFY` records are created for assigned domains and warns not to delete them unless intentionally disconnecting the domain.

### Make the apex domain primary

- **Choice:** Keep `christopherharley.com` primary and let Netlify redirect `www` to the apex.
- **Alternative:** Make `www.christopherharley.com` primary.
- **Reason:** The existing canonical, public links, Astro `site`, Open Graph URL, and current production behavior all use the apex. Netlify DNS supports an apex primary without external-DNS limitations.
- **Reversibility:** Netlify can change the primary domain later, but that would require coordinated canonical and redirect changes.
- **Research:** Netlify automatically adds the apex/`www` alternative and redirects it to whichever is primary.

### Stage crawlable output before the binding change

- **Choice:** Publish and verify the launch build at its immutable deploy permalink before moving the domain.
- **Alternatives:** Move the domain first and then publish SEO changes, or remove indexing blocks on the temporary hostname without redirecting it.
- **Reason:** The chosen order proves the exact build before the live mutation while the host-specific redirect prevents the stable generated hostname from becoming a duplicate crawlable copy. Visitors to both public-facing hosts continue seeing the old site until the binding changes.
- **Reversibility:** The source merge can be reverted and the domain can remain on or return to the old project.

### Use the official Astro sitemap integration

- **Choice:** Add `@astrojs/sitemap`.
- **Alternatives:** Commit a hand-written XML file or omit a sitemap for the one-page site.
- **Reason:** Google allows a manually maintained sitemap for small sites, but Astro's official integration is low-complexity, derives canonical URLs from existing configuration, and remains maintainable if routes are added.
- **Reversibility:** It can be replaced by a static file without affecting page rendering.
- **Research:** Astro's official integration requires the existing `site` setting and generates a sitemap index plus numbered sitemap files. Google recommends root-hosted, UTF-8, fully qualified canonical URLs and accepts sitemap discovery through `robots.txt` or Search Console.

### Preserve the old project instead of restoring a new-project deploy

- **Choice:** Roll back by reassigning the domain to the untouched old project.
- **Alternative:** Restore a previous deploy on the replacement project.
- **Reason:** The old project is the last known-good custom-domain configuration, with its own issued TLS certificate and immutable deploy. Reassignment restores the whole previous serving context, not only page files.
- **Reversibility:** The replacement remains intact for a later fix-forward attempt.

### Keep Search Console user-assisted when authentication is unavailable

- **Choice:** Make the sitemap discoverable in `robots.txt`, then have the user submit it in Search Console if the agent lacks authenticated Google access.
- **Alternative:** Treat Search Console authentication as a cutover blocker or attempt account access without authorization.
- **Reason:** Sitemap submission is a discovery hint, not a requirement for the domain to serve correctly, and Google account access is separate from Netlify access.
- **Reversibility:** The sitemap can be submitted or resubmitted at any time after launch.

## Versions and authoritative references

- Node.js `22.14.0` for Netlify builds
- pnpm `10.32.1`
- Astro `^7.3.5`
- `@astrojs/sitemap` `3.7.4` (latest npm release checked 2026-10-01)
- Netlify CLI `^27.10.2`
- Netlify OpenAPI `2.60.0`, including `updateSite`, DNS-zone, DNS-record, and TLS inspection operations
- Lighthouse CI `^0.15.1`
- Playwright `^1.63.0`

Authoritative references:

- Netlify domain assignment: <https://docs.netlify.com/manage/domains/manage-domains/assign-a-domain-to-your-site-app/>
- Netlify domain management/API: <https://docs.netlify.com/manage/domains/manage-domains/manage-domains-for-a-site-app/>
- Netlify apex and `www` behavior: <https://docs.netlify.com/manage/domains/manage-domains/manage-multiple-domains/>
- Netlify DNS record safety: <https://docs.netlify.com/manage/domains/manage-domains/manage-dns-records/>
- Netlify-managed HTTPS: <https://docs.netlify.com/manage/domains/secure-domains-with-https/https-ssl/>
- Netlify domain-level redirects: <https://docs.netlify.com/manage/routing/redirects/redirect-options/#domain-level-redirects>
- Astro sitemap integration: <https://docs.astro.build/en/guides/integrations-guide/sitemap/>
- Google sitemap guidance: <https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap>
- Google indexing controls: <https://developers.google.com/search/docs/crawling-indexing/block-indexing>
- Google robots guidance: <https://developers.google.com/crawling/docs/robots-txt/create-robots-txt>

## Invariants

- At every externally visible stage, `christopherharley.com` serves either the known-good old portfolio or the fully verified replacement—never a partial build.
- The DNS zone, nameservers, and managed apex/`www` records are unchanged.
- The old project and deploy remain available until well after cutover acceptance.
- Canonical, sitemap, robots, redirect, and primary-domain signals all converge on `https://christopherharley.com/`.
- The replacement remains a static Astro site with no server runtime and no unnecessary hydration.
- Visual design, approved content, links, resume, Forms behavior, and analytics taxonomy remain unchanged.
- Automated verification creates no form submission, email, PostHog event, or external navigation side effect.
- No credential, PostHog project value, form content, mailbox content, raw DNS snapshot, `.netlify/` state, or generated report enters Git.

## Error Behavior

- If local or preview checks fail, do not merge or mutate Netlify domain state.
- If the merged replacement deploy is not `ready`, keep the domain on the old project.
- If the deploy permalink is not indexable, canonical, complete, and green, keep the domain on the old project.
- If domain removal succeeds but assignment to the new project fails, immediately reassign the domain to the old project and verify it before debugging.
- If TLS is not trusted or the wrong certificate/site is served after assignment, roll back the domain binding rather than weakening HTTPS checks.
- If `www`, the generated hostname, or HTTP create a loop or incorrect redirect, roll back unless a safe configuration-only correction is obvious and separately approved.
- If Forms or PostHog state differs from baseline, do not create a new live form submission or change analytics privacy settings as an ad hoc repair.
- If Search Console access is unavailable, complete technical launch, provide the exact sitemap URL, and record submission as a user-owned follow-up rather than requesting credentials in chat.

## Testing Strategy

### Local source verification

```sh
pnpm install --frozen-lockfile
pnpm verify
pnpm audit --prod
git diff --check
```

Additionally verify:

- `dist/index.html` contains the canonical and sitemap link and has no `noindex` directive or `astro-island`.
- `dist/robots.txt`, `dist/sitemap-index.xml`, and `dist/sitemap-0.xml` exist and contain only the approved launch signals.
- The Netlify redirect configuration parses successfully.
- Existing form and analytics boundary tests remain unchanged and green.

### Pre-cutover deployed verification

Against the merged deploy's immutable permalink:

```sh
PLAYWRIGHT_BASE_URL=https://<deploy-id>--statuesque-kangaroo-16f795.netlify.app pnpm test:deployed
pnpm exec lhci collect --no-lighthouserc --url=https://<deploy-id>--statuesque-kangaroo-16f795.netlify.app/ --numberOfRuns=3
pnpm exec lhci assert --config=lighthouserc.cjs
```

Confirm separately that the stable generated hostname redirects to the still-old canonical domain and that the apex still identifies the old portfolio.

### Post-cutover acceptance

Against the canonical domain:

```sh
PLAYWRIGHT_BASE_URL=https://christopherharley.com pnpm test:deployed
pnpm exec lhci collect --no-lighthouserc --url=https://christopherharley.com/ --numberOfRuns=3
pnpm exec lhci assert --config=lighthouserc.cjs
```

Also inspect:

- Netlify site mappings and published deploy IDs.
- DNS zone ID, nameservers, and managed record shapes.
- TLS certificate subject alternative names and expiry.
- HTTP/HTTPS, apex/`www`, and generated-host redirect chains without automatically hiding loops.
- Netlify form registration and singular submission count.
- PostHog production/privacy configuration through read-only inspection.
- The old immutable rollback deploy.
- Responsive screenshots at the required widths; no Figma change is expected, so any visual difference is a blocker.

## Out of Scope

- Registrar transfer, renewal, billing, or ownership changes
- Nameserver, DNS provider, TTL, MX, TXT, email, or unrelated subdomain changes
- Deleting or repurposing the old Netlify project
- Another live contact-form submission
- New PostHog events, properties, dashboards, identification, profiles, replay, autocapture, or GeoIP
- Visual redesign, copy edits, a third project, resume changes, or new interaction behavior
- Social-sharing imagery
- Guaranteed search ranking or indexing timing
- Google account credentials or bypassing user-controlled Search Console authentication
