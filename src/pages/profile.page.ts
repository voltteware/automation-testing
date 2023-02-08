import { expect, Locator, Page } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  readonly emailTextbox: Locator;
  readonly displayNameTextbox: Locator;
  readonly currentPasswordTextbox: Locator;
  readonly newPasswordTextbox: Locator;
  readonly confirmNewPasswordTextbox: Locator;
  readonly submitButton: Locator;
  readonly newPasswordError: Locator;
  readonly confirmNewPasswordError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailTextbox = page.getByLabel('Email');
    this.displayNameTextbox = page.getByLabel('Display Name');
    this.currentPasswordTextbox = page.locator('#password');
    this.newPasswordTextbox = page.getByLabel('New Password', { exact: true });
    this.confirmNewPasswordTextbox = page.getByLabel('Confirm New Password', { exact: true });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.newPasswordError = page.locator('label[for="newPassword"] ~.alert');
    this.confirmNewPasswordError = page.locator('label[for="confirmPassword"] ~.alert');
  }

  async enterCurrentPassword(password: string) {
    await this.currentPasswordTextbox.fill("");
    await this.currentPasswordTextbox.fill(password);
  }

  async enterNewPassword(password: string) {
    await this.newPasswordTextbox.fill("");
    await this.newPasswordTextbox.fill(password);
  }

  async enterConfirmNewPassword(password: string) {
    await this.confirmNewPasswordTextbox.fill("");
    await this.confirmNewPasswordTextbox.fill(password);
  }

  async clickSubmit() {
    const requestPromise = this.page.waitForRequest(/.*password/);
    await this.submitButton.click();
    const request = await requestPromise;
    expect(request.response().then(res => res?.ok))
  }

  async checkNewPasswordFormatError() {
    await expect(this.newPasswordError.first()).toContainText("Password must contain the following: contain between 8- 50 characters contain at");
    const expectedPasswordFormatDetailsError = (await this.newPasswordError.first().locator('ul > li').allInnerTexts());
    expect(expectedPasswordFormatDetailsError).toStrictEqual([
      'contain between 8- 50 characters',
      'contain at least 1 number',
      'contain at least 1 special character',
      'contain at least 1 lowercase character (a-z)',
      'contain at least 1 uppercase character (A-Z)'
    ]);
  }

  async checkConfirmPasswordNotMatchError() {
    await expect(this.confirmNewPasswordError).toHaveText("Passwords do not match.");
  }
}
