## Astryx design profile

This project uses the pinned Astryx design system declared in
`frank-stack.yml`.

- Before writing UI, use the local CLI to search components, templates, tokens,
  and guidance. Never guess Astryx APIs.
- Prefer an existing component, hook, or page template before building a new
  primitive.
- Product identity remains project-owned. Adapt theme tokens, composition,
  content, hierarchy, and interaction to the product brief; do not produce a
  generic demo aesthetic.
- Custom UI is allowed when Astryx cannot meet the product need. Document the
  reason in the pull request.
- Preserve semantic HTML, keyboard operation, focus visibility, responsive
  behavior, light/dark behavior, and reduced-motion preferences.
- Never use experimental `@astryxdesign/lab`, chart canaries, or deep internal
  imports unless the mission explicitly authorizes them.
- Do not upgrade pre-1.0 Astryx packages automatically. Keep Astryx package
  versions aligned and require human review plus preview verification.
- Completion requires a passing `astryx doctor --json`, shared CI, and visual
  review of the preview deployment.
