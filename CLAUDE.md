# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal technical knowledge base website (Chinese/English) deployed as a static site. Contains 170+ Markdown articles on Java, concurrency, databases, distributed systems, reactive programming, AI, and more. The site is deployed via Vercel at `paper.rxcloud.group`.

## Commands

- **Build** (generate knowledge base index): `npm run build` (runs `node generate-index.js`)
- **Dev server**: `npm run dev` (build + serve on port 8000)
- **Serve only**: `npm run serve` (serves current directory on port 8000)
- **Quick local server**: `python -m http.server 8000`

There are no tests or linting configured.

## Architecture

### Static Site Structure

The site consists of standalone HTML pages with no build framework:

- `index.html` — Landing page (based on HTML5 UP "Strata" template)
- `navigation.html` — Navigation hub linking all pages
- `knowledge-base.html` — AI-driven knowledge base with search/filter (reads data from `knowledge-base-data.js`)
- `knowledge-graph.html` — Interactive D3.js force-directed knowledge graph visualization
- `articles.html` — Traditional article browsing
- `viewer.html` — Markdown article reader (renders `.md` files using Marked.js + Highlight.js)

### Knowledge Base Index Generator

`generate-index.js` is the core build script. It:
1. Scans configured directories for `.md`, `.pdf`, `.docx` files
2. Extracts titles, descriptions, tags, and reading time from Markdown files
3. Outputs `knowledge-base-data.js` (JS data file) and `knowledge-base-snippet.html` (embeddable HTML)

The scanned directories are configured in `config.scanDirs` within the script. To add a new content directory, add it there and optionally add a display name in `getCategoryDisplayName()`.

### Content Organization

Articles are organized in top-level directories by topic (e.g., `Concurrent/`, `Database/`, `Reactive/`, `博客文章/`, `持续交卷/`). Each directory contains Markdown files and optionally PDFs.

### Deployment

- **Primary**: Vercel — Auto-deploys on push to `master`. Custom domain: `paper.rxcloud.group`
- **CI/CD**: `.github/workflows/deploy.yml` — Also deploys to GitHub Pages via `peaceiris/actions-gh-pages`
- **Config**: `vercel.json` — Routes `.html` files directly, falls back to `index.html`

### Frontend Assets

- `assets/css/main.css` + `assets/sass/main.scss` — Styles (HTML5 UP template base)
- `assets/css/enhanced.css` — Shared design system (dark theme, glass-morphism, animations, typography)
- `assets/js/` — jQuery, Poptrox, and custom JS
- `assets/fonts/` — FontAwesome

## Key Conventions

- Content files are primarily in Chinese
- Auto-generated files (`knowledge-base-data.js`, `knowledge-base-snippet.html`) should not be manually edited — run `npm run build` to regenerate
- The `.gitignore` excludes `职业发展/` directory (private content)
