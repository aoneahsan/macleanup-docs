---
title: About the author
description: macleanup is built and maintained by Ahsan Mahmood — how to get in touch, report an issue, contribute, or report a security problem privately.
tags: [about, author, contact, contributing, security]
sidebar_position: 1
sidebar_label: About the author
keywords: [ahsan mahmood, aoneahsan, macleanup author, macleanup support]
---

# About the author

macleanup is built and maintained by **Ahsan Mahmood** — a senior software
engineer, macOS power user, and maker of small sharp tools.

<div className="ml-author-card">

**Ahsan Mahmood**

- Portfolio — [aoneahsan.com](https://aoneahsan.com)
- Email — [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com)
- GitHub — [github.com/aoneahsan](https://github.com/aoneahsan)
- LinkedIn — [linkedin.com/in/aoneahsan](https://linkedin.com/in/aoneahsan)
- npm — [npmjs.com/~aoneahsan](https://www.npmjs.com/~aoneahsan)

</div>

## Getting in touch from the terminal

Three flags, all local-first. Nothing is auto-sent — you review every prefilled
message before submitting it.

```bash
macleanup --contact         # the author contact card
macleanup --feedback        # opens your mail client, prefilled
macleanup --report-issue    # opens a pre-filled GitHub issue
macleanup --stats           # your run history under ~/.macleanup
```

`--report-issue` gathers the version, macOS version and chip, RAM, bash and
Node versions, and the latest log path — **entirely on your machine**. When
`pbcopy` is available, the last 50 log lines land on your clipboard so you can
paste them into the issue. Nothing reaches GitHub until you press Submit.

If a run exits with an error, the script prints a hint pointing at
`--report-issue`, so you do not have to remember the flag.

## Reporting a bug

Open an issue at
[github.com/aoneahsan/macleanup/issues](https://github.com/aoneahsan/macleanup/issues),
ideally via `macleanup --report-issue` so the environment details come along.

A good report names the version, the exact command, what you expected, what
happened, and the relevant log lines from `~/.macleanup/logs/`.

## Reporting a security issue

**Privately, by email to [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com)** —
not a public issue. Path traversal, an unintended `rm -rf`, or a data-leakage
scenario all qualify. See
[SECURITY.md](https://github.com/aoneahsan/macleanup/blob/main/SECURITY.md).

This project deletes files, so a security report here can be a data-loss
report. Both are welcome, and both are taken seriously.

## Contributing

macleanup is MIT-licensed open source. Issues and pull requests are welcome,
though acceptance is at the author's sole discretion. See
[CONTRIBUTING.md](https://github.com/aoneahsan/macleanup/blob/main/CONTRIBUTING.md)
and the
[Code of Conduct](https://github.com/aoneahsan/macleanup/blob/main/CODE_OF_CONDUCT.md).

The whole tool is two readable files — `macleanup.sh` in plain bash and a
short Node launcher — so a first contribution does not require learning a build
system.

## About this documentation site

This site is open source too. If a page is wrong, unclear, or missing something
you needed, every page has an **Edit this page** link at the bottom, or you can
open an issue at
[github.com/aoneahsan/macleanup-docs](https://github.com/aoneahsan/macleanup-docs/issues).

Documentation for a tool that deletes files has one job above all others: let
you know what will be removed *before* you run it. A page that fails at that is
a bug worth reporting.

## Licence

**MIT.** Use, copy, modify, merge, publish, distribute, sublicense and sell
macleanup, provided the copyright and licence notice are kept in all copies.
The software is offered **as-is, with no warranty**, and the author is **not
liable** for any data loss or damage arising from its use. Full text:
[LICENSE.md](https://github.com/aoneahsan/macleanup/blob/main/LICENSE.md).

## Support the project

If macleanup saved you time, a star on the
[GitHub repository](https://github.com/aoneahsan/macleanup) and a mention to
another Mac developer are the kindest thanks.
