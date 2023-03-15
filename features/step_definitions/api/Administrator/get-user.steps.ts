import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as userRequest from '../../../../src/api/request/administration.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";

let randomUser: any;
let link: any;

Then(`{} sets GET api endpoint to get 20 users has just created`, async function (actor: string) {
    link = encodeURI(`${Links.API_ADMIN_GET_USER}offset=0&limit=20&sort=[{"field":"createdAt","direction":"desc"}]&where={"logic":"and","filters":[]}`);
});

Then('{} sends a GET request to get 20 latest users', async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.get20LatestUsersResponse = this.response = await userRequest.getUser(this.request, link, options);
    const responseBodyText = await this.get20LatestUsersResponse.text();
    if (this.get20LatestUsersResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.get20LatestUsersResponseBody = this.responseBody = JSON.parse(await this.response.text());
        // logger.log('info', `Response GET ${Links.API_ADMIN_GET_USER}` + JSON.stringify(this.responseBody.userId, undefined, 4));
        // this.attach(`Response GET ${Links.API_ADMIN_GET_USER}` + JSON.stringify(this.responseBody.userId, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${Links.API_ADMIN_GET_USER} has status code ${this.get20LatestUsersResponse.status()} ${this.get20LatestUsersResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${Links.API_ADMIN_GET_USER} has status code ${this.get20LatestUsersResponse.status()} ${this.get20LatestUsersResponse.statusText()} and response body ${actualResponseText}`)
    }
})

Then('{} picks random user in above response', async function (actor: string) {
    randomUser = await this.responseBody[Math.floor(Math.random() * this.responseBody.length)];
    logger.log('info', `Random user: ${JSON.stringify(randomUser, undefined, 4)}`);
    this.attach(`Random user: ${JSON.stringify(randomUser, undefined, 4)}`);
})

