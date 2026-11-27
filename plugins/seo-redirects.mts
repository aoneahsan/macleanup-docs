/**
 * Redirects for addresses search engines still ask for, in one list the build-output contract re-checks
 * (`plugins/seo-contract.ts`).
 *
 * The docs used to generate a page per tag under `/tags/*`. Each listed pages a reader already reaches
 * from the sidebar or `/sitemap`, and search engines saw them as boilerplate (SA-P32, macleanup-docs#1). Pages keep
 * their labels as `topics:` front matter, shown as chips on `/sitemap`, and every old tag address leads to the
 * closest real page.
 */
import {readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';

/** One redirect, in the shape `@docusaurus/plugin-client-redirects` takes. */
export interface Redirect {
  readonly to: string;
  readonly from: string[];
}

/** Folders under `docs/` a topic can land on, most specific first (docs are served from the site root). */
const TOPIC_HOMES = ['getting-started', 'desktop-app', 'reference', 'tracking', 'before-you-run', 'white-label', 'compare', 'story'];

/** Docusaurus's tag permalink for a label: lower case, spaces to dashes. */
const slug = (label: string): string => label.trim().toLowerCase().replace(/\s+/g, '-');

/**
 * Reads every topic used in `docs/**` front matter, in either YAML form (`topics: [a, b]` or a `- a` list).
 *
 * @param docsDir - the docs folder
 * @param files - Markdown files relative to it
 * @returns the topic labels
 */
function topicsIn(docsDir: string, files: readonly string[]): Set<string> {
  const topics = new Set<string>();
  for (const file of files) {
    const source = readFileSync(path.join(docsDir, file), 'utf8');
    const frontMatter = source.startsWith('---') ? (source.split('---', 3)[1] ?? '') : '';
    const inline = /^topics:\s*\[([^\]]*)\]/m.exec(frontMatter)?.[1];
    const block = /^topics:\s*\n((?:\s+-\s+.*\n?)+)/m.exec(frontMatter)?.[1];
    const labels = inline?.split(',') ?? block?.split('\n').map((line) => line.replace(/^\s+-\s+/, '')) ?? [];
    for (const label of labels) if (label.trim()) topics.add(label.trim().replace(/^['"]|['"]$/g, ''));
  }
  return topics;
}

/**
 * Every redirect the site owns.
 *
 * @param siteDir - the docs site root
 * @returns one redirect group per retired tag page target
 */
export function seoRedirects(siteDir: string): Redirect[] {
  const docsDir = path.join(siteDir, 'docs');
  const files = readdirSync(docsDir, {recursive: true, encoding: 'utf8'}).filter((file) => /\.mdx?$/.test(file));
  const routes = new Set(files.map((file) => `/${file.replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '')}`.replace(/\/$/, '')));
  const byTarget = new Map<string, string[]>();
  const add = (to: string, from: string): void => {
    byTarget.set(to, [...(byTarget.get(to) ?? []), from]);
  };
  add('/sitemap', '/tags');
  for (const topic of topicsIn(docsDir, files)) {
    const tag = slug(topic);
    const home = [...TOPIC_HOMES.map((dir) => `/${dir}/${tag}`), `/${tag}`].find((route) => routes.has(route));
    add(home ?? '/sitemap', `/tags/${tag}`);
  }
  // `/docs` and `/docs/` were never pages here (docs are served from the root), but search engines request them.
  add('/intro', '/docs');
  return [...byTarget].map(([to, from]) => ({to, from}));
}
