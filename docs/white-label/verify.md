---
title: Check a macleanup licence
description: How to check a macleanup white-label licence by key or by website, and the licence file each deployment serves.
tags: [white-label, licensing, verification]
sidebar_position: 4
sidebar_label: Check a licence
keywords: [verify macleanup licence, macleanup licence key, macleanup white-label license file]
---

# Check a licence

Anyone can check a licence on the
[verify page](https://macleanup.aoneahsan.com/verify-license), by licence key
or by the website a branded build is downloaded from. Verification is run by
our licensing service.

## The licence file {#file}

Every licensed deployment serves:

```text
/.well-known/macleanup-white-label-license.json
```

A website check reads that file and confirms the key it names. The answer
shows the licence holder, what the licence covers and its dates; never an
email address or a price.

## Inside a branded desktop build {#in-app}

A branded desktop build checks its key once at start and when its window
comes back. If the key is revoked or unknown, the app stops at a "This licence
is not active" screen. Nothing on the Mac is changed or deleted. Without a
network connection the app keeps working and checks again at the next start.
