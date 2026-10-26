---
title: Your first run
description: A step-by-step first session with macleanup — preview, read the report, run one section, then widen. Nothing is deleted before you choose to run a cleanup.
tags: [getting-started, tutorial, dry-run, walkthrough]
sidebar_position: 2
sidebar_label: Your first run
keywords: [macleanup tutorial, first cleanup mac, how to use macleanup]
---

# Your first run

**This walkthrough deletes nothing until step 5.** Review the preview and its
[limits](/before-you-run/dry-run#the-honest-limits-of-a-preview) before choosing
the first cleanup.

## Step 0 — Check your backup

Use a current backup before the first cleanup, especially before a section that
deletes directly. If Time Machine is configured, you can also request a local
snapshot:

```bash
tmutil snapshot
```

A local snapshot is not a substitute for a separate backup and may be
unavailable when Time Machine is not configured. macleanup has no built-in undo.

## Step 1 — See the section catalogue

```bash
npx macleanup --list
```

This prints all 28 sections and exits. Section numbers are the vocabulary for
everything else — `--only 23` and `--profile dev` both mean "these numbers".
Full detail: [The 28 sections](/reference/sections).

## Step 2 — Preview the safe batch

```bash
npx macleanup --dry-run --all
```

`--all` runs the **safe batch** — sections `0, 3, 5, 7, 8, 9, 15, 18, 22, 26`:
package-manager caches, user caches, old logs, temp files, update caches, and
several read-only reports. With `--dry-run` it deletes nothing and reports what
it would remove, including an estimate of the space freed.

Read the output. If anything listed makes you uneasy, stop and look that
section up before continuing.

Save it if the scrollback is long:

```bash
npx macleanup --dry-run --all --no-color > ~/Desktop/macleanup-preview.txt
```

## Step 3 — Run an audit that deletes nothing

```bash
npx macleanup --profile audit --dry-run
```

The `audit` profile is sections `0, 12, 18, 21, 25, 26`: system health,
orphaned app data, large files, idle apps, the LaunchAgents audit and a
disk-usage report. `--dry-run` guarantees this first pass deletes nothing.
It can still write dated `.txt` files to `~/.mac-cleanup/reports/`.

```bash
open ~/.mac-cleanup/reports/
```

These reports tell you where your disk actually went, which is usually more
useful than any single cleanup.

## Step 4 — Pick one section and preview it

Start narrow. Section 3 covers package-manager caches. Removed packages may
need downloading again, and a package may no longer be available from its
registry.

```bash
npx macleanup --only 3 --dry-run
```

If you are short on space because of old project builds, preview section 23
instead — but read [what section 23 does](/before-you-run/what-gets-deleted)
first, because a deleted `node_modules` is only reinstallable while the
lockfile still resolves:

```bash
npx macleanup --only 23 --stale-build-days 90 --dry-run
```

## Step 5 — Run it for real

Drop `--dry-run`, keep everything else identical:

```bash
npx macleanup --only 3
```

The section asks before it acts. Answer, watch it work, and check the space:

```bash
df -h /
```

## Step 6 — Use the interactive menu

```bash
npx macleanup
```

With no flags you get the menu: choose one section at a time, with a
confirmation for every destructive step. This is the best mode while you are
still learning what each section does on *your* machine — and the only way to
reach the deep sections without the `--i-understand-deep` flag.

When a section asks **"Select items (1..N)"**:

| You type | It means |
|---|---|
| `all` or `a` | Every item |
| `none` or nothing | Nothing |
| `1,3,5-7,12` | Items 1, 3, 5, 6, 7 and 12 |
| `7-3` | A reversed range — auto-corrected to 3..7 |

Out-of-range or junk tokens are ignored.

## Step 7 — Settle into a routine

Once you know which sections suit your machine, pick a cadence:

```bash
# Weekly, mostly safe. Preview it once before adding --yes.
mac-cleanup --profile minimal --dry-run

# Developer caches plus stale build dirs
mac-cleanup --profile dev --dry-run

# Unattended, after you have validated the exact command
mac-cleanup --all --yes --quiet --notify
```

:::warning[Check a profile before automating it]
`--profile minimal` now leaves Trash alone. Other profiles can still remove
data you need. Always run a profile with `--dry-run` before adding `--yes`.
:::

More ready-made commands: [Recipes](/recipes).

## What you now have on disk

```
~/.mac-cleanup/
├── logs/
│   └── mac-cleanup-YYYY-MM-DD.log
└── reports/
    ├── orphans-YYYY-MM-DD.txt
    ├── unused-apps-YYYY-MM-DD.txt
    ├── large-files-YYYY-MM-DD.txt
    └── …
```

Logs are kept indefinitely and are small. Prune them when you like:

```bash
mac-cleanup --prune-history 30 --dry-run   # preview
mac-cleanup --prune-history 30             # delete logs+reports older than 30 days
```

## If something went wrong

- A tool stopped working after a cleanup → [Recovery](/recovery)
- A command errored or behaved unexpectedly → [Troubleshooting](/troubleshooting)
- A section found nothing you expected it to find → [FAQ](/faq)

`mac-cleanup --report-issue` opens a pre-filled GitHub issue with locally
gathered environment info. Nothing is transmitted until you press Submit.

## Next

- [The 28 sections](/reference/sections) — what each number does.
- [Profiles](/reference/profiles) — the five named bundles.
- [CLI reference](/reference/cli) — every flag in one page.
