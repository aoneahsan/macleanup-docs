---
title: JSON event stream
description: The macleanup --json-events schema, version 1 — the newline-delimited JSON events a run writes to stdout, their fields, ordering guarantees and exit codes.
tags: [reference, json, events, automation, scripting]
sidebar_position: 6
sidebar_label: JSON event stream
keywords: [macleanup json-events, macleanup ndjson, macleanup event schema, macleanup automation, section_result]
---

# JSON event stream

**`--json-events` turns a run into a stream of newline-delimited JSON (NDJSON)
on stdout, one event per line.** Every human line, prompt and log line goes to
stderr. The macleanup desktop app reads this stream; scripts and CI can read it
too. Schema version **1**, since macleanup 5.1.0.

```bash
npx macleanup --dry-run --all --json-events
npx macleanup --only 3,5,23 --yes --json-events 2>/dev/null | jq -c 'select(.type=="section_result")'
```

`--json-events` implies `--quiet`. It cannot be combined with
[`--json`](/reference/cli#json-output), which still prints one summary object at
the end. Passing both exits with code `2`.

`--json-events` also needs a non-interactive selection: `--only`, `--profile`
or `--all`. Without one it exits with code `2`.

## Envelope {#envelope}

Every event carries the same three fields.

| Field | Type | Meaning |
|---|---|---|
| `v` | integer | Schema version. It is `1` for this page. A consumer refuses a higher major version it does not know. |
| `type` | string | One of the event types below. |
| `ts` | integer | Unix time in milliseconds when the event was written. |

Ignore fields you do not know. Additive fields do not bump `v`.

## Event types, in stream order {#event-types}

| `type` | When | Fields |
|---|---|---|
| `plan` | once, first | `version` (CLI version), `dry_run` (bool), `profile` (string or null), `sections` — array of `{id, title, stamp, sudo, deep}` |
| `disk` | after `plan`, and again before `summary` | `phase` (`"before"` or `"after"`), `total_kb`, `free_kb`, `purgeable_kb` (null when unknown), `snapshots` (count of local APFS snapshots), `snapshot_note` (bool: true when snapshots may hold freed space) |
| `section_start` | each section | `id`, `title`, `stamp` |
| `item` | each path a section would touch (dry run) or touched (real run) | `id` (section), `path`, `kb`, `action` (`"delete"`, `"trash"`, `"archive"`, `"report"`, `"skip"`), `unique` (bool: user data with no other copy, which needs a keep, archive or delete choice) |
| `progress` | while a section works through items | `id`, `done`, `total` (null when unknown) |
| `section_result` | each section, after its last `item` | `id`, `status` (`"completed"`, `"skipped"`, `"failed"`), `freed_kb`, `items` (count), `reason` (string or null; required for `skipped` and `failed`) |
| `error` | a non-fatal problem | `id` (section or null), `message` |
| `summary` | once, last | `attempted`, `completed`, `skipped`, `failed` (each an array of section ids), `freed_kb`, `disk_free_before_kb`, `disk_free_after_kb`, `elapsed_s`, `reports` (paths), `log` (path), `dry_run` (bool) |

### Section fields {#section-fields}

| Field | Values |
|---|---|
| `id` | An integer from 0 to 27 — the [section number](/reference/sections). |
| `title` | The same text `--list` prints. |
| `stamp` | The section's recovery tier: the three tiers on [What gets deleted](/before-you-run/what-gets-deleted), plus read-only sections. One of `"routine"` (caches and logs the system or the tool rebuilds), `"trash"` (moved to the Trash, recoverable until you empty it), `"permanent"` (removed for good; only your own backup brings it back) or `"read"` (reads and reports, changes no files). |
| `sudo` | `true` for the sections that ask for an administrator password: 6, 7, 11, 13, 14, 20, 25. |
| `deep` | `true` for the sections a non-interactive run refuses without `--i-understand-deep`: 6, 10, 11, 14, 21, 24. |

## Example stream {#example}

Shortened and reformatted from a dry run of one section. The values are
illustrative, not a measurement; each real event is one line.

```json
{"v":1,"type":"plan","ts":1793318400000,"version":"5.1.0","dry_run":true,"profile":null,"sections":[{"id":3,"title":"Package-manager caches","stamp":"routine","sudo":false,"deep":false}]}
{"v":1,"type":"disk","ts":1793318400100,"phase":"before","total_kb":0,"free_kb":0,"purgeable_kb":null,"snapshots":0,"snapshot_note":false}
{"v":1,"type":"section_start","ts":1793318400200,"id":3,"title":"Package-manager caches","stamp":"routine"}
{"v":1,"type":"item","ts":1793318400300,"id":3,"path":"/Users/you/Library/Caches/Yarn","kb":0,"action":"delete","unique":false}
{"v":1,"type":"section_result","ts":1793318400400,"id":3,"status":"completed","freed_kb":0,"items":1,"reason":null}
{"v":1,"type":"disk","ts":1793318400500,"phase":"after","total_kb":0,"free_kb":0,"purgeable_kb":null,"snapshots":0,"snapshot_note":false}
{"v":1,"type":"summary","ts":1793318400600,"attempted":[3],"completed":[3],"skipped":[],"failed":[],"freed_kb":0,"disk_free_before_kb":0,"disk_free_after_kb":0,"elapsed_s":1,"reports":[],"log":"/Users/you/.macleanup/logs/macleanup-2026-10-30.log","dry_run":true}
```

A skipped deep section in a non-interactive run looks like this:

```json
{"v":1,"type":"section_result","ts":1793318400400,"id":10,"status":"skipped","freed_kb":0,"items":0,"reason":"needs --i-understand-deep"}
```

## Guarantees {#guarantees}

- **`plan` is the first line and `summary` is the last.** A stream that ends
  without `summary` means the process was interrupted. Treat every section
  without a `section_result` as `failed`, with reason `"interrupted"`.
- **In a dry run, `item.action` is what would happen.** Nothing is changed, and
  `freed_kb` is the estimate the section prints today.
- **Paths stay on the Mac.** They appear only in this local stream, the local
  log and the local report. macleanup sends nothing anywhere. The desktop app
  never uploads `path`; a synced run summary carries only section ids, byte
  counts, statuses and the macOS version.
- **Strings are JSON-escaped** — backslash, double quote and control characters.
- **Deep sections still need `--i-understand-deep`** in a non-interactive run.
  Without it, sections 6, 10, 11, 14, 21 and 24 come back `skipped` with reason
  `"needs --i-understand-deep"`.
- **Password sections need an askpass helper.** A non-interactive consumer sets
  `MACLEANUP_ASKPASS` to an executable askpass helper (the desktop app does),
  and the script routes `sudo` through it. Without one, those sections come
  back `skipped` with reason `"needs administrator password"`.

## Exit codes {#exit-codes}

| Code | With `--json-events` |
|---|---|
| `0` | The run finished, even if some sections were skipped |
| `1` | At least one section failed |
| `2` | Invalid arguments |
| `130` | Interrupted |

Without `--json-events`, exit codes are unchanged from 5.0.0 — see
[CLI exit codes](/reference/cli#exit-codes).

## Next

- [CLI reference](/reference/cli) — every flag, including `--json-events`.
- [Reports and logs](/reference/reports-and-logs) — the files a run writes.
- [Desktop app](/desktop-app/overview) — the window that reads this stream.
