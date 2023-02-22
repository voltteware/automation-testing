import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as companyRequest from '../../../../src/api/request/company.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";

let link: any;
Then(`{} sets PUT api endpoint to update company keys`, async function (actor: string) {
    link = Links.API_UPDATE_COMPANY;
});
//leadTime
Then('{} sets request body with payload as leadTime: {int} and companyKey, companyType',async function (actor: string, leadTime: Number) {

    this.payLoad = {
        leadTime: leadTime,
        companyKey: this.companyKey,
        companyType: this.companyType,
    }    
    this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
});
//orderInterval
Then('{} sets request body with payload as orderInterval: {int} and companyKey, companyType',async function (actor: string, orderInterval: Number) {

    this.payLoad = {
        orderInterval: orderInterval,
        companyKey: this.companyKey,
        companyType: this.companyType,
    }    
    this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
});
//serviceLevel
Then('{} sets request body with payload as serviceLevel: {int} and companyKey, companyType',async function (actor: string, serviceLevel: Number) {

    this.payLoad = {
        serviceLevel: serviceLevel,
        companyKey: this.companyKey,
        companyType: this.companyType,
    }    
    this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
});
//isNotifyingAfterSync
Then('{} sets request body with payload as isNotifyingAfterSync: {string} and companyKey, companyType',async function (actor: string, isNotifyingAfterSync: string) {

    this.payLoad = {
        isNotifyingAfterSync: isNotifyingAfterSync,
        companyKey: this.companyKey,
        companyType: this.companyType,
    }    
    this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
});
//isNotifyingAfterForecast
Then('{} sets request body with payload as isNotifyingAfterForecast: {string} and companyKey, companyType',async function (actor: string, isNotifyingAfterForecast: string) {

    this.payLoad = {
        isNotifyingAfterForecast: isNotifyingAfterForecast,
        companyKey: this.companyKey,
        companyType: this.companyType,
    }    
    this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
});
//isLostSaleTracking
Then('{} sets request body with payload as isLostSaleTracking: {string} and companyKey, companyType',async function (actor: string, isLostSaleTracking: string) {

    this.payLoad = {
        isLostSaleTracking: isLostSaleTracking,
        companyKey: this.companyKey,
        companyType: this.companyType,
    }    
    this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
});
//without companyKey
Then('{} sets request body with payload as isLostSaleTracking: {string} and without companyKey',async function (actor: string, isLostSaleTracking: string) {

    this.payLoad = {
        isLostSaleTracking: isLostSaleTracking,
        companyType: this.companyType,
    }    
    this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
});
//without companyType
Then('{} sets request body with payload as isLostSaleTracking: {string} and without companyType',async function (actor: string, isLostSaleTracking: string) {

    this.payLoad = {
        isLostSaleTracking: isLostSaleTracking,
        companyKey: this.companyKey,
    }    
    this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
});
//pendingOrderToggle
Then('{} sets request body with payload as pendingOrderToggle: {string} and companyKey, companyType',async function (actor: string, pendingOrderToggle: string) {

    this.payLoad = {
        pendingOrderToggle: pendingOrderToggle,
        companyKey: this.companyKey,
        companyType: this.companyType,
    }    
    this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
});
//inventorySourcePreference
Then('{} sets request body with payload as inventorySourcePreference: {string} and companyKey, companyType',async function (actor: string, inventorySourcePreference: string) {

    this.payLoad = {
        inventorySourcePreference: inventorySourcePreference,
        companyKey: this.companyKey,
        companyType: this.companyType,
    }    
    this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
});
//purchasingSalesVelocitySettingData
Then('{} sets request body with payload purchasingSalesVelocitySettingData as percent2Day: {int} and percent7Day: {int} and percent30Day: {int} and percent60Day: {int} and percent90Day: {int} and percent180Day: {int} and percentForecasted: {int} and companyKey, companyType',
    async function (actor: string, percent2Day: Number,percent7Day: Number,percent30Day: Number,percent60Day: Number,percent90Day: Number,percent180Day: Number,percentForecasted: Number) {
    this.payLoad = {
        purchasingSalesVelocitySettingData:{
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
Then('{} sends a PUT method to update company of {} by company key', async function (actor,email: string) {

    this.response = this.updateCompanyResponse = await companyRequest.updateCompany(this.request, link, this.companyKey, this.payLoad, this.headers);
    const responseBodyText = await this.updateCompanyResponse.text();
    console.log(responseBodyText);
    if (this.updateCompanyResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBodyOfACompanyObject = JSON.parse(responseBodyText)
        logger.log('info', `Response PUT ${link}` + JSON.stringify(this.responseBodyOfACompanyObject, undefined, 4));
        this.attach(`Response PUT ${link}` + JSON.stringify(this.responseBodyOfACompanyObject, undefined, 4))
    }
    else if (responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response PUT ${link} ${responseBodyText}`);
        this.attach(`Response PUT ${link} returns html`)
    }
})

Then('{} checks values of {} in response of update company are correct', async function (actor,properties: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    const expectedleadTime = this.payLoad.leadTime;
    const expectedorderInterval = this.payLoad.orderInterval;
    const expectedserviceLevel = this.payLoad.serviceLevel;
    const expectedisLostSaleTracking = this.payLoad.isLostSaleTracking;
    const expectedisNotifyingAfterSync = this.payLoad.isNotifyingAfterSync;
    const expectedisNotifyingAfterForecast = this.payLoad.isNotifyingAfterForecast;
    const expectedpendingOrderToggle = this.payLoad.pendingOrderToggle;
    const expectedinventorySourcePreference = this.payLoad.inventorySourcePreference;
    const expectedpurchasingSalesVelocitySettingData = this.payLoad.purchasingSalesVelocitySettingData;
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfACompanyObject.companyType);
    expect(this.responseBodyOfACompanyObject.companyKey).not.toBeNull();
    if(expectedleadTime){
        expect(this.responseBodyOfACompanyObject.leadTime, `In response body, leadTime should be matched with the data request: ${expectedleadTime}`).toBe(expectedleadTime);
    }
    if(expectedorderInterval){
        expect(this.responseBodyOfACompanyObject.orderInterval, `In response body, leadTime should be matched with the data request: ${expectedorderInterval}`).toBe(expectedorderInterval);
    }
    if(expectedserviceLevel){
        expect(this.responseBodyOfACompanyObject.serviceLevel, `In response body, leadTime should be matched with the data request: ${expectedserviceLevel}`).toBe(expectedserviceLevel);
    }
    if(expectedisLostSaleTracking == "true"){
        expect(this.responseBodyOfACompanyObject.isLostSaleTracking, `In response body, isLostSaleTracking should be true`).toBeTruthy();
    }else if(expectedisLostSaleTracking == "false"){
        expect(this.responseBodyOfACompanyObject.isLostSaleTracking, `In response body, isLostSaleTracking should be false`).toBeFalsy();
    }
    if(expectedisNotifyingAfterForecast == "true"){
        expect(this.responseBodyOfACompanyObject.isNotifyingAfterForecast, `In response body, isNotifyingAfterForecast should be true`).toBeTruthy();
    }else if(expectedisNotifyingAfterForecast == "false"){
        expect(this.responseBodyOfACompanyObject.isNotifyingAfterForecast, `In response body, isNotifyingAfterForecast should be false`).toBeFalsy();
    }
    if(expectedisNotifyingAfterSync == "true"){
        expect(this.responseBodyOfACompanyObject.isNotifyingAfterSync, `In response body, isNotifyingAfterSync should be true`).toBeTruthy();
    }else if(expectedisNotifyingAfterSync == "false"){
        expect(this.responseBodyOfACompanyObject.isNotifyingAfterSync, `In response body, isNotifyingAfterSync should be false`).toBeFalsy();
    }
    if(expectedpendingOrderToggle == "true"){
        expect(this.responseBodyOfACompanyObject.pendingOrderToggle, `In response body, pendingOrderToggle should be true`).toBeTruthy();
    }else if(expectedpendingOrderToggle == "false"){
        expect(this.responseBodyOfACompanyObject.pendingOrderToggle, `In response body, pendingOrderToggle should be false`).toBeFalsy();
    }
    if(expectedinventorySourcePreference){
        expect(this.responseBodyOfACompanyObject.inventorySourcePreference, `In response body, inventorySourcePreference should be matched with the data request: ${expectedinventorySourcePreference}`).toBe(expectedinventorySourcePreference);
    }
    if(expectedpurchasingSalesVelocitySettingData){
        const expectedpercent2Day = this.payLoad.purchasingSalesVelocitySettingData.percent2Day;
        const expectedpercent7Day = this.payLoad.purchasingSalesVelocitySettingData.percent7Day;
        const expectedpercent30Day = this.payLoad.purchasingSalesVelocitySettingData.percent30Day;
        const expectedpercent60Day = this.payLoad.purchasingSalesVelocitySettingData.percent60Day;
        const expectedpercent90Day = this.payLoad.purchasingSalesVelocitySettingData.percent90Day;
        const expectedpercent180Day = this.payLoad.purchasingSalesVelocitySettingData.percent180Day;
        const expectedpercentForecasted = this.payLoad.purchasingSalesVelocitySettingData.percentForecasted;
        expect(this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent2Day, `In response body, percent2Day should be matched with the data request: ${expectedpercent2Day}`).toBe(expectedpercent2Day);
        expect(this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent7Day, `In response body, percent7Day should be matched with the data request: ${expectedpercent7Day}`).toBe(expectedpercent7Day);
        expect(this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent30Day, `In response body, percent30Day should be matched with the data request: ${expectedpercent30Day}`).toBe(expectedpercent30Day);
        expect(this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent60Day, `In response body, percent60Day should be matched with the data request: ${expectedpercent60Day}`).toBe(expectedpercent60Day);
        expect(this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent90Day, `In response body, percent90Day should be matched with the data request: ${expectedpercent90Day}`).toBe(expectedpercent90Day);
        expect(this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent180Day, `In response body, percent180Day should be matched with the data request: ${expectedpercent180Day}`).toBe(expectedpercent180Day);
        expect(this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percentForecasted, `In response body, percentForecasted should be matched with the data request: ${expectedpercentForecasted}`).toBe(expectedpercentForecasted);
    }
})

Then('The expected Total percentage should be {int}', async function (expectedTotalPercentage) {
    const TotalPercentage = this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent2Day + this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent7Day + 
    this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent30Day + this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent60Day + 
    this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent90Day + this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent180Day + 
    this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percentForecasted;
    expect(TotalPercentage).toBe(expectedTotalPercentage);
})