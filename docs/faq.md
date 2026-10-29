---
title: FAQ
description: Straight answers about macleanup — whether it is safe, what it can break, why it ships as one bash file, whether it collects telemetry, and what it deliberately will not do.
tags: [faq, questions, safety, licence, privacy]
sidebar_position: 5
sidebar_label: FAQ
keywords: [is macleanup safe, does macleanup collect data, macleanup license, macleanup vs cleanmymac]
---

# FAQ

## Safety

### Will this brick my Mac?

No cleanup tool can guarantee that. Section **14** (`/private/var/folders`)
particularly warrants care: it requires a reboot afterwards, is behind a typed
`yes`, is never part of `--all`, and needs `--i-understand-deep` to run
unattended. Have a current backup before running it.

Another risk is **deleting something you wanted to keep**. Read
[What gets deleted](/before-you-run/what-gets-deleted) and preview with
[`--dry-run`](/before-you-run/dry-run) before choosing a section.

### Can I undo a cleanup?

No. There is no `macleanup --undo`, no restore point and no transaction log.

Three partial exceptions: sections 12, 21 and 24 move items to the **Trash**, so they
are recoverable until you empty it. Direct deletion needs a backup. A local
snapshot may help if Time Machine is configured, but it is not a separate
backup:

```bash
tmutil snapshot
```

### Is it safe to run `--all --yes` unattended?

The safe batch excludes the deep sections, but no automated deletion is risk
free. Preview the exact command with `--dry-run` and keep a current backup.
`--all` selects sections `0, 3, 5, 7, 8, 9, 15, 18, 22, 26` — and it **never** runs the deep sections,
even with `--yes`.

Be more careful with `--profile … --yes`. The `dev` and `deep` profiles include
sections that can delete permanently. `minimal` leaves Trash alone. See
[Profiles](/reference/profiles).

### Will it delete my documents or photos?

Not by intent, and not by any fixed document path list. These sections can
reach personal data:

- **Section 24** flags files at or above your size threshold whose atime and
  mtime are both older than your age threshold. Defaults are 1 GB and 100 days,
  and matches go to the **Trash**, not straight to deletion.
- **Section 23** deletes build directories inside your scan roots. If you keep
  a folder literally named `dist` or `vendor` full of documents, protect it
  with `--exclude-path`.
- **Section 12** may identify an app's support data as orphaned. Review its
  list before moving anything to the Trash.
- **Section 21** moves an app and known companion data to the Trash. Export
  documents kept inside the app's container first.
- **Section 4** can prune Docker volumes containing databases, but only after
  a separate typed `yes` in interactive mode.

Other sections work from their documented paths and prompts; see the
[full inventory](/before-you-run/what-gets-deleted).

### Does it delete my browser passwords or history?

No. Section 19 clears **cache subdirectories only** — `Cache`, `Code Cache`,
`GPUCache` and the service-worker caches. Profile data, history, saved logins,
bookmarks and extensions are left intact. Password-manager caches (1Password,
Bitwarden, KeePassXC) are on section 5's preserve list.

Expect slower first page loads and possibly being signed out of some sites,
because session data can live in caches.

### What is the two-condition rule?

In sections 12, 21, 23 and 24, an item qualifies only when **both** are true:
the section's checks find no current use, **and** it meets that section's age
threshold. Sections 12 and 23 use `--idle-days`; 21 uses `--threshold`; 24 uses
`--large-file-days`. All default to 100 days. Sections 12, 23 and 24 check
access and modification times; 21 uses app last-use signals.

