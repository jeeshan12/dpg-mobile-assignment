import fs from 'fs';
import path from 'path';
import { browser } from '@wdio/globals';
import type { Options } from '@wdio/types';

const ROOT_DIR = path.resolve(__dirname, '..');
const REPORTS_DIR = path.join(ROOT_DIR, 'reports');
const SCREENSHOTS_DIR = path.join(REPORTS_DIR, 'screenshots');

export const sharedConfig: Omit<Options.Testrunner, 'capabilities'> = {
  runner: 'local',
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 90_000,
  },

  logLevel: 'warn',
  bail: 0,
  waitforTimeout: 15_000,
  connectionRetryTimeout: 120_000,
  connectionRetryCount: 2,

  maxInstances: 1,

  specs: [path.join(ROOT_DIR, 'src', 'specs', '**', '*.spec.ts')],

  reporters: [
    'spec',
    [
      'junit',
      {
        outputDir: path.join(REPORTS_DIR, 'junit'),
        outputFileFormat: (opts: { cid: string }) => `results-${opts.cid}.xml`,
      },
    ],
    [
      'allure',
      {
        outputDir: path.join(REPORTS_DIR, 'allure-results'),
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],

  // Every test starts from a brand-new app session. reloadSession() re-launches
  // the app under the *same* capabilities used to start the session -- so the
  // launch arguments / intent extras that put the app in a known state
  // are re-applied before every single test.
  beforeTest: async function () {
    await browser.reloadSession();
  },

  afterTest: async function (test, _context, result) {
    if (!result.passed) {
      fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
      const safeName = `${test.parent}-${test.title}`.replace(/[^a-z0-9-_]+/gi, '_');
      await browser.saveScreenshot(path.join(SCREENSHOTS_DIR, `${safeName}.png`));
    }
  },
};
