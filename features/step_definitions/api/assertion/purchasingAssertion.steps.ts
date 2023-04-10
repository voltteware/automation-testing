import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import logger from '../../../../src/Logger/logger';

import _ from "lodash";

// My Suggested
Then(`{} checks API contract get count summary by vendor are correct`, async function (actor) {
    expect(typeof (this.getCountSummaryByVendorResponseBody), 'Get Count Summary Vendor response is a number').toBe("number");
})

Then(`{} checks API contract get count items by vendor key are correct`, async function (actor) {
    expect(typeof (this.getCountItemsinPOResponseBody), 'Get Count Items By Vendor Key response is a number').toBe("number");
})

Then(`{} checks API contract get summary by vendor are correct`, async function (actor) {
    expect(typeof (this.getSummaryByVendorResponseBody[0].companyKey), 'companyKey response is a string').toBe("string");
    expect(typeof (this.getSummaryByVendorResponseBody[0].companyType), 'companyType response is a string').toBe("string");
    expect(typeof (this.getSummaryByVendorResponseBody[0].count_day), 'count_day response is a string').toBe("string");

    if (this.getSummaryByVendorResponseBody[0].earliestDueDate !== null) {
        expect(Date.parse(this.getSummaryByVendorResponseBody[0].earliestDueDate), 'earliestDueDate in response should be date').not.toBeNull();
    }
    else {
        expect(this.getSummaryByVendorResponseBody[0].earliestDueDate, 'earliestDueDate value should be null').toBeNull();
    }

    if (this.getSummaryByVendorResponseBody[0].earliestRecommendedOrderDate !== null) {
        expect(Date.parse(this.getSummaryByVendorResponseBody[0].earliestRecommendedOrderDate), 'earliestRecommendedOrderDate in response should be date').not.toBeNull();
    }
    else {
        expect(this.getSummaryByVendorResponseBody[0].earliestRecommendedOrderDate, 'earliestRecommendedOrderDate value should be null').toBeNull();
    }

    expect(typeof (this.getSummaryByVendorResponseBody[0].totalPrice), 'totalPrice response is a number').toBe("number");
    expect(typeof (this.getSummaryByVendorResponseBody[0].totalQty), 'totalQty response is a number').toBe("number");
    expect(typeof (this.getSummaryByVendorResponseBody[0].uniqueItems), 'uniqueItems response is a string').toBe("string");

    if (this.getSummaryByVendorResponseBody[0].vendorKey !== null) {
        expect(typeof (this.getSummaryByVendorResponseBody[0].vendorKey), 'vendorKey in response should be string').toBe("string");
    }
    else {
        expect(this.getSummaryByVendorResponseBody[0].vendorKey, 'vendorKey value should be null').toBeNull();
    }

    if (this.getSummaryByVendorResponseBody[0].vendorName !== null) {
        expect(typeof (this.getSummaryByVendorResponseBody[0].vendorName), 'vendorName in response should be string').toBe("string");
    }
    else {
        expect(this.getSummaryByVendorResponseBody[0].vendorName, 'vendorName value should be null').toBeNull();
    }
})

Then(`{} checks API contract get total price, total qty and unique items on Purchasing My Suggest are correct`, async function (actor) {
    if (this.getSummaryByVendorByCompanyKeyAndTypeResponseBody.err !== null) {
        expect(typeof (this.getSummaryByVendorByCompanyKeyAndTypeResponseBody.err), 'err in response is a string').toBe("string");
    }
    else {
        expect(this.getSummaryByVendorByCompanyKeyAndTypeResponseBody.err, 'err value should be null').toBeNull();
    }

    expect(typeof (this.getSummaryByVendorByCompanyKeyAndTypeResponseBody.model), 'model response is a object').toBe("object");
    expect(typeof (this.getSummaryByVendorByCompanyKeyAndTypeResponseBody.model.count), 'count response is a string').toBe("string");
    expect(typeof (this.getSummaryByVendorByCompanyKeyAndTypeResponseBody.model.totalPrice), 'totalPrice response is a number').toBe("number");
    expect(typeof (this.getSummaryByVendorByCompanyKeyAndTypeResponseBody.model.totalQty), 'totalQty response is a number').toBe("number");
    expect(typeof (this.getSummaryByVendorByCompanyKeyAndTypeResponseBody.model.uniqueItems), 'uniqueItems response is a number').toBe("number");
})

Then('{} checks number Suggested Purchase Orders is correct', async function (actor: string) {
    const suggestedPurchaseOrdersNumber = Number(this.getCountSummaryByVendorResponseBody);
    const totalObjectInSummaryByVendorDetail = this.getSummaryByVendorResponseBody.length;
    console.log(await this.getSummaryByVendorByCompanyKeyAndTypeResponseBody);
    const countSummaryByVendorByCompanyKeyAndCompanyType = Number(await this.getSummaryByVendorByCompanyKeyAndTypeResponseBody.model.count);
    expect(totalObjectInSummaryByVendorDetail, `totalObjectInSummaryByVendorDetail should be equal ${suggestedPurchaseOrdersNumber}`).toEqual(suggestedPurchaseOrdersNumber);
    expect(countSummaryByVendorByCompanyKeyAndCompanyType, `countSummaryByVendorByCompanyKeyAndCompanyType should be equal ${suggestedPurchaseOrdersNumber}`).toEqual(suggestedPurchaseOrdersNumber);
})

Then('{} checks total cost of suggested purchase orders is correct', async function (actor: string) {
    var expectedTotalCost = 0;
    this.getSummaryByVendorResponseBody.forEach((v: { totalPrice: any; }) => {
        expectedTotalCost += v.totalPrice;
    });
    const actualTotalCost = this.getSummaryByVendorByCompanyKeyAndTypeResponseBody.model.totalPrice;
    expect(expectedTotalCost, `Total Cost of Suggested Purchase Orders should be equal ${expectedTotalCost}`).toEqual(actualTotalCost);
})

Then('{} checks total unique items on suggested purchase orders is correct', async function (actor: string) {
    var expectedTotalItems = 0;
    this.getSummaryByVendorResponseBody.forEach((v: { uniqueItems: any; }) => {
        expectedTotalItems += Number(v.uniqueItems);
    });
    const actualTotalItems = this.getSummaryByVendorByCompanyKeyAndTypeResponseBody.model.uniqueItems;
    expect(expectedTotalItems, `Total Unique Items on Suggested Purchase Orders should be equal ${expectedTotalItems}`).toEqual(actualTotalItems);
})

Then('{} checks total units on suggested purchase orders is correct', async function (actor: string) {
    var expectedTotalUnits = 0;
    this.getSummaryByVendorResponseBody.forEach((v: { totalQty: any; }) => {
        expectedTotalUnits += v.totalQty;
    });
    const actualTotalUnits = this.getSummaryByVendorByCompanyKeyAndTypeResponseBody.model.totalQty;
    expect(expectedTotalUnits, `Total Units on Suggested Purchase Orders should be equal ${expectedTotalUnits}`).toEqual(actualTotalUnits);
})

Then('{} checks total items in PO is matched with total in suggested POs', async function (actor: string) {
    var expectedTotalItemsInPO = Number(await this.getSummaryByVendorResponseBody.find((v: { vendorKey: any; }) => v.vendorKey == this.selectedVendorKey).uniqueItems);
    const actualTotalItemsInPO = this.getCountItemsinPOResponseBody;
    const itemsInPOListFromSummaryVendorAPI = await this.getItemsinPOResponseBody.model.length;
    expect(expectedTotalItemsInPO, `total items in PO is matched with total in suggested POs ${expectedTotalItemsInPO}`).toEqual(actualTotalItemsInPO);
    expect(itemsInPOListFromSummaryVendorAPI, `Total item listed in PO ${itemsInPOListFromSummaryVendorAPI} is matched with then number of Total Products in My Suggested ${expectedTotalItemsInPO}`).toEqual(expectedTotalItemsInPO);
})

Then('{} checks Forecast Recommended Qty is greater than 0', async function (actor: string) {
    var forecastRecommendedQtyOfPOs = await this.getItemsinPOResponseBody.model.map((v: { consolidatedQty: any; }) => v.consolidatedQty);
    forecastRecommendedQtyOfPOs.forEach((qty: any) => {
        expect(qty, `Forecast Recommended Qty ${qty} is greater than 0.`).toBeGreaterThan(0);
    })
})

