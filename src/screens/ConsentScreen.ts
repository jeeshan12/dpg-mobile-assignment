import { BaseScreen } from './BaseScreen';

export class ConsentScreen extends BaseScreen {
  get container() {
    return this.byId('consent_screen');
  }

  get title() {
    return this.byText('Your privacy choices');
  }

  get acceptButton() {
    return this.byId('consent_accept_button');
  }

  get rejectButton() {
    return this.byId('consent_reject_button');
  }

  get managePreferencesButton() {
    return this.byId('consent_manage_preferences_button');
  }

  async isDisplayed(): Promise<boolean> {
    return this.container.isDisplayed();
  }

  async waitForScreen(): Promise<void> {
    await this.waitForDisplayed(this.container);
  }

  async waitForDismissal(): Promise<void> {
    await this.waitForDismissed(this.container);
  }

  async acceptAll(): Promise<void> {
    await this.waitForDisplayed(this.acceptButton);
    await this.acceptButton.click();
    await this.waitForDismissal();
  }

  async rejectOptional(): Promise<void> {
    await this.waitForDisplayed(this.rejectButton);
    await this.rejectButton.click();
    await this.waitForDismissal();
  }

  async openPreferences(): Promise<void> {
    await this.waitForDisplayed(this.managePreferencesButton);
    await this.managePreferencesButton.click();
  }
}

export const consentScreen = new ConsentScreen();

