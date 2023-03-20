import { expect, Locator, Page } from '@playwright/test';
import { random } from 'lodash';

export class SubscriptonPage {
    readonly page: Page;
    readonly csvButton: Locator;
    readonly inputCompanyName: Locator;
    readonly createCompanyButton: Locator;
    readonly subscriptionList: Locator;
    readonly selectFirstPlan: Locator;
    readonly selectPlan: Locator;
    readonly navigateToAdministrationPage: Locator;
    readonly clickCompaniesSection: Locator;
    readonly clickFilterCompanyNameButton: Locator;
    readonly fillCompanyName: Locator;
    readonly clickFilterButton: Locator;
    readonly hardDeleteCompany: Locator;
    readonly clickOKbutton: Locator;
    readonly notifycationBanner: Locator;
    readonly showCompanyName: Locator;
    readonly changeCardButton: Locator;
    nameOfCompanyTest: string;
    child: any;
   
    constructor(page: Page) {
        this.page = page;
        this.csvButton = page.locator('form label').nth(2);
        this.inputCompanyName = page.getByPlaceholder('Company Name');
        this.nameOfCompanyTest = "Auto-Company-To-Test-Subscription";
        this.createCompanyButton = page.getByText('Create Company');
        this.subscriptionList = page.locator('span').filter({ hasText: this.nameOfCompanyTest });
        this.notifycationBanner = page.locator('.subscriptions-detail__trial ng-star-inserted');
        this.showCompanyName = page.locator('subscriptions-detail__info');
        this.changeCardButton = page.getByText('CHANGE CARD');
        this.selectPlan = page.locator(`.subscriptions-detail__plans__cards div:nth-child(${this.child}) > div:nth-child(2) > .subscriptions-detail__plans__cards__item__select`);
        this.selectFirstPlan = page.locator('.subscriptions-detail__plans__cards .subscriptions-detail__plans__cards__item__select');
        this.navigateToAdministrationPage = page.getByRole('link', { name: 'Administration' });
        this.clickCompaniesSection = page.getByRole('link', { name: 'Companies' });
        this.clickFilterCompanyNameButton = page.getByRole('columnheader', { name: 'Company Name Sortable' }).getByRole('link', { name: '' });
        this.fillCompanyName = page.getByRole('textbox', { name: 'Page navigation, page {currentPage} of {totalPages}' });
        this.clickFilterButton = page.getByText('Filter');
        this.hardDeleteCompany = page.getByRole('row', { name: this.nameOfCompanyTest }).getByRole('button', { name: '' });
        this.clickOKbutton = page.getByRole('button', { name: 'OK' });
    }

    async goto() {
        await this.page.goto('/login', { timeout: 5 * 5000 })
    }

    async createNewCompany() {
        await this.csvButton.click();
        await this.inputCompanyName.fill(this.nameOfCompanyTest);
        await this.createCompanyButton.click();
    }

    async navigateToSubscriptionDetailsPage() {
        // await this.subscriptionList.first().click();
        await this.subscriptionList.click();
    }

    async checkNotifycationOnBanner() {
        await this.notifycationBanner.textContent();
    }

    async checkShowCompanyName() {
        await this.showCompanyName.textContent();
    }

    async pickRandomPlantoSelect() {
        // this.child = Math.floor(Math.random() * 8) + 1;
        // if(this.child == 1) {
        //     await this.selectFirstPlan.first().click();
        // }
        // else {
        //     await this.selectPlan.click();
        // }
        await this.selectFirstPlan.first().click();
    }

    async subscribePlan() {
        await Promise.all([
            this.page.waitForNavigation(/*{ url: 'https://checkout.stripe.com/pay/cs_test_b1ihOkl2mkUi0srgjuRpdEPn0aufUxkgVTox5FnlTjDBHfcWfIYpaYbAUa#fidkdWxOYHwnPyd1blpxYHZxWjVBdDU0Q1BmaEN8TXFXb3cyVWhdYzBPSScpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPydocGlxbFpscWBoJyknYGtkZ2lgVWlkZmBtamlhYHd2Jz9xd3BgeCUl' }*/),
            this.page.locator('button:has-text("OK")').click()
        ]);

        // Input valid data with all fields of the Checkout page
        await this.page.locator('[placeholder="1234 1234 1234 1234"]').fill('4242 4242 4242 4242');
        // await this.page.locator('[placeholder="MM / YY"]').fill('08 / 22');
        await this.page.locator('[placeholder="MM / YY"]').fill('08 / 23');
        await this.page.locator('#cardCvc').fill('242');
        await this.page.locator('#billingName').fill('Subcription Test');
        // Add promotion code
        await this.page.locator('#promotionCode').click();
        await this.page.locator('#promotionCode').fill('TEST20PR'); // disccount 20%
        await this.page.locator('button:has-text("Apply")').click();

        await this.page.waitForTimeout(4000); // wait for load data in 4s

        const amountDisccounted = await this.page.locator('#OrderDetails-TotalAmount').textContent();
        console.log("amountDisccounted: ", amountDisccounted);
        expect(amountDisccounted).toEqual("$" + (99.99 - 99.99 * 0.2).toFixed(2));

        // Click on the Start Trial to subscribe plan
        await Promise.all([
            this.page.waitForNavigation(/*{ url: 'https://beta.forecastrx.com/subscriptions/' + curentKey }*/),
            this.page.locator('button:has-text("Start Trial")').click()
        ]);

        await expect(this.selectFirstPlan.first()).toHaveClass('subscriptions-detail__plans__cards__item__select is-cancel ng-star-inserted');
        await expect(this.selectFirstPlan.first()).toHaveText(' CANCEL PLAN');
    }

    async deleteCompanyThatJustCreated() {
        await this.navigateToAdministrationPage.click();
        await this.clickCompaniesSection.click();
        await this.clickFilterCompanyNameButton.click();
        await this.fillCompanyName.first().fill(this.nameOfCompanyTest);
        await this.clickFilterButton.click();
        await this.hardDeleteCompany.nth(4).click();
        await this.clickOKbutton.click();
    }
}