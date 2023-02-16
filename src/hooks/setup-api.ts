import { After, AfterAll, AfterStep, Before, BeforeAll, BeforeStep, ITestCaseHookParameter, ITestStepHookParameter } from "@cucumber/cucumber";
import logger from '../Logger/logger';
import { ActionWords } from "../utils/actionwords";

let actionwords: ActionWords = new ActionWords()

Before('@test-api', async function (scenario: ITestCaseHookParameter) {
    logger.log('info', '==============' + scenario.pickle.name + '==============')
    this.request = await actionwords.createRequestContext() 
});

After('@test-api', async function (scenario: ITestCaseHookParameter) {
    logger.log(scenario.result?.status == 'PASSED' ? 'info' : 'error', scenario.result?.status + '\n')
});

BeforeStep('@test-api', async function (testStep: ITestStepHookParameter) {
    logger.log('info', testStep.pickleStep.text)
})

AfterStep('@test-api', async function (testStep: ITestStepHookParameter) {
    let statusOfStep = testStep.result.status
    if (statusOfStep == 'PASSED') {

    } else {
        logger.log('error', testStep.result.message?.toString())
    }
})