import { LaunchOptions } from "@playwright/test";
import { defineConfig } from '@playwright/test';

require('dotenv').config();
const browserOptions: LaunchOptions = {
    slowMo: 100,
    headless: true,
}

export const config = {
    browser: 'chromium' || 'firefox' || 'webkit',
    video: 'retain-on-failure' || 'on' || 'off',
    screenshot: 'only-on-failure' || 'on' || 'off',
    browserOptions,
    BASE_URL: process.env.BASE_URL,
}
var { setDefaultTimeout } = require('@cucumber/cucumber');
setDefaultTimeout(90 * 1000);
