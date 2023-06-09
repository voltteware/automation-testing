import { After, AfterStep, Before, BeforeStep, ITestCaseHookParameter, ITestStepHookParameter } from "@cucumber/cucumber";
import logger from '../Logger/logger';
import { ActionWords } from "../utils/actionwords";
import { setParallelCanAssign, parallelCanAssignHelpers } from '@cucumber/cucumber'

const { atMostOnePicklePerTag } = parallelCanAssignHelpers;
const myTagRule = atMostOnePicklePerTag(['@api-createBom', '@api-createItem', '@api-createSupplier', '@api-createSupply', '@api-change-password', '@api-overrideValue', '@api-editItemHistory', '@api-get-item-summary', '@api-purchasing-custom', '@api-purchasing-mySuggested', '@restock-calculation', '@api-lock-unlock','@check-update-item-level','@run-forecast', '@api-backfill-value', '@csvCompanies-demand']);

setParallelCanAssign(function (pickleInQuestion, picklesInProgress) {
    return (
        myTagRule(pickleInQuestion, picklesInProgress)
    )
})

let actionwords: ActionWords = new ActionWords()
export let currentTestCaseIDApi: string;

Before({ tags: "@test-api or @test-api-extra" }, async function (scenario: ITestCaseHookParameter) {
    currentTestCaseIDApi = scenario.pickle.name.split('-')[0].trim();
    // Only one pickle with @tag1 can run at a time
    // And only one pickle with @tag2 can run at a time
    setParallelCanAssign(myTagRule)
    logger.log('info', '==============' + scenario.pickle.name + '==============')
    this.request = await actionwords.createRequestContext()
});

After({ tags: "@test-api or @test-api-extra" }, async function (scenario: ITestCaseHookParameter) {
    logger.log(scenario.result?.status == 'PASSED' ? 'info' : 'error', scenario.result?.status + '\n')
    await actionwords.storeLogFile()
});

BeforeStep({ tags: "@test-api or @test-api-extra" }, async function (testStep: ITestStepHookParameter) {
    currentTestCaseIDApi = testStep.pickle.name.split('-')[0].trim();   
    this.countErrors = 0;
    logger.log('info', testStep.pickleStep.text)     
})

AfterStep({ tags: "@test-api or @test-api-extra" }, async function (testStep: ITestStepHookParameter) {
    let statusOfStep = testStep.result.status
    if (statusOfStep == 'PASSED') {

    } else {
        logger.log('error', testStep.result.message?.toString())
    }
})