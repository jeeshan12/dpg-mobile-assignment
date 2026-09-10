import { expect } from '@wdio/globals';
import { consentScreen, preferencesScreen, contentOverviewScreen } from '../screens';

describe('Consent Screen Flow', () => {
  it('should display the consent screen with all required UI elements on initial launch', async () => {
    await consentScreen.waitForScreen();
    await expect(consentScreen.container).toBeDisplayed();
    await expect(consentScreen.title).toBeDisplayed();
    await expect(consentScreen.acceptButton).toBeDisplayed();
    await expect(consentScreen.rejectButton).toBeDisplayed();
    await expect(consentScreen.managePreferencesButton).toBeDisplayed();
  });

  it('should dismiss consent and navigate to content overview when "Accept all" is clicked', async () => {
    await consentScreen.waitForScreen();
    await consentScreen.acceptAll();

    await contentOverviewScreen.waitForLoaded();
    await expect(consentScreen.container).not.toBeDisplayed();
  });

  it('should dismiss consent and navigate to content overview when "Reject optional" is clicked', async () => {
    await consentScreen.waitForScreen();
    await consentScreen.rejectOptional();

    await contentOverviewScreen.waitForLoaded();
    await expect(consentScreen.container).not.toBeDisplayed();
  });

  it('should allow opening preferences, toggling choices, and saving to navigate to content overview', async () => {
    await consentScreen.waitForScreen();
    await consentScreen.openPreferences();

    await preferencesScreen.waitForScreen();
    await expect(preferencesScreen.container).toBeDisplayed();

    // Toggle analytics and verify state transition
    const initialAnalytics = await preferencesScreen.isAnalyticsChecked();
    await preferencesScreen.toggleAnalytics();
    const updatedAnalytics = await preferencesScreen.isAnalyticsChecked();
    expect(updatedAnalytics).toBe(!initialAnalytics);

    await preferencesScreen.savePreferences();

    await contentOverviewScreen.waitForLoaded();
    await expect(consentScreen.container).not.toBeDisplayed();
    await expect(preferencesScreen.container).not.toBeDisplayed();
  });
});

