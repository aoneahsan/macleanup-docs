---
name: aoneahsan-cccs-white-label
description: 'White-label licence + source buyout for every sellable production product: $10,000 per platform group with a bundle ladder, $40,000/$50,000 exclusive buyout, 6 months of updates then paid renewals, paid by Wise transfer an admin confirms (NO Polar, ever); FilesHub owns price, pay page, keys and verification. Pages on site and docs, sitemaps, Terms, client-build check, 5 points. Use for /white-label, finalize and complete runs, licence, resell or buyout work.'
metadata:
  author: aoneahsan
  source: 'Owner request 2026-11-13. Seed: the ZTools /white-label system (ztools-root/ztools, src/lib/whitelabel/).'
---

# White-label licensing + source buyout

🔴 **Floor:** `aoneahsan-cccs-custom-made`. Law and his words: `~/.claude/rules-detail/white-label.md`.

## What a project owes

| # | Deliverable | Where |
|---|---|---|
| 1 | A licence offer for the product in FilesHub (groups it really ships, prices, buyout, renewals) | FilesHub `license_offers`, seeded or set through the Management API |
| 2 | Click-dummy pages first, in this product's own design language | the project's click dummy |
| 3 | The page set (`references/pages.md`) reading the FilesHub catalogue | marketing site / web app |
| 4 | Terms + Privacy sections and the licence-terms page (`references/legal-terms.md`) | marketing site |
| 5 | A "White-label & licensing" docs section | docs site |
| 6 | Every new public URL in both sitemaps, `/sitemap`, `llms.txt`, `pricing.md`, the feed | both sites |
| 7 | The dormant client-build licence check (`references/deployed-build-check.md`) | the product's app code |
| 8 | Status row | `projects-finalization-record/production/white-label-status.json` |

## Which products

| Project | What it sells |
|---|---|
| Single-category product (web app, extension, mobile app, package, desktop app) | Its groups + $40,000 buyout |
| Combined category (Native Update SaaS + package, Empora WP plugin + SaaS, macleanup desktop + CLI) | Its groups + **$50,000** buyout |
| FilesHub, SNGDC, LinkedIn Posts Automation, aoneahsan-portfolio, zaions-portfolio, zaions-engine | **Nothing, by the owner's words (2026-11-13).** Refuse the work |
| Rebuild kit with no app yet (learnquest, tilawah) | A module line in its rebuild plan only |
| Rent Party | Sold, and the game it is inspired by is never named on any surface |
| Source public under an open-source licence (Strata Storage, Capacitor Auth Manager, Linux Cleanup, WindowSweep, MacLeanup CLI; owner 2026-11-13) | **Managed white-label only**: hosting, branding, deployment, updates and the name/logo right; no "no source" claim, **no buyout** of public code (`buyout_enabled: false`). A private part (MacLeanup desktop) may still be bought out, covering only the private repos. Check `gh repo view --json visibility,licenseInfo` first, every product |

Groups offered = the groups the product **ships today** (proved from its repos and live stores). A held or
unbuilt group (an extension not yet built, iOS without an account) is not offered. Mobile = Android + iOS
together; offer it when Android ships, and say iOS is delivered on request in the Terms.

## The money rules

1. FilesHub computes every price. Pages show what `catalog` and `quote` return and never compute or retype a number
   (`references/pricing.md` is the reference math only).
2. 🔴 **NO POLAR for white-label, ever** (owner, 2026-11-14). Pay = full-page redirect to the `checkout_url` FilesHub
   returns (`window.location.assign`): FilesHub's own pay page with our Wise details. Cancel + pay on one row,
   the consent line under the button: *"By continuing, you agree to our Terms of Service and Privacy Policy."*
3. No refund wording, warnings or "before you pay" copy on any page except the Terms and Privacy Policy (`payment-copy.md`).
4. Access is granted only when an admin confirms the transfer in FilesHub, never by the redirect or the thank-you page.
   The thank-you page reads `orders/{id}` and shows `awaiting_payment`, `payment_submitted`, `payment_rejected` calmly.
5. `sales_state` drives the page: `on_sale` → checkout; `quote_only` (the owner chose it) → the
   request form only; `acquired` → "This product has been acquired", no sale, verifier still works.
6. Prove the flow locally: order → pay page → details sent → Nova approve → licence issued; never a real transfer.

## FilesHub contract

`references/fileshub-licensing-api.md`: catalogue, quote, checkout, renewal, inquiry, verify by key or domain,
envelopes, errors and limits. Agents set offers through the Management API, never with SQL.

## Order of work

🔴 Sync every repo first (`git fetch o`, merge if behind, a dirty checkout stops). Then:
1. Confirm the project is in scope and its category (scorecard row). List the groups it ships, with evidence.
2. Check the offer in FilesHub (`GET …/catalog`). Missing → seed it through the Management API.
3. Never touch Polar. `checkout_available: false` (no Wise method entered yet) → the request form, cleanly.
4. Dummy pages (`aoneahsan-cccs-click-dummy`), designed from this product's tokens, objects and words.
5. Build the pages, Terms sections, docs section, sitemap/llms/pricing entries, i18n keys, analytics events.
6. Wire the dormant client-build check.
7. Gates, render at 1440 and 390 against FilesHub (local or live), commit, push, deploy, live proof, IndexNow, status row.

## Done means

`references/verification.md`: served HTML shows the prices FilesHub returns; web + mobile quotes $18,000 on a two-group
product; Pay opens FilesHub's pay page for a local order; `verify` answers for a test key; both sitemaps and `llms.txt` list
every new URL with a true `lastmod`; Terms carry the licence and NO REFUNDS sections; swap, read-aloud and looking tests
run, and what still reads as generated is named in the report.

## Common mistakes

| Mistake | Instead |
|---|---|
| Copying ZTools' pages and swapping the name | Shared contract only; each product's pages are designed in its own language |
| Price constants in the frontend | Read `catalog`; show a quote-only state when it fails |
| Offering a platform the product does not ship | Only proven groups; the rest stays out of the configurator |
| "Lifetime updates" / "full ownership" on a licence page | Licence = hosted, branded, 6 months of updates, no code |
| A licence table in the project's own Supabase | FilesHub only; the project keeps no licence data |
| Polling the checkout status | One read on the thank-you page load; the email carries the licence |

## Related skills

`-custom-made` · `-click-dummy` · `-frontend-design` · `-plans-entitlements` · `-copywriting` ·
`-story-humanize` · `-seo-content-writing` · `-react-seo` · `-react-aeo` · `-postbuild-seo-html` · `-sitemap` · `-feed` ·
`-docusaurus` · `-i18n` · `-analytics` · `-fileshub` · `-fileshub-management-api` · `-project-completion`
