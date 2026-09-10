import { expect } from '@wdio/globals';
import { consentScreen, contentOverviewScreen, debugOptionsScreen } from '../screens';

describe('Content Overview Feed', () => {
  it('should display video cards and refresh feed successfully', async () => {
    // 1. Launch application and handle consent
    await consentScreen.waitForScreen();
    await consentScreen.acceptAll();

    // 2. Verify feed items are displayed
    await contentOverviewScreen.waitForLoaded();
    await expect(contentOverviewScreen.amsterdamItem).toBeDisplayed();
    await expect(contentOverviewScreen.newsroomItem).toBeDisplayed();
    await expect(contentOverviewScreen.morningItem).toBeDisplayed();

    // 3. Trigger refresh and verify feed remains loaded
    await contentOverviewScreen.refreshContent();
    await contentOverviewScreen.waitForLoaded();
    await expect(contentOverviewScreen.amsterdamItem).toBeDisplayed();
  });

  it('should display error message and retry button when feed fails to load', async () => {
    // 1. Handle consent
    await consentScreen.waitForScreen();
    await consentScreen.acceptAll();

    // 2. Configure content mode to error via Debug Options
    await contentOverviewScreen.waitForLoaded();
    await contentOverviewScreen.openDebugOptions();
    await debugOptionsScreen.waitForScreen();
    await debugOptionsScreen.setContentMode('error');
    await debugOptionsScreen.close();

    // 3. Trigger refresh to load error state
    await contentOverviewScreen.refreshContent();

    // 4. Verify error state UI components with retrying expect assertions
    await expect(contentOverviewScreen.errorMessage).toBeDisplayed();
    await expect(contentOverviewScreen.errorMessage).toHaveText(
      expect.stringContaining('could not load'),
    );
    await expect(contentOverviewScreen.errorRetryButton).toBeDisplayed();
  });

  it('should display empty state message when no videos are available', async () => {
    // 1. Handle consent
    await consentScreen.waitForScreen();
    await consentScreen.acceptAll();

    // 2. Configure content mode to empty via Debug Options
    await contentOverviewScreen.waitForLoaded();
    await contentOverviewScreen.openDebugOptions();
    await debugOptionsScreen.waitForScreen();
    await debugOptionsScreen.setContentMode('empty');
    await debugOptionsScreen.close();

    // 3. Trigger refresh to load empty state
    await contentOverviewScreen.refreshContent();

    // 4. Verify empty state UI components with retrying expect assertions
    await expect(contentOverviewScreen.emptyState).toBeDisplayed();
    await expect(contentOverviewScreen.emptyRetryButton).toBeDisplayed();
  });
});
