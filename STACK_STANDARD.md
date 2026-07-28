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

## Conditional database standard

Projects that declare Prisma with PostgreSQL must enable the shared
`postgres-integration` job. The job must:

- run PostgreSQL 16 in an isolated CI service;
- provide separate `DATABASE_URL` and `DIRECT_URL` values;
- pass `--url "$DIRECT_URL"` explicitly to `prisma db execute`;
- apply version-controlled migrations with `prisma migrate deploy`;
- generate the Prisma client from the reviewed schema; and
- run a declared database integration-test script.

Projects without Prisma/PostgreSQL do not run this job. A repository-specific
database workflow may replace the shared job only when its manifest records the
exception and it provides equivalent evidence.
