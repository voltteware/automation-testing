import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { HeaderComponent } from '../../../src/pages/components/header.component';
import { ToastComponent } from '../../../src/pages/components/toast.component';
import { LoginPage } from '../../../src/pages/login.page';
import '../../../src/hooks/setup-ui'
import { SubscriptonPage } from '../../../src/pages/subscription.page';
import { CreateCompanyPage } from '../../../src/pages/createCompany.page';

let loginPage: LoginPage;
let headerComponent: HeaderComponent;
let toastComponent: ToastComponent;
let subscriptionPage: SubscriptonPage;
let createNewCompany: CreateCompanyPage;

When('User clicks on Subscriptions', async function () {
    headerComponent = new HeaderComponent(this.page);
    this.id = await headerComponent.clickSubscriptionsLink(this.companyName);
});

When('User is on Subscriptions page', async function () {
    subscriptionPage = new SubscriptonPage(this.page);
    await expect(this.page).toHaveURL(/.*subscriptions/);
});

Then('User clicks on subscription of {} company to go to subscription detail page', async function (companyName: string) {
    await subscriptionPage.clickOnSubscription(this.id);
});

When('User checks the warning message that the trial of {} will be canceled', async function (companyName: string) {
    await subscriptionPage.checkInfoOnBanner(companyName, this.id);
});

When('User checks show {} company on header', async function (companyName: string) {
    await subscriptionPage.checkShowCompanyName(companyName);
});

When('User checks show default plan is {} on trialing mode', async function (plan: string) {
    await subscriptionPage.checkShowDefaultPlanOnTrial(plan);
});

Then('User clicks on any plan to select', async function () {
    await subscriptionPage.pickRandomPlanToSelect();
});

When('User navigates to checkout page and input valid data in all fields {}, {}, {}', async function (card: string, promotionCodeid: string, expirationDate: string) {
    await subscriptionPage.inputBillingInforOnStripeCheckoutPage(card, promotionCodeid,expirationDate);
});

When('Verify user has been discounted with promotion code is {} percent and the plan has been highlighted with Current Plan', async function (promotionCodeValue: any) {
    await subscriptionPage.verifyPromotionCodeAndCurrentPlan(promotionCodeValue, this.id);
});

When('User check that {} of canceled comapny should not show on Subscription list', async function (companyName: string) {
    await subscriptionPage.viewCanceledSubscription(companyName);
});

When('User checks info of banner on Dashboard when switching to {}', async function (companyName: string) {
    await subscriptionPage.checkInfoOnBannerOfCancelSubscription(companyName);
});

When('User clicks on link in banner to navigate to Subscription Detail page', async function () {
   await subscriptionPage.clickLinkOnBanner(); 
});

When('User checks info on the banner correctly with Canceled status', async function () {
    await subscriptionPage.checkInfoOnSubscriptionDetailWithCanceled();
});
