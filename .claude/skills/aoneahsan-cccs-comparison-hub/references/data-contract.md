# Competitor data contract

One file per project at `docs/comparison-hub/competitors.json`. The site imports it. Same fields fleet-wide.

```json
{
  "product": "AChat",
  "variant": "product",
  "lastChecked": "2026-11-07",
  "productLines": [{ "key": "embeddable-chat", "label": "Embeddable chat" }],
  "features": [{ "key": "custom-domain", "label": "Runs on your domain" }],
  "ours": {
    "prices": "read from src/features/pricing, never retyped",
    "features": { "custom-domain": { "status": "yes", "evidence": "src/routes/embed.$chatId.tsx" } }
  },
  "competitors": [
    {
      "slug": "example",
      "name": "Example",
      "line": "embeddable-chat",
      "officialUrl": "https://example.com",
      "whatItIs": "One plain line, in our words",
      "lastChecked": "2026-11-07",
      "prices": [
        {
          "plan": "Starter",
          "amount": 29,
          "currency": "USD",
          "period": "month",
          "note": "billed yearly",
          "source": "https://example.com/pricing",
          "checkedOn": "2026-11-07"
        }
      ],
      "features": {
        "custom-domain": { "status": "yes", "source": "https://example.com/docs/domains", "checkedOn": "2026-11-07" }
      },
      "strongerThere": "Choose Example if ...",
      "strongerHere": "Choose Product if ...",
      "changeLog": [{ "on": "2026-11-07", "what": "First checked" }]
    }
  ]
}
```

## Rules

- `status`: `yes`, `no`, `partial` or `not-stated`. `no` needs a source that says so. `not-stated` needs no source and renders as "Not stated on the pages we checked".
- A price with hidden terms stays out: use `"amount": null` with `"note": "Quote only"` and its source.
- A top-level `lastChecked` is the oldest competitor date, never the newest.
- Services variant: `competitors` becomes `cases` (`slug`, `name`, `whatYouGet`, `whereTheyAreRight`, `whereIAmDifferent`, `evidence` of his own projects), no URLs, no prices unless sourced from his own pricing.

## Choosing who is in

Who a buyer really compares: official category leaders, the names ranking for "<job> software", direct rivals named in `docs/growth/competitors.md`, and a free or open-source option. Record why each is in only if asked. At least 10 per product line.

## Contract test (pre-approved class)

One Vitest file parsing the JSON. Fails on: under 10 per line, a price or `yes/no/partial` without `source` and `checkedOn`, an invalid date, a duplicate slug, a rendered third-party link without `nofollow`. Prove it fails on a planted defect. Age is not tested here: a stale table must not block an urgent fix.

🔴 An unknown slug must answer a real HTTP 404 on the host, so no `/compare/*` rewrite covers prerendered rival pages. After a docs publish, confirm GitHub built it (`gh api -X POST repos/<r>/pages/builds` if not). Read the data once more before shipping: a claim comparing rivals with each other ("largest", "first") must be provable from this file.
