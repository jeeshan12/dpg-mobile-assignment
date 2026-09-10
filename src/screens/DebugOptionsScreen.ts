import { BaseScreen } from './BaseScreen';

export class DebugOptionsScreen extends BaseScreen {
  // Locators
  get container() {
    return this.byId('debug_options_screen');
  }

  get contentModeNormal() {
    return this.byId('debug_content_mode_normal');
  }

  get contentModeEmpty() {
    return this.byId('debug_content_mode_empty');
  }

  get contentModeError() {
    return this.byId('debug_content_mode_error');
  }

  get videoModeNormal() {
    return this.byId('debug_video_mode_normal');
  }

  get videoModeError() {
    return this.byId('debug_video_mode_error');
  }

  get resetStateButton() {
    return this.byId('debug_reset_state_button');
  }

  get closeButton() {
    return this.byId('debug_close_button');
  }

  // Visibility & State
  async isDisplayed(): Promise<boolean> {
    return this.container.isDisplayed();
  }

  async waitForScreen(timeout = 15_000): Promise<void> {
    await this.waitForDisplayed(this.container, timeout);
  }

  // User Actions
  async setContentMode(mode: 'normal' | 'empty' | 'error'): Promise<void> {
    await this.waitForScreen();
    if (mode === 'normal') await this.contentModeNormal.click();
    else if (mode === 'empty') await this.contentModeEmpty.click();
    else if (mode === 'error') await this.contentModeError.click();
  }

  async setVideoMode(mode: 'normal' | 'error'): Promise<void> {
    await this.waitForScreen();
    if (mode === 'normal') await this.videoModeNormal.click();
    else if (mode === 'error') await this.videoModeError.click();
  }

  async resetState(): Promise<void> {
    await this.waitForDisplayed(this.resetStateButton);
    await this.resetStateButton.click();
  }

  async close(): Promise<void> {
    await this.waitForDisplayed(this.closeButton);
    await this.closeButton.click();
    await this.waitForDismissed(this.container);
  }
}

export const debugOptionsScreen = new DebugOptionsScreen();

