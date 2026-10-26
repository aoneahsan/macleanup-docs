# Story Bible — macleanup

**Slug:** `macleanup` (main product repository; website primaryHue 169) · **Status:** approved at GATE 1 on 2026-10-26 · **Last updated:** 2026-10-26 · **Registry:** `~/.claude/story-system/registry/macleanup.md`.

## 1. Project nature and one-line premise

macleanup is a macOS command-line utility that shows people what a cleanup would remove before they decide to run it. It is a published npm package backed by a Bash script and has a separate public documentation site. (Approved from published package and docs evidence at GATE 1.)

## 2. Audience

**Who:** A Mac user who uses developer tools and wants to reclaim disk space. **Awareness:** solution-aware. **Fear:** losing work, settings, app data or backups. **Want:** a clear inventory, a preview and precise control. (Approved at GATE 1.)

## 3. Core promise

The reader can see what each section touches and choose a cleanup with its recovery limits understood. (Approved at GATE 1.)

## 4. Emotional palette

**Approved ratio:** 70% procedural clarity, 25% consequence-aware care, 5% restrained reassurance. No humor on safety pages or deletion prompts.

| Band | Share | Example |
|---|---:|---|
| Procedural clarity | 70% | Run `--dry-run` to see the paths before changing them. |
| Consequence-aware care | 25% | A Docker volume may contain the only copy of a database. |
| Restrained reassurance | 5% | If Finder cannot move it to the Trash, the item stays in place. |

**Banned tones:** urgency, triumph about deletion, vague promises of safety, jokes around data loss, and unsourced space-saving numbers.

## 5. Voice fingerprint

See `voice-fingerprint.md`; `calibrated: false`, approved provisionally at GATE 1. Second person to the reader, third person for the tool, short instructions followed by concrete limits. Reach for *path, preview, section, Trash, backup, skip*; avoid boastful adjectives and euphemisms for deletion.

## 6. Story spine and motifs

**Structure:** task → preview → consequence → explicit choice, as already used in the docs. **Motifs:** the numbered section, the dry run, the recovery boundary. No invented narrative or user anecdote. (Inferred; confirm at GATE 1.)

## 7. Glossary and naming

| Term | Use | Avoid |
|---|---|---|
| `macleanup` | Package and product name | Claiming it is a GUI app |
| `mac-cleanup` | Installed CLI command | Mixing it with the package name in a command |
| Trash | macOS recovery location | Calling every deletion reversible |
| `--dry-run` | A preview that deletes no files but may write logs and reports | Calling it a backup |

**Spelling locale:** en-GB forms such as “artefacts” and “licence” (approved from existing docs). **Numbers:** digits for section numbers and flags.

## 8. Per-surface rules

| Surface | Tone | Length | Action |
|---|---|---|---|
| CLI and reports | Direct, consequence explicit | As short as the decision allows | Preview or confirm the named section |
| README and npm page | Factual, safety up front | Scan-friendly | Read what is removed, then preview |
| Documentation | Explanatory, exact path and recovery tier | As needed for correct use | Open the relevant section or run a dry run |
| Marketing site | Purpose, preview plan, exact sections and limits | One home page with 12–15 distinct sections | Open the dry-run guide |

## 9. SEO and AEO map

See `content-map.md` after GATE 1. Existing docs have FAQ and software metadata. No search volume, outcome, testimonial or savings figure is invented.

## 10. Safety constraints

**Profile:** destructive local utility. Never imply cache cleanup cannot disrupt a session; never call permanent deletion reversible; never promise an exact amount of reclaimed space; name when a backup is the only recovery. No crisis lines are relevant.

## 11. Decision log and language

See `decision-log.md`. **Language:** existing surfaces are English; additional languages need an owner decision. The provisional fingerprint is approved; calibration samples may be supplied later.
