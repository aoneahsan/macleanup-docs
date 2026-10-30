import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { createSitemapItems } from './plugins/site-pages';

// ---------------------------------------------------------------------------
// macleanup — Documentation site config
// Author: Ahsan Mahmood (https://aoneahsan.com)
// Source package: https://github.com/aoneahsan/macleanup (npm: macleanup)
//
// Deployment: GitHub Pages ONLY (.github/workflows/deploy-pages.yml).
// This repo is PUBLIC and holds no secrets — every analytics provider below is
// gated on its own env var, so an absent key skips it and the build still runs.
// ---------------------------------------------------------------------------

const SITE_URL = 'https://macleanup-docs.aoneahsan.com';
const PKG_VERSION = '5.3.0';
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
      attributes: { name: 'theme-color', content: '#6E56F7' },
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
            'story/**',
          ],
        },
        blog: false,
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
          ignorePatterns: ['/tags/**', '/search'],
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
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexDocs: true,
        indexBlog: false,
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
            { label: 'Sitemap', to: '/sitemap' },
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
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'ini', 'diff'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
