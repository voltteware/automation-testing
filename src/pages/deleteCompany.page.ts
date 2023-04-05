import { expect, Locator, Page } from '@playwright/test';

export class DeleteCompany {
    readonly page: Page;
    readonly navigateToAdministrationPage: Locator;
    readonly clickCompaniesSection: Locator;
    readonly clickFilterCompanyNameButton: Locator;
    readonly fillCompanyName: Locator;
    readonly clickFilterButton: Locator;
    readonly hardDeleteCompany: Locator;
    readonly clickOKbutton: Locator;
    companyName: string;

    constructor(page: Page) {
        this.page = page;
        this. companyName = "";
        this.navigateToAdministrationPage = page.getByRole('link', { name: 'Administration' });
        this.clickCompaniesSection = page.getByRole('link', { name: 'Companies' });
        this.clickFilterCompanyNameButton = page.getByRole('columnheader', { name: 'Company Name Sortable' }).getByRole('link', { name: '' });
        this.fillCompanyName = page.getByRole('textbox', { name: 'Page navigation, page {currentPage} of {totalPages}' });
        this.clickFilterButton = page.getByText('Filter');
        this.hardDeleteCompany = page.getByRole('row', { name: this.companyName }).getByRole('button', { name: '' });
        this.clickOKbutton = page.getByRole('button', { name: 'OK' });
    }

    async deleteCompanyThatJustCreated(companyName: string) {
        await this.navigateToAdministrationPage.click();
        await this.clickCompaniesSection.click();
        await this.clickFilterCompanyNameButton.click();
        await this.fillCompanyName.first().fill(companyName);
        await this.clickFilterButton.click();
        await this.hardDeleteCompany.nth(4).click();
        await this.clickOKbutton.click();
    }
}