# Client-build licence check

Every product carries a **dormant** check that wakes only in a white-label build. Our own deployment never runs it.

## Contract

- Env: `VITE_WHITE_LABEL_KEY` (Vite), `WHITE_LABEL_KEY` (Docusaurus/Node), `--dart-define=WHITE_LABEL_KEY` (Flutter),
  `WXT_WHITE_LABEL_KEY` (WXT), the Tauri equivalent in its config. Empty → the check is not compiled in or returns at once.
- On start and on resume (never on a timer, `realtime-not-polling`): one call
  `GET https://fileshub.zaions.com/api/licensing/v1/licenses/verify?key={KEY}&host={location.host}`.
- `valid` + `host_authorized` → nothing visible.
- `revoked`, `not_found`, or `host_authorized: false` → a full-screen "This licence is not active" view in the
  product's own design language, with a link to `/verify-license` on our site. No data is deleted.
- Network failure, timeout (5 s) or 5xx → fail open; try again on the next start.
- The result is kept only in memory.

## Files a client deployment serves

- `sidecar_path` from the catalogue, i.e. `/.well-known/{lowercase key prefix}-white-label-license.json`:
  `{"$schema": "{product}-white-label-license", "product": "…", "publicKey": "…", "client": "…", "domain": "…",
  "verifyUrl": "https://<our site>/verify-license?key=…", "issuedAt": "…"}`
- `/.well-known/{lowercase key prefix}-white-label-license.pdf`: the public certificate from `GET /licenses/{key}/certificate.pdf`.

We deploy client builds ourselves, so these files are added by the deployment, not by the buyer.

## Placement

A Vite app: `src/services/licensing/licenceCheck.ts` (the check) + a guard component, `WhiteLabelGuard.tsx`, at the
app root above the router. Keep it under 150 lines; no new dependency.

🔴 Never put two files whose names differ only in case in one folder (`whiteLabelGuard.ts` beside
`WhiteLabelGuard.tsx`). Windows and macOS file systems ignore case, so an import of `…/WhiteLabelGuard` resolves to
the `.ts` file: `tsc -b` fails with TS1261 and TS2305, and the Vite build breaks. It happened in clearhire, habitforge
and native-update/website on the Windows build machine, 2026-11-13 (fixed by renaming the check to `licenceCheck.ts`).
A project whose `whiteLabelGuard.ts` sits in a different folder from its component builds fine and may keep it.
