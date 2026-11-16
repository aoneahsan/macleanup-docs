# FilesHub licensing API

Base `https://fileshub.zaions.com/api/licensing/v1`. **No API key**: these routes are called from public pages,
the docs site and clients' own hosts. The project is named by its FilesHub `slug`. CORS is open (`*`, GET/POST, no
credentials). Every route is throttled per IP; write routes also per project. Responses use FilesHub's envelope:
success `{"data": …}`, failure `{"error": "machine_code", "message": "…"}` (Laravel validation failures: `{"message", "errors"}`). Live since backend `2026.11.13.1` once the owner deploys it; docs `files-hub-docs/docs/api/licensing.md`.

🔴 Turnstile: when the project has a Turnstile secret in its FilesHub vault, `checkout`, `renewals` and `inquiries`
require `turnstile_token` (422 `turnstile_required` without it). The catalogue's `turnstile` block says so and gives the
public `site_key` and expected `action` (since `2026.11.13.4`): render the widget whenever `required` is true, with that
action, and send its token. Throttled per IP in three groups: read 60/min, write 10/min, verify 30/min.

## Read

### `GET /products/{slug}/catalog`

```json
{"data": {
  "product": {"slug": "clearhire", "name": "ClearHire", "key_prefix": "CLEARHIRE"},
  "sales_state": "on_sale",
  "checkout_available": true,
  "currency": "USD",
  "groups": [{"key": "web", "label": "Web app", "price_usd": 10000},
             {"key": "mobile", "label": "Android + iOS app", "price_usd": 10000}],
  "discount": {"two_groups_pct": 10, "step_pct": 5, "cap_pct": 25},
  "buyout": {"available": true, "price_usd": 40000, "combined_category": false},
  "updates": {"included_months": 6, "renewals": [{"months": 3, "price_usd": 500},
             {"months": 6, "price_usd": 700}, {"months": 12, "price_usd": 1000}]},
  "sidecar_path": "/.well-known/clearhire-white-label-license.json",
  "turnstile": {"required": true, "site_key": "0x4AAA…", "action": "licensing"},
  "updated_at": "2026-11-13T10:00:00Z"
}}
```

`sales_state`: `on_sale` · `quote_only` · `acquired`. `checkout_available` is false unless `on_sale`, the
offer's `payment_mode` is `manual` and the owner has enabled at least one payment method (Wise). `payment_channel`
is `manual` or null. 🔴 NO POLAR for white-label, ever (owner, 2026-11-14). 404 `product_not_offered` for a project without an enabled offer.
Cache: `public, max-age=300`. Prerender reads it at build time; the page re-reads it on load.

### `POST /products/{slug}/quote`

Body `{"kind": "white_label", "groups": ["web","mobile"]}` or `{"kind": "buyout"}` or
`{"kind": "renewal", "months": 6}`.

```json
{"data": {"kind": "white_label", "groups": ["web","mobile"], "subtotal_usd": 20000,
  "discount_pct": 10, "discount_usd": 2000, "total_usd": 18000, "updates_months": 6}}
```

Errors: 422 `group_not_offered`, 409 `product_acquired`.

## Write

### `POST /products/{slug}/checkout`

```json
{"kind": "white_label", "groups": ["web","mobile"],
 "buyer": {"name": "…", "email": "…", "company": "…", "domain": "app.example.com", "country": "PK"},
 "notes": "optional, ≤ 2000 chars", "turnstile_token": "…",
 "success_path": "/white-label/thank-you", "cancel_path": "/white-label/pricing"}
```

Creates a `license_orders` row (`awaiting_payment`, channel `manual`) at the server total and returns FilesHub's own
pay page as `checkout_url`: `https://fileshub.zaions.com/licensing/pay/{order_id}`, listing the owner's Wise details. Paths are joined to the
project's recorded live URL; an absolute URL is refused. → `201 {"data": {"checkout_url": "…", "order_id": "…"}}`.
Errors: 409 `checkout_unavailable` (quote-only), 409 `product_acquired`, 422 validation, and nothing else; no third-party checkout is called.

### `POST /products/{slug}/renewals`

`{"public_key": "CLEARHIRE-WL-…", "months": 6, "email": "…", "turnstile_token": "…"}` → checkout as above. The email must
match the licence's client email (answered with the same 404 when it does not, so keys cannot be probed for emails).

### `POST /products/{slug}/inquiries`

`{"kind": "custom_work" | "quote" | "buyout_call", "name", "email", "company?", "groups?": [], "message", "turnstile_token"}`
→ 201. FilesHub emails the admin addresses and an acknowledgement to the sender from the project's branded template.

### `GET /orders/{order_id}`

One read on the thank-you page: `{"data": {"status": "pending|paid|failed", "kind": "…", "public_key": "…|null"}}`.
Never polled; the email carries the licence.

## Verify

### `GET /licenses/verify?key={PUBLIC_KEY}`

```json
{"data": {"verdict": "valid", "license": {"public_key": "…", "product": "ClearHire", "client": "Acme Ltd",
  "domains": ["app.acme.com"], "type": "white_label", "groups": ["web"], "status": "active",
  "issued_at": "…", "updates_until": "…", "revoked_at": null}}}
```

`verdict`: `valid` · `pending_setup` · `revoked` · `not_found` · `invalid_format`. Public-safe fields only: no
email, phone, price or private key. Throttle 30/min/IP.

### `GET /licenses/verify?domain={host}[&product={slug}]`

FilesHub fetches `https://{host}{sidecar_path}` — `/.well-known/{lowercase key prefix}-white-label-license.json`, given as `sidecar_path` in the catalogue — (https only, public IPs only after
DNS resolution, no redirects off-host, 5 s, 32 KB), then checks the key it names. `verdict`: `authorized` ·
`domain_mismatch` · `revoked` · `not_a_valid_license` · `no_file` · `unreachable` · `rate_limited`.

### Client build check

`GET /licenses/verify?key={KEY}&host={location.host}` → `verdict` plus `host_authorized: true|false`
(`references/deployed-build-check.md`).

## Pay page and approval (FilesHub internal)

`GET /licensing/pay/{order_id}` (noindex): the order, the total, the enabled payment methods and the reference to
quote. `POST` sends the method, reference, amount, date and an optional proof (PDF/PNG/JPG/WebP, 5 MB) → status
`payment_submitted`, admin and buyer emails. Nova → Licence Orders → **Approve manual payment** (amount received ≥
total) issues the licence (`pending_setup`), extends `updates_until`, or records the buyout and sets
`sales_state = acquired`, exactly once, then the buyer and admin emails and the certificate PDF. **Reject payment**
emails the reason and lets the buyer send again (`payment_rejected`). `GET orders/{id}` returns these statuses. A
redirect or a thank-you page never grants anything.

## Management API (agents, `fh_pat_`)

`GET|PUT /api/public/v1/projects/{project}/license-offer` reads or sets the offer (groups, prices, ladder, buyout,
renewals, `sales_state` except `acquired`). `GET /api/public/v1/projects/{project}/licenses` lists licences (public
fields). Writes need `can_write_vault`. `POST /api/public/v1/projects/{project}/licenses/import` imports legacy licences (ZTools), idempotent on
`public_key`.
