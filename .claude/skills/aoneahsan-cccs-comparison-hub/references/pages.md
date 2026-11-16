# Hub pages

## Marketing site

- `/compare` is the hub; `/compare/<slug>` is each competitor. An existing live URL stays (VCP `/compare/extensions/<slug>`), and `/compare` redirects to it.
- Prerendered with unique title, description and canonical. JSON-LD only for what is visible: `CollectionPage`/`ItemList` on the hub; `Article` and `FAQPage` when real Q&A is shown. Never `Review`.
- Listed in `sitemap.xml` with `lastmod` = that entry's `lastChecked`, in the `/sitemap` page, and in the header or footer.
- All strings through the i18n catalogue; prices verbatim. Multi-locale products translate.

### What each competitor page must answer

Who it is · what it costs there and here (with the plan names and dates) · the feature rows side by side · who is better served by them · where we are ahead · how to move across, when that is real · Last checked and a link to check them yourself.

The hub must let a reader find their rival fast: grouped by product line, search or filter when there are over 15. Show the date near the top.

🔴 This is a required content list, **not a layout**. Design from the product: its tokens, type, objects and the screens beside it (`aoneahsan-cccs-custom-made`, `frontend-ui-standards.md` §20). A page that could carry another product's name fails. Table on desktop, readable at 320 px without page-level horizontal scroll.

Add to the click dummy first, then text parity and 1440/390 proof.

## Docs site

Real Docusaurus pages in the sidebar, self-canonical, in the docs sitemap. Same dated facts, different job: moving from that product to ours, step by step, using our actual docs. Third-party links carry `nofollow` too (MDX through the site's external-link component or `rel` set explicitly; check the built HTML).

A docs page for a rival with no real migration path is a short honest page: how the two differ and where to start here.

## Package projects

The marketing site holds the hub; the docs site holds the migration pages. npm README links to the hub only if the project's README pattern allows it (`aoneahsan-cccs-npm-package-readme`). Bundle sizes are measured, never estimated.

## Services variant

`/compare` with one page per case. No names, no third-party links. Proof is his own live products and dated history. A speed multiplier is shown as his own statement beside real examples, never as a measured statistic.
