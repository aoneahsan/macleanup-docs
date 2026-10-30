---
title: Privacy in the desktop app
description: What the macleanup desktop app keeps on your Mac and what it syncs — no telemetry, file paths never leave the Mac, and a signed-in sync of section ids, byte counts, statuses and the macOS version only.
tags: [desktop-app, privacy, sync]
sidebar_position: 5
sidebar_label: Privacy in the app
keywords: [macleanup privacy, macleanup telemetry, macleanup sync, macleanup data, macleanup account]
---

# Privacy in the desktop app

**File paths never leave your Mac.** The app has no telemetry: no analytics,
advertising or tracking tools. It reads folders on your Mac to measure them,
shows you the result, and sends that information nowhere.

## On your Mac {#on-your-mac}

Logs, reports, receipts and archives are written to `~/.macleanup/` and stay
there, shared with the command line. Settings live in `~/.macleanuprc` and in
the app's local storage.

## What syncs when you sign in {#sync}

An account is optional. Signed in with Google, each run summary syncs **only**:

| Synced | Never synced |
|---|---|
| Section ids | File and folder paths |
| Byte counts | File names or contents |
| Statuses — completed, skipped, failed | Reports, logs and receipts |
| macOS version | Archives |

The account itself holds your email address and name from Google, your plan,
your monthly run count and your saved shortcuts. It is stored with Supabase,
the backend provider. Payments go through Polar, which tells the app your plan
and payment status; the card number never reaches macleanup.

The same rule is a guarantee of the [JSON event stream](/reference/json-events#guarantees):
`path` appears only in the local stream, log and report.

## Network requests {#network}

- **Update check** — contacts GitHub Releases.
- **Sign-in and sync** — only when you sign in.
- **Checkout** — opens in your browser.
- **Release notice** — the app reads the newest release notice from the backend
  provider at start, every 15 minutes and when you return. It sends the
  product's version and nothing about you.
- **Assistant** — only when you ask. It sends your question and per-section
  numbers, sizes and counts, never paths. Answers come from Anthropic's Claude
  models through FilesHub; a spoken question is transcribed by Groq and the
  recording is not stored. See [Assistant and backups](/desktop-app/assistant).
- **Receipt backups** — only on Pro or Team, when you back up or restore. The
  summary is stored privately with FilesHub and holds no paths.

Each service receives normal request details such as an IP address.

You can download your account data or delete your account from the Account
screen. Deleting it removes the account, plan record, synced run numbers and receipt
backups from the servers; everything on your Mac stays until you remove it. The full
policy is the
[Privacy Policy](https://macleanup.aoneahsan.com/privacy).

## Next

- [Plans and allowance](/desktop-app/plans)
- [FAQ](/faq) — privacy questions about the command line.
