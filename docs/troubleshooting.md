---
title: Troubleshooting
description: Symptom, cause and fix for the problems people actually hit with macleanup — install failures, sections that find nothing, permission prompts and slow scans.
tags: [troubleshooting, errors, fixes, support]
sidebar_position: 1
sidebar_label: Troubleshooting
keywords: [macleanup not working, macleanup command not found, section 23 finds nothing, macleanup permission]
---

# Troubleshooting

**Symptom, then cause, then fix.** For "why does it work this way" questions,
read the [FAQ](/faq) instead. For restoring tooling removed by the v4.3.0
section 23 bug, go to [Recovery](/recovery).

If nothing here helps:

```bash
macleanup --report-issue
```

That opens a pre-filled GitHub issue with environment info gathered **locally**.
Nothing is transmitted until you press Submit.

## Install and invocation

### `npx: command not found`

Node is not installed. Install it from [nodejs.org](https://nodejs.org), or use
the [git checkout method](/getting-started/installation), which needs no Node.

### `permission denied: ./macleanup.sh`

The executable bit was lost — usually via a zip extraction or a copy between
volumes.

```bash
chmod +x macleanup.sh
./macleanup.sh
```

### `command not found: macleanup` after `npm install -g`

Your shell's `PATH` does not include npm's global bin directory.

```bash
npm config get prefix          # e.g. /usr/local
echo $PATH | tr ':' '\n'       # is <prefix>/bin in there?
```

Add it to `~/.zshrc` (or `~/.bash_profile`) and re-source:

```bash
export PATH="$(npm config get prefix)/bin:$PATH"
```

`which macleanup` should then resolve.

### `bundled script not found at …macleanup.sh`

The npm package is corrupt or was partially extracted.

```bash
npm uninstall -g macleanup
npm cache clean --force
npm install -g macleanup
```

Or bypass the cache entirely: `npx --yes macleanup --version`.

### `this tool only runs on macOS. Detected platform: linux`

There is no fix and no Linux port. macleanup reads macOS-specific paths
(`~/Library`, `/private/var/folders`, APFS snapshots) and calls `tmutil`,
`xcrun`, `dscacheutil`, `mDNSResponder`, `launchctl` and `osascript`. None of
those have Linux equivalents.

### `bash 3.2+ required`

An unusually old bash is being used. Run it through the system bash:

```bash
/bin/bash --version
/bin/bash macleanup.sh
```

### `Unknown option` on a flag that exists

Before 4.5.1 the `--flag=value` form was rejected with exit code 2. Either
upgrade, or use the space-separated form:

```bash
macleanup --cache-age-days 30    # always works
macleanup --cache-age-days=30    # 4.5.1 and later
```

## A section finds nothing

### "No large stale files found" — but Finder shows a 5 GB file

Section 24 requires **both** `atime` and `mtime` to be older than the
threshold. If you opened the file recently, its access time is fresh and it is
not flagged. That is the safety rule working, not a bug.

```bash
macleanup --only 24 --large-file-days 30 --dry-run   # narrower window
macleanup --only 18                                  # by size only, no age filter
```

### Section 23 reports zero stale builds, but the old `node_modules` is right there

Three possible causes:

**Your editor is keeping the atime fresh.** A language server reading files for
autocomplete counts as access. Lower the threshold:

```bash
macleanup --only 23 --stale-build-days 30 --dry-run
```

**The directory is inside a protected toolchain path.** Section 23 will never
enter `~/.bun`, `~/.pnpm-store`, `~/.local/share/pnpm`, `~/.npm-packages`,
`~/.volta` or their peers. Toolchain caches are section 3's job:

```bash
macleanup --only 3
```

**Your scan roots do not cover it.** Say where your code lives:

```bash
macleanup --only 23 --scan-roots "$HOME/repos:$HOME/work:$HOME/code" --dry-run
```

### Section 23 errors: "no scan roots found, pass `--scan-roots`"

Working as intended. Section 23 refuses to silently scan all of `$HOME` — that
was [the v4.3.0 bug](/recovery). It auto-detects the standard dev folders
(`~/Projects`, `~/Code`, `~/Developer`, `~/dev`, `~/repos`, `~/work`,
`~/Documents`, `~/Desktop`, `~/Downloads`) and, finding none, asks you to be
explicit:

```bash
macleanup --only 23 --scan-roots "$HOME/path/to/your/code"
```

### Section 21 missed an app I have not used in years

None of the five last-used signals produced a usable date, so the app was
skipped — the tool deliberately under-flags rather than risk a false positive.

Common reasons: Spotlight is re-indexing after a macOS update or an
`mdutil -E /`; the app was installed but never opened, so no "last used" data
exists anywhere; or the app keeps its state outside the standard locations.

There is no automatic fix. Wait for Spotlight to finish, or drag the app to the
Trash yourself.

### Docker section says the daemon is not running

Start Docker Desktop and wait for the whale icon to settle, then re-run
section 4. Or skip it:

```bash
macleanup --all --exclude 4 --yes
```

### `xcrun simctl delete unavailable failed`

Xcode is open or building and holds a lock on the simulator runtime. Quit Xcode
completely and re-run section 1.

## Deletions that did not take effect

### The Trash did not actually empty

A file in it is locked, in use by a running app, or owned by another user.

```bash
ls -la  ~/.Trash/       # what is still there
ls -laO ~/.Trash/       # a 'uchg' flag means user-immutable
chflags -R nouchg ~/.Trash/
macleanup --only 10
```

### Time Machine snapshots were deleted but free space did not change

Expected. APFS reclaims snapshot space **lazily**, when the disk actually needs
it. Either trigger a purge or simply wait:

```bash
macleanup --only 22
```

### A section was skipped with a sudo message

The section needs root and either sudo was unavailable or you passed
`--no-sudo`. macleanup skips such sections rather than half-running them. The
sudo sections are 6, 7 (system logs), 9 (system updates), 11, 13, 14, 20, 25
(system LaunchAgents) and 27 (optional font clear only).

### A deep section was refused in batch mode

Also expected. Sections 6, 10, 11, 14, 21 and 24 need `--i-understand-deep`
**in addition to** `--yes` to run unattended:

```bash
macleanup --only 21 --yes                       # refused, warns and skips
macleanup --only 21 --yes --i-understand-deep   # runs
macleanup --only 21 --yes --dry-run             # preview always allowed
```

## Permissions

### `osascript` keeps asking for Automation permission

macOS requires explicit permission for one app to control another — Finder, in
this case, for move-to-Trash and the notification banner.

Open **System Settings → Privacy & Security → Automation**, find your terminal
(Terminal, iTerm, Warp…), and allow it to control **Finder** and **System
Events**.

`--notify` controls the completion notification, not Finder's Trash operation.
If Finder access is denied, sections 12 and 21 warn and leave affected items
in place. Grant the permission before retrying those sections.

## Logs and reports

### `~/.macleanup/` does not exist

Nothing that writes has run yet — `--list` and `--version` do not create it.
Run any section:

```bash
macleanup --only 0
```

### Report files stopped appearing

Either `--no-reports` is in play, or `MACLEANUP_REPORTS_DIR` points somewhere
you cannot write.

```bash
echo "$MACLEANUP_REPORTS_DIR"
macleanup --reports-dir ~/.macleanup/reports --only 23 --dry-run
ls -la ~/.macleanup/reports/
```

### Logs are piling up

One file per day, kept forever, roughly 50 KB each. After a few years that adds
up:

```bash
macleanup --prune-history 90            # built-in prune
macleanup --cleanup-logs-on-finish      # per-run: delete this run's log
macleanup --uninstall-data              # remove ~/.macleanup entirely
```

### A dry run reported `freed_kb: 0`

Fixed in 4.6.1. Earlier versions printed per-folder "would clear" notes but
never tallied a total, so a preview always showed `0 B`. Upgrade:

```bash
npx macleanup@latest --version
```

## Performance

### Section 18 or 24 takes a long time

Both walk all of `$HOME`, which is slow on a large home directory.

Section 18 is read-only — let it finish; a minute or so is typical. Section 24
can be narrowed:

```bash
macleanup --only 24 --large-file-size-gb 5 --large-file-days 365 --dry-run
```

### Section 23 is slow

Give it precise roots instead of letting it walk broad ones:

```bash
macleanup --only 23 --scan-roots "$HOME/Code" --dry-run
```

`~/Downloads` and `~/Documents` are auto-detected roots and are often the
largest and least interesting for build artefacts.

## Still stuck

```bash
macleanup --stats          # what has run, and where the logs are
macleanup --check-update   # is a newer version published?
macleanup --report-issue   # pre-filled GitHub issue, locally gathered info
```

The last 50 lines of your most recent log are copied to the clipboard (when
`pbcopy` is available) so you can paste them straight into the issue.

## Next

- [Recovery](/recovery) — restoring tools removed by the v4.3.0 bug.
- [FAQ](/faq) — the "why does it work this way" questions.
- [Safety model](/before-you-run/safety-model) — what the gates guarantee.
