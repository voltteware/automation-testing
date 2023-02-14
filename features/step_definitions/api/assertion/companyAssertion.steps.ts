import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as companiesRequest from '../../../../src/api/request/administration.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";

Then('{} checks data type of common values in company object are correct', async function (actor: string) {
    expect(typeof (this.responseBodyOfACompanyObject.companyType), 'Type of companyType value should be string').toBe("string");
    expect(typeof (this.responseBodyOfACompanyObject.companyKey), 'Type of companyKey value should be string').toBe("string");
    expect(typeof (this.responseBodyOfACompanyObject.companyName), 'Type of companyName value should be string').toBe("string");
    expect(typeof (this.responseBodyOfACompanyObject.forecastKey), 'Type of forecastKey value should be string').toBe("string");
    expect(typeof (this.responseBodyOfACompanyObject.forecastName), 'Type of forecastName value should be string').toBe("string");
    expect(typeof (this.responseBodyOfACompanyObject.moq), 'Type of moq value should be number').toBe("number");
    expect(typeof (this.responseBodyOfACompanyObject.leadTime), 'Type of leadTime value should be number').toBe("number");
    expect(typeof (this.responseBodyOfACompanyObject.orderInterval), 'Type of orderInterval value should be number').toBe("number");
    expect(typeof (this.responseBodyOfACompanyObject.serviceLevel), 'Type of serviceLevel value should be number').toBe("number");
    if (this.responseBodyOfACompanyObject.email !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.email), 'Type of email value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfACompanyObject.email, 'Type of email value should be null').toBeNull();
    }

    if (this.responseBodyOfACompanyObject.lastForecastDate !== null) {
        expect(Date.parse(this.responseBodyOfACompanyObject.lastForecastDate), 'lastForecastDate in response should be date').not.toBeNull();
    }
    else {
        expect(this.responseBodyOfACompanyObject.lastForecastDate, 'Type of lastForecastDate value should be null').toBeNull();
    }
    if (this.responseBodyOfACompanyObject.lastSyncDate !== null) {
        expect(Date.parse(this.responseBodyOfACompanyObject.lastSyncDate), 'lastSyncDate in response should be date').not.toBeNull();
    }
    else {
        expect(this.responseBodyOfACompanyObject.lastSyncDate, 'Type of lastSyncDate value should be null').toBeNull();
    }
    expect(Date.parse(this.responseBodyOfACompanyObject.createdAt), 'createdAt in response should be date').not.toBeNull();
    expect(Date.parse(this.responseBodyOfACompanyObject.updatedAt), 'updatedAt in response should be date').not.toBeNull();
    expect(Date.parse(this.responseBodyOfACompanyObject.updatedAt), 'updatedAt in response should be date').not.toBeNull();
    // Check shipmentLastRefresh
    if (this.responseBodyOfACompanyObject.shipmentLastRefresh !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.shipmentLastRefresh), 'Type of shipmentLastRefresh value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfACompanyObject.shipmentLastRefresh, 'shipmentLastRefresh value should be null').toBeNull();
    }
    // Check sellerId
    if (this.responseBodyOfACompanyObject.sellerId !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.sellerId), 'Type of sellerId value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfACompanyObject.sellerId, 'sellerId value should be null').toBeNull();
    }
    // Check marketplaceId
    if (this.responseBodyOfACompanyObject.marketplaceId !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.marketplaceId), 'Type of marketplaceId value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfACompanyObject.marketplaceId, 'marketplaceId value should be null').toBeNull();
    }
    // Check mwsAuthToken
    if (this.responseBodyOfACompanyObject.mwsAuthToken !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.mwsAuthToken), 'Type of mwsAuthToken value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfACompanyObject.mwsAuthToken, 'mwsAuthToken value should be null').toBeNull();
    }
    if (this.responseBodyOfACompanyObject.ratings.length > 0) {
        expect(typeof (this.responseBodyOfACompanyObject.ratings), 'Type of ratings value should be object').toBe("object");
        const randomRating = this.responseBodyOfACompanyObject.ratings[Math.floor(Math.random() * this.responseBodyOfACompanyObject.ratings.length)];
        expect(typeof (randomRating), 'Type of each ratinhs value should be object').toBe("object");
        expect(typeof (randomRating.id), 'Type of ratings id value should be string').toBe("string");
        expect(typeof (randomRating.value), 'Type of ratings value should be number').toBe("number");
    }
    expect(typeof (this.responseBodyOfACompanyObject.spikePercent), 'Type of spikePercent value should be number').toBe("number");
    expect(typeof (this.responseBodyOfACompanyObject.plungePercent), 'Type of plungePercent value should be number').toBe("number");
    expect(typeof (this.responseBodyOfACompanyObject.isManualInventory), 'Type of isManualInventory value should be boolean').toBe("boolean");
    if (this.responseBodyOfACompanyObject.requestsOnboarding !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.requestsOnboarding), 'Type of requestsOnboarding value should be boolean').toBe("boolean");
    }
    else {
        expect(this.responseBodyOfACompanyObject.requestsOnboarding, 'customerId value should be null').toBeNull();
    }
    if (this.responseBodyOfACompanyObject.customerId !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.customerId), 'Type of customerId value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfACompanyObject.customerId, 'customerId value should be null').toBeNull();
    }
    if (this.responseBodyOfACompanyObject.subscriptionId !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.subscriptionId), 'Type of subscriptionId value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfACompanyObject.subscriptionId, 'subscriptionId value should be null').toBeNull();
    }
    if (this.responseBodyOfACompanyObject.subscriptionStatus !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.subscriptionStatus), 'Type of subscriptionStatus value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfACompanyObject.subscriptionStatus, 'subscriptionStatus value should be null').toBeNull();
    }
    if (this.responseBodyOfACompanyObject.purchaseItems !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.purchaseItems), 'Type of purchaseItems value should be number').toBe("number");
    }
    else {
        expect(this.responseBodyOfACompanyObject.purchaseItems, 'purchaseItems value should be null').toBeNull();
    }
    if (this.responseBodyOfACompanyObject.purchasePrice !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.purchasePrice), 'Type of purchasePrice value should be number').toBe("number");
    }
    else {
        expect(this.responseBodyOfACompanyObject.purchasePrice, 'purchasePrice value should be null').toBeNull();
    }
    if (this.responseBodyOfACompanyObject.purchasePriceWithMoq !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.purchasePriceWithMoq), 'Type of purchasePriceWithMoq value should be number').toBe("number");
    }
    else {
        expect(this.responseBodyOfACompanyObject.purchasePriceWithMoq, 'purchasePriceWithMoq value should be null').toBeNull();
    }
    if (this.responseBodyOfACompanyObject.purchaseUniques !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.purchaseUniques), 'Type of purchaseUniques value should be number').toBe("number");
    }
    else {
        expect(this.responseBodyOfACompanyObject.purchaseUniques, 'purchaseUniques value should be null').toBeNull();
    }
    if (this.responseBodyOfACompanyObject.pastDuePoLines !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.pastDuePoLines), 'Type of pastDuePoLines value should be number').toBe("number");
    }
    else {
        expect(this.responseBodyOfACompanyObject.pastDuePoLines, 'pastDuePoLines value should be null').toBeNull();
    }
    if (this.responseBodyOfACompanyObject.expediteItemLines !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.expediteItemLines), 'Type of expediteItemLines value should be number').toBe("number");
    }
    else {
        expect(this.responseBodyOfACompanyObject.expediteItemLines, 'expediteItemLines value should be null').toBeNull();
    }
    expect(this.responseBodyOfACompanyObject.jobInitiator, 'Type of jobInitiator value should be null').toBeNull();
    expect(this.responseBodyOfACompanyObject.qbfsSyncStatus, 'Type of qbfsSyncStatus value should be null').toBeNull();
    expect(typeof (this.responseBodyOfACompanyObject.isNotifyingAfterSync), 'Type of isNotifyingAfterSync value should be boolean').toBe("boolean");
    expect(typeof (this.responseBodyOfACompanyObject.isNotifyingAfterForecast), 'Type of isNotifyingAfterForecast value should be boolean').toBe("boolean");
    if (this.responseBodyOfACompanyObject.isLostSaleTracking !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.isLostSaleTracking), 'Type of isLostSaleTracking value should be boolean').toBe("boolean");
    }
    else {
        expect(this.responseBodyOfACompanyObject.isLostSaleTracking, 'Type of isLostSaleTracking value should be null').toBeNull();
    }
    if (this.responseBodyOfACompanyObject.isLocked !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.isLocked), 'Type of isLocked value should be boolean').toBe("boolean");
    }
    else {
        expect(this.responseBodyOfACompanyObject.isLocked, 'isLocked value should be null').toBeNull();
    }
    expect(typeof (this.responseBodyOfACompanyObject.isPromptedOnLogin), 'Type of isPromptedOnLogin value should be boolean').toBe("boolean");
    expect(typeof (this.responseBodyOfACompanyObject.displayRestockAMZ), 'Type of isNotifyingAfterForecast value should be boolean').toBe("boolean");
    if (this.responseBodyOfACompanyObject.phone !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.phone), 'Type of phone value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfACompanyObject.phone, 'phone value should be null').toBeNull();
    }
    expect(this.responseBodyOfACompanyObject.fax, 'Type of fax value should be null').toBeNull();
    expect(this.responseBodyOfACompanyObject.website, 'Type of website value should be null').toBeNull();
    if (this.responseBodyOfACompanyObject.addressShippingUuid !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.addressShippingUuid), 'Type of addressShippingUuid value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfACompanyObject.addressShippingUuid, 'addressShippingUuid value should be null').toBeNull();
    }
    if (this.responseBodyOfACompanyObject.addressBillingUuid !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.addressBillingUuid), 'Type of addressBillingUuid value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfACompanyObject.addressBillingUuid, 'addressBillingUuid value should be null').toBeNull();
    }
    if (this.responseBodyOfACompanyObject.criticalErrorCode !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.criticalErrorCode), 'Type of criticalErrorCode value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfACompanyObject.criticalErrorCode, 'criticalErrorCode value should be null').toBeNull();
    }
    expect(typeof (this.responseBodyOfACompanyObject.authorizationCode), 'Type of authorizationCode value should be string').toBe("string");
    expect(typeof (this.responseBodyOfACompanyObject.inventorySourcePreference), 'Type of inventorySourcePreference value should be string').toBe("string");
    expect(typeof (this.responseBodyOfACompanyObject.restockModel), 'Type of restockModel value should be string').toBe("string");
    expect(typeof (this.responseBodyOfACompanyObject.localLeadTime), 'Type of localLeadTime value should be number').toBe("number");
    expect(typeof (this.responseBodyOfACompanyObject.targetQtyOnHandMin), 'Type of targetQtyOnHandMin value should be number').toBe("number");
    expect(typeof (this.responseBodyOfACompanyObject.targetQtyOnHandMax), 'Type of targetQtyOnHandMax value should be number').toBe("number");
    expect(typeof (this.responseBodyOfACompanyObject.salesVelocityType), 'Type of salesVelocityType value should be string').toBe("string");
    if (this.responseBodyOfACompanyObject.salesVelocitySettingData.length > 0) {
        expect(typeof (this.responseBodyOfACompanyObject.salesVelocitySettingData), 'Type of salesVelocitySettingData value should be object').toBe("object");
        expect(typeof (this.responseBodyOfACompanyObject.salesVelocitySettingData), 'Type of each ratinhs value should be object').toBe("object");
        expect(typeof (this.responseBodyOfACompanyObject.salesVelocitySettingData.percent2Day), 'Type of percent2Day value should be number').toBe("number");
        expect(typeof (this.responseBodyOfACompanyObject.salesVelocitySettingData.percent7Day), 'Type of percent7Day value should be number').toBe("number");
        expect(typeof (this.responseBodyOfACompanyObject.salesVelocitySettingData.percent30Day), 'Type of percent30Day value should be number').toBe("number");
        expect(typeof (this.responseBodyOfACompanyObject.salesVelocitySettingData.percent60Day), 'Type of percent60Day value should be number').toBe("number");
        expect(typeof (this.responseBodyOfACompanyObject.salesVelocitySettingData.percent90Day), 'Type of percent90Day value should be number').toBe("number");
        expect(typeof (this.responseBodyOfACompanyObject.salesVelocitySettingData.percentForecasted), 'Type of percent7Day value should be number').toBe("number");
        expect(typeof (this.responseBodyOfACompanyObject.salesVelocitySettingData.percent180Day), 'Type of percent7Day value should be number').toBe("number");
    }
    if (this.responseBodyOfACompanyObject.advanceJobsTo !== null) {
        expect(Date.parse(this.responseBodyOfACompanyObject.advanceJobsTo), 'advanceJobsTo in response should be date').not.toBeNull();
    }
    else {
        expect(this.responseBodyOfACompanyObject.advanceJobsTo, 'advanceJobsTo value should be null').toBeNull();
    }
    expect(typeof (this.responseBodyOfACompanyObject.jobProcessing), 'Type of jobProcessing value should be boolean').toBe("boolean");
    expect(typeof (this.responseBodyOfACompanyObject.purchasingSalesVelocityType), 'Type of purchasingSalesVelocityType value should be string').toBe("string");
    if (this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.length > 0) {
        expect(typeof (this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData), 'Type of purchasingSalesVelocitySettingData value should be object').toBe("object");
        expect(typeof (this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData), 'Type of each ratinhs value should be object').toBe("object");
        expect(typeof (this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent2Day), 'Type of percent2Day value should be number').toBe("number");
        expect(typeof (this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent7Day), 'Type of percent7Day value should be number').toBe("number");
        expect(typeof (this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent30Day), 'Type of percent30Day value should be number').toBe("number");
        expect(typeof (this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent60Day), 'Type of percent60Day value should be number').toBe("number");
        expect(typeof (this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent90Day), 'Type of percent90Day value should be number').toBe("number");
        expect(typeof (this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percentForecasted), 'Type of percent7Day value should be number').toBe("number");
        expect(typeof (this.responseBodyOfACompanyObject.purchasingSalesVelocitySettingData.percent180Day), 'Type of percent7Day value should be number').toBe("number");
    }
    expect(typeof (this.responseBodyOfACompanyObject.pendingOrderToggle), 'Type of pendingOrderToggle value should be boolean').toBe("boolean");
    expect(Date.parse(this.responseBodyOfACompanyObject.created_at), 'created_at in response should be date').not.toBeNull();
    expect(Date.parse(this.responseBodyOfACompanyObject.updated_at), 'updated_at in response should be date').not.toBeNull();
    expect(typeof (this.responseBodyOfACompanyObject.disabledFeatures), 'Type of disabledFeatures value should be object').toBe("object");
})

