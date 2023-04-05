import { After, AfterAll, AfterStep, Before, BeforeAll, BeforeStep, ITestCaseHookParameter, ITestStepHookParameter } from "@cucumber/cucumber";
import logger from '../Logger/logger';
import { ActionWords } from "../utils/actionwords";
import { setParallelCanAssign, parallelCanAssignHelpers } from '@cucumber/cucumber'

const { atMostOnePicklePerTag } = parallelCanAssignHelpers;
const myTagRule = atMostOnePicklePerTag(['@api-createBom', '@api-createItem', '@api-createSupplier', '@api-createSupply', '@api-edit-purchasing-daily-sale-rate-rules-average']);

setParallelCanAssign(function (pickleInQuestion, picklesInProgress) {
    return (
        myTagRule(pickleInQuestion, picklesInProgress)
    )
})

let actionwords: ActionWords = new ActionWords()

Before({ tags: "@test-api or @test-api-extra" }, async function (scenario: ITestCaseHookParameter) {
    // Only one pickle with @tag1 can run at a time
    // AND only one pickle with @tag2 can run at a time
    setParallelCanAssign(myTagRule)
    logger.log('info', '==============' + scenario.pickle.name + '==============')
    this.request = await actionwords.createRequestContext()
});

After({ tags: "@test-api or @test-api-extra" }, async function (scenario: ITestCaseHookParameter) {
    logger.log(scenario.result?.status == 'PASSED' ? 'info' : 'error', scenario.result?.status + '\n')
    await actionwords.storeLogFile()
});

BeforeStep({ tags: "@test-api or @test-api-extra" }, async function (testStep: ITestStepHookParameter) {
    logger.log('info', testStep.pickleStep.text)
})

AfterStep({ tags: "@test-api or @test-api-extra" }, async function (testStep: ITestStepHookParameter) {
    let statusOfStep = testStep.result.status
    if (statusOfStep == 'PASSED') {

    } else {
        logger.log('error', testStep.result.message?.toString())
    }
})