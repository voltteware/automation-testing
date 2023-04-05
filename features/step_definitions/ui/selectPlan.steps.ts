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

When('User clicks username on top right', async function () {
    headerComponent = new HeaderComponent(this.page);
    await headerComponent.clickUserNameOnTheTopRightCorner();
});

When('User clicks on Subscriptions option of {}', async function (companyName: string) {
    headerComponent = new HeaderComponent(this.page);
    this.id = await headerComponent.clickSubscriptionsLink(companyName);
});

When('User is on Subscriptions page', async function () {
    await expect(this.page).toHaveURL(/.*subscriptions/);
    subscriptionPage = new SubscriptonPage(this.page);
});

Then('User clicks on subscription of {string} company', async function (companyName: string) {
    await subscriptionPage.clickOnSubscription(companyName);
});

When('User checks info on the banner correctly with {} company', async function (companyName: string) {
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

When('User navigates to checkout page and input valid data in all fields {}, {}, {}', async function (card: string, promotionCode: string, expirationDate: string) {
    await subscriptionPage.inputBillingInforOnStripeCheckoutPage(card, promotionCode,expirationDate);
});

When('User select plan successfully', async function () {
    await subscriptionPage.selectTrailPlanSuccessfully(this.id);
});

When('User checks subscription of {} invisible on Subscription List', async function (companyName: string) {
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

When('User select plan successfully with Canceled status', async function () {
    await subscriptionPage.selectPlanSuccessfullyWithCanceled();
});