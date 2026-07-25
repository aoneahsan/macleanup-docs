---
title: What gets deleted
description: A complete, honest inventory of everything macleanup can remove from your Mac — grouped by whether the data regenerates, goes to the Trash, or is gone permanently.
tags: [safety, deletion, macos, cleanup, reference]
sidebar_position: 1
sidebar_label: What gets deleted
keywords: [what does macleanup delete, is macleanup safe, mac cleanup irreversible, macleanup trash]
---

# What gets deleted

**macleanup removes files in three different ways, and the difference decides
how much care a section deserves.** Some data regenerates on its own within
minutes. Some is moved to the Trash and can be dragged back until you empty it.
Some is unlinked immediately and only a backup will bring it back.

This page is the full inventory. Read the three tiers below, then look up the
individual sections you plan to run in [The 28 sections](/reference/sections).

:::tip Nothing on this page runs by itself
macleanup only touches a section you selected — from the interactive menu, or
by number with `--only`, or through `--all` / `--profile`. Sections you never
choose are never executed.
:::

## The three tiers

| Tier | What happens | Recovery |
|---|---|---|
| **1 — Regenerates** | Caches and logs are deleted; the owning tool rebuilds them on next use | None needed. Cost is a slower next build or page load |
| **2 — Moved to Trash** | Apps (section 21) and large stale files (section 24) go to `~/.Trash` | Drag it back, until you empty the Trash |
| **3 — Permanently deleted** | Unlinked directly. Snapshots, archives, backups, build directories, Trash contents | **Your backup only.** There is no undo |

## Tier 1 — Deleted, but it regenerates

Everything here is a cache, a log, or a temp file. Losing it costs time, not
data: the next build is slower, the next page load re-downloads, a login
session may end.

| Section | What it removes | Notable protection |
|---|---|---|
| 1 | Xcode `DerivedData`, `iOS`/`tvOS`/`watchOS DeviceSupport`, Xcode `Logs`, `DocumentationCache`, `com.apple.dt.Xcode` cache; unavailable simulators | Age-aware — recently built projects survive. Wiping `CoreSimulator` entirely is a separate opt-in confirm |
| 2 | Gradle build caches, Android SDK build caches | Age-aware |
| 3 | Package-manager caches: npm, yarn, pnpm, Homebrew, pip, CocoaPods, cargo, go, Ruby, Flutter | Age-aware. `brew autoremove` is **off by default** — see [the 4.3.0 note](/recovery) |
| 4 | Docker containers, images and volumes via `docker prune` | Requires the Docker daemon to be running |
| 5 | `~/Library/Caches` entries, `~/Library/Saved Application State`, `~/Library/Logs/DiagnosticReports` | Apple (`com.apple.*`), every supported browser, password managers (1Password, Bitwarden, KeePassXC) and `Caches/node` are **always preserved** |
| 6 | Non-Apple entries in `/Library/Caches` (sudo) | Apple caches preserved. Skipped entirely without sudo |
| 7 | Old user and system log files (sudo for system logs) | Age-thresholded per location — recent logs are kept |
| 8 | Entries in `$TMPDIR`, `/tmp`, `~/tmp` | User-owned files only |
| 9 | Downloaded update caches (sudo) | — |
| 19 | HTTP and code caches for Chrome, Chrome Canary, Brave, Edge, Vivaldi, Chromium, Opera, Opera GX, DuckDuckGo, Arc, and the Firefox family (Firefox, Dev Edition, Nightly, LibreWolf, Floorp, Zen), across **every profile** | Only cache subdirectories (`Cache`, `Code Cache`, `GPUCache`, service-worker caches). **Profile data, history, logins, bookmarks and extensions are left intact.** Safari is advisory only — macleanup tells you to clear it yourself |
| 27 | QuickLook thumbnail cache and font caches (sudo only for the optional system-wide font clear) | Menu / `--only` only — never in `--all` |

**Honest note on section 5.** Clearing Saved Application State means apps stop
reopening the windows you left open. That is a real behaviour change, not a
bug, and it is a separate optional confirmation.

**Honest note on section 19.** Clearing browser caches can sign you out of some
sites and makes the next page load slower until things re-cache. It does not
delete your passwords, bookmarks or history.

## Tier 2 — Moved to the Trash

Recoverable — but only until the Trash is emptied, including by section 10 in
the same session.

| Section | What moves to the Trash |
|---|---|
| 21 | Applications idle for at least `--threshold` days, **plus their known companion data** — application support, caches, preferences, containers and Group Containers |
| 24 | Files at least `--large-file-size-gb` GB in size and untouched for at least `--large-file-days` days |

:::warning Section 21 removes companion data too
An uninstall is not just the `.app`. Section 21 also removes the app's known
support and container directories. That is what makes it a real uninstall —
and it also means the app's local data goes with it. If an app holds documents
you care about inside its container, export them first.

macleanup removes the locations it knows about. An application that stored
data somewhere unconventional may leave files behind — no uninstaller can
promise otherwise.
:::

## Tier 3 — Permanently deleted

Nothing here goes to the Trash. When a section in this tier runs, the data is
unlinked, and only a backup gets it back.

| Section | What is permanently deleted | Why it is here |
|---|---|---|
| 10 | Everything in `~/.Trash`, and the per-user trash on each mounted **external** volume | Emptying the Trash is final — including anything sections 21 and 24 put there earlier in the same session |
| 11 | APFS local Time Machine snapshots | These are your local rollback points. Deleting them removes the ability to restore recent local changes |
| 12 | Orphaned application-support and container data with no installed parent app | The "orphan" judgement is a heuristic. Review the list rather than confirming blind |
| 14 | The `/private/var/folders` deep cache (sudo) | **Requires a reboot afterwards.** Needs a typed `yes`, not just `y` |
| 16 | iOS / iPadOS device backups you select | A device backup can be the only copy of a phone's data. Interactive review, per device |
| 17 | Xcode archives you select | Archives contain the dSYMs needed to symbolicate crash reports from already-shipped builds |
| 23 | Stale build directories inside your scan roots — `node_modules`, `vendor`, `dist`, `.next`, `target`, `Pods` and similar | Reinstallable in principle, but only if the lockfile and network cooperate. A private or yanked dependency may not come back |
| 13 | Runs `sudo periodic` — macOS's own log rotation and maintenance | Not a macleanup deletion as such; macOS decides what it rotates |
| 20 | Flushes DNS/mDNS caches and renews DHCP on `en0` (sudo) | No user data involved; listed for completeness |
| 22 | Triggers macOS to reclaim purgeable space | macOS decides what to purge |

:::danger Section 14 needs a reboot
The `/private/var/folders` wipe removes per-user temporary state that running
processes hold open. macOS behaves oddly until you restart. This section asks
for a typed `yes`, it is never part of `--all`, and it needs
`--i-understand-deep` to run unattended.
:::

## Sections that delete nothing

These only read and write a report to `~/.mac-cleanup/reports/`. They are safe
to run at any time, and `--profile audit` bundles them.

| Section | Produces |
|---|---|
| 0 | System health and running-process overview |
| 15 | Installer leftovers report — advisory only |
| 18 | Large files report — everything ≥ 500 MB under `$HOME` |
| 25 | LaunchAgents / LaunchDaemons audit — orphaned login items |
| 26 | Disk-usage report for `$HOME` and `~/Library` |

## What macleanup never touches

- **Your documents, photos, music and code**, except where a file is caught by
  section 24's explicit size-and-age criteria or lives inside a build directory
  matched by section 23.
- **Browser bookmarks, history, saved logins, cookies-as-profile-data and
  extensions** — section 19 clears cache subdirectories only.
- **Password-manager data** — 1Password, Bitwarden and KeePassXC caches are on
  the section 5 preserve list.
- **Apple system caches** in sections 5 and 6.
- **Toolchain manager directories** — `~/.bun`, `~/.pnpm-store`,
  `~/.local/share/pnpm`, `~/.npm-packages`, `~/.volta` and their peers are on a
  hard allowlist that section 23 refuses to enter. See [Recovery](/recovery)
  for the incident that created it.
- **Anything on a read-only mount, or the boot volume's trash under
  `/Volumes`.**

## The two thresholds that decide most deletions

Two numbers govern whether something old enough to delete actually gets
deleted. Both default to **100 days** and both look at `atime` **and** `mtime`.

| Threshold | Applies to | Flag |
|---|---|---|
| Cache age | Sections 1, 2, 3 | `--cache-age-days N` |
| Idle age | Sections 12 and 23 (delete gate); 16 and 17 (highlight only) | `--idle-days N` |

Because `atime` counts, a file you merely *opened* recently survives. A Gradle
distribution invoked once a month keeps a recent access time and is kept, even
though it was downloaded a year ago. Passing `0` disables the filter and turns
the section into a full wipe.

## Two things that surprise people

**`--all` is not "everything".** It runs the safe batch only —
sections `0, 3, 5, 7, 8, 9, 15, 18, 22, 26`. Even `--all --yes` refuses the
five deep sections (6, 11, 14, 21, 24) unless you also pass
`--i-understand-deep`.

**`--profile minimal --yes` empties your Trash.** The `minimal` profile is
`5, 7, 8, 9, 10`, and section 10 is not one of the five deep-gated sections —
so `--yes` auto-confirms it. That is a permanent deletion. Preview any profile
with `--dry-run` before adding `--yes`.

## Next

- [Preview with `--dry-run`](/before-you-run/dry-run) — see the exact paths before anything is removed.
- [Safety model](/before-you-run/safety-model) — the guarantees, and their limits.
- [The 28 sections](/reference/sections) — per-section detail, sudo needs and flags.
