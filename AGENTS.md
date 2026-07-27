# Project Setup Agent Contract

## Authority

Agents may update standards, templates, validators, and documentation on a branch. Agents may not approve or merge their own work, weaken downstream checks, alter project product requirements, or declare portfolio compliance without current evidence.

## Scope

Project Setup defines shared engineering governance. It must remain product-neutral: standards govern authority, evidence, security, review, and release—not features, audiences, design, business models, content, or roadmaps.

## Change requirements

- Changes use a pull request and pass `validate`.
- Shared workflow changes preserve supported package managers and runtimes.
- Missing or inaccessible portfolio evidence is `UNKNOWN`, never healthy.
- Repository-specific exceptions are explicit in `frank-stack.yml`.
- Private credentials and repository tokens remain GitHub secrets.

## Completion

A standards change is incomplete until its validator passes and at least one representative consumer proves the changed contract. Agents never merge their own standards changes.
