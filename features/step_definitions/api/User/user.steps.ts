import { When, Then, Given, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as userRequest from '../../../../src/api/request/user.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import * as arrayHelper from "../../../../src/helpers/array-helper";
import {addUserToCompanyResponseSchema} from '../assertion/administrator/userAssertionSchema'
import _ from "lodash";

// Get User Information
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
    // expect(this.getUserInformationResponseBody.err, 'err value should be null').toBeNull();
    // // }
    // //Check model array contains at least 1 user object
    // expect(typeof (this.getUserInformationResponseBody.model), 'model should be array').toBe("object");
    // expect(this.getUserInformationResponseBody.model.length, 'model should be array has at least 1 item').toEqual(1);
    // expect(this.responseBodyOfAUserObject.hasPassword, 'hasPassword should be boolean and be true').toBe(true);

    this.softAssert(this.getUserInformationResponseBody.err === null, 'err value should be null');
    this.softAssert(typeof (this.getUserInformationResponseBody.model) === "object", 'model should be array');
    this.softAssert(this.getUserInformationResponseBody.model.length === 1, 'model should be array has at least 1 item');
    this.softAssert(this.responseBodyOfAUserObject.hasPassword === true, 'hasPassword should be boolean and be true');

    // Avoid running further if there were soft assertion failures.
    expect(this.countErrors).toBe(0)
})

Then('{} checks API contract essential types in user object are correct', async function (actor: string) {
    //Check userId 
    this.softAssert(typeof (this.responseBodyOfAUserObject.userId) === "string", 'Type of userId value should be string');
    //Check isAdmin
    this.softAssert(typeof (this.responseBodyOfAUserObject.isAdmin)=== "boolean", 'Type of isAdmin value should be boolean');
    //Check displayName
    this.softAssert(typeof (this.responseBodyOfAUserObject.displayName) === "string", 'Type of displayName value should be string');
    //Check gridStateItem
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateItem) === "object", 'Type of gridStateItem value should be object');
    //Check gridStateBom
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateBom) === "object", 'Type of gridStateBom value should be object');
    //Check gridStateVendor
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateVendor) === "object", 'Type of gridStateVendor value should be object');
    //Check gridStateSupply
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateSupply) === "object", 'Type of gridStateSupply value should be object');
    //Check gridStateDemand
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateDemand) === "object", 'Type of gridStateDemand value should be object');
    //Check gridStateSummary
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateSummary) === "object", 'Type of gridStateSummary value should be object');
    //Check gridStateSummaryByVendor
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateSummaryByVendor) === "object", 'Type of gridStateSummaryByVendor value should be object');
    //Check gridStateCustomPo
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateCustomPo) === "object", 'Type of gridStateCustomPo value should be object');
    //Check gridStateSnapshot
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateSnapshot) === "object", 'Type of gridStateSnapshot value should be object');
    //Check gridStateUrgentCare
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateUrgentCare) === "object", 'Type of gridStateUrgentCare value should be object');
    //Check gridStateConsolidate
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateConsolidate) === "object", 'Type of gridStateConsolidate value should be object');
    //Check gridStateAddress
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateAddress) === "object", 'Type of gridStateAddress value should be object');
    //Check gridStatePoSaved
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStatePoSaved) === "object", 'Type of gridStatePoSaved value should be object');
    //Check resetPasswordToken
    if (this.responseBodyOfAUserObject.resetPasswordToken !== null) {
        this.softAssert(typeof (this.responseBodyOfAUserObject.resetPasswordToken) === "string", 'Type of resetPasswordToken value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAUserObject.resetPasswordToken === null, 'resetPasswordToken value should be null');
    }
    //Check resetPasswordExpires
    if (this.responseBodyOfAUserObject.resetPasswordExpires !== null) {
        this.softAssert(typeof (this.responseBodyOfAUserObject.resetPasswordExpires) === "string", 'Type of resetPasswordExpires value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAUserObject.resetPasswordExpires === null, 'resetPasswordExpires value should be null');
    }
    //Check preferences
    this.softAssert(typeof (this.responseBodyOfAUserObject.preferences) === "object", 'Type of preferences value should be object');
    //Check addRequest
    if (this.responseBodyOfAUserObject.addRequest !== null) {
        this.softAssert(typeof (this.responseBodyOfAUserObject.addRequest) === "object", 'Type of addRequest value should be object');
    }
    else {
        this.softAssert(this.responseBodyOfAUserObject.addRequest === null, 'addRequest value should be null');
    }
    //Check acceptedPrivacyPolicy
    if (this.responseBodyOfAUserObject.acceptedPrivacyPolicy !== null) {
        this.softAssert(typeof (this.responseBodyOfAUserObject.acceptedPrivacyPolicy) === "boolean", 'Type of acceptedPrivacyPolicy value should be boolean');
    }
    else {
        this.softAssert(this.responseBodyOfAUserObject.acceptedPrivacyPolicy === null, 'acceptedPrivacyPolicy value should be null');
    }
    //Check createdAt
    this.softAssert(!isNaN(Date.parse(this.responseBodyOfAUserObject.createdAt)), 'createdAt in response should be date');
    //Check updatedAt
    this.softAssert(!isNaN(Date.parse(this.responseBodyOfAUserObject.updatedAt)), 'updatedAt in response should be date');
    //Check gridStateAmazonReceipt
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateAmazonReceipt) === "object", 'Type of gridStateAmazonReceipt value should be object');
    //Check gridStatePoReceipt
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStatePoReceipt) === "object", 'Type of gridStatePoReceipt value should be object');
    //Check gridStatePoClosed
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStatePoClosed) === "object", 'Type of gridStatePoClosed value should be object');
    //Check gridStateShipmentClosed
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateShipmentClosed) === "object", 'Type of gridStateShipmentClosed value should be object');
    //Check gridStateShipment
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateShipment) === "object", 'Type of gridStateShipment value should be object');
    //Check gridStateAmazonReceiptDetail
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateAmazonReceiptDetail) === "object", 'Type of gridStateAmazonReceiptDetail value should be object');
    //Check gridStatePoReceiptDetail
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStatePoReceiptDetail) === "object", 'Type of gridStatePoReceiptDetail value should be object');
    //Check gridStateCustomPoDetail
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateCustomPoDetail) === "object", 'Type of gridStateCustomPoDetail value should be object');
    //Check gridStateSuggestedPoDetail
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateSuggestedPoDetail) === "object", 'Type of gridStateSuggestedPoDetail value should be object');
    //Check gridStateRestockSuggestionItemList
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateRestockSuggestionItemList) === "object", 'Type of gridStateRestockSuggestionItemList value should be object');
    //Check gridStateInventorySelection
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateInventorySelection) === "object", 'Type of gridStateInventorySelection value should be object');
    //Check gridStateShipmentSummary
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateShipmentSumary) === "object", 'Type of gridStateShipmentSummary value should be object');
    //Check gridStateShipmentReview
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateShipmentReview) === "object", 'Type of gridStateShipmentReview value should be object');
    //Check gridStateShipmentComplete
    this.softAssert(typeof (this.responseBodyOfAUserObject.gridStateShipmentComplete) === "object", 'Type of gridStateShipmentComplete value should be object');
    //Check globalFilters
    this.softAssert(typeof (this.responseBodyOfAUserObject.globalFilters) === "object", 'Type of globalFilters value should be object');
    //Check created_at
    // expect(Date.parse(this.responseBodyOfAUserObject.created_at), 'created_at in response should be date').not.toBeNaN();
    // //Check updated_at
    // expect(Date.parse(this.responseBodyOfAUserObject.updated_at), 'updated_at in response should be date').not.toBeNaN();

    // Avoid running further if there were soft assertion failures.
    expect(this.countErrors).toBe(0)
})

