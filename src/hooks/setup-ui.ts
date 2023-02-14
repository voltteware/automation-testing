import { After, AfterAll, AfterStep, Before, BeforeAll, ITestCaseHookParameter, ITestStepHookParameter } from "@cucumber/cucumber";
import { Browser } from "@playwright/test";
import { ActionWords } from '../../src/utils/actionwords';
import logger from '../../src/Logger/logger';
import { config } from '../../config';

let globalWithBrowser = global as typeof globalThis & { browser: Browser }
let actionwords: ActionWords = new ActionWords();
let timestamp: string

// BeforeAll(async function () {
//     await actionwords.createBrowser(globalWithBrowser)
// });

// AfterAll(async function () {
//     await actionwords.closeBrowser(globalWithBrowser)
//     await actionwords.storeLogFile()
// });

Before('@test-ui', async function (scenario: ITestCaseHookParameter) {
    await actionwords.createBrowser(globalWithBrowser);
    timestamp = actionwords.formatDate(new Date())
    logger.log('info', '============================' + scenario.pickle.name + '============================')

    this.context = await actionwords.createNewContext(globalWithBrowser, scenario)
    this.page = await actionwords.createNewPage(this.context)

    await this.page.on('console', async (msg: any) => {
        if (msg.type() == "error") {
            logger.log('error', 'Console Error Log: ' + msg.text())
        }
    })
});

After('@test-ui', async function (scenario: ITestCaseHookParameter) {
    await actionwords.closePage(this.context, this.page)
    await actionwords.recordVideos(this.page, scenario)

    logger.log(scenario.result?.status == 'PASSED' ? 'info' : 'error', scenario.result?.status)
    await actionwords.closeBrowser(globalWithBrowser)
    await actionwords.storeLogFile()
});

AfterStep('@test-ui', async function (testStep: ITestStepHookParameter) {
    let statusOfStep = testStep.result.status

    if (statusOfStep == 'PASSED') {
        logger.log('info', testStep.pickleStep.text)
    } else {
        logger.log('error', testStep.result.message?.toString())
    }

    switch (config.screenshot) {
        case 'only-on-failure':
            if (statusOfStep == 'FAILED') {
                const buffer: Buffer = await this.page.screenshot()
                this.attach(buffer.toString('base64'), 'image/png')
                await actionwords.captureScreenshots(this.page, testStep, timestamp)
            }
            break;
        case 'on':
            const buffer: Buffer = await this.page.screenshot()
            this.attach(buffer.toString('base64'), 'image/png')
            await actionwords.captureScreenshots(this.page, testStep, timestamp)
            break;
        default:
            break;
    }

    await this.page.on('console', async (msg: any) => {
        if (msg.type() == "error") {
            logger.log('error', 'Console Error Log: ' + msg.text())
        }
    })
})

