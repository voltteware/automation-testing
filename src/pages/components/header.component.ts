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
    subscriptionsJSON: any;
    subscriptionsTransform: any;
    company: any;
    id: string | RegExp | undefined;

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

    async switchToAnotherCompany(companyName: string) {
        await this.companyName.selectOption(companyName);
        await expect(this.page).toHaveURL(/.*home/);
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

    async clickSubscriptionsLink(nameOfCompany: any) {
        
        const [getSubscriptionsResponse] = await Promise.all([
            // Waits for the next response matching some conditions
            this.page.waitForResponse(response => (response.url().includes("/api/billing/subscriptions"))),
            // Triggers the response            
            this.subscriptionLink.click(),
        ]);

        await expect(this.page).toHaveURL(/.*subscriptions/);
        this.subscriptionsJSON = await getSubscriptionsResponse.text();
        this.subscriptionsTransform = JSON.parse(this.subscriptionsJSON);
        console.log("subscriptionsTransform: ", this.subscriptionsTransform)
        for(let i = 0; i < this.subscriptionsTransform.length; i++) {
            if(this.subscriptionsTransform[i].company.companyName == nameOfCompany) {
                return [this.subscriptionsTransform[i].id, this.subscriptionsTransform[i].customer, this.subscriptionsTransform[i].company.companyKey, this.subscriptionsTransform[i].trial_end, this.subscriptionsTransform[i].company.companyName];
            }
        }
    }

    async clickLogOut() {
        await this.logOutLink.click();
    }
}
