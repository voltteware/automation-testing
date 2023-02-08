import { Locator, Page } from "@playwright/test";

export class NavigationComponent {
    readonly page: Page;
    readonly manageCompanyMenu: Locator;
    readonly purchasingMenu: Locator;
    readonly restockAMZMenu: Locator;
    readonly administrationMenu: Locator;

    constructor(page: Page) {
        this.page = page;
        this.manageCompanyMenu = page.getByText('Manage Company')
        this.purchasingMenu = page.getByText('Purchasing')
        this.restockAMZMenu = page.getByText('RestockAMZ (Beta)')
        this.administrationMenu = page.getByText('Administration')
    }

    async clickManageCompany() {
        await this.manageCompanyMenu.click();
    }

    async clickPurchasing() {
        await this.purchasingMenu.click();
    }

    async clickRestockAMZ() {
        await this.restockAMZMenu.click();
    }

    async clickAdministration() {
        await this.administrationMenu.click();
    }
}