import { BaseScreen } from './BaseScreen';

export class ContentOverviewScreen extends BaseScreen {
  // Locators
  get screen() {
    return this.byId('content_overview_screen');
  }

  get refreshButton() {
    return this.byId('content_refresh_button');
  }

  get debugOptionsButton() {
    return this.byId('debug_options_button');
  }

  get loadingIndicator() {
    return this.byId('content_loading_indicator');
  }

  get emptyState() {
    return this.byText('No videos are available');
  }

  get emptyRetryButton() {
    return this.byText('Try again');
  }

  get errorState() {
    return this.byId('content_error_state');
  }

  get errorMessage() {
    return this.byId('content_error_message');
  }

  get errorRetryButton() {
    return this.byId('content_error_retry_button');
  }

  // Video Card Locators
  getItemById(contentId: string) {
    return this.byId(`content_item_${contentId}`);
  }

  getTitleById(contentId: string) {
    return this.byId(`content_title_${contentId}`);
  }

  get amsterdamItem() {
    return this.getItemById('amsterdam');
  }

  get newsroomItem() {
    return this.getItemById('newsroom');
  }

  get morningItem() {
    return this.getItemById('morning');
  }

  get technologyItem() {
    return this.getItemById('technology');
  }

  get cultureItem() {
    return this.getItemById('culture');
  }

  get weekendItem() {
    return this.getItemById('weekend');
  }

  // Visibility & State
  async isDisplayed(): Promise<boolean> {
    return this.debugOptionsButton.isDisplayed();
  }

  async waitForLoaded(timeout = 15_000): Promise<void> {
    await this.waitForDisplayed(this.debugOptionsButton, timeout);
  }

  // User Actions
  async openVideo(contentId: string): Promise<void> {
    const item = this.getItemById(contentId);
    await this.waitForDisplayed(item);
    await item.click();
  }

  async openAmsterdamVideo(): Promise<void> {
    await this.openVideo('amsterdam');
  }

  async refreshContent(): Promise<void> {
    await this.waitForDisplayed(this.refreshButton);
    await this.refreshButton.click();
  }

  async openDebugOptions(): Promise<void> {
    await this.waitForDisplayed(this.debugOptionsButton);
    await this.debugOptionsButton.click();
  }

  async getErrorMessageText(): Promise<string> {
    return this.getElementText(this.errorMessage);
  }

  async getEmptyStateText(): Promise<string> {
    return this.getElementText(this.emptyState);
  }
}

export const contentOverviewScreen = new ContentOverviewScreen();
