import { expect, Locator, Page } from '@playwright/test';
import { getCompanyInfo } from '../../api/request/company.service';

export class HeaderComponent {
    readonly page: Page;
    readonly userName: Locator;
    readonly companyName: Locator;
    readonly subscriptionLink: Locator;
    readonly profileLink: Locator;
    readonly logOutLink: Locator;
    userInfoJSON;
    subscriptionsJSON;

    constructor(page: Page) {
        this.page = page;
        this.userName = page.locator('.drp-user');
        this.companyName = page.getByRole('combobox');
        this.profileLink = page.getByText('Profile');
        this.subscriptionLink = page.locator('text=Subscription(s)');
        this.logOutLink = page.getByText('Logout');
        this.userInfoJSON = "";
        this.subscriptionsJSON = "";
    }

    async clickUserNameOnTheTopRightCorner() {
        await this.userName.click();
    }

    async navigateToCreateCompanyPage() {
        await this.companyName.selectOption('0: Object');
        await expect(this.page).toHaveURL(/.*create/);
    }

    async clickProfileLink() {
        const [getUserInfoResponse] = await Promise.all([
            // Waits for the next response matching some conditions
            this.page.waitForResponse(response => (response.url().includes("/api/user"))),
            // Triggers the response            
            this.profileLink.click(),
        ]);

        await expect(this.page).toHaveURL(/.*profile/);
        this.userInfoJSON = await getUserInfoResponse.text();
    }

    async clickSubscriptionsLink() {
        const [getSubscriptionsResponse] = await Promise.all([
            // Waits for the next response matching some conditions
            this.page.waitForResponse(response => (response.url().includes("/api/billing/subscriptions"))),
            // Triggers the response            
            this.subscriptionLink.click(),
        ]);

        await expect(this.page).toHaveURL(/.*subscriptions/);
        this.subscriptionsJSON = await getSubscriptionsResponse.text();
        console.log("----here---", this.subscriptionsJSON);
    }

    async clickLogOut() {
        await this.logOutLink.click();
    }
}
