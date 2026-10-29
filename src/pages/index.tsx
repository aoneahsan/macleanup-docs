import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';

type Card = {
  title: string;
  body: string;
};

const WHAT_IT_REMOVES: Card[] = [
  {
    title: 'Developer caches',
    body: 'Xcode DerivedData and simulators, Gradle and Android caches, and the package-manager caches for npm, yarn, pnpm, Homebrew, pip, CocoaPods, cargo, go, Ruby and Flutter. All regenerate on next use.',
  },
  {
    title: 'System, user and browser caches',
    body: '~/Library/Caches and Saved Application State, /Library/Caches (sudo), and the cache directories of Chrome, Brave, Edge, Vivaldi, Chromium, Opera, DuckDuckGo, Arc and the Firefox family. Bookmarks, history and passwords are not touched.',
  },
  {
    title: 'Logs, temp files and update caches',
    body: 'Old user and system logs, $TMPDIR / /tmp / ~/tmp entries you own, and downloaded update caches. Trash is emptied only when you say so.',
  },
  {
    title: 'Stale build artefacts',
    body: 'node_modules, vendor, dist, .next, target, Pods and similar directories inside your scan roots — but only when they have been untouched (atime AND mtime) for the full idle threshold.',
  },
  {
    title: 'Orphaned app data and unused apps',
    body: 'Leftover application-support and container data with no installed app, and applications idle past your threshold. Apps go to the Trash, so they are recoverable until you empty it.',
  },
  {
    title: 'Reports, not deletions',
    body: 'Several sections only look: system health, installer leftovers, large files, LaunchAgents audit and a disk-usage report write a dated .txt to ~/.macleanup/reports/ and delete nothing.',
  },
];

const SAFETY: Card[] = [
  {
    title: '--dry-run deletes nothing',
    body: 'Every destructive helper checks the flag and prints what it would remove instead of removing it. Since 4.6.1 a dry run also estimates the space that would be freed.',
  },
  {
    title: 'Per-section confirmation',
    body: 'Destructive operations prompt before running unless you pass --yes. Section 14 additionally requires a typed "yes" and a reboot afterwards.',
  },
  {
    title: 'The deep sections never auto-run',
    body: 'Sections 6, 11, 14, 21 and 24 are refused in batch mode unless you add --i-understand-deep on top of --yes. --all (even --all --yes) never runs them.',
  },
  {
    title: 'Two conditions before a non-cache delete',
    body: 'In sections 12, 21, 23 and 24 an item is removed automatically only when it is both unused by any installed tool and untouched for at least --idle-days days.',
  },
  {
    title: 'Toolchain directories are off limits',
    body: 'A hard allowlist stops section 23 entering ~/.bun, ~/.pnpm-store, ~/.volta and friends, and it refuses to scan without explicit roots rather than falling back to your entire home directory.',
  },
  {
    title: 'No telemetry',
    body: 'The script makes no network calls. The single exception is the opt-in --check-update, an unauthenticated GET to the npm registry that sends no data about you.',
  },
];

function HomepageHeader(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
        <p className={styles.heroTagline}>{siteConfig.tagline}</p>
        <div className={styles.heroCode}>npx macleanup --dry-run --all</div>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/before-you-run/what-gets-deleted"
          >
            See what it deletes
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/getting-started/installation"
          >
            Install
          </Link>
        </div>
      </div>
    </header>
  );
}

function CardGrid({ cards }: { cards: Card[] }): ReactNode {
  return (
    <div className={clsx('row', styles.cardGrid)}>
      {cards.map((card) => (
        <div className="col col--4" key={card.title}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>{card.title}</div>
            <p className={styles.cardBody}>{card.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="macOS cleanup CLI — see exactly what it deletes first"
      description="Documentation for macleanup, a safe-by-default macOS cleanup and maintenance CLI. 28 targeted sections, per-section confirmation, and a real --dry-run so you can see every file before it goes."
    >
      <HomepageHeader />

      <div className={styles.warningStrip}>
        <strong>macleanup permanently deletes files.</strong> Most of what it
        removes is regenerable cache, but not all of it is —{' '}
        <Link to="/before-you-run/what-gets-deleted">
          read what gets deleted
        </Link>{' '}
        and preview with{' '}
        <Link to="/before-you-run/dry-run">
          <code>--dry-run</code>
        </Link>{' '}
        before your first real run.
      </div>

      <main>
        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>What it removes</h2>
            <p className={styles.sectionLead}>
              Twenty-eight numbered sections, each one chosen from a menu or by
              number. Nothing runs that you did not select.
            </p>
            <CardGrid cards={WHAT_IT_REMOVES} />
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>How it avoids surprises</h2>
            <p className={styles.sectionLead}>
              The guarantees below are real, and they are not a substitute for a
              backup. macleanup runs <code>rm -rf</code> and <code>sudo</code>{' '}
              on your machine, and you are responsible for verifying its output.
            </p>
            <CardGrid cards={SAFETY} />
          </div>
        </section>

        <section className={styles.section}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 className={styles.sectionTitle}>Start here</h2>
            <p className={styles.sectionLead}>
              Read what it deletes, preview a run, then install.
            </p>
            <div className={styles.buttons}>
              <Link className="button button--primary button--lg" to="/intro">
                Introduction
              </Link>
              <Link
                className="button button--secondary button--lg"
                to="/reference/sections"
              >
                The 28 sections
              </Link>
              <Link
                className="button button--secondary button--lg"
                to="/reference/cli"
              >
                CLI reference
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
