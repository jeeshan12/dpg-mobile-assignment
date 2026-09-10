import { $, browser } from '@wdio/globals';

/**
 * Base Screen providing common wait, locator, and interaction utilities
 * for all screen objects across Android and iOS.
 */
export abstract class BaseScreen {
  /**
   * Helper to locate an element by accessibility id or resource-id
   */
  protected byId(id: string) {
    if (browser.isAndroid) {
      return $(`//*[@resource-id="${id}"]`);
    }
    // On iOS, Appium matches accessibility id or name
    return $(`~${id}`);
  }

  /**
   * Helper to locate an element by accessibility label / content description
   */
  protected byAccessibilityId(id: string) {
    return $(`~${id}`);
  }

  /**
   * Helper to locate an element by text, label, or name across Android and iOS
   */
  protected byText(text: string) {
    return $(`//*[contains(@text, "${text}") or contains(@label, "${text}") or contains(@name, "${text}")]`);
  }

  /**
   * Wait for an element to be displayed on screen
   */
  async waitForDisplayed(element: ChainablePromiseElement, timeout = 15_000): Promise<void> {
    await element.waitForDisplayed({
      timeout,
      timeoutMsg: `Element was not displayed within ${timeout}ms`,
    });
  }

  /**
   * Wait for an element to disappear / not be displayed
   */
  async waitForDismissed(element: ChainablePromiseElement, timeout = 15_000): Promise<void> {
    await element.waitForDisplayed({
      timeout,
      reverse: true,
      timeoutMsg: `Element was still displayed after ${timeout}ms`,
    });
  }

  /**
   * Retrieves visible text from an element across Android and iOS.
   * On iOS XCUITest, prioritizes the visible 'label' and gracefully falls back to getText().
   */
  async getElementText(element: ChainablePromiseElement): Promise<string> {
    await this.waitForDisplayed(element);
    if (browser.isIOS) {
      const label = await element.getAttribute('label');
      if (label && label.trim().length > 0) {
        return label;
      }
    }
    return element.getText();
  }

  /**
   * Check if a switch / checkbox element is currently checked / enabled.
   * Android uses 'checked' ('true'/'false'), while iOS uses 'value' ('1'/'0' or 'true'/'false').
   */
  async isElementChecked(element: ChainablePromiseElement): Promise<boolean> {
    if (browser.isAndroid) {
      const checked = await element.getAttribute('checked');
      return checked === 'true';
    }
    const value = await element.getAttribute('value');
    if (value !== null && value !== undefined) {
      return String(value) === '1' || String(value).toLowerCase() === 'true';
    }
    return element.isSelected();
  }

  /**
   * Toggles a switch / toggle element reliably across Android and iOS SwiftUI forms
   * and waits for the checked state to update.
   */
  async toggleSwitch(element: ChainablePromiseElement): Promise<void> {
    await this.waitForDisplayed(element);
    const initialState = await this.isElementChecked(element);

    if (browser.isIOS) {
      const loc = await element.getLocation();
      const size = await element.getSize();
      const tapX = Math.round(loc.x + size.width - 25);
      const tapY = Math.round(loc.y + size.height / 2);
      await browser.action('pointer')
        .move({ origin: 'viewport', x: tapX, y: tapY })
        .down()
        .pause(100)
        .up()
        .perform();
    } else {
      await element.click();
    }

    await browser.waitUntil(
      async () => (await this.isElementChecked(element)) !== initialState,
      {
        timeout: 10_000,
        timeoutMsg: 'Toggle state did not update after click',
        interval: 200,
      }
    );
  }

  /**
   * Scrolls vertically until the target element is visible in the viewport.
   */
  async scrollToElement(element: ChainablePromiseElement, maxScrolls = 5): Promise<void> {
    for (let i = 0; i < maxScrolls; i++) {
      if (await element.isDisplayed()) {
        return;
      }

      const { width, height } = await browser.getWindowSize();
      const startX = Math.round(width / 2);
      const startY = Math.round(height * 0.7);
      const endY = Math.round(height * 0.3);

      await browser.action('pointer')
        .move({ origin: 'viewport', x: startX, y: startY })
        .down()
        .pause(100)
        .move({ origin: 'viewport', x: startX, y: endY, duration: 400 })
        .up()
        .perform();
    }
  }
}

