import fs from 'fs';
import path from 'path';
import { browser } from '@wdio/globals';
import type { Options } from '@wdio/types';
import allureReporter from '@wdio/allure-reporter';

const ROOT_DIR = path.resolve(__dirname, '..');
const REPORTS_DIR = path.join(ROOT_DIR, 'reports');
const SCREENSHOTS_DIR = path.join(REPORTS_DIR, 'screenshots');
const ALLURE_RESULTS_DIR = path.join(REPORTS_DIR, 'allure-results');

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
  connectionRetryTimeout: 300_000,
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
        outputDir: ALLURE_RESULTS_DIR,
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],

  onPrepare: function () {
    if (fs.existsSync(REPORTS_DIR)) {
      fs.rmSync(REPORTS_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(ALLURE_RESULTS_DIR, { recursive: true });
  },


  beforeTest: async function () {
    await browser.reloadSession();

    const caps = browser.capabilities as Record<string, any>;
    const platform = (caps.platformName ?? (browser.isAndroid ? 'Android' : 'iOS')) as string;
    const deviceName = (caps['appium:deviceName'] ?? (browser.isAndroid ? 'Android Emulator' : 'iOS Simulator')) as string;
    const osVersion = (caps['appium:platformVersion'] ?? caps.platformVersion ?? '') as string;

    allureReporter.addTag(platform);
    if (deviceName) {
      allureReporter.addTag(deviceName);
    }
    allureReporter.addArgument('Platform', platform);
    allureReporter.addArgument('Device', osVersion ? `${deviceName} (${osVersion})` : deviceName);
  },

  afterTest: async function (test, _context, result) {
    if (!result.passed) {
      fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
      const safeName = `${test.parent}-${test.title}`.replace(/[^a-z0-9-_]+/gi, '_');
      await browser.saveScreenshot(path.join(SCREENSHOTS_DIR, `${safeName}.png`));
    }
  },
};
