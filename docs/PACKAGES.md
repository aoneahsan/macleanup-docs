# Packages — macleanup docs

Last Updated: 2026-11-02

Yarn 4, Node 24 (build sets `NODE_OPTIONS=--no-experimental-webstorage`: Docusaurus's SSG sandbox copies every
Node global, and Node 26's disabled `localStorage` getter otherwise prints an ExperimentalWarning; re-check when
Docusaurus or the `eval` package stops copying globals, then drop the flag). Upgraded with
`npx -y npm-check-updates -u`, latest stable. `typescript` stays `~6.0.3` (the fleet pin: TypeScript 7 is outside
typescript-eslint's peer range). This file is excluded from the published site.

| Package | Range | Kind |
|---|---|---|
| `@docusaurus/core` | ^3.10.2 | runtime |
| `@docusaurus/faster` | ^3.10.2 | runtime |
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
| `@docusaurus/tsconfig` | ^3.10.2 | dev |
| `@docusaurus/types` | ^3.10.2 | dev |
| `@types/react` | ^19 | dev |
| `github-slugger` | ^2.0.0 | dev |
| `typescript` | ~6.0.3 | dev |

2026-11-02: `github-slugger` 1 → 2 (ships its own types; the local declaration was removed) and
`@easyops-cn/docusaurus-search-local` 0.55.3 (adds a search icon to the navbar field). Yarn reports unmet peers
inside Docusaurus's own Algolia and bundler packages; this site declares neither and uses local search.
