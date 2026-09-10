import { browser } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';

export type VideoPlaybackState = 'Buffering' | 'Playing' | 'Paused' | 'Error' | 'Completed';

export class VideoPlayerScreen extends BaseScreen {
  // Locators
  get container() {
    return this.byId('video_player');
  }

  get stateLabel() {
    return this.byId('video_state_label');
  }

  get playButton() {
    return this.byId('video_play_button');
  }

  get pauseButton() {
    return this.byId('video_pause_button');
  }

  get currentTime() {
    return this.byId('video_current_position');
  }

  get duration() {
    return this.byId('video_duration');
  }

  get progressSlider() {
    return this.byId('video_progress');
  }

  get errorMessage() {
    return this.byId('video_error_message');
  }

  get retryButton() {
    return this.byId('video_retry_button');
  }

  // Visibility & State
  async isDisplayed(): Promise<boolean> {
    return this.stateLabel.isDisplayed();
  }

  async waitForPlayer(timeout = 15_000): Promise<void> {
    await this.waitForDisplayed(this.stateLabel, timeout);
  }

  async getStateText(): Promise<string> {
    return this.getElementText(this.stateLabel);
  }

  /**
   * Deterministically waits for the player to reach a target state (e.g. 'Playing')
   */
  async waitForState(targetState: VideoPlaybackState, timeout = 15_000): Promise<void> {
    await browser.waitUntil(
      async () => {
        const text = await this.getStateText();
        return text.includes(targetState);
      },
      {
        timeout,
        timeoutMsg: `Video player did not reach state '${targetState}' within ${timeout}ms`,
        interval: 300,
      }
    );
  }

  // User Actions
  async pauseVideo(): Promise<void> {
    await this.waitForDisplayed(this.pauseButton);
    await this.pauseButton.click();
  }

  async resumeVideo(): Promise<void> {
    await this.waitForDisplayed(this.playButton);
    await this.playButton.click();
  }

  async togglePlayPause(): Promise<void> {
    if (await this.pauseButton.isDisplayed()) {
      await this.pauseVideo();
    } else {
      await this.resumeVideo();
    }
  }

  async retryPlayback(): Promise<void> {
    await this.waitForDisplayed(this.retryButton);
    await this.retryButton.click();
  }

  async getCurrentPosition(): Promise<string> {
    return this.getElementText(this.currentTime);
  }

  async getTotalDuration(): Promise<string> {
    return this.getElementText(this.duration);
  }
}

export const videoPlayerScreen = new VideoPlayerScreen();

