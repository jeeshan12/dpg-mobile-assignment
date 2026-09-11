import path from 'path';
import { sharedConfig } from './wdio.shared.conf';

const ROOT_DIR = path.resolve(__dirname, '..');

const FAST_TIMING = {
  contentDelayMs: 800,
  videoBufferingMs: 800,
};

const ANDROID_APK = path.join(ROOT_DIR, 'apps', 'android', 'VideoQAChallenge-debug.apk');
const IOS_APP = path.join(ROOT_DIR, 'apps', 'ios', 'VideoQAChallenge.app');

const androidCapability: WebdriverIO.Capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:app': ANDROID_APK,
  'appium:appPackage': 'com.videoqa.challenge',
  'appium:appActivity': '.MainActivity',
  'appium:autoGrantPermissions': true,
  'appium:newCommandTimeout': 120,
  'appium:adbExecTimeout': 60000,
  // Device Farm dynamic scheduling options
  'appium:deviceAvailabilityTimeoutMs': 120000,
  'appium:optionalIntentArguments': `--ez resetAllState true --ei contentDelayMs ${FAST_TIMING.contentDelayMs} --ei videoBufferingMs ${FAST_TIMING.videoBufferingMs}`,
} as WebdriverIO.Capabilities;

const iosCapability: WebdriverIO.Capabilities = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:app': IOS_APP,
  'appium:newCommandTimeout': 120,
  'appium:wdaLaunchTimeout': 120000,
  'appium:wdaConnectionTimeout': 120000,
  'appium:waitForQuiescence': false,
  // Device Farm dynamic scheduling options
  'appium:deviceAvailabilityTimeoutMs': 120000,
  'appium:processArguments': {
    args: ['-resetAllState'],
    env: {
      CONTENT_DELAY_MS: String(FAST_TIMING.contentDelayMs),
      VIDEO_BUFFERING_MS: String(FAST_TIMING.videoBufferingMs),
    },
  },
} as WebdriverIO.Capabilities;

// Select capabilities based on PLATFORM env var (android, ios, or both)
const selectedPlatform = (process.env.PLATFORM ?? 'both').toLowerCase();
const capabilities: WebdriverIO.Capabilities[] = [];

if (selectedPlatform === 'android' || selectedPlatform === 'both') {
  capabilities.push(androidCapability);
}
if (selectedPlatform === 'ios' || selectedPlatform === 'both') {
  capabilities.push(iosCapability);
}

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  hostname: process.env.GRID_HOST || '127.0.0.1',
  port: parseInt(process.env.GRID_PORT || '4723', 10),
  path: process.env.GRID_PATH || '/',

  maxInstances: capabilities.length,

  // When connecting to an external running farm server, omit local Appium service.
  // If APPIUM_STANDALONE is true, launch Appium with the device-farm config.
  services:
    process.env.APPIUM_STANDALONE === 'true'
      ? [
          [
            'appium',
            {
              command: 'appium',
              args: {
                config: path.join(__dirname, 'appium-device-farm.json'),
              },
            },
          ],
        ]
      : [],

  capabilities,
};
