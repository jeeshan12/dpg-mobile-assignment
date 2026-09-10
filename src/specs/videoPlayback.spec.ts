import { expect, browser } from '@wdio/globals';
import {
  consentScreen,
  contentOverviewScreen,
  contentDetailScreen,
  videoPlayerScreen,
  debugOptionsScreen,
} from '../screens';

describe('Video Playback Flow', () => {
  it('should navigate to video detail, verify all metadata, and reach Playing state with controls', async () => {
    // 1. Launch application and handle consent
    await consentScreen.waitForScreen();
    await consentScreen.acceptAll();

    // 2. Open "Amsterdam from above" video from content overview
    await contentOverviewScreen.waitForLoaded();
    await contentOverviewScreen.openAmsterdamVideo();

    // Verify detail screen elements and metadata with retrying expect assertions
    await contentDetailScreen.waitForScreen();
    await expect(contentDetailScreen.title).toBeDisplayed();
    expect(await contentDetailScreen.getTitleText()).toContain('Amsterdam from above');
    await expect(contentDetailScreen.category).toHaveText('Travel');
    await expect(contentDetailScreen.publishedDate).toBeDisplayed();
    await expect(contentDetailScreen.description).toBeDisplayed();
    expect(await contentDetailScreen.getDescriptionText()).toContain('Explore Amsterdam and its surroundings');
    await expect(contentDetailScreen.backButton).toBeDisplayed();

    await contentDetailScreen.scrollToPlayButton();
    await expect(contentDetailScreen.playButton).toBeDisplayed();

    // 3. Start video playback and verify 'Playing' state and all player UI controls
    await contentDetailScreen.playVideo();

    await videoPlayerScreen.waitForPlayer();
    await expect(videoPlayerScreen.stateLabel).toBeDisplayed();

    await videoPlayerScreen.waitForState('Playing');
    await expect(videoPlayerScreen.stateLabel).toHaveText(expect.stringContaining('Playing'));

    // Verify player controls when playing
    await expect(videoPlayerScreen.pauseButton).toBeDisplayed();
    await expect(videoPlayerScreen.currentTime).toBeDisplayed();
    await expect(videoPlayerScreen.duration).toBeDisplayed();
    await expect(videoPlayerScreen.progressSlider).toBeDisplayed();
    await expect(videoPlayerScreen.duration).toHaveText(/00:30|02:30|:30/);
  });

  it('should allow pausing and resuming video playback', async () => {
    // 1. Handle consent and open video
    await consentScreen.waitForScreen();
    await consentScreen.acceptAll();

    await contentOverviewScreen.waitForLoaded();
    await contentOverviewScreen.openAmsterdamVideo();

    await contentDetailScreen.waitForScreen();
    await contentDetailScreen.playVideo();

    // 2. Wait until Playing, then Pause
    await videoPlayerScreen.waitForState('Playing');
    await videoPlayerScreen.pauseVideo();
    await videoPlayerScreen.waitForState('Paused');
    await expect(videoPlayerScreen.stateLabel).toHaveText(expect.stringContaining('Paused'));
    await expect(videoPlayerScreen.playButton).toBeDisplayed();

    // 3. Resume and verify Playing state restored
    await videoPlayerScreen.resumeVideo();
    await videoPlayerScreen.waitForState('Playing');
    await expect(videoPlayerScreen.stateLabel).toHaveText(expect.stringContaining('Playing'));
    await expect(videoPlayerScreen.pauseButton).toBeDisplayed();
  });

  it('should allow navigating back from detail screen to content overview', async () => {
    await consentScreen.waitForScreen();
    await consentScreen.acceptAll();

    await contentOverviewScreen.waitForLoaded();
    await contentOverviewScreen.openAmsterdamVideo();

    await contentDetailScreen.waitForScreen();
    await contentDetailScreen.goBack();

    await contentOverviewScreen.waitForLoaded();
    await expect(contentOverviewScreen.amsterdamItem).toBeDisplayed();
  });

  it('should display error message and retry button when video playback fails', async () => {
    // 1. Handle consent
    await consentScreen.waitForScreen();
    await consentScreen.acceptAll();

    // 2. Open Debug Options and configure video error mode
    await contentOverviewScreen.waitForLoaded();
    await contentOverviewScreen.openDebugOptions();
    await debugOptionsScreen.waitForScreen();
    await debugOptionsScreen.setVideoMode('error');
    await debugOptionsScreen.close();

    // 3. Open video detail and trigger playback
    await contentOverviewScreen.openAmsterdamVideo();
    await contentDetailScreen.waitForScreen();
    await contentDetailScreen.scrollToPlayButton();
    await contentDetailScreen.playVideo();

    // 4. Verify Error state and error UI components with retrying expect assertions
    await videoPlayerScreen.waitForPlayer();
    await videoPlayerScreen.waitForState('Error');
    await expect(videoPlayerScreen.stateLabel).toHaveText(expect.stringContaining('Error'));

    await expect(videoPlayerScreen.errorMessage).toBeDisplayed();
    await expect(videoPlayerScreen.errorMessage).toHaveText(expect.stringContaining('Video could not be played'));
    await expect(videoPlayerScreen.retryButton).toBeDisplayed();
  });

  it('should handle video buffering state during playback', async () => {
    // 1. Handle consent
    await consentScreen.waitForScreen();
    await consentScreen.acceptAll();

    // 2. Open Debug Options and configure video buffering mode
    await contentOverviewScreen.waitForLoaded();
    await contentOverviewScreen.openDebugOptions();
    await debugOptionsScreen.waitForScreen();
    await debugOptionsScreen.setVideoMode('buffering');
    await debugOptionsScreen.close();

    // 3. Open video detail and trigger playback
    await contentOverviewScreen.openAmsterdamVideo();
    await contentDetailScreen.waitForScreen();
    await contentDetailScreen.scrollToPlayButton();
    await contentDetailScreen.playVideo();

    // 4. Verify player is displayed and reaches valid state
    await videoPlayerScreen.waitForPlayer();
    await browser.waitUntil(
      async () => {
        const state = await videoPlayerScreen.getStateText();
        return state.includes('Buffering') || state.includes('Playing');
      },
      {
        timeout: 15_000,
        timeoutMsg: 'Video player did not initialize buffering or playing state within 15000ms',
      }
    );
    await expect(videoPlayerScreen.stateLabel).toHaveText(/Buffering|Playing/);
  });

  it('should transition to Completed state when video playback finishes', async () => {
    // 1. Handle consent
    await consentScreen.waitForScreen();
    await consentScreen.acceptAll();

    // 2. Open Debug Options and configure fast playback completion mode
    await contentOverviewScreen.waitForLoaded();
    await contentOverviewScreen.openDebugOptions();
    await debugOptionsScreen.waitForScreen();
    await debugOptionsScreen.setVideoMode('completeQuickly');
    await debugOptionsScreen.close();

    // 3. Open video detail and trigger playback
    await contentOverviewScreen.openAmsterdamVideo();
    await contentDetailScreen.waitForScreen();
    await contentDetailScreen.scrollToPlayButton();
    await contentDetailScreen.playVideo();

    // 4. Verify player state transitions to Completed with retrying expect assertions
    await videoPlayerScreen.waitForPlayer();
    await videoPlayerScreen.waitForState('Completed', 20_000);
    await expect(videoPlayerScreen.stateLabel).toHaveText(expect.stringContaining('Completed'));

    // 5. Verify replay / play button is displayed after completion
    await expect(videoPlayerScreen.playButton).toBeDisplayed();
  });
});
