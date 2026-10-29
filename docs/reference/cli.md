---
title: CLI reference
description: Every macleanup command-line flag — selection, confirmation, thresholds, output, persistence and informational commands — with defaults, examples and exit codes.
tags: [reference, cli, flags, options]
sidebar_position: 1
sidebar_label: CLI reference
keywords: [macleanup flags, macleanup options, macleanup cli reference, dry-run, only, profile]
---

# CLI reference

**Every flag macleanup accepts, what it does, and when to use it.** The flag
set is identical however you invoke the tool — `npx macleanup`, the global
`macleanup` binary and a direct `./macleanup.sh` all parse the same
arguments.

```
macleanup [options]
```

With no options, macleanup prints a one-time welcome (first run on a machine)
and drops into the interactive menu, where you choose one section at a time
with a confirmation before every destructive operation.

Both `--flag value` and `--flag=value` forms are accepted (the `=` form since
4.5.1).

## At a glance

| Flag | Type | Default | Purpose |
|---|---|---|---|
| `--all` | switch | off | Run every safe section in batch |
| `--only "L"` | string | — | Run only the listed sections |
| `--exclude "L"` | string | — | Skip the listed sections |
| `--profile NAME` | string | — | Run a named bundle |
| `--yes`, `-y` | switch | off | Auto-confirm `[y/N]` prompts |
| `--i-understand-deep` | switch | off | With `--yes`, allow deep sections (6, 10, 11, 14, 21, 24) and section 25 removal in batch mode |
| `--dry-run` | switch | off | Preview without deleting |
| `--no-sudo` | switch | off | Skip every sudo section |
| `--quiet` | switch | off | Suppress info chatter |
| `--json` | switch | off | One-line JSON run summary on stdout (implies `--quiet`) |
| `--no-color` | switch | auto | Disable ANSI colour |
| `--notify` | switch | off | macOS notification on completion |
| `--check-update` | switch | off | Ask npm whether a newer version exists |
| `--brew-autoremove` | switch | off | Allow `brew autoremove` in section 3 |
| `--threshold N` | int | 100 | Days idle for "unused apps" (section 21) |
| `--cache-age-days N` | int | 100 | Cache age threshold (sections 1, 2, 3) |
| `--idle-days N` | int | 100 | Idle threshold — delete gate (12, 23), highlight (16, 17) |
| `--stale-build-days N` | int | 100 | Stale build artefact age (section 23) |
| `--large-file-days N` | int | 100 | Large unused file age (section 24) |
| `--large-file-size-gb N` | int | 1 | Minimum large-file size in GB (section 24) |
| `--scan-roots "P1:P2"` | string | auto | Roots for sections 23 and 24 |
| `--exclude-path PATH` | string, repeatable | — | Never touch PATH or its subtree in 23 / 24 |
| `--logs-dir PATH` | string | `~/.macleanup/logs` | Persistent logs directory |
| `--reports-dir PATH` | string | `~/.macleanup/reports` | Persistent reports directory |
| `--no-reports` | switch | off | Skip writing per-section reports |
| `--cleanup-logs-on-finish` | switch | off | Delete this run's log on exit |
| `--list` | switch | off | List sections and exit |
| `--version`, `-V` | switch | off | Print version and exit |
| `--contact` | switch | off | Print the author contact card |
| `--feedback` | switch | off | Open mail client with a prefilled message |
| `--report-issue`, `--report-bug` | switch | off | Open a pre-filled GitHub issue |
| `--stats` | switch | off | Show run history under `~/.macleanup` |
| `--prune-history [N]` | int | 90 | Delete logs and reports older than N days |
| `--uninstall-data` | switch | off | Remove the entire `~/.macleanup` directory |
| `-h`, `--help` | switch | off | Show help and exit |

## Selection — what runs

### `--all` {#all}

Run the **safe batch** without a per-section prompt. The safe batch is exactly:

```
0  3  5  7  8  9  15  18  22  26
```

Caches, logs, temp files and read-only reports. Nothing else.

