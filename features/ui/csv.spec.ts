import { test, expect } from '@playwright/test';

test.skip('homepage has Playwright in title and get started link linking to the intro page', async ({ page }) => {
  // Go to https://preprod-my.forecastrx.com/
  await page.goto('https://preprod-my.forecastrx.com/');
  // Go to https://preprod-my.forecastrx.com/account/signin
  await page.goto('https://preprod-my.forecastrx.com/account/signin');
  // Click [data-testid="email-input"]
  await page.locator('[data-testid="email-input"]').click();
  // Fill [data-testid="email-input"]
  await page.locator('[data-testid="email-input"]').fill('testautoforecast@gmail.com');
  // Click [data-testid="password-input"]
  await page.locator('[data-testid="password-input"]').click();
  // Fill [data-testid="password-input"]
  await page.locator('[data-testid="password-input"]').fill('Test1111#');
  // Click [data-testid="sign-in-btn"]
  await page.locator('[data-testid="sign-in-btn"]').click();
  await expect(page).toHaveURL('https://preprod-my.forecastrx.com/dashboard/home');
  // Click a:has-text("Manage Company")
  await page.locator('a:has-text("Manage Company")').click();
  // Click #nav-ps-gradient-able >> text=Suppliers
  await page.locator('#nav-ps-gradient-able >> text=Suppliers').click();
  await expect(page).toHaveURL('https://preprod-my.forecastrx.com/dashboard/manage/suppliers');
  await page.waitForTimeout(5000);
  // Click a[role="button"]:has-text("Fishers Finery Amazon")
  await page.locator('a[id="resourcesDropdown"]').click();
  // Click text=amz-ca-for-AUTOMATION (CA)
  await page.locator('text=amz-ca-for-AUTOMATION (CA)').click();
  await page.waitForTimeout(5000);
  // Click text=Bulk Management
  await page.locator('text=Bulk Management').click();
  await page.waitForTimeout(2000);
  // Click text=Upload Data
  await page.locator('text=Upload Data').click();
  await page.waitForTimeout(2000);
  // Click div[role="document"] div:has-text("Import") >> nth=4
  await page.locator('div[role="document"] div:has-text("Import")').nth(4).click();
  // Click text=Please select one of the following options:Update Existing EntriesCreate New Ent >> div >> nth=1
  await page.locator('text=Please select one of the following options:Update Existing EntriesCreate New Ent >> div').nth(1).click();
  // Check input[name="isNew"] >> nth=1
  await page.locator('input[name="isNew"]').nth(1).check();
  // Click button:has-text("Import")
  await page.locator('button:has-text("Import")').click();
  // Click text=Drop files here or click to upload CSV, XLSX or XLS files accepted
  // await page.frameLocator('iframe').nth(4).locator('text=Drop files here or click to upload CSV, XLSX or XLS files accepted').click();
  // Upload supplier-template.csv
  // await page.frameLocator('iframe').nth(4).locator('button:has-text("Import")').setInputFiles('supplier-template.csv');
  const [fileChooser] = await Promise.all([
    // It is important to call waitForEvent before click to set up waiting.
    page.waitForEvent('filechooser'),
    // Opens the file chooser.
    page.frameLocator('iframe').nth(4).locator('text=Drop files here or click to upload CSV, XLSX or XLS files accepted').click()
  ])
  await page.waitForTimeout(5000);
  await fileChooser.setFiles([
    'src/data/supplier-template.csv'
  ])
  await page.waitForTimeout(5000);
  // Click #direction-buttons >> text=Next
  await page.frameLocator('iframe').nth(4).locator('#direction-buttons >> text=Next').click();
  await page.waitForTimeout(2000);
  // Click #direction-buttons >> text=Next
  await page.frameLocator('iframe').nth(4).locator('#direction-buttons >> text=Next').click();
  await page.waitForTimeout(2000);
  await page.frameLocator('iframe').nth(4).locator('#direction-buttons >> text=Submit').click();
  // Click text=Processing Data (1/2)
  await page.frameLocator('iframe').nth(4).locator('text=Processing Data (1/2)').click();
  // Click text=Upload file successfully
  await page.locator('text=Upload file successfully').click();
  // Click button:has-text("OK")
  await page.locator('button:has-text("OK")').click();
});
