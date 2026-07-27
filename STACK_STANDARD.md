# Engineering Standard v1

## Levels

### Prototype
- Reproducible dependency installation
- Lint, typecheck, build
- Preview deployment
- `.env.example` without secrets

### Product
Everything in Prototype, plus:
- Automated tests
- Product analytics
- Error and request telemetry
- Health endpoint
- Versioned database migrations
- Row Level Security for exposed tables
- Dependency auditing

### Production
Everything in Product, plus:
- Protected default branch
- Required reviews and checks
- Deployment verification
- Backups and recovery procedure
- Authentication and authorization review
- Rate limiting where abuse is possible
- Alerts, runbook, privacy review, and cost monitoring

## Non-negotiable rules

1. No privileged secrets in source control.
2. Database schema changes are migrations, not dashboard-only edits.
3. Public database access requires RLS and explicit policies.
4. Every pull request must pass CI before merge.
5. Every production-facing request path must produce useful failure telemetry.
6. Analytics must avoid unnecessary sensitive content.
7. Product-specific code never becomes the portfolio standard.

## Design-system profiles

Frontend projects declare one design-system profile:

- `astryx` — preferred for new React 19+ applications that benefit from a
  component library, design tokens, themes, accessible interaction primitives,
  and agent-readable component documentation.
- `custom` — the project owns its component and token architecture.
- `none` — no application user interface exists.

The profile governs implementation consistency, not product identity. Product
teams continue to own brand, audience, information architecture, interaction
design, content, density, and visual tone.

### Astryx contract

An Astryx project must:

1. Declare `design.system: astryx` and pin `design.version`.
2. Use React 19 or newer.
3. Install matching pinned versions of `@astryxdesign/core`, an
   `@astryxdesign/theme-*` package, and `@astryxdesign/cli`, plus the compatible
   pinned `@stylexjs/stylex` peer dependency.
4. Expose the local CLI through the package script `"astryx": "astryx"`.
5. Run `astryx init --features agents` so coding agents consult the installed
   component index instead of inventing APIs.
6. Pass `astryx doctor --json` in the shared Project Standard workflow.
7. Prefer an existing Astryx component or template before introducing a custom
   primitive. Custom UI remains allowed when the pull request explains the
   product need.
8. Treat accessibility, keyboard operation, responsive behavior, and visual
   regression coverage as acceptance criteria for user-facing changes.

Astryx is currently pre-1.0. Dependabot may propose upgrades, but minor version
updates require human review and a preview deployment because they may contain
breaking changes.
