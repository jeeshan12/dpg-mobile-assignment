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
    return this.byId('detail_published_date');
  }

  get description() {
    return this.byId('detail_description');
  }

  get playButton() {
    return this.byId('detail_play_button');
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
    await this.waitForDisplayed(this.title);
    return this.title.getText();
  }

  async getCategoryText(): Promise<string> {
    await this.waitForDisplayed(this.category);
    return this.category.getText();
  }

  // User Actions
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

