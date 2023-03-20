import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { HeaderComponent } from '../../../src/pages/components/header.component';
import { ToastComponent } from '../../../src/pages/components/toast.component';
import { LoginPage } from '../../../src/pages/login.page';
import '../../../src/hooks/setup-ui'
import { SubscriptonPage } from '../../../src/pages/subscription.page';

let loginPage: LoginPage;
let headerComponent: HeaderComponent;
let toastComponent: ToastComponent;
let subscriptionPage: SubscriptonPage;

When('User creates a new company to test subscription', async function () {
    headerComponent = new HeaderComponent(this.page);
    await headerComponent.navigateToCreateCompanyPage();
    subscriptionPage = new SubscriptonPage(this.page);
    await subscriptionPage.createNewCompany();
});

When('User clicks username on top right', async function () {
    headerComponent = new HeaderComponent(this.page);
    await headerComponent.clickUserNameOnTheTopRightCorner();
});

When('User clicks on Subscriptions option', async function () {
    await headerComponent.clickSubscriptionsLink();
});

When('User is on Subscriptions page', async function () {
    await expect(this.page).toHaveURL(/.*subscriptions/);
    subscriptionPage = new SubscriptonPage(this.page);
});

Then('User clicks on subscription to navigate to subscription detail page', async function () {
    await subscriptionPage.navigateToSubscriptionDetailsPage();
});

Then('User clicks on any plan to select', async function () {
    await subscriptionPage.pickRandomPlantoSelect();
});

When('User navigates to checkout page and input valid data in all fields', async function () {
    await subscriptionPage.subscribePlan();
});

Then('User deletes the company that has just created', async function () {
    await subscriptionPage.deleteCompanyThatJustCreated();
});