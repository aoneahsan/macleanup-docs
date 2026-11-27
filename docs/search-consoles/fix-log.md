# Search-console fix log — macleanup-docs

Fixed path in every repo (`aoneahsan-cccs-search-issue-remediation`). Newest first. Not published: excluded in
`docusaurus.config.ts`. The audit session retests with the commands under **Retest**.

## macleanup-docs#1 — URL-level indexing + AEO fix list · 2026-11-27 · commit: see `git log -- docs/search-consoles/fix-log.md`

Status: trailing-slash box and boxes 3, 4 and 6 live-verified, google-pending (IndexNow 200); 1 and 5 Pending; 2 answered by
owner law. `yarn build` (zero warnings) ends with `yarn seo:contract` (`plugins/seo-contract.mts`), which failed on a
planted noindex on `/intro/` and then passed. Rendered `/faq/` at 1440.

| Box | SA | What was wrong (evidence) | Root fix (file) | Contract | Live proof |
|---|---|---|---|---|---|
| Trailing-slash 404 (`/docs/` and every `/x/`) | P26/P31 | `trailingSlash: false` wrote `x.html`; `/docs` itself was never a page here (docs live at the root) | `docusaurus.config.ts` `trailingSlash: true`; `/docs` → `/intro/` (`plugins/seo-redirects.mts`); `plugins/site-pages.ts` follows the `<route>/index.html` layout (compare-link check, `/search/`), and sitemap dates compare routes slashless (`routeKey`) | fails on any `x.html` page, unslashed canonical or sitemap URL | see Retest |
| 3 · 16 tag pages | P32 | thin lists of pages the sidebar already groups | `tags:` → `topics:` in 43 docs (the `/sitemap` chips read it, `topicsOf`); every `/tags/*` redirects to its matching page or `/sitemap` (`plugins/seo-redirects.mts`, new dependency `@docusaurus/plugin-client-redirects`). Not noindexed | each redirect and target checked | `/tags/macos/` → refresh `/sitemap/` |
| 6 · AEO: FAQ without FAQPage | P30 | `/faq` shows 23 questions, no FAQPage | `plugins/faq-schema.ts` reads every `<h3>` question and its answer off the BUILT `/faq/` and writes FAQPage into its head (shared with clearhire-docs), so the markup is the page word for word | build fails if `/faq/` shows no question | see Retest |
| 4 · feeds / llms.txt / sitemap | P33 | machine files; no `.md` mirrors on this host | none needed | — | — |
| 2 · white-label pages | P32 | audit asked for noindex | overruled (owner, 2026-11-27: public pages are never noindexed) | contract: no noindex | — |

### Pending

| Box | Why not done | Who | Next action |
|---|---|---|---|
| 1 · 13 compare pages | they carry dated specifics from `src/data/competitors.json`, but the refresh window (14 days) has passed | `/comparison-hub` refresh | re-read each competitor's own pages |
| 5 · 14 other pages | quality and authority signal | content pass | a unique angle per page; two inbound links each |
| Google re-crawl and Validate fix | console | daily audit | Validate fix |

### Retest

```bash
H=https://macleanup-docs.aoneahsan.com
for p in /docs /faq /faq/ /tags/macos/; do printf '%s %s\n' "$p" "$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' "$H$p")"; done
curl -s "$H/faq/" | grep -o '"@type":"FAQPage"'
curl -s "$H/sitemap.xml" | grep -oE '<loc>[^<]*</loc>' | grep -vc '/</loc>'   # 0
```
