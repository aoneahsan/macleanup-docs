---
title: Installation
description: Three ways to run macleanup on macOS — zero-install with npx, a global npm install, or a direct git checkout that needs no Node at all.
tags: [installation, npx, npm, macos, setup]
sidebar_position: 1
sidebar_label: Installation
keywords: [install macleanup, npx macleanup, mac-cleanup npm, macos cleanup install]
---

# Installation

**macleanup runs three ways, and all three execute the same script with the
same flags.** Pick by how often you will use it: `npx` for an occasional
cleanup, a global install for a regular one, a git checkout if you want to read
every line first or have no Node at all.

## Requirements

| | |
|---|---|
| Operating system | **macOS 11 or later.** The tool refuses to start elsewhere — there is no Linux or Windows port |
| Shell | bash **3.2+** — the version Apple ships, so nothing to install |
| Node.js | Only for methods 1 and 2. The git checkout needs none |
| Architecture | Apple silicon (arm64) and Intel (x64) |
| Disk | The script is a single file, roughly 150 KB |

## Method 1 — Zero install, via `npx` (recommended)

```bash
npx macleanup
```

npm fetches the package into its cache, runs the interactive menu, and
reclaims the cache afterwards. Nothing is installed permanently.

```bash
npx macleanup --dry-run --all   # preview the safe batch, delete nothing
npx macleanup --list            # print every section, then exit
npx macleanup --version         # print the version
```

To force the newest published version, bypassing a stale npx cache:

```bash
npx macleanup@latest --version
```

:::tip[Your logs and reports are never inside the npx cache]
They are written to `~/.mac-cleanup/{logs,reports}/` in your home directory, so
they survive every `npx` invocation and the cache reclaim that follows it. See
[Reports and logs](/reference/reports-and-logs).
:::

## Method 2 — Global install, via `npm`

Best if you run cleanups regularly or from cron, where the per-run npx fetch is
wasted work.

```bash
npm install -g macleanup
```

That puts **two identical commands** on your `PATH`:

```bash
mac-cleanup --version
macleanup --version      # same binary, same behaviour
```

Throughout this documentation the examples use `mac-cleanup`. Substitute
`npx macleanup` or `./mac-cleanup.sh` freely — the argument parsing is
identical.

Updating and removing:

```bash
npm update -g macleanup     # update
npm uninstall -g macleanup  # remove the command
```

Uninstalling the package does **not** remove `~/.mac-cleanup/`. To delete that
data directory too, run [`mac-cleanup --uninstall-data`](/reference/cli#uninstall-data)
before uninstalling, or remove the folder by hand afterwards.

## Method 3 — Direct git checkout, no Node required

The option to choose if you want to read the source before running it — which
is a reasonable thing to want from a tool that deletes files.

```bash
git clone https://github.com/aoneahsan/macleanup.git
cd macleanup
chmod +x mac-cleanup.sh
./mac-cleanup.sh
```

The whole tool is two files:

| File | What it is |
|---|---|
| `mac-cleanup.sh` | The entire tool — plain bash, no dependencies |
| `bin/mac-cleanup.js` | A small Node launcher that only spawns `bash` on the script above; it exists so `npx` works |

Open either in any editor. There is no build step, no minification and no
bundled binary.

## Verify the install

```bash
mac-cleanup --version     # prints the version
mac-cleanup --list        # prints all 28 sections and exits
```

Neither command deletes anything, and `--list` is the fastest way to learn what
the section numbers mean.

## First command to run

Do not start with a real cleanup. Start with a preview:

```bash
mac-cleanup --dry-run --all
```

Then read [Your first run](/getting-started/first-run) for a full walkthrough.

## Optional: a config file

If you find yourself repeating the same thresholds, put them in
`~/.mac-cleanuprc` instead:

```ini
# ~/.mac-cleanuprc
cache-age-days = 60
idle-days = 120
large-file-size-gb = 2
```

Explicit CLI flags always override the file. See
[Configuration](/reference/configuration).

## Troubleshooting the install

| Symptom | Cause and fix |
|---|---|
| `npx: command not found` | Node is not installed. Install it from [nodejs.org](https://nodejs.org), or use method 3, which needs no Node |
| `permission denied: ./mac-cleanup.sh` | The executable bit was lost. `chmod +x mac-cleanup.sh` |
| `this tool only runs on macOS. Detected platform: linux` | There is no Linux port — the script uses macOS-only paths and commands |
| `bash 3.2+ required` | An unusually old bash is being used to invoke the script |

More symptoms and fixes: [Troubleshooting](/troubleshooting).

## Next

- [Your first run](/getting-started/first-run) — a guided session, preview first.
- [What gets deleted](/before-you-run/what-gets-deleted) — read this before any real run.
- [CLI reference](/reference/cli) — every flag.
