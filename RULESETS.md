# Required GitHub Rulesets

The GitHub connector cannot create or update repository rulesets. Apply these settings once per repository in **Settings → Rules → Rulesets**.

## Product repositories

Target the default branch and enable:

- Restrict deletions
- Block force pushes
- Require a pull request before merging
- Require all conversations to be resolved
- Require status checks to pass
- Require branches to be up to date before merging
- Require successful Vercel deployment when the project is hosted on Vercel

Required status check:

- `standard / verify`

Recommended merge policy:

- Squash merge enabled
- Merge commits disabled
- Rebase merging optional
- Direct pushes bypassed only for repository owner emergencies

## Production repositories

Apply all Product requirements plus:

- Require one approval
- Dismiss stale approvals when new commits are pushed
- Require CodeQL or equivalent code scanning
- Require dependency review
- Require signed commits when practical
- Limit bypass permissions to the repository owner

## Prototype repositories

At minimum:

- Block force pushes
- Restrict deletions
- Require the shared CI check before merging when a PR is opened

## Current portfolio targets

- `franktorok3/torok`: Product
- `franktorok3/Floor-Finder`: Product
- `franktorok3/Focal-Point-V2`: Prototype
- `franktorok3/Wellumi-`: Prototype
- `franktorok3/sjjcc-grant-finder`: Prototype
- `franktorok3/vercel-ai-gateway-demo`: Prototype
