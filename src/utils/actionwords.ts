import { ITestCaseHookParameter, ITestStepHookParameter } from "@cucumber/cucumber";
import { Browser, BrowserContext, chromium, firefox, Page, request, webkit } from "@playwright/test";
import { existsSync, readdir, rename, rmSync } from "node:fs";
import { config } from "../../config";

export class ActionWords {
    timestamp = this.formatDate(new Date())

    async createBrowser(globalWithBrowser: typeof globalThis & { browser: Browser; }) {
        switch (config.browser) {
            case 'firefox':
                globalWithBrowser.browser = await firefox.launch(config.browserOptions);
                break
            case 'webkit':
                globalWithBrowser.browser = await webkit.launch(config.browserOptions);
                break
            default:
                globalWithBrowser.browser = await chromium.launch(config.browserOptions);
                break
        }
    }

    async closeBrowser(globalWithBrowser: typeof globalThis & { browser: Browser; }) {
        await globalWithBrowser.browser?.close();
    }

    async createNewContext(globalWithBrowser: typeof globalThis & { browser: Browser; }, scenario: ITestCaseHookParameter) {
        return await globalWithBrowser.browser.newContext({
            baseURL: config.BASE_URL,
            ignoreHTTPSErrors: true,
            locale: 'en-US',
            recordVideo: {
                dir: './videos/' + scenario.gherkinDocument.feature?.name + this.timestamp + '/'
            }
        });
    }

    async createNewPage(context: BrowserContext) {
        return await context.newPage();
    }

    async closePage(context: BrowserContext, page: Page) {
        await page.close();
        await context.close();
    }


    async createRequestContext() {
        return await request.newContext({
            baseURL: config.BASE_URL,
            ignoreHTTPSErrors: true
        })
    }
    padTo2Digits(num: number) {
        return num.toString().padStart(2, '0');
    }
    formatDate(date: Date) {
        return (
            [
                date.getFullYear(),
                this.padTo2Digits(date.getMonth() + 1),
                this.padTo2Digits(date.getDate()),
            ].join('') +
            '_' +
            [
                this.padTo2Digits(date.getHours()),
                this.padTo2Digits(date.getMinutes()),
                this.padTo2Digits(date.getSeconds()),
            ].join('')
        );
    }
    async storeLogFile() {
        if (existsSync('logs/log_file.log')) {
            rename('logs/log_file.log', 'logs/log_file_' + this.timestamp + '.log', (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    }

    async captureScreenshots(page: Page, testStep: ITestStepHookParameter, timestamp: string) {
        const imgageName = testStep.pickleStep.text.replaceAll('"', '').replaceAll('<','').replaceAll('>','')
        await page.screenshot({ path: 'screenshots/' + testStep.gherkinDocument.feature?.name + this.timestamp + '/' + testStep.pickle.name + timestamp + '/' + imgageName + '.png' })
    }
    
    async recordVideos(page: Page, scenario: ITestCaseHookParameter) {
        let timestamp: string = await this.formatDate(new Date())
        let statusOfScenario = scenario.result?.status
        let pathOfVideo = <string>await page.video()?.path();
        let dirFeatureName = scenario.gherkinDocument.feature?.name + (this.timestamp)
        switch (config.video) {
            case 'off':
                rmSync('videos/' + dirFeatureName + '/', { recursive: true })
                break
            case 'retain-on-failure':
                if (statusOfScenario == 'PASSED') {
                    rmSync(pathOfVideo, { recursive: true })
                    readdir('videos/' + dirFeatureName, function (err, data) {
                        if (data.length == 0) {
                            rmSync('videos/' + dirFeatureName, { recursive: true })
                        }
                    })
                } else {
                    rename(pathOfVideo, './videos/' + dirFeatureName + '/' + scenario.pickle.name + timestamp + '.mp4', (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
                break
            default:
                rename(pathOfVideo, './videos/' + dirFeatureName + '/' + scenario.pickle.name + timestamp + '.mp4', (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                break;
        }
    }
}