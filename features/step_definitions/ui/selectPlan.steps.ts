import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { HeaderComponent } from '../../../src/pages/components/header.component';
import { ToastComponent } from '../../../src/pages/components/toast.component';
import { LoginPage } from '../../../src/pages/login.page';
import '../../../src/hooks/setup-ui'
import { SubscriptionPage } from '../../../src/pages/subscription.page';
import { CreateCompanyPage } from '../../../src/pages/createCompany.page';

let loginPage: LoginPage;
let headerComponent: HeaderComponent;
let toastComponent: ToastComponent;
let subscriptionPage: SubscriptionPage;
let createNewCompany: CreateCompanyPage;

When('User clicks on Subscriptions after clicking on the user name of {} company', async function (companyName: string) {
    headerComponent = new HeaderComponent(this.page);
    this.id = await headerComponent.clickSubscriptionsLink(companyName);
    console.log("Company Name: ", companyName, this.id);
});

When('User is on Subscriptions page', async function () {
    subscriptionPage = new SubscriptionPage(this.page);
    await expect(this.page).toHaveURL(/.*subscriptions/);
});

Then('User clicks on subscription of {} company to go to subscription detail page', async function (companyName: string) {
    headerComponent = new HeaderComponent(this.page);
    await subscriptionPage.clickOnSubscription(companyName, this.id);
});

When('User checks the warning message that the trial of {} will be canceled', async function (companyName: string) {
    await subscriptionPage.checkInfoOnBanner(companyName, this.id);
});

When('User checks show {} company on header', async function (companyName: string) {
    await subscriptionPage.checkShowCompanyName(companyName);
});

When('User checks show default plan is {} with {} status', async function (plan: string, status: string) {
    await subscriptionPage.checkDefaultPlanOnTrial(plan, status);
});

Then('User clicks on any plan to select', async function () {
    await subscriptionPage.pickRandomPlanToSelect();
});

When('User navigates to checkout page and input valid data in all fields {}, {}, {}', async function (card: string, promotionCodeid: string, expirationDate: string) {
    await subscriptionPage.inputBillingInforOnStripeCheckoutPage(card, promotionCodeid,expirationDate);
});

When('Verify user has been discounted with promotion code is {} percent and the plan has been highlighted with Current Plan after clicking on {} button', async function (promotionCodeValue: any, buttonName: string) {
    await subscriptionPage.verifyPromotionCodeAndCurrentPlan(promotionCodeValue, buttonName, this.id);
});

When('User check that {} of canceled comapny should not show on Subscription list', async function (companyName: string) {
    await subscriptionPage.viewCanceledSubscription(companyName);
});

When('User checks warning message that the subscription is canceled in Subscription List', async function () {
    await subscriptionPage.checkWarningMessageOfCanceledSubscription();
});

When('User clicks on link in banner to navigate to Subscription Detail page', async function () {
   await subscriptionPage.clickLinkOnBanner(); 
});

When('User checks warning message that Select a plan', async function () {
    await subscriptionPage.checkWaringMessageThatSelectAPlan();
});
