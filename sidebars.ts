import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Sidebar layout for macleanup docs.
 *
 * Ordering is deliberate and reflects what the tool is: macleanup DELETES
 * files. "Before you run" therefore sits ABOVE "Getting started" — a reader
 * must be able to see what will be removed, and how to preview it, before
 * they are shown how to install and invoke it.
 */
const sidebars: SidebarsConfig = {
  mainSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Before you run',
      collapsed: false,
      link: {
        type: 'generated-index',
        title: 'Before you run macleanup',
        description:
          'macleanup deletes files. Read these three pages first: what it removes, how to preview a run without deleting anything, and the guarantees the safety model does and does not give you.',
        slug: '/before-you-run',
      },
      items: [
        'before-you-run/what-gets-deleted',
        'before-you-run/dry-run',
        'before-you-run/safety-model',
      ],
    },
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      link: {
        type: 'generated-index',
        title: 'Getting started',
        description:
          'Install macleanup — or run it with no install at all — and walk through a first session end to end.',
        slug: '/getting-started',
      },
      items: ['getting-started/installation', 'getting-started/first-run', 'getting-started/upgrading-to-5'],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      link: {
        type: 'generated-index',
        title: 'Reference',
        description:
          'Every flag, every section, every profile, the config file, where logs and reports are written, and the JSON event stream.',
        slug: '/reference',
      },
      items: [
        'reference/cli',
        'reference/sections',
        'reference/profiles',
        'reference/configuration',
        'reference/reports-and-logs',
        'reference/json-events',
      ],
    },
    {
      type: 'category',
      label: 'Desktop app',
      collapsed: false,
      link: {
        type: 'generated-index',
        title: 'The macleanup desktop app',
        description:
          'The macleanup desktop app runs the same script in a window: installing it, what the plans include, what stays on your Mac, and the keyboard shortcuts.',
        slug: '/desktop-app',
      },
      items: [
        'desktop-app/overview',
        'desktop-app/install',
        'desktop-app/plans',
        'desktop-app/privacy',
        'desktop-app/keyboard-shortcuts',
      ],
    },
    'recipes',
    {
      type: 'category',
      label: 'White-label & licensing',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'White-label & licensing',
        description:
          'macleanup under your name: what a white-label licence delivers for the desktop app and the command-line tool, updates and renewals, the desktop app buyout, and how to check a licence.',
        slug: '/white-label',
      },
      items: ['white-label/overview', 'white-label/delivery', 'white-label/updates', 'white-label/verify', 'white-label/faq'],
    },
    {
      type: 'category',
      label: 'Moving to macleanup',
      collapsed: true,
      link: { type: 'doc', id: 'compare/index' },
      items: [
        'compare/cleanmymac',
        'compare/daisydisk',
        'compare/onyx',
        'compare/appcleaner',
        'compare/ccleaner-mac',
        'compare/pearcleaner',
        'compare/sensei',
        'compare/mackeeper',
        'compare/grandperspective',
        'compare/maccleaner-pro',
        'compare/buhocleaner',
        'compare/mac-cleanup-py',
      ],
    },
    {
      type: 'category',
      label: 'When something goes wrong',
      collapsed: false,
      link: {
        type: 'generated-index',
        title: 'When something goes wrong',
        description:
          'Symptom-to-fix troubleshooting, and how to restore developer tooling removed by the v4.3.0 section 23 bug.',
        slug: '/help',
      },
      items: ['troubleshooting', 'recovery'],
    },
    'faq',
    'changelog',
    {
      type: 'category',
      label: 'About',
      collapsed: true,
      items: ['about-the-author'],
    },
  ],
};

export default sidebars;
