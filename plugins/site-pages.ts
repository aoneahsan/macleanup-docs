import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import GithubSlugger from 'github-slugger';
import type { LoadContext, Plugin, RouteConfig } from '@docusaurus/types';
import sidebars from '../sidebars';

/**
 * site-pages — the four discovery routes every docs site ships.
 *
 * - `/sitemap`  a readable page of every docs page, grouped in sidebar order.
 * - `/feed`     a readable list of releases.
 * - `/feed.xml` RSS 2.0, written after the build.
 * - `sitemap.xml` lastmod values, through {@link createSitemapItems}.
 *
 * `docs/changelog.md` is the ONLY release source: each `## X.Y.Z — title`
 * heading is followed by a `*Released YYYY-MM-DD.*` line. The feed is parsed
 * from it, so the page and the feed cannot disagree.
 */

const SITE_DIR = path.resolve(__dirname, '..');
const CHANGELOG = 'docs/changelog.md';
const TODAY = new Date().toISOString().slice(0, 10);

/** The sitemap plugin's item shape (not exported by @docusaurus/plugin-sitemap). */
type SitemapItem = { url: string; lastmod?: string | null };

/** One release, parsed from the changelog. */
export type Release = {
  version: string;
  title: string;
  date: string;
  anchor: string;
  summary: string;
};

/** One card on the /sitemap page. */
export type SitemapCard = {
  title: string;
  description: string;
  permalink: string;
  tags: string[];
  keywords: string[];
};

/** One group of cards on the /sitemap page, in sidebar order. */
export type SitemapGroup = { key: string; label: string; cards: SitemapCard[] };

