import { DataTable, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import * as authenticateRequest from '../../../../src/api/request/authentication.service';
import logger from "../../../../src/Logger/logger";
import * as users from '../../../../src/data/users.json';
import { Links } from "../../../../src/utils/links";
import * as _ from "lodash";

// Get Valid Token 
Then('{} has valid connect.sid of {} after send a POST request with payload as email: {string} and password: {string}', async function (name, user: string, email: string, password: string) {
    const payload = {
        username: email,
        password: password,
    }
    var response = await authenticateRequest.sendPOSTAuthenticatieRequest(Links.API_LOGIN, payload);
    expect(response.status()).toBe(201);

    const responseHeaders = response.headers();
    this.cookie = responseHeaders['set-cookie'];
    console.log('Cookie----------', this.cookie)
    this.responseBody = JSON.parse(await response.text())
    // logger.log('info', 'Response Body:\n' + JSON.stringify(this.responseBody, undefined, 4))
    // this.attach(JSON.stringify(this.responseBody, undefined, 4))
    this.authenticateResponseBody = this.responseBody
})

Then('user sends a POST login request to get valid cookie with role', async function (dataTable: DataTable) {
    var role: string = dataTable.hashes()[0].role
    var username: string = dataTable.hashes()[0].username
    var password: string = dataTable.hashes()[0].password

    const payload = {
        username: username,
        password: password,
    }
    var response = await authenticateRequest.sendPOSTAuthenticatieRequest(Links.API_LOGIN, payload);
    expect(response.status()).toBe(201);

    const responseHeaders = response.headers();
    this.cookie = responseHeaders['set-cookie'];
    console.log('Cookie----------', this.cookie)
    this.responseBody = JSON.parse(await response.text())
    //logger.log('info', 'Response Body:\n' + JSON.stringify(this.responseBody, undefined, 4))
    //this.attach(JSON.stringify(this.responseBody, undefined, 4))
    this.authenticateResponseBody = this.responseBody
})

//Set Token in HEADER
Then('{} doesn\'t set Cookie, Company Type and Company Key in HEADER', async function (actor: string) {
    this.headers = {}
    logger.log('info', `HEADERS with cookie empty: ${JSON.stringify(this.headers, undefined, 4)}`)
    this.attach(`HEADERS with cookie empty: ${JSON.stringify(this.headers, undefined, 4)}`)
});

Then('{} sets Cookie in HEADER as {}', async function (actor, cookieValue: string) {
    this.headers = {
        'Cookie': cookieValue
    }
    logger.log('info', `HEADERS with cookie ${cookieValue}: ${JSON.stringify(this.headers, undefined, 4)}`)
    this.attach(`HEADERS with cookie ${cookieValue}: ${JSON.stringify(this.headers, undefined, 4)}`)
});

Then('{} sets {} cookie of {} and {} companyKey and {} companyType in the header', async function (actor, cookieValue, user, companyKeyValue, companyTypeValue: string) {
    var cookieHeaderValue = cookieValue == 'valid' ? this.cookie : cookieValue;
    var companyKeyHeaderValue = companyKeyValue == 'valid' ? this.companyKey : companyKeyValue;
    var companyTypeHeaderValue = companyTypeValue == 'valid' ? this.companyType : companyTypeValue;

    this.headers = {
        'Cookie': cookieHeaderValue,
        'COMPANY-KEY': companyKeyHeaderValue,
        'COMPANY-TYPE': companyTypeHeaderValue,
    }
    logger.log('info', `HEADERS with cookie ${cookieValue} and company key ${companyKeyValue} and company type ${companyTypeValue} of ${user}: ${JSON.stringify(this.headers, undefined, 4)}`)
    this.attach(`HEADERS with cookie ${cookieValue} and company key ${companyKeyValue} and company type ${companyTypeValue} of ${user}: ${JSON.stringify(this.headers, undefined, 4)}`)
});

Then('In Header of the request, {} sets param Cookie as valid connect.sid', async function (user) {
    this.headers = {
        'Cookie': this.cookie
    }
    logger.log('info', `HEADERS with valid connect.sid: ${JSON.stringify(this.headers, undefined, 4)}`)
    this.attach(`HEADERS with valid connect.sid: ${JSON.stringify(this.headers, undefined, 4)}`)
})

// Check expected status code should be <statusCode>
Then('The expected status code should be {int}', async function (status) {
    expect(this.response.status()).toBe(status);
});

Then('The status text is {string}', function (message: string) {
    expect(this.response.statusText(), `In response, status text should be: ${message}`).toBe(message);
});

Then('Response of Login and Register API must match with API contract', async function () {
    expect(this.responseBody).toHaveProperty('userId')
    expect(this.responseBody).toHaveProperty('isAdmin')
    expect(this.responseBody).toHaveProperty('isRestrictAddCSV')
    expect(this.responseBody).toHaveProperty('displayName')
    expect(this.responseBody).toHaveProperty('preferences')
    expect(this.responseBody).toHaveProperty('addRequest')
    expect(this.responseBody).toHaveProperty('acceptedPrivacyPolicy')
    expect(this.responseBody).toHaveProperty('createdAt')
    expect(this.responseBody).toHaveProperty('updatedAt')
    expect(this.responseBody).toHaveProperty('gridStateItem')
    expect(this.responseBody).toHaveProperty('gridStateBom')
    expect(this.responseBody).toHaveProperty('gridStateVendor')
    expect(this.responseBody).toHaveProperty('gridStateSupply')
    expect(this.responseBody).toHaveProperty('gridStateDemand')
    expect(this.responseBody).toHaveProperty('gridStateSummary')
    expect(this.responseBody).toHaveProperty('gridStateSummaryByVendor')
    expect(this.responseBody).toHaveProperty('gridStateCustomPo')
    expect(this.responseBody).toHaveProperty('gridStateSnapshot')
    expect(this.responseBody).toHaveProperty('gridStateUrgentCare')
    expect(this.responseBody).toHaveProperty('gridStateConsolidate')
    expect(this.responseBody).toHaveProperty('gridStateAddress')
    expect(this.responseBody).toHaveProperty('gridStatePoSaved')
    expect(this.responseBody).toHaveProperty('gridStateAmazonReceipt')
    expect(this.responseBody).toHaveProperty('gridStatePoReceipt')
    expect(this.responseBody).toHaveProperty('gridStatePoClosed')
    expect(this.responseBody).toHaveProperty('gridStateShipmentClosed')
    expect(this.responseBody).toHaveProperty('gridStateShipment')
    expect(this.responseBody).toHaveProperty('gridStateAmazonReceiptDetail')
    expect(this.responseBody).toHaveProperty('gridStatePoReceiptDetail')
    expect(this.responseBody).toHaveProperty('gridStateCustomPoDetail')
    expect(this.responseBody).toHaveProperty('gridStateSuggestedPoDetail')
    expect(this.responseBody).toHaveProperty('gridStateRestockSuggestionItemList')
    expect(this.responseBody).toHaveProperty('gridStateInventorySelection')
    expect(this.responseBody).toHaveProperty('gridStateShipmentSumary')
    expect(this.responseBody).toHaveProperty('gridStateShipmentReview')
    expect(this.responseBody).toHaveProperty('gridStateShipmentComplete')
    expect(this.responseBody).toHaveProperty('globalFilters')
    // Not sure why has 2 created at in this api.
    expect(this.responseBody).toHaveProperty('created_at')
    expect(this.responseBody).toHaveProperty('updated_at')
    expect(this.responseBody).toHaveProperty('hasPassword')
    // expect(this.responseBody.user).toHaveProperty('id')
});

Then('UserId {} in the response of API is correct', async function (email) {
    if (email.includes('random')) {
        var expectedUserId = email.includes('<random>') ? this.randomEmail : email;

        expect(typeof (this.responseBody.userId)).toBe('string')
        expect(typeof (this.responseBody.isAdmin)).toBe('boolean')
        expect(typeof (this.responseBody.isRestrictAddCSV)).toBe('boolean')
        expect(typeof (this.responseBody.displayName)).toBe('string')
        expect(this.responseBody.userId, 'Check UserId is not null').not.toBeNull();
        expect(this.responseBody.userId, 'Check UserId is correct').toBe(expectedUserId);
    }
});

Then('Check that API Login returns cookie value', async function () {
    console.log('Check that API Login returns cookie value-----------', this.cookie);
    expect(this.cookie, 'Check cookie exists').not.toBeNull();
});

Then('Check total items in the response should be less than or equal {}', async function (limitRow: string) {
    const actualLength = await this.responseBody.length;
    const expectLength = Number(limitRow);
    expect(actualLength, `Check total items in the response should be less than or equal ${limitRow}`).toBeLessThanOrEqual(expectLength);
});

Then('Check items in the response should be sort by field {} with direction {}', async function (sortField, direction: string) {
    if (direction == 'asc') {
        const ascList = _.orderBy(this.responseBody, [`${sortField}`], ['asc'])
        const expectedList = this.responseBody;
        expect(this.responseBody, `Check items in the response should be sort by field ${sortField} with direction ${direction}`).toStrictEqual(ascList);
    }
    else if (direction == 'desc') {
        const descList = _.orderBy(this.responseBody, [`${sortField}`], ['desc'])
        expect(this.responseBody, `Check items in the response should be sort by field ${sortField} with direction ${direction}`).toStrictEqual(descList);
    }
});