Because access time counts, a `node_modules` your editor reads for autocomplete
survives, and so does a Gradle distribution you invoke monthly. Details:
[Safety model](/before-you-run/safety-model#the-two-condition-rule).

## Behaviour

### Why did a section find nothing?

Usually the age filter doing its job — `atime` counts, so a file you merely
opened recently does not qualify. See
[Troubleshooting](/troubleshooting#a-section-finds-nothing) for the three
common causes and their fixes.

### Why does `--all` skip so much?

Because "all" means "all the safe ones". The batch is caches, logs, temp files
and reports. Sections that empty the Trash, delete snapshots, uninstall apps or
wipe `/private/var/folders` are deliberately excluded so that a habitual
`--all --yes` can never become an incident.

### Why is `brew autoremove` off by default?

It can uninstall formulae that were installed as dependencies and are now
considered unused — in practice `node`, `python` or `openssl` — silently
breaking every global tool built on them. It has been opt-in via
`--brew-autoremove` since 4.3.1. See [Recovery](/recovery).

### Can I add my own section?

Yes. The MIT licence lets you fork, edit and redistribute your changes. For a
feature you would like in mainline, open an issue or PR describing the use
case.

### Does it work on Linux or Windows?

No, and there are no plans for a port. The script reads macOS-specific paths
and calls `tmutil`, `xcrun`, `dscacheutil`, `mDNSResponder`, `launchctl` and
`osascript`. It refuses to start on a non-Darwin platform rather than doing
something unpredictable.

## Privacy and trust

### Do you collect any telemetry?

None. The script makes **no network calls by default**. The Node launcher only spawns
bash — no analytics, no crash reporting, no phone-home. Logs and reports stay
on your machine in `~/.macleanup/`.

The single exception is opt-in: `--check-update` performs one unauthenticated
`GET` to `https://registry.npmjs.org/macleanup/latest` to compare version
numbers. It sends no cleanup paths or reports; npm still sees normal request
metadata, such as your IP address.

`--feedback` and `--report-issue` open your mail client or a pre-filled GitHub
issue for **you** to review and submit. Nothing is sent automatically.

### What does `npx macleanup` actually run?

npm downloads the published package into its cache and runs
`bin/macleanup.js`, a small Node launcher that spawns the bundled
`macleanup.sh` through `bash`. npm reclaims the cache afterwards.

Your logs and reports are written to `~/.macleanup/` and are **never inside
the cache**, so they survive.

### Can I read the source before running it?

Yes, and you should. The whole tool is two files: `macleanup.sh` (plain bash)
and `bin/macleanup.js` (a short Node launcher). No build step, no
minification, no bundled binary.

```bash
git clone https://github.com/aoneahsan/macleanup.git
cd macleanup && less macleanup.sh
```

### Why one file instead of `brew install`?

A single file means no curl-pipe-bash, no signing-key surface, no Homebrew tap
to trust, and you can read every line before running it. Drop it in `~/bin/`
and you are done.

### Is it open source?

Yes — **MIT licensed**. You may use, copy, modify, merge, publish, distribute,
sublicense and sell it, provided the copyright and licence notice are kept. It
is offered **as-is, with no warranty**, and the author is **not liable** for
data loss arising from its use.

### Where do I report a security issue?

Privately, to **aoneahsan@gmail.com** — not a public issue. Path traversal, an
unintended `rm -rf`, or a data-leakage scenario all qualify.

## Practical

### How much space will it free?

Unknowable in advance, and any specific number here would be invented. Find out
for your machine:

```bash
macleanup --dry-run --all          # estimates the space it would free
macleanup --profile audit          # reports where the space actually went
```

Machines with years of Xcode DerivedData or dozens of old `node_modules` tend
to see the largest reclaim; a fresh machine may see almost nothing.

### How often should I run it?

There is no schedule the tool needs. A pattern that works:

| Cadence | Command |
|---|---|
| Weekly | `macleanup --profile minimal --yes` |
| Monthly | `macleanup --profile dev --dry-run`, then run what looks right |
| When low on space | `macleanup --profile audit`, read the reports, then decide |

Running more often means the 100-day defaults rarely match. Lower them in
`~/.macleanuprc` — see [Configuration](/reference/configuration).

### Can I run it from cron or launchd?

Yes. Validate the command with `--dry-run` first, then automate the verified
form:

```bash
macleanup --all --yes --quiet --notify
```

`--json` gives a machine-readable summary for CI. See [Recipes](/recipes).

### How do I remove macleanup completely?

```bash
macleanup --uninstall-data      # remove ~/.macleanup (asks first)
npm uninstall -g macleanup        # remove the command
```

Order matters — uninstalling the package first leaves the data directory
behind, and you would have to delete it by hand.

### Which command name should I use?

`macleanup`. The npm package installs one command, `macleanup`, and
`npx macleanup` and `./macleanup.sh` run the identical script with identical
flags. Before 5.0.0 the package also installed a second command name; 5.0.0
removed it. See [Upgrading to 5.0](./getting-started/upgrading-to-5.md).

### How do I know I am on the latest version?

```bash
macleanup --version
macleanup --check-update
```

## Next

- [What gets deleted](/before-you-run/what-gets-deleted) — the full inventory.
- [Troubleshooting](/troubleshooting) — symptom-to-fix.
- [CLI reference](/reference/cli) — every flag.
