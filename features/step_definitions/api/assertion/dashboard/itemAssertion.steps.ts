import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import _ from "lodash";
import logger from '../../../../../src/Logger/logger';
import { itemSummaryResponseSchema } from '../dashboard/itemAssertionSchema';

Then('{} checks API contract in item summary object are correct', async function (actor: string) {
    if (this.
        getItemSummaryResponseBody.err !== null) {
        expect(typeof (this.getItemSummaryResponseBody.err), 'Type of err value should be string').toBe("string");
        logger.log('info', `Response GET Item Summary has err${this.getItemSummaryResponseBody.err}`);
        this.attach(`Response GET Item Summary has err${this.getItemSummaryResponseBody.err}`)
    }
    else {
        expect(this.getItemSummaryResponseBody.err, 'err value should be null').toBeNull();
    }

    itemSummaryResponseSchema.parse(this.getItemSummaryResponseBody);
    // expect(typeof (this.getItemSummaryResponseBody.model), 'Type of model value should be object').toBe("object");
    // expect(typeof (Number(this.getItemSummaryResponseBody.model.onHandCount)), 'Type of onHandCount value should be string').toBe("number");
    // expect(typeof (Number(this.getItemSummaryResponseBody.model.onHandThirdPartyCount)), 'Type of onHandThirdPartyCount value should be number').toBe("number");
    // expect(typeof (Number(this.getItemSummaryResponseBody.model.olderThan30DaysCount)), 'Type of olderThan30DaysCount value should be number').toBe("number");
    // expect(typeof (Number(this.getItemSummaryResponseBody.model.missingVendorCount)), 'Type of missingVendorCount value should be number').toBe("number");
})

Then('{} checks number Items Out of Stock in response of item summary is correct', async function (actor: string) {
    const onHandCount = Number(this.getItemSummaryResponseBody.model.onHandCount);
    expect(onHandCount, `onHandCount should be greater than or equal 0`).toBeGreaterThanOrEqual(0);
    const expectedOnHandCount = this.getAllItemsResponseBody.filter((item: any) => item.onHand == 0 || item.onHand == null).length;
    expect(onHandCount, `onHandCount should be equal ${expectedOnHandCount}`).toEqual(expectedOnHandCount);
})

Then('{} checks number Items Out of Stock - Warehouse in response of item summary is correct', async function (actor: string) {
    const onHandThirdPartyCount = Number(this.getItemSummaryResponseBody.model.onHandThirdPartyCount);
    expect(onHandThirdPartyCount, `onHandThirdPartyCount should be greater than or equal 0`).toBeGreaterThanOrEqual(0);
    const expectedOnHandThirdPartyCount = this.getAllItemsResponseBody.filter((item: any) => item.onHandThirdParty == 0 || item.onHandThirdParty == null).length;
    expect(onHandThirdPartyCount, `onHandThirdPartyCount should be equal ${expectedOnHandThirdPartyCount}`).toEqual(expectedOnHandThirdPartyCount);
})

Then('{} checks number New Items last 30 days in response of item summary is correct', async function (actor: string) {
    const olderThan30DaysCount = Number(this.getItemSummaryResponseBody.model.olderThan30DaysCount);
    expect(olderThan30DaysCount, `olderThan30DaysCount should be greater than or equal 0`).toBeGreaterThanOrEqual(0);
    const last30Days = new Date(new Date().setDate(new Date().getDate() - 30));
    const expectedNewItemLast30Days = this.getAllItemsResponseBody.filter((item: any) => new Date(item.createdAt) >= new Date(last30Days)).length;
    expect(olderThan30DaysCount, `olderThan30DaysCount in response should be equal ${expectedNewItemLast30Days}`).toEqual(expectedNewItemLast30Days);
})

Then('{} checks number Items without Vendors Assigned in response of item summary is correct', async function (actor: string) {
    const missingVendorCount = Number(this.getItemSummaryResponseBody.model.missingVendorCount);
    expect(missingVendorCount, `missingVendorCount should be greater than or equal 0`).toBeGreaterThanOrEqual(0);
    const expectedmissingVendorCount = this.getAllItemsResponseBody.filter((item: any) => item.vendorKey == null).length;
    expect(missingVendorCount, `missingVendorCount should be equal ${expectedmissingVendorCount}`).toEqual(expectedmissingVendorCount);
})

Then('{} checks API contract essential types in item object are correct', async function (actor: string) {
    this.softAssert(typeof (this.responseBodyOfAItemObject.companyType) === "string", 'Type of companyType value should be string');
    this.softAssert(typeof (this.responseBodyOfAItemObject.companyKey) === "string", 'Type of companyKey value should be string');
    this.softAssert(typeof (this.responseBodyOfAItemObject.key) === "string", 'Type of key value should be string');
    if (this.responseBodyOfAItemObject.asin !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.asin) === "string", 'Type of asin value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.asin === null, 'asin value should be null');
    }

    if (this.responseBodyOfAItemObject.fnsku !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.fnsku) === "string", 'Type of fnsku value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.fnsku === null, 'fnsku value should be null');
    }
    
    this.softAssert(typeof (this.responseBodyOfAItemObject.fnsku) === "string", 'Type of fnsku value should be string');
    this.softAssert(typeof (this.responseBodyOfAItemObject.name) === "string", 'Type of name value should be string');
    this.softAssert(typeof (this.responseBodyOfAItemObject.packageWeight) === "number", 'Type of packageWeight value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.vendorPrice) === "number", 'Type of vendorPrice value should be number');
    if (this.responseBodyOfAItemObject.moq !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.moq) === "number", 'Type of moq value should be number');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.moq === null, 'moq value should be null');
    }

    if (this.responseBodyOfAItemObject.leadTime !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.leadTime) === "number", 'Type of leadTime value should be number');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.leadTime === null, 'leadTime value should be null');
    }

    if (this.responseBodyOfAItemObject.orderInterval !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.orderInterval) === "number", 'Type of orderInterval value should be number');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.orderInterval === null, 'orderInterval value should be null');
    }

    if (this.responseBodyOfAItemObject.serviceLevel !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.serviceLevel) === "number", 'Type of serviceLevel value should be number');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.serviceLevel === null, 'serviceLevel value should be null');
    }

    if (this.responseBodyOfAItemObject.skuNotes !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.skuNotes) === "string", 'Type of skuNotes value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.skuNotes === null, 'skuNotes value should be null');
    }

    if (this.responseBodyOfAItemObject.prepNotes !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.prepNotes) === "string", 'Type of prepNotes value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.prepNotes === null, 'prepNotes value should be null');
    }

    this.softAssert(typeof (this.responseBodyOfAItemObject.onHand) === "number", 'Type of onHand value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.onHandMin) === "number", 'Type of onHandMin value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.onHandThirdParty) === "number", 'Type of onHandThirdParty value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.onHandThirdPartyMin) === "number", 'Type of onHandThirdPartyMin value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.onHandFbm) === "number", 'Type of onHandFbm value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.supplierRebate) === "number", 'Type of supplierRebate value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.inboundShippingCost) === "number", 'Type of inboundShippingCost value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.reshippingCost) === "number", 'Type of reshippingCost value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.repackagingMaterialCost) === "number", 'Type of repackagingMaterialCost value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.repackingLaborCost) === "number", 'Type of repackingLaborCost value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.dimensionalWeight) === "number", 'Type of dimensionalWeight value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.forecastTags) === "object", 'Type of forecastTags value should be object');

    if (this.responseBodyOfAItemObject.vendorName !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.vendorName) === "string", 'Type of vendorName value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.vendorName === null, 'vendorName value should be null');
    }

    if (this.responseBodyOfAItemObject.hazmat !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.hazmat) === "string", 'Type of hazmat value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.hazmat === null, 'hazmat value should be null');
    }

    if (this.responseBodyOfAItemObject.description !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.description) === "string", 'Type of description value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.description === null, 'description value should be null');
    }

    if (this.responseBodyOfAItemObject.prepGuide !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.prepGuide) === "string", 'Type of prepGuide value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.prepGuide === null, 'prepGuide value should be null');
    }

    if (this.responseBodyOfAItemObject.vendorKey !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.vendorKey) === "string", 'Type of vendorKey value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.vendorKey === null, 'vendorKey value should be null');
    }

    if (this.responseBodyOfAItemObject.oversized !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.oversized) === "string", 'Type of oversized value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.oversized === null, 'oversized value should be null');
    }

    if (this.responseBodyOfAItemObject.category !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.category) === "string", 'Type of category value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.category === null, 'category value should be null');
    }

    if (this.responseBodyOfAItemObject.upc !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.upc) === "string", 'Type of upc value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.upc === null, 'upc value should be null');
    }

    if (this.responseBodyOfAItemObject.lotMultipleItemKey !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.lotMultipleItemKey) === "string", 'Type of lotMultipleItemKey value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.lotMultipleItemKey === null, 'lotMultipleItemKey value should be null');
    }

    if (this.responseBodyOfAItemObject.ean !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.ean) === "string", 'Type of ean value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.ean === null, 'ean value should be null');
    }

    if (this.responseBodyOfAItemObject.growthTrend !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.growthTrend) === "number", 'Type of growthTrend value should be number');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.growthTrend === null, 'growthTrend value should be null');
    }

    if (this.responseBodyOfAItemObject.lotMultipleItemName !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.lotMultipleItemName) === "string", 'Type of lotMultipleItemName value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.lotMultipleItemName === null, 'lotMultipleItemName value should be null');
    }

    this.softAssert(typeof (this.responseBodyOfAItemObject.rank) === "number", 'Type of rank value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.isHidden) === "boolean", 'Type of isHidden value should be boolean');
    this.softAssert(typeof (this.responseBodyOfAItemObject.useHistoryOverride) === "boolean", 'Type of useHistoryOverride value should be boolean');
    this.softAssert(typeof (this.responseBodyOfAItemObject.useLostSalesOverride) === "boolean", 'Type of useLostSalesOverride value should be boolean');
    this.softAssert(typeof (this.responseBodyOfAItemObject.lotMultipleQty) === "number", 'Type of lotMultipleQty value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.forecastDirty) === "boolean", 'Type of forecastDirty value should be boolean');
    this.softAssert(typeof (this.responseBodyOfAItemObject.tags) === "object", 'Type of tags value should be object');
    this.softAssert(typeof (this.responseBodyOfAItemObject.useBackfill) === "boolean", 'Type of useBackfill value should be boolean');
    this.softAssert(typeof (this.responseBodyOfAItemObject.inbound) === "number", 'Type of inbound value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.inboundPrice) === "number", 'Type of inboundPrice value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.inboundSalesLast30Days) === "number", 'Type of inboundSalesLast30Days value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.inboundAvailable) === "number", 'Type of inboundAvailable value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.inboundFcTransfer) === "number", 'Type of inboundFcTransfer value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.inboundFcProcessing) === "number", 'Type of inboundFcProcessing value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.inboundCustomerOrder) === "number", 'Type of inboundCustomerOrder value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.inboundUnfulfillable) === "number", 'Type of inboundUnfulfillable value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.inboundWorking) === "number", 'Type of inboundWorking value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.mwsFulfillmentFee) === "number", 'Type of mwsFulfillmentFee value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.reserved) === "number", 'Type of reserved value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.lowestFba) === "number", 'Type of lowestFba value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.lowestNonFba) === "number", 'Type of lowestNonFba value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.fbaFee) === "number", 'Type of fbaFee value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.newBuyBox) === "number", 'Type of newBuyBox value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.inboundShipped) === "number", 'Type of inboundShipped value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.inboundReceiving) === "number", 'Type of inboundReceiving value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.referralFee) === "number", 'Type of referralFee value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.listPrice) === "number", 'Type of listPrice value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.average7DayPrice) === "number", 'Type of average7DayPrice value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.isFbm) === "boolean", 'Type of isFbm value should be boolean');
    this.softAssert(typeof (this.responseBodyOfAItemObject.itemHistoryLength) === "number", 'Type of itemHistoryLength value should be number');
    this.softAssert(typeof (this.responseBodyOfAItemObject.itemHistoryLengthInDay) === "number", 'Type of itemHistoryLengthInDay value should be number');

    if (this.responseBodyOfAItemObject.tag !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.tag) === "string", 'Type of tag value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.tag === null, 'tag value should be null');
    }

    if (this.responseBodyOfAItemObject.inventorySourcePreference !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.inventorySourcePreference) === "string", 'Type of inventorySourcePreference value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.inventorySourcePreference === null, 'inventorySourcePreference value should be null');
    }

    if (this.responseBodyOfAItemObject.variableClosingFee !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.variableClosingFee) === "string", 'Type of variableClosingFee value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.variableClosingFee === null, 'variableClosingFee value should be null');
    }

    if (this.responseBodyOfAItemObject.imageUrl !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.imageUrl) === "string", 'Type of imageUrl value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.imageUrl === null, 'imageUrl value should be null');
    }

    if (this.responseBodyOfAItemObject.fba !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.fba) === "string", 'Type of fba value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.fba === null, 'fba value should be null');
    }

    if (this.responseBodyOfAItemObject.nonFba !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.nonFba) === "string", 'Type of nonFba value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.nonFba === null, 'nonFba value should be null');
    }

    if (this.responseBodyOfAItemObject.soldBy !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.soldBy) === "string", 'Type of soldBy value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.soldBy === null, 'soldBy value should be null');
    }

    if (this.responseBodyOfAItemObject.condition !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.condition) === "string", 'Type of condition value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.condition === null, 'condition value should be null');
    }

    if (this.responseBodyOfAItemObject.syncedFields !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.syncedFields) === "string", 'Type of syncedFields value should be string');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.syncedFields === null, 'syncedFields value should be null');
    }

    if (this.responseBodyOfAItemObject.inboundAlert !== null) {
        this.softAssert(typeof (this.responseBodyOfAItemObject.inboundAlert) === "number", 'Type of inboundAlert value should be number');
    }
    else {
        this.softAssert(this.responseBodyOfAItemObject.inboundAlert === null, 'inboundAlert value should be null');
    }

    this.softAssert(Date.parse(this.responseBodyOfAItemObject.createdAt) != null, 'createdAt in response should be date');
    this.softAssert(Date.parse(this.responseBodyOfAItemObject.updated_at) != null, 'updated_at in response should be date');
    this.softAssert(Date.parse(this.responseBodyOfAItemObject.created_at) != null, 'created_at in response should be date');
    this.softAssert(Date.parse(this.responseBodyOfAItemObject.warehouseQtyUpdatedDate) != null, 'warehouseQtyUpdatedDate in response should be date');
    // // Avoid running further if there were soft assertion failures.
    expect(this.countErrors).toBe(0)
})

Then(`{} checks API contract get count items are correct`, async function (actor) {
    expect(typeof (this.getCountItemsActiveResponseBody), 'Get Count Items in response is a number').toBe("number");
})

Then(`{} checks the response of get item list returns {}`, async function (actor, expected: string) {
    expect(this.getItemsResponseBody).toStrictEqual([]);
});


