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
