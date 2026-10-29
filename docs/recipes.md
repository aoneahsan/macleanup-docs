---
title: Recipes
description: Copy-paste macleanup commands organised by goal — reclaim developer space, audit before deciding, uninstall an app properly, automate a weekly sweep.
tags: [recipes, examples, cookbook, cli]
sidebar_position: 4
sidebar_label: Recipes
keywords: [macleanup examples, free disk space mac command, delete old node_modules, mac cleanup cron]
---

# Recipes

**Working commands, grouped by what you are trying to achieve.** Every recipe
that can delete is shown in its `--dry-run` form first. Drop `--dry-run` once
the preview looks right — the rest of the command stays identical.

Substitute `npx macleanup`, `macleanup` or `./macleanup.sh` freely; the
flags are the same.

## Find out where the space went

```bash
# Full read-only audit — writes .txt files you can read at leisure
macleanup --profile audit --dry-run
open ~/.macleanup/reports/

# Per-directory usage for $HOME and ~/Library
macleanup --only 26

# Every file ≥ 500 MB under $HOME, with no age filter
macleanup --only 18

# System health and what is currently running
macleanup --only 0
```

Start here. Knowing which directory holds 40 GB usually beats running a
cleanup blind.

## Reclaim developer disk space

```bash
# Preview the whole developer bundle
macleanup --profile dev --dry-run

# Developer caches and Docker prune; Docker volume deletion has a separate prompt
macleanup --only "1,2,3,4" --dry-run

# Xcode alone: DerivedData, DeviceSupport, simulator leftovers
macleanup --only 1 --dry-run

# Package-manager caches with a tighter age threshold
macleanup --only 3 --cache-age-days 30 --dry-run

# Docker: containers, images and build cache; volumes require a separate interactive yes
macleanup --only 4 --dry-run
```

## Sweep stale build directories

Section 23 deletes permanently. Preview, protect what matters, then run.

```bash
# Every node_modules-shaped dir untouched for 90+ days
macleanup --only 23 --stale-build-days 90 --dry-run

# Point it at your real project roots
macleanup --only 23 --scan-roots "$HOME/repos:$HOME/code" --dry-run

# Protect specific trees — the flag is repeatable
macleanup --only 23 \
  --exclude-path "$HOME/Code/active-client" \
  --exclude-path "$HOME/Code/side-project" \
  --stale-build-days 120 --dry-run
```

:::warning[Reinstallable is not the same as guaranteed]
A deleted `node_modules` comes back only while the lockfile resolves and the
registry still serves those versions. For a repo you are actively shipping,
protect it with `--exclude-path`.
:::

## Find big dormant files

```bash
# 2 GB+, untouched for 180 days
macleanup --only 24 --large-file-size-gb 2 --large-file-days 180 --dry-run

# 5 GB+, untouched for a year
macleanup --only 24 --large-file-size-gb 5 --large-file-days 365 --dry-run
```

Section 24 requires **both** atime and mtime to be older than the threshold. A
file you opened recently is not flagged even if you have not edited it in
years. If a file you expected is missing from the list, lower the threshold or
use section 18, which has no age filter.

Selected files go to the **Trash**, so they are recoverable until you empty it.

## Uninstall apps you no longer use

```bash
# Which apps have been idle for 60+ days?
macleanup --only 21 --threshold 60 --dry-run

# A year or more
macleanup --only 21 --threshold 365 --dry-run

# Review and choose interactively (recommended)
macleanup --only 21 --threshold 180
```

The interactive run supports multi-select — `all`, `1,3,5-7,12`, or `none`.
Apps and their companion data move to the Trash.

:::danger[Unattended uninstall]
`macleanup --only 21 --yes --i-understand-deep` moves **every** idle app to
the Trash with no further prompt. Preview first, always.
:::

## Clear caches without losing settings

```bash
# Every cache layer
macleanup --profile cache-only --dry-run

# Browser caches only — history, logins and bookmarks are untouched
macleanup --only 19

# User caches, skipping everything that needs sudo
macleanup --only 5 --no-sudo
```

## Pre-flight before reinstalling Xcode

```bash
macleanup --only "1,17" --dry-run
```

Section 1 clears DerivedData and simulator leftovers; section 17 offers Xcode
archives for review.

:::note[Archives hold your dSYMs]
Deleting the archive for a build you already shipped means its crash reports
can no longer be symbolicated. Keep the archives for live releases.
:::

## Audit login items

```bash
macleanup --only 25
```

Finds LaunchAgents and LaunchDaemons whose target no longer exists — a common
cause of slow logins and mysterious background processes. Sudo is only needed
if you choose to remove something under `/Library/`.
In batch mode, the command above reports candidates without removing them.
Removing them unattended requires both `--yes` and `--i-understand-deep` and
selects every candidate, so preview with `--dry-run` first.

## Automate a routine sweep

Validate the exact command with `--dry-run` before it ever runs unattended.

```bash
# Step 1 — verify
macleanup --all --dry-run

# Step 2 — automate the verified command
macleanup --all --yes --quiet --notify
```

A `launchd` weekly job, using the global install:

```bash
# ~/Library/LaunchAgents/com.aoneahsan.macleanup.plist runs this:
/usr/local/bin/macleanup --all --yes --quiet --no-reports
```

`--all` is the safe batch only, and it never includes the deep sections — which
is exactly what you want from an unattended job.

## Scripting with JSON

```bash
# Just the number of KB freed
macleanup --all --yes --json | jq .freed_kb

# Freed space plus which sections ran
macleanup --only 3,5 --yes --json | jq '{freed: .freed_kb, sections: .sections_done}'

# Fail a CI step if nothing was reclaimed
test "$(macleanup --all --yes --json | jq .freed_kb)" -gt 0
```

`--json` implies `--quiet` and puts everything except the single JSON object on
stderr, so stdout stays clean for a pipe.

## Save a preview for review

```bash
macleanup --profile deep --dry-run --no-color > ~/Desktop/macleanup-preview.txt
```

`--no-color` strips ANSI escapes so the file is readable in any editor.

## Housekeeping

```bash
macleanup --stats                        # what is in ~/.macleanup
macleanup --prune-history 30 --dry-run   # preview a 30-day prune
macleanup --prune-history 30             # prune
macleanup --uninstall-data               # remove ~/.macleanup entirely
macleanup --check-update                 # is a newer version published?
```

## The heavy monthly clean

```bash
# 1. Snapshot first
tmutil snapshot

# 2. Preview
macleanup --profile deep --dry-run

# 3. Run it, minus the sections you want to keep control of
macleanup --profile deep --exclude 17,23 --yes
```

## Next

- [CLI reference](/reference/cli) — every flag used above.
- [The 28 sections](/reference/sections) — what each number does.
- [Profiles](/reference/profiles) — the bundles behind `--profile`.
