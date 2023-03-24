import { When, Then, Given, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as userRequest from '../../../../src/api/request/user.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import * as arrayHelper from "../../../../src/helpers/array-helper";
import _ from "lodash";

Then('{} sends a GET method to get user information of {}', async function (actor, email: string) {
    const options = {
        headers: this.headers
    }

    const getUserInformationResponse = this.response = await userRequest.getUserInformation(this.request, Links.API_USER, options);
    const responseBodyText = await getUserInformationResponse.text();
    logger.log('info', `Response GET ${Links.API_USER} has status code ${getUserInformationResponse.status()} ${getUserInformationResponse.statusText()} and response body ${responseBodyText}`);
    this.attach(`Response GET ${Links.API_USER} has status code ${getUserInformationResponse.status()} ${getUserInformationResponse.statusText()} and response body ${responseBodyText}`)

    if (getUserInformationResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getUserInformationResponseBody = this.responseBody = JSON.parse(responseBodyText);
        this.responseBodyOfAUserObject = this.getUserInformationResponseBody.model[0];
        logger.log('info', `Response GET ${Links.API_USER}` + JSON.stringify(responseBodyText, undefined, 4));
        this.attach(`Response GET ${Links.API_USER}` + JSON.stringify(responseBodyText, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${Links.API_USER} has status code ${getUserInformationResponse.status()} ${getUserInformationResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${Links.API_USER} has status code ${getUserInformationResponse.status()} ${getUserInformationResponse.statusText()} and response body ${actualResponseText}`)
    }
})

Then('{} checks API contract essential types in the response of get user information are correct', async function (actor: string) {
    //Check error 
    // if (this.responseBodyOfAUserObject.err !== null) {
    //     expect(typeof (this.responseBodyOfAUserObject.err), 'Type of err value should be string').toBe("string");
    // }
    // else {
    expect(this.getUserInformationResponseBody.err, 'err value should be null').toBeNull();
    // }
    //Checl model array contains at least 1 user object
    expect(typeof (this.getUserInformationResponseBody.model), 'model should be array').toBe("object");
    expect(this.getUserInformationResponseBody.model.length, 'model should be array has at least 1 item').toEqual(1);
    expect(this.responseBodyOfAUserObject.hasPassword, 'hasPassword should be boolean and be true').toBe(true);

})

Then('{} checks API contract essential types in user object are correct', async function (actor: string) {
    //Check userId 
    expect(typeof (this.responseBodyOfAUserObject.userId), 'Type of userId value should be string').toBe("string");
    //Check isAdmin
    expect(typeof (this.responseBodyOfAUserObject.isAdmin), 'Type of isAdmin value should be boolean').toBe("boolean");
    //Check displayName
    expect(typeof (this.responseBodyOfAUserObject.displayName), 'Type of displayName value should be string').toBe("string");
    //Check gridStateItem
    expect(typeof (this.responseBodyOfAUserObject.gridStateItem), 'Type of gridStateItem value should be object').toBe("object");
    //Check gridStateBom
    expect(typeof (this.responseBodyOfAUserObject.gridStateBom), 'Type of gridStateBom value should be object').toBe("object");
    //Check gridStateVendor
    expect(typeof (this.responseBodyOfAUserObject.gridStateVendor), 'Type of gridStateVendor value should be object').toBe("object");
    //Check gridStateSupply
    expect(typeof (this.responseBodyOfAUserObject.gridStateSupply), 'Type of gridStateSupply value should be object').toBe("object");
    //Check gridStateDemand
    expect(typeof (this.responseBodyOfAUserObject.gridStateDemand), 'Type of gridStateDemand value should be object').toBe("object");
    //Check gridStateSummary
    expect(typeof (this.responseBodyOfAUserObject.gridStateSummary), 'Type of gridStateSummary value should be object').toBe("object");
    //Check gridStateSummaryByVendor
    expect(typeof (this.responseBodyOfAUserObject.gridStateSummaryByVendor), 'Type of gridStateSummaryByVendor value should be object').toBe("object");
    //Check gridStateCustomPo
    expect(typeof (this.responseBodyOfAUserObject.gridStateCustomPo), 'Type of gridStateCustomPo value should be object').toBe("object");
    //Check gridStateSnapshot
    expect(typeof (this.responseBodyOfAUserObject.gridStateSnapshot), 'Type of gridStateSnapshot value should be object').toBe("object");
    //Check gridStateUrgentCare
    expect(typeof (this.responseBodyOfAUserObject.gridStateUrgentCare), 'Type of gridStateUrgentCare value should be object').toBe("object");
    //Check gridStateConsolidate
    expect(typeof (this.responseBodyOfAUserObject.gridStateConsolidate), 'Type of gridStateConsolidate value should be object').toBe("object");
    //Check gridStateAddress
    expect(typeof (this.responseBodyOfAUserObject.gridStateAddress), 'Type of gridStateAddress value should be object').toBe("object");
    //Check gridStatePoSaved
    expect(typeof (this.responseBodyOfAUserObject.gridStatePoSaved), 'Type of gridStatePoSaved value should be object').toBe("object");
    //Check resetPasswordToken
    if (this.responseBodyOfAUserObject.resetPasswordToken !== null) {
        expect(typeof (this.responseBodyOfAUserObject.resetPasswordToken), 'Type of resetPasswordToken value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfAUserObject.resetPasswordToken, 'resetPasswordToken value should be null').toBeNull();
    }
    //Check resetPasswordExpires
    if (this.responseBodyOfAUserObject.resetPasswordExpires !== null) {
        expect(typeof (this.responseBodyOfAUserObject.resetPasswordExpires), 'Type of resetPasswordExpires value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfAUserObject.resetPasswordExpires, 'resetPasswordExpires value should be null').toBeNull();
    }
    //Check preferences
    expect(typeof (this.responseBodyOfAUserObject.preferences), 'Type of preferences value should be object').toBe("object");
    //Check addRequest
    if (this.responseBodyOfAUserObject.addRequest !== null) {
        expect(typeof (this.responseBodyOfAUserObject.addRequest), 'Type of addRequest value should be object').toBe("object");
    }
    else {
        expect(this.responseBodyOfAUserObject.addRequest, 'addRequest value should be null').toBeNull();
    }
    //Check acceptedPrivacyPolicy
    if (this.responseBodyOfAUserObject.acceptedPrivacyPolicy !== null) {
        expect(typeof (this.responseBodyOfAUserObject.acceptedPrivacyPolicy), 'Type of acceptedPrivacyPolicy value should be boolean').toBe("boolean");
    }
    else {
        expect(this.responseBodyOfAUserObject.acceptedPrivacyPolicy, 'acceptedPrivacyPolicy value should be null').toBeNull();
    }
    //Check createdAt
    expect(Date.parse(this.responseBodyOfAUserObject.createdAt), 'createdAt in response should be date').not.toBeNaN();
    //Check updatedAt
    expect(Date.parse(this.responseBodyOfAUserObject.updatedAt), 'updatedAt in response should be date').not.toBeNaN();
    //Check gridStateAmazonReceipt
    expect(typeof (this.responseBodyOfAUserObject.gridStateAmazonReceipt), 'Type of gridStateAmazonReceipt value should be object').toBe("object");
    //Check gridStatePoReceipt
    expect(typeof (this.responseBodyOfAUserObject.gridStatePoReceipt), 'Type of gridStatePoReceipt value should be object').toBe("object");
    //Check gridStatePoClosed
    expect(typeof (this.responseBodyOfAUserObject.gridStatePoClosed), 'Type of gridStatePoClosed value should be object').toBe("object");
    //Check gridStateShipmentClosed
    expect(typeof (this.responseBodyOfAUserObject.gridStateShipmentClosed), 'Type of gridStateShipmentClosed value should be object').toBe("object");
    //Check gridStateShipment
    expect(typeof (this.responseBodyOfAUserObject.gridStateShipment), 'Type of gridStateShipment value should be object').toBe("object");
    //Check gridStateAmazonReceiptDetail
    expect(typeof (this.responseBodyOfAUserObject.gridStateAmazonReceiptDetail), 'Type of gridStateAmazonReceiptDetail value should be object').toBe("object");
    //Check gridStatePoReceiptDetail
    expect(typeof (this.responseBodyOfAUserObject.gridStatePoReceiptDetail), 'Type of gridStatePoReceiptDetail value should be object').toBe("object");
    //Check gridStateCustomPoDetail
    expect(typeof (this.responseBodyOfAUserObject.gridStateCustomPoDetail), 'Type of gridStateCustomPoDetail value should be object').toBe("object");
    //Check gridStateSuggestedPoDetail
    expect(typeof (this.responseBodyOfAUserObject.gridStateSuggestedPoDetail), 'Type of gridStateSuggestedPoDetail value should be object').toBe("object");
    //Check gridStateRestockSuggestionItemList
    expect(typeof (this.responseBodyOfAUserObject.gridStateRestockSuggestionItemList), 'Type of gridStateRestockSuggestionItemList value should be object').toBe("object");
    //Check gridStateInventorySelection
    expect(typeof (this.responseBodyOfAUserObject.gridStateInventorySelection), 'Type of gridStateInventorySelection value should be object').toBe("object");
    //Check gridStateShipmentSumary
    expect(typeof (this.responseBodyOfAUserObject.gridStateShipmentSumary), 'Type of gridStateShipmentSumary value should be object').toBe("object");
    //Check gridStateShipmentReview
    expect(typeof (this.responseBodyOfAUserObject.gridStateShipmentReview), 'Type of gridStateShipmentReview value should be object').toBe("object");
    //Check gridStateShipmentComplete
    expect(typeof (this.responseBodyOfAUserObject.gridStateShipmentComplete), 'Type of gridStateShipmentComplete value should be object').toBe("object");
    //Check globalFilters
    expect(typeof (this.responseBodyOfAUserObject.globalFilters), 'Type of globalFilters value should be object').toBe("object");
    //Check created_at
    expect(Date.parse(this.responseBodyOfAUserObject.created_at), 'created_at in response should be date').not.toBeNaN();
    //Check updated_at
    expect(Date.parse(this.responseBodyOfAUserObject.updated_at), 'updated_at in response should be date').not.toBeNaN();
})

