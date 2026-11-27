# Packages — macleanup docs

Last Updated: 2026-11-16

Yarn 4, Node 26.13.1 LTS (`.nvmrc`, `engines.node >=26.13.1`; build sets `NODE_OPTIONS=--no-experimental-webstorage`: Docusaurus's SSG sandbox copies every
Node global, and Node 26's disabled `localStorage` getter otherwise prints an ExperimentalWarning; re-check when
Docusaurus or the `eval` package stops copying globals, then drop the flag). Upgraded with
`npx -y npm-check-updates -u`, latest stable. `typescript` is `~7.0.2`: this site has no typescript-eslint or Capacitor, so the fleet's 6.0 pin does not apply. This file is excluded from the published site.

| Package | Range | Kind |
|---|---|---|
| `@docusaurus/core` | ^3.10.2 | runtime |
| `@docusaurus/faster` | ^3.10.2 | runtime |
| `@docusaurus/plugin-client-redirects` | ^3.10.2 | runtime — old `/tags/*` addresses redirect to real pages (macleanup-docs#1, 2026-11-27) |
| `@docusaurus/preset-classic` | ^3.10.2 | runtime |
| `@docusaurus/theme-common` | ^3.10.2 | runtime |
| `@docusaurus/theme-mermaid` | ^3.10.2 | runtime |
| `@easyops-cn/docusaurus-search-local` | ^0.55.3 | runtime |
| `@mdx-js/react` | ^3.1.1 | runtime |
| `clsx` | ^2.1.1 | runtime |
| `prism-react-renderer` | ^2.4.1 | runtime |
| `react` | ^19.3.1 | runtime |
| `react-dom` | ^19.3.1 | runtime |
| `strata-storage` | ^3.1.4 | runtime |
| `@docusaurus/module-type-aliases` | ^3.10.2 | dev |
| `@docusaurus/plugin-content-docs` | ^3.10.2 | dev |
| `@docusaurus/types` | ^3.10.2 | dev |
| `@types/react` | ^19 | dev |
| `github-slugger` | ^2.0.0 | dev |
| `typescript` | ~7.0.2 | dev |

2026-11-02: `github-slugger` 1 → 2 (ships its own types; the local declaration was removed) and
`@easyops-cn/docusaurus-search-local` 0.55.3 (adds a search icon to the navbar field). Yarn reports unmet peers
inside Docusaurus's own Algolia and bundler packages; this site declares neither and uses local search.

2026-11-16: Node 24 → 26.13.1 (`.nvmrc`, `engines.node` was `>=22.0.0`). TypeScript 6.0 → 7.0.2. TypeScript 7 removed
`baseUrl`, which `@docusaurus/tsconfig` still sets (TS5102), so the package and the `extends` are gone; `tsconfig.json`
carries the same options without `baseUrl` or `ignoreDeprecations` (relative `paths` still resolve). A planted type
error in `sidebars.ts` fails `yarn typecheck`; the build is clean.
