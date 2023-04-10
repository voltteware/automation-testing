import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import _ from "lodash";
import logger from '../../../../src/Logger/logger';

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

    expect(typeof (this.getItemSummaryResponseBody.model), 'Type of model value should be object').toBe("object");
    expect(typeof (Number(this.getItemSummaryResponseBody.model.onHandCount)), 'Type of onHandCount value should be string').toBe("number");
    expect(typeof (Number(this.getItemSummaryResponseBody.model.onHandThirdPartyCount)), 'Type of onHandThirdPartyCount value should be number').toBe("number");
    expect(typeof (Number(this.getItemSummaryResponseBody.model.olderThan30DaysCount)), 'Type of olderThan30DaysCount value should be number').toBe("number");
    expect(typeof (Number(this.getItemSummaryResponseBody.model.missingVendorCount)), 'Type of missingVendorCount value should be number').toBe("number");
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
    expect(typeof (this.responseBodyOfAItemObject.companyType), 'Type of companyType value should be string').toBe("string");
    expect(typeof (this.responseBodyOfAItemObject.companyKey), 'Type of companyKey value should be string').toBe("string");
    expect(typeof (this.responseBodyOfAItemObject.key), 'Type of key value should be string').toBe("string");
    expect(typeof (this.responseBodyOfAItemObject.asin), 'Type of name value should be string').toBe("string");
    expect(typeof (this.responseBodyOfAItemObject.fnsku), 'Type of name value should be string').toBe("string");
    expect(typeof (this.responseBodyOfAItemObject.name), 'Type of name value should be string').toBe("string");
    expect(typeof (this.responseBodyOfAItemObject.packageWeight), 'Type of packageWeight value should be number').toBe("number"); 
    expect(typeof (this.responseBodyOfAItemObject.vendorPrice), 'Type of vendorPrice value should be number').toBe("number");
    if (this.responseBodyOfAItemObject.moq !== null) {
        expect(typeof (this.responseBodyOfAItemObject.moq), 'Type of moq value should be number').toBe("number");
    }
    else {
        expect(this.responseBodyOfAItemObject.moq, 'moq value should be null').toBeNull();
    }
    if (this.responseBodyOfAItemObject.leadTime !== null) {
        expect(typeof (this.responseBodyOfAItemObject.leadTime), 'Type of leadTime value should be number').toBe("number");
    }
    else {
        expect(this.responseBodyOfAItemObject.leadTime, 'leadTime value should be null').toBeNull();
    }
    if (this.responseBodyOfAItemObject.orderInterval !== null) {
        expect(typeof (this.responseBodyOfAItemObject.orderInterval), 'Type of orderInterval value should be number').toBe("number");
    }
    else {
        expect(this.responseBodyOfAItemObject.orderInterval, 'orderInterval value should be null').toBeNull();
    }
    if (this.responseBodyOfAItemObject.serviceLevel !== null) {
        expect(typeof (this.responseBodyOfAItemObject.serviceLevel), 'Type of serviceLevel value should be number').toBe("number");
    }
    else {
        expect(this.responseBodyOfAItemObject.serviceLevel, 'serviceLevel value should be null').toBeNull();
    }
    if (this.responseBodyOfAItemObject.skuNotes !== null) {
        expect(typeof (this.responseBodyOfAItemObject.skuNotes), 'Type of skuNotes value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfAItemObject.skuNotes, 'skuNotes value should be null').toBeNull();
    }
    if (this.responseBodyOfAItemObject.prepNotes !== null) {
        expect(typeof (this.responseBodyOfAItemObject.prepNotes), 'Type of prepNotes value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfAItemObject.prepNotes, 'prepNotes value should be null').toBeNull();
    }
    expect(typeof (this.responseBodyOfAItemObject.onHand), 'Type of onHand value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.onHandMin), 'Type of onHandMin value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.onHandThirdParty), 'Type of onHandThirdParty value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.onHandThirdPartyMin), 'Type of onHandThirdPartyMin value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.onHandFbm), 'Type of onHandFbm value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.supplierRebate), 'Type of supplierRebate value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.inboundShippingCost), 'Type of inboundShippingCost value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.reshippingCost), 'Type of reshippingCost value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.repackagingMaterialCost), 'Type of repackagingMaterialCost value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.repackingLaborCost), 'Type of repackingLaborCost value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.dimensionalWeight), 'Type of dimensionalWeight value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.forecastTags), 'Type of forecastTags value should be object').toBe("object");
    if (this.responseBodyOfAItemObject.vendorName !== null) {
        expect(typeof (this.responseBodyOfAItemObject.vendorName), 'Type of vendorName value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfAItemObject.vendorName, 'vendorName value should be null').toBeNull();
    }
    if (this.responseBodyOfAItemObject.hazmat !== null) {
        expect(typeof (this.responseBodyOfAItemObject.hazmat), 'Type of hazmat value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfAItemObject.hazmat, 'hazmat value should be null').toBeNull();
    }
    
    if (this.responseBodyOfAItemObject.description !== null) {
        expect(typeof (this.responseBodyOfAItemObject.description), 'Type of description value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfAItemObject.description, 'description value should be null').toBeNull();
    }
    if (this.responseBodyOfAItemObject.prepGuide !== null) {
        expect(typeof (this.responseBodyOfAItemObject.prepGuide), 'Type of prepGuide value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfAItemObject.prepGuide, 'prepGuide value should be null').toBeNull();
    }
    if (this.responseBodyOfAItemObject.vendorKey !== null) {
        expect(typeof (this.responseBodyOfAItemObject.vendorKey), 'Type of vendorKey value should be string').toBe("string");   
    }
    else {
        expect(this.responseBodyOfAItemObject.vendorKey, 'vendorKey value should be null').toBeNull();
    }
    if (this.responseBodyOfAItemObject.oversized !== null) {
        expect(typeof (this.responseBodyOfAItemObject.oversized), 'Type of oversized value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfAItemObject.oversized, 'oversized value should be null').toBeNull();
    }
    if (this.responseBodyOfAItemObject.category !== null) {
        expect(typeof (this.responseBodyOfAItemObject.category), 'Type of category value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfAItemObject.category, 'category value should be null').toBeNull();
    }
    if (this.responseBodyOfAItemObject.upc !== null) {
        expect(typeof (this.responseBodyOfAItemObject.upc), 'upc value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfAItemObject.upc, 'upc value should be null').toBeNull();
    }
    if (this.responseBodyOfAItemObject.lotMultipleItemKey !== null) {
        expect(typeof (this.responseBodyOfAItemObject.lotMultipleItemKey), 'Type of lotMultipleItemKey value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfAItemObject.lotMultipleItemKey, 'lotMultipleItemKey value should be null').toBeNull();
    }
    if (this.responseBodyOfAItemObject.ean !== null) {
        expect(typeof (this.responseBodyOfAItemObject.ean), 'ean value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfAItemObject.ean, 'ean value should be null').toBeNull();
    }
    if (this.responseBodyOfAItemObject.growthTrend !== null) {
        expect(typeof (this.responseBodyOfAItemObject.growthTrend), 'Type of growthTrend value should be number').toBe("number");
    }
    else {
        expect(this.responseBodyOfAItemObject.growthTrend, 'growthTrend value should be null').toBeNull();
    }
    if (this.responseBodyOfAItemObject.lotMultipleItemName !== null) {
        expect(typeof (this.responseBodyOfAItemObject.lotMultipleItemName), 'Type of lotMultipleItemName value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfAItemObject.lotMultipleItemName, 'lotMultipleItemName value should be null').toBeNull();
    }
    expect(typeof (this.responseBodyOfAItemObject.rank), 'Type of rank value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.isHidden), 'Type of isHidden value should be boolean').toBe("boolean");
    expect(typeof (this.responseBodyOfAItemObject.useHistoryOverride), 'Type of useHistoryOverride value should be boolean').toBe("boolean");
    expect(typeof (this.responseBodyOfAItemObject.useLostSalesOverride), 'Type of useLostSalesOverride value should be boolean').toBe("boolean");
    expect(typeof (this.responseBodyOfAItemObject.lotMultipleQty), 'Type of lotMultipleQty value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.forecastDirty), 'Type of forecastDirty value should be boolean').toBe("boolean");
    expect(typeof (this.responseBodyOfAItemObject.tags), 'Type of tags value should be object').toBe("object");
    expect(typeof (this.responseBodyOfAItemObject.useBackfill), 'Type of useBackfill value should be boolean').toBe("boolean");
    expect(typeof (this.responseBodyOfAItemObject.inbound), 'Type of inbound value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.inboundPrice), 'Type of inboundPrice value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.inboundSalesLast30Days), 'Type of inboundSalesLast30Days value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.inboundAvailable), 'Type of inboundAvailable value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.inboundFcTransfer), 'Type of inboundFcTransfer value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.inboundFcProcessing), 'Type of inboundFcProcessing value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.inboundCustomerOrder), 'Type of inboundCustomerOrder value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.inboundUnfulfillable), 'Type of inboundUnfulfillable value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.inboundWorking), 'Type of inboundWorking value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.mwsFulfillmentFee), 'Type of mwsFulfillmentFee value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.reserved), 'Type of reserved value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.lowestFba), 'Type of lowestFba value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.lowestNonFba), 'Type of lowestNonFba value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.fbaFee), 'Type of fbaFee value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.newBuyBox), 'Type of newBuyBox value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.inboundShipped), 'Type of neinboundShippedwBuyBox value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.inboundReceiving), 'Type of inboundReceiving value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.referralFee), 'Type of referralFee value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.listPrice), 'Type of listPrice value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.average7DayPrice), 'Type of average7DayPrice value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.isFbm), 'Type of isFbm value should be boolean').toBe("boolean");
    expect(typeof (this.responseBodyOfAItemObject.itemHistoryLength), 'Type of itemHistoryLength value should be number').toBe("number");
    expect(typeof (this.responseBodyOfAItemObject.itemHistoryLengthInDay), 'Type of itemHistoryLengthInDay value should be number').toBe("number");
    if (this.responseBodyOfAItemObject.tag !== null) {
        expect(typeof (this.responseBodyOfAItemObject.tag), 'Type of tag value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfAItemObject.tag, 'tag value should be null').toBeNull();
    }
    if (this.responseBodyOfAItemObject.inventorySourcePreference !== null) {
        expect(typeof (this.responseBodyOfAItemObject.inventorySourcePreference), 'Type of inventorySourcePreference value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfAItemObject.inventorySourcePreference, 'inventorySourcePreference value should be null').toBeNull();
    }
    
    if (this.responseBodyOfAItemObject.variableClosingFee !== null) {
        expect(typeof (this.responseBodyOfAItemObject.variableClosingFee), 'Type of variableClosingFee value should be number').toBe("number");
    }
    else {
        expect(this.responseBodyOfAItemObject.variableClosingFee, 'variableClosingFee value should be null').toBeNull();
    }
    
    if (this.responseBodyOfAItemObject.imageUrl !== null) {
        expect(typeof (this.responseBodyOfAItemObject.imageUrl), 'Type of imageUrl value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfAItemObject.imageUrl, 'imageUrl value should be null').toBeNull();
    }
    if (this.responseBodyOfAItemObject.fba !== null) {
        expect(typeof (this.responseBodyOfAItemObject.fba), 'Type of fba value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfAItemObject.fba, 'fba value should be null').toBeNull();
    }
    if (this.responseBodyOfAItemObject.nonFba !== null) {
        expect(typeof (this.responseBodyOfAItemObject.nonFba), 'Type of nonFba value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfAItemObject.nonFba, 'nonFba value should be null').toBeNull();
    }
    if (this.responseBodyOfAItemObject.soldBy !== null) {
        expect(typeof (this.responseBodyOfAItemObject.soldBy), 'Type of soldBy value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfAItemObject.soldBy, 'soldBy value should be null').toBeNull();
    }
    if (this.responseBodyOfAItemObject.condition !== null) {
        expect(typeof (this.responseBodyOfAItemObject.condition), 'Type of condition value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfAItemObject.condition, 'condition value should be null').toBeNull();
    }
    if (this.responseBodyOfAItemObject.syncedFields !== null) {
        expect(typeof (this.responseBodyOfAItemObject.syncedFields), 'Type of syncedFields value should be string').toBe("string");
    }
    else {
        expect(this.responseBodyOfAItemObject.syncedFields, 'syncedFields value should be null').toBeNull();
    }
    if (this.responseBodyOfAItemObject.inboundAlert !== null) {
        expect(typeof (this.responseBodyOfAItemObject.inboundAlert), 'Type of inboundAlert value should be number').toBe("number");
    }
    else {
        expect(this.responseBodyOfAItemObject.inboundAlert, 'inboundAlert value should be null').toBeNull();
    }
    expect(Date.parse(this.responseBodyOfAItemObject.createdAt), 'createdAt in response should be date').not.toBeNull();
    expect(Date.parse(this.responseBodyOfAItemObject.updated_at), 'updated_at in response should be date').not.toBeNull();
    expect(Date.parse(this.responseBodyOfAItemObject.created_at), 'updated_at in response should be date').not.toBeNull();
    expect(Date.parse(this.responseBodyOfAItemObject.warehouseQtyUpdatedDate), 'updated_at in response should be date').not.toBeNull();
})

Then(`{} checks API contract get count items are correct`, async function (actor) {
    expect(typeof (this.getCountItemsActiveResponseBody), 'Get Count Items in response is a number').toBe("number");
})

Then(`{} checks the response of get item list returns {}`, async function (actor, expected: string) {
    expect(this.getItemsResponseBody).toStrictEqual([]);
});


