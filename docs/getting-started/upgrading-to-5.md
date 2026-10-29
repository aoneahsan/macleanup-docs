---
title: Upgrading to 5.0
description: macleanup 5.0.0 uses one name everywhere. What changed for the command, data folder, config file and environment variables, and what the first 5.x run does for you.
tags: [upgrade, migration, installation, configuration]
sidebar_position: 3
sidebar_label: Upgrading to 5.0
keywords: [macleanup 5.0.0, upgrade macleanup, macleanup command renamed, macleanuprc, MACLEANUP_LOGS_DIR]
---

# Upgrading to 5.0

**macleanup 5.0.0 uses one name for everything: the command, the script, the
data folder, the config file and the environment variables.** Run it as
`macleanup` or `npx macleanup`. Most upgrades need no manual step, because the
first 5.x run copies your earlier logs and reports.

## What changed

| Before 5.0.0 | From 5.0.0 | What happens to the old name |
|---|---|---|
| `mac-cleanup` command | `macleanup` command | Removed. Update scripts and shell aliases to call `macleanup`. |
| `mac-cleanup.sh` | `macleanup.sh` | Renamed in the package and the repository. |
| `~/.mac-cleanup/` | `~/.macleanup/` | Copied once on the first 5.x run. The original stays in place. |
| `~/.mac-cleanuprc` | `~/.macleanuprc` | Still read when the new file is absent, with a note. |
| `MAC_CLEANUP_LOGS_DIR`, `MAC_CLEANUP_REPORTS_DIR`, `MAC_CLEANUP_RC` | `MACLEANUP_LOGS_DIR`, `MACLEANUP_REPORTS_DIR`, `MACLEANUP_RC` | Still read for 5.x when the new variable is unset, with a note. |
| Daily log `mac-cleanup-YYYY-MM-DD.log` | `macleanup-YYYY-MM-DD.log` | New logs use the new name. Copied logs keep theirs. |

## What the first 5.x run does

When `~/.mac-cleanup/` exists and `~/.macleanup/` does not, macleanup copies the
whole folder to `~/.macleanup/` and writes a `.migrated-from-4x` marker inside
it. It never moves or deletes the original. `--stats` and `--prune-history`
then read the new folder.

```text
[NOTE] Copied /Users/you/.mac-cleanup to /Users/you/.macleanup. The old folder was left in place; remove it when you no longer need it.
```

If the copy fails, for example because the disk is full, macleanup says so and
your older logs and reports stay where they were.

## Finish the upgrade

1. Update any script, alias or scheduled job that calls the old command:

   ```bash
   macleanup --version   # macleanup 5.0.0
   ```

2. Rename your config file, if you have one:

   ```bash
   mv ~/.mac-cleanuprc ~/.macleanuprc
   ```

3. Rename any `MAC_CLEANUP_*` variables in your shell profile to `MACLEANUP_*`.
4. When you no longer need the old logs and reports, remove the old folder
   yourself. This is a permanent deletion, so check the copy first:

   ```bash
   ls ~/.macleanup/reports
   rm -rf ~/.mac-cleanup
   ```

The `[NOTE]` lines stop once nothing uses an old name.
