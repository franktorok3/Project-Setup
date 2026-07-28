# Project Setup

A project-neutral engineering operating system for applications built across GitHub, Vercel, Supabase, PostHog, and AI providers.

## Purpose

Projects may differ in product logic, but they must meet consistent expectations for testing, security, deployments, data governance, observability, and maintainability.

## Adoption

1. Add `frank-stack.yml` to the consuming repository.
2. Add the reusable workflow caller shown in `templates/nextjs/ci-caller.yml`.
3. For Prisma/PostgreSQL projects, use
   `templates/prisma-postgres/ci-caller.yml` and add a `test:integration`
   package script that fails closed when `DATABASE_INTEGRATION_TESTS=1`
   (no silent skips to a green empty suite). Copy
   `templates/prisma-postgres/integration-proof.mjs` into the consumer and
   write its proof only after the database assertions pass.
4. Copy only the framework adapters needed by the project.
5. Configure environment variables in the deployment platform.
6. Protect the default branch and require the `Project Standard / verify` and,
   when applicable, `Project Standard / postgres-integration` checks.

The PostgreSQL adapter is capability-driven. It is not enabled for projects that
do not declare Prisma/PostgreSQL.

## Versioning

Consumers should reference release tags such as `v1`. Until the first tag is created, consumers may reference `main`. Breaking changes require a new major version.
