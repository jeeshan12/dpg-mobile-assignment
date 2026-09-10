---
name: generate-mobile-tests
description: Step-by-step skill to generate WebdriverIO Page Objects and test specifications for the Video QA Challenge mobile application (Android & iOS).
---

# Mobile Test & Screen Generator Skill

This skill provides a systematic, step-by-step workflow for generating Page Objects and WebdriverIO/TypeScript test specifications for the **Video QA Challenge** mobile application on Android and iOS.

---

## Step 1: Generating Page Objects (Screen Classes)

### Standard Screen Template Reference (`ConsentScreen.ts`)

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

  // 3. User Actions & Interactions
  async performAction(): Promise<void> {
    await this.waitForDisplayed(this.actionButton);
    await this.actionButton.click();
  }
}

// Export both class and singleton instance
export const screenName = new ScreenName();
```

---

## Canonical Locator Registry (Android & iOS)

Use the verified identifiers below when referencing or creating screen objects:

### 1. Consent Screen (`ConsentScreen.ts`)

- **Screen Container**: `consent_screen`
- **Title**: `this.byText('Your privacy choices')`
- **Accept All Button**: `consent_accept_button`
- **Reject Optional Button**: `consent_reject_button`
- **Manage Preferences Button**: `consent_manage_preferences_button`

### 2. Preferences Screen (`PreferencesScreen.ts`)

- **Screen Container**: `preferences_screen`
- **Analytics Toggle**: `analytics_toggle`
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
- **State Label**: `video_state_label` (Observable states: `Buffering`, `Playing`, `Paused`, `Error`, `Completed`)
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

## Test Suites & Specs

| Spec File                     | Area Covered          | Scenarios                                                                                                                  |
| :---------------------------- | :-------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| **`consent.spec.ts`**         | Consent & Preferences | Initial UI, Accept all, Reject optional, Manage & save preferences.                                                        |
| **`contentOverview.spec.ts`** | Feed & Content States | Feed item rendering & refresh, Content error state & retry, Content empty state & retry.                                   |
| **`videoPlayback.spec.ts`**   | Video Player & Detail | Detail metadata verification, Play/Pause/Resume states, Back navigation, Video error state & retry, Video buffering state. |

---

## Screen Generation Checklist

When generating or modifying any screen:

1. **Cross-Platform Compatibility**: Use `this.byId()` (`resource-id` on Android, `accessibility id` on iOS) and `this.byText()`.
2. **Platform Handling in BaseScreen**: Never add `if (browser.isIOS)` in individual screen classes; delegate platform abstraction (text extraction `@label` vs `@value`, pointer tap offsets for switches) to `BaseScreen.ts`.
3. **Deterministic Synchronization**: Never use hardcoded sleeps (`browser.pause()`); rely strictly on `waitForDisplayed()` or `browser.waitUntil()`.
4. **Central Export**: Register every new screen in `src/screens/index.ts`.
5. **Static Verification**: Run `npx tsc --noEmit` before proposing test runs.