**`--all` never selects the deep sections — not even `--all --yes`.** To run
sections 6, 10, 11, 14, 21 or 24 unattended, select them explicitly and pass
both `--yes` and [`--i-understand-deep`](#i-understand-deep).

```bash
macleanup --all             # safe batch, batch mode
macleanup --all --yes       # unattended safe batch
macleanup --all --dry-run   # preview it
```

:::note[Section 13 left the safe batch in 4.5.0]
It ran `sudo periodic` unattended, which is privileged system maintenance
rather than cache cleanup. Run it from the menu or with `--only 13`.
:::

### `--only "L"` {#only}

Run **only** the listed sections. `L` is a comma-separated list of numbers
0–27. Whitespace is fine; out-of-range numbers are ignored.

```bash
macleanup --only 5                        # one section
macleanup --only "1,2,3,4"                # the dev-cache quartet
macleanup --only 23 --stale-build-days 90 --dry-run
```

### `--exclude "L"` {#exclude}

Skip the listed sections. Applied **on top of** `--all`, `--only` or
`--profile`.

```bash
macleanup --profile deep --exclude 14      # deep preset, minus the reboot one
macleanup --all --exclude "10,11"
```

### `--profile NAME` {#profile}

Run a named bundle: `dev`, `minimal`, `cache-only`, `deep` or `audit`. Combine
with `--exclude` to subtract. Full detail: [Profiles](/reference/profiles).

```bash
macleanup --profile dev --dry-run
macleanup --profile deep --exclude 14,17 --yes
```

## Confirmation and behaviour

### `--yes`, `-y` {#yes}

Auto-confirm `[y/N]` prompts. Combine with `--all` for a fully unattended safe
cleanup. The typed-`yes` confirmation in section 14 is **not** affected — that
gate is independent.

`--yes` alone **never** enables the deep sections. `--only 21 --yes` is refused
in batch mode; the tool warns and skips.

```bash
macleanup --all --yes                          # unattended safe batch
macleanup --only 21 --yes --dry-run            # preview only
macleanup --only 21 --yes --i-understand-deep  # actually uninstalls idle apps
```

### `--i-understand-deep` {#i-understand-deep}

Required **in addition to `--yes`** to let the deepest sections run unattended
via `--only` or a profile that includes them. `--all` never selects them. The gated set:

| Section | What it does |
|---|---|
| 6 | System caches wiped as root |
| 10 | Empty Trash, including external-volume Trash |
| 11 | Time Machine local snapshots deleted |
| 14 | `/private/var/folders` deep wipe |
| 21 | App uninstall plus companion data |
| 24 | Large stale files moved to the Trash |

Without it those sections are refused in batch mode, so a mistyped section
number cannot trigger an irreversible operation. `--dry-run` previews are
always allowed.

Section 25 still runs as a report in batch mode without this flag. To remove
its stale launch-item candidates unattended, supply both `--yes` and
`--i-understand-deep`; that selects every candidate.

```bash
macleanup --only 14 --yes --i-understand-deep
macleanup --profile deep --yes --i-understand-deep
```

:::danger[`--only 21 --yes --i-understand-deep` uninstalls without asking]
That combination moves **every** app idle past `--threshold` to the Trash with
no further prompt. Read [Section 21](/reference/sections#section-21) before
running it on a machine you depend on.
:::

### `--dry-run` {#dry-run}

Show what **would** be cleaned, delete nothing. Every destructive helper checks
the flag and prints `[dry-run] …` instead of executing. Combines with every
other flag and always wins.

Since 4.6.1 a dry run also estimates the space that would be freed. Since 4.6.0
it never attempts privilege elevation, so previewing a sudo section does not
prompt for a password.

```bash
macleanup --dry-run --all
macleanup --only 23 --dry-run
```

See [Preview with `--dry-run`](/before-you-run/dry-run).

### `--no-sudo` {#no-sudo}

Skip every section that needs sudo — useful without admin rights, or to verify
what the unprivileged sections achieve alone.

Sudo sections: 6, 7 (system logs), 9 (system updates), 11, 13, 14, 20, 25
(system LaunchAgents), 27 (optional system font-cache clear only).

```bash
macleanup --all --no-sudo
```

### `--quiet` {#quiet}

Suppress `info` and `note` lines; errors and warnings still print. Best with
`--all --yes` for cron output.

### `--json` {#json-output}

Emit a **one-line JSON run summary** on stdout. All other output — the human
summary, logs, warnings — goes to stderr, so stdout carries nothing but the
object. Implies `--quiet`.

```json
{
  "tool": "macleanup",
  "version": "5.0.0",
  "dry_run": false,
  "freed_kb": 1048576,
  "disk_free_delta_kb": 1310720,
  "elapsed_s": 42,
  "sections_done": [3, 5, 7],
  "reports": ["/Users/you/.macleanup/reports/orphans-2026-06-08.txt"],
  "log_file": "/Users/you/.macleanup/logs/macleanup-2026-06-08.log"
}
```

| Field | Meaning |
|---|---|
| `freed_kb` | Total tracked KB freed this run (an estimate under `--dry-run`) |
| `disk_free_delta_kb` | Change in free space on `/`, clamped to ≥ 0 |
| `sections_done` | Section numbers that completed |
| `reports` | Report files written **by this run** (since 4.6.1 it no longer lists older files in the same directory) |

```bash
macleanup --all --yes --json | jq .freed_kb
```

### `--no-color` {#no-color}

Disable ANSI colour. Auto-disabled on non-TTYs, so you mostly need it when
piping to `less -R` or capturing output into a file.

### `--notify` {#notify}

Show a macOS notification when the run finishes, via `osascript`. No-ops
quietly if `osascript` is unavailable.

### `--check-update` {#check-update}

Query the public npm registry for the latest published version. Prints a
tagged line: `[ OK ]` when current, `[WARN]` with the upgrade hint when a newer
version exists, and stays silent on network failure (4-second connect timeout,
6-second total; the run is never blocked).

This is the **only** outbound network call the script can make, it is strictly
opt-in, and **no user data is sent** — a single unauthenticated `GET` to
`https://registry.npmjs.org/macleanup/latest`.

### `--brew-autoremove` {#brew-autoremove}

Run `brew autoremove` as part of section 3. **Off by default since 4.3.1**,
because it can uninstall formulae installed as dependencies and now considered
unused — in practice `node`, `python` or `openssl` — silently breaking every
global tool that depended on them. Opt in only with a well-curated brew setup.
See [Recovery](/recovery).

## Thresholds — what counts as "old"

Defaults are deliberately conservative at 100 days. All age checks look at
`atime` **and** `mtime`, so a file you merely opened recently survives.

### `--threshold N` {#threshold}

Days an app must be idle to be flagged in section 21. Default `100`. Detection
uses five signals in priority order — Spotlight `kMDItemLastUsedDate`, Saved
Application State mtime, Container mtime, Preferences plist mtime, Spotlight
`kMDItemUseCount`. Apps with **no usable signal are skipped**, deliberately
under-flagging to avoid false positives.

### `--cache-age-days N` {#cache-age-days}

Cache-pruning age for sections 1, 2 and 3. Default `100`. A file is deleted
only when **both** its atime and mtime are at least N days old. `0` disables
the filter — a full wipe.

```bash
macleanup --only 3 --cache-age-days 30
macleanup --only 3 --cache-age-days 0     # full wipe
```

### `--idle-days N` {#idle-days}

The universal idle threshold for non-cache work, with two distinct roles:

- **Delete gate** in sections 12 and 23 — an item is deleted only when it is
  both unused by any installed tool **and** untouched for ≥ N days. This is the
  [two-condition rule](/before-you-run/safety-model#the-two-condition-rule).
- **Highlight only** in sections 16 and 17 — items idle ≥ N days are marked
  `[idle ≥Nd]`, recent ones `(recent)`. There is no delete gate; both sections
  are interactive and delete whatever you confirm.

Default `100`. In the gated sections, `0` disables the second condition.

### `--stale-build-days N` {#stale-build-days}

Age threshold for stale build artefacts in section 23 — `node_modules`,
`vendor`, `dist`, `.next`, `target`, `Pods` and similar. Falls back to
`--idle-days`. Default `100`.

### `--large-file-days N` {#large-file-days}

Age threshold for unused large files in section 24. Default `100`. Both atime
and mtime must be at least N days old.

### `--large-file-size-gb N` {#large-file-size-gb}

Minimum size in GB for the section 24 scan. Default `1`. Smaller values surface
more candidates and slow the scan.

### `--scan-roots "P1:P2:…"` {#scan-roots}

Override the auto-detected scan roots for sections 23 and 24. Colon-separated
absolute paths.

Auto-detection order: `~/Projects`, `~/projects`, `~/Code`, `~/code`,
`~/Developer`, `~/dev`, `~/repos`, `~/work`, `~/Work`, `~/Documents`,
`~/Desktop`, `~/Downloads`.

If none exist and no `--scan-roots` is given, section 23 **errors out and asks
for one**. It will not silently fall back to scanning all of `$HOME` — that was
the [v4.3.0 bug](/recovery).

```bash
macleanup --only 23 --scan-roots "$HOME/repos:$HOME/code" --dry-run
```

### `--exclude-path PATH` {#exclude-path}

Never touch `PATH` **or anything under it** in sections 23 and 24. Repeatable.
Enforced as a literal-path plus subtree guard, on top of the always-on
`CRITICAL_HOME_DIRS` protection.

```bash
macleanup --only 23 \
  --exclude-path "$HOME/Code/active-project" \
  --exclude-path "$HOME/Code/client-work" --dry-run
```

## Output and persistence

### `--logs-dir PATH` {#logs-dir}

Persistent logs directory. Default `$HOME/.macleanup/logs`. Today's log is
`macleanup-YYYY-MM-DD.log`. Env var: `MACLEANUP_LOGS_DIR`.

### `--reports-dir PATH` {#reports-dir}

Persistent reports directory. Default `$HOME/.macleanup/reports`. Env var:
`MACLEANUP_REPORTS_DIR`. See [Reports and logs](/reference/reports-and-logs).

### `--no-reports` {#no-reports}

Skip writing per-section `.txt` reports. The session log is still written.

### `--cleanup-logs-on-finish` {#cleanup-logs-on-finish}

Delete this run's log at exit. The default is to keep every log — one per day,
roughly 50 KB each.

## Informational commands

Each of these prints and exits without entering the menu.

### `--list` {#list}

Print every section number and label. The catalogue runs 0–27 (28 sections).
Section 27 is menu / `--only` only and is not in the `--all` safe batch.

### `--version`, `-V` {#version}

Print the version and exit.

### `--contact` {#contact}

Print the author contact card — email, website, LinkedIn, GitHub, repo, npm.

### `--feedback` {#feedback}

Open your mail client with a prefilled message to the author. Subject
auto-fills; the body includes your macOS version. **Nothing is auto-sent** —
you review and press Send. Falls back to printing the address if `open` is
unavailable.

### `--report-issue` {#report-issue}

Alias `--report-bug`. Opens a pre-filled GitHub issue including the macleanup
version, macOS version and chip, RAM, bash and Node versions, and the most
recent log path. Environment info is gathered **entirely locally**; nothing is
transmitted until you click Submit on github.com. If `pbcopy` is available, the
last 50 log lines are copied to your clipboard.

### `--stats` {#stats}

A read-only summary of `~/.macleanup/`: directory location, log count and
size, oldest and newest log, report count and size, the 8 most recent reports.

### `--prune-history [N]` {#prune-history}

Delete logs and reports older than N days from both subdirectories of
`~/.macleanup`. `N` defaults to `90`. Honours `--dry-run`.

```bash
macleanup --prune-history 30 --dry-run
macleanup --prune-history
```

### `--uninstall-data` {#uninstall-data}

Remove the entire `~/.macleanup` directory — logs, reports and the first-run
marker — after a literal-`yes` confirmation. Honours `--dry-run`.

### `-h`, `--help` {#help}

Print the inline help, with the defaults from your runtime config baked in.

## Exit codes {#exit-codes}

| Code | Meaning |
|---|---|
| `0` | Run completed, or an informational command exited cleanly |
| `1` | Platform check failed — not macOS, or bash too old |
| `2` | CLI parsing error — bad flag, missing argument, unknown profile |
| `127` | The Node launcher could not spawn `bash` |
| signal | The same signal it received, re-raised (Ctrl+C, SIGTERM, …) |

`SIGINT`, `SIGTERM`, `SIGHUP` and `SIGQUIT` propagate from the Node launcher to
the bash child, so Ctrl+C inside `npx` cleanly kills the underlying script.

## Common compounds

| Goal | Flags |
|---|---|
| Preview the safe batch | `--dry-run --all` |
| Unattended cron / launchd | `--all --yes --quiet --notify` |
| Read-only audit | `--profile audit --dry-run` |
| Developer caches only | `--profile dev --cache-age-days 60 --yes` |
| Stale `node_modules` only | `--only 23 --stale-build-days 90 --dry-run` |
| Big dormant files only | `--only 24 --large-file-size-gb 5 --large-file-days 180 --dry-run` |
| Skip everything needing sudo | `--all --no-sudo` |
| Heavy sweep, skip the reboot one | `--profile deep --exclude 14 --yes` |

## Next

- [The 28 sections](/reference/sections) — what each number does.
- [Profiles](/reference/profiles) — the five bundles in detail.
- [Configuration](/reference/configuration) — the config file and env vars.
- [Recipes](/recipes) — ready-made commands by goal.
