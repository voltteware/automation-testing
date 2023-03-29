import { expect, Locator, Page } from '@playwright/test';
import { random } from 'lodash';

export class SubscriptonPage {
    readonly page: Page;
    readonly subscriptionRow: Locator;
    readonly infoOnBanner: Locator;
    readonly showDefaultPlan: Locator;
    readonly changeCardButton: Locator;
    readonly startedMonthlyChoosePlan: Locator;
    readonly advancedMonthlyChoosePlan: Locator;
    readonly proMonthlyChoosePlan: Locator;
    readonly enterpriseMonthlyChoosePlan: Locator;
    readonly startedYearlyChoosePlan: Locator;
    readonly advancedYearlyChoosePlan: Locator;
    readonly proYearlyChoosePlan: Locator;
    readonly enterpriseYearlyChoosePlan: Locator;
    readonly annualBilling: Locator;
    readonly notifyOnDashboard: Locator;
    // readonly notifyOnSubscriptonDetailWithCanceled: Locator;
    showCompanyName: any;
    index: any;
    amountDisccounted: any;
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
        this.startedMonthlyChoosePlan = page.getByTestId('chooseplan-starter-monthly')
        this.startedYearlyChoosePlan = page.getByTestId('chooseplan-starter-yearly');
        this.advancedMonthlyChoosePlan = page.getByTestId('chooseplan-advanced-monthly');
        this.advancedYearlyChoosePlan = page.getByTestId('chooseplan-advanced-yearly');
        this.proMonthlyChoosePlan = page.getByTestId('chooseplan-pro-monthly');
        this.proYearlyChoosePlan = page.getByTestId('chooseplan-pro-yearly');
        this.enterpriseMonthlyChoosePlan = page.getByTestId('chooseplan-enterprise-monthly');
        this.enterpriseYearlyChoosePlan = page.getByTestId('chooseplan-enterprise-yearly');
        this.annualBilling = page.getByTestId('annual-billing');
        this.notifyOnDashboard = page.locator('div.notification-banner');
        this.annualBilling = page.getByTestId('annual-billing');
        this.notifyOnDashboard = page.locator('div.notification-banner');
        this.showCompanyName = "";
        this.index = "";
        this.amountDisccounted = "";
        this.price = "";
        this.dataTestID = "";
        this.resultArray = [];
    }

    async goto() {
        await this.page.goto('/login', { timeout: 5 * 5000 })
    }

    async clickOnSubscription(companyName: string) {
        await this.subscriptionRow.filter({ hasText: companyName }).click();
    }

    async checkInfoOnBanner(companyName: string, id: any) {
        await this.page.waitForResponse(response => response.url() === `https://preprod-my.forecastrx.com/api/billing/pending-subscription/${id[1]}/${id[0]}` && response.status() === 200)       
        let info = await this.infoOnBanner.textContent();
        console.log("text: ", info);
        expect(info).toContain("You are currently enrolled in your FREE trial. This is valid until");
    }

    async checkShowCompanyName(companyName: string) {
        let showCompanyName = this.page.getByRole('heading', { name: companyName });
        console.log('showCompanyName', showCompanyName);
        await expect(showCompanyName).toBeVisible();
    }

    async checkShowDefaultPlanOnTrial(plan: string) {
        let showDefaultPlan = await this.showDefaultPlan.textContent();
        console.log("default plan: ", showDefaultPlan?.trim());
        expect(showDefaultPlan?.trim()).toEqual(plan);
    }

    async pickRandomPlanToSelect() {
        this.index = Math.floor(Math.random() * 8) + 1;
        console.log("---Index: ", this.index);
        switch(this.index) {
            case 1:
                await this.startedMonthlyChoosePlan.click();
                this.resultArray = [this.price = 99.99, this.dataTestID = 'starter-monthly']
                console.log("---Result: ", this.resultArray)
                return this.resultArray;
            case 2:
                await this.annualBilling.click();
                await this.startedYearlyChoosePlan.click();
                this.resultArray = [this.price = 999.99, this.dataTestID = 'starter-yearly']
                console.log("---Result: ", this.resultArray)
                return this.resultArray;
            case 3:
                await this.advancedMonthlyChoosePlan.click();
                this.resultArray = [this.price = 199.99, this.dataTestID = 'advanced-monthly']
                console.log("---Result: ", this.resultArray)
                return this.resultArray;
            case 4:
                await this.annualBilling.click();
                await this.advancedYearlyChoosePlan.click();
                this.resultArray = [this.price = 1999.99, this.dataTestID = 'advanced-yearly']
                console.log("---Result: ", this.resultArray)
                return this.resultArray;
            case 5:
                await this.proMonthlyChoosePlan.click();
                this.resultArray = [this.price = 299.99, this.dataTestID = 'pro-monthly']
                console.log("---Result: ", this.resultArray)
                return this.resultArray;
            case 6:
                await this.annualBilling.click();
                await this.proYearlyChoosePlan.click();
                this.resultArray = [this.price = 2999.99, this.dataTestID = 'pro-yearly']
                console.log("---Result: ", this.resultArray)
                return this.resultArray;
            case 7:
                await this.enterpriseMonthlyChoosePlan.click();
                this.resultArray = [this.price = 399.99, this.dataTestID = 'enterprise-monthly']
                console.log("---Result: ", this.resultArray)
                return this.resultArray;
            case 8:
                await this.annualBilling.click();
                await this.enterpriseYearlyChoosePlan.click();
                this.resultArray = [this.price = 3999.99, this.dataTestID = 'enterprise-yearly']
                console.log("---Result: ", this.resultArray)
                return this.resultArray;
            default:
                break;
        }
    }

    async inputBillingInforOnStripeCheckoutPage(card: string, promotionCode: string, expirationDate: string) {
        // console.log("currentKey: ", currentCompanyKey);
        // await Promise.all([
        //     this.page.waitForNavigation(/*{ url: 'https://checkout.stripe.com/pay/cs_test_b1ihOkl2mkUi0srgjuRpdEPn0aufUxkgVTox5FnlTjDBHfcWfIYpaYbAUa#fidkdWxOYHwnPyd1blpxYHZxWjVBdDU0Q1BmaEN8TXFXb3cyVWhdYzBPSScpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPydocGlxbFpscWBoJyknYGtkZ2lgVWlkZmBtamlhYHd2Jz9xd3BgeCUl' }*/),
        //     this.page.locator('button:has-text("OK")').click()
        // ]);
        await this.page.waitForTimeout(4000); 
        await this.page.getByRole('button', { name: 'OK' }).click();

        // Input valid data with all fields of the Checkout page
        await this.page.locator('[placeholder="1234 1234 1234 1234"]').fill(card);
        await this.page.locator('[placeholder="MM / YY"]').fill(expirationDate);
        await this.page.locator('#cardCvc').fill('242');
        await this.page.locator('#billingName').fill('Subcription Test');
        // Add promotion code
        await this.page.locator('#promotionCode').click();
        await this.page.locator('#promotionCode').fill(promotionCode); // disccount 20%
        await this.page.locator('button:has-text("Apply")').click();

        await this.page.waitForTimeout(4000); // wait for load data in 4s

        this.amountDisccounted = await this.page.locator('#OrderDetails-TotalAmount').textContent();
    }

    async selectTrailPlanSuccessfully(id: string) {
        let currentCompanyKey = id[2];
        console.log("amountDisccounted: ", this.amountDisccounted);
        // Create our number formatter.
        const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });

        console.log(formatter.format(1000)); /* $2,500.00 */

        expect(this.amountDisccounted).toEqual(formatter.format(this.resultArray[0] - this.resultArray[0] * 0.2));

        // Click on the Start Trial to subscribe plan
        await Promise.all([
            this.page.waitForNavigation(/*{ url: 'https://preprod-my.forecastrx.com/subscriptions/` + currentCompanyKey }*/),
            this.page.locator('button:has-text("Start Trial")').click(),,
        ]);

        this.currentPlanText = await this.page.getByTestId(this.resultArray[1] + ' current-plan').textContent();
        expect(this.currentPlanText).toContain(" CURRENT PLAN ");
    }

    async selectPlanSuccessfullyWithCanceled() {
        console.log("amountDisccounted: ", this.amountDisccounted);
        const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        });

        console.log(formatter.format(1000)); /* $2,500.00 */

        expect(this.amountDisccounted).toEqual(formatter.format(this.resultArray[0] - this.resultArray[0] * 0.2));

        // Click on the Start Trial to subscribe plan
        await Promise.all([
            this.page.waitForNavigation(/*{ url: 'https://preprod-my.forecastrx.com/subscriptions/` + currentCompanyKey }*/),
            this.page.locator('button:has-text("Subscribe")').click(),,
        ]);

        this.currentPlanText = await this.page.getByTestId(this.resultArray[1] + ' current-plan').textContent();
        expect(this.currentPlanText).toContain(" CURRENT PLAN ");
    }


    async viewCanceledSubscription(companyName: string) {
        await expect(this.subscriptionRow.filter({ hasText: companyName })).not.toBeVisible();
    }

    async checkInfoOnBannerOfCancelSubscription(company: string) {
        let notify = await this.notifyOnDashboard.textContent();
        console.log("Notify: ", notify);
        expect(notify).toEqual(" Your subscription is expired, unpaid or canceled.  Click here to manage your subscription ");
    }

    async clickLinkOnBanner() {
        await this.notifyOnDashboard.getByRole('link').click();
    }

    async checkInfoOnSubscriptionDetailWithCanceled() {
        let noti = await this.infoOnBanner.textContent();
        console.log("NOTI SD: ", noti);
        expect(noti).toEqual("Select a plan to start using ForecastRx.");
    }
 }