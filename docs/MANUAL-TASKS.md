# Manual / User-Only Tasks — macleanup-docs

> The ONE place for everything only you (the human) can do. Fixed path: `docs/MANUAL-TASKS.md`.
> Global spec: `~/.claude/rules/manual-tasks.md`.
>
> 🔴 **This file is EXCLUDED from the published site** via the docs-plugin `exclude` list in
> `docusaurus.config.ts`. It must never become a public page. Verify after any build:
> `find build -iname '*MANUAL*'` → must return nothing.
>
> **Last updated:** 2026-10-29

## ⏳ Pending manual tasks

None for DNS or HTTPS. The site is reachable at `https://macleanup-docs.aoneahsan.com`.

## 📋 Owner decisions needed elsewhere (outside this repo's scope)

Reassess this as part of the next package release:

| # | File | Change needed |
|---|------|---------------|
| 1 | `code/macleanup-root/macleanup/README.md` + `CLAUDE.md` + `AGENTS.md` | Point public docs links at the now-live domain after the Story content and publication gates |

## 🔐 Optional — analytics secrets

Both are optional; the build succeeds without them and each provider is skipped when its key is absent.
If you want analytics, add these as repo **Actions secrets** (never as committed files):

| Secret | Provider |
|---|---|
| `GA_MEASUREMENT_ID` | Google Analytics 4 |
| `CLARITY_PROJECT_ID` | Microsoft Clarity |

## ✅ Completed setup

- 2026-07-25: Created and pushed the public `aoneahsan/macleanup-docs` repository. The GitHub Pages workflow deployed successfully.
- 2026-10-23: Verified Pages uses GitHub Actions, its custom domain is already set to `macleanup-docs.aoneahsan.com`, and the active `main` ruleset requires a PR with owner bypass.
- 2026-10-23: The owner added Hostinger CNAME `macleanup-docs` → `aoneahsan.github.io`; local DNS lookup confirmed it resolved. Certificate issuance was pending at that point and completed on 2026-10-26.
- 2026-10-26: Removed and immediately re-added the same GitHub Pages custom domain to restart certificate provisioning, per GitHub's troubleshooting guide. Pages now reports `authorization_pending`; the HTTP site returns 200.
- 2026-10-26: GitHub Pages approved the certificate; enabled Enforce HTTPS. The Pages API reports `https_enforced: true` and the HTTPS site returns HTTP 200 with a valid certificate.
