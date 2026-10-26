---
title: Safety model
description: The six design rules that keep macleanup from deleting more than you intended — the two-condition rule, the deep-section gate, sudo handling, and where the guarantees stop.
tags: [safety, design, sudo, confirmation, macos]
sidebar_position: 3
sidebar_label: Safety model
keywords: [macleanup safety, is macleanup safe, i-understand-deep, two condition rule]
---

# Safety model

**macleanup is safe by default and it is still a tool that runs `rm -rf` and
`sudo` on your machine.** Both halves of that sentence are true and neither
cancels the other. This page states exactly what the design guarantees, and
where the guarantee ends and your judgement begins.

## The six rules

### 1. Destructive operations confirm before running

Every destructive section prompts `[y/N]` before it acts. `--yes` auto-confirms
those prompts; the typed-`yes` gate on section 14 is independent and is not
affected by `--yes`.

### 2. `--dry-run` never deletes anything

Every destructive call routes through a helper that no-ops in dry mode. See
[Preview with `--dry-run`](/before-you-run/dry-run).

### 3. App data and apps are moved to the Trash

Sections 12 and 21 use Finder to move orphaned data and applications to the
Trash, so they stay recoverable until it is emptied. Section 24 does the same
for large stale files. If Finder fails, the affected item stays in place.

### 4. Sudo sections are skipped, never silently bypassed

Sections needing root ask for `sudo`. If sudo is unavailable — or you passed
`--no-sudo` — the section is **skipped and reported**, never half-run.
Sudo-requiring sections: 6, 7 (system logs), 9 (system updates), 11, 13, 14,
20, 25 (system LaunchAgents), and 27 (only the optional system font-cache
clear).

### 5. The deepest sections never run unattended by accident

Six sections are gated: **6** (system caches as root), **10** (Empty Trash), **11** (Time Machine
snapshots), **14** (`/private/var/folders` wipe), **21** (app uninstall) and
**24** (large stale files → Trash).

- They are **never** part of `--all` — not even `--all --yes`.
- To run one unattended via `--only` or `--profile`, you need
  **`--i-understand-deep` in addition to `--yes`**. `--yes` alone is refused,
  with a warning, and the section is skipped.
- `--dry-run` previews are always permitted: they delete nothing, although
  normal logs and reports may be written to disk.
- Section 14 additionally requires a typed `yes`.

The gate exists so that a one-character typo in a section number cannot
trigger an irreversible operation.

### 6. Every run is logged

A dated log lands in `~/.mac-cleanup/logs/`, and the sections that produce
lists write dated `.txt` reports to `~/.mac-cleanup/reports/`. Both live in
your home directory, outside any npx cache, and survive every invocation. See
[Reports and logs](/reference/reports-and-logs).

## The two-condition rule {#the-two-condition-rule}

Introduced in 4.3.3, this governs candidate selection in four sections that
can remove non-cache data: **12** (orphaned app data), **21** (idle apps), **23**
(stale build artefacts) and **24** (large unused files).

An item qualifies only when **both** hold:

1. **It is not in use by any installed software or tool.** The per-section
   detection decides this — no matching installed app for orphan data, no
   last-used signal and not currently running for an idle app.
2. **It meets that section's age threshold** — `--idle-days` for 12 and 23,
   `--threshold` for 21, or `--large-file-days` for 24. All default to 100
   days. Sections 12, 23 and 24 check `atime` and `mtime`; section 21 uses
   available app last-use signals and skips apps without a usable signal.

Condition 2 is what makes the rule work in practice. A `node_modules` your
editor reads for autocomplete keeps a recent access time and survives. A Gradle
distribution you invoke monthly survives. Lowering an age threshold widens the
candidate list; review it before confirming a deletion.

:::note[Sections 16 and 17 are different]
For iOS backups (16) and Xcode archives (17), `--idle-days` only **highlights**
idle items with an `[idle ≥Nd]` marker. There is no automatic delete gate —
both are interactive-only and will delete any item you confirm, recent or not.
:::

