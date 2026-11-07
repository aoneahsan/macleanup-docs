import React, { type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import hub from '@site/src/data/competitors.json';
import styles from './styles.module.css';

type Status = 'yes' | 'no' | 'partial' | 'not-stated';
type Cell = { status: Status; source?: string; checkedOn?: string; note?: string };
type Price = { plan: string; amount: number | null; period: string; note?: string; source: string; checkedOn: string };
type Rival = {
  slug: string;
  name: string;
  officialUrl: string;
  whatItIs: string;
  lastChecked: string;
  prices: Price[];
  features: Record<string, Cell>;
};

const WORD: Record<Status, string> = {
  yes: 'Yes',
  no: 'No',
  partial: 'Partial',
  'not-stated': 'Not stated on the pages we checked',
};
const rivals = hub.competitors as unknown as Rival[];
const ours = hub.ours.features as unknown as Record<string, Cell>;

const longDate = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** A link to someone else's site: new tab, and it passes no ranking credit. */
function Theirs({ href, children, label }: { href: string; children: ReactNode; label?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow" aria-label={label}>
      {children}
    </a>
  );
}

function money(p: Price): string {
  if (p.amount === null) return WORD['not-stated'];
  const figure = Number.isInteger(p.amount) ? String(p.amount) : p.amount.toFixed(2);
  if (p.period === 'once') return p.amount === 0 ? `$${figure}` : `$${figure} once`;
  return `$${figure} a ${p.period}`;
}

/** The dated fact table for one rival, from the same data the marketing site's page reads. */
export default function RivalFacts({ slug }: { slug: string }): ReactNode {
  const rival = rivals.find((r) => r.slug === slug);
  if (!rival) throw new Error(`RivalFacts: no rival "${slug}" in src/data/competitors.json`);
  return (
    <div className={styles.facts}>
      <p className={styles.checked}>
        Last checked <time dateTime={rival.lastChecked}>{longDate(rival.lastChecked)}</time>.{' '}
        <Theirs href={rival.officialUrl}>Check {rival.name} yourself</Theirs>
      </p>
      <table>
        <thead>
          <tr>
            <th>{rival.name} plan</th>
            <th>Price</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {rival.prices.map((p) => (
            <tr key={p.plan}>
              <td>
                {p.plan}
                {p.note ? <span className={styles.note}>{p.note}</span> : null}
              </td>
              <td>{money(p)}</td>
              <td>
                <Theirs href={p.source} label={`Source for ${rival.name}, ${p.plan}`}>
                  Source
                </Theirs>
                <span className={styles.note}>{longDate(p.checkedOn)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        macleanup's own prices are on <Link to="/desktop-app/plans">Plans and allowance</Link>.
      </p>
      <table>
        <thead>
          <tr>
            <th>What</th>
            <th>{rival.name}</th>
            <th>macleanup</th>
          </tr>
        </thead>
        <tbody>
          {hub.features.map((f) => {
            const theirs = rival.features[f.key];
            const mine = ours[f.key];
            return (
              <tr key={f.key}>
                <td>{f.label}</td>
                <td>
                  {WORD[theirs.status]}
                  {theirs.note ? <span className={styles.note}>{theirs.note}</span> : null}
                  {theirs.source ? (
                    <span className={styles.note}>
                      <Theirs href={theirs.source} label={`Source for ${rival.name}: ${f.label}`}>
                        Source
                      </Theirs>
                    </span>
                  ) : null}
                </td>
                <td>
                  {WORD[mine.status]}
                  {mine.note ? <span className={styles.note}>{mine.note}</span> : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** The guides, listed from the data so a new rival cannot be left out. */
export function RivalIndex(): ReactNode {
  return (
    <>
      <p className={styles.checked}>
        Last checked <time dateTime={hub.lastChecked}>{longDate(hub.lastChecked)}</time>.
      </p>
      <ul>
        {rivals.map((r) => (
          <li key={r.slug}>
            <Link to={`/compare/${r.slug}`}>Moving from {r.name}</Link>. {r.whatItIs}
          </li>
        ))}
      </ul>
    </>
  );
}
