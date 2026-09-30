# AGENTS.md

## Mission

Build and maintain Christopher Harley's one-page portfolio as a fast, accessible, design-faithful production site for creative frontend, frontend engineering, and design engineering roles.

Optimize for, in order:

1. Correctness and fidelity to the approved Figma design and content.
2. Accessibility, semantic HTML, and resilient responsive behavior.
3. Minimal client JavaScript and excellent real-world performance.
4. Clear, typed, maintainable code with a small dependency surface.
5. Safe, frequent production delivery through Netlify.

## Sources of truth

Use this precedence when instructions conflict:

1. The user's current request.
2. The approved Figma frame and its assets/content.
3. The current full-page implementation specification in `docs/`, if present.
4. This file.
5. Existing repository conventions and nearby code.

Do not invent copy, project facts, links, analytics events, visual assets, or design behavior. If a required source of truth is unavailable and the decision would materially affect the result, stop and ask one focused question.

## Start every task this way

Before editing:

1. Read this file and any nearer `AGENTS.md`.
2. Inspect `package.json`, its scripts, the lockfile, `astro.config.*`, `tsconfig.json`, `netlify.toml`, and the relevant source/tests.
3. Check `git status` and preserve all pre-existing user changes.
4. Identify the requested outcome, constraints, and concrete verification criteria.
5. For a multi-file, risky, or ambiguous change, write a short plan before implementation.

Use the package manager selected by the `packageManager` field or existing lockfile. Never create a competing lockfile. Use repository scripts as written; do not guess command names.

## Product and architecture constraints

- Framework: Astro with strict TypeScript.
- Output: static by default. Do not add a server runtime unless the user explicitly approves it.
- UI: Astro components plus React/TSX only where it improves typed composition or matches existing architecture.
- Hydration: no `client:*` directive unless the feature truly requires browser state or interaction. Document the reason in the code or handoff.
- Styling: StyleX is the component styling system. Do not introduce Tailwind, Sass, CSS Modules, styled-components, Emotion, or a second styling system.
- Content: local, typed content. Do not add a headless CMS without an explicit new decision.
- Scope: one page. Implement against one complete page specification, not independent section specifications.
- Hosting: Netlify. Treat `main` as the production branch unless repository configuration proves otherwise.
- Analytics: PostHog, production only, with explicit typed events and privacy-conscious defaults.

Prefer the simplest static implementation that satisfies the design. Avoid speculative abstractions, generic component systems, and dependencies for behavior that a small local utility or native platform feature can handle.

## Expected organization

Follow the repository if it already has a coherent structure. Otherwise prefer:

```text
src/
  components/       Reusable page components
  content/          Typed portfolio copy and project data
  layouts/          Document and page shells
  pages/             Astro routes; the portfolio lives at `/`
  styles/            StyleX tokens, themes, resets, and true globals
  lib/               Small framework-independent helpers
  analytics/         PostHog initialization and typed event helpers
public/              Static assets that do not need transformation
tests/               Browser and integration tests
docs/                Full-page implementation spec and living plans
```

Keep components focused on meaningful visual or semantic units. Do not fragment static markup into tiny components without a reuse, clarity, or testability benefit.

## Figma-to-code rules

When implementing the approved Figma design:

- Inspect the entire approved page/frame and its reusable styles, variables, assets, and responsive intent before coding.
- Build the complete page in one implementation pass, then perform correction passes for visual discrepancies.
- Reuse exported assets from the source design. Do not approximate an available icon, image, logo, or illustration.
- Translate repeated values into semantic StyleX tokens; do not blindly copy arbitrary pixel values into every component.
- Preserve hierarchy, typography, spacing rhythm, alignment, imagery, borders, color, and interaction states.
- Implement responsive behavior deliberately. Check narrow mobile, mobile, tablet, desktop, and wide desktop layouts; do not merely scale the desktop frame.
- Prefer content-driven sizing and modern layout primitives over brittle absolute positioning.
- Record any unavoidable deviation and its reason in the final handoff.

## StyleX conventions

- Use `@stylexjs/stylex` and the repository's Astro/Vite integration.
- Define shared design tokens with `stylex.defineVars` in dedicated `*.stylex.ts` files.
- Define component styles with `stylex.create` and apply them with `stylex.props`.
- Keep styles statically analyzable. Avoid runtime-computed style objects and unsupported dynamic values.
- Use semantic token names such as `textPrimary`, `surfaceRaised`, and `spaceSection`, not names tied to raw values.
- Keep true document globals—font faces, reset, selection, and root defaults—small and intentional.
- Never target generated StyleX class names from global CSS.
- Prefer variants and conditional StyleX props over duplicated style blocks.
- Preserve or verify the repository's CSS layer/order setup when changing build configuration.

If StyleX/Astro integration has not yet been proven in this repository, first create the smallest representative build using tokens, responsive styles, a pseudo-state, and a production build. Resolve integration issues before implementing the whole page.

## TypeScript and Astro conventions

- Keep strict TypeScript enabled. Do not weaken compiler settings to silence an error.
- Avoid `any`; narrow `unknown` and model content/events explicitly.
- Use `import type` for type-only imports.
- Prefer named types for shared content models and analytics payloads.
- Keep Astro frontmatter deterministic and free of browser-only APIs.
- Use semantic HTML before ARIA. Add ARIA only when native semantics are insufficient.
- Use optimized Astro image handling where appropriate and always provide useful dimensions and alt behavior.
- Do not add client-side state for CSS-manageable presentation.

## Accessibility and motion

The target is WCAG 2.2 AA.

- Maintain one logical `h1` and a correctly nested heading outline.
- Use landmarks, meaningful link text, keyboard-operable controls, and visible focus states.
- Meet contrast requirements in every state.
- Preserve usability at 200% zoom and at a 320 CSS-pixel viewport without two-dimensional scrolling.
- Respect `prefers-reduced-motion`; animation must not be required to understand or operate the page.
- Do not convey information by color, hover, or motion alone.
- Decorative images use empty alt text; informative images use concise, contextual alt text.

## PostHog analytics

- Initialize PostHog only in production and only when the required public environment variables exist.
- Keep keys in environment variables; never commit secrets or paste them into logs.
- Centralize initialization and event definitions. Event names and payloads must be typed.
- Track only intentional portfolio outcomes, such as project-link, contact, resume, and primary navigation interactions.
- Never send message contents, query strings, free-form text, email addresses, or other personal data.
- Do not identify visitors or enable session replay unless the user explicitly changes the privacy decision.
- Analytics failure must never break navigation or primary interactions.
- Verify that development and preview builds do not send production events.

## Dependencies and configuration

- Reuse existing dependencies and platform APIs first.
- Add a dependency only when it clearly reduces risk or complexity. Explain material additions in the handoff.
- Pin or range versions consistently with the existing manifest.
- Keep public environment variables explicitly documented in `.env.example`; never commit `.env` files or credentials.
- Treat `astro.config.*`, `netlify.toml`, TypeScript, lint, and test configuration as production code. Make the smallest justified change.

## Testing and verification

Run the narrowest useful checks during development and the complete relevant suite before finishing. Discover exact commands from `package.json`. The expected verification categories are:

- formatting and linting;
- Astro/TypeScript checks;
- production build;
- unit or component tests when business logic exists;
- Playwright checks for navigation, links, keyboard flow, responsive behavior, and analytics boundaries;
- automated accessibility checks with axe;
- Lighthouse CI or an equivalent production-build audit.

For the complete portfolio implementation, verify at minimum:

- the page builds as static output;
- there are no unexpected hydration scripts;
- internal navigation and every external link work;
- keyboard order and visible focus are correct;
- the layout works at 320, 375, 768, 1024, 1440, and 1920 CSS pixels;
- reduced-motion behavior works;
- no development console errors occur;
- PostHog is silent outside production and emits only approved events in production;
- Lighthouse targets are at least 95 Performance and 100 Accessibility, Best Practices, and SEO, unless the environment makes a score demonstrably non-actionable.

Do not claim a check passed unless you ran it. If a check cannot run, state the exact blocker and the best available substitute.

## Production and Netlify

Production delivery begins early; it is not a final-phase activity.

- Keep the Netlify production pipeline deployable from the first stable checkpoint.
- Preserve the existing `christopherharley.com` production site until the explicit domain cutover task.
- When the current request includes deployment, deploy only a green, reviewable checkpoint after required checks pass.
- Verify the deployed URL, critical navigation, assets, response behavior, and analytics environment after each production deploy.
- Do not change DNS, domain ownership, environment variables, billing, or destructive Netlify settings without explicit authorization.
- Never deploy known broken work merely to obtain a preview. Use a branch/preview deploy when the work is not production-ready.

## Git safety

- Keep changes scoped to the request. Do not reformat or rewrite unrelated files.
- Never discard user changes, rewrite shared history, force-push, or use destructive git commands without explicit authorization.
- Do not commit generated build output unless the repository already tracks it intentionally.
- Use clear, focused commits when commits are requested or the active workflow requires them.
- Before handoff, review `git diff` for accidental edits, secrets, debug code, placeholders, and generated artifacts.

## Plans for substantial work

For work that is multi-hour, cross-cutting, risky, or likely to outlive one session, create or update a living plan in `docs/plans/<short-slug>.md`. It must be self-contained and include:

- goal and user-visible outcome;
- relevant context and exact file paths;
- constraints and non-goals;
- ordered implementation steps;
- progress checklist;
- decisions and discoveries;
- verification commands and acceptance criteria;
- recovery or rollback notes for risky operations.

Keep the plan current as facts change. For the initial portfolio build, use a single full-page implementation plan; do not create separate plans for each page section.

## Definition of done

A task is done only when:

1. The requested behavior is implemented without unrelated scope growth.
2. The code follows the architecture, StyleX, accessibility, privacy, and content rules above.
3. Relevant checks pass, including a production build for production-facing changes.
4. The diff has been self-reviewed and contains no secrets, debug code, accidental churn, or unresolved placeholders.
5. Documentation, typed content, `.env.example`, and tests are updated when behavior or setup changed.
6. Deployment is completed and smoke-tested when it is part of the request.
7. The handoff reports the outcome, important files changed, checks actually run, deployment status, and any remaining risk or follow-up.

## Agent communication

Lead with outcomes. Be concise and concrete. During longer tasks, provide brief progress updates at meaningful checkpoints. Ask only questions that materially change the implementation. In the final handoff, distinguish verified facts from assumptions and never imply that tests, deployment, or visual review occurred when they did not.


## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)