import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { Plugin } from '@docusaurus/types';

/**
 * FAQPage JSON-LD for the FAQ page, read off the page as it was BUILT (macleanup-docs#1, SA-P30, owner 2026-11-27; shared with clearhire-docs).
 *
 * 🔴 WHY FROM THE BUILT HTML AND NOT A SECOND COPY. Google only allows FAQ markup over questions and answers the
 *    reader can see, word for word. A hand-typed list beside `docs/faq.md` would drift the first time an answer is
 *    edited; reading each `<h3>` question and the blocks under it from the emitted page makes the markup the page.
 *
 * 🔴 IN THE INITIAL HTML. Written into the static file at postBuild, so a crawler that runs no script reads it.
 */

/** The pages that ARE a list of questions; each must yield at least one, or the build fails. */
const FAQ_PAGES = ['faq/index.html'] as const;

const ENTITIES: Readonly<Record<string, string>> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

/** Visible text: tags out, the heading's hidden anchor glyph out, entities decoded, whitespace folded. */
function textOf(html: string): string {
  return html
    .replace(/<a[^>]*class=hash-link[^>]*>[\s\S]*?<\/a>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (whole, code: string) => {
      if (code.startsWith('#x') || code.startsWith('#X')) return String.fromCodePoint(Number.parseInt(code.slice(2), 16));
      if (code.startsWith('#')) return String.fromCodePoint(Number.parseInt(code.slice(1), 10));
      return ENTITIES[code.toLowerCase()] ?? whole;
    })
    .replace(/\u200b/g, '')
    .replace(/\s+/g, ' ')
    .replace(/ ([.,;:!?])/g, '$1')
    .trim();
}

/**
 * Every `<h3>` in the page's markdown body is a question; its answer is everything up to the next `<h2>` or `<h3>`.
 *
 * @param html - the built page
 * @returns the question and answer pairs, in page order
 */
export function faqPairs(html: string): { name: string; text: string }[] {
  const start = html.indexOf('theme-doc-markdown');
  const end = html.indexOf('<footer', start);
  if (start === -1 || end === -1) return [];
  const body = html.slice(start, end);
  const parts = body.split(/(?=<h[23][\s>])/);
  return parts
    .filter((part) => /^<h3[\s>]/.test(part))
    .map((part) => {
      const close = part.indexOf('</h3>');
      return { name: textOf(part.slice(0, close)), text: textOf(part.slice(close + 5)) };
    })
    .filter((pair) => pair.name !== '' && pair.text !== '');
}

export default function faqSchema(): Plugin {
  return {
    name: 'faq-schema',
    async postBuild({ outDir }) {
      for (const page of FAQ_PAGES) {
        const file = join(outDir, page);
        const html = await readFile(file, 'utf8');
        const pairs = faqPairs(html);
        if (pairs.length === 0) throw new Error(`faq-schema: ${page} shows no question under an <h3>`);
        const graph = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: pairs.map((pair) => ({
            '@type': 'Question',
            name: pair.name,
            acceptedAnswer: { '@type': 'Answer', text: pair.text },
          })),
        };
        const script = `<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}</script>`;
        await writeFile(file, html.replace('</head>', `${script}</head>`), 'utf8');
      }
    },
  };
}
