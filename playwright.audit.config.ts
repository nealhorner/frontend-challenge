import type { PlaywrightTestConfig } from '@playwright/test';
import config from './playwright.config';

// Contrast audit (`npm run audit:contrast`). Reuses the e2e web server, env and
// browser settings, but runs only tests/audit/*.audit.ts, which the regular
// suite never matches.
const auditConfig: PlaywrightTestConfig = {
  ...config,
  testDir: 'tests/audit',
  testMatch: /\.audit\.ts$/
};

export default auditConfig;
