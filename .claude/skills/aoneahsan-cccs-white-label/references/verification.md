# Verification

## FilesHub (once, and after any licensing change)

1. `php artisan test --filter=Licens` green; the pricing test seen failing on a planted defect.
2. Local `php artisan serve`: `GET …/catalog` for a seeded product; `POST …/quote` web + mobile → `total_usd: 18000`.
3. Manual payment (NO Polar, ever): enter a test Wise method in local Nova → checkout returns the pay page → send
   the details (reference, amount, date, a small PDF proof) → order `payment_submitted`, admin + buyer email queued →
   Nova "Approve manual payment" → licence `pending_setup`, order `paid`, certificate PDF stored; a second approve
   issues nothing; "Reject payment" emails the buyer and keeps the order open.
4. `verify?key=` → `pending_setup`; Nova "Activate" → `valid`; "Revoke" → `revoked`.
5. Renewal checkout → `updates_until` moves by the bought months from the later of today and the current end.
6. Buyout → offer `acquired`; `catalog` says so; `quote` answers 409.
7. Same webhook delivered twice → one licence.

## Each product

1. `catalog` read at build time and on load; the configurator's total equals FilesHub's `quote` for three selections.
2. Pay opens FilesHub's pay page (Wise details) in the same tab; Cancel returns to the pricing page with the
   selection kept in the URL. No page names Polar for white-label.
3. FilesHub unreachable → the quote form shows, no stale price shown as live.
4. Render 1440 and 390, no console errors, no horizontal scroll, 44 px targets, keyboard path through the configurator.
5. Built HTML of each indexable route has the text, canonical and JSON-LD; `sitemap.xml`, `/sitemap`, `llms.txt`,
   `pricing.md` list them; docs sitemap lists the docs section.
6. Terms + Privacy carry the clauses; no refund wording on any pay surface (grep the built HTML).
7. Dormant check: a build with a test key and a wrong host shows the inactive view; an empty key leaves no network call.
8. Live: the same checks on the deployed URL, bundle hash = local build, IndexNow response recorded.
9. Custom-made tests (swap, read-aloud, looking); name what still reads as generated.
