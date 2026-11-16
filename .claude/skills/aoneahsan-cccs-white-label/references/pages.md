# Pages

The route set is fixed so every product answers the same questions. The look, layout and words are not shared:
each product's pages are drawn in its own click dummy from its own tokens, objects, screenshots and Story Bible.

## Marketing site / web app (public layout, indexable)

| Route | Job | Schema |
|---|---|---|
| `/white-label` | What a licence is for this product, who it suits, what we run for them, the two paths (licence, buyout), custom work | `Product` + `Offer` (lowest price), `FAQPage` |
| `/white-label/pricing` | Configurator: offered groups as cards, live quote from FilesHub, URL state (`?groups=web,mobile`), buyer form, pay | `Offer` per group, `AggregateOffer` |
| `/white-label/buyout` | Exclusive source purchase: what is handed over (every repo that builds the shipped groups), the 6 months, after-sale exclusivity (the product is theirs, we stop selling it), and one plain line for the 7% gross-revenue royalty for life, linking to the licence terms | `Offer` |
| `/white-label/updates` | What an update is, the included 6 months, renewal plans, renew by licence key | `Offer` per plan |
| `/white-label/license-terms` | The licence agreement in plain words (`legal-terms.md`) | `WebPage` |
| `/white-label/custom-work` | Hire us for changes or a product of their own: inquiry form | `ContactPage` |
| `/white-label/thank-you` | One order read, "check your email", next steps; `noindex`, not in the sitemap | — |
| `/verify-license` | Verify by key or domain through FilesHub | `WebPage` |

Rules:
- Prerender every indexable route with real text (`aoneahsan-cccs-postbuild-seo-html`); title, description,
  canonical (self), OG image drawn for this product (SVG master + PNG), JSON-LD matching visible content.
- Prices in HTML come from the catalogue fetched at build time. The page re-reads it on load and shows the
  live number. On failure it shows the quote form, never a stale number marked as current.
- `sales_state = acquired`: every page says the product was acquired and the configurator is gone; `/verify-license` stays.
- Consent line under every pay button, nothing else about money. NO REFUNDS lives only in the Terms and Privacy Policy.
- Internal links: footer "White-label", the pricing page ("Run it under your brand"), `/about`, the docs section.
- Analytics events (registry names): `white_label_view`, `white_label_quote`, `white_label_checkout_start`,
  `white_label_inquiry_sent`, `license_verify`.
- i18n keys under `whiteLabel.*`; formatted money through the project's locale helper, USD.

## Discovery

`sitemap.xml` + `/sitemap` page entries (true `lastmod`), `llms.txt` "White-label & licensing" block,
`pricing.md` section, one feed post announcing it, IndexNow after deploy.

## Docs site

A "White-label & licensing" section: overview, what is delivered per group, setup timeline (domain, branding,
deploy), updates and renewals, verify a licence, FAQ. Self-canonical, in the docs sitemap, linking to the
marketing pages for prices (prices are not repeated as text; the pricing page owns them).

## Per stack

| Stack | Where |
|---|---|
| React + Vite (most products) | `src/pages/WhiteLabel/*`, route constants, postbuild SEO, `src/services/licensing/` (one fetch module) |
| Docusaurus docs | `docs/white-label/*.md(x)`, sidebar category |
| WXT extension product | the marketing web app owns the pages; the extension's options "About" links to them |
| Flutter / native app product | the marketing website owns the pages (canvas is not indexable) |
| Tauri desktop | the marketing website owns the pages |
| npm package | the package website owns the pages; the README gets one "White-label & licensing" line linking there |
