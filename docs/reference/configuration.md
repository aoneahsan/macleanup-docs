---
title: Configuration
description: Set macleanup defaults once in ~/.mac-cleanuprc, point logs and reports elsewhere with environment variables, and understand the precedence order between them.
tags: [reference, configuration, config-file, environment]
sidebar_position: 4
sidebar_label: Configuration
keywords: [mac-cleanuprc, macleanup config file, MAC_CLEANUP_LOGS_DIR, macleanup defaults]
---

# Configuration

**macleanup reads defaults from a config file and two environment variables, and
explicit command-line flags always win.** Nothing here changes what a section
does — it changes the numbers a section judges by, and where artefacts are
written.

## Precedence

```
CLI flag  >  environment variable  >  ~/.mac-cleanuprc  >  built-in default
```

The config file is read **before** the command line, so a flag you type always
overrides it.

## The config file

Default location `~/.mac-cleanuprc`, or wherever `$MAC_CLEANUP_RC` points.

```ini
# ~/.mac-cleanuprc
# Lines starting with # are comments. Blank lines are ignored.

cache-age-days = 60
idle-days = 120
large-file-size-gb = 2
notify = true
```

### Recognised keys

| Key | Type | Equivalent flag |
|---|---|---|
| `cache-age-days` | int | [`--cache-age-days`](/reference/cli#cache-age-days) |
| `idle-days` | int | [`--idle-days`](/reference/cli#idle-days) |
| `threshold` | int | [`--threshold`](/reference/cli#threshold) |
| `stale-build-days` | int | [`--stale-build-days`](/reference/cli#stale-build-days) |
| `large-file-days` | int | [`--large-file-days`](/reference/cli#large-file-days) |
| `large-file-size-gb` | int | [`--large-file-size-gb`](/reference/cli#large-file-size-gb) |
| `scan-roots` | string | [`--scan-roots`](/reference/cli#scan-roots) |
| `quiet` | `1` / `true` | [`--quiet`](/reference/cli#quiet) |
| `notify` | `1` / `true` | [`--notify`](/reference/cli#notify) |
| `brew-autoremove` | `1` / `true` | [`--brew-autoremove`](/reference/cli#brew-autoremove) |

Any other key is ignored.

### How the file is parsed

Worth knowing, because it is a file that influences a tool that deletes things:

- It is read with `read` — **never sourced and never `eval`'d**. A shell
  command in the file is not executed.
- Only the whitelisted keys above are honoured.
- A malformed line produces a warning and is skipped. A stray line cannot brick
  the tool.

### What the file cannot do

There is no key for `--dry-run`, `--yes`, `--i-understand-deep`, `--only`,
`--all` or `--profile`. **Which sections run, and whether they are confirmed,
is always an explicit decision at the command line.** That is deliberate: a
config file should never be able to turn a preview into a deletion.

## Environment variables

| Variable | Equivalent flag |
|---|---|
| `MAC_CLEANUP_LOGS_DIR` | [`--logs-dir`](/reference/cli#logs-dir) |
| `MAC_CLEANUP_REPORTS_DIR` | [`--reports-dir`](/reference/cli#reports-dir) |
| `MAC_CLEANUP_RC` | Path to the config file (default `~/.mac-cleanuprc`) |

```bash
export MAC_CLEANUP_LOGS_DIR=/var/log/mac-cleanup
export MAC_CLEANUP_REPORTS_DIR=/var/log/mac-cleanup/reports
```

CLI flags take precedence when both are set.

## Useful configurations

### A cautious default

Raise the thresholds so only genuinely ancient things qualify, and keep a
project tree out of the scanning sections:

```ini
# ~/.mac-cleanuprc
cache-age-days = 180
idle-days = 365
large-file-size-gb = 5
scan-roots = /Users/you/Code:/Users/you/Projects
```

### A frequent-cleaner default

If you sweep weekly, the 100-day defaults rarely match anything:

```ini
# ~/.mac-cleanuprc
cache-age-days = 30
idle-days = 60
stale-build-days = 45
notify = true
```

### A per-project config

`MAC_CLEANUP_RC` lets a repo carry its own settings without touching your home
directory:

```bash
MAC_CLEANUP_RC=./tools/macleanup.rc mac-cleanup --only 23 --dry-run
```

## Verify what is in effect

`--help` prints the inline help **with the defaults from your runtime config
baked in**, so it is the quickest way to confirm the file was read:

```bash
mac-cleanup --help
```

If a value looks wrong, check for a `MAC_CLEANUP_RC` in your shell environment
pointing somewhere unexpected:

```bash
echo "${MAC_CLEANUP_RC:-~/.mac-cleanuprc}"
```

## Next

- [CLI reference](/reference/cli) — every flag these keys mirror.
- [Reports and logs](/reference/reports-and-logs) — what the directories hold.
- [Recipes](/recipes) — commands that combine config with flags.
