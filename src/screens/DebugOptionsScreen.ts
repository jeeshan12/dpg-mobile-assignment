import { BaseScreen } from './BaseScreen';

export class DebugOptionsScreen extends BaseScreen {
  // Locators
  get title() {
    return this.byText('Debug options');
  }

  get doneButton() {
    return this.byId('debug_done_button');
  }

  // Content Response Modes
  get contentModeSuccess() {
    return this.byId('debug_content_success');
  }

  get contentModeEmpty() {
    return this.byId('debug_content_empty');
  }

  get contentModeError() {
    return this.byId('debug_content_error');
  }

  get contentModeSlow() {
    return this.byId('debug_content_slow');
  }

  // Video Response Modes
  get videoModeNormal() {
    return this.byId('debug_video_normal');
  }

  get videoModeBuffering() {
    return this.byId('debug_video_buffering');
  }

  get videoModeError() {
    return this.byId('debug_video_error');
  }

  get videoModeCompleteQuickly() {
    return this.byId('debug_video_complete_quickly');
  }

  // State Controls
  get resetConsentButton() {
    return this.byId('debug_reset_consent');
  }

  get clearProgressButton() {
    return this.byId('debug_clear_progress');
  }

  get restoreDefaultsButton() {
    return this.byId('debug_restore_defaults');
  }

  get resetAllButton() {
    return this.byId('debug_reset_all');
  }

  // Visibility & State
  async isDisplayed(): Promise<boolean> {
    return this.doneButton.isDisplayed();
  }

  async waitForScreen(timeout = 15_000): Promise<void> {
    await this.waitForDisplayed(this.doneButton, timeout);
  }

  // User Actions
  async setContentMode(mode: 'success' | 'empty' | 'error' | 'slow'): Promise<void> {
    await this.waitForScreen();
    if (mode === 'success') await this.contentModeSuccess.click();
    else if (mode === 'empty') await this.contentModeEmpty.click();
    else if (mode === 'error') await this.contentModeError.click();
    else if (mode === 'slow') await this.contentModeSlow.click();
  }

  async setVideoMode(mode: 'normal' | 'buffering' | 'error' | 'completeQuickly'): Promise<void> {
    await this.waitForScreen();
    if (mode === 'normal') await this.videoModeNormal.click();
    else if (mode === 'buffering') await this.videoModeBuffering.click();
    else if (mode === 'error') await this.videoModeError.click();
    else if (mode === 'completeQuickly') await this.videoModeCompleteQuickly.click();
  }

  async resetAllState(): Promise<void> {
    await this.waitForDisplayed(this.resetAllButton);
    await this.resetAllButton.click();
  }

  async close(): Promise<void> {
    await this.waitForDisplayed(this.doneButton);
    await this.doneButton.click();
    await this.waitForDismissed(this.doneButton);
  }
}

export const debugOptionsScreen = new DebugOptionsScreen();
