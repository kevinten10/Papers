# Papers Triage - 2026-06-27

## Repository

- GitHub: `kevinten10/Papers`
- Public URL: `https://paper.rxcloud.group`
- Category: static personal knowledge base

## Actions Taken

- Added `AGENTS.md` with content and generated-index maintenance rules.
- Added `.env.example` for the public site URL.
- Added a dedicated `lint` script without replacing the repository's Node test suite.

## Validation

- `npm run lint`
- `npm test`
- `npm run build`
- `git diff --check`
- `gitleaks` on the committed diff

## Local Draft Boundary

Pre-existing draft expansions and generated indexes are preserved in a named local stash. They were not mixed into this maintenance commit and require a separate editorial review before publication.
