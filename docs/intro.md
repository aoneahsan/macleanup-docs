---
title: Introduction
description: macleanup is a safe-by-default macOS cleanup CLI that reclaims disk space from caches, logs, stale build artefacts and unused apps — with per-section confirmation and a real dry-run.
tags: [macleanup, macos, cleanup, cli, overview]
sidebar_position: 1
slug: /intro
keywords: [macleanup, mac cleanup, macos disk space, clear cache mac, cleanup cli]
---

# Introduction

**macleanup is a command-line macOS cleanup and maintenance tool that deletes
files from your machine to reclaim disk space.** It ships as one bash script
with twenty-eight numbered sections — developer caches, browser caches, system
and user logs, temp files, orphaned application data, stale build artefacts,
large dormant files, unused apps and several read-only reports. You pick which
sections run; each destructive one asks before it acts, and `--dry-run` shows
you every path it would remove without touching a thing.

It is MIT-licensed, makes no network calls beyond an opt-in version check, and
requires nothing but macOS 11+ and bash 3.2+.

:::danger This tool deletes files
Deletion is the point of the tool, and most of it is **not reversible**.
Cache and log removal is safe in the sense that the data regenerates — but a
deleted `node_modules`, a purged Xcode archive, or an emptied Trash is gone.

Before your first real run: read [What gets deleted](/before-you-run/what-gets-deleted),
then preview with [`--dry-run`](/before-you-run/dry-run). Both take about five
minutes and they are the difference between a cleanup and an incident.
:::

## The thirty-second version

```bash
# 1. See what a safe-batch cleanup would remove — deletes nothing.
npx macleanup --dry-run --all

# 2. List every section so you know what the numbers mean.
npx macleanup --list

# 3. Run interactively and choose sections one at a time.
npx macleanup
```

No install step is required — `npx` fetches the package, runs it, and npm
reclaims the cache afterwards. Your logs and reports are written to
`~/.mac-cleanup/` and survive every invocation.

## What it is good at

| Job | How macleanup handles it |
|---|---|
| Reclaiming developer disk space | Sections 1–4 cover Xcode, Gradle/Android, package managers and Docker; section 23 sweeps stale `node_modules` and friends |
| Emptying caches without losing settings | Browser caches are cleared per profile; bookmarks, history and passwords are not touched |
| Uninstalling an app completely | Section 21 moves the app to the Trash and removes its known companion data, including Group Containers |
| Auditing before deciding | Sections 0, 15, 18, 25 and 26 only produce reports — they delete nothing |
| Scripted, repeatable cleanups | `--only`, `--profile`, `--yes`, `--quiet` and `--json` make it cron- and CI-friendly |

## What it is not

Honesty matters more here than in most tools, because the failure mode is lost
data:

- **It is not a backup tool, and it does not create restore points.** Take a
  Time Machine snapshot (or `tmutil snapshot`) before a large run.
- **It is not undoable.** There is no `macleanup --undo`. The only recovery
  paths are the Trash (for apps and large stale files) and your own backup.
- **It is not a Linux tool.** It reads macOS-specific paths and calls
  `tmutil`, `xcrun`, `dscacheutil`, `launchctl` and `osascript`. There is no
  Linux port and it refuses to start on a non-Darwin platform.
- **It does not know your project layout.** Section 23 deletes build
  directories that look stale by timestamp. If a directory matters to you and
  you have not opened it in months, protect it with `--exclude-path`.
- **It cannot guarantee an app uninstall is complete.** It removes the known
  companion locations for an app; a developer who scattered files elsewhere is
  outside its knowledge.

## How the pieces fit together

```mermaid
flowchart LR
  A["You choose sections<br/>menu · --only · --profile · --all"] --> B{"--dry-run?"}
  B -- yes --> C["Print what would be removed<br/>estimate freed space<br/>delete nothing"]
  B -- no --> D{"Destructive section?"}
  D -- no --> E["Run report<br/>write .txt to ~/.mac-cleanup/reports/"]
  D -- yes --> F{"Confirmed?<br/>prompt · --yes · --i-understand-deep"}
  F -- no --> G["Skip the section"]
  F -- yes --> H["Delete · or move to Trash<br/>log to ~/.mac-cleanup/logs/"]
```

## Where to go next

| You want to | Read |
|---|---|
| Know exactly what disappears | [What gets deleted](/before-you-run/what-gets-deleted) |
| Preview a run safely | [Preview with `--dry-run`](/before-you-run/dry-run) |
| Understand the guarantees | [Safety model](/before-you-run/safety-model) |
| Install it | [Installation](/getting-started/installation) |
| Walk through a first session | [Your first run](/getting-started/first-run) |
| Look up a flag | [CLI reference](/reference/cli) |
| Look up a section number | [The 28 sections](/reference/sections) |
| Copy a working command | [Recipes](/recipes) |
| Fix something that went wrong | [Troubleshooting](/troubleshooting) · [Recovery](/recovery) |

## Project facts

| | |
|---|---|
| Package | [`macleanup` on npm](https://www.npmjs.com/package/macleanup) — current documented version **4.6.1** |
| Commands installed | `mac-cleanup` and `macleanup` (identical) |
| Source | [github.com/aoneahsan/macleanup](https://github.com/aoneahsan/macleanup) |
| Requirements | macOS 11+, bash 3.2+; Node only if you use `npx` or a global npm install |
| Licence | MIT — use, modify, redistribute, sell; no warranty, no liability |
| Author | [Ahsan Mahmood](/about-the-author) |
