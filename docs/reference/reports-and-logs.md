---
title: Reports and logs
description: Where macleanup writes its dated session logs and per-section report files, what each one contains, and how to move, skip or prune them.
tags: [reference, logs, artefacts, output]
sidebar_position: 5
sidebar_label: Reports and logs
keywords: [macleanup logs, macleanup report files, dot macleanup directory, prune-history]
---

# Reports and logs

**Every macleanup run writes a dated log, and the sections that produce lists
also write a dated `.txt` file.** Both live in your home directory — never
inside the npx cache — so they survive every invocation and the cache reclaim
that follows it.

## Where the files live

```
~/.macleanup/
├── archives/          (5.1.0+, only with --archive-path)
│   └── <date>-<name>.tar.gz
├── logs/
│   └── macleanup-YYYY-MM-DD.log
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
open ~/.macleanup/reports/
```

## What each file holds

| File | Written by | Contains |
|---|---|---|
| `orphans-*.txt` | Section 12 | Application data with no installed parent app; from 5.1.0 also the orphan-shaped entries it skipped because they were touched recently, for review |
| `unused-apps-*.txt` | Section 21 | Applications idle past `--threshold` days |
| `large-files-*.txt` | Section 18 | Everything ≥ 500 MB under `$HOME`, no age filter |
| `stale-build-*.txt` | Section 23 | Build directories untouched past `--stale-build-days` |
| `large-stale-*.txt` | Section 24 | Files ≥ `--large-file-size-gb` GB, idle past `--large-file-days` |
| `launch-audit-*.txt` | Section 25 | Orphaned LaunchAgents and LaunchDaemons; from 5.1.0 also the loaded Homebrew and third-party services in both launchd domains, your user's and the system's |
| `disk-usage-*.txt` | Section 26 | Per-directory usage for `$HOME` and `~/Library` |

These files are written **during a dry run too**, which makes them the most
comfortable way to review a long candidate list — far better than scrolling
back through a terminal:

```bash
macleanup --only 23 --stale-build-days 90 --dry-run
open ~/.macleanup/reports/
```

A skipped entry in the section 12 report is not proof that nothing is left
behind; review the list yourself. Section 25 reads both launchd domains because
`brew services list` in one domain can say `none` while a root service is
running.

Archives written by [`--archive-path`](/reference/cli#archive-path) can hold
settings, sessions or keys, so the folder is mode 700 and each file mode 600.

## The session summary {#session-summary}

From 5.1.0 the summary at the end of a run counts sections four ways:

| Count | Meaning |
|---|---|
| Attempted | Every section the run selected |
| Completed | Sections that finished their work |
| Skipped | Sections that did not run, each with a reason, such as a deep section refused without `--i-understand-deep` |
| Failed | Sections that stopped on an error |

A skipped or failed section is never counted as completed.

The summary also shows the number of local APFS snapshots. **Deleted files may
not free disk space until macOS releases those snapshots**, so free space can
rise by less than the freed estimate. Section 11 is the section that deals
with local Time Machine snapshots; read [its entry](/reference/sections#section-11--time-machine-local-snapshots) before
selecting it.

## The credits header

Every log and every `.txt` starts with a header naming the tool version,
author, repo URL, npm URL, run timestamp and host. Each artefact is therefore
self-attributing — useful when one has been pasted into a ticket months later
and nobody remembers what produced it.

## Controlling where they go

| Flag | Environment variable | Default |
|---|---|---|
| `--logs-dir PATH` | `MACLEANUP_LOGS_DIR` | `~/.macleanup/logs` |
| `--reports-dir PATH` | `MACLEANUP_REPORTS_DIR` | `~/.macleanup/reports` |

```bash
macleanup --logs-dir /tmp/mc --reports-dir /tmp/mc-out --only 18
```

## Turning them off

| Default behaviour | How to change it |
|---|---|
| Logs kept forever, one per day | `--cleanup-logs-on-finish` deletes **this run's** log at exit |
| A `.txt` written for every relevant section | `--no-reports` skips them all; the session log is still written |

```bash
macleanup --only 18 --cleanup-logs-on-finish   # one-shot scan, nothing left behind
macleanup --all --yes --no-reports             # cron run, log only
```

A log is roughly 50 KB per day, so keeping them is close to free.

## Reviewing your history

```bash
macleanup --stats
```

Prints the data-directory location, log count and total size, oldest and newest
log, `.txt` count and total size, and the eight most recent files.

## Pruning old artefacts

```bash
macleanup --prune-history 30 --dry-run   # preview a 30-day prune
macleanup --prune-history 30             # actually prune
macleanup --prune-history                # default: older than 90 days
```

Deletes logs **and** `.txt` files older than N days from both subdirectories.
It honours `--dry-run` and is a quick-exit command — it never enters the menu
or runs a cleanup section.

## Removing the data directory

```bash
macleanup --uninstall-data --dry-run   # see what would go
macleanup --uninstall-data             # remove it, after a typed confirmation
```

Removes the whole `~/.macleanup` directory — logs, `.txt` files and the
first-run marker. Deleting the marker makes the one-time welcome screen appear
again on the next run.

Uninstalling the npm package does **not** remove this directory. Run
`--uninstall-data` first if you want a clean removal.

## Machine-readable output

For scripting, `--json` usually beats parsing a `.txt`:

```bash
macleanup --all --yes --json | jq '{freed: .freed_kb, sections: .sections_done}'
```

The object's `reports` array lists the files written **by that run**; before
4.6.1 it listed everything in the directory, including leftovers from earlier
runs the same day. Full shape: [`--json`](/reference/cli#json-output).

To follow a run while it happens — every section, item and result — use
[`--json-events`](/reference/json-events) instead. Its `summary` event carries
the attempted, completed, skipped and failed section ids, and its `disk` events
carry the snapshot count.

## Next

- [Configuration](/reference/configuration) — set these directories permanently.
- [CLI reference](/reference/cli) — `--stats`, `--prune-history`, `--json`.
- [Recipes](/recipes) — capturing output for review.