/** Strip inline Markdown so a feed description reads as plain text. */
function plainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Parse every dated release from docs/changelog.md, newest first. */
export function readReleases(): Release[] {
  const source = readFileSync(path.join(SITE_DIR, CHANGELOG), 'utf8');
  const slugger = new GithubSlugger();
  const releases: Release[] = [];
  let current: (Release & { body: string[] }) | null = null;
  const flush = () => {
    if (current) {
      const { body, ...release } = current;
      releases.push({ ...release, summary: plainText(body.join(' ')) });
    }
    current = null;
  };
  for (const line of source.split('\n')) {
    const heading = /^## (.+)$/.exec(line);
    if (heading) {
      flush();
      const text = heading[1].trim();
      const anchor = slugger.slug(text);
      const version = /^(\d+\.\d+\.\d+)/.exec(text);
      if (version) {
        const title = text.replace(/^\d+\.\d+\.\d+\s*(—\s*)?/, '').trim();
        current = { version: version[1], title, date: '', anchor, summary: '', body: [] };
      }
      continue;
    }
    if (!current) continue;
    const released = /^\*Released (\d{4}-\d{2}-\d{2})\.\*$/.exec(line.trim());
    if (released) current.date = released[1];
    else if (line.trim() && !line.startsWith('```')) current.body.push(line.trim().replace(/^- /, ''));
  }
  flush();
  const undated = releases.filter((r) => !r.date).map((r) => r.version);
  if (undated.length) {
    throw new Error(`[site-pages] ${CHANGELOG}: no "*Released YYYY-MM-DD.*" line under ${undated.join(', ')}`);
  }
  return releases;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** RSS 2.0 for the releases, with an Atom self link. */
function renderFeedXml(siteUrl: string, releases: Release[]): string {
  const items = releases
    .map((r) => {
      const link = `${siteUrl}/changelog#${r.anchor}`;
      const title = r.title ? `macleanup ${r.version} — ${r.title}` : `macleanup ${r.version}`;
      return [
        '    <item>',
        `      <title>${escapeXml(title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="false">macleanup-${r.version}</guid>`,
        `      <pubDate>${new Date(`${r.date}T00:00:00Z`).toUTCString()}</pubDate>`,
        '      <category>release</category>',
        `      <description>${escapeXml(r.summary)}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>macleanup releases</title>',
    `    <link>${siteUrl}/changelog</link>`,
    '    <description>Every macleanup release: what changed, newest first.</description>',
    '    <language>en</language>',
    `    <lastBuildDate>${new Date(`${releases[0].date}T00:00:00Z`).toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}

type SidebarItem =
  | string
  | { type: string; label?: string; link?: { slug?: string; title?: string; description?: string }; items?: SidebarItem[] };
type Group = { key: string; label: string; slug?: string; indexTitle?: string; indexDescription?: string; ids: string[] };

/** Sidebar walk: category groups in order, plus the top-level docs. */
function sidebarGroups(): Group[] {
  const groups: Group[] = [
    { key: 'start', label: 'Start here', ids: [] },
  ];
  const more = { key: 'more', label: 'Recipes, FAQ and releases', ids: [] as string[] };
  for (const item of sidebars.mainSidebar as SidebarItem[]) {
    if (typeof item === 'string') {
      (item === 'intro' ? groups[0] : more).ids.push(item);
    } else if (item.type === 'category') {
      groups.push({
        key: (item.link?.slug ?? item.label ?? '').replace(/^\//, '') || 'about',
        label: item.label ?? '',
        slug: item.link?.slug,
        indexTitle: item.link?.title,
        indexDescription: item.link?.description,
        ids: (item.items ?? []).filter((i): i is string => typeof i === 'string'),
      });
    }
  }
  groups.push(more);
  return groups;
}

type DocLike = {
  id: string;
  title: string;
  description: string;
  permalink: string;
  tags: { label: string }[];
  frontMatter: { keywords?: string[] };
};

/** The local plugin. */
export default function sitePages(context: LoadContext): Plugin<Release[]> {
  const siteUrl = context.siteConfig.url.replace(/\/$/, '');
  return {
    name: 'site-pages',
    loadContent: () => readReleases(),
    async allContentLoaded({ allContent, actions }) {
      const docsPlugin = allContent['docusaurus-plugin-content-docs'] as {
        default: { loadedVersions: { docs: DocLike[] }[] };
      };
      const version = docsPlugin.default.loadedVersions[0];
      const byId = new Map(version.docs.map((d) => [d.id, d]));
      const toCard = (d: DocLike): SitemapCard => ({
        title: d.title,
        description: d.description,
        permalink: d.permalink,
        tags: d.tags.map((t) => t.label),
        keywords: d.frontMatter.keywords ?? [],
      });
      const groups: SitemapGroup[] = sidebarGroups().map((g) => {
        const cards: SitemapCard[] = [];
        if (g.slug) {
          cards.push({ title: g.indexTitle ?? g.label, description: g.indexDescription ?? '', permalink: g.slug, tags: ['overview'], keywords: [] });
        }
        for (const id of g.ids) {
          const doc = byId.get(id);
          if (!doc) throw new Error(`[site-pages] sidebar id "${id}" has no doc`);
          cards.push(toCard(doc));
        }
        return { key: g.key, label: g.label, cards };
      });
      groups.push({
        key: 'site',
        label: 'Site',
        cards: [
          { title: 'Home', description: 'The macleanup documentation home page.', permalink: '/', tags: ['home'], keywords: [] },
          { title: 'Release feed', description: 'Every macleanup release, newest first, with an RSS feed.', permalink: '/feed', tags: ['releases', 'rss'], keywords: ['changelog', 'updates'] },
        ],
      });
      const releases = readReleases();
      const sitemapData = await actions.createData('sitemap-page.json', JSON.stringify({ groups }));
      const feedData = await actions.createData('feed-page.json', JSON.stringify({ releases }));
      actions.addRoute({ path: '/sitemap', component: '@site/src/components/SitemapPage', exact: true, modules: { data: sitemapData } });
      actions.addRoute({ path: '/feed', component: '@site/src/components/FeedPage', exact: true, modules: { data: feedData } });
    },
    injectHtmlTags: () => ({
      headTags: [
        {
          tagName: 'link',
          attributes: { rel: 'alternate', type: 'application/rss+xml', title: 'macleanup releases', href: `${siteUrl}/feed.xml` },
        },
      ],
    }),
    async postBuild({ outDir, content }) {
      writeFileSync(path.join(outDir, 'feed.xml'), renderFeedXml(siteUrl, content));
      // GitHub Pages serves 404.html for every unknown path. It must not be
      // indexable and must not name itself as a canonical page.
      const notFound = path.join(outDir, '404.html');
      if (!existsSync(notFound)) throw new Error('[site-pages] build has no 404.html');
      const html = readFileSync(notFound, 'utf8')
        .replace(/<link[^>]*rel=["']?canonical["']?[^>]*>/g, '')
        .replace(/<meta[^>]*property=["']?og:url["']?[^>]*>/g, '')
        .replace(/(<meta[^>]*name=["']?robots["']?[^>]*content=)("[^"]*"|[^\s>]+)/g, '$1"noindex, follow"');
      writeFileSync(notFound, html);
      // The local-search results page is a utility screen, not content: keep it out
      // of the index while its links stay followable.
      const search = path.join(outDir, 'search.html');
      if (existsSync(search)) {
        const page = readFileSync(search, 'utf8')
          .replace(/(<meta[^>]*name=["']?robots["']?[^>]*content=)("[^"]*"|[^\s>]+)/g, '$1"noindex, follow"');
        writeFileSync(search, page);
      }
    },
  };
}

// ---------------------------------------------------------------------------
// sitemap.xml lastmod — the day each page's words last changed.
// ---------------------------------------------------------------------------

let dirtyFiles: Set<string> | null = null;
function isDirty(file: string): boolean {
  if (!dirtyFiles) {
    const status = execSync('git status --porcelain --untracked-files=all', { cwd: SITE_DIR, encoding: 'utf8' });
    dirtyFiles = new Set(status.split('\n').filter(Boolean).map((l) => l.slice(3).trim()));
  }
  return dirtyFiles.has(file);
}

/** Git date of a file's last commit; today when it has uncommitted changes. */
function fileDate(file: string): string {
  if (isDirty(file)) return TODAY;
  const date = execSync(`git log -1 --format=%cs -- "${file}"`, { cwd: SITE_DIR, encoding: 'utf8' }).trim();
  return date || TODAY;
}

function flatten(routes: RouteConfig[]): RouteConfig[] {
  return routes.flatMap((r) => [r, ...flatten(r.routes ?? [])]);
}

const newest = (dates: (string | undefined)[]): string | undefined =>
  dates.filter((d): d is string => Boolean(d)).sort().at(-1);

/**
 * `createSitemapItems` for the sitemap plugin: no changefreq or priority, no
 * `/search`, and a truthful lastmod on every URL. Throws on an undated URL.
 */
export async function createSitemapItems<T extends SitemapItem>(params: {
  defaultCreateSitemapItems: (p: { siteConfig: LoadContext['siteConfig']; routes: RouteConfig[] }) => Promise<T[]>;
  siteConfig: LoadContext['siteConfig'];
  routes: RouteConfig[];
}): Promise<T[]> {
  const { defaultCreateSitemapItems, ...rest } = params;
  const siteUrl = rest.siteConfig.url.replace(/\/$/, '');
  const items = (await defaultCreateSitemapItems(rest)).filter((i) => !/\/search$/.test(i.url));
  const byPath = new Map<string, string>();
  for (const route of flatten(rest.routes)) {
    const source = route.metadata?.sourceFilePath;
    if (source && !byPath.has(route.path)) byPath.set(route.path, fileDate(source.replace(/^@site\//, '')));
  }
  // Category index pages take the newest of the pages they list.
  const docPath = (id: string) => `/${id === 'intro' ? 'intro' : id}`;
  for (const group of sidebarGroups()) {
    if (group.slug) byPath.set(group.slug, newest(group.ids.map((id) => byPath.get(docPath(id)))) ?? '');
  }
  byPath.set('/feed', fileDate(CHANGELOG));
  byPath.set('/sitemap', newest([...byPath.values()]) ?? '');
  const undated: string[] = [];
  const result = items.map((item) => {
    const p = item.url.slice(siteUrl.length) || '/';
    const lastmod = byPath.get(p);
    if (!lastmod) undated.push(p);
    return { ...item, lastmod, changefreq: null, priority: null };
  });
  if (undated.length) throw new Error(`[site-pages] sitemap URLs with no lastmod: ${undated.join(', ')}`);
  return result;
}
