---
name: generate-mobile-tests
description: Step-by-step skill to generate WebdriverIO Page Objects and test specifications for the Video QA Challenge mobile application (Android & iOS).
---

# Mobile Test & Screen Generator Skill

This skill provides a systematic, step-by-step workflow for generating Page Objects and WebdriverIO/TypeScript test specifications for the **Video QA Challenge** mobile application on Android and iOS.

---

## 🏛 Core Architectural Rules

### 1. Auto-Retrying Matchers (Mandatory)

Always use WebdriverIO's native assertion system (`await expect(...)`) with automatic retry polling instead of static Chai assertions:

```ts
// ✅ Correct: Polls and auto-retries DOM/view hierarchy changes
await expect(contentOverviewScreen.title).toBeDisplayed();
await expect(contentOverviewScreen.title).toHaveText('Videos');
await expect(videoPlayerScreen.stateLabel).toHaveText('Playing');

// ❌ Incorrect: Shallow/Static evaluation without polling (prone to race conditions)
expect(await contentOverviewScreen.title.isDisplayed()).to.be.true;
expect(await contentOverviewScreen.title.getText()).to.equal('Videos');
```

### 2. Deep State Assertions (No Shallow Checks)

Never stop at mere element visibility (`toBeDisplayed()`). Always assert functional state:

- **Toggles/Switches**: Assert actual checked/boolean state (e.g. `await preferencesScreen.isAnalyticsEnabled()`).
- **Video Playback**: Assert dynamic state labels (`Buffering` ➔ `Playing` ➔ `Completed`), formatted elapsed times, and progress bar advancement.
- **Error States**: Assert error banner message text AND verify successful recovery after clicking retry buttons.

### 3. Session Isolation & Test Setup Scoping

In `wdio.shared.conf.ts`, `beforeTest` runs `browser.reloadSession()` to guarantee complete hermetic test isolation.

- **Rule**: All test navigation, consent acceptance, and prerequisite setup **MUST** execute explicitly inside each `it()` block, **NOT** inside Mocha `beforeEach()` hooks.

### 4. Fast Timing & Launch Intent Flags

App launch intent flags and environment variables accelerate video buffering and content delays:

- **Android**: `--ez resetAllState true --ei contentDelayMs 800 --ei videoBufferingMs 800`
- **iOS Process Env**: `CONTENT_DELAY_MS: '800'`, `VIDEO_BUFFERING_MS: '800'`, args: `['-resetAllState']`

### 5. Appium Inspector Verification (Live Hierarchy vs. Static Source)

Never assume source-code IDs on GitHub match runtime view trees. Always verify locators on live Android Emulators and iOS Simulators via **Appium Inspector**:

- **SwiftUI (iOS)**: Accessibility labels (`@label`) and traits often wrap child elements; use predicate strings or label matching when `accessibilityIdentifier` is obscured.
- **Compose (Android)**: Resource IDs or `content-desc` accessibility IDs.

---

## 🛠 Step 1: Generating Page Objects (Screen Classes)

All screen objects must extend `BaseScreen` and follow this structure:

```ts
import { BaseScreen } from './BaseScreen';

export class ScreenName extends BaseScreen {
  // 1. Locators / Getters
  get container() {
    return this.byId('screen_identifier');
  }

  get actionButton() {
    return this.byId('action_button_identifier');
  }

  // 2. State & Visibility Helpers
  async isDisplayed(): Promise<boolean> {
    return this.container.isDisplayed();
  }

  async waitForScreen(timeout = 15_000): Promise<void> {
    await this.waitForDisplayed(this.container, timeout);
  }

  // 3. User Actions & Deep State Interactions
  async performAction(): Promise<void> {
    await this.waitForDisplayed(this.actionButton);
    await this.actionButton.click();
  }
}

// Export singleton instance
export const screenName = new ScreenName();
```

---

## 📱 Canonical Locator Registry (Android & iOS)

Use the verified identifiers below when referencing or creating screen objects:

### 1. Consent Screen (`ConsentScreen.ts`)

- **Screen Container**: `consent_screen`
- **Title**: `this.byText('Your privacy choices')`
- **Accept All Button**: `consent_accept_button`
- **Reject Optional Button**: `consent_reject_button`
- **Manage Preferences Button**: `consent_manage_preferences_button`

### 2. Preferences Screen (`PreferencesScreen.ts`)