Then('{} checks data type of values in random user object are correct', async function (actor: string) {
    //Check userId 
    expect(typeof (randomUser.userId), 'Type of userId value should be string').toBe("string");
    //Check password 
    if (randomUser.password !== null) {
        expect(typeof (randomUser.password), 'Type of password value should be string').toBe("string");
    }
    else {
        expect(randomUser.password, 'password value should be null').toBeNull();
    }
    //Check isAdmin
    expect(typeof (randomUser.isAdmin), 'Type of isAdmin value should be boolean').toBe("boolean");
    //Check displayName
    expect(typeof (randomUser.displayName), 'Type of displayName value should be string').toBe("string");
    //Check gridStateItem
    expect(typeof (randomUser.gridStateItem), 'Type of gridStateItem value should be object').toBe("object");
    //Check gridStateBom
    expect(typeof (randomUser.gridStateBom), 'Type of gridStateBom value should be object').toBe("object");
    //Check gridStateVendor
    expect(typeof (randomUser.gridStateVendor), 'Type of gridStateVendor value should be object').toBe("object");
    //Check gridStateSupply
    expect(typeof (randomUser.gridStateSupply), 'Type of gridStateSupply value should be object').toBe("object");
    //Check gridStateDemand
    expect(typeof (randomUser.gridStateDemand), 'Type of gridStateDemand value should be object').toBe("object");
    //Check gridStateSummary
    expect(typeof (randomUser.gridStateSummary), 'Type of gridStateSummary value should be object').toBe("object");
    //Check gridStateSummaryByVendor
    expect(typeof (randomUser.gridStateSummaryByVendor), 'Type of gridStateSummaryByVendor value should be object').toBe("object");
    //Check gridStateCustomPo
    expect(typeof (randomUser.gridStateCustomPo), 'Type of gridStateCustomPo value should be object').toBe("object");
    //Check gridStateSnapshot
    expect(typeof (randomUser.gridStateSnapshot), 'Type of gridStateSnapshot value should be object').toBe("object");
    //Check gridStateUrgentCare
    expect(typeof (randomUser.gridStateUrgentCare), 'Type of gridStateUrgentCare value should be object').toBe("object");
    //Check gridStateConsolidate
    expect(typeof (randomUser.gridStateConsolidate), 'Type of gridStateConsolidate value should be object').toBe("object");
    //Check gridStateAddress
    expect(typeof (randomUser.gridStateAddress), 'Type of gridStateAddress value should be object').toBe("object");
    //Check gridStatePoSaved
    expect(typeof (randomUser.gridStatePoSaved), 'Type of gridStatePoSaved value should be object').toBe("object");
    //Check resetPasswordToken
    if (randomUser.resetPasswordToken !== null) {
        expect(typeof (randomUser.resetPasswordToken), 'Type of resetPasswordToken value should be string').toBe("string");
    }
    else {
        expect(randomUser.resetPasswordToken, 'resetPasswordToken value should be null').toBeNull();
    }
    //Check resetPasswordExpires
    if (randomUser.resetPasswordExpires !== null) {
        expect(typeof (randomUser.resetPasswordExpires), 'Type of resetPasswordExpires value should be string').toBe("string");
    }
    else {
        expect(randomUser.resetPasswordExpires, 'resetPasswordExpires value should be null').toBeNull();
    }
    //Check preferences
    expect(typeof (randomUser.preferences), 'Type of preferences value should be object').toBe("object");
    //Check addRequest
    if (randomUser.addRequest !== null) {
        expect(typeof (randomUser.addRequest), 'Type of addRequest value should be object').toBe("object");
    }
    else {
        expect(randomUser.addRequest, 'addRequest value should be null').toBeNull();
    }
    //Check acceptedPrivacyPolicy
    if (randomUser.acceptedPrivacyPolicy !== null) {
        expect(typeof (randomUser.acceptedPrivacyPolicy), 'Type of acceptedPrivacyPolicy value should be boolean').toBe("boolean");
    }
    else {
        expect(randomUser.acceptedPrivacyPolicy, 'acceptedPrivacyPolicy value should be null').toBeNull();
    }
    //Check createdAt
    expect(Date.parse(randomUser.createdAt), 'createdAt in response should be date').not.toBeNaN();
    //Check updatedAt
    expect(Date.parse(randomUser.updatedAt), 'updatedAt in response should be date').not.toBeNaN();
    //Check gridStateAmazonReceipt
    expect(typeof (randomUser.gridStateAmazonReceipt), 'Type of gridStateAmazonReceipt value should be object').toBe("object");
    //Check gridStatePoReceipt
    expect(typeof (randomUser.gridStatePoReceipt), 'Type of gridStatePoReceipt value should be object').toBe("object");
    //Check gridStatePoClosed
    expect(typeof (randomUser.gridStatePoClosed), 'Type of gridStatePoClosed value should be object').toBe("object");
    //Check gridStateShipmentClosed
    expect(typeof (randomUser.gridStateShipmentClosed), 'Type of gridStateShipmentClosed value should be object').toBe("object");
    //Check gridStateShipment
    expect(typeof (randomUser.gridStateShipment), 'Type of gridStateShipment value should be object').toBe("object");
    //Check gridStateAmazonReceiptDetail
    expect(typeof (randomUser.gridStateAmazonReceiptDetail), 'Type of gridStateAmazonReceiptDetail value should be object').toBe("object");
    //Check gridStatePoReceiptDetail
    expect(typeof (randomUser.gridStatePoReceiptDetail), 'Type of gridStatePoReceiptDetail value should be object').toBe("object");
    //Check gridStateCustomPoDetail
    expect(typeof (randomUser.gridStateCustomPoDetail), 'Type of gridStateCustomPoDetail value should be object').toBe("object");
    //Check gridStateSuggestedPoDetail
    expect(typeof (randomUser.gridStateSuggestedPoDetail), 'Type of gridStateSuggestedPoDetail value should be object').toBe("object");
    //Check gridStateRestockSuggestionItemList
    expect(typeof (randomUser.gridStateRestockSuggestionItemList), 'Type of gridStateRestockSuggestionItemList value should be object').toBe("object");
    //Check gridStateInventorySelection
    expect(typeof (randomUser.gridStateInventorySelection), 'Type of gridStateInventorySelection value should be object').toBe("object");
    //Check gridStateShipmentSumary
    expect(typeof (randomUser.gridStateShipmentSumary), 'Type of gridStateShipmentSumary value should be object').toBe("object");
    //Check gridStateShipmentReview
    expect(typeof (randomUser.gridStateShipmentReview), 'Type of gridStateShipmentReview value should be object').toBe("object");
    //Check gridStateShipmentComplete
    expect(typeof (randomUser.gridStateShipmentComplete), 'Type of gridStateShipmentComplete value should be object').toBe("object");
    //Check globalFilters
    expect(typeof (randomUser.globalFilters), 'Type of globalFilters value should be object').toBe("object");
    //Check created_at
    expect(Date.parse(randomUser.created_at), 'created_at in response should be date').not.toBeNaN();
    //Check updated_at
    expect(Date.parse(randomUser.updated_at), 'updated_at in response should be date').not.toBeNaN();
})