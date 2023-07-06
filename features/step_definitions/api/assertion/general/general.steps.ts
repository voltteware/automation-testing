import { DataTable, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import * as authenticateRequest from '../../../../../src/api/request/authentication.service';
import logger from "../../../../../src/Logger/logger";
import { Links } from "../../../../../src/utils/links";
import * as _ from "lodash";
import * as itemRequest from '../../../../../src/api/request/item.service';
import * as bomRequest from '../../../../../src/api/request/bom.service';
import * as demandRequest from '../../../../../src/api/request/demand.service';
import { sortLocale } from '../../../../../src/helpers/array-helper';

let link: any;

// Get Valid Token 
Then('{} has valid connect.sid of {} after send a POST request with payload as email: {string} and password: {string}', async function (name, user: string, email: string, password: string) {
    const payload = {
        username: email,
        password: password,
    }
    var response = await authenticateRequest.sendPOSTAuthenticateRequest(Links.API_LOGIN, payload);
    expect(response.status()).toBe(201);

    const responseHeaders = response.headers();
    this.cookie = responseHeaders['set-cookie'];
    console.log('Cookie----------', this.cookie)
    this.responseBody = JSON.parse(await response.text())
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
    var response = await authenticateRequest.sendPOSTAuthenticateRequest(Links.API_LOGIN, payload);
    expect(response.status()).toBe(201);

    const responseHeaders = response.headers();
    this.cookie = responseHeaders['set-cookie'];
    console.log('Cookie----------', this.cookie)
    this.responseBody = JSON.parse(await response.text())
    //logger.log('info', 'Response Body:\n' + JSON.stringify(this.responseBody, undefined, 4))
    //this.attach(JSON.stringify(this.responseBody, undefined, 4))
    this.authenticateResponseBody = this.responseBody
    this.id = this.responseBody.displayName;
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

Then('{} checks status code and status text of api', function (actor: string, dataTable: DataTable) {
    var expectedStatus: number = dataTable.hashes()[0].expectedStatus;
    var expectedStatusText: string = dataTable.hashes()[0].expectedStatusText;
    expect(this.response.status()).toBe(Number(expectedStatus));
    expect(this.response.statusText(), `In response, status text should be: ${expectedStatusText}`).toBe(expectedStatusText);
});

Then(`{} finds the list {} contain value: {}`, async function (actor, section, valueContain: string) {
    if (section === 'items') {
        link = `${Links.API_ITEMS}?offset=0&limit=100&where={"filters":[{"filters":[{"field":"name","operator":"contains","value":"${valueContain}"}],"logic":"and"}],"logic":"and"}`;
        const options = {
            headers: this.headers
        }
        this.getItemsResponse = this.response = await itemRequest.getItems(this.request, link, options);
        this.responseBodyText = await this.getItemsResponse.text();
        this.responseBody = this.getItemsResponseBody = JSON.parse(await this.response.text());
    }
    if (section === 'bom') {
        link = `${Links.API_BOM}?offset=0&limit=100&where={"filters":[{"filters":[{"field":"childName","operator":"contains","value":"${valueContain}"}],"logic":"and"}],"logic":"and"}`;
        const options = {
            headers: this.headers
        }
        this.getBomResponse = this.response = await bomRequest.getBom(this.request, link, options);
        this.responseBodyText = await this.getBomResponse.text();
        this.responseBody = this.getBomResponseBody = JSON.parse(await this.response.text());
    }
    if (section == 'demand') {
        let link = `${Links.API_DEMAND}?offset=0&limit=100&where={"filters":[{"filters":[{"field":"itemName","operator":"contains","value":"${valueContain}"}],"logic":"and"}],"logic":"and"}`;
        const options = {
            headers: this.headers
        }
        this.getDemandResponse = this.response = await demandRequest.getDemand(this.request, link, options);
        this.responseBodyText = await this.getDemandResponse.text();
        this.responseBody = this.getDemandResponseBody = JSON.parse(await this.getDemandResponse.text());
    }
    if (this.response.status() == 200 && !this.responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response GET ${link}` + JSON.stringify(this.responseBody, undefined, 4));
        this.attach(`Response GET ${link}` + JSON.stringify(this.responseBody, undefined, 4))
    }
    else {
        const actualResponseText = this.responseBodyText.includes('<!doctype html>') ? 'html' : this.responseBodyText;
        logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${this.responseBodyText}`);
        this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
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
    // if (email.includes('random')) {
    var expectedUserId = email.includes('<random>') ? this.randomEmail : email;
    // Some cases user object response is under object called model
    var userInfo = this.responseBodyOfAUserObject;
    if (userInfo == null) {
        // This is case when user object is not under object model like register API or login API
        userInfo = this.responseBody;
    }

    expect(typeof (userInfo.userId)).toBe('string')
    expect(typeof (userInfo.isAdmin)).toBe('boolean')
    expect(typeof (userInfo.isRestrictAddCSV)).toBe('boolean')
    expect(typeof (userInfo.displayName)).toBe('string')
    expect(userInfo.userId, 'Check UserId is not null').not.toBeNull();
    expect(userInfo.userId, 'Check UserId is correct').toBe(expectedUserId);
    // }
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

Then(`Check items in the response should be sort by field {} with direction {}`, async function (sortField: string, direction: 'asc' | 'desc') {
    // Another way to sort
    // if (direction == 'asc') {
    //     const expectedList = this.responseBody;
    //     const sortedByAsc = _.orderBy(this.responseBody, [(o) => { return o.refNum || '' }], ['asc']);
    //     expect(expectedList, `Check items in the response should be sort by field refNum with direction ${direction}`).toStrictEqual(sortedByAsc);
    // }
    // else if (direction == 'desc') {
    //     const expectedList = this.responseBody;
    //     const sortedByDesc = _.orderBy(this.responseBody, [(o) => { return o.refNum || '' }], ['desc']);
    //     expect(expectedList, `Check items in the response should be sort by field refNum with direction ${direction}`).toStrictEqual(sortedByDesc);
    // }
    const expectedList = this.responseBody;
    const sortResult = sortLocale(expectedList, sortField, direction);
    expect(expectedList, `Check items in the response should be sort by field ${sortField} with direction ${direction}`).toStrictEqual(sortResult);
});