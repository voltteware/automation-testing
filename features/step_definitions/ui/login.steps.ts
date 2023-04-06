import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { HeaderComponent } from '../../../src/pages/components/header.component';
import { LoginPage } from '../../../src/pages/login.page';
import '../../../src/hooks/setup-ui';

let loginPage: LoginPage;
let headerComponent: HeaderComponent;

Given('User is on Login page', { timeout: 5 * 60000 }, async function () {
  loginPage = new LoginPage(this.page)
  await this.page.goto('/account/signin', { timeout: 5 * 60000 });
});

When('User enters the username {string} and the password {string}', { timeout: 10 * 5000 }, async function (email: string, password: string) {
  await loginPage.enterEmail(email)
  await loginPage.enterPassword(password)
});

When('User signs in with valid username {string} and the password {string} successfully', { timeout: 60000 }, async function (email: string, password: string) {
  await loginPage.enterEmail(email)
  await loginPage.enterPassword(password)
  await loginPage.clickButtonSignIn()
  await this.page.waitForLoadState();
  await expect(this.page.getByRole('link', { name: this.id })).toBeVisible( { timeout: 30000 });
});

Then('User clicks SignIn button', { timeout: 5 * 5000 }, async function () {
  await loginPage.clickButtonSignIn()
});

Then('Verify the username is displayed', { timeout: 5 * 5000 }, async function () {
  await this.page.waitForLoadState();
  await expect(this.page.getByRole('link', { name: this.id })).toBeVisible();
});

Then('Verify alert {string} is displayed', { timeout: 3 * 5000 }, async function (alertMessage: string) {
  await loginPage.checkAlertMessage(alertMessage);
});

Then('Verify errors {string} {string} are displayed', { timeout: 3 * 5000 }, async function (errorEmail: string, errorPassword: string) {
  if (errorEmail !== "") {
    await loginPage.checkErrorEmail(errorEmail);
  }
  if (errorPassword !== "") {
    await loginPage.checkErrorPassword(errorPassword);
  }
});
