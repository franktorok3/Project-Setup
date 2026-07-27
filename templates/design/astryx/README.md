# Astryx design profile

Use this optional profile for new React 19+ products that need a refined,
accessible component and token foundation. It does not define the product's
brand, audience, content, information architecture, or feature set.

Astryx is MIT licensed and currently pre-1.0. This profile pins version `0.1.9`
so an automated upgrade cannot silently change the design contract.

## Install

For npm:

```bash
npm install --save-exact react@19 react-dom@19 @stylexjs/stylex@0.19.0 @astryxdesign/core@0.1.9 @astryxdesign/theme-neutral@0.1.9
npm install --save-dev --save-exact @astryxdesign/cli@0.1.9
npm pkg set scripts.astryx=astryx
npm run astryx -- init --features agents
npm run astryx -- doctor --json
```

For pnpm:

```bash
pnpm add --save-exact react@19 react-dom@19 @stylexjs/stylex@0.19.0 @astryxdesign/core@0.1.9 @astryxdesign/theme-neutral@0.1.9
pnpm add --save-dev --save-exact @astryxdesign/cli@0.1.9
pnpm pkg set scripts.astryx=astryx
pnpm run astryx -- init --features agents
pnpm run astryx -- doctor --json
```

Then merge `AGENTS.fragment.md` into the repository's existing `AGENTS.md`.
Do not replace its governance, security, data, or product-specific rules.

## Application setup

Import the styles in this order:

```css
@import '@astryxdesign/core/reset.css';
@import '@astryxdesign/core/astryx.css';
@import '@astryxdesign/theme-neutral/theme.css';
```

Wrap the application with Astryx `Theme`. Next.js applications should also
provide the framework link component through `LinkProvider`. Follow the
installed package documentation returned by:

```bash
npm run astryx -- docs theme
npm run astryx -- docs getting-started
```

## Verification

- `astryx doctor --json` passes.
- The shared Project Standard workflow passes.
- Critical user flows have keyboard and accessibility coverage.
- User-facing changes are reviewed in the preview deployment.
- Custom primitives include a short justification explaining why an existing
  Astryx component or template did not satisfy the product need.
- Astryx minor upgrades receive human review because pre-1.0 minor releases may
  contain breaking changes.
