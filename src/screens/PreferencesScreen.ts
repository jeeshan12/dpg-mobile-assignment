import { BaseScreen } from './BaseScreen';

export class PreferencesScreen extends BaseScreen {
  get container() {
    return this.byId('preferences_screen');
  }

  get analyticsToggle() {
    return this.byId('analytics_toggle');
  }

  get personalisationToggle() {
    return this.byId('personalisation_toggle');
  }

  get saveButton() {
    return this.byId('preferences_save_button');
  }

  get backButton() {
    return this.byAccessibilityId('Back');
  }

  async isDisplayed(): Promise<boolean> {
    return this.container.isDisplayed();
  }

  async waitForScreen(): Promise<void> {
    await this.waitForDisplayed(this.container);
  }

  async toggleAnalytics(): Promise<void> {
    await this.waitForDisplayed(this.analyticsToggle);
    await this.analyticsToggle.click();
  }

  async togglePersonalisation(): Promise<void> {
    await this.waitForDisplayed(this.personalisationToggle);
    await this.personalisationToggle.click();
  }

  async isAnalyticsChecked(): Promise<boolean> {
    const checked = await this.analyticsToggle.getAttribute('checked');
    return checked === 'true';
  }

  async isPersonalisationChecked(): Promise<boolean> {
    const checked = await this.personalisationToggle.getAttribute('checked');
    return checked === 'true';
  }

  async savePreferences(): Promise<void> {
    await this.waitForDisplayed(this.saveButton);
    await this.saveButton.click();
    await this.waitForDismissed(this.container);
  }

  async goBack(): Promise<void> {
    await this.waitForDisplayed(this.backButton);
    await this.backButton.click();
  }
}

export const preferencesScreen = new PreferencesScreen();

