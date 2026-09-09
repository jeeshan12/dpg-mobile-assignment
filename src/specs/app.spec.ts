import { expect, $ } from '@wdio/globals';

describe('App Launch  Screen', () => {
  it('should launch the application and display the consent screen', async () => {
    // Locate the consent screen container or elements
    const consentScreen = $('//*[@resource-id="consent_screen"]');
    await consentScreen.waitForDisplayed({ timeout: 15_000 });

    const acceptButton = $('//*[@resource-id="consent_accept_button"]');
    await expect(acceptButton).toBeDisplayed();

    const rejectButton = $('//*[@resource-id="consent_reject_button"]');
    await expect(rejectButton).toBeDisplayed();

    const managePreferencesButton = $('//*[@resource-id="consent_manage_preferences_button"]');
    await expect(managePreferencesButton).toBeDisplayed();
  });

});
