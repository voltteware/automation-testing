import { LaunchOptions } from "@playwright/test";
require('dotenv').config();
const browserOptions: LaunchOptions = {
    slowMo: 100,
    headless: false,
}
export const config = {
    browser: 'chromium' || 'firefox' || 'webkit',
    video: 'retain-on-failure' || 'on' || 'off',
    screenshot: 'only-on-failure' || 'on' || 'off',
    browserOptions,
    BASE_URL: process.env.BASE_URL,
}
var {setDefaultTimeout} = require('@cucumber/cucumber');

setDefaultTimeout(60 * 1000);