## Idle-app detection, and why it under-flags

Section 21 decides an app is idle using five signals in priority order:
Spotlight `kMDItemLastUsedDate`, Saved Application State mtime, Container
mtime, Preferences plist mtime, and Spotlight `kMDItemUseCount`.

**An app with no usable signal is skipped.** The tool deliberately
under-flags: missing a stale app is cheap, uninstalling a needed one is not.

## The section 23 allowlist

`CRITICAL_HOME_DIRS` is a hard refusal list. Section 23 will not enter
toolchain-manager directories such as `~/.bun`, `~/.pnpm-store`,
`~/.local/share/pnpm`, `~/.npm-packages` and `~/.volta`, regardless of how old
their contents look.

Section 23 also **refuses to scan without roots**. If none of the standard dev
folders exist (`~/Projects`, `~/Code`, `~/Developer`, `~/dev`, `~/repos`,
`~/work`, `~/Documents`, `~/Desktop`, `~/Downloads`) and you passed no
`--scan-roots`, it errors out and asks for one rather than falling back to
scanning your entire home directory.

Both rails exist because v4.3.0 lacked them and broke people's global tooling.
That incident, and how to recover from it, is documented in full in
[Recovery](/recovery). It is the strongest argument on this site for running
`--dry-run` first.

Add your own protected trees with the repeatable `--exclude-path`:

```bash
npx macleanup --only 23 \
  --exclude-path "$HOME/Code/active-project" \
  --exclude-path "$HOME/Code/client-work" --dry-run
```

## Confirmation levels, from weakest to strongest

| Level | Where | Bypassed by |
|---|---|---|
| Batch-mode section prompt | Most destructive sections | `--yes` |
| Per-item interactive selection | Sections 12, 16, 17, 21, 23, 24 | Running the section in batch mode |
| Deep-section gate | Sections 6, 10, 11, 14, 21, 24 | `--yes` **and** `--i-understand-deep` together |
| Typed `yes` | Section 14 | Nothing — always required |

## Privacy: no telemetry

The script makes **no network calls by default**. The Node launcher only spawns bash — no
analytics, no crash reporting, no phone-home. Logs and reports never leave
`~/.mac-cleanup/`.

The one exception is opt-in: `--check-update` makes a single unauthenticated
`GET` to `https://registry.npmjs.org/macleanup/latest` to compare versions. It
sends no cleanup paths or reports. npm still receives normal request metadata,
such as your IP address. The check times out in seconds and never blocks the
run. `--feedback` and `--report-issue` open your mail client or a
pre-filled GitHub issue for **you** to review and submit — nothing is sent
automatically.

## Where the guarantees stop

The rules above bound what macleanup does. They do not bound the consequences
of a cleanup you asked for:

- **There is no undo.** No restore point, no transaction log, no
  `macleanup --undo`. The Trash is the only built-in second chance, and only
  for sections 12, 21 and 24.
- **Deleting the right file at the wrong time still hurts.** A stale
  `node_modules` is only reinstallable while the lockfile resolves and the
  registry still has those versions.
- **Heuristics are heuristics.** "Orphaned", "idle" and "stale" are informed
  guesses about your intent. Review the interactive lists.
- **`--yes` transfers the judgement to you.** It is the correct flag for a
  cron job you have already validated with `--dry-run`, and the wrong flag for
  a command you are trying for the first time.
- **Third-party apps can hide data anywhere.** An uninstall removes the known
  locations, not every location.

**Back up before any cleanup tool runs.** A pinned Time Machine snapshot or a
`tmutil snapshot` is the last line of defence that actually works.

## Next

- [What gets deleted](/before-you-run/what-gets-deleted) — the full inventory, by tier.
- [The 28 sections](/reference/sections) — per-section confirmations and sudo needs.
- [Recovery](/recovery) — restoring tooling after the v4.3.0 section 23 bug.
