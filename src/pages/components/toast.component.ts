import { expect, Locator, Page } from '@playwright/test';

export class ToastComponent {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async checkToastMessage(message: string) {
        for (const toast of await this.page.locator('.snotifyToast__body').all()) {
            await expect(toast).toBeVisible();
            await expect(toast).toHaveText(message);
        }
    }
}
