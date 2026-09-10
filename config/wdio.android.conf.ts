import path from 'path';
import { sharedConfig } from './wdio.shared.conf';

const ROOT_DIR = path.resolve(__dirname, '..');

const FAST_TIMING = {
  contentDelayMs: 800,
  videoBufferingMs: 800,
};

const APK_PATH = path.join(ROOT_DIR, 'apps', 'android', 'VideoQAChallenge-debug.apk');
const APP_PACKAGE = 'com.videoqa.challenge';
const APP_ACTIVITY = '.MainActivity';

function androidCapability(specs?: string[], intentExtra: string = ''): WebdriverIO.Capabilities {
  const cap: WebdriverIO.Capabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Android Emulator',
    'appium:app': APK_PATH,
    'appium:appPackage': APP_PACKAGE,
    'appium:appActivity': APP_ACTIVITY,
    'appium:autoGrantPermissions': true,
    'appium:newCommandTimeout': 120,
    'appium:adbExecTimeout': 60000,
    'appium:optionalIntentArguments': `--ez resetAllState true --ei contentDelayMs ${FAST_TIMING.contentDelayMs} --ei videoBufferingMs ${FAST_TIMING.videoBufferingMs}${intentExtra}`,
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

  capabilities: [androidCapability()],
};
