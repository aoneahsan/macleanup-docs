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
      items: ['getting-started/installation', 'getting-started/first-run'],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      link: {
        type: 'generated-index',
        title: 'Reference',
        description:
          'Every flag, every section, every profile, the config file, and where logs and reports are written.',
        slug: '/reference',
      },
      items: [
        'reference/cli',
        'reference/sections',
        'reference/profiles',
        'reference/configuration',
        'reference/reports-and-logs',
      ],
    },
    'recipes',
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
