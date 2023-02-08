import { When, Then, Given, DataTable } from '@cucumber/cucumber';
import { expect, Page } from '@playwright/test';
import { HeaderComponent } from '../../../src/pages/components/header.component';
import { ToastComponent } from '../../../src/pages/components/toast.component';
import { LoginPage } from '../../../src/pages/login.page';
import { ProfilePage } from '../../../src/pages/profile.page';
import { format } from 'date-fns'
import { faker } from '@faker-js/faker';
import logger from '../../../src/Logger/logger';
import '../../../src/hooks/setup-ui'

let loginPage: LoginPage;
let headerComponent: HeaderComponent;
let toastComponent: ToastComponent;
let profilePage: ProfilePage;

When('User logins with valid username and password', { timeout: 10 * 5000 }, async function (dataTable: DataTable) {
    var username: string = dataTable.hashes()[0].username
    var password: string = dataTable.hashes()[0].password
    await loginPage.enterEmail(username)
    await loginPage.enterPassword(password)
    await loginPage.clickButtonSignIn()
});

When('User clicks username on top right corner', async function () {
    headerComponent = new HeaderComponent(this.page);
    await headerComponent.clickUserNameOnTheTopRightCorner()
});

When('User clicks on Profile option', async function () {
    await headerComponent.clickProfileLink();
});

When('User is on Profile page', async function () {
    await expect(this.page).toHaveURL(/.*profile/);
    profilePage = new ProfilePage(this.page);
});

Then('Check Email field is disabled and shows correct value', async function () {
    await expect(profilePage.emailTextbox).not.toBeEditable();
    console.log(`Expected email: `, JSON.parse(headerComponent.userInfoJSON).model[0].userId);

    await expect(profilePage.emailTextbox).toHaveValue(JSON.parse(headerComponent.userInfoJSON).model[0].userId)
});

Then('Check Display Name field is disabled and shows correct value', async function () {
    await expect(profilePage.displayNameTextbox).not.toBeEditable();
    console.log(`Expected display name: `, JSON.parse(headerComponent.userInfoJSON).model[0].displayName);
    await expect(profilePage.displayNameTextbox).toHaveValue(JSON.parse(headerComponent.userInfoJSON).model[0].displayName)
});

Then('User enters current password {string}', async function (oldpassword: string) {
    console.log('Current password is: ', oldpassword)
    await profilePage.enterCurrentPassword(oldpassword);
});

Then('User enters new password {string}', async function (newpassword: string) {
    await profilePage.enterNewPassword(newpassword);
});

Then('User enters confirm new password {string}', async function (newpassword: string) {
    await profilePage.enterConfirmNewPassword(newpassword);
});

Then('User clicks Submit button then check toast {string} displayed', async function (message: string) {
    toastComponent = new ToastComponent(this.page)
    await profilePage.clickSubmit();
    await toastComponent.checkToastMessage(message);
});

Then('Check new password format error', async function () {
    await profilePage.checkNewPasswordFormatError();
});

Then('Check confirm new password does not match', async function () {
    await profilePage.checkConfirmPasswordNotMatchError();
});

Then('Submit button should be disabled', async function () {
    await expect(profilePage.submitButton).toBeDisabled()
});