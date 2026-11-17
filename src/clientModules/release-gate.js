/**
 * Update flow, layer 2 for the docs: reads the admin-published release record for this
 * site (platform + channel) on start, when a release is published (the `app-releases`
 * Realtime broadcast, and every rejoin of it), when the browser comes back online, and when
 * the tab comes back (at most once a minute). Never on a timer (rules/realtime-not-polling.md). An urgent newer release blocks now; a normal one is announced
 * now and blocks from the next start. A failed read blocks nothing, except a normal
 * release this browser was already told about. Update reloads the page: every page is
 * served `no-cache`, so a reload is the new build.
 */
import { RealtimeClient } from '@supabase/realtime-js';
import { translate } from '@docusaurus/Translate';

export const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

/** -1, 0 or 1. Callers validate with SEMVER first. */
export function compareSemver(a, b) {
  const x = a.split('.').map(Number);
  const y = b.split('.').map(Number);
  for (let i = 0; i < 3; i += 1) if (x[i] !== y[i]) return x[i] < y[i] ? -1 : 1;
  return 0;
}

/** The contract's table: 'none' | 'notice' | 'block'. */
export function decide({ running, record, stored, newStart }) {
  const owed = Boolean(stored && SEMVER.test(stored.version) && compareSemver(running, stored.version) < 0);
  if (!record || !SEMVER.test(record.version)) return owed && newStart ? 'block' : 'none';
  if (compareSemver(running, record.version) >= 0) return 'none';
  if (record.severity === 'urgent') return 'block';
  return owed && newStart ? 'block' : 'notice';
}

const RETURN_MS = 60 * 1000;
const RELEASE_TOPIC = 'app-releases';

/**
 * Start the gate. `config` comes from the build's `macleanup-release` meta tag; without it
 * (the prototype opened from disk) the gate does nothing.
 * @param {{ config: {platform:string, channel:string, version:string, api:string, key:string} | null,
 *   read: (key:string) => any, write: (key:string, value:any) => void }} options
 */
export function startReleaseGate({ config, read, write }) {
  if (!config || !SEMVER.test(config.version) || !config.api || !config.key) return;
  // Production keeps its original key; another channel (a test build on the same origin) never shares it.
  const noticeKey = config.channel === 'production' ? `release-notice-${config.platform}` : `release-notice-${config.platform}-${config.channel}`;
  let lastRun = 0;
  let blocked = false;
  let firstCheck = true;

  const fetchRecord = async () => {
    const url = `${config.api}/rest/v1/latest_app_releases?platform=eq.${encodeURIComponent(config.platform)}`
      + `&channel=eq.${encodeURIComponent(config.channel)}&select=version,severity,reason&limit=1`;
    const res = await fetch(url, { headers: { apikey: config.key, Accept: 'application/json' }, cache: 'no-store' });
    if (!res.ok) throw new Error(`release read ${res.status}`);
    const rows = await res.json();
    return Array.isArray(rows) && rows[0] ? rows[0] : null;
  };

  const check = async () => {
    if (blocked) return;
    lastRun = Date.now();
    let record = null;
    try { record = await fetchRecord(); } catch (_) { record = null; }
    const stored = read(noticeKey);
    const result = decide({ running: config.version, record, stored, newStart: firstCheck });
    firstCheck = false;
    if (result === 'none') {
      if (record && compareSemver(config.version, record.version) >= 0) write(noticeKey, null);
      return;
    }
    if (result === 'block') {
      const src = record && SEMVER.test(record.version) && compareSemver(config.version, record.version) < 0 ? record : stored;
      blocked = true;
      showBlock({ version: src.version, reason: src.reason, running: config.version, since: record?.severity !== 'urgent' });
      return;
    }
    if (!stored || stored.version !== record.version) write(noticeKey, { version: record.version, reason: record.reason });
    showNotice({ version: record.version });
  };

  const run = () => { void check(); };
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 2000 });
  else window.setTimeout(run, 0);
  watchReleases(config, run);
  window.addEventListener('online', run);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && Date.now() - lastRun >= RETURN_MS) run();
  });
}

/**
 * Publishing a release broadcasts `{ platform, channel }` on the public topic `app-releases`
 * (migration 20261117163024 in macleanup-desktop). The event only says "re-read"; each
 * SUBSCRIBED (first join and every rejoin) re-reads too, because a broadcast sent while the
 * socket was down is gone. The client's heartbeat keeps the open socket alive; it asks nothing.
 */
function watchReleases(config, onSignal) {
  let client;
  try {
    client = new RealtimeClient(`${config.api.replace(/^http/, 'ws')}/realtime/v1`, { params: { apikey: config.key } });
  } catch (_) {
    return;
  }
  client
    .channel(RELEASE_TOPIC, { config: { private: false } })
    .on('broadcast', { event: 'release' }, ({ payload }) => {
      if (payload && payload.platform === config.platform && payload.channel === config.channel) onSignal();
    })
    .subscribe((status) => { if (status === 'SUBSCRIBED') onSignal(); });
}

const reload = () => window.location.reload();

function el(tag, props = {}, children = []) {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
}

function showBlock({ version, reason, running, since }) {
  if (document.getElementById('release-block')) return;
  const title = el('h2', { id: 'release-block-title', textContent: translate({ id: 'releaseGate.block.title', message: 'These docs need their newer version' }) });
  const lines = [title];
  if (since) lines.push(el('p', { textContent: translate({ id: 'releaseGate.block.since', message: 'This version of the site is required since your last visit.' }) }));
  if (reason) lines.push(el('p', { className: 'release-block-reason', textContent: reason }));
  lines.push(el('p', { className: 'release-block-version', textContent: translate({ id: 'releaseGate.block.versions', message: 'You have {running} · required {version}' }, { running, version }) }));
  const button = el('button', { type: 'button', className: 'release-block-update', textContent: translate({ id: 'releaseGate.update', message: 'Update now' }) });
  button.addEventListener('click', reload);
  lines.push(button, el('p', { className: 'release-block-note', textContent: translate({ id: 'releaseGate.block.note', message: 'The page reloads with the new version. Nothing you chose here is lost.' }) }));
  const card = el('div', { className: 'release-block-card' }, lines);
  const block = el('div', { id: 'release-block', className: 'release-block' }, [card]);
  block.setAttribute('role', 'alertdialog');
  block.setAttribute('aria-modal', 'true');
  block.setAttribute('aria-labelledby', 'release-block-title');
  block.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') event.preventDefault();
    if (event.key === 'Tab') { event.preventDefault(); button.focus(); }
  });
  for (const child of document.body.children) child.inert = true;
  document.body.append(block);
  button.focus();
}

function showNotice({ version }) {
  if (document.getElementById('release-notice')) return;
  const text = el('p', { textContent: translate({ id: 'releaseGate.notice', message: 'A new version of these docs ({version}) is out. It will be required from your next visit.' }, { version }) });
  const update = el('button', { type: 'button', className: 'release-notice-update', textContent: translate({ id: 'releaseGate.update', message: 'Update now' }) });
  const later = el('button', { type: 'button', className: 'release-notice-later', textContent: translate({ id: 'releaseGate.later', message: 'Later' }) });
  const notice = el('div', { id: 'release-notice', className: 'release-notice' }, [text, update, later]);
  notice.setAttribute('role', 'status');
  update.addEventListener('click', reload);
  later.addEventListener('click', () => notice.remove());
  document.body.append(notice);
}
