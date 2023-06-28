import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as companyRequest from '../../../../src/api/request/company.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";
import * as keyword from '../../../../src/utils/actionwords'

let link: any;
Then(`{} sets PUT api endpoint to update company keys`, async function (actor: string) {
    link = Links.API_UPDATE_COMPANY;
});
//leadTime
Then('{} sets request body with payload as leadTime: {} and companyKey, companyType', async function (actor: string, leadTime: any) {
    if (leadTime == "random") {
        leadTime = Number(faker.datatype.number({
            'min': 1,
            'max': 365
        }));
    }
    else {
        leadTime = Number(leadTime);
    }
    this.payLoad = {
        leadTime: leadTime,
        companyKey: this.companyKey,
        companyType: this.companyType,
    }
    this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
});
//orderInterval
Then('{} sets request body with payload as orderInterval: {int} and companyKey, companyType', async function (actor: string, orderInterval: Number) {

    this.payLoad = {
        orderInterval: orderInterval,
        companyKey: this.companyKey,
        companyType: this.companyType,
    }
    this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
});
//serviceLevel
Then('{} sets request body with payload as serviceLevel: {int} and companyKey, companyType', async function (actor: string, serviceLevel: Number) {

    this.payLoad = {
        serviceLevel: serviceLevel,
        companyKey: this.companyKey,
        companyType: this.companyType,
    }
    this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
});
//isNotifyingAfterSync
Then('{} sets request body with payload as isNotifyingAfterSync: {string} and companyKey, companyType', async function (actor: string, isNotifyingAfterSync: string) {

    this.payLoad = {
        isNotifyingAfterSync: isNotifyingAfterSync,
        companyKey: this.companyKey,
        companyType: this.companyType,
    }
    this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
});
//isNotifyingAfterForecast
Then('{} sets request body with payload as isNotifyingAfterForecast: {string} and companyKey, companyType', async function (actor: string, isNotifyingAfterForecast: string) {

    this.payLoad = {
        isNotifyingAfterForecast: isNotifyingAfterForecast,
        companyKey: this.companyKey,
        companyType: this.companyType,
    }
    this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
});
//isLostSaleTracking
Then('{} sets request body with payload as isLostSaleTracking: {string} and companyKey, companyType', async function (actor: string, isLostSaleTracking: string) {

    this.payLoad = {
        isLostSaleTracking: isLostSaleTracking,
        companyKey: this.companyKey,
        companyType: this.companyType,
    }
    this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
});
//without companyKey
Then('{} sets request body with payload as isLostSaleTracking: {string} and without companyKey', async function (actor: string, isLostSaleTracking: string) {

    this.payLoad = {
        isLostSaleTracking: isLostSaleTracking,
        companyType: this.companyType,
    }
    this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
});
//without companyType
Then('{} sets request body with payload as isLostSaleTracking: {string} and without companyType', async function (actor: string, isLostSaleTracking: string) {

    this.payLoad = {
        isLostSaleTracking: isLostSaleTracking,
        companyKey: this.companyKey,
    }
    this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
});
//pendingOrderToggle
Then('{} sets request body with payload as pendingOrderToggle: {string} and companyKey, companyType', async function (actor: string, pendingOrderToggle: string) {

    this.payLoad = {
        pendingOrderToggle: pendingOrderToggle,
        companyKey: this.companyKey,
        companyType: this.companyType,
    }
    this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
});
//inventorySourcePreference
Then('{} sets request body with payload as inventorySourcePreference: {string} and companyKey, companyType', async function (actor: string, inventorySourcePreference: string) {

    this.payLoad = {
        inventorySourcePreference: inventorySourcePreference,
        companyKey: this.companyKey,
        companyType: this.companyType,
    }
    this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
});
//purchasingSalesVelocitySettingData
Then('{} sets request body with payload purchasingSalesVelocitySettingData as percent2Day: {int} and percent7Day: {int} and percent30Day: {int} and percent60Day: {int} and percent90Day: {int} and percent180Day: {int} and percentForecasted: {int} and companyKey, companyType',
    async function (actor: string, percent2Day: Number, percent7Day: Number, percent30Day: Number, percent60Day: Number, percent90Day: Number, percent180Day: Number, percentForecasted: Number) {
        this.payLoad = {
            purchasingSalesVelocitySettingData: {
                percent2Day: percent2Day,
                percent7Day: percent7Day,
                percent30Day: percent30Day,
                percent60Day: percent60Day,
                percent90Day: percent90Day,
                percent180Day: percent180Day,
                percentForecasted: percentForecasted,
            },
            companyKey: this.companyKey,
            companyType: this.companyType,
        }
        this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
    });
