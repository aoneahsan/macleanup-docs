---
title: Install the desktop app
description: Install the macleanup desktop app on macOS 11 or later — one disk image for Apple silicon and Intel, the one-time Gatekeeper Open Anyway step, optional Full Disk Access, and in-app updates.
tags: [desktop-app, installation, gatekeeper, full-disk-access]
sidebar_position: 2
sidebar_label: Install and first launch
keywords: [install macleanup app, macleanup gatekeeper, open anyway macos, macleanup full disk access, macleanup dmg]
---

# Install the desktop app

**The desktop app is one disk image for Apple silicon and Intel Macs, on
macOS 11 or later.** It shipped with macleanup 5.2.0 on 30 October 2026. Get it
from the [download page](https://macleanup.aoneahsan.com/download) or the
[GitHub release](https://github.com/aoneahsan/macleanup/releases/latest).

| | |
|---|---|
| Requires | macOS 11 or later |
| Chips | Apple silicon and Intel |
| Updates | Checked in the app; update packages are signed and verified by the app |
| Command line | Not required. `npx macleanup` keeps working beside the app |

## Install {#install}

1. Open the disk image.
2. Drag macleanup into Applications.
3. Open macleanup from Applications.

## The first time macOS refuses to open it {#gatekeeper}

macleanup is not signed with an Apple developer certificate yet, so the first
launch may be refused. You allow it **once**:

1. Open **System Settings → Privacy & Security**.
2. Scroll to **Security**.
3. Choose **Open Anyway** next to macleanup.

After that it opens normally.

## Full Disk Access is optional {#full-disk-access}

Without Full Disk Access, macOS hides Mail, Messages and some Library folders
from the app. Sections still run; **they skip what they cannot see and the
receipt says so**.

To grant it:

1. Open **System Settings → Privacy & Security → Full Disk Access**.
2. Turn on macleanup.
3. Return to the app.

## Updates {#updates}

The app checks for updates itself when it starts and every 6 hours. With
**Install updates automatically** on, it downloads the signed update and
relaunches at a quiet moment — never during a run. The check contacts GitHub
Releases, which receives normal request details such as an IP address. See
[Privacy in the app](/desktop-app/privacy).

### Required updates {#required-updates}

Sometimes an update must be installed before you continue, for example when it
fixes a safety rule. The app checks for a release notice when it starts, every
15 minutes and when you come back to it:

- **Urgent:** the app stops and shows the reason with one **Update now**
  button. It installs the update and relaunches; your receipts and settings
  stay.
- **Normal:** the app tells you a new version is out and that it is required
  from the next start. From the next start it asks you to update first.

If the notice cannot be read, for example offline, the app keeps working. This
website and the documentation use the same notices; there **Update now**
reloads the page.

## Next

- [Plans and allowance](/desktop-app/plans) — previews are always free.
- [Preview with `--dry-run`](/before-you-run/dry-run) — what a preview does and does not prove.
