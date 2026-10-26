# Voice fingerprint — macleanup

**calibrated:** false · **status:** provisionally approved at GATE 1 · **samples:** existing repository copy only; no owner-selected samples · **Last updated:** 2026-10-26

## Rhythm

Use a short instruction before a longer explanation of its consequence. Keep one decision per paragraph. Tables carry exact section numbers, flags and recovery paths. (Approved from existing docs at GATE 1.)

## Person, contractions and punctuation

Second person for the reader; third person for macleanup. Contractions are sparse on safety pages. Use code formatting for paths and flags. Avoid exclamation marks around destructive actions. (Approved at GATE 1.)

## Diction

| Reach for | Avoid |
|---|---|
| preview, path, section, Trash, backup | magic, effortless, one-click |
| leaves in place, skips, requires | nuke, blast, wipe out |

## Stance

State the behavior, then the boundary. If a heuristic can be wrong, say what the reader should review. Do not call a safety guarantee broader than the script makes it.

## Openers and closers

Open with the user action, a section number or a consequence. End with the next concrete action or recovery limit, not a slogan.

## Sample sentences (provisional, drawn from current product behavior)

1. Run `--dry-run` to see the paths before changing them.
2. Section 10 empties Trash, including items moved there earlier in the run.
3. The `minimal` profile leaves Trash alone.
4. Section 8 skips nested temporary files and `~/tmp`.
5. If Finder cannot move an app to Trash, the app stays in place.
6. A Docker volume may contain the only copy of a database.
7. Section 23 removes stale build directories; a missing registry package may prevent you from rebuilding them.
8. A backup is the recovery path for direct deletion.
9. Check the list before confirming orphaned app data.
10. The tool reports a skipped deep section instead of counting it as complete.

## Calibration samples

The owner approved this provisional fingerprint based on existing docs on 2026-10-26. One to three chosen writing samples can calibrate it later; that change reopens GATE 1 for the fingerprint.
