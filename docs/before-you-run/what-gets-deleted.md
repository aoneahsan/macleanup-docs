---
title: What gets deleted
description: A section-by-section inventory of macleanup deletion methods, recovery paths, and limits.
tags: [safety, deletion, macos, cleanup, reference]
sidebar_position: 1
sidebar_label: What gets deleted
keywords: [what does macleanup delete, is macleanup safe, mac cleanup irreversible, macleanup trash]
---

# What gets deleted

**macleanup removes files in different ways, and the recovery path depends on
the section.** Some caches can regenerate. Logs, temp files and app state may
contain unique data. Items moved to the Trash can be restored until it is
emptied. Direct deletion needs a backup for recovery.

This page is the full inventory. Read the three tiers below, then look up the
individual sections you plan to run in [The 28 sections](/reference/sections).

:::tip[Nothing on this page runs by itself]
macleanup only touches a section you selected — from the interactive menu, or
by number with `--only`, or through `--all` / `--profile`. Sections you never
choose are never executed.
:::

## The three tiers

| Tier | What happens | Recovery |
|---|---|---|
| **1 — Routine direct removal** | Caches, logs, temp files and some app state are deleted | Some caches rebuild; unique logs, temp data and app state need a backup |
| **2 — Moved to Trash** | Orphaned app data (section 12), apps (section 21) and large stale files (section 24) go to the Trash | Put it back, until you empty the Trash |
| **3 — Permanently deleted** | Unlinked directly. Snapshots, archives, backups, build directories, Trash contents | **Your backup only.** There is no undo |

## Tier 1 — Routine direct removal

These entries include caches, logs, saved state or temporary files. They do not
all regenerate. Section 4 also offers a
separate, irreversible Docker volume prune in interactive mode; see Tier 3.
Section 5 can clear saved window state.

| Section | What it removes | Notable protection |
|---|---|---|
| 1 | Xcode `DerivedData`, `iOS`/`tvOS`/`watchOS DeviceSupport`, Xcode `Logs`, `DocumentationCache`, `com.apple.dt.Xcode` cache; unavailable simulators | Age-aware — recently built projects survive. Wiping `CoreSimulator` entirely is a separate opt-in confirm |
| 2 | Gradle build caches, Android SDK build caches | Age-aware |
| 3 | Package-manager caches: npm, yarn, pnpm, Homebrew, pip, CocoaPods, cargo, go, Ruby, Flutter | Age-aware. `brew autoremove` is **off by default** — see [the 4.3.0 note](/recovery) |
| 4 | Unused Docker containers, images, networks and build cache | Requires the Docker daemon; named volumes are preserved by default |
| 5 | `~/Library/Caches` entries, `~/Library/Saved Application State`, `~/Library/Logs/DiagnosticReports` | Apple (`com.apple.*`), every supported browser, password managers (1Password, Bitwarden, KeePassXC) and `Caches/node` are **always preserved** |
| 6 | Non-Apple entries in `/Library/Caches` (sudo) | Apple caches preserved. Skipped entirely without sudo |
| 7 | Old user and system log files (sudo for system logs) | Age-thresholded per location — recent logs are kept |
| 8 | Old, top-level regular files in `$TMPDIR` and `/private/tmp` | User-owned files at least two days old only; leaves nested entries and `~/tmp` alone |
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
| 12 | Orphaned application-support and container data with no installed parent app |
| 21 | Applications idle for at least `--threshold` days, **plus their known companion data** — application support, caches, preferences, containers and Group Containers |
| 24 | Files at least `--large-file-size-gb` GB in size and untouched for at least `--large-file-days` days |

:::warning[Section 21 removes companion data too]
An uninstall is not just the `.app`. Section 21 also removes the app's known
support and container directories. That is what makes it a real uninstall —
and it also means the app's local data goes with it. If an app holds documents
you care about inside its container, export them first.

If Finder cannot move an item to the Trash, macleanup leaves it in place and
reports the failure. It does not delete that item directly.

macleanup removes the locations it knows about. An application that stored
data somewhere unconventional may leave files behind — no uninstaller can
promise otherwise.
:::

## Tier 3 — Permanently deleted

Nothing here goes to the Trash. When a section in this tier runs, the data is
unlinked, and only a backup gets it back.

| Section | What is permanently deleted | Why it is here |
|---|---|---|
| 4 (optional) | Unused Docker volumes, only after a separate typed `yes` in interactive mode | A named volume may hold the only copy of a database; batch mode skips volume pruning |
| 10 | Everything in `~/.Trash`, and the per-user trash on each mounted **external** volume | Emptying the Trash is final — including anything sections 12, 21 and 24 put there earlier in the same session |
| 11 | APFS local Time Machine snapshots | These are your local rollback points. Deleting them removes the ability to restore recent local changes |
| 14 | The `/private/var/folders` deep cache (sudo) | **Requires a reboot afterwards.** Needs a typed `yes`, not just `y` |
| 16 | iOS / iPadOS device backups you select | A device backup can be the only copy of a phone's data. Interactive review, per device |
| 17 | Xcode archives you select | Archives contain the dSYMs needed to symbolicate crash reports from already-shipped builds |
| 23 | Stale build directories inside your scan roots — `node_modules`, `vendor`, `dist`, `.next`, `target`, `Pods` and similar | Reinstallable in principle, but only if the lockfile and network cooperate. A private or yanked dependency may not come back |
| 25 (optional) | Selected stale LaunchAgent or LaunchDaemon `.plist` files | They are unloaded and permanently removed. In batch mode, both `--yes` and `--i-understand-deep` are required; that combination selects every candidate |
| 13 | Runs `sudo periodic` — macOS's own log rotation and maintenance | Not a macleanup deletion as such; macOS decides what it rotates |
| 20 | Flushes DNS/mDNS caches and renews DHCP on `en0` (sudo) | No user data involved; listed for completeness |
| 22 | Triggers macOS to reclaim purgeable space | macOS decides what to purge |

:::danger[Section 14 needs a reboot]
The `/private/var/folders` wipe removes per-user temporary state that running
processes hold open. macOS behaves oddly until you restart. This section asks
for a typed `yes`, it is never part of `--all`, and it needs
`--i-understand-deep` to run unattended.
:::

## Sections that delete nothing

These only read and write a report to `~/.macleanup/reports/`. They are safe
to run at any time, and `--profile audit` bundles them.

| Section | Produces |
|---|---|
| 0 | System health and running-process overview |
| 15 | Installer leftovers report — advisory only |
| 18 | Large files report — everything ≥ 500 MB under `$HOME` |
| 26 | Disk-usage report for `$HOME` and `~/Library` |

## Paths protected in routine cache sections

- **Documents, photos, music and code outside selected cleanup paths.** Section
  23 can remove files inside a matched build directory; section 24 can select a
  large stale personal file; section 21 can move app container data to the Trash;
  section 10 empties whatever is already in the Trash. Review those separately.
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
sections `0, 3, 5, 7, 8, 9, 15, 18, 22, 26`. It does not select any of the six
deep sections (6, 10, 11, 14, 21, 24).

**`--profile minimal --yes` keeps your Trash.** The `minimal` profile is
`5, 7, 8, 9`. To empty Trash unattended with section 10, explicitly select it
and pass both `--yes` and `--i-understand-deep`. Preview any profile with
`--dry-run` before adding `--yes`.

## Next

- [Preview with `--dry-run`](/before-you-run/dry-run) — see the exact paths before anything is removed.
- [Safety model](/before-you-run/safety-model) — the guarantees, and their limits.
- [The 28 sections](/reference/sections) — per-section detail, sudo needs and flags.
