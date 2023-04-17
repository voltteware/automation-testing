import { expect, Locator, Page } from "@playwright/test";
import { config } from '../../playwright.config'

export class LoginPage {
    readonly page: Page
    readonly emailTextbox: Locator
    readonly passwordTextbox: Locator
    readonly signInButton: Locator
    readonly alertLocator: Locator
    readonly requiredPasswordLocator: Locator
    readonly requiredEmailLocator: Locator

    constructor(page: Page) {
        this.page = page
        this.emailTextbox = page.locator('#email')
        this.passwordTextbox = page.locator('#password')
        this.signInButton = page.locator('button', { hasText: 'Sign In' })
        this.alertLocator = page.locator('.text-danger')
        this.requiredPasswordLocator = page.locator('input#password + .error')
        this.requiredEmailLocator = page.locator('input#email + .error')
    }

    async goto() {
        await this.page.goto('/login', { timeout: 5 * 5000 })
    }

    async enterEmail(email: string) {
        await this.emailTextbox.click()
        await this.emailTextbox.fill(email)
        await this.emailTextbox.blur();
    }

    async enterPassword(password: string) {
        await this.passwordTextbox.click();
        await this.passwordTextbox.fill(password);
        await this.passwordTextbox.blur();
    }

    async clickButtonSignIn() {
        await this.signInButton.click()
    }

    async checkAlertMessage(message: string) {
        await expect(this.alertLocator).toBeVisible();
        await expect(this.alertLocator).toContainText(message);
    }

    async checkErrorEmail(message: string) {
        await expect(this.requiredEmailLocator).toBeVisible();
        await expect(this.requiredEmailLocator).toContainText(message);
    }

    async checkErrorPassword(message: string) {
        await expect(this.requiredPasswordLocator).toBeVisible();
        await expect(this.requiredPasswordLocator).toContainText(message);
    }

    async waitForNavigateToDashboard() {
        try {
            await this.page.waitForNavigation({ url: config.BASE_URL + '/app/user/dashboard', timeout: 5 * 5000 })
        } catch (ex) {
            console.log(ex);
        }
    }

    async loginSuccessful() {
        expect(this.page.url()).toContain('/app/user/dashboard')
    }

    async checkLoginFailed(expectedMessage: string, locator: Locator) {
        let actual: string = ''
        try {
            actual = <string>await locator.textContent({ timeout: 2 * 5000 });
        } catch (err) {
            console.log(err);
        }
        actual = actual.trim()
        expect(actual).toEqual(expectedMessage);
    }
}