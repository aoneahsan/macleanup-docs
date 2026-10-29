# Content map — macleanup

**Status:** approved at GATE 2 on 2026-10-26 · **Last updated:** 2026-10-26 · **Bible:** `story-bible.md` (GATE 1 approved 2026-10-26).

Current-version claims are checked against the published package and `macleanup.sh`. Historical changelog entries keep their historical wording. `docs/story/` is excluded from the public docs build.

## Surfaces

| Surface | Awareness | Structure | Tone band | Length | CTA | Schema | Status | Source/draft |
|---|---|---|---|---|---|---|---|---|
| CLI prompts and reports | Most aware | Named action → scope → consequence → choice | Clarity and care; no humor | One decision per prompt | Preview or confirm the named section | None | planned | `macleanup/macleanup.sh` |
| Package README and npm listing | Solution aware | Brief PAS opener, then install, safety and reference | 70 clarity / 25 care / 5 reassurance | Existing scan-friendly reference | Run a dry run | None | planned | `macleanup/README.md` |
| Docs introduction | Solution aware | Purpose → first safe command → navigation | 70 / 25 / 5 | One landing page | Preview first | Existing visible SoftwareApplication facts | planned | `docs/intro.md` |
| Safety model | Product aware | Guarantee by section → exceptions → recovery limit | Clarity and care; no humor | Complete safety reference | Read deletion tiers | None | planned | `docs/before-you-run/safety-model.md` |
| What gets deleted | Product aware | Section → paths → deletion method → recovery | Clarity and care; no humor | Complete tier table | Check the relevant section | None | planned | `docs/before-you-run/what-gets-deleted.md` |
| Dry-run guide | Solution aware | Command → sample output → limits | 70 / 25 / 5 | One task guide | Run `--dry-run` | HowTo only if visible steps support it | planned | `docs/before-you-run/dry-run.md` |
| First run | Solution aware | Requirements → preview → interactive selection | 70 / 25 / 5 | One task guide | Preview before confirming | HowTo only if visible steps support it | planned | `docs/getting-started/first-run.md` |
| CLI reference | Product aware | Flag → effect → combinations and refusal cases | Clarity and care | Complete flag reference | Choose the intended flags | None | planned | `docs/reference/cli.md` |
| Profiles reference | Product aware | Profile → included sections → exceptions | Clarity and care | Complete profile table | Preview the profile | None | planned | `docs/reference/profiles.md` |
| Sections reference | Product aware | Number → target → default → recovery tier | Clarity and care | All 28 sections | Preview one section | None | planned | `docs/reference/sections.md` |
| Recipes | Solution aware | Goal → command → consequence | 70 / 25 / 5 | One group per task | Run the chosen preview | HowTo only for visible steps | planned | `docs/recipes.md` |
| Recovery | Product aware | Change → Trash or backup path → irreversible limit | Clarity and care; no humor | Complete recovery reference | Check the recovery path | None | planned | `docs/recovery.md` |
| FAQ | Problem to product aware | Answer first → condition → reference link | 70 / 25 / 5 | Existing question set | Open the relevant guide | FAQPage only for visible eligible questions | planned | `docs/faq.md` |
| Troubleshooting | Product aware | Symptom → cause → verified action | Clarity and care | Existing symptom list | Try the named fix | None | planned | `docs/troubleshooting.md` |
| Changelog | Most aware | Version → date → verified change | Procedural clarity | One entry per release | Read the changed section | None | planned | `docs/changelog.md` |
| Docs metadata and `llms.txt` | Solution aware | Answer first → source links → version | Procedural clarity | Concise | Open docs or source | Visible facts only | planned | `docusaurus.config.ts`, `static/llms.txt` |
| Marketing home | Problem to solution aware | StoryBrand: disk pressure → guide → preview plan → exact sections → limits → action | 70 / 25 / 5; no humor near deletion | One page with 12–15 distinct sections, header and footer | Preview via docs | SoftwareApplication; FAQ only if visible | planned | `drafts/marketing-home.md` |
| Marketing metadata and `llms.txt` | Solution aware | Name → verified purpose → docs and source | Procedural clarity | Concise | Open docs | Visible facts only | planned | `drafts/marketing-metadata.md` |

## Question map

Questions come from existing FAQ headings (`faq`), task-guide headings (`docs`) or the approved audience concern (`bible`). No query volume or ranking is claimed.

| Target question | Source | Surface | Answer-first sentence | Query language | Freshness |
|---|---|---|---|---|---|
| Can macleanup delete my documents or photos? | faq | FAQ, marketing home | The safe batch targets documented caches, logs and temporary files; review a deep section's path list before choosing it. | macleanup documents photos safe batch | versioned |
| Can I undo a macleanup cleanup? | faq | Deletion tiers, recovery, marketing home | It depends on the section: some items go to Trash, while direct deletion needs a backup to recover. | macleanup undo Trash backup | versioned |
| What does `--dry-run` do? | docs | Dry-run guide, marketing home | `--dry-run` previews operations without deleting files; it does not create a backup. | macleanup dry run preview | versioned |
| Is `--all --yes` safe to automate? | faq | Profiles, FAQ, marketing home | `--all --yes` runs the safe batch; deep sections need explicit opt-in and some require their own confirmation. | macleanup all yes deep | versioned |
| Does macleanup clear browser passwords or history? | faq | FAQ, safety model | The browser-cache section targets caches; it does not select saved passwords or browsing history. | macleanup browser passwords history | versioned |
| How do I clean developer caches on a Mac? | docs | Recipes, marketing home | Preview the developer profile, then review each selected cache and tool-specific consequence before running it. | mac developer cache cleanup | versioned |
| How much space will macleanup free? | faq | FAQ, marketing home | The amount depends on the files found on your Mac; inspect the preview and disk-space report instead of relying on a promised number. | macleanup free disk space | versioned |
| What happens when a file cannot move to Trash? | docs | Recovery, troubleshooting | The affected app or data stays in place when Finder cannot move it to Trash. | macleanup Finder Trash failure | versioned |

## Purpose-led internal links

- Marketing home → dry-run guide, so a reader can preview before deleting.
- Marketing home → what gets deleted, so a reader can check each recovery tier.
- Docs introduction → first run, then safety model and sections reference.
- Deletion or recovery claim → the specific deletion tier or recovery guide.
- FAQ answer → the guide or reference with its full conditions.

## Out of scope for now

- Testimonials, savings figures and performance benchmarks: no verified source exists.
- Accounts, checkout, pricing, contact forms and analytics: the requested site is a static marketing page for a local CLI, with no approved collection feature.
- Privacy and Terms pages: re-evaluate if data collection, accounts, payment or another requirement calls for them.
- Additional languages: the approved Bible covers English; localization needs its own decision and i18n plan.
