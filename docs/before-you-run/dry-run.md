---
title: Preview with --dry-run
description: How to see exactly which files macleanup would delete, without deleting anything — the flag to use first on every new machine, section and script.
tags: [safety, dry-run, preview, cli]
sidebar_position: 2
sidebar_label: Preview with --dry-run
keywords: [macleanup dry run, preview mac cleanup, test cleanup without deleting]
---

# Preview with `--dry-run`

**`--dry-run` makes macleanup report what it would remove and delete nothing.**
Every destructive helper in the script checks the flag and prints a
`[dry-run] …` line instead of executing. It is the single most useful flag in
the tool, and it costs nothing but the time of one extra run.

```bash
npx macleanup --dry-run --all
```

## Use it in these four situations, every time

1. **The first run on a new machine.** Directory layouts differ; see yours.
2. **The first time you run any section.** Especially 12, 21, 23 and 24, which
   judge by heuristics rather than by a fixed path list.
3. **Before wiring a command into a script, cron job or CI step.** A typo in a
   section number is much cheaper to find in a preview.
4. **After changing a threshold.** Lowering `--cache-age-days` or
   `--idle-days` widens what qualifies, sometimes far more than expected.

## What a preview actually shows you

- The paths each selected section would touch.
- An **estimate of the space that would be freed**. Before 4.6.1 a dry run
  always reported `0` here; it now measures the size of what it would delete.
- For interactive sections, the candidate list — orphaned data, idle apps,
  stale build directories, large dormant files — so you can see the actual
  names before any of them are at risk.
- The report files it would write.

`--dry-run` combines with every other flag, and it always wins. There is no
flag ordering that turns a dry run into a real one.

## Preview one section at a time

The most useful previews are narrow. Section numbers come from
[The 28 sections](/reference/sections) or `npx macleanup --list`.

```bash
# Which stale build directories would go, at a 90-day threshold?
npx macleanup --only 23 --stale-build-days 90 --dry-run

# Which apps count as idle after 60 days?
npx macleanup --only 21 --threshold 60 --dry-run

# Which files are both 2 GB+ and untouched for 180 days?
npx macleanup --only 24 --large-file-size-gb 2 --large-file-days 180 --dry-run

# What would a whole profile do?
npx macleanup --profile deep --dry-run
```

## Deep sections preview safely too

The six deep sections — 6, 10, 11, 14, 21 and 24 — are refused in unattended
batch mode unless both `--yes` and `--i-understand-deep` are present. **A `--dry-run` preview is always
allowed** and does not delete files; it still writes its normal log:

```bash
npx macleanup --only 21 --yes --dry-run   # previews; deletes nothing
npx macleanup --only 21 --yes             # refused in batch mode without --i-understand-deep
```

Since 4.6.0 a dry run also never attempts privilege elevation, so previewing a
sudo section does not prompt for your password.

## Capture the preview so you can read it properly

Terminal scrollback is a poor review surface for a few hundred paths. Two
better options:

```bash
# Save it to a file and read it in an editor
npx macleanup --only 23 --dry-run --no-color > ~/Desktop/macleanup-preview.txt

# Or get a machine-readable summary
npx macleanup --only 3,5 --dry-run --json
```

`--no-color` strips the ANSI escapes so the file stays readable. `--json`
emits a single-line object on stdout — everything else goes to stderr — with
`freed_kb`, `sections_done` and the report paths. See
[`--json`](/reference/cli#json-output) for the full shape.

Several sections also write a dated `.txt` report to
`~/.mac-cleanup/reports/` during a dry run, which is often the easiest list to
work from. See [Reports and logs](/reference/reports-and-logs).

## The honest limits of a preview

`--dry-run` is a strong guarantee about macleanup's own behaviour. It is not a
promise about your filesystem:

- **It is a snapshot.** A preview reflects the state at that moment. If you
  open a file after previewing, its access time changes and it may no longer
  qualify on the real run — or the reverse.
- **A real run can find more.** Between the two runs, files age past a
  threshold. Re-preview if a while has passed.
- **Interactive sections still ask.** A preview shows the candidate list; on
  the real run you choose from it. What you select is what goes.
- **It does not validate your judgement.** macleanup can tell you a
  directory has not been touched in 200 days. It cannot tell you whether you
  need it.
- **It is not a backup.** Keep a separate current backup before a large run.
  If Time Machine is configured, you can also request a local snapshot:

  ```bash
  tmutil snapshot
  ```

## Next

- [Safety model](/before-you-run/safety-model) — what the confirmations and gates actually guarantee.
- [Your first run](/getting-started/first-run) — a full session, preview first.
- [CLI reference](/reference/cli) — every flag `--dry-run` combines with.
