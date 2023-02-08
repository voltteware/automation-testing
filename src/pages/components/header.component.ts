import { expect, Locator, Page } from '@playwright/test';

export class HeaderComponent {
    readonly page: Page;
    readonly userName: Locator;
    readonly subscriptionLink: Locator;
    readonly profileLink: Locator;
    readonly logOutLink: Locator;
    userInfoJSON;

    constructor(page: Page) {
        this.page = page;
        this.userName = page.locator('.drp-user');
        this.profileLink = page.getByText('Profile');
        this.subscriptionLink = page.getByText('Subscription(s)');
        this.logOutLink = page.getByText('Logout');
        this.userInfoJSON = "";
    }

    async clickUserNameOnTheTopRightCorner() {
        await this.userName.click();
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
        await this.subscriptionLink.click();
        await expect(this.page).toHaveURL(/.*subscriptions/);
    }

    async clickLogOut() {
        await this.logOutLink.click();
    }
}