//PUT method update company
Then('{} sends a PUT method to update company of {} by company key', async function (actor, email: string) {

    this.response = this.updateCompanyResponse = await companyRequest.updateCompany(this.request, link, this.companyKey, this.payLoad, this.headers);
    const responseBodyText = await this.updateCompanyResponse.text();
    if (this.updateCompanyResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBodyOfACompanyObject = JSON.parse(responseBodyText)
        logger.log('info', `Response PUT ${link}` + JSON.stringify(this.responseBodyOfACompanyObject, undefined, 4));
        this.attach(`Response PUT ${link}` + JSON.stringify(this.responseBodyOfACompanyObject, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response PUT ${link} has status code ${this.updateCompanyResponse.status()} ${this.updateCompanyResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response PUT ${link} has status code ${this.updateCompanyResponse.status()} ${this.updateCompanyResponse.statusText()} and response body ${actualResponseText}`)
    }
})

Then('{} checks values of {} in response of update company are correct', async function (actor, properties: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    const expectedLeadTime = this.payLoad.leadTime;
    const expectedOrderInterval = this.payLoad.orderInterval;
    const expectedServiceLevel = this.payLoad.serviceLevel;
    const expectedIsLostSaleTracking = this.payLoad.isLostSaleTracking;
    const expectedIsNotifyingAfterSync = this.payLoad.isNotifyingAfterSync;
    const expectedIsNotifyingAfterForecast = this.payLoad.isNotifyingAfterForecast;
    const expectedPendingOrderToggle = this.payLoad.pendingOrderToggle;
    const expectedInventorySourcePreference = this.payLoad.inventorySourcePreference;
    const expectedPurchasingSalesVelocitySettingData = this.payLoad.purchasingSalesVelocitySettingData;
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfACompanyObject.companyType);
    expect(this.responseBodyOfACompanyObject.companyKey).not.toBeNull();
    if (expectedLeadTime) {
        expect(this.responseBodyOfACompanyObject.leadTime, `In response body, leadTime should be matched with the data request: ${expectedLeadTime}`).toBe(expectedLeadTime);
    }
    if (expectedOrderInterval) {
        expect(this.responseBodyOfACompanyObject.orderInterval, `In response body, leadTime should be matched with the data request: ${expectedOrderInterval}`).toBe(expectedOrderInterval);
    }
    if (expectedServiceLevel) {
        expect(this.responseBodyOfACompanyObject.serviceLevel, `In response body, leadTime should be matched with the data request: ${expectedServiceLevel}`).toBe(expectedServiceLevel);
    }
    if (expectedIsLostSaleTracking == "true") {
        expect(this.responseBodyOfACompanyObject.isLostSaleTracking, `In response body, isLostSaleTracking should be true`).toBeTruthy();
    } else if (expectedIsLostSaleTracking == "false") {
        expect(this.responseBodyOfACompanyObject.isLostSaleTracking, `In response body, isLostSaleTracking should be false`).toBeFalsy();
    }
    if (expectedIsNotifyingAfterForecast == "true") {
        expect(this.responseBodyOfACompanyObject.isNotifyingAfterForecast, `In response body, isNotifyingAfterForecast should be true`).toBeTruthy();
    } else if (expectedIsNotifyingAfterForecast == "false") {
        expect(this.responseBodyOfACompanyObject.isNotifyingAfterForecast, `In response body, isNotifyingAfterForecast should be false`).toBeFalsy();
    }
    if (expectedIsNotifyingAfterSync == "true") {
        expect(this.responseBodyOfACompanyObject.isNotifyingAfterSync, `In response body, isNotifyingAfterSync should be true`).toBeTruthy();
    } else if (expectedIsNotifyingAfterSync == "false") {
        expect(this.responseBodyOfACompanyObject.isNotifyingAfterSync, `In response body, isNotifyingAfterSync should be false`).toBeFalsy();
    }
    if (expectedPendingOrderToggle == "true") {
        expect(this.responseBodyOfACompanyObject.pendingOrderToggle, `In response body, pendingOrderToggle should be true`).toBeTruthy();
    } else if (expectedPendingOrderToggle == "false") {
        expect(this.responseBodyOfACompanyObject.pendingOrderToggle, `In response body, pendingOrderToggle should be false`).toBeFalsy();
    }
    if (expectedInventorySourcePreference) {
        expect(this.responseBodyOfACompanyObject.inventorySourcePreference, `In response body, inventorySourcePreference should be matched with the data request: ${expectedInventorySourcePreference}`).toBe(expectedInventorySourcePreference);
    }
    if (expectedPurchasingSalesVelocitySettingData) {
        const expectedPercent2Day = this.payLoad.purchasingSalesVelocitySettingData.percent2Day;
        const expectedPercent7Day = this.payLoad.purchasingSalesVelocitySettingData.percent7Day;
        const expectedPercent30Day = this.payLoad.purchasingSalesVelocitySettingData.percent30Day;
        const expectedPercent60Day = this.payLoad.purchasingSalesVelocitySettingData.percent60Day;
        const expectedPercent90Day = this.payLoad.purchasingSalesVelocitySettingData.percent90Day;
        const expectedPercent180Day = this.payLoad.purchasingSalesVelocitySettingData.percent180Day;
        const expectedPercentForecasted = this.payLoad.purchasingSalesVelocitySettingData.percentForecasted;
        expect(this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent2Day, `In response body, percent2Day should be matched with the data request: ${expectedPercent2Day}`).toBe(expectedPercent2Day);
        expect(this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent7Day, `In response body, percent7Day should be matched with the data request: ${expectedPercent7Day}`).toBe(expectedPercent7Day);
        expect(this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent30Day, `In response body, percent30Day should be matched with the data request: ${expectedPercent30Day}`).toBe(expectedPercent30Day);
        expect(this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent60Day, `In response body, percent60Day should be matched with the data request: ${expectedPercent60Day}`).toBe(expectedPercent60Day);
        expect(this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent90Day, `In response body, percent90Day should be matched with the data request: ${expectedPercent90Day}`).toBe(expectedPercent90Day);
        expect(this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent180Day, `In response body, percent180Day should be matched with the data request: ${expectedPercent180Day}`).toBe(expectedPercent180Day);
        expect(this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percentForecasted, `In response body, percentForecasted should be matched with the data request: ${expectedPercentForecasted}`).toBe(expectedPercentForecasted);
    }
})

Then('The expected Total percentage should be {int}', async function (expectedTotalPercentage) {
    const TotalPercentage = this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent2Day + this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent7Day +
        this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent30Day + this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent60Day +
        this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent90Day + this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent180Day +
        this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percentForecasted;
    expect(TotalPercentage).toBe(expectedTotalPercentage);
})

Then(`{} sets PUT api endpoint to update "Purchasing Daily Sales Rate Rules > Average" in the "Manage Company > Company Details" of above company with the total percentage is {}%`, async function (actor: string, percentage: string) {
    link = `${Links.API_GET_COMPANY}/${this.companyKey}`;
    this.payLoad = this.responseBodyOfACompanyObject

    this.randomWeightNumbers = []

    const isNumber = !isNaN(parseFloat(percentage)) && isFinite(+percentage);
    if (isNumber) {
        // The function returns the array of 8 numbers that add up to the desired sum (here is percentage of purchasing daily sales)
        this.randomWeightNumbers = keyword.generateRandomNumbers(Number(percentage), 8);

        this.payLoad.purchasingSalesVelocitySettingData.percent2Day = this.randomWeightNumbers[0]
        this.payLoad.purchasingSalesVelocitySettingData.percent7Day = this.randomWeightNumbers[1]
        this.payLoad.purchasingSalesVelocitySettingData.percent14Day = this.randomWeightNumbers[2]
        this.payLoad.purchasingSalesVelocitySettingData.percent30Day = this.randomWeightNumbers[3]
        this.payLoad.purchasingSalesVelocitySettingData.percent60Day = this.randomWeightNumbers[4]
        this.payLoad.purchasingSalesVelocitySettingData.percent90Day = this.randomWeightNumbers[5]
        this.payLoad.purchasingSalesVelocitySettingData.percent180Day = this.randomWeightNumbers[6]
        this.payLoad.purchasingSalesVelocitySettingData.percentForecasted = this.randomWeightNumbers[7]
    }

    logger.log('info', `Payload` + JSON.stringify(this.payLoad, undefined, 4));
    this.attach(`Payload` + JSON.stringify(this.payLoad, undefined, 4))
});

Then(`{} sends PUT request to update in Purchasing "Purchasing Daily Sales Rate Rules > Average"`, async function (actor: string) {
    this.response = await companyRequest.editPurchasingDailyRate(this.request, link, this.payLoad, this.headers)
    if (this.response.status() == 200) {
        this.editCompanyResponseBody = JSON.parse(await this.response.text())
        logger.log('info', `Edit Company Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()} and editCompanyResponse body ${JSON.stringify(this.editCompanyResponseBody, undefined, 4)}`)
        this.attach(`Edit Company Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()} and editCompanyResponse body ${JSON.stringify(this.editCompanyResponseBody, undefined, 4)}`)
    } else {
        logger.log('info', `Edit Company Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
        this.attach(`Edit Company Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
    }
});