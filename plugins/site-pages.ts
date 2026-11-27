import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import GithubSlugger from 'github-slugger';
import type { BlogContent } from '@docusaurus/plugin-content-blog';
import type { LoadContext, Plugin, RouteConfig } from '@docusaurus/types';
import sidebars from '../sidebars';

/**
 * Docusaurus writes every route module's path into the client bundle, so the absolute path createData returns
 * would publish this machine's folders and give each machine different chunk names. addRoute gets the alias.
 */
function generatedModule(generatedFilesDir: string, file: string): string {
  return `@generated/${path.relative(generatedFilesDir, file).split(path.sep).join('/')}`;
}

/** Fails the build when any client bundle still carries this site's absolute path. */
function assertNoLocalPaths(outDir: string, siteDir: string): void {
  const jsDir = path.join(outDir, 'assets', 'js');
  const forms = [siteDir.split(path.sep).join('/'), siteDir.split(path.sep).join('\\\\')];
  for (const file of readdirSync(jsDir).filter((name) => name.endsWith('.js'))) {
    const text = readFileSync(path.join(jsDir, file), 'utf8');
    const found = forms.find((form) => text.includes(form));
    if (found) throw new Error(`${file} carries the local path ${found}: pass createData paths to addRoute through generatedModule()`);
  }
}

/** One blog post as /feed lists it: published on `date` (`YYYY-MM-DD`, its own front matter). */
export type FeedPost = { title: string; description: string; permalink: string; date: string };

/**
 * The blog posts the blog plugin loaded, newest first. Drafts are already gone from a production build; an unlisted
 * post stays out, as it does from the blog's own lists. Empty while the blog is off (no post in blog/ yet).
 *
 * @param blog - the blog plugin's loaded content, or undefined while the blog is off
 * @returns the posts /feed and /sitemap list
 */
function blogPosts(blog: BlogContent | undefined): FeedPost[] {
  return (blog?.blogPosts ?? [])
    .filter((post) => !post.metadata.unlisted)
    .map(({ metadata }) => ({
      title: metadata.title,
      description: metadata.description,
      permalink: metadata.permalink,
      date: new Date(metadata.date).toISOString().slice(0, 10),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

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
  // Line endings normalised first: a Windows checkout (core.autocrlf) writes CRLF, and `.` in the heading pattern
  // stops at the `\r`, so no release would ever be found.
  const source = readFileSync(path.join(SITE_DIR, CHANGELOG), 'utf8').replace(/\r\n?/g, '\n');
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
  | { type: string; label?: string; link?: { slug?: string; id?: string; title?: string; description?: string }; items?: SidebarItem[] };
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
        key: (item.link?.slug ?? item.link?.id?.split('/')[0] ?? item.label ?? '').replace(/^\//, '') || 'about',
        label: item.label ?? '',
        slug: item.link?.slug,
        indexTitle: item.link?.title,
        indexDescription: item.link?.description,
        ids: [...(item.link?.id ? [item.link.id] : []), ...(item.items ?? []).filter((i): i is string => typeof i === 'string')],
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
  frontMatter: { keywords?: string[]; topics?: string[] };
};

/** Facts about other Mac cleaners; a copy of the marketing site's file, which refuses to build if the two differ. */
const compareData = JSON.parse(readFileSync(path.join(SITE_DIR, 'src/data/competitors.json'), 'utf8')) as {
  lastChecked: string;
  competitors: { slug: string; lastChecked: string }[];
};

/** Every third-party link on a compare guide is a new tab with nofollow, checked in the built HTML. */
function checkCompareLinks(outDir: string, siteUrl: string): void {
  const ours = [siteUrl, 'https://macleanup.aoneahsan.com', 'https://aoneahsan.com', 'https://github.com/aoneahsan/', 'https://www.npmjs.com/package/macleanup'];
  // `trailingSlash: true`: every page is `<route>/index.html` (macleanup-docs#1, SA-P26).
  const files = ['compare/index.html', ...compareData.competitors.map((c) => `compare/${c.slug}/index.html`)];
  const faults: string[] = [];
  let links = 0;
  for (const file of files) {
    const html = readFileSync(path.join(outDir, file), 'utf8');
    const canonicals = [...html.matchAll(/<link[^>]*rel=["']?canonical["']?[^>]*>/g)];
    const self = `${siteUrl}/${file.replace(/index\.html$/, '')}`;
    // The built HTML is minified, so an attribute may have no quotes.
    if (canonicals.length !== 1 || !new RegExp(`href=["']?${self.replace(/[.]/g, '\\.')}["'\\s/>]`).test(canonicals[0][0])) faults.push(`${file}: canonical is not ${self}`);
    for (const a of html.matchAll(/<a\s[^>]*href=["']?(https?:\/\/[^"'\s>]+)[^>]*>/g)) {
      links += 1;
      if (ours.some((o) => a[1].startsWith(o))) continue;
      if (!/rel="noopener noreferrer nofollow"/.test(a[0]) || !/target=["']?_blank/.test(a[0])) faults.push(`${file}: ${a[1]}`);
    }
  }
  if (!links) faults.push('no absolute links found: the check matched nothing, so it proves nothing');
  if (faults.length) throw new Error(`[site-pages] compare guides refused:\n  ${faults.join('\n  ')}`);
}

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
        // Topics are front matter, not tag routes: the /tags/* pages were retired (macleanup-docs#1, SA-P32).
        tags: topicsOf(d.frontMatter),
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
      // The blog, once it has posts: led by the blog's own page, its words the blog plugin's (src/data/blog.ts).
      const blog = (allContent['docusaurus-plugin-content-blog'] as { default?: BlogContent } | undefined)?.default;
      const posts = blogPosts(blog);
      if (blog && posts.length) {
        groups.push({
          key: 'blog',
          label: 'Blog',
          cards: [
            { title: blog.blogTitle, description: blog.blogDescription, permalink: '/blog', tags: ['blog'], keywords: ['posts'] },
            ...posts.map((post) => ({ title: post.title, description: post.description, permalink: post.permalink, tags: ['blog'], keywords: [] })),
          ],
        });
      }
      groups.push({
        key: 'site',
        label: 'Site',
        cards: [
          { title: 'Home', description: 'The macleanup documentation home page.', permalink: '/', tags: ['home'], keywords: [] },
          { title: 'Release feed', description: 'Every macleanup release, newest first, with an RSS feed.', permalink: '/feed', tags: ['releases', 'rss'], keywords: ['changelog', 'updates'] },
        ],
      });
      const releases = readReleases();
      const sitemapData = generatedModule(context.generatedFilesDir, await actions.createData('sitemap-page.json', JSON.stringify({ groups })));
      const feedData = generatedModule(context.generatedFilesDir, await actions.createData('feed-page.json', JSON.stringify({ releases, posts })));
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
      assertNoLocalPaths(outDir, context.siteDir);
      writeFileSync(path.join(outDir, 'feed.xml'), renderFeedXml(siteUrl, content));
      checkCompareLinks(outDir, siteUrl);
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
      const search = path.join(outDir, 'search', 'index.html');
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
/**
 * A pathname without its trailing slash (`/` stays `/`): under `trailingSlash: true` routes and sitemap URLs end in
 * `/`, and the date lookups compare routes in this one form.
 *
 * @param pathname - a pathname or route path
 * @returns the same route, slashless
 */
export function routeKey(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
}

/**
 * A doc's topic labels from its `topics:` front matter.
 *
 * @param frontMatter - the doc's front matter
 * @returns the labels, empty when it has none
 */
function topicsOf(frontMatter: object | undefined): string[] {
  const topics = (frontMatter as {topics?: unknown} | undefined)?.topics;
  return Array.isArray(topics) ? topics.map(String) : [];
}

export async function createSitemapItems<T extends SitemapItem>(params: {
  defaultCreateSitemapItems: (p: { siteConfig: LoadContext['siteConfig']; routes: RouteConfig[] }) => Promise<T[]>;
  siteConfig: LoadContext['siteConfig'];
  routes: RouteConfig[];
}): Promise<T[]> {
  const { defaultCreateSitemapItems, ...rest } = params;
  const siteUrl = rest.siteConfig.url.replace(/\/$/, '');
  const items = (await defaultCreateSitemapItems(rest)).filter((i) => !/\/search\/?$/.test(i.url));
  const byPath = new Map<string, string>();
  for (const route of flatten(rest.routes)) {
    const source = route.metadata?.sourceFilePath;
    if (source && !byPath.has(routeKey(route.path))) byPath.set(routeKey(route.path), fileDate(source.replace(/^@site\//, '')));
  }
  // Category index pages take the newest of the pages they list.
  const docPath = (id: string) => `/${id === 'intro' ? 'intro' : id}`;
  for (const group of sidebarGroups()) {
    if (group.slug) byPath.set(group.slug, newest(group.ids.map((id) => byPath.get(docPath(id)))) ?? '');
  }
  // A compare guide is dated by when its facts were last read, the date it shows.
  byPath.set('/compare', compareData.lastChecked);
  for (const c of compareData.competitors) byPath.set(`/compare/${c.slug}`, c.lastChecked);
  byPath.set('/feed', fileDate(CHANGELOG));
  // The blog's own page lists its posts, so it takes the newest of their dates (each post is dated by its file).
  const postDates = [...byPath].filter(([p]) => p.startsWith('/blog/')).map(([, date]) => date);
  if (postDates.length) byPath.set('/blog', newest(postDates) ?? '');
  byPath.set('/sitemap', newest([...byPath.values()]) ?? '');
  const undated: string[] = [];
  const result = items.map((item) => {
    const p = routeKey(item.url.slice(siteUrl.length) || '/');
    const lastmod = byPath.get(p);
    if (!lastmod) undated.push(p);
    return { ...item, lastmod, changefreq: null, priority: null };
  });
  if (undated.length) throw new Error(`[site-pages] sitemap URLs with no lastmod: ${undated.join(', ')}`);
  return result;
}
