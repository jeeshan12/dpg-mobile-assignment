---
name: generate-mobile-tests
description: Step-by-step skill to generate WebdriverIO Page Objects and test specifications for the Video QA Challenge mobile application (Android & iOS).
---

# Mobile Test & Screen Generator Skill

This skill provides a systematic, step-by-step workflow for generating Page Objects and WebdriverIO/TypeScript test specifications for the **Video QA Challenge** mobile app.

---

## Step 1: Generating Page Objects (Screen Classes)

### Standard Screen Template Reference (`ConsentScreen.ts`)

All screen objects must extend `BaseScreen` and follow this structure:

```ts
import { $ } from "@wdio/globals";
import { BaseScreen } from "./BaseScreen";

export class ScreenName extends BaseScreen {
  // 1. Locators / Getters
  get container() {
    return this.byId("screen_identifier");
  }

  get actionButton() {
    return this.byId("action_button_identifier");
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

Use the verified identifiers below when generating new screen objects:

### 1. Consent Screen (`ConsentScreen.ts`)

- Screen Container: `consent_screen`
- Title: `"Your privacy choices"`
- Accept All Button: `consent_accept_button`
- Reject Optional Button: `consent_reject_button`
- Manage Preferences Button: `consent_manage_preferences_button`

### 2. Preferences Screen (`PreferencesScreen.ts`)

- Screen Container: `preferences_screen`
- Analytics Toggle: `analytics_toggle`
- Personalisation Toggle: `personalisation_toggle`
- Save Preferences Button: `preferences_save_button`
- Back Button: `Back` (Accessibility ID)

### 3. Content Overview Screen (`ContentOverviewScreen.ts`)

- Loading Indicator: `content_loading_indicator`
- Refresh Button: `content_refresh_button`
- Debug Options Button: `debug_options_button`
- Video Items (Card Containers):
  - `content_item_amsterdam` (_Amsterdam from above_)
  - `content_item_newsroom` (_Inside the newsroom_)
  - `content_item_morning` (_Morning news update_)
  - `content_item_technology` (_Technology trends_)
  - `content_item_culture` (_City culture_)
  - `content_item_weekend` (_Weekend preview_)
- Video Titles: `content_title_<id>` (e.g. `content_title_amsterdam`)
- Empty State Message: `content_empty_message` ("No videos are available")
- Error State Message: `content_error_message` ("We could not load the videos")
- Retry Button: `content_retry_button`

### 4. Content Detail Screen (`ContentDetailScreen.ts`)

- Detail Screen Container: `content_detail_screen`
- Title: `detail_title` (Accessibility label/value contains video title & content ID)
- Category: `detail_category`
- Published Date: `detail_published_date`
- Description: `detail_description`
- Play Video Button: `detail_play_button`
- Back Button: `detail_back_button`

### 5. Video Player Screen (`VideoPlayerScreen.ts`)

- Player Container: `video_player_container`
- State Label: `video_state_label` (Observable states: `Buffering`, `Playing`, `Paused`, `Error`, `Completed`)
- Play / Pause Button: `video_play_pause_button`
- Current Position: `video_current_time`
- Total Duration: `video_duration`
- Progress Slider: `video_progress_slider`
- Error State Message: `video_error_message` ("Video could not be played")
- Retry Button: `video_retry_button`

### 6. Debug Options Screen (`DebugOptionsScreen.ts`)

- Screen Container: `debug_options_screen`
- Content Mode Radios/Buttons:
  - Normal: `debug_content_mode_normal`
  - Empty: `debug_content_mode_empty`
  - Error: `debug_content_mode_error`
- Video Mode Radios/Buttons:
  - Normal: `debug_video_mode_normal`
  - Error: `debug_video_mode_error`
- Reset State Button: `debug_reset_state_button`
- Close Button: `debug_close_button`

---

## Screen Generation Checklist

When generating any screen:

1. Verify cross-platform selector compatibility using `this.byId()` (resource-id on Android, accessibility ID on iOS).
2. Never use hardcoded sleeps (`browser.pause`); rely strictly on `waitForDisplayed` / `waitUntil`.
3. Register the new screen in `src/screens/index.ts`.
4. Run `npx tsc --noEmit` to verify type safety.
