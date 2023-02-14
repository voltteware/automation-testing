import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as companiesRequest from '../../../../src/api/request/administration.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";

let randomCompanies: any;
let link: any;

Then(`{} sets GET api endpoint to get companies keys`, async function (actor: string) {
    link = Links.API_ADMIN_GET_COMPANIES;
});

Then('{} sends a GET request to get companies keys', async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.response = await companiesRequest.getCompanies(this.request, link, options);
    if (this.response.status() == 200) {
        this.responseBody = JSON.parse(await this.response.text());
        logger.log('info', `Response GET ${Links.API_ADMIN_GET_COMPANIES}` + JSON.stringify(this.responseBody, undefined, 4));
        this.attach(`Response GET ${Links.API_ADMIN_GET_COMPANIES}` + JSON.stringify(this.responseBody, undefined, 4))
    }
})

Then('{} picks random companies in above response', async function (actor: string) {
    randomCompanies = await this.responseBody[Math.floor(Math.random() * this.responseBody.length)];
    logger.log('info', `Random company: ${JSON.stringify(randomCompanies, undefined, 4)}`);
    this.attach(`Random company: ${JSON.stringify(randomCompanies, undefined, 4)}`);
})

Then('{} checks data type of values in random companies object are correct', async function (actor: string) {
    expect(typeof (randomCompanies.companyType), 'Type of companyType value should be string').toBe("string");
    expect(typeof (randomCompanies.companyKey), 'Type of companyKey value should be string').toBe("string");
    expect(typeof (randomCompanies.companyName), 'Type of companyName value should be string').toBe("string");
    expect(typeof (randomCompanies.forecastKey), 'Type of forecastKey value should be string').toBe("string");
    expect(typeof (randomCompanies.forecastName), 'Type of forecastName value should be string').toBe("string");
    expect(typeof (randomCompanies.moq), 'Type of moq value should be number').toBe("number");
    expect(typeof (randomCompanies.leadTime), 'Type of leadTime value should be number').toBe("number");
    expect(typeof (randomCompanies.orderInterval), 'Type of orderInterval value should be number').toBe("number");
    expect(typeof (randomCompanies.serviceLevel), 'Type of serviceLevel value should be number').toBe("number");
    if(randomCompanies.email !== null){
        expect(typeof (randomCompanies.email), 'Type of email value should be string').toBe("string");
    }
    else {   
        expect(randomCompanies.email, 'Type of email value should be null').toBeNull();
    }
    
    if(randomCompanies.lastForecastDate !== null){
        expect(Date.parse(randomCompanies.lastForecastDate), 'lastForecastDate in response should be date').not.toBeNaN();
    }
    else {   
        expect(randomCompanies.lastForecastDate, 'Type of lastForecastDate value should be null').toBeNull();
    }
    if(randomCompanies.lastSyncDate !== null){
        expect(Date.parse(randomCompanies.lastSyncDate), 'lastSyncDate in response should be date').not.toBeNaN();
    }
    else {   
        expect(randomCompanies.lastSyncDate, 'Type of lastSyncDate value should be null').toBeNull();
    }
    expect(Date.parse(randomCompanies.createdAt), 'createdAt in response should be date').not.toBeNaN();
    expect(Date.parse(randomCompanies.updatedAt), 'updatedAt in response should be date').not.toBeNaN();
    expect(Date.parse(randomCompanies.updatedAt), 'updatedAt in response should be date').not.toBeNaN();
    // Check shipmentLastRefresh
    if(randomCompanies.shipmentLastRefresh !== null){
        expect(typeof (randomCompanies.shipmentLastRefresh), 'Type of shipmentLastRefresh value should be string').toBe("string");
    }
    else {
        expect(randomCompanies.shipmentLastRefresh, 'shipmentLastRefresh value should be null').toBeNull();
    }
    // Check sellerId
    if(randomCompanies.sellerId !== null){
        expect(typeof (randomCompanies.sellerId), 'Type of sellerId value should be string').toBe("string");
    }
    else {
        expect(randomCompanies.sellerId, 'sellerId value should be null').toBeNull();
    }
    // Check marketplaceId
    if(randomCompanies.marketplaceId !== null){
        expect(typeof (randomCompanies.marketplaceId), 'Type of marketplaceId value should be string').toBe("string");
    }
    else {
        expect(randomCompanies.marketplaceId, 'marketplaceId value should be null').toBeNull();
    } 
    // Check mwsAuthToken
    if(randomCompanies.mwsAuthToken !== null){
        expect(typeof (randomCompanies.mwsAuthToken), 'Type of mwsAuthToken value should be string').toBe("string");
    }
    else {
        expect(randomCompanies.mwsAuthToken, 'mwsAuthToken value should be null').toBeNull();
    }
    if (randomCompanies.ratings.length > 0) {
        expect(typeof (randomCompanies.ratings), 'Type of ratings value should be object').toBe("object");
        const randomRating = randomCompanies.ratings[Math.floor(Math.random() * randomCompanies.ratings.length)];
        expect(typeof (randomRating), 'Type of each ratinhs value should be object').toBe("object");
        expect(typeof (randomRating.id), 'Type of ratings id value should be string').toBe("string");
        expect(typeof (randomRating.value), 'Type of ratings value should be number').toBe("number");
    }
    expect(typeof (randomCompanies.spikePercent), 'Type of spikePercent value should be number').toBe("number");
    expect(typeof (randomCompanies.plungePercent), 'Type of plungePercent value should be number').toBe("number");
    expect(typeof (randomCompanies.isManualInventory), 'Type of isManualInventory value should be boolean').toBe("boolean");
    if(randomCompanies.requestsOnboarding !== null){
        expect(typeof (randomCompanies.requestsOnboarding), 'Type of requestsOnboarding value should be boolean').toBe("boolean");
    }
    else {
        expect(randomCompanies.requestsOnboarding, 'customerId value should be null').toBeNull();
    }
    if(randomCompanies.customerId !== null){
        expect(typeof (randomCompanies.customerId), 'Type of customerId value should be string').toBe("string");
    }
    else {
        expect(randomCompanies.customerId, 'customerId value should be null').toBeNull();
    }
    if(randomCompanies.subscriptionId !== null){
        expect(typeof (randomCompanies.subscriptionId), 'Type of subscriptionId value should be string').toBe("string");
    }
    else {
        expect(randomCompanies.subscriptionId, 'subscriptionId value should be null').toBeNull();
    }
    if(randomCompanies.subscriptionStatus !== null){
        expect(typeof (randomCompanies.subscriptionStatus), 'Type of subscriptionStatus value should be string').toBe("string");
    }
    else {
        expect(randomCompanies.subscriptionStatus, 'subscriptionStatus value should be null').toBeNull();
    }
    if(randomCompanies.purchaseItems !== null){
        expect(typeof (randomCompanies.purchaseItems), 'Type of purchaseItems value should be number').toBe("number");
    }
    else {
        expect(randomCompanies.purchaseItems, 'purchaseItems value should be null').toBeNull();
    }
    if(randomCompanies.purchasePrice !== null){
        expect(typeof (randomCompanies.purchasePrice), 'Type of purchasePrice value should be number').toBe("number");
    }
    else {
        expect(randomCompanies.purchasePrice, 'purchasePrice value should be null').toBeNull();
    }
    if(randomCompanies.purchasePriceWithMoq !== null){
        expect(typeof (randomCompanies.purchasePriceWithMoq), 'Type of purchasePriceWithMoq value should be number').toBe("number");
    }
    else {
        expect(randomCompanies.purchasePriceWithMoq, 'purchasePriceWithMoq value should be null').toBeNull();
    }
    if(randomCompanies.purchaseUniques !== null){
        expect(typeof (randomCompanies.purchaseUniques), 'Type of purchaseUniques value should be number').toBe("number");
    }
    else {
        expect(randomCompanies.purchaseUniques, 'purchaseUniques value should be null').toBeNull();
    }
    if(randomCompanies.pastDuePoLines !== null){
        expect(typeof (randomCompanies.pastDuePoLines), 'Type of pastDuePoLines value should be number').toBe("number");
    }
    else {
        expect(randomCompanies.pastDuePoLines, 'pastDuePoLines value should be null').toBeNull();
    }
    if(randomCompanies.expediteItemLines !== null){
        expect(typeof (randomCompanies.expediteItemLines), 'Type of expediteItemLines value should be number').toBe("number");
    }
    else {
        expect(randomCompanies.expediteItemLines, 'expediteItemLines value should be null').toBeNull();
    }
    expect(randomCompanies.jobInitiator, 'Type of jobInitiator value should be null').toBeNull();
    expect(randomCompanies.qbfsSyncStatus, 'Type of qbfsSyncStatus value should be null').toBeNull();
    expect(typeof (randomCompanies.isNotifyingAfterSync), 'Type of isNotifyingAfterSync value should be boolean').toBe("boolean");
    expect(typeof (randomCompanies.isNotifyingAfterForecast), 'Type of isNotifyingAfterForecast value should be boolean').toBe("boolean");
    expect(randomCompanies.isLostSaleTracking, 'Type of isLostSaleTracking value should be null').toBeNull();
    if(randomCompanies.isLocked !== null){
        expect(typeof (randomCompanies.isLocked), 'Type of isLocked value should be boolean').toBe("boolean");
    }
    else {
        expect(randomCompanies.isLocked, 'isLocked value should be null').toBeNull();
    }
    expect(typeof (randomCompanies.isPromptedOnLogin), 'Type of isPromptedOnLogin value should be boolean').toBe("boolean");
    expect(typeof (randomCompanies.displayRestockAMZ), 'Type of isNotifyingAfterForecast value should be boolean').toBe("boolean");
    if(randomCompanies.phone !== null){
        expect(typeof (randomCompanies.phone), 'Type of phone value should be number').toBe("number");
    }
    else {
        expect(randomCompanies.phone, 'phone value should be null').toBeNull();
    }
    expect(randomCompanies.fax, 'Type of fax value should be null').toBeNull();
    expect(randomCompanies.website, 'Type of website value should be null').toBeNull();
    if(randomCompanies.addressShippingUuid !== null){
        expect(typeof (randomCompanies.addressShippingUuid), 'Type of addressShippingUuid value should be string').toBe("string");
    }
    else {
        expect(randomCompanies.addressShippingUuid, 'addressShippingUuid value should be null').toBeNull();
    }
    if(randomCompanies.addressBillingUuid !== null){
        expect(typeof (randomCompanies.addressBillingUuid), 'Type of addressBillingUuid value should be string').toBe("string");
    }
    else {
        expect(randomCompanies.addressBillingUuid, 'addressBillingUuid value should be null').toBeNull();
    }
    if(randomCompanies.criticalErrorCode !== null){
        expect(typeof (randomCompanies.criticalErrorCode), 'Type of criticalErrorCode value should be string').toBe("string");
    }
    else {
        expect(randomCompanies.criticalErrorCode, 'criticalErrorCode value should be null').toBeNull();
    }
    if(randomCompanies.accessToken !== null){
        expect(typeof (randomCompanies.accessToken), 'Type of accessToken value should be string').toBe("string");
    }
    else {
        expect(randomCompanies.accessToken, 'accessToken value should be null').toBeNull();
    }
    if(randomCompanies.refreshToken !== null){
        expect(typeof (randomCompanies.refreshToken), 'Type of accessToken value should be string').toBe("string");
    }
    else {
        expect(randomCompanies.refreshToken, 'accessToken value should be null').toBeNull();
    }
    if (randomCompanies.companyPreferences.length == 0) {
        expect(typeof (randomCompanies.companyPreferences), 'Type of companyPreferences value should be object').toBe("object");   
    }
    expect(typeof (randomCompanies.authorizationCode), 'Type of authorizationCode value should be string').toBe("string");
    expect(typeof (randomCompanies.inventorySourcePreference), 'Type of inventorySourcePreference value should be string').toBe("string");
    expect(typeof (randomCompanies.restockModel), 'Type of restockModel value should be string').toBe("string");
    expect(typeof (randomCompanies.localLeadTime), 'Type of localLeadTime value should be number').toBe("number");
    expect(typeof (randomCompanies.targetQtyOnHandMin), 'Type of targetQtyOnHandMin value should be number').toBe("number");
    expect(typeof (randomCompanies.targetQtyOnHandMax), 'Type of targetQtyOnHandMax value should be number').toBe("number");
    expect(typeof (randomCompanies.salesVelocityType), 'Type of salesVelocityType value should be string').toBe("string");
    if (randomCompanies.salesVelocitySettingData.length > 0) {
        expect(typeof (randomCompanies.salesVelocitySettingData), 'Type of salesVelocitySettingData value should be object').toBe("object");
        expect(typeof (randomCompanies.salesVelocitySettingData), 'Type of each ratinhs value should be object').toBe("object");
        expect(typeof (randomCompanies.salesVelocitySettingData.percent2Day), 'Type of percent2Day value should be number').toBe("number");
        expect(typeof (randomCompanies.salesVelocitySettingData.percent7Day), 'Type of percent7Day value should be number').toBe("number");
        expect(typeof (randomCompanies.salesVelocitySettingData.percent30Day), 'Type of percent30Day value should be number').toBe("number");
        expect(typeof (randomCompanies.salesVelocitySettingData.percent60Day), 'Type of percent60Day value should be number').toBe("number");
        expect(typeof (randomCompanies.salesVelocitySettingData.percent90Day), 'Type of percent90Day value should be number').toBe("number");
        expect(typeof (randomCompanies.salesVelocitySettingData.percentForecasted), 'Type of percent7Day value should be number').toBe("number");
        expect(typeof (randomCompanies.salesVelocitySettingData.percent180Day), 'Type of percent7Day value should be number').toBe("number");
    }
    if(randomCompanies.advanceJobsTo !== null){
        expect(Date.parse(randomCompanies.advanceJobsTo), 'advanceJobsTo in response should be date').not.toBeNaN();
    }
    else {
        expect(randomCompanies.advanceJobsTo, 'advanceJobsTo value should be null').toBeNull();
    }
    expect(typeof (randomCompanies.jobProcessing), 'Type of jobProcessing value should be boolean').toBe("boolean");
    expect(typeof (randomCompanies.purchasingSalesVelocityType), 'Type of purchasingSalesVelocityType value should be string').toBe("string");
    if (randomCompanies.purchasingSalesVelocitySettingData.length > 0) {
        expect(typeof (randomCompanies.purchasingSalesVelocitySettingData), 'Type of purchasingSalesVelocitySettingData value should be object').toBe("object");
        expect(typeof (randomCompanies.purchasingSalesVelocitySettingData), 'Type of each ratinhs value should be object').toBe("object");
        expect(typeof (randomCompanies.purchasingSalesVelocitySettingData.percent2Day), 'Type of percent2Day value should be number').toBe("number");
        expect(typeof (randomCompanies.purchasingSalesVelocitySettingData.percent7Day), 'Type of percent7Day value should be number').toBe("number");
        expect(typeof (randomCompanies.purchasingSalesVelocitySettingData.percent30Day), 'Type of percent30Day value should be number').toBe("number");
        expect(typeof (randomCompanies.purchasingSalesVelocitySettingData.percent60Day), 'Type of percent60Day value should be number').toBe("number");
        expect(typeof (randomCompanies.purchasingSalesVelocitySettingData.percent90Day), 'Type of percent90Day value should be number').toBe("number");
        expect(typeof (randomCompanies.purchasingSalesVelocitySettingData.percentForecasted), 'Type of percent7Day value should be number').toBe("number");
        expect(typeof (randomCompanies.purchasingSalesVelocitySettingData.percent180Day), 'Type of percent7Day value should be number').toBe("number");
    }
    expect(typeof (randomCompanies.pendingOrderToggle), 'Type of pendingOrderToggle value should be boolean').toBe("boolean");
    expect(Date.parse(randomCompanies.created_at), 'created_at in response should be date').not.toBeNaN();
    expect(Date.parse(randomCompanies.updated_at), 'updated_at in response should be date').not.toBeNaN();
    expect(typeof (randomCompanies.disabledFeatures), 'Type of disabledFeatures value should be object').toBe("object");
    
})

Then('{} checks {} and other values in response of random companies are correct', async function (actor, userId: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(randomCompanies.companyType);
    expect(randomCompanies.companyKey).not.toBeNaN();
    expect(randomCompanies.companyName).not.toBeNaN();
})



