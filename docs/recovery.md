---
title: Recovery
description: What to do when a cleanup removed something you needed — including the exact commands to restore global developer tooling broken by the v4.3.0 section 23 bug.
tags: [recovery, incident, restore, 4.3.0, safety]
sidebar_position: 2
sidebar_label: Recovery
keywords: [macleanup broke my tools, restore bun pnpm after cleanup, macleanup 4.3.0 bug, brew autoremove undo]
---

# Recovery

**macleanup has no undo.** The Trash is the only built-in second chance, and it
covers only sections 21 and 24. Everything else is restored from a backup, or
by reinstalling.

This page covers the general recovery paths, and then the specific v4.3.0
incident that gave section 23 its safety rails.

## First: check the Trash

Sections 21 (app uninstall) and 24 (large stale files) **move** items rather
than deleting them. If you have not emptied the Trash — including via section
10 in the same session — open it and put them back:

```bash
open ~/.Trash
```

In Finder, right-click an item and choose **Put Back** to restore it to its
original location.

:::caution Two things break this
Emptying the Trash, and the `osascript` Automation permission being denied. In
the second case section 21 falls back to a direct removal instead of the Finder
move-to-Trash, so nothing lands in the Trash at all. See
[Troubleshooting](/troubleshooting).
:::

## Then: check your snapshots

If you took a snapshot before running — which is why the docs keep suggesting
it — you can browse it:

```bash
tmutil listlocalsnapshots /
```

Restore through Time Machine's UI, or mount the snapshot to copy individual
files out.

If you ran section 11, local snapshots were deleted, and this path is closed.

## What is genuinely unrecoverable

Honestly stated, because knowing early saves time spent looking for an option
that does not exist:

| Removed by | Recoverable? |
|---|---|
| Section 10 — emptied Trash | No. Backup only |
| Section 11 — Time Machine local snapshots | No |
| Section 12 — orphaned app data | No |
| Section 14 — `/private/var/folders` | No, and it is meant to be transient. Reboot |
| Section 16 — iOS device backups | No. Re-back-up the device if you still have it |
| Section 17 — Xcode archives | No. A shipped build's crashes can no longer be symbolicated |
| Section 23 — build directories | Only by reinstalling, and only while the lockfile resolves |
| Sections 1–9, 19, 27 — caches and logs | Nothing to recover; they regenerate |

## The v4.3.0 section 23 incident {#the-430-incident}

**v4.3.0 had a bug that broke globally installed developer tools.** Section 23
could enter toolchain-manager directories — `~/.bun`, `~/.pnpm-store`,
`~/.local/share/pnpm`, `~/.npm-packages`, `~/.volta` — and remove
`node_modules`-shaped folders inside them.

**Fixed in 4.3.1** by the `CRITICAL_HOME_DIRS` allowlist, which makes section
23 refuse to enter those paths regardless of timestamps, and by removing the
silent `$HOME` fallback so the section errors out and asks for `--scan-roots`
rather than scanning your whole home directory.

You were affected if you ran 4.3.0 with `--scan-roots $HOME`, or a 4.3.0 that
fell back to `$HOME` on its own, and your global tools then stopped working.

### Restoring the common toolchains

```bash
# bun — one curl line reinstalls it cleanly
curl -fsSL https://bun.sh/install | bash

# pnpm — corepack ships with Node 16+, no extra install needed
corepack enable
corepack prepare pnpm@latest --activate
# then re-install your global pnpm packages, for example:
pnpm add -g typescript ts-node prettier eslint

# yarn — the same corepack path
corepack prepare yarn@stable --activate

# nvm + Node — if ~/.nvm survived, just re-source it
source "$HOME/.nvm/nvm.sh"
nvm use --lts

# global npm packages — reinstall from a recent npm-shrinkwrap if you have
# one; otherwise list them manually
npm install -g typescript prettier serve

# Volta, asdf, fnm, Deno, rbenv, pyenv, rustup — re-run their installers
curl https://get.volta.sh | bash
curl https://raw.githubusercontent.com/asdf-vm/asdf/master/bin/install | sh
curl -fsSL https://fnm.vercel.app/install | bash
curl -fsSL https://deno.land/install.sh | sh
```

### If `brew autoremove` uninstalled a formula

This happened when 4.3.0 ran in `--all` mode and one of your tools'
dependencies was judged "no longer needed" — in practice `node`, `python` or
`openssl`, which silently breaks everything built on them.

```bash
brew log                                    # recently uninstalled formulae
brew install node python openssl            # reinstall what you still want
```

**`brew autoremove` has been opt-in since 4.3.1** via
[`--brew-autoremove`](/reference/cli#brew-autoremove). It is not part of the
default flow.

### Why this matters beyond 4.3.0

The incident is the strongest practical argument for the habits this
documentation keeps repeating:

- **Preview with `--dry-run` before any real run.** The bad paths would have
  been visible in a preview.
- **Give section 23 explicit `--scan-roots`.** Never let a scanning section
  guess where your code lives.
- **Protect active work with `--exclude-path`.** It is repeatable, and it costs
  one flag.

## If a project's dependencies were removed

Section 23 deletes build directories, not source. Your code and lockfile are
intact, so reinstall:

```bash
cd ~/path/to/project
npm ci            # or: yarn install --immutable / pnpm install --frozen-lockfile
```

This works while the lockfile resolves and the registry still serves those
versions. A private registry you have lost access to, or a yanked version, will
not come back — which is exactly why section 23 is classified as a permanent
deletion in [What gets deleted](/before-you-run/what-gets-deleted).

## Preventing the next one

```bash
# Snapshot before a large run
tmutil snapshot

# Preview everything, always
mac-cleanup --profile deep --dry-run

# Be explicit about scan roots, and protect what is live
mac-cleanup --only 23 \
  --scan-roots "$HOME/Code:$HOME/repos" \
  --exclude-path "$HOME/Code/active-client" --dry-run

# Keep thresholds conservative in ~/.mac-cleanuprc
```

## Reporting a data-loss bug

If macleanup removed something it should not have, that is worth reporting —
the `CRITICAL_HOME_DIRS` allowlist exists because someone reported exactly
that.

```bash
mac-cleanup --report-issue
```

For anything with a security dimension — path traversal, an unintended
`rm -rf`, a data-leak scenario — email **aoneahsan@gmail.com** privately
instead of opening a public issue.

## Next

- [Troubleshooting](/troubleshooting) — symptom-to-fix for non-data-loss problems.
- [Safety model](/before-you-run/safety-model) — the rails added after this incident.
- [What gets deleted](/before-you-run/what-gets-deleted) — reversible versus not.
