import { expect, Locator, Page } from '@playwright/test';

export class CreateCompanyPage {
    readonly page: Page;
    readonly csvButton: Locator;
    readonly inputCompanyName: Locator;
    readonly createCompanyButton: Locator;
    nameOfCompanyTest: string;

    constructor(page: Page) {
        this.page = page;
        this.csvButton = page.locator('form label').nth(2);
        this.inputCompanyName = page.getByPlaceholder('Company Name');
        this.nameOfCompanyTest = "Auto-Company-To-Test-Subscription";
        this.createCompanyButton = page.getByText('Create Company');
    }

    async createNewCompany(companyName: string, ) {
        await this.csvButton.click();
        await this.inputCompanyName.fill(companyName);
        await this.createCompanyButton.click();

        await expect(this.page).toHaveURL(/.*onboarding/);
    }
}