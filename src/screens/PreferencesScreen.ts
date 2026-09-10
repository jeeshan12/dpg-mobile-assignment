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
    await this.toggleSwitch(this.analyticsToggle);
  }

  async togglePersonalisation(): Promise<void> {
    await this.toggleSwitch(this.personalisationToggle);
  }

  async isAnalyticsChecked(): Promise<boolean> {
    return this.isElementChecked(this.analyticsToggle);
  }

  async isPersonalisationChecked(): Promise<boolean> {
    return this.isElementChecked(this.personalisationToggle);
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

