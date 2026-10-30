/** github-slugger 1.x ships no types; this is the one class the site uses. */
declare module 'github-slugger' {
  export default class GithubSlugger {
    slug(value: string, maintainCase?: boolean): string;
    reset(): void;
  }
}
