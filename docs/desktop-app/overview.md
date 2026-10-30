---
title: The macleanup desktop app
description: What the macleanup desktop app adds to the command line — the same script underneath, a disk gauge, a dry-run ledger with keep, archive or delete, run receipts, apps and leftovers, and both launchd domains.
tags: [desktop-app, macos, overview]
sidebar_position: 1
sidebar_label: Overview
keywords: [macleanup app, macleanup desktop app, macleanup mac app, macos cleanup app, dry-run ledger]
---

# The macleanup desktop app

**The macleanup desktop app runs the same macleanup script on your Mac, in a
window.** Every section, profile and safety rule is the one the command line
uses. The app makes each step visible: what a run would touch before it starts,
and what it did after it ends.

:::info[Release status]
The desktop app is being released alongside macleanup 5.1.0. Check the
[download page](https://macleanup.aoneahsan.com/download) for the current
build. The command line works with or without it.
:::

## What the window adds {#what-it-adds}

| Screen | What it shows |
|---|---|
| Disk gauge | Used, purgeable, snapshot-held and free space, so you can see why deleting files does not always free space |
| Dry-run ledger | Every path and size before a run. Rows that may be the only copy of some data get a choice: keep, archive or delete |
| Run receipt | Attempted, completed, skipped and failed sections, counted separately, with free space before and after |
| Apps and leftovers | App bundles, support folders, containers and helpers, with protected items explained |
| Launch items | Your account's agents beside the system's daemons and root Homebrew services — both launchd domains |

The ledger and the receipt come from the [JSON event stream](/reference/json-events)
the script writes. A row marked as possibly unique is an `item` event with
`unique: true`. Archives are written to `~/.macleanup/archives/`, the same
folder [`--archive-path`](/reference/cli#archive-path) uses.

## Same script, same safety {#same-script}

- **Preview first.** A preview changes no files. Read the ledger, then decide.
- **The same recovery limits.** Trash moves can be undone until you empty the
  Trash; permanent sections need your own backup. The full inventory is on
  [What gets deleted](/before-you-run/what-gets-deleted).
- **The same password handling.** Sections that need an administrator
  password ask for it through `MACLEANUP_ASKPASS`, the helper the app supplies.
- **One history.** The app and `npx macleanup` share `~/.macleanup/`, so logs,
  reports and receipts from both sit in one place.

Prefer the command line? Nothing changes for `npx macleanup`. It stays MIT
licensed and has no run limits.

## In this section

- [Install and first launch](/desktop-app/install) — Gatekeeper, Full Disk Access, updates.
- [Plans and allowance](/desktop-app/plans) — what Free, Pro and Team include.
- [Privacy in the app](/desktop-app/privacy) — what stays on your Mac and what syncs.
- [Keyboard shortcuts](/desktop-app/keyboard-shortcuts) — the defaults, all rebindable.
