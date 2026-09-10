import { browser } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';

export type VideoPlaybackState = 'Buffering' | 'Playing' | 'Paused' | 'Error' | 'Completed';

export class VideoPlayerScreen extends BaseScreen {
  // Locators
  get container() {
    return this.byId('video_player_container');
  }

  get stateLabel() {
    return this.byId('video_state_label');
  }

  get playPauseButton() {
    return this.byId('video_play_pause_button');
  }

  get currentTime() {
    return this.byId('video_current_time');
  }

  get duration() {
    return this.byId('video_duration');
  }

  get progressSlider() {
    return this.byId('video_progress_slider');
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
    await this.waitForPlayer();
    return this.stateLabel.getText();
  }

  /**
   * Deterministically waits for the player to reach a target state (e.g. 'Playing')
   */
  async waitForState(targetState: VideoPlaybackState, timeout = 15_000): Promise<void> {
    await browser.waitUntil(
      async () => {
        const text = await this.stateLabel.getText();
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
  async togglePlayPause(): Promise<void> {
    await this.waitForDisplayed(this.playPauseButton);
    await this.playPauseButton.click();
  }

  async retryPlayback(): Promise<void> {
    await this.waitForDisplayed(this.retryButton);
    await this.retryButton.click();
  }

  async getCurrentPosition(): Promise<string> {
    await this.waitForDisplayed(this.currentTime);
    return this.currentTime.getText();
  }

  async getTotalDuration(): Promise<string> {
    await this.waitForDisplayed(this.duration);
    return this.duration.getText();
  }
}

export const videoPlayerScreen = new VideoPlayerScreen();

