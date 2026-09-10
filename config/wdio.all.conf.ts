import path from 'path';
import { sharedConfig } from './wdio.shared.conf';

const ROOT_DIR = path.resolve(__dirname, '..');
const specPath = (name: string): string => path.join(ROOT_DIR, 'src', 'specs', name);

const ANDROID_APK_PATH = path.join(ROOT_DIR, 'apps', 'android', 'VideoQAChallenge-debug.apk');
const IOS_APP_PATH = path.join(ROOT_DIR, 'apps', 'ios', 'VideoQAChallenge.app');

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  // Run Android and iOS sequentially in isolation to prevent device/CPU resource contention
  maxInstances: 1,
  services: [['appium', { command: 'appium' }]],

  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'Android Emulator',
      'appium:app': ANDROID_APK_PATH,
      'appium:appPackage': 'com.videoqa.challenge',
      'appium:appActivity': '.MainActivity',
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 120,
      'appium:adbExecTimeout': 60000,
      'appium:optionalIntentArguments': '--ez resetAllState true --ei contentDelayMs 800 --ei videoBufferingMs 800',
      'wdio:specs': [specPath('consent.spec.ts')],
    } as WebdriverIO.Capabilities,

    {
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:deviceName': process.env.IOS_SIMULATOR_NAME ?? 'iPhone 16',
      'appium:platformVersion': process.env.IOS_PLATFORM_VERSION ?? '18.6',
      'appium:app': IOS_APP_PATH,
      'appium:newCommandTimeout': 120,
      'appium:wdaLaunchTimeout': 120000,
      'appium:wdaConnectionTimeout': 120000,
      'appium:processArguments': {
        args: ['-resetAllState'],
        env: { CONTENT_DELAY_MS: '800', VIDEO_BUFFERING_MS: '800' },
      },
      'wdio:specs': [specPath('consent.spec.ts')],
    } as WebdriverIO.Capabilities,
  ],
};

