# macleanup-docs

Public documentation site for **[macleanup](https://github.com/aoneahsan/macleanup)** — a
safe-by-default macOS cleanup and maintenance CLI.

**Live site:** [macleanup-docs.aoneahsan.com](https://macleanup-docs.aoneahsan.com)

Built with [Docusaurus](https://docusaurus.io), deployed to **GitHub Pages** on every push to `main`.

## Contents

- [Local development](#local-development)
- [Project structure](#project-structure)
- [Deployment](#deployment)
- [Environment variables](#environment-variables)
- [Contributing](#contributing)
- [Licence](#licence)

<a id="local-development"></a>
## 🚀 Local development&nbsp;[#](#local-development)

Requires Node 18+ and Yarn 4 (via Corepack).

```bash
corepack enable
yarn install
yarn start      # dev server on http://localhost:5964
yarn build      # production build into build/
yarn serve      # serve the production build on http://localhost:5965
yarn typecheck  # tsc --noEmit
```

`yarn build` is also the link checker: `onBrokenLinks` and `onBrokenAnchors` are both set to
`throw`, so a dead internal link or fragment fails the build rather than shipping.

<a id="project-structure"></a>
## 📁 Project structure&nbsp;[#](#project-structure)

```
docs/                     Documentation content (Markdown)
├── intro.md
├── before-you-run/       What gets deleted · dry-run · safety model
├── getting-started/      Installation · first run
├── reference/            CLI · sections · profiles · configuration · reports and logs
├── recipes.md
├── troubleshooting.md · recovery.md · faq.md · changelog.md · about-the-author.md
└── MANUAL-TASKS.md       Internal — EXCLUDED from the build, never published

src/
├── css/custom.css        Infima theme overrides (brand palette from the macleanup logo)
└── pages/index.tsx       Landing page

static/
├── CNAME                 macleanup-docs.aoneahsan.com
├── robots.txt            Search + AI crawler policy
├── llms.txt              Structured index for language models
├── humans.txt · .well-known/security.txt
└── img/                  logo.svg · favicon.svg · social-card.svg

docusaurus.config.ts      Site config, JSON-LD, env-gated analytics
sidebars.ts               Sidebar layout
```

`docs/MANUAL-TASKS.md` is the fixed path for internal owner-only tasks and **must never become a
public page**. It is listed in the docs plugin's `exclude` array. After any build, verify:

```bash
find build -iname '*MANUAL*'    # must return nothing
```

<a id="deployment"></a>
## 🌐 Deployment&nbsp;[#](#deployment)

**GitHub Pages only.** This site has no Firebase project and no `firebase.json`.

`.github/workflows/deploy-pages.yml` builds and deploys on every push to `main`, using the official
Pages flow (`upload-pages-artifact` + `deploy-pages`) — there is no `gh-pages` branch to maintain.
`static/CNAME` pins the custom domain and Docusaurus copies it verbatim into `build/`, so it ships
inside the artifact automatically.

Owner-only setup steps (DNS, Pages custom domain, HTTPS) are tracked in
[`docs/MANUAL-TASKS.md`](docs/MANUAL-TASKS.md).

<a id="environment-variables"></a>
## 🔑 Environment variables&nbsp;[#](#environment-variables)

🔴 **This repo is public. It contains no secrets and must never contain one.** Only
[`.env.example`](.env.example) is committed, with placeholder values.

| Variable | Required? | Purpose |
|---|---|---|
| `GA_MEASUREMENT_ID` | Optional | Google Analytics 4. Absent ⇒ no analytics at all |
| `CLARITY_PROJECT_ID` | Optional | Microsoft Clarity. Absent ⇒ no session recording |

Every provider is gated on its own key, so an absent key skips it entirely — no script tag, no init,
no error. **`yarn build` succeeds with no environment configured.** Real values live in the repo's
GitHub Actions secrets, never in a committed file.

<a id="contributing"></a>
## 🤝 Contributing&nbsp;[#](#contributing)

Corrections and improvements are welcome. Every page has an **Edit this page** link at the bottom,
or open an issue at [macleanup-docs/issues](https://github.com/aoneahsan/macleanup-docs/issues).

Documentation for a tool that deletes files has one job above all others: let a reader know exactly
what will be removed *before* they run it. A page that fails at that is a bug worth reporting.

Issues about the **tool itself** belong on
[aoneahsan/macleanup](https://github.com/aoneahsan/macleanup/issues).

<a id="licence"></a>
## 📜 Licence&nbsp;[#](#licence)

MIT — © [Ahsan Mahmood](https://aoneahsan.com). macleanup itself is
[MIT licensed](https://github.com/aoneahsan/macleanup/blob/main/LICENSE.md) and comes with no
warranty.
