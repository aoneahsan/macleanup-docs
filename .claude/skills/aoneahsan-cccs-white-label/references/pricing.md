# Pricing — reference math

FilesHub's `App\Services\Licensing\LicensePricing` is the only implementation. This file states the rule so a page,
a test or a review can check a number. Every default is an admin field on the project's `license_offers` row.

## Defaults (owner, 2026-11-13)

| Field | Default |
|---|---|
| Price per group: `web`, `mobile`, `extension`, `package`, `desktop`, `plugin` (WordPress) | $10,000 each |
| Discount for 2 groups | 10 % |
| Discount step per further group | +5 % |
| Discount cap | 25 % (5 groups) |
| Buyout, single category | $40,000 |
| Buyout, combined category | $50,000 |
| Updates included | 6 months |
| Renewals | 3 months $500 · 6 months $700 · 12 months $1,000 |

## Licence total

```text
n        = number of distinct offered groups selected (≥ 1)
pct(n)   = 0                               when n = 1
         = min(cap, two + step × (n − 2))  when n ≥ 2
subtotal = Σ price(group)
discount = round(subtotal × pct(n) / 100)          whole dollars, half up
total    = subtotal − discount
```

| Selection (default prices) | Subtotal | Discount | Total |
|---|---|---|---|
| web | $10,000 | 0 % | $10,000 |
| web + mobile | $20,000 | 10 % | **$18,000** |
| web + mobile + extension | $30,000 | 15 % | **$25,500** |
| web + mobile + extension + package | $40,000 | 20 % | $32,000 |
| all five | $50,000 | 25 % | $37,500 |

## Buyout

Flat price, no discount, every group the product ships, the source code of every repo that builds them, 6 months of
updates. Paid → the offer's `sales_state` becomes `acquired`; the product is the buyer's and we never sell it again.
Renewal plans stay available to the buyer. 🔴 Every buyout agreement also carries a perpetual royalty of 7% of the gross revenue the product earns (excluding sales tax/VAT collected), paid quarterly with a revenue statement, for as long as the product earns revenue, including after a resale (owner, 2026-11-14).
The royalty is not a FilesHub price: it is a term the pages and the agreement state.

## Renewals

`updates_until = max(today, updates_until) + months`. One renewal per checkout, for one licence key.

## Edge rules

- An unknown or unoffered group → 422 `group_not_offered`; never silently dropped.
- Duplicates count once.
- An `acquired` offer quotes nothing (409 `product_acquired`).
- Currency is USD; amounts leave FilesHub as integers in dollars (`*_usd`); the buyer transfers that USD amount by Wise.
