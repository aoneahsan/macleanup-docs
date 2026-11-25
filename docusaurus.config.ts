import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { createSitemapItems } from './plugins/site-pages';
import { BLOG_DESCRIPTION, BLOG_PATH, BLOG_TITLE } from './src/data/blog';
import { OTHER_PLATFORMS } from './src/data/platforms';

// ---------------------------------------------------------------------------
// macleanup — Documentation site config
// Author: Ahsan Mahmood (https://aoneahsan.com)
// Source package: https://github.com/aoneahsan/macleanup (npm: macleanup)
//
// Deployment: GitHub Pages ONLY, built here and pushed to `gh-pages` by hand (no GitHub Actions).
// This repo is PUBLIC and holds no secrets — every analytics provider below is
// gated on its own env var, so an absent key skips it and the build still runs.
// ---------------------------------------------------------------------------

const SITE_URL = 'https://macleanup-docs.aoneahsan.com';

/**
 * Whether blog/ holds a post yet. Until it does, the blog stays off: an empty blog page would sit in sitemap.xml with
 * nothing on it, and a Blog link would point at it. The first post added to blog/ turns on the blog, its RSS and Atom
 * feeds, its search index, its dated sitemap entries, its Blog group on /sitemap and Posts on /feed, and the Blog links.
 */
const BLOG_DIR = fileURLToPath(new URL('./blog', import.meta.url));
const HAS_POSTS = existsSync(BLOG_DIR) && readdirSync(BLOG_DIR).some((name) => name.endsWith('.md') || name.endsWith('.mdx'));
const PKG_VERSION = '5.3.1';
// Update flow, layer 2: this docs build's own version and where its release record is read.
// The URL and publishable key are public by design (the desktop app ships them too).
const DOCS_VERSION: string = require('./package.json').version;
const RELEASE = {
  platform: 'docs',
  channel: process.env.MACLEANUP_RELEASE_CHANNEL === 'test' ? 'test' : 'production',
  version: DOCS_VERSION,
  api: 'https://epcuzfzldixtftnbudba.supabase.co',
  key: 'sb_publishable_WGrkaVhhrzJE8_8XcF_svQ_KCm3XNLM',
};

// Optional analytics. Absent ⇒ provider skipped entirely (no tag, no init).
const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID || '';
const CLARITY_PROJECT_ID = process.env.CLARITY_PROJECT_ID || '';

// Build-time visibility without ever printing a value.
// eslint-disable-next-line no-console
console.log(
  `[macleanup-docs] GA_MEASUREMENT_ID: ${GA_MEASUREMENT_ID ? 'SET' : 'NOT SET'} · ` +
    `CLARITY_PROJECT_ID: ${CLARITY_PROJECT_ID ? 'SET' : 'NOT SET'}`,
);

/** A markdown node as rehype hands it over: only the fields this step reads or sets. */
interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

/**
 * Wide tables scroll sideways on a phone; a scroll region must take keyboard focus
 * (axe `scrollable-region-focusable`), so every table gets tabIndex 0.
 */
function focusableTables() {
  const walk = (node: HastNode): void => {
    if (node.type === 'element' && node.tagName === 'table') {
      node.properties = { ...node.properties, tabIndex: 0 };
    }
    node.children?.forEach(walk);
  };
  return (tree: HastNode): void => walk(tree);
}

type PrismTheme = typeof prismThemes.github;

/** `#rgb`, `#rrggbb` or `rgb(r, g, b)` as three 0–255 channels; null for anything else. */
function channels(color: string): [number, number, number] | null {
  const rgb = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i.exec(color);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  let hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color)?.[1];
  if (!hex) return null;
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];
}

/** WCAG contrast ratio between two colours given as channels. */
function contrast(a: [number, number, number], b: [number, number, number]): number {
  const lum = (c: [number, number, number]) => {
    const [r, g, bl] = c.map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/**
 * The stock code themes keep some token colours under 4.5:1 on their own background
 * (GitHub numbers 2.6:1, Dracula comments 3.0:1). Mix each such colour toward the
 * theme's plain text colour, in small steps, until it reads at 4.6:1; hues stay close.
 */
function readable(theme: PrismTheme): PrismTheme {
  const bg = channels(theme.plain.backgroundColor ?? '');
  const text = channels(theme.plain.color ?? '');
  if (!bg || !text) return theme;
  const fix = (color: string): string => {
    const start = channels(color);
    if (!start || contrast(start, bg) >= 4.6) return color;
    for (let t = 0.05; t <= 1; t += 0.05) {
      const mixed = start.map((v, i) => Math.round(v + (text[i] - v) * t)) as [number, number, number];
      if (contrast(mixed, bg) >= 4.6) return `rgb(${mixed.join(', ')})`;
    }
    return theme.plain.color ?? color;
  };
  return {
    ...theme,
    styles: theme.styles.map((s) => (s.style.color ? { ...s, style: { ...s.style, color: fix(s.style.color) } } : s)),
  };
}

const config: Config = {
  customFields: { release: RELEASE },
  title: 'macleanup',
  tagline:
    'A safe-by-default macOS cleanup CLI with 28 targeted sections, confirmation by default, and a dry run that deletes no files.',
  favicon: 'img/favicon.svg',

  // Production URL — GitHub Pages on the custom domain macleanup-docs.aoneahsan.com.
  // Repository Pages settings own the domain for Actions deployments;
  // static/CNAME remains a matching build artifact.
  url: SITE_URL,
  baseUrl: '/',

  organizationName: 'aoneahsan',
  projectName: 'macleanup-docs',

  // The build IS the link checker.
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',

  future: { v4: true },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  trailingSlash: false,

  markdown: {
    mermaid: true,
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  // SEO + AI-citability head tags. The JSON-LD payloads let Google Rich
  // Results, Perplexity, ChatGPT and Claude extract structured entity data
  // when citing this documentation.
  // NOTE: no `rel=canonical` here. Docusaurus already emits a correct
  // SELF-REFERENTIAL canonical on every page. A hardcoded root canonical in
  // headTags would mark every route a duplicate of "/" and is a known cause of
  // "Alternate page with proper canonical tag" in Search Console.
  headTags: [
    {
      tagName: 'meta',
      attributes: { name: 'application-name', content: 'macleanup Docs' },
    },
    {
      tagName: 'meta',
      attributes: { name: 'apple-mobile-web-app-title', content: 'macleanup' },
    },
    {
      tagName: 'meta',
      attributes: { name: 'theme-color', content: '#005F45' },
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'macleanup Documentation',
        url: SITE_URL,
        description:
          'Documentation for macleanup, a safe-by-default macOS cleanup and maintenance command-line tool. 28 targeted sections covering developer caches, browser caches, logs, temp files, orphaned app data, stale build artefacts and unused apps. Every destructive action confirms first and --dry-run previews without deleting. Author: Ahsan Mahmood.',
        inLanguage: 'en',
        publisher: {
          '@type': 'Person',
          name: 'Ahsan Mahmood',
          url: 'https://aoneahsan.com',
          email: 'aoneahsan@gmail.com',
          sameAs: [
            'https://linkedin.com/in/aoneahsan',
            'https://github.com/aoneahsan',
            'https://www.npmjs.com/~aoneahsan',
          ],
        },
        license: 'https://opensource.org/licenses/MIT',
      }),
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: 'macleanup',
        codeRepository: 'https://github.com/aoneahsan/macleanup',
        programmingLanguage: 'Shell',
        runtimePlatform: 'macOS 11+, bash 3.2+',
        license: 'https://opensource.org/licenses/MIT',
        author: {
          '@type': 'Person',
          name: 'Ahsan Mahmood',
          url: 'https://aoneahsan.com',
        },
        description:
          'Single-file bash macOS cleanup and maintenance tool with 28 targeted sections, per-section confirmation, a real dry-run mode, named profiles, and dated logs and reports written to ~/.macleanup/.',
        keywords:
          'macos, cleanup, disk space, cache, uninstall, developer tools, node_modules, xcode, homebrew, docker, cli, bash, dry-run',
      }),
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'macleanup',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'macOS 11+',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        url: 'https://www.npmjs.com/package/macleanup',
        author: {
          '@type': 'Person',
          name: 'Ahsan Mahmood',
          url: 'https://aoneahsan.com',
        },
        description:
          'Command-line macOS cleanup tool: reclaim disk space from developer caches, browser caches, logs, temp files, orphaned application data, stale build artefacts and unused apps — with per-section confirmation and a dry-run preview.',
        softwareVersion: PKG_VERSION,
        license: 'https://opensource.org/licenses/MIT',
      }),
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Ahsan Mahmood',
        alternateName: 'aoneahsan',
        url: 'https://aoneahsan.com',
        email: 'aoneahsan@gmail.com',
        sameAs: [
          'https://linkedin.com/in/aoneahsan',
          'https://github.com/aoneahsan',
          'https://www.npmjs.com/~aoneahsan',
          'https://aoneahsan.com',
        ],
        founder: { '@type': 'Person', name: 'Ahsan Mahmood' },
      }),
    },
    // Microsoft Clarity — emitted ONLY when the project id is configured.
    ...(CLARITY_PROJECT_ID
      ? [
          {
            tagName: 'script',
            attributes: { type: 'text/javascript' },
            innerHTML: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", ${JSON.stringify(
              CLARITY_PROJECT_ID,
            )});`,
          },
        ]
      : []),
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: 'https://github.com/aoneahsan/macleanup-docs/edit/main/',
          showLastUpdateTime: true,
          breadcrumbs: true,
          rehypePlugins: [focusableTables],
          // `docs/` is BOTH the published content dir and the home of the
          // fixed-path internal file docs/MANUAL-TASKS.md. Keep the path (the
          // global rule fixes it) but never publish it — this repo is public.
          // NOTE: `exclude` REPLACES the plugin defaults, so they are restated.
          exclude: [
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
            'MANUAL-TASKS.md',
            'PACKAGES.md',
            'story/**',
          ],
        },
        blog: HAS_POSTS && {
          path: 'blog',
          routeBasePath: BLOG_PATH.slice(1),
          blogTitle: BLOG_TITLE,
          blogDescription: BLOG_DESCRIPTION,
          blogSidebarTitle: 'Recent posts',
          blogSidebarCount: 10,
          postsPerPage: 10,
          showReadingTime: false,
          // A post's last update comes from git, like a doc's: shown under the post, and its sitemap lastmod.
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
          // Every author and tag is defined once, in blog/authors.yml (and blog/tags.yml when a post uses one).
          onInlineAuthors: 'throw',
          onInlineTags: 'throw',
          // markdown.format is 'detect', so a post written as .md marks its excerpt with <!-- truncate -->.
          onUntruncatedBlogPosts: 'throw',
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
            title: BLOG_TITLE,
            description: BLOG_DESCRIPTION,
            copyright: 'Made by the macleanup team.',
            language: 'en-GB',
          },
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        // Google ignores changefreq and priority, so neither is emitted.
        // lastmod is the day each page's words last changed, and /search stays
        // out — see createSitemapItems in plugins/site-pages.ts.
        sitemap: {
          changefreq: null,
          priority: null,
          lastmod: 'date',
          // The blog's tag, author, archive and later list pages only repeat its posts; each post is listed once.
          ignorePatterns: ['/tags/**', '/search', '/blog/tags/**', '/blog/authors/**', '/blog/archive', '/blog/page/**'],
          createSitemapItems,
        },
        // GA4 — the key is spread in only when it exists, so an unset env var
        // means the plugin is never registered at all.
        ...(GA_MEASUREMENT_ID
          ? { gtag: { trackingID: GA_MEASUREMENT_ID, anonymizeIP: true } }
          : {}),
      } satisfies Preset.Options,
    ],
  ],

  // /sitemap, /feed, /feed.xml and the 404 head fix.
  plugins: ['./plugins/site-pages.ts'],
  clientModules: ['./src/clientModules/releaseGate.ts'],

  themes: [
    '@docusaurus/theme-mermaid',
    [
      // The package name, never require.resolve(): Docusaurus ships the site config to the browser, and a resolved
      // path would publish this machine's folders in main.js (the site-pages gate fails the build if it does).
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexDocs: true,
        indexBlog: HAS_POSTS,
        blogRouteBasePath: BLOG_PATH,
        indexPages: true,
        docsRouteBasePath: '/',
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 12,
        searchResultContextMaxLength: 60,
        explicitSearchResultPath: true,
      },
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    metadata: [
      { name: 'yandex-verification', content: 'bfb02722189028cf' },
      {
        name: 'description',
        content:
          'Documentation for macleanup — a safe-by-default macOS cleanup CLI with 28 targeted sections, per-section confirmation, and a real --dry-run. Learn exactly what it deletes before you run it.',
      },
      {
        name: 'keywords',
        content:
          'macleanup, mac cleanup, macos cleanup tool, free up disk space mac, clear cache mac, delete node_modules, xcode derivedData cleanup, homebrew cache clean, mac maintenance cli, dry run cleanup, uninstall mac apps completely, macos disk space',
      },
      { name: 'author', content: 'Ahsan Mahmood' },
      {
        name: 'robots',
        content:
          'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:creator', content: '@aoneahsan' },
      { name: 'twitter:site', content: '@aoneahsan' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'macleanup Docs' },
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'article:author', content: 'Ahsan Mahmood' },
    ],
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: false,
      },
    },
    navbar: {
      title: 'macleanup',
      logo: {
        alt: 'macleanup logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo.svg',
        width: 32,
        height: 32,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/before-you-run/what-gets-deleted',
          label: 'What it deletes',
          position: 'left',
        },
        { to: '/reference/cli', label: 'CLI', position: 'left' },
        { to: '/faq', label: 'FAQ', position: 'left' },
        ...(HAS_POSTS ? [{ to: BLOG_PATH, label: 'Blog', position: 'left' as const }] : []),
        {
          type: 'dropdown',
          label: 'Get macleanup',
          position: 'right',
          items: [
            ...OTHER_PLATFORMS.map((platform) => ({ label: platform.name, href: platform.href })),
            { label: 'All apps', to: '/apps' },
          ],
        },
        {
          href: 'https://www.npmjs.com/package/macleanup',
          label: 'npm',
          position: 'right',
        },
        {
          href: 'https://github.com/aoneahsan/macleanup',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Get macleanup',
          items: [
            ...OTHER_PLATFORMS.map((platform) => ({ label: platform.name, href: platform.href })),
            { label: 'All apps', to: '/apps' },
          ],
        },
        {
          title: 'Before you run',
          items: [
            { label: 'What gets deleted', to: '/before-you-run/what-gets-deleted' },
            { label: 'Preview with --dry-run', to: '/before-you-run/dry-run' },
            { label: 'Safety model', to: '/before-you-run/safety-model' },
          ],
        },
        {
          title: 'Documentation',
          items: [
            { label: 'Introduction', to: '/intro' },
            { label: 'Installation', to: '/getting-started/installation' },
            { label: 'CLI reference', to: '/reference/cli' },
            { label: 'The 28 sections', to: '/reference/sections' },
          ],
        },
        {
          title: 'Help',
          items: [
            { label: 'Recipes', to: '/recipes' },
            { label: 'Troubleshooting', to: '/troubleshooting' },
            { label: 'Recovery', to: '/recovery' },
            { label: 'FAQ', to: '/faq' },
          ],
        },
        {
          title: 'Project',
          items: [
            { label: 'Source (GitHub)', href: 'https://github.com/aoneahsan/macleanup' },
            { label: 'npm package', href: 'https://www.npmjs.com/package/macleanup' },
            { label: 'Report an issue', href: 'https://github.com/aoneahsan/macleanup/issues' },
            { label: 'About and contact', to: '/about-the-author' },
          ],
        },
        {
          title: 'Find everything',
          items: [
            ...(HAS_POSTS ? [{ label: 'Blog', to: BLOG_PATH }] : []),
            { label: 'Sitemap', to: '/sitemap' },
            { label: 'Moving to macleanup', to: '/compare' },
            { label: 'Release feed', to: '/feed' },
            // feed.xml is written after the build, where the link checker
            // cannot see it, so it is linked by its absolute URL.
            { label: 'RSS (feed.xml)', href: `${SITE_URL}/feed.xml` },
            { label: 'llms.txt', href: `${SITE_URL}/llms.txt` },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Ahsan Mahmood. Built with Docusaurus. macleanup is MIT-licensed and comes with no warranty.`,
    },
    prism: {
      theme: readable(prismThemes.github),
      darkTheme: readable(prismThemes.dracula),
      additionalLanguages: ['bash', 'json', 'ini', 'diff'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
