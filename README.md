# Project Setup

A project-neutral engineering operating system for applications built across GitHub, Vercel, Supabase, PostHog, and AI providers.

## Purpose

Projects may differ in product logic, but they must meet consistent expectations for testing, security, deployments, data governance, observability, and maintainability.

## Adoption

1. Add `frank-stack.yml` to the consuming repository.
2. Add the reusable workflow caller shown in `templates/nextjs/ci-caller.yml`.
3. Copy only the framework adapters needed by the project.
4. Configure environment variables in the deployment platform.
5. Protect the default branch and require the `Project Standard / verify` check.

## Versioning

Consumers should reference release tags such as `v1`. Until the first tag is created, consumers may reference `main`. Breaking changes require a new major version.
