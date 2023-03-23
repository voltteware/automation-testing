import { After, AfterAll, AfterStep, Before, BeforeAll, BeforeStep, ITestCaseHookParameter, ITestStepHookParameter } from "@cucumber/cucumber";
import logger from '../Logger/logger';
import { ActionWords } from "../utils/actionwords";
import { setParallelCanAssign, parallelCanAssignHelpers } from '@cucumber/cucumber'

const { atMostOnePicklePerTag } = parallelCanAssignHelpers;
const myTagRule = atMostOnePicklePerTag(['@api-createBom', '@api-createItem', '@api-createSupplier', '@api-createSupply']);

setParallelCanAssign(function (pickleInQuestion, picklesInProgress) {
    return (
        myTagRule(pickleInQuestion, picklesInProgress)
    )
})

let actionwords: ActionWords = new ActionWords()

Before('@test-api', async function (scenario: ITestCaseHookParameter) {
    // Only one pickle with @tag1 can run at a time
    // AND only one pickle with @tag2 can run at a time
    setParallelCanAssign(myTagRule)
    logger.log('info', '==============' + scenario.pickle.name + '==============')
    this.request = await actionwords.createRequestContext()
});

After('@test-api', async function (scenario: ITestCaseHookParameter) {
    logger.log(scenario.result?.status == 'PASSED' ? 'info' : 'error', scenario.result?.status + '\n')
    await actionwords.storeLogFile()
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