/**
 * Every place macleanup is released — the ONLY place a store or surface URL lives in this docs site
 * (standard aoneahsan-cccs-platform-links). Each surface passed its release proof on `verified`:
 * the universal dmg from the latest GitHub release (v5.3.9) downloads, `npm view macleanup` answers,
 * the website and this site answered 200.
 */
export type PlatformId = 'desktop' | 'npm' | 'web' | 'docs';

export interface Platform {
  id: PlatformId;
  /** Store or surface name (a proper name, not copy). */
  name: string;
  href: string;
  /** What this surface is for, in macleanup's words. */
  title: string;
  text: string;
  cta: string;
  primary?: boolean;
  verified: string;
}

export const PLATFORMS: readonly Platform[] = [
  {id: 'desktop', name: 'Mac desktop app', href: 'https://github.com/aoneahsan/macleanup/releases/latest/download/macleanup.dmg', title: 'For your Mac', text: 'The desktop app: preview what each section would free, run it, and keep a receipt. A universal build that updates itself.', cta: 'Download for Mac', primary: true, verified: '2026-11-20'},
  {id: 'npm', name: 'npm', href: 'https://www.npmjs.com/package/macleanup', title: 'npx macleanup', text: 'The command-line engine the app runs, for Terminal and scripts.', cta: 'View on npm', verified: '2026-11-20'},
  {id: 'web', name: 'macleanup website', href: 'https://macleanup.aoneahsan.com', title: 'The website', text: 'What it cleans, what it never touches, and the plans.', cta: 'Open the website', verified: '2026-11-20'},
  {id: 'docs', name: 'Documentation', href: 'https://macleanup-docs.aoneahsan.com', title: 'These docs', text: 'What gets deleted, the dry run, and the full CLI reference.', cta: 'Read the docs', verified: '2026-11-20'},
];

export const APPS_PAGE = {
  title: 'Get macleanup',
  description:
    'Every place macleanup is released: the Mac desktop app, the npm CLI, the website and these docs.',
  lead: 'The desktop app for your Mac, the same engine as a CLI on npm, and these docs a tab away.',
} as const;

/** This site is the docs surface. */
export const CURRENT_SURFACE: PlatformId = 'docs';
export const OTHER_PLATFORMS: readonly Platform[] = PLATFORMS.filter(
  (platform) => platform.id !== CURRENT_SURFACE
);
export const PRIMARY_PLATFORM: Platform =
  PLATFORMS.find((platform) => platform.primary) ?? PLATFORMS[0];
export function platformHref(id: PlatformId): string {
  const found = PLATFORMS.find((platform) => platform.id === id);
  if (!found) throw new Error(`Unknown platform: ${id}`);
  return found.href;
}
/** `/apps` changes only when this list does: its sitemap date is the newest proof date. */
export const APPS_LASTMOD: string =
  PLATFORMS.map((platform) => platform.verified)
    .sort()
    .at(-1) ?? '2026-11-20';
