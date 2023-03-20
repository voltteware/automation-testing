import { expect, Locator, Page } from '@playwright/test';

export class CreateCompanyPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page
    }
}