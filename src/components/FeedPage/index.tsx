import React, { type ReactNode } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import type { Release } from '@site/plugins/site-pages';

type Props = { data: { releases: Release[] } };

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** /feed — the readable release list; /feed.xml carries the same items. */
export default function FeedPage({ data }: Props): ReactNode {
  return (
    <Layout title="Release feed" description="Every macleanup release, newest first, with the date it shipped and what changed. Subscribe with the RSS feed.">
      <main className="container margin-vert--lg">
        <h1>Release feed</h1>
        <p>
          Every macleanup release, newest first. Subscribe in any feed reader with{' '}
          <a href="/feed.xml">feed.xml</a>. The full notes are on the{' '}
          <Link to="/changelog">release history</Link> page.
        </p>
        {data.releases.map((release) => (
          <article key={release.version} className="margin-bottom--lg">
            <h2 id={`v${release.version.replace(/\./g, '-')}`}>
              <Link to={`/changelog#${release.anchor}`}>
                {release.version}
                {release.title ? ` — ${release.title}` : ''}
              </Link>
            </h2>
            <p>
              <time dateTime={release.date}>{formatDate(release.date)}</time>
            </p>
            <p>{release.summary}</p>
          </article>
        ))}
      </main>
    </Layout>
  );
}
