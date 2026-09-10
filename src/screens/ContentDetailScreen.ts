import { BaseScreen } from './BaseScreen';

export class ContentDetailScreen extends BaseScreen {
  // Locators
  get container() {
    return this.byId('content_detail_screen');
  }

  get title() {
    return this.byId('detail_title');
  }

  get category() {
    return this.byId('detail_category');
  }

  get publishedDate() {
    return this.byText('Published');
  }

  get description() {
    return this.byId('detail_description');
  }

  get playButton() {
    return this.byId('video_play_button');
  }

  get backButton() {
    return this.byId('detail_back_button');
  }

  // Visibility & State
  async isDisplayed(): Promise<boolean> {
    return this.title.isDisplayed();
  }

  async waitForScreen(timeout = 15_000): Promise<void> {
    await this.waitForDisplayed(this.title, timeout);
  }

  // Text retrieval
  async getTitleText(): Promise<string> {
    return this.getElementText(this.title);
  }

  async getCategoryText(): Promise<string> {
    return this.getElementText(this.category);
  }

  async getPublishedDateText(): Promise<string> {
    return this.getElementText(this.publishedDate);
  }

  async getDescriptionText(): Promise<string> {
    return this.getElementText(this.description);
  }

  // User Actions
  async scrollToPlayButton(): Promise<void> {
    await this.scrollToElement(this.playButton);
  }

  async playVideo(): Promise<void> {
    await this.waitForDisplayed(this.playButton);
    await this.playButton.click();
  }

  async goBack(): Promise<void> {
    await this.waitForDisplayed(this.backButton);
    await this.backButton.click();
  }
}

export const contentDetailScreen = new ContentDetailScreen();
