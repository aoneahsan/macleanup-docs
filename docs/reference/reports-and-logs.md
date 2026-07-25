---
title: Reports and logs
description: Where macleanup writes its dated session logs and per-section report files, what each one contains, and how to move, skip or prune them.
tags: [reference, logs, artefacts, output]
sidebar_position: 5
sidebar_label: Reports and logs
keywords: [mac-cleanup logs, macleanup report files, dot mac-cleanup directory, prune-history]
---

# Reports and logs

**Every macleanup run writes a dated log, and the sections that produce lists
also write a dated `.txt` file.** Both live in your home directory — never
inside the npx cache — so they survive every invocation and the cache reclaim
that follows it.

## Where the files live

```
~/.mac-cleanup/
├── logs/
│   └── mac-cleanup-YYYY-MM-DD.log
└── reports/
    ├── orphans-YYYY-MM-DD.txt
    ├── unused-apps-YYYY-MM-DD.txt
    ├── large-files-YYYY-MM-DD.txt
    ├── stale-build-YYYY-MM-DD.txt
    ├── large-stale-YYYY-MM-DD.txt
    ├── launch-audit-YYYY-MM-DD.txt
    └── disk-usage-YYYY-MM-DD.txt
```

```bash
open ~/.mac-cleanup/reports/
```

## What each file holds

| File | Written by | Contains |
|---|---|---|
| `orphans-*.txt` | Section 12 | Application data with no installed parent app |
| `unused-apps-*.txt` | Section 21 | Applications idle past `--threshold` days |
| `large-files-*.txt` | Section 18 | Everything ≥ 500 MB under `$HOME`, no age filter |
| `stale-build-*.txt` | Section 23 | Build directories untouched past `--stale-build-days` |
| `large-stale-*.txt` | Section 24 | Files ≥ `--large-file-size-gb` GB, idle past `--large-file-days` |
| `launch-audit-*.txt` | Section 25 | Orphaned LaunchAgents and LaunchDaemons |
| `disk-usage-*.txt` | Section 26 | Per-directory usage for `$HOME` and `~/Library` |

These files are written **during a dry run too**, which makes them the most
comfortable way to review a long candidate list — far better than scrolling
back through a terminal:

```bash
mac-cleanup --only 23 --stale-build-days 90 --dry-run
open ~/.mac-cleanup/reports/
```

## The credits header

Every log and every `.txt` starts with a header naming the tool version,
author, repo URL, npm URL, run timestamp and host. Each artefact is therefore
self-attributing — useful when one has been pasted into a ticket months later
and nobody remembers what produced it.

## Controlling where they go

| Flag | Environment variable | Default |
|---|---|---|
| `--logs-dir PATH` | `MAC_CLEANUP_LOGS_DIR` | `~/.mac-cleanup/logs` |
| `--reports-dir PATH` | `MAC_CLEANUP_REPORTS_DIR` | `~/.mac-cleanup/reports` |

```bash
mac-cleanup --logs-dir /tmp/mc --reports-dir /tmp/mc-out --only 18
```

## Turning them off

| Default behaviour | How to change it |
|---|---|
| Logs kept forever, one per day | `--cleanup-logs-on-finish` deletes **this run's** log at exit |
| A `.txt` written for every relevant section | `--no-reports` skips them all; the session log is still written |

```bash
mac-cleanup --only 18 --cleanup-logs-on-finish   # one-shot scan, nothing left behind
mac-cleanup --all --yes --no-reports             # cron run, log only
```

A log is roughly 50 KB per day, so keeping them is close to free.

## Reviewing your history

```bash
mac-cleanup --stats
```

Prints the data-directory location, log count and total size, oldest and newest
log, `.txt` count and total size, and the eight most recent files.

## Pruning old artefacts

```bash
mac-cleanup --prune-history 30 --dry-run   # preview a 30-day prune
mac-cleanup --prune-history 30             # actually prune
mac-cleanup --prune-history                # default: older than 90 days
```

Deletes logs **and** `.txt` files older than N days from both subdirectories.
It honours `--dry-run` and is a quick-exit command — it never enters the menu
or runs a cleanup section.

## Removing the data directory

```bash
mac-cleanup --uninstall-data --dry-run   # see what would go
mac-cleanup --uninstall-data             # remove it, after a typed confirmation
```

Removes the whole `~/.mac-cleanup` directory — logs, `.txt` files and the
first-run marker. Deleting the marker makes the one-time welcome screen appear
again on the next run.

Uninstalling the npm package does **not** remove this directory. Run
`--uninstall-data` first if you want a clean removal.

## Machine-readable output

For scripting, `--json` usually beats parsing a `.txt`:

```bash
mac-cleanup --all --yes --json | jq '{freed: .freed_kb, sections: .sections_done}'
```

The object's `reports` array lists the files written **by that run**; before
4.6.1 it listed everything in the directory, including leftovers from earlier
runs the same day. Full shape: [`--json`](/reference/cli#json-output).

## Next

- [Configuration](/reference/configuration) — set these directories permanently.
- [CLI reference](/reference/cli) — `--stats`, `--prune-history`, `--json`.
- [Recipes](/recipes) — capturing output for review.
