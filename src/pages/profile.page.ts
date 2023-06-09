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
    this.emailTextbox = page.getByTestId('email-input');
    this.displayNameTextbox = page.getByTestId('display-name-input');
    this.currentPasswordTextbox = page.locator('#password');
    this.newPasswordTextbox = page.locator('#newPassword');
    this.confirmNewPasswordTextbox = page.locator('#confirmPassword');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.newPasswordError = page.getByTestId('password-strength-error-message');
    this.confirmNewPasswordError = page.getByTestId('password-matching-error-message');
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
