# Manual / User-Only Tasks — macleanup-docs

> The ONE place for everything only you (the human) can do. Fixed path: `docs/MANUAL-TASKS.md`.
> Global spec: `~/.claude/rules/manual-tasks.md`.
>
> 🔴 **This file is EXCLUDED from the published site** via the docs-plugin `exclude` list in
> `docusaurus.config.ts`. It must never become a public page. Verify after any build:
> `find build -iname '*MANUAL*'` → must return nothing.
>
> **Last updated:** 2026-07-25

## ⏳ Pending manual tasks

| # | Task | Why only you | Details | Status |
|---|------|--------------|---------|--------|
| 1 | Create the GitHub repo `aoneahsan/macleanup-docs` (**public**) and push `main` | Repo creation + visibility is an owner decision | Public repo is required for GitHub Pages on the free plan | ☐ Not started |
| 2 | Add the Hostinger DNS record: `CNAME` `macleanup-docs` → `aoneahsan.github.io` | DNS registrar access | Probe today returns `000` — the record does not exist yet. This is the expected pre-launch state | ☐ Not started |
| 3 | Enable Pages with source = GitHub Actions | Repo settings | `gh api -X POST repos/aoneahsan/macleanup-docs/pages -f build_type=workflow` (409 = already enabled) | ☐ Not started |
| 4 | Settings → Pages → set custom domain `macleanup-docs.aoneahsan.com`, then tick **Enforce HTTPS** | Repo settings + certificate issuance | ⚠️ Must be done **after** task 2 — GitHub rejects a domain it cannot validate (`The certificate does not exist yet`). Certificate issuance takes minutes to an hour after DNS propagates | ☐ Not started |
| 5 | Apply the public-repo branch ruleset on `main` (PR + 1 approval + CI, no force-push/delete, bypass = Repository admin only) | Repo admin | Spec: `~/.claude/rules/public-repo-governance.md` | ☐ Not started |
| 6 | Verify the live site after the first deploy | Needs the deploy to have happened | `curl -s -o /dev/null -w '%{http_code}' https://macleanup-docs.aoneahsan.com` → expect 200 | ☐ Not started |

## 📋 Owner decisions needed elsewhere (outside this repo's scope)

These are **not** edits to this repo — they were out of the docs-site agent's exclusive scope and are
recorded here so they are not lost:

| # | File | Change needed |
|---|------|---------------|
| 7 | `code/projects/project-live-urls.json` | Set the `macleanup` entry's `docsUrl` to `https://macleanup-docs.aoneahsan.com` (currently `""`) |
| 8 | `utility-projects/macleanup/README.md` + `CLAUDE.md` + `AGENTS.md` | Add a Links entry pointing at the docs site |

## 🔐 Optional — analytics secrets

Both are optional; the build succeeds without them and each provider is skipped when its key is absent.
If you want analytics, add these as repo **Actions secrets** (never as committed files):

| Secret | Provider |
|---|---|
| `GA_MEASUREMENT_ID` | Google Analytics 4 |
| `CLARITY_PROJECT_ID` | Microsoft Clarity |

## ✅ Completed manual tasks

(move rows here with the date once done)