- **Screen Container**: `preferences_screen`
- **Analytics Toggle**: `analytics_toggle` (tapped via relative bounding box coordinates in `BaseScreen.ts` to avoid non-clickable row whitespace, following [Appium Pro #22](https://appium.pro/editions/22-making-your-appium-tests-fast-and-reliable-part-4-dealing-with-unfindable-elements))
- **Personalisation Toggle**: `personalisation_toggle`
- **Save Preferences Button**: `preferences_save_button`
- **Back Button**: `Back` (Accessibility ID)

### 3. Content Overview Screen (`ContentOverviewScreen.ts`)

- **Screen Container**: `content_overview_screen`
- **Refresh Button**: `content_refresh_button`
- **Debug Options Button**: `debug_options_button`
- **Loading Indicator**: `content_loading_indicator`
- **Video Items (Card Containers)**:
  - `content_item_amsterdam` (_Amsterdam from above_)
  - `content_item_newsroom` (_Inside the newsroom_)
  - `content_item_morning` (_Morning news update_)
  - `content_item_technology` (_Technology trends_)
  - `content_item_culture` (_City culture_)
  - `content_item_weekend` (_Weekend preview_)
- **Video Titles**: `content_title_<id>` (e.g. `content_title_amsterdam`)
- **Empty State Container**: `content_empty_state` ("No videos are available")
- **Empty Retry Button**: `content_empty_retry_button`
- **Error State Container**: `content_error_state`
- **Error State Message**: `content_error_message` ("We could not load the videos")
- **Error Retry Button**: `content_error_retry_button`

### 4. Content Detail Screen (`ContentDetailScreen.ts`)

- **Detail Screen Container**: `content_detail_screen`
- **Title**: `detail_title`
- **Category**: `detail_category`
- **Published Date**: `this.byText('Published')`
- **Description**: `detail_description`
- **Play Video Button**: `video_play_button`
- **Back Button**: `detail_back_button`

### 5. Video Player Screen (`VideoPlayerScreen.ts`)

- **Player Container**: `video_player`
- **State Label**: `video_state_label` (States: `Buffering`, `Playing`, `Paused`, `Error`, `Completed`)
- **Play Button**: `video_play_button`
- **Pause Button**: `video_pause_button`
- **Current Position**: `video_current_position`
- **Total Duration**: `video_duration`
- **Progress Slider**: `video_progress`
- **Buffering Indicator**: `video_buffering_indicator`
- **Error State Message**: `video_error_message` ("Video could not be played")
- **Retry Button**: `video_retry_button`

### 6. Debug Options Screen (`DebugOptionsScreen.ts`)

- **Title**: `this.byText('Debug options')`
- **Done Button**: `debug_done_button`
- **Content Modes**:
  - Success: `debug_content_success`
  - Empty: `debug_content_empty`
  - Error: `debug_content_error`
  - Slow: `debug_content_slow`
- **Video Modes**:
  - Normal: `debug_video_normal`
  - Buffering: `debug_video_buffering`
  - Error: `debug_video_error`
  - Complete Quickly: `debug_video_complete_quickly`
- **State Controls**:
  - Reset Consent: `debug_reset_consent`
  - Clear Progress: `debug_clear_progress`
  - Restore Defaults: `debug_restore_defaults`
  - Reset All: `debug_reset_all`

---

## 🧪 Standard Test Spec Pattern

```ts
import { consentScreen, contentOverviewScreen, videoPlayerScreen } from '../screens';

describe('Feature Area - E2E Suite', () => {
  it('should navigate and assert deep state with auto-retrying expectations', async () => {
    // 1. Arrange & Navigate
    await consentScreen.waitForScreen();
    await consentScreen.acceptAll();

    // 2. Act
    await contentOverviewScreen.waitForScreen();
    await contentOverviewScreen.selectVideo('amsterdam');

    // 3. Assert (Auto-retrying)
    await expect(videoPlayerScreen.stateLabel).toHaveText('Playing');
  });
});
```

---

## 📋 Screen & Spec Generation Checklist

1. **Cross-Platform Compatibility**: Use `this.byId()` (`resource-id` on Android, `accessibility id` on iOS) and `this.byText()`.
2. **Platform Handling in BaseScreen**: Never add `if (browser.isIOS)` in individual screen classes; delegate platform abstraction (text extraction `@label` vs `@value`, pointer tap offsets for switches) to `BaseScreen.ts`.
3. **Deterministic Synchronization**: Never use hardcoded sleeps (`browser.pause()`); rely strictly on `waitForDisplayed()`, `browser.waitUntil()`, or native `await expect()`.
4. **Central Export**: Register every new screen in `src/screens/index.ts`.
5. **Static Verification**: Run `npx tsc --noEmit && npm run lint && npm run format:check` before committing.
