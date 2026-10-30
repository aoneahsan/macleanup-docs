/**
 * Update flow, layer 2 for the docs site: starts the shared release gate once in the
 * browser. The release record is read with the project's publishable key (public by
 * design); notices are stored through strata-storage.
 */
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import siteConfig from '@generated/docusaurus.config';

// Loaded only in the browser, so the server-side build never evaluates storage code.
async function start(): Promise<void> {
  const [{ defineStorage }, { startReleaseGate }] = await Promise.all([
    import('strata-storage'),
    import('./release-gate.js'),
  ]);
  const store = defineStorage({
    namespace: 'macleanup-docs',
    keyPrefix: false,
    adapters: { localStorage: {} },
    defaultStorages: ['localStorage'],
  });
  startReleaseGate({
    config: (siteConfig.customFields?.release ?? null) as never,
    read: (key: string) => {
      try { return store.getSync(key, { storage: 'localStorage' }) ?? null; } catch { return null; }
    },
    write: (key: string, value: unknown) => {
      try {
        if (value === null) store.removeSync(key, { storage: 'localStorage' });
        else store.setSync(key, value, { storage: 'localStorage' });
      } catch { /* storage blocked: the gate still fails open */ }
    },
  });
}

if (ExecutionEnvironment.canUseDOM) void start();