//Change Password
Then('{} sets request body with payload as password: {} and newPassword {}', async function (actor, password, newPassword: string) {

    this.changePasswordPayLoad = {
        password: password,
        newPassword: newPassword,
    }
    this.attach(`Payload: ${JSON.stringify(this.changePasswordPayLoad, undefined, 4)}`)
});

Then('{} sends a PUT method to change password of {}', async function (actor, email: string) {
    const link = Links.API_USERS_CHANGE_PASSWORD
    this.response = this.changePasswordResponse = await userRequest.changePassword(this.request, link, this.changePasswordPayLoad, this.headers);
    const responseBodyText = await this.changePasswordResponse.text();
    if (this.changePasswordResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = JSON.parse(responseBodyText);
        if (this.responseBody.model != null) {
            this.responseBodyOfAUserObject = this.responseBody.model[0];
        }

        logger.log('info', `Response PUT ${link}` + JSON.stringify(this.responseBody, undefined, 4));
        this.attach(`Response PUT ${link}` + JSON.stringify(this.responseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response PUT ${link} has status code ${this.changePasswordResponse.status()} ${this.changePasswordResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response PUT ${link} has status code ${this.changePasswordResponse.status()} ${this.changePasswordResponse.statusText()} and response body ${actualResponseText}`)
    }
})

Then('Error message {} in the response of API is displayed', async function (errorMessage: string) {
    expect(this.responseBody.model, 'Check this.responseBody is null').toBeNull();
    expect(this.responseBody.msg.type, 'Check message type is error').toBe("error");
    expect(this.responseBody.msg.content, `Check content error is correct: ${errorMessage}`).toContain(errorMessage);
    // }
});

Given('User sets POST api to add user to company', function () {
    this.linkApiAddUserToCompany = `${Links.API_USER}`

    this.addToCompanyPayload = {
        "userId": `${this.userId}`,
        "companyKey": `${this.companyKey}`,
        "companyType": `${this.companyType}`,
        "companyName": `${this.companyName}`,
        "operation": "addToCompany"
    }

    logger.log('info', `Payload add to company ${this.linkApiAddUserToCompany}` + JSON.stringify(this.addToCompanyPayload, undefined, 4));
    this.attach(`Payload add to company ${this.linkApiAddUserToCompany}` + JSON.stringify(this.addToCompanyPayload, undefined, 4))
});

Given('User sends a POST request add user to company', async function () {
    this.response = this.addUserToCompanyResponse = await userRequest.addToCompany(this.request, this.linkApiAddUserToCompany, this.addToCompanyPayload, this.headers);
    const responseBodyText = await this.addUserToCompanyResponse.text();
    if (this.addUserToCompanyResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.addUserToCompanyResponseBody = JSON.parse(responseBodyText);        

        logger.log('info', `Response POST add to company ${this.linkApiAddUserToCompany}` + JSON.stringify(this.responseBody, undefined, 4));
        this.attach(`Response POST add to company ${this.linkApiAddUserToCompany}` + JSON.stringify(this.responseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response POST add to company ${this.linkApiAddUserToCompany} has status code ${this.addUserToCompanyResponse.status()} ${this.addUserToCompanyResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response POST add to company ${this.linkApiAddUserToCompany} has status code ${this.addUserToCompanyResponse.status()} ${this.addUserToCompanyResponse.statusText()} and response body ${actualResponseText}`)
    }
});

Then('{} checks API contract essential types in the response of add user to company are correct', async function (actor: string) {
    // Check error 
    // if (this.addUserToCompanyResponseBody.err !== null) {
    //     expect(typeof (this.addUserToCompanyResponseBody.err), 'Type of err value should be string').toBe("string");
    // }
    // else {
    // expect(this.addUserToCompanyResponseBody.err, 'err value should be null').toBeNull();
    // }
    //Check model object
    // expect(typeof (this.addUserToCompanyResponseBody.model), 'model should be object').toBe("object");
    // expect(typeof (this.addUserToCompanyResponseBody.model.companyKey), 'Type of companyKey must be string').toBe("string");
    // expect(typeof (this.addUserToCompanyResponseBody.model.companyType), 'Type of companyType must be string').toBe("string");
    // expect(typeof (this.addUserToCompanyResponseBody.model.companyName), 'Type of companyName must be string').toBe("string");
    // expect(typeof (this.addUserToCompanyResponseBody.model.userId), 'Type of userId must be string').toBe("string");
    // expect(Date.parse(this.addUserToCompanyResponseBody.model.updated_at), 'Type of updated_at must be date').not.toBeNull();
    addUserToCompanyResponseSchema.parse(this.addUserToCompanyResponseBody)
})

Then('The error message must be {string}', function (errorMessage: string) {
    expect(this.addUserToCompanyResponseBody.err, `The error message mus be ${errorMessage}`).toBe(errorMessage)
});

Given('User sets POST api to remove user from company', function () {
    this.linkApiRemoveFromCompany = `${Links.API_USER}`

    this.removeFromCompanyPayload = {
        "userId": `${this.userId}`,
        "companyKey": `${this.companyKey}`,
        "companyType": `${this.companyType}`,
        "companyName": `${this.companyName}`,
        "operation": "removeFromCompany"
    }

    logger.log('info', `Payload remove from company ${this.linkApiRemoveFromCompany}` + JSON.stringify(this.removeFromCompanyPayload, undefined, 4));
    this.attach(`Payload remove from company ${this.linkApiRemoveFromCompany}` + JSON.stringify(this.removeFromCompanyPayload, undefined, 4))
});

Given('User sends a POST request to remove user from company', async function () {
    this.response = this.removeUserFromCompanyResponse = await userRequest.addToCompany(this.request, this.linkApiRemoveFromCompany, this.removeFromCompanyPayload, this.headers);
    const responseBodyText = await this.removeUserFromCompanyResponse.text();
    if (this.removeUserFromCompanyResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.removeUserFromCompanyResponseBody = JSON.parse(responseBodyText);        

        logger.log('info', `Response POST remove from company ${this.linkApiRemoveFromCompany}` + JSON.stringify(this.responseBody, undefined, 4));
        this.attach(`Response POST remove from company ${this.linkApiRemoveFromCompany}` + JSON.stringify(this.responseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response POST remove from company ${this.linkApiRemoveFromCompany} has status code ${this.removeUserFromCompanyResponse.status()} ${this.removeUserFromCompanyResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response POST remove from company ${this.linkApiRemoveFromCompany} has status code ${this.removeUserFromCompanyResponse.status()} ${this.removeUserFromCompanyResponse.statusText()} and response body ${actualResponseText}`)
    }
});