import { expect, Locator, Page } from '@playwright/test';
import { random } from 'lodash';

export class SubscriptionPage {
    readonly page: Page;
    readonly subscriptionRow: Locator;
    readonly infoOnBanner: Locator;
    readonly showDefaultPlan: Locator;
    readonly changeCardButton: Locator;
    readonly annualBilling: Locator;
    readonly notifyOnDashboard: Locator;
    // readonly notifyOnSubscriptionDetailWithCanceled: Locator;
    showCompanyName: any;
    index: any;
    amountDiscounted: any;
    price: any;
    dataTestID: string;
    resultArray: (string | any)[];
    currentPlanText: any;
    // companyName: string;
   
    constructor(page: Page) {
        this.page = page;
        // this.companyName = "";
        this.subscriptionRow = page.getByTestId('subscriptions');
        this.infoOnBanner = page.locator('.subscriptions-detail .subscriptions-detail__trial');
        this.showDefaultPlan = page.getByTestId('subscription-detail-name');
        this.changeCardButton = page.getByText('CHANGE CARD');
        this.annualBilling = page.getByTestId('annual-billing');
        this.notifyOnDashboard = page.locator('div.notification-banner');
        this.annualBilling = page.getByTestId('annual-billing');
        this.notifyOnDashboard = page.locator('div.notification-banner');
        this.showCompanyName = "";
        this.index = "";
        this.amountDiscounted = "";
        this.price = "";
        this.dataTestID = "";
        this.resultArray = [];
    }

    async goto() {
        await this.page.goto('/login', { timeout: 5 * 5000 })
    }

    async clickOnSubscription(companyName: string, id: any) {
        const responsePromise = this.page.waitForResponse(resp => resp.url() === `https://preprod-my.forecastrx.com/api/billing/pending-subscription/${id[1]}/${id[0]}` && resp.status() === 200);
        await this.subscriptionRow.getByText(id[4]).click();
        const response = await responsePromise;
    }

    async checkInfoOnBanner(companyName: string, id: any) {
        let info = await this.infoOnBanner.textContent();
        console.log("text: ", info);
        expect(info).toContain("You are currently enrolled in your FREE trial. This is valid until");
    }

    async checkShowCompanyName(companyName: string) {
        let showCompanyName = this.page.getByRole('heading', { name: companyName });
        console.log('showCompanyName', showCompanyName);
        await expect(showCompanyName).toBeVisible();
    }

    async checkDefaultPlanOnTrial(plan: string, status: string) {
        let showDefaultPlan = await this.showDefaultPlan.textContent();
        console.log("default plan: ", showDefaultPlan?.trim());
        expect(showDefaultPlan?.trim()).toEqual(plan);
    }

    async pickRandomPlanToSelect() {
        this.index = Math.floor(Math.random() * 8);
        console.log("---Index: ", this.index);
        
        if(this.index % 2 == 0) {
            await this.page.getByTestId(`chooseplan-${Plans[this.index].dataTestID}`).click();
        }
        else {
            await this.annualBilling.click();
            await this.page.getByTestId(`chooseplan-${Plans[this.index].dataTestID}`).click();
        }
        
        console.log("Price: ", Plans[this.index].price), "And datatest-id: ", Plans[this.index].dataTestID;

        return this.index;
    }

    async inputBillingInforOnStripeCheckoutPage(card: string, promotionCodeId: string, expirationDate: string) {
        const navigationPromise = this.page.waitForNavigation();
        await this.page.getByRole('button', { name: 'OK' }).click();
        await navigationPromise;

        // Input valid data with all fields of the Checkout page
        await this.page.locator('[placeholder="1234 1234 1234 1234"]').fill(card);
        await this.page.locator('[placeholder="MM / YY"]').fill(expirationDate);
        await this.page.locator('#cardCvc').fill('242');
        await this.page.locator('#billingName').fill('Subscription Test');
        // Add promotion code
        await this.page.locator('#promotionCode').click();
        await this.page.locator('#promotionCode').fill(promotionCodeId); // discount 20%
        await this.page.locator('button:has-text("Apply")').click();

        await this.page.waitForTimeout(4000); // wait for load data in 4s

        this.amountDiscounted = await this.page.locator('#OrderDetails-TotalAmount').textContent();
    }

    async verifyPromotionCodeAndCurrentPlan(promotionCodeValue: any, buttonName: string, id: string) {
        console.log('Plans[this.index].', Plans[this.index], Plans[this.index].price, Plans[this.index].dataTestID, promotionCodeValue);
        console.log("amountDiscounted: ", this.amountDiscounted);

        // Create our number formatter.
        const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });

        console.log(formatter.format(1000)); /* $2,500.00 */

        expect(this.amountDiscounted).toEqual(formatter.format(Plans[this.index].price - (Plans[this.index].price * promotionCodeValue)/100));

        // Click on the Start Trial to subscribe plan
        await Promise.all([
            this.page.waitForNavigation(/*{ url: 'https://preprod-my.forecastrx.com/subscriptions/` + currentCompanyKey }*/),
            this.page.locator(`button:has-text(${buttonName})`).click(),,
        ]);

        this.currentPlanText = await this.page.getByTestId(Plans[this.index].dataTestID + ' current-plan').textContent();
        expect(this.currentPlanText).toContain(" CURRENT PLAN ");
    }

    async viewCanceledSubscription(companyName: string) {
        await expect(this.subscriptionRow.filter({ hasText: companyName })).not.toBeVisible();
    }

    async checkWarningMessageOfCanceledSubscription() {
        let notify = await this.notifyOnDashboard.textContent();
        console.log("Notify: ", notify);
        expect(notify).toEqual(" Your subscription is expired, unpaid or canceled.  Click here to manage your subscription ");
    }

    async clickLinkOnBanner() {
        await this.notifyOnDashboard.getByRole('link').click();
    }

    async checkWaringMessageThatSelectAPlan() {
        let noti = await this.infoOnBanner.textContent();
        console.log("NOTI SD: ", noti);
        expect(noti).toEqual("Select a plan to start using ForecastRx.");
    }
 }

 export const Plans = [
    {
        "price": 99.99,
        "dataTestID": "starter-monthly",
    },
    {
        "price": 999.99,
        "dataTestID": "starter-yearly",
    },
    {
        "price": 199.99,
        "dataTestID": "advanced-monthly",
    },
    {
        "price": 1999.99,
        "dataTestID": "advanced-yearly",
    },
    {
        "price": 299.99,
        "dataTestID": "pro-monthly",
    },
    {
        "price": 2999.99,
        "dataTestID": "pro-yearly",
    },
    {
        "price": 399.99,
        "dataTestID": "enterprise-monthly",
    },
    {
        "price": 3999.99,
        "dataTestID": "enterprise-yearly",
    },
]