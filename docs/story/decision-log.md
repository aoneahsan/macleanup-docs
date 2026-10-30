# Story decisions — macleanup

## 2026-10-23 — Discover draft

Evidence: published package 4.7.0, existing public docs, script behavior and the voice registry. The proposed Bible and fingerprint were inferred from those sources.

## 2026-10-26 — GATE 1 approved

The owner replied: “Approve the draft as written.” This approves the audience, 70/25/5 emotional palette and provisional fingerprint based on existing product copy. Chosen calibration samples remain optional. The owner separately replied “Approve both registry updates,” authorizing this Codex session to edit `~/.claude/story-system/registry/` and `~/.claude/palettes/project-palettes.json`. The voice entry and website primaryHue 169 are now registered.

## 2026-10-26 — GATE 2 approved

The owner replied: “Approve the content map.” The mapped CLI, README, documentation and static marketing surfaces may now be drafted and reviewed. Publication still requires GATE 4; the marketing UI separately follows the click-dummy approval gates.

## 2026-10-26 — Package and docs review; GATE 4 requested

The 4.7.1 release copy names the section 25 path-with-spaces fix and retains the 4.7.0 safety limits. The README and docs now distinguish a dry-run that deletes nothing from one that writes no files: logs and reports may still be written. Recovery copy distinguishes regenerable caches from potentially unique logs and temp files. The docs production build and typecheck pass; the introduction renders its safety warning at desktop and 390 px mobile widths without horizontal overflow. Internal story, tracker and manual-task files are excluded from the build. No invented savings or benchmark claims were added. Product and docs publication await the owner's GATE 4 approval; the marketing site will have its own later approval.

## 2026-10-26 — GATE 4 approved for package and docs

The owner replied: “approve all, finish all remaining work now.” This approves publication of the reviewed 4.7.1 package and docs, including the section 25 two-flag batch removal guard. The package commit `7e02218` was pushed to public `main`; npm accepted the 4.7.1 publication and is processing it. The same reply approves continuation through the marketing click-dummy and deployment gates.

## 2026-10-29 — One name: macleanup

The owner wrote: “please get everything fully on 1 name please, macleanup”, “that is the name, brand, cli command, npx command, and everything related to macleanup” and “make sure it's "macleanup" everywhere please”. The glossary now has one row: `macleanup`, always lowercase, for the product, brand, package, command, script and data folder. The separate command row is removed. macleanup 5.0.0 ships the rename; entries in the changelog before 5.0.0 keep their historical wording, and the upgrading page names the old forms only to explain the migration. The “not a GUI app” limit stays until the desktop app ships, when its own surface rows are added.

## 2026-10-30 — Desktop app, team voice, analytics, backups

- **Desktop app approved and shipped.** The owner approved the desktop dummy (“approve desktop app click-dummy, please plan and get it all developed as best as possible now 100%”); macleanup 5.2.0 ships the app beside the CLI. The glossary's desktop-app surface is live.
- **The product speaks as the macleanup team.** Docs, CLI output, logs and reports name “the macleanup team” with the website, docs and issues page; personal phone, address and profile links are removed. The MIT copyright line keeps the copyright holder's name, because that is a legal fact, not a voice.
- **Analytics (owner's choice of option: “Follow the fleet rule”).** The desktop app and website follow the fleet analytics standard: on by default, told once in the legal bar, no opt-out, never a path, file name or email. The command line stays free of telemetry. Until the analytics IDs exist, nothing is collected, and every surface keeps saying so; the privacy text, the bar line and the “no analytics” claims change in the same release that turns analytics on.
- **The CLI is split into modules** (owner: “Split the CLI too”). Copy says “plain bash in short files” where it said “a single script” or “two readable files”.
- **Backups (owner: “Platform backups only”).** Account data sits in the database host's daily backups for up to 7 days; a deleted account is never restored from them.