Then('{} checks data type of tokens in response of get all companies are correct', async function (actor: string) {
    if (this.responseBodyOfACompanyObject.accessToken !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.accessToken), 'Type of accessToken value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfACompanyObject.accessToken, 'accessToken value should be null').toBeNull();
    }
    if (this.responseBodyOfACompanyObject.refreshToken !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.refreshToken), 'Type of refreshToken value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfACompanyObject.refreshToken, 'refreshToken value should be null').toBeNull();
    }
    if (this.responseBodyOfACompanyObject.companyPreferences.length == 0) {
        expect(typeof (this.responseBodyOfACompanyObject.companyPreferences), 'Type of companyPreferences value should be object').toBe("object");
    }
})

Then('{} checks data type of isAuthorized in response of get company by key are correct', async function (actor: string) {
    if (this.responseBodyOfACompanyObject.isAuthorized !== null) {
        expect(typeof (this.responseBodyOfACompanyObject.isAuthorized), 'Type of isAuthorized value should be boolean').toBe("boolean");
    }
    else {
        expect(this.responseBodyOfACompanyObject.isAuthorized, 'isAuthorized value should be null').toBeNull();
    }
})

Then('{} checks values in response of company are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfACompanyObject.companyType);
    expect(this.responseBodyOfACompanyObject.companyKey).not.toBeNull();
    expect(this.responseBodyOfACompanyObject.companyName).not.toBeNull();
    if (this.selectedCompany != null) {
        expect(this.responseBodyOfACompanyObject.companyKey).toBe(this.selectedCompany.companyKey);
        expect(this.responseBodyOfACompanyObject.companyType).toBe(this.selectedCompany.companyType);
        expect(this.responseBodyOfACompanyObject.companyName).toBe(this.selectedCompany.companyName);
    }
})



