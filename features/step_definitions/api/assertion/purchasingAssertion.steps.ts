import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

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
    expect(1, 'addedToSupplies should be number').toBe(2);
    expect(typeof (this.randomAItemObject.addedToSupplies), 'addedToSupplies should be number').toBe("string");

    if (this.randomAItemObject.asin !== null) {
        console.log()
        expect(typeof (this.randomAItemObject.asin), 'asin in response should be string').toBe("string");
    }
    else {
        expect(this.randomAItemObject.asin, 'asin value should be null').toBeNull();
    }

    expect(typeof (this.randomAItemObject.asin), 'asin should be string').toBe("string");
    expect(typeof (this.randomAItemObject.companyKey), 'companyKey should be string').toBe("string");
    expect(typeof (this.randomAItemObject.companyType), 'companyType should be string').toBe("string");
    expect(typeof (this.randomAItemObject.consolidatedQty), 'consolidatedQty should be number').toBe("number");

    if (this.randomAItemObject.created_at !== null) {
        expect(Date.parse(this.randomAItemObject.created_at), 'created_at in response should be date').not.toBeNull();
    }
    else {
        expect(this.randomAItemObject.created_at, 'created_at value should be null').toBeNull();
    }

    if (this.randomAItemObject.daysLeft !== null) {
        expect(typeof (this.randomAItemObject.daysLeft), 'daysLeft in response should be number').toBe("number");
    }
    else {
        expect(this.randomAItemObject.daysLeft, 'daysLeft value should be null').toBeNull();
    }

    if (this.randomAItemObject.daysRemaining !== null) {
        expect(typeof (this.randomAItemObject.daysRemaining), 'daysRemaining in response should be number').toBe("number");
    }
    else {
        expect(this.randomAItemObject.daysRemaining, 'daysRemaining value should be null').toBeNull();
    }


    if (this.randomAItemObject.daysUntilNextScheduledOrder !== null) {
        expect(typeof (this.randomAItemObject.daysUntilNextScheduledOrder), 'daysUntilNextScheduledOrder in response should be number').toBe("number");
    }
    else {
        expect(this.randomAItemObject.daysUntilNextScheduledOrder, 'daysUntilNextScheduledOrder value should be null').toBeNull();
    }


    if (this.randomAItemObject.description !== null) {
        expect(typeof (this.randomAItemObject.description), 'description in response should be string').toBe("string");
    }
    else {
        expect(this.randomAItemObject.description, 'description value should be null').toBeNull();
    }

    if (this.randomAItemObject.documentUuid !== null) {
        expect(typeof (this.randomAItemObject.documentUuid), 'documentUuid in response should be number').toBe("number");
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

    if (this.randomAItemObject.documentUuid !== null) {
        expect(typeof (this.randomAItemObject.documentUuid), 'documentUuid in response should be string').toBe("string");
    }
    else {
        expect(this.randomAItemObject.documentUuid, 'documentUuid value should be null').toBeNull();
    }

    if (this.randomAItemObject.fnsku !== null) {
        expect(typeof (this.randomAItemObject.fnsku), 'fnsku in response should be string').toBe("string");
    }
    else {
        expect(this.randomAItemObject.fnsku, 'fnsku value should be null').toBeNull();
    }

    if (this.randomAItemObject.imageUrl !== null) {
        expect(typeof (this.randomAItemObject.imageUrl), 'imageUrl in response should be string').toBe("string");
    }
    else {
        expect(this.randomAItemObject.imageUrl, 'imageUrl value should be null').toBeNull();
    }

    // if (this.randomAItemObject.inbound !== null) {
    expect(typeof (this.randomAItemObject.inbound), 'inbound in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.inbound, 'inbound value should be null').toBeNull();
    // }

    if (this.randomAItemObject.inboundAlert !== null) {
        expect(typeof (this.randomAItemObject.inboundAlert), 'inboundAlert in response should be string').toBe("string");
    }
    else {
        expect(this.randomAItemObject.inboundAlert, 'inboundAlert value should be null').toBeNull();
    }

    // if (this.randomAItemObject.inboundAvailable !== null) {
    expect(typeof (this.randomAItemObject.inboundAvailable), 'inboundAvailable in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.inboundAvailable, 'inboundAvailable value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.inboundCustomerOrder !== null) {
    expect(typeof (this.randomAItemObject.inboundCustomerOrder), 'inboundCustomerOrder in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.inboundCustomerOrder, 'inboundCustomerOrder value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.inboundFcProcessing !== null) {
    expect(typeof (this.randomAItemObject.inboundFcProcessing), 'inboundFcProcessing in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.inboundFcProcessing, 'inboundFcProcessing value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.inboundFcTransfer !== null) {
    expect(typeof (this.randomAItemObject.inboundFcTransfer), 'inboundFcTransfer in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.inboundFcTransfer, 'inboundFcTransfer value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.inboundPrice !== null) {
    expect(typeof (this.randomAItemObject.inboundPrice), 'inboundPrice in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.inboundPrice, 'inboundPrice value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.inboundSalesLast30Days !== null) {
    expect(typeof (this.randomAItemObject.inboundSalesLast30Days), 'inboundSalesLast30Days in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.inboundSalesLast30Days, 'inboundSalesLast30Days value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.inboundUnfulfillable !== null) {
    expect(typeof (this.randomAItemObject.inboundUnfulfillable), 'inboundUnfulfillable in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.inboundUnfulfillable, 'inboundUnfulfillable value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.inboundWorking !== null) {
    expect(typeof (this.randomAItemObject.inboundWorking), 'inboundWorking in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.inboundWorking, 'inboundWorking value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.inventorySourcePreference !== null) {
    expect(typeof (this.randomAItemObject.inventorySourcePreference), 'inventorySourcePreference in response should be string').toBe("string");
    // }
    // else {
    //     expect(this.randomAItemObject.inventorySourcePreference, 'inventorySourcePreference value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.isFbm !== null) {
    expect(typeof (this.randomAItemObject.isFbm), 'isFbm in response should be boolean').toBe("boolean");
    // }
    // else {
    //     expect(this.randomAItemObject.isFbm, 'isFbm value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.itemKey !== null) {
    expect(typeof (this.randomAItemObject.itemKey), 'itemKey in response should be string').toBe("string");
    // }
    // else {
    //     expect(this.randomAItemObject.itemKey, 'itemKey value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.itemName !== null) {
    expect(typeof (this.randomAItemObject.itemName), 'itemName in response should be string').toBe("string");
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
    // }
    // else {
    //     expect(this.randomAItemObject.leadTime, 'leadTime value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.lotMultipleQty !== null) {
    expect(typeof (this.randomAItemObject.lotMultipleQty), 'lotMultipleQty in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.lotMultipleQty, 'lotMultipleQty value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.meanLtd !== null) {
    expect(typeof (this.randomAItemObject.meanLtd), 'meanLtd in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.meanLtd, 'meanLtd value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.moq !== null) {
    expect(typeof (this.randomAItemObject.moq), 'moq in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.moq, 'moq value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.mwsFulfillmentFee !== null) {
    expect(typeof (this.randomAItemObject.mwsFulfillmentFee), 'mwsFulfillmentFee in response should be number').toBe("number");
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
    // }
    // else {
    //     expect(this.randomAItemObject.onHand, 'onHand value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.onHandFbm !== null) {
    expect(typeof (this.randomAItemObject.onHandFbm), 'onHandFbm in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.onHandFbm, 'onHandFbm value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.onHandMin !== null) {
    expect(typeof (this.randomAItemObject.onHandMin), 'onHandMin in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.onHandMin, 'onHandMin value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.onHandThirdParty !== null) {
    expect(typeof (this.randomAItemObject.onHandThirdParty), 'onHandThirdParty in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.onHandThirdParty, 'onHandThirdParty value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.onHandThirdPartyMin !== null) {
    expect(typeof (this.randomAItemObject.onHandThirdPartyMin), 'onHandThirdPartyMin in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.onHandThirdPartyMin, 'onHandThirdPartyMin value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.onNewPo !== null) {
    expect(typeof (this.randomAItemObject.onNewPo), 'onNewPo in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.onNewPo, 'onNewPo value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.openPurchaseOrders !== null) {
    expect(typeof (this.randomAItemObject.openPurchaseOrders), 'openPurchaseOrders in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.openPurchaseOrders, 'openPurchaseOrders value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.openSalesOrders !== null) {
    expect(typeof (this.randomAItemObject.openSalesOrders), 'openSalesOrders in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.openSalesOrders, 'openSalesOrders value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.orderInterval !== null) {
    expect(typeof (this.randomAItemObject.orderInterval), 'orderInterval in response should be number').toBe("number");
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
    // }
    // else {
    //     expect(this.randomAItemObject.purchaseQty, 'purchaseQty value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.purchasingSummariesUuid !== null) {
    expect(typeof (this.randomAItemObject.purchasingSummariesUuid), 'purchasingSummariesUuid in response should be string').toBe("string");
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
    // }
    // else {
    //     expect(this.randomAItemObject.recommendedQty, 'recommendedQty value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.s7d !== null) {
    expect(typeof (this.randomAItemObject.s7d), 's7d in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.s7d, 's7d value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.s30d !== null) {
    expect(typeof (this.randomAItemObject.s30d), 's30d in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.s30d, 's30d value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.s90d !== null) {
    expect(typeof (this.randomAItemObject.s90d), 's90d in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.s90d, 's90d value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.s365d !== null) {
    expect(typeof (this.randomAItemObject.s365d), 's365d in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.s365d, 's365d value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.sMtd !== null) {
    expect(typeof (this.randomAItemObject.sMtd), 'sMtd in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.sMtd, 'sMtd value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.sYtd !== null) {
    expect(typeof (this.randomAItemObject.sYtd), 'sYtd in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.sYtd, 'sYtd value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.s_2d !== null) {
    expect(typeof (this.randomAItemObject.s_2d), 's_2d in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.s_2d, 's_2d value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.s_60d !== null) {
    expect(typeof (this.randomAItemObject.s_60d), 's_60d in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.s_60d, 's_60d value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.s_180d !== null) {
    expect(typeof (this.randomAItemObject.s_180d), 's_180d in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.s_180d, 's_180d value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.safetyStockLtd !== null) {
    expect(typeof (this.randomAItemObject.safetyStockLtd), 'safetyStockLtd in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.safetyStockLtd, 'safetyStockLtd value should be null').toBeNull();
    // }

    // if (this.randomAItemObject.snapshotQty !== null) {
    expect(typeof (this.randomAItemObject.snapshotQty), 'snapshotQty in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.snapshotQty, 'snapshotQty value should be null').toBeNull();
    // }

    if (this.randomAItemObject.tag !== null) {
        expect(typeof (this.randomAItemObject.tag), 'tag in response should be string').toBe("string");
    }
    else {
        expect(this.randomAItemObject.tag, 'tag value should be null').toBeNull();
    }

    if (this.randomAItemObject.tags !== null) {
        expect(typeof (this.randomAItemObject.tags), 'tags in response should be object').toBe("object");
    }
    else {
        expect(this.randomAItemObject.tags, 'tags value should be null').toBeNull();
    }


    // if (this.randomAItemObject.total !== null) {
    expect(typeof (this.randomAItemObject.total), 'total in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.randomAItemObject.total, 'total value should be null').toBeNull();
    // }

    if (this.randomAItemObject.trueRecommendedQty !== null) {
        expect(typeof (this.randomAItemObject.trueRecommendedQty), 'trueRecommendedQty in response should be number').toBe("number");
    }
    else {
        expect(this.randomAItemObject.trueRecommendedQty, 'trueRecommendedQty value should be null').toBeNull();
    }

    expect(typeof (this.randomAItemObject.type), 'type in response should be string').toBe("string");

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
    }
    else {
        expect(this.randomAItemObject.vendorKey, 'vendorKey value should be null').toBeNull();
    }

    if (this.randomAItemObject.vendorName !== null) {
        expect(typeof (this.randomAItemObject.vendorName), 'vendorName in response should be string').toBe("string");
    }
    else {
        expect(this.randomAItemObject.vendorName, 'vendorName value should be null').toBeNull();
    }

    expect(typeof (this.randomAItemObject.vendorPrice), 'vendorPrice in response should be number').toBe("number");

    if (this.randomAItemObject.imageUrl !== null) {
        expect(typeof (this.randomAItemObject.imageUrl), 'imageUrl in response should be string').toBe("string");
    }
    else {
        expect(this.randomAItemObject.imageUrl, 'imageUrl value should be null').toBeNull();
    }
})

// Custom 

Then(`{} checks API contract get count items in purchasing custom are correct`, async function (actor) {
    expect(typeof (this.getCountItemsinPurchasingCustomResponseBody), 'Get Count Items in Purchasing Custom response is a number').toBe("number");
})