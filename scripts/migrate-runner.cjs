// Patch @next/env before Payload's loadEnv.js requires it.
// tsx transpiles ESM `import x from '@next/env'` → `require('@next/env').default`
// but @next/env has no .default export (CJS module). Patch it in place.
const nextEnv = require('@next/env');
if (!nextEnv.default) {
  Object.defineProperty(nextEnv, 'default', {
    value: nextEnv,
    configurable: true,
    writable: true,
  });
}

require('tsx/cjs');
require('./migrate-snapshot-to-payload.ts');
