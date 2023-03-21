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
setDefaultTimeout(60 * 1000);

export default defineConfig({
    //By default, test files are run in parallel. Tests in a single file are run in order, in the same worker process.
    fullyParallel: true,
});
