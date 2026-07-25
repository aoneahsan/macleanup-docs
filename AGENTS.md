# macleanup-docs — Project Rules

**Type:** Docusaurus 3 documentation site for the npm package `macleanup`
**Live:** https://macleanup-docs.aoneahsan.com (GitHub Pages)
**Source package:** `../macleanup` (READ-ONLY from here) · https://github.com/aoneahsan/macleanup
**Repo visibility:** 🔴 **PUBLIC**
**Last Updated:** 2026-07-25

> Mirror of `CLAUDE.md` in this folder — byte-identical except the header. Change one, change both.

---

## 🔴 PUBLIC REPO — no secret ever enters it

Only `.env.example` with placeholder values. Real values live in `~/.secrets/` and the repo's GitHub
Actions secrets. **Every analytics provider is gated on its own key, so an absent key skips it and the
build still succeeds** — a docs build must never require a secret.

Sweep before every commit; it must return nothing:

```bash
git ls-files | grep -iE '(^|/)\.env$|\.env\.(local|production)|secret|credential|serviceaccount|\.pem$|\.jks$|\.keystore$|\.p8$|\.npmrc'
```

## Domain + deployment (IRON)

| | |
|---|---|
| Domain | `macleanup-docs.aoneahsan.com` — derived per `~/.claude/rules/docs-sites.md`: an npm package with no marketing site gets `<npm-package-name>-docs.aoneahsan.com` |
| Pinned in | `static/CNAME` · `docusaurus.config.ts` `url` |
| Host | **GitHub Pages only** — `.github/workflows/deploy-pages.yml` on push to `main` |
| Firebase | ❌ **None.** No `firebase.json`, no `.firebaserc`, no `firebase:deploy` script. A docs site is not a Firebase app |
| Config | `baseUrl: '/'` · `organizationName: 'aoneahsan'` · `projectName: 'macleanup-docs'` |

DNS and the Pages custom-domain setting are **owner-only** → `docs/MANUAL-TASKS.md`.

## `docs/MANUAL-TASKS.md` must never publish

`docs/` is both the published content directory and the fixed path for the internal manual-tasks file.
It is excluded via the docs plugin's `exclude` array — and **`exclude` REPLACES the plugin defaults**,
so they are restated there. Do not remove any entry. Verify after any build:

```bash
find build -iname '*MANUAL*'    # must return nothing
```

## Content rules

- **Every page carries `title` + `description` front matter** (+ `tags`). A page without them is
  invisible to search and ships an empty meta description.
- **This tool deletes files, and that shapes the docs.** Lead with what is removed and how to preview
  safely; the "Before you run" category deliberately sits above "Getting started" in `sidebars.ts`.
- **Never imply a deletion is reversible when it is not.** Only sections 21 and 24 move items to the
  Trash. Everything else is permanent. The three-tier classification in
  `docs/before-you-run/what-gets-deleted.md` is the single home for that fact — link to it, do not
  restate it differently elsewhere.
- **No invented numbers.** Do not claim how much space the tool frees. Source every factual claim from
  the package's README, `CHANGELOG.md` or `docs/` — never from memory.
- Sidebars update in the **same change** as a new page. Moved URLs get redirects, never 404s.
- `yarn build` IS the link checker (`onBrokenLinks` + `onBrokenAnchors` both `throw`).

## Commands

```bash
yarn install
yarn build      # the gate — must exit 0
yarn serve      # verify the real build
yarn typecheck
```

**Never start a dev server automatically.** `yarn build` (+ `yarn serve`) only.

## Boundaries

- `../macleanup` is **READ-ONLY** from this repo. Source content from it; never edit it.
- Global rules are **pointed at, never copied**: `~/.claude/rules/docs-sites.md` (the governing law),
  `~/.claude/rules/manual-tasks.md`, `~/.claude/rules/public-repo-governance.md`.
- Skills: `aoneahsan-cccs-docusaurus`, `-markdown`, `-documentation`, `-copywriting`.

## Version drift

The site documents **macleanup 4.6.1**. When the package publishes a new version, update
`PKG_VERSION` in `docusaurus.config.ts`, the version line in `docs/intro.md`, `docs/changelog.md`, and
`static/llms.txt` in the same change.
