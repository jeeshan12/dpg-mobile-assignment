import path from 'path';
import { sharedConfig } from './wdio.shared.conf';

const ROOT_DIR = path.resolve(__dirname, '..');

const FAST_TIMING = {
  CONTENT_DELAY_MS: '800',
  VIDEO_BUFFERING_MS: '800',
};

const APP_PATH = path.join(ROOT_DIR, 'apps', 'ios', 'VideoQAChallenge.app');
const DEVICE_NAME = process.env.IOS_SIMULATOR_NAME ?? 'iPhone 16';
const PLATFORM_VERSION = process.env.IOS_PLATFORM_VERSION ?? '18.6';

function iosCapability(
  specs?: string[],
  extraArgs: string[] = [],
): WebdriverIO.Capabilities {
  const cap: WebdriverIO.Capabilities = {
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': DEVICE_NAME,
    'appium:platformVersion': PLATFORM_VERSION,
    'appium:app': APP_PATH,
    'appium:newCommandTimeout': 120,
    'appium:wdaLaunchTimeout': 120000,
    'appium:wdaConnectionTimeout': 120000,
    'appium:waitForQuiescence': false,
    // Reset all state on every launch/relaunch
    'appium:processArguments': {
      args: ['-resetAllState', ...extraArgs],
      env: FAST_TIMING,
    },
  };

  if (specs && specs.length > 0) {
    cap['wdio:specs'] = specs;
  }

  return cap;
}

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  port: 4723,
  services: [['appium', { command: 'appium' }]],

  capabilities: [
    iosCapability(),
  ],
};