Then(`{} checks API contract get items in po by vendor key are correct`, async function (actor) {
    if (this.getItemsinPOResponseBody.err !== null) {
        expect(typeof (this.getItemsinPOResponseBody.err), 'err in response is a string').toBe("string");
    }
    else {
        expect(this.getItemsinPOResponseBody.err, 'err value should be null').toBeNull();
    }

    expect(typeof (this.getItemsinPOResponseBody.model), 'model response is a object').toBe("object");
})

Then(`{} checks API contract of item object is purchasing is correct`, async function (actor) {
    expect(typeof (this.randomAItemObject.addedToSupplies), 'addedToSupplies should be number').toBe("number");
    logger.log('info', `addedToSupplies type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.addedToSupplies)}`);

    if (this.randomAItemObject.asin !== null) {
        expect(typeof (this.randomAItemObject.asin), 'asin in response should be string').toBe("string");
        logger.log('info', `asin type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.asin)}`);
    }
    else {
        expect(this.randomAItemObject.asin, 'asin value should be null').toBeNull();
    }

    expect(typeof (this.randomAItemObject.companyKey), 'companyKey should be string').toBe("string");
    logger.log('info', `companyKey type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.companyKey)}`);
    expect(typeof (this.randomAItemObject.companyType), 'companyType should be string').toBe("string");
    logger.log('info', `companyType type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.companyType)}`);

    expect(typeof (this.randomAItemObject.consolidatedQty), 'consolidatedQty should be number').toBe("number");
    logger.log('info', `consolidatedQty type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.consolidatedQty)}`);


    if (this.randomAItemObject.created_at !== null) {
        expect(Date.parse(this.randomAItemObject.created_at), 'created_at in response should be date').not.toBeNull();
    }
    else {
        expect(this.randomAItemObject.created_at, 'created_at value should be null').toBeNull();
    }

    if (this.randomAItemObject.daysLeft !== null) {
        expect(typeof (this.randomAItemObject.daysLeft), 'daysLeft in response should be number').toBe("number");
        logger.log('info', `daysLeft type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.daysLeft)}`);

    }
    else {
        expect(this.randomAItemObject.daysLeft, 'daysLeft value should be null').toBeNull();
    }

    if (this.randomAItemObject.daysRemaining !== null) {
        expect(typeof (this.randomAItemObject.daysRemaining), 'daysRemaining in response should be number').toBe("number");
        logger.log('info', `daysRemaining type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.daysRemaining)}`);

    }
    else {
        expect(this.randomAItemObject.daysRemaining, 'daysRemaining value should be null').toBeNull();
    }


    if (this.randomAItemObject.daysUntilNextScheduledOrder !== null) {
        expect(typeof (this.randomAItemObject.daysUntilNextScheduledOrder), 'daysUntilNextScheduledOrder in response should be number').toBe("number");
        logger.log('info', `daysUntilNextScheduledOrder type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.daysUntilNextScheduledOrder)}`);

    }
    else {
        expect(this.randomAItemObject.daysUntilNextScheduledOrder, 'daysUntilNextScheduledOrder value should be null').toBeNull();
    }


    if (this.randomAItemObject.description !== null) {
        expect(typeof (this.randomAItemObject.description), 'description in response should be string').toBe("string");
        logger.log('info', `description type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.description)}`);

    }
    else {
        expect(this.randomAItemObject.description, 'description value should be null').toBeNull();
    }

    if (this.randomAItemObject.documentUuid !== null) {
        expect(typeof (this.randomAItemObject.documentUuid), 'documentUuid in response should be number').toBe("number");
        logger.log('info', `documentUuid type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.documentUuid)}`);

    }
    else {
        expect(this.randomAItemObject.documentUuid, 'documentUuid value should be null').toBeNull();
    }

    if (this.randomAItemObject.dueDate !== null) {
        expect(Date.parse(this.randomAItemObject.dueDate), 'dueDate in response should be date').not.toBeNull();
    }
    else {
        expect(this.randomAItemObject.dueDate, 'dueDate value should be null').toBeNull();
    }

    if (this.randomAItemObject.fnsku !== null) {
        expect(typeof (this.randomAItemObject.fnsku), 'fnsku in response should be string').toBe("string");
        logger.log('info', `fnsku type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.fnsku)}`);

    }
    else {
        expect(this.randomAItemObject.fnsku, 'fnsku value should be null').toBeNull();
    }

    if (this.randomAItemObject.imageUrl !== null) {
        expect(typeof (this.randomAItemObject.imageUrl), 'imageUrl in response should be string').toBe("string");
        logger.log('info', `imageUrl type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.imageUrl)}`);

    }
    else {
        expect(this.randomAItemObject.imageUrl, 'imageUrl value should be null').toBeNull();
    }

    // if (this.randomAItemObject.inbound !== null) {
    expect(typeof (this.randomAItemObject.inbound), 'inbound in response should be number').toBe("number");
    logger.log('info', `inbound type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.inbound)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.inbound, 'inbound value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.inboundAlert !== null) {
    //     expect(typeof (this.randomAItemObject.inboundAlert), 'inboundAlert in response should be string').toBe("string");
    //     logger.log('info', `inboundAlert type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.inboundAlert)}`);
    // }
    // else {
    //     expect(this.randomAItemObject.inboundAlert, 'inboundAlert value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.inboundAvailable !== null) {
    expect(typeof (this.randomAItemObject.inboundAvailable), 'inboundAvailable in response should be number').toBe("number");
    logger.log('info', `inboundAvailable type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.inboundAvailable)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.inboundAvailable, 'inboundAvailable value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.inboundCustomerOrder !== null) {
    expect(typeof (this.randomAItemObject.inboundCustomerOrder), 'inboundCustomerOrder in response should be number').toBe("number");
    logger.log('info', `inboundCustomerOrder type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.inboundCustomerOrder)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.inboundCustomerOrder, 'inboundCustomerOrder value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.inboundFcProcessing !== null) {
    expect(typeof (this.randomAItemObject.inboundFcProcessing), 'inboundFcProcessing in response should be number').toBe("number");
    logger.log('info', `inboundFcProcessing type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.inboundFcProcessing)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.inboundFcProcessing, 'inboundFcProcessing value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.inboundFcTransfer !== null) {
    expect(typeof (this.randomAItemObject.inboundFcTransfer), 'inboundFcTransfer in response should be number').toBe("number");
    logger.log('info', `inboundFcTransfer type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.inboundFcTransfer)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.inboundFcTransfer, 'inboundFcTransfer value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.inboundPrice !== null) {
    expect(typeof (this.randomAItemObject.inboundPrice), 'inboundPrice in response should be number').toBe("number");
    logger.log('info', `inboundPrice type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.inboundPrice)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.inboundPrice, 'inboundPrice value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.inboundSalesLast30Days !== null) {
    expect(typeof (this.randomAItemObject.inboundSalesLast30Days), 'inboundSalesLast30Days in response should be number').toBe("number");
    logger.log('info', `inboundSalesLast30Days type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.inboundSalesLast30Days)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.inboundSalesLast30Days, 'inboundSalesLast30Days value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.inboundUnfulfillable !== null) {
    expect(typeof (this.randomAItemObject.inboundUnfulfillable), 'inboundUnfulfillable in response should be number').toBe("number");
    logger.log('info', `inboundUnfulfillable type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.inboundUnfulfillable)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.inboundUnfulfillable, 'inboundUnfulfillable value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.inboundWorking !== null) {
    expect(typeof (this.randomAItemObject.inboundWorking), 'inboundWorking in response should be number').toBe("number");
    logger.log('info', `inboundWorking type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.inboundWorking)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.inboundWorking, 'inboundWorking value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.inventorySourcePreference !== null) {
    expect(typeof (this.randomAItemObject.inventorySourcePreference), 'inventorySourcePreference in response should be string').toBe("string");
    logger.log('info', `inventorySourcePreference type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.inventorySourcePreference)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.inventorySourcePreference, 'inventorySourcePreference value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.isFbm !== null) {
    expect(typeof (this.randomAItemObject.isFbm), 'isFbm in response should be boolean').toBe("boolean");
    logger.log('info', `isFbm type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.isFbm)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.isFbm, 'isFbm value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.itemKey !== null) {
    expect(typeof (this.randomAItemObject.itemKey), 'itemKey in response should be string').toBe("string");
    logger.log('info', `itemKey type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.itemKey)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.itemKey, 'itemKey value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.itemName !== null) {
    expect(typeof (this.randomAItemObject.itemName), 'itemName in response should be string').toBe("string");
    logger.log('info', `itemName type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.itemName)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.itemName, 'itemName value should be null').toBeNull();
    // }

    if (this.randomAItemObject.lastOrderDate !== null) {
        expect(Date.parse(this.randomAItemObject.lastOrderDate), 'lastOrderDate in response should be date').not.toBeNull();
    }
    else {
        expect(this.randomAItemObject.lastOrderDate, 'lastOrderDate value should be null').toBeNull();
    }

    // if (this.randomAItemObject.leadTime !== null) {
    expect(typeof (this.randomAItemObject.leadTime), 'leadTime in response should be number').toBe("number");
    logger.log('info', `leadTime type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.leadTime)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.leadTime, 'leadTime value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.lotMultipleQty !== null) {
    expect(typeof (this.randomAItemObject.lotMultipleQty), 'lotMultipleQty in response should be number').toBe("number");
    logger.log('info', `lotMultipleQty type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.lotMultipleQty)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.lotMultipleQty, 'lotMultipleQty value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.meanLtd !== null) {
    expect(typeof (this.randomAItemObject.meanLtd), 'meanLtd in response should be number').toBe("number");
    logger.log('info', `meanLtd type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.meanLtd)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.meanLtd, 'meanLtd value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.moq !== null) {
    expect(typeof (this.randomAItemObject.moq), 'moq in response should be number').toBe("number");
    logger.log('info', `moq type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.moq)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.moq, 'moq value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.mwsFulfillmentFee !== null) {
    expect(typeof (this.randomAItemObject.mwsFulfillmentFee), 'mwsFulfillmentFee in response should be number').toBe("number");
    logger.log('info', `mwsFulfillmentFee type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.mwsFulfillmentFee)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.mwsFulfillmentFee, 'mwsFulfillmentFee value should be null').toBeNull();
    // }

    if (this.randomAItemObject.nextScheduledOrderDate !== null) {
        expect(Date.parse(this.randomAItemObject.nextScheduledOrderDate), 'nextScheduledOrderDate in response should be date').not.toBeNull();
    }
    else {
        expect(this.randomAItemObject.nextScheduledOrderDate, 'nextScheduledOrderDate value should be null').toBeNull();
    }

    // if (this.randomAItemObject.onHand !== null) {
    expect(typeof (this.randomAItemObject.onHand), 'onHand in response should be number').toBe("number");
    logger.log('info', `onHand type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.onHand)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.onHand, 'onHand value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.onHandFbm !== null) {
    expect(typeof (this.randomAItemObject.onHandFbm), 'onHandFbm in response should be number').toBe("number");
    logger.log('info', `onHandFbm type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.onHandFbm)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.onHandFbm, 'onHandFbm value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.onHandMin !== null) {
    expect(typeof (this.randomAItemObject.onHandMin), 'onHandMin in response should be number').toBe("number");
    logger.log('info', `onHandMin type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.onHandMin)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.onHandMin, 'onHandMin value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.onHandThirdParty !== null) {
    expect(typeof (this.randomAItemObject.onHandThirdParty), 'onHandThirdParty in response should be number').toBe("number");
    logger.log('info', `onHandThirdParty type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.onHandThirdParty)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.onHandThirdParty, 'onHandThirdParty value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.onHandThirdPartyMin !== null) {
    expect(typeof (this.randomAItemObject.onHandThirdPartyMin), 'onHandThirdPartyMin in response should be number').toBe("number");
    logger.log('info', `onHandThirdPartyMin type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.onHandThirdPartyMin)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.onHandThirdPartyMin, 'onHandThirdPartyMin value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.onNewPo !== null) {
    expect(typeof (this.randomAItemObject.onNewPo), 'onNewPo in response should be number').toBe("number");
    logger.log('info', `onNewPo type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.onNewPo)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.onNewPo, 'onNewPo value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.openPurchaseOrders !== null) {
    expect(typeof (this.randomAItemObject.openPurchaseOrders), 'openPurchaseOrders in response should be number').toBe("number");
    logger.log('info', `openPurchaseOrders type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.openPurchaseOrders)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.openPurchaseOrders, 'openPurchaseOrders value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.openSalesOrders !== null) {
    expect(typeof (this.randomAItemObject.openSalesOrders), 'openSalesOrders in response should be number').toBe("number");
    logger.log('info', `openSalesOrders type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.openSalesOrders)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.openSalesOrders, 'openSalesOrders value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.orderInterval !== null) {
    expect(typeof (this.randomAItemObject.orderInterval), 'orderInterval in response should be number').toBe("number");
    logger.log('info', `orderInterval type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.orderInterval)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.orderInterval, 'orderInterval value should be null').toBeNull();
    // }

    if (this.randomAItemObject.outOfStockDate !== null) {
        expect(Date.parse(this.randomAItemObject.outOfStockDate), 'outOfStockDate in response should be date').not.toBeNull();
    }
    else {
        expect(this.randomAItemObject.outOfStockDate, 'outOfStockDate value should be null').toBeNull();
    }

    // if (this.randomAItemObject.purchaseQty !== null) {
    expect(typeof (this.randomAItemObject.purchaseQty), 'purchaseQty in response should be number').toBe("number");
    logger.log('info', `purchaseQty type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.purchaseQty)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.purchaseQty, 'purchaseQty value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.purchasingSummariesUuid !== null) {
    expect(typeof (this.randomAItemObject.purchasingSummariesUuid), 'purchasingSummariesUuid in response should be string').toBe("string");
    logger.log('info', `purchasingSummariesUuid type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.purchasingSummariesUuid)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.purchasingSummariesUuid, 'purchasingSummariesUuid value should be null').toBeNull();
    // }

    if (this.randomAItemObject.recommendedOrderDate !== null) {
        expect(Date.parse(this.randomAItemObject.recommendedOrderDate), 'recommendedOrderDate in response should be date').not.toBeNull();
    }
    else {
        expect(this.randomAItemObject.recommendedOrderDate, 'recommendedOrderDate value should be null').toBeNull();
    }

    // if (this.randomAItemObject.recommendedQty !== null) {
    expect(typeof (this.randomAItemObject.recommendedQty), 'recommendedQty in response should be number').toBe("number");
    logger.log('info', `recommendedQty type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.recommendedQty)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.recommendedQty, 'recommendedQty value should be null').toBeNull();
    // }

    if (this.randomAItemObject.s7d !== null) {
        expect(typeof (this.randomAItemObject.s7d), 's7d in response should be number').toBe("number");
        logger.log('info', `s7d type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.s7d)}`);
    }
    else {
        expect(this.randomAItemObject.s7d, 's7d value should be null').toBeNull();
    }

    if (this.randomAItemObject.s30d !== null) {
        expect(typeof (this.randomAItemObject.s30d), 's30d in response should be number').toBe("number");
        logger.log('info', `s30d type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.s30d)}`);
    }
    else {
        expect(this.randomAItemObject.s30d, 's30d value should be null').toBeNull();
    }

    if (this.randomAItemObject.s90d !== null) {
        expect(typeof (this.randomAItemObject.s90d), 's90d in response should be number').toBe("number");
        logger.log('info', `s90d type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.s90d)}`);
    }
    else {
        expect(this.randomAItemObject.s90d, 's90d value should be null').toBeNull();
    }

    if (this.randomAItemObject.s365d !== null) {
        expect(typeof (this.randomAItemObject.s365d), 's365d in response should be number').toBe("number");
        logger.log('info', `s365d type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.s365d)}`);
    }
    else {
        expect(this.randomAItemObject.s365d, 's365d value should be null').toBeNull();
    }

    if (this.randomAItemObject.sMtd !== null) {
        expect(typeof (this.randomAItemObject.sMtd), 'sMtd in response should be number').toBe("number");
        logger.log('info', `sMtd type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.sMtd)}`);
    }
    else {
        expect(this.randomAItemObject.sMtd, 'sMtd value should be null').toBeNull();
    }

    if (this.randomAItemObject.sYtd !== null) {
        expect(typeof (this.randomAItemObject.sYtd), 'sYtd in response should be number').toBe("number");
        logger.log('info', `sYtd type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.sYtd)}`);
    }
    else {
        expect(this.randomAItemObject.sYtd, 'sYtd value should be null').toBeNull();
    }

    if (this.randomAItemObject.s_2d !== null) {
        expect(typeof (this.randomAItemObject.s_2d), 's_2d in response should be number').toBe("number");
        logger.log('info', `s_2d type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.s_2d)}`);
    }
    else {
        expect(this.randomAItemObject.s_2d, 's_2d value should be null').toBeNull();
    }

    if (this.randomAItemObject.s_60d !== null) {
        expect(typeof (this.randomAItemObject.s_60d), 's_60d in response should be number').toBe("number");
        logger.log('info', `s_60d type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.s_60d)}`);
    }
    else {
        expect(this.randomAItemObject.s_60d, 's_60d value should be null').toBeNull();
    }

    if (this.randomAItemObject.s_180d !== null) {
        expect(typeof (this.randomAItemObject.s_180d), 's_180d in response should be number').toBe("number");
        logger.log('info', `s_180d type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.s_180d)}`);
    }
    else {
        expect(this.randomAItemObject.s_180d, 's_180d value should be null').toBeNull();
    }

    // if (this.randomAItemObject.safetyStockLtd !== null) {
    expect(typeof (this.randomAItemObject.safetyStockLtd), 'safetyStockLtd in response should be number').toBe("number");
    logger.log('info', `safetyStockLtd type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.safetyStockLtd)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.safetyStockLtd, 'safetyStockLtd value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.snapshotQty !== null) {
    expect(typeof (this.randomAItemObject.snapshotQty), 'snapshotQty in response should be number').toBe("number");
    logger.log('info', `snapshotQty type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.snapshotQty)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.snapshotQty, 'snapshotQty value should be null').toBeNull();
    // }

    if (this.randomAItemObject.tag !== null) {
        expect(typeof (this.randomAItemObject.tag), 'tag in response should be string').toBe("string");
        logger.log('info', `tag type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.tag)}`);

    }
    else {
        expect(this.randomAItemObject.tag, 'tag value should be null').toBeNull();
    }

    if (this.randomAItemObject.tags !== null) {
        expect(typeof (this.randomAItemObject.tags), 'tags in response should be object').toBe("object");
        logger.log('info', `tags type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.tags)}`);

    }
    else {
        expect(this.randomAItemObject.tags, 'tags value should be null').toBeNull();
    }


    // if (this.randomAItemObject.total !== null) {
    expect(typeof (this.randomAItemObject.total), 'total in response should be number').toBe("number");
    logger.log('info', `total type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.total)}`);

    // }
    // else {
    //     expect(this.randomAItemObject.total, 'total value should be null').toBeNull();
    // }

    if (this.randomAItemObject.trueRecommendedQty !== null) {
        expect(typeof (this.randomAItemObject.trueRecommendedQty), 'trueRecommendedQty in response should be number').toBe("number");
        logger.log('info', `trueRecommendedQty type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.trueRecommendedQty)}`);

    }
    else {
        expect(this.randomAItemObject.trueRecommendedQty, 'trueRecommendedQty value should be null').toBeNull();
    }

    expect(typeof (this.randomAItemObject.type), 'type in response should be string').toBe("string");
    logger.log('info', `Fiedl type of ${this.randomAItemObject.itemKey} has type :${typeof (this.randomAItemObject.type)}`);


    const types = ["Make", "Buy"];
    expect(types, 'type in response should be Make or Buy').toContain(this.randomAItemObject.type)

    if (this.randomAItemObject.updated_at !== null) {
        expect(Date.parse(this.randomAItemObject.updated_at), 'updated_at in response should be date').not.toBeNull();
    }
    else {
        expect(this.randomAItemObject.updated_at, 'updated_at value should be null').toBeNull();
    }

    if (this.randomAItemObject.vendorKey !== null) {
        expect(typeof (this.randomAItemObject.vendorKey), 'vendorKey in response should be string').toBe("string");
        logger.log('info', `vendorKey type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.vendorKey)}`);

    }
    else {
        expect(this.randomAItemObject.vendorKey, 'vendorKey value should be null').toBeNull();
    }

    if (this.randomAItemObject.vendorName !== null) {
        expect(typeof (this.randomAItemObject.vendorName), 'vendorName in response should be string').toBe("string");
        logger.log('info', `vendorName type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.vendorName)}`);

    }
    else {
        expect(this.randomAItemObject.vendorName, 'vendorName value should be null').toBeNull();
    }

    expect(typeof (this.randomAItemObject.vendorPrice), 'vendorPrice in response should be number').toBe("number");
    logger.log('info', `vendorPrice type of ${this.randomAItemObject.itemKey}: ${typeof (this.randomAItemObject.vendorPrice)}`);
})

// Custom 

Then(`{} checks API contract get count items in purchasing custom are correct`, async function (actor) {
    expect(typeof (this.getCountItemsinPurchasingCustomResponseBody), 'Get Count Items in Purchasing Custom response is a number').toBe("number");
})