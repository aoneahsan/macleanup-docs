---
title: The 28 sections
description: Every macleanup section from 0 to 27 — what it removes, whether it needs sudo, whether it is reversible, and which flags tune it.
tags: [reference, sections, macos, cleanup, sudo]
sidebar_position: 2
sidebar_label: The 28 sections
keywords: [macleanup sections, mac-cleanup section 23, section 21 uninstall, macleanup section list]
---

# The 28 sections

**macleanup is organised as twenty-eight numbered sections, and nothing runs
unless you select it** — from the interactive menu, by number with `--only`, or
as part of `--all` / `--profile`.

Print the live catalogue at any time:

```bash
mac-cleanup --list
```

## Legend

| Column | Meaning |
|---|---|
| **Sudo** | Needs root. Skipped, never half-run, when sudo is unavailable or `--no-sudo` is set |
| **Risk** | 🟢 regenerates · 🟡 goes to the Trash · 🔴 permanently deleted · ⚪️ report only |
| **In `--all`** | Part of the safe batch `0, 3, 5, 7, 8, 9, 15, 18, 22, 26` |
| **Deep** | Requires `--i-understand-deep` on top of `--yes` to run unattended |

## The full catalogue

| # | Section | Sudo | Risk | In `--all` | Deep |
|---|---|:-:|:-:|:-:|:-:|
| 0 | System health and process monitor | — | ⚪️ | ✅ | — |
| 1 | Xcode caches, DerivedData, simulators | — | 🟢 | — | — |
| 2 | Android / Gradle caches | — | 🟢 | — | — |
| 3 | Package-manager caches | — | 🟢 | ✅ | — |
| 4 | Docker prune | — | 🟢 | — | — |
| 5 | User caches | — | 🟢 | ✅ | — |
| 6 | System caches (`/Library/Caches`) | ✅ | 🟢 | — | ✅ |
| 7 | Logs, user and system | ✅ | 🟢 | ✅ | — |
| 8 | Temp files | — | 🟢 | ✅ | — |
| 9 | Update caches | ✅ | 🟢 | ✅ | — |
| 10 | Empty Trash | — | 🔴 | — | — |
| 11 | Time Machine local snapshots | ✅ | 🔴 | — | ✅ |
| 12 | Orphaned app-data scan | — | 🔴 | — | — |
| 13 | System maintenance (`periodic`) | ✅ | 🟢 | — | — |
| 14 | Deep cache `/private/var/folders` — **needs reboot** | ✅ | 🔴 | — | ✅ |
| 15 | Installer leftovers report | — | ⚪️ | ✅ | — |
| 16 | iOS / iPadOS device backups | — | 🔴 | — | — |
| 17 | Xcode archives | — | 🔴 | — | — |
| 18 | Large files report (≥ 500 MB in `$HOME`) | — | ⚪️ | ✅ | — |
| 19 | Browser caches | — | 🟢 | — | — |
| 20 | DNS / mDNS reset | ✅ | 🟢 | — | — |
| 21 | Apps unused N+ days — review or bulk uninstall | — | 🟡 | — | ✅ |
| 22 | Purgeable space trigger | — | 🟢 | ✅ | — |
| 23 | Stale build artefacts N+ days | — | 🔴 | — | — |
| 24 | Large stale files ≥ N GB, unused N+ days | — | 🟡 | — | ✅ |
| 25 | LaunchAgents / LaunchDaemons audit | ✅* | ⚪️ | — | — |
| 26 | Disk-usage report | — | ⚪️ | ✅ | — |
| 27 | macOS UI maintenance — QuickLook + font caches | ✅† | 🟢 | — | — |

\* Sudo only when removing items under `/Library/`.
† Sudo only for the optional system-wide font-cache clear. Menu / `--only` only.

## Read-only sections

These write a dated `.txt` to `~/.mac-cleanup/reports/` and delete nothing.
`--profile audit` bundles them.

### Section 0 — System health and process monitor

An overview of system state and running processes. Purely diagnostic.

### Section 15 — Installer leftovers report

Lists installer remnants it can identify. Advisory — it removes nothing.

### Section 18 — Large files report

Everything ≥ 500 MB under `$HOME`. Unlike section 24 this applies **no age
filter**, so it is the right section when you want to see big files regardless
of when you last opened them.

### Section 25 — LaunchAgents / LaunchDaemons audit

Finds orphaned login items — launch entries whose target no longer exists. Only
needs sudo if you choose to remove something under `/Library/`.

### Section 26 — Disk-usage report

Per-directory usage for `$HOME` and `~/Library`. Usually the fastest answer to
"where did my disk go".

## Cache sections

### Section 1 — Xcode caches, DerivedData, simulators

Age-aware pruning of `~/Library/Developer/Xcode/DerivedData`, the `iOS`,
`tvOS` and `watchOS DeviceSupport` directories, Xcode `Logs`,
`DocumentationCache` and `~/Library/Caches/com.apple.dt.Xcode`. Also runs
`xcrun simctl delete unavailable`.

A **separate optional confirmation** offers to wipe
`~/Library/Developer/CoreSimulator` entirely — that loses every simulator's
saved state, resetting installed apps to first-run.

Tuned by `--cache-age-days`. Recently built projects survive even when the
parent folder is huge, because the age check reads atime as well as mtime.

### Section 2 — Android / Gradle caches

Age-aware pruning of Gradle build caches and Android SDK build caches. Tuned by
`--cache-age-days`.

### Section 3 — Package-manager caches

npm, yarn, pnpm, Homebrew, pip, CocoaPods, cargo, go, Ruby and Flutter caches.
Everything removed here is re-downloadable, which makes this the highest-value,
lowest-risk section on most developer machines.

`brew autoremove` is **off by default** and must be opted into with
`--brew-autoremove` — it can uninstall formulae that are now considered unused
dependencies and break globally installed tools. See [Recovery](/recovery).

### Section 4 — Docker prune

Prunes containers, images and volumes. The Docker daemon must be running or the
section is skipped.

### Section 5 — User caches

Sweeps `~/Library/Caches`, optionally `~/Library/Saved Application State`
(default yes, separate confirmation) and `~/Library/Logs/DiagnosticReports`.

**Always preserved:** Apple entries (`com.apple.*`), every supported browser,
password managers (1Password, Bitwarden, KeePassXC), and `Caches/node` —
deleting the last of these would break every corepack-pinned yarn or pnpm.

Clearing Saved Application State means apps stop reopening the windows you left
open. That is expected behaviour, not a fault.

### Section 6 — System caches {#section-6}

Sweeps non-Apple entries from `/Library/Caches`. Apple caches are preserved.
**Requires sudo** — the sudo gate is the confirmation. Deep-gated.

### Section 7 — Logs

Prunes user and system log files, with different age thresholds per location.
Only old files go. Sudo is needed for the system-log portion.

### Section 8 — Temp files

Entries in `$TMPDIR`, `/tmp` and `~/tmp` — user-owned files only.

### Section 9 — Update caches

Downloaded macOS update caches. Sudo required.

### Section 19 — Browser caches

Clears HTTP and code caches across **every profile**, not just `Default`.

**Chromium family:** Chrome, Chrome Canary, Brave, Edge, Vivaldi, Chromium,
Opera, Opera GX, DuckDuckGo, Arc. Only these subdirectories are touched:
`Cache`, `Code Cache`, `GPUCache`, `DawnGraphiteCache`, `DawnWebGPUCache`,
`Service Worker/CacheStorage`, `Service Worker/ScriptCache`.

**Firefox family:** Firefox, Developer Edition, Nightly, LibreWolf, Floorp,
Zen — the top-level cache entry plus per-profile `cache2`.

**Profile data, history, logins, bookmarks and extensions are left intact.**
Safari is advisory only: macleanup tells you to clear it via Safari's own menu.

Expect slower page loads until things re-cache, and possibly being signed out
of some sites.

### Section 20 — DNS / mDNS reset

`dscacheutil -flushcache`, `killall -HUP mDNSResponder`, and
`ipconfig set en0 DHCP` when `en0` exists. All sudo. No user data involved.

### Section 22 — Purgeable space trigger

Asks macOS to reclaim purgeable space. macOS decides what is actually purged.

### Section 27 — macOS UI maintenance

Clears the QuickLook thumbnail cache and font caches. Sudo only for the
optional system-wide font clear. Menu / `--only` only — never in `--all`.

## Destructive sections

### Section 10 — Empty Trash

Counts, then empties `~/.Trash` after an explicit confirmation, and then the
per-user trash on each mounted **external** volume — each with its own
confirmation and size count. The boot volume and read-only mounts are skipped.

:::danger This is irreversible
Emptying the Trash also gives up the recovery option for anything sections 21
and 24 moved there earlier in the same session.

Section 10 is not in the `--all` safe batch, but it **is** in the `minimal`
profile, and it is not one of the five deep-gated sections — so
`--profile minimal --yes` will empty your Trash without asking again.
:::

### Section 11 — Time Machine local snapshots

Lists APFS local snapshots via `tmutil listlocalsnapshots /` and deletes the
ones you confirm. Sudo required. Deep-gated.

These snapshots are your local rollback points; deleting them removes the
ability to restore recent local changes. APFS may not report the freed space
immediately — it reclaims lazily, so an unchanged `df -h /` is expected.

### Section 12 — Orphaned app data

Scans `~/Library` for application data whose parent app is no longer installed,
and offers it for removal. Interactive.

Subject to the [two-condition rule](/before-you-run/safety-model#the-two-condition-rule):
an item is deleted automatically only when it is both unmatched by any
installed app **and** untouched for at least `--idle-days` days.

"Orphaned" is a heuristic. Review the list rather than confirming blind.

### Section 13 — System maintenance (`periodic`)

Runs macOS's own `periodic` maintenance — mostly log rotation. Sudo required.
Removed from the `--all` safe batch in 4.5.0 because running privileged system
maintenance unattended is a different thing from clearing a cache.

### Section 14 — Deep cache `/private/var/folders` {#section-14}

Wipes the per-user deep cache. **Requires a reboot afterwards** — macOS behaves
oddly until you restart, because running processes hold this state open.

The strongest gate in the tool: sudo, a **typed `yes`** (not just `y`), never
part of `--all`, and `--i-understand-deep` to run unattended.

### Section 16 — iOS / iPadOS device backups

Lists device backups for per-device review and deletes the ones you confirm.

`--idle-days` only **highlights** here with an `[idle ≥Nd]` marker — there is
no delete gate, and the section will delete any backup you confirm, recent or
not. A device backup can be the only copy of a phone's data.

### Section 17 — Xcode archives

Per-archive review and deletion. `--idle-days` highlights only, as in section
16.

Archives hold the dSYMs needed to symbolicate crash reports from builds you
have already shipped. Deleting the archive for a released build means you can
no longer symbolicate its crashes.

### Section 21 — Apps unused N+ days {#section-21}

Finds applications idle for at least `--threshold` days (default 100) and
offers review or bulk uninstall, with multi-select.

An uninstall moves the app to the **Trash** and removes its known companion
data — application support, caches, preferences, containers and Group
Containers. That is what makes it a real uninstall, and it also means the app's
local data goes with it. Export anything you need from an app's container
first.

Idle detection uses five signals and **skips any app with no usable signal**,
deliberately under-flagging.

Deep-gated. `--only 21 --yes --i-understand-deep` uninstalls every idle app
with no further prompt.

### Section 23 — Stale build artefacts {#section-23}

Sweeps your scan roots for build directories — `node_modules`, `vendor`,
`dist`, `.next`, `target`, `Pods` and similar — untouched for at least
`--stale-build-days` days (falls back to `--idle-days`; default 100).

**Permanently deleted, not moved to the Trash.** Reinstallable in principle,
but only while the lockfile resolves and the registry still serves those
versions.

Two safety rails, both added after the v4.3.0 incident:

- A hard `CRITICAL_HOME_DIRS` allowlist. Section 23 refuses to enter `~/.bun`,
  `~/.pnpm-store`, `~/.local/share/pnpm`, `~/.npm-packages`, `~/.volta` and
  their peers regardless of timestamps.
- **No silent `$HOME` fallback.** If no standard dev folder exists and no
  `--scan-roots` was given, it errors out and asks for roots.

Protect additional trees with the repeatable `--exclude-path`.

### Section 24 — Large stale files

Finds files at least `--large-file-size-gb` GB (default 1) whose atime **and**
mtime are at least `--large-file-days` days old (default 100), and moves the
ones you confirm to the **Trash**. Deep-gated.

Because both timestamps count, a large file you merely opened recently is not
flagged. If you expected a file to appear and it did not, that is why — lower
the threshold or use section 18, which has no age filter.

## Interactive multi-select

When a section asks **"Select items (1..N)"**:

| Input | Meaning |
|---|---|
| `all` or `a` | Every item |
| `none` or empty | Nothing |
| `1,3,5-7,12` | Items 1, 3, 5, 6, 7, 12 |
| `7-3` | Reversed range — auto-swapped to 3..7 |

Out-of-range or junk tokens are silently ignored.

## Next

- [CLI reference](/reference/cli) — the flags that tune these sections.
- [Profiles](/reference/profiles) — which sections each bundle runs.
- [Safety model](/before-you-run/safety-model) — the gates in detail.
