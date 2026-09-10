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
}

