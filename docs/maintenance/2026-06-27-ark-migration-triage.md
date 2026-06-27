# 2026-06-27 Ark Migration Triage

## Scope

- Repository: `kevinten10/Papers`
- Branch checked: `origin/master`
- Deployment: Vercel static site
- Public domain: `https://paper.rxcloud.group`
- Runtime LLM entrypoint: none found

This repository is a static knowledge-base site. It builds indexed pages from
local notes, articles, and research files, then serves static assets through
Vercel. There are no server routes, CloudBase functions, Supabase Edge
Functions, or API clients that call an LLM provider at runtime.

## Scan Result

The Ark migration scan found GLM/Zhipu markers in these categories:

- research notes and public-account drafts that compare model providers;
- archived news about Zhipu/GLM;
- AI tool catalog data where GLM is listed as one model family among many;
- generated knowledge-base data and snippets derived from the source notes;
- cached or downloaded static pages unrelated to production LLM calls.

Targeted remote scans found no production runtime dependency on:

- `open.bigmodel.cn`
- `GLM_API_KEY`
- `ZHIPU_API_KEY`
- `ZHIPUAI_API_KEY`
- `response_format`
- `json_object`

## Decision

No Ark runtime migration is required for this repository. The remaining
GLM/Zhipu references are retained as research, historical, or catalog content.
They should not be treated as expired GLM plan dependencies unless the related
article is republished with updated recommendations.

No Ark deployment secrets are required for the current static site. Browser LLM
recovery verification is not applicable because the live site does not expose
an LLM generation flow.

## Verification

Use these checks when revisiting the repository:

```bash
/Users/zhengmin/.codex/skills/volcengine-ark-migration/scripts/scan_project.sh .
git grep -I -n -E 'open\.bigmodel|GLM_API_KEY|ZHIPU_API_KEY|ZHIPUAI_API_KEY|response_format|json_object' HEAD -- ':!Cache/**' ':!node_modules/**' ':!dist/**' ':!build/**'
npm test
npm run build
git diff --check
```
