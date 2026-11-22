/**
 * The blog's own words, in one place: the blog plugin's title and description (docusaurus.config.ts) read them from
 * here, and /sitemap's Blog card reads them back from the blog plugin. Posts live in blog/; until the first one is
 * published the blog stays off, so there is no Blog link and no blog page.
 */

/** The blog's route, with its leading slash: the blog plugin's `routeBasePath`. */
export const BLOG_PATH = '/blog';

export const BLOG_TITLE = 'macleanup posts';

export const BLOG_DESCRIPTION = 'One part of macleanup per post, from the dry run to the section you confirm.';
