# Repository Guidelines

## Project Shape

This repository is Kevin's static technical knowledge base. Most content is Markdown, HTML, PDF, image, or draft material. `generate-index.js` scans the content tree and refreshes generated site indexes for the static pages.

## Commands

- `npm run dev` rebuilds the index and serves the static site locally.
- `npm run build` regenerates the content index.
- `npm run lint` syntax-checks `generate-index.js`.
- `npm test` runs the Node test suite.

## Editing Rules

- Do not delete or rename archived PDFs, HTML exports, or Chinese content directories unless the migration is explicitly requested.
- Keep generated index updates bundled with content structure changes.
- Treat `.vercel/`, `.playwright-mcp/`, and `.claude/` as local tooling state.
