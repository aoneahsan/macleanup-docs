---
title: Release history
description: What changed in each macleanup release — the safety fixes, the two-condition rule, age-aware cache pruning, and the sections added along the way.
tags: [changelog, releases, versions, history]
sidebar_position: 6
sidebar_label: Release history
keywords: [macleanup changelog, macleanup versions, macleanup 4.6.1, macleanup 4.3.1 safety fix]
---

# Release history

**Highlights of each release, newest first.** The authoritative, complete
changelog lives with the source:
[CHANGELOG.md](https://github.com/aoneahsan/macleanup/blob/main/CHANGELOG.md).
Versions follow [semantic versioning](https://semver.org).

This documentation describes **4.6.1**, the current published version.

```bash
mac-cleanup --version        # what you have
mac-cleanup --check-update   # what is published
```

## 4.6.1 — patch

- **A dry run now estimates the space it would free.** Previously `--dry-run`
  reported `freed_kb: 0`: it printed per-folder "would clear …" notes but never
  tallied a total, so previews showed `0 B`. The cleanup helpers and section 5
  now measure what they would delete and report the estimate.
- **`--json` lists only this run's report files.** It previously included every
  file in the reports directory, leftovers from earlier runs the same day
  included; it now filters to files written during the current run.

## 4.6.0 — GUI privileged operations and UX

- **One admin prompt per run for the desktop GUI.** When launched by the
  companion macOS app, the CLI routes `sudo` through a graphical askpass, so
  privileged sections (6, 7, 9, 11, 13, 14, 20) actually run from the GUI and
  ask for the password once. They previously skipped silently, having no
  terminal to prompt on. **Terminal users are unaffected.**
- **`--dry-run` no longer attempts privilege elevation** — a preview never
  prompts for a password; only a real run does.

## 4.5.1 — patch

- **`--flag=value` is accepted**, alongside `--flag value`. A token like
  `--cache-age-days=30` was previously rejected with exit code 2.
- **Clearer unknown-option errors** — the offending option plus a one-line
  hint, instead of dumping the whole help text.

## 4.5.0 — safety, correctness, features

A broad audit-driven release, with two behaviour changes that matter to
unattended users.

- **Ctrl-C now actually aborts.** The combined exit/interrupt trap returned
  without exiting, so on `SIGINT`/`SIGTERM` bash ran cleanup and then
  **resumed** the interrupted operation — including a destructive one.
- **`--i-understand-deep` introduced.** The deep sections (6, 11, 14, 21, 24)
  now need this flag *in addition to* `--yes` to run unattended. `--yes` alone
  no longer enables them, and `--all` never does.
- **Section 13 removed from the `--all` safe batch.** Running `sudo periodic`
  unattended is privileged system maintenance, not cache cleanup.
- **Section 27 added** — QuickLook and font caches. Menu / `--only` only.
- **`--json`** one-line run summary for scripting and CI.
- **`--exclude-path PATH`** — repeatable, protects a tree from sections 23 and 24.
- **`--prune-history [N]`** and **`--uninstall-data`** for housekeeping.
- **Config file `~/.mac-cleanuprc`** — defaults in `key = value` form,
  overridden by any explicit CLI flag.

## 4.4.2 — safety patch

Defensive hardening of the `CRITICAL_HOME_DIRS` allowlist, making the pnpm and
corepack protections explicit so a future change cannot silently regress them.
No behaviour change for anyone whose section 23 had been working correctly.

## 4.4.1 — documentation release

A complete end-user documentation set under `docs/` in the source repository.
No script behaviour changed.

## 4.4.0 — user-facing polish

Feedback channels became first-class, with the no-telemetry promise unchanged —
nothing is ever auto-sent.

- **`--contact`** — the author contact card.
- **`--feedback`** — opens your mail client with a prefilled message.
- **`--report-issue`** (alias `--report-bug`) — collects environment info
  **entirely locally**, opens a pre-filled GitHub issue, and copies the last 50
  log lines to the clipboard. Nothing is transmitted until you click Submit.
- **`--stats`** — a read-only summary of `~/.mac-cleanup/`.

## 4.3.3 — the two-condition rule

Anything that is not pure cache must now satisfy **both** conditions before it
is deleted automatically: not in use by any installed software, **and**
untouched (atime *and* mtime) for at least `--idle-days` days, default 100.

This closed the failure mode where the first condition held but the second was
never checked — a container directory whose owning app could not be matched by
bundle id, but which something was still touching. Applies to sections 12, 21,
23 and 24.

## 4.3.2 — age-aware cache pruning

**Sections 1, 2 and 3 stopped wiping entire caches.** They previously deleted
every file regardless of recent use, which is what produced reports like "my
Gradle distribution disappeared". They now keep anything whose atime or mtime
is inside `--cache-age-days`.

## 4.3.1 — safety fix

**Anyone still on 4.3.0 should upgrade.**

- **Section 23 no longer enters toolchain or config directories.** 4.3.0 could
  match `node_modules`-shaped folders nested inside `~/.bun`, `~/.pnpm-store`,
  `~/.local/share/pnpm`, `~/.npm-packages`, `~/.volta`, `~/.asdf` and similar,
  and selecting "all" then broke globally installed tools. Fixed with a hard
  `CRITICAL_HOME_DIRS` allowlist of 35+ entries.
- **No silent `$HOME` fallback.** Section 23 now errors out and asks for
  `--scan-roots` when it cannot find a standard dev folder.
- **`brew autoremove` became opt-in** via `--brew-autoremove`.

Recovery instructions for machines affected by the 4.3.0 behaviour:
[Recovery](/recovery).

## 4.3.0

The release that introduced the section 23 bug fixed in 4.3.1. Added profiles
and several flags. **Do not run this version.**

## 4.2.0 — zero-install distribution

- **Published to npm as [`macleanup`](https://www.npmjs.com/package/macleanup)**,
  so `npx macleanup` works with no install. A dependency-free
  `bin/mac-cleanup.js` launcher validates Darwin and spawns bash. Both
  `macleanup` and `mac-cleanup` are registered as bin names.
- **Persistent logs and reports moved to `~/.mac-cleanup/{logs,reports}/`**,
  out of the repo directory that npm's cache reclaims after an `npx` run.
- A branded credits header was embedded in every log and report.
- New `--logs-dir`, `--reports-dir`, `--no-reports`,
  `--cleanup-logs-on-finish`.

## 4.1.0 — four new sections

- **Section 23** — stale build artefacts (`node_modules`, `vendor`, `dist`,
  `build`, `.next`, `.nuxt`, `.turbo`, `.vite`, `.parcel-cache`, `.svelte-kit`,
  `.astro`, `.cache`, `target`, `Pods`, `coverage`, `.nyc_output`), sorted by
  size with multi-select bulk delete.
- **Section 24** — large stale files, moved to the Trash for safety.
- **Section 25** — LaunchAgents / LaunchDaemons audit.
- **Section 26** — disk-usage report.
- New `--scan-roots`, `--list`, `--version`, `--no-color`; multi-select in
  section 21; hardened path quoting and a bash-version and macOS preflight.

## 4.0.0 — single-file rewrite

A complete rewrite into one self-contained `mac-cleanup.sh`, replacing the
previous modular split and four standalone legacy scripts. Identical feature
set, with one state, logging and prompt model — and one `safe_rm_rf`, one
`clean_dir_contents` and one `confirm` helper shared by every section.

**`--all` stopped auto-running destructive sections**, limiting itself to the
read-only and cache-only sweeps. `--threshold N` was added, along with per-day
rolling logs.

## Licence

macleanup is **MIT licensed**: use, copy, modify, merge, publish, distribute,
sublicense and sell it, provided the copyright and licence notice are kept. It
comes **as-is, with no warranty**, and the author is **not liable** for data
loss arising from its use.

## Next

- [Introduction](/intro) — what the current version does.
- [CLI reference](/reference/cli) — every flag in 4.6.1.
- [Recovery](/recovery) — the 4.3.0 incident in full.
