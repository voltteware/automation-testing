import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import _ from "lodash";

Then('{} checks API contract essential types in supply object are correct', async function (actor: string) {
    expect(typeof (this.responseBodyOfASupplyObject.companyType), 'Type of companyType value should be string').toBe("string");
    expect(typeof (this.responseBodyOfASupplyObject.companyKey), 'Type of companyKey value should be string').toBe("string");
    expect(typeof (this.responseBodyOfASupplyObject.supplyUuid), 'Type of supplyUuid value should be string').toBe("string");
    expect(typeof (this.responseBodyOfASupplyObject.orderKey), 'Type of orderKey value should be string').toBe("string");
    expect(typeof (this.responseBodyOfASupplyObject.rowKey), 'Type of rowKey value should be string').toBe("string");
    expect(typeof (this.responseBodyOfASupplyObject.refNum), 'Type of refNum value should be string').toBe("string");
    expect(typeof (this.responseBodyOfASupplyObject.itemKey), 'Type of itemKey value should be string').toBe("string");
    expect(typeof (this.responseBodyOfASupplyObject.itemName), 'Type of itemName value should be string').toBe("string");
    expect(typeof (this.responseBodyOfASupplyObject.orderQty), 'Type of orderQty value should be number').toBe("number");
    expect(typeof (this.responseBodyOfASupplyObject.openQty), 'Type of openQty value should be number').toBe("number");
    if (this.responseBodyOfASupplyObject.purchasingSummariesUuid !== null) {
        expect(typeof (this.responseBodyOfASupplyObject.purchasingSummariesUuid), 'Type of docType value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfASupplyObject.purchasingSummariesUuid, 'purchasingSummariesUuid value should be null').toBeNull();
    }
    if (this.responseBodyOfASupplyObject.vendorName !== null) {
        expect(typeof (this.responseBodyOfASupplyObject.vendorName), 'Type of vendorName value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfASupplyObject.vendorName, 'vendorName value should be null').toBeNull();
    }
    if (this.responseBodyOfASupplyObject.vendorKey !== null) {
        expect(typeof (this.responseBodyOfASupplyObject.vendorKey), 'Type of vendorKey value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfASupplyObject.vendorKey, 'vendorKey value should be null').toBeNull();
    }
    if (this.responseBodyOfASupplyObject.documentUuid !== null) {
        expect(typeof (this.responseBodyOfASupplyObject.documentUuid), 'Type of documentUuid value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfASupplyObject.documentUuid, 'documentUuid value should be null').toBeNull();
    }
    if (this.responseBodyOfASupplyObject.reconciledStatus !== null) {
        expect(typeof (this.responseBodyOfASupplyObject.reconciledStatus), 'Type of reconciledStatus value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfASupplyObject.reconciledStatus, 'reconciledStatus value should be null').toBeNull();
    }
    if (this.responseBodyOfASupplyObject.asin !== null) {
        expect(typeof (this.responseBodyOfASupplyObject.asin), 'Type of asin value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfASupplyObject.asin, 'asin value should be null').toBeNull();
    }
    expect(Date.parse(this.responseBodyOfASupplyObject.dueDate), 'dueDate in response should be date').not.toBeNull();
    expect(Date.parse(this.responseBodyOfASupplyObject.docDate), 'docDate in response should be date').not.toBeNull();
})


