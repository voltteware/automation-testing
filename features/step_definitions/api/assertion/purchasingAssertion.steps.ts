import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import _ from "lodash";

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
    expect(typeof (this.getItemsinPOResponseBody.model[0].addedToSupplies), 'addedToSupplies should be number').toBe("number");

    if (this.getItemsinPOResponseBody.model[0].asin !== null) {
        console.log()
        expect(typeof (this.getItemsinPOResponseBody.model[0].asin), 'asin in response should be string').toBe("string");
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].asin, 'asin value should be null').toBeNull();
    }

    expect(typeof (this.getItemsinPOResponseBody.model[0].asin), 'asin should be string').toBe("string");
    expect(typeof (this.getItemsinPOResponseBody.model[0].companyKey), 'companyKey should be string').toBe("string");
    expect(typeof (this.getItemsinPOResponseBody.model[0].companyType), 'companyType should be string').toBe("string");
    expect(typeof (this.getItemsinPOResponseBody.model[0].consolidatedQty), 'consolidatedQty should be number').toBe("number");

    if (this.getItemsinPOResponseBody.model[0].created_at !== null) {
        expect(Date.parse(this.getItemsinPOResponseBody.model[0].created_at), 'created_at in response should be date').not.toBeNull();
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].created_at, 'created_at value should be null').toBeNull();
    }

    if (this.getItemsinPOResponseBody.model[0].daysLeft !== null) {
        expect(typeof (this.getItemsinPOResponseBody.model[0].daysLeft), 'daysLeft in response should be number').toBe("number");
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].daysLeft, 'daysLeft value should be null').toBeNull();
    }

    if (this.getItemsinPOResponseBody.model[0].daysRemaining !== null) {
        expect(typeof (this.getItemsinPOResponseBody.model[0].daysRemaining), 'daysRemaining in response should be number').toBe("number");
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].daysRemaining, 'daysRemaining value should be null').toBeNull();
    }


    if (this.getItemsinPOResponseBody.model[0].daysUntilNextScheduledOrder !== null) {
        expect(typeof (this.getItemsinPOResponseBody.model[0].daysUntilNextScheduledOrder), 'daysUntilNextScheduledOrder in response should be number').toBe("number");
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].daysUntilNextScheduledOrder, 'daysUntilNextScheduledOrder value should be null').toBeNull();
    }


    if (this.getItemsinPOResponseBody.model[0].description !== null) {
        expect(typeof (this.getItemsinPOResponseBody.model[0].description), 'description in response should be string').toBe("string");
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].description, 'description value should be null').toBeNull();
    }

    if (this.getItemsinPOResponseBody.model[0].documentUuid !== null) {
        expect(typeof (this.getItemsinPOResponseBody.model[0].documentUuid), 'documentUuid in response should be number').toBe("number");
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].documentUuid, 'documentUuid value should be null').toBeNull();
    }

    if (this.getItemsinPOResponseBody.model[0].dueDate !== null) {
        expect(Date.parse(this.getItemsinPOResponseBody.model[0].dueDate), 'dueDate in response should be date').not.toBeNull();
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].dueDate, 'dueDate value should be null').toBeNull();
    }

    if (this.getItemsinPOResponseBody.model[0].documentUuid !== null) {
        expect(typeof (this.getItemsinPOResponseBody.model[0].documentUuid), 'documentUuid in response should be string').toBe("string");
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].documentUuid, 'documentUuid value should be null').toBeNull();
    }

    if (this.getItemsinPOResponseBody.model[0].fnsku !== null) {
        expect(typeof (this.getItemsinPOResponseBody.model[0].fnsku), 'fnsku in response should be string').toBe("string");
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].fnsku, 'fnsku value should be null').toBeNull();
    }

    if (this.getItemsinPOResponseBody.model[0].imageUrl !== null) {
        expect(typeof (this.getItemsinPOResponseBody.model[0].imageUrl), 'imageUrl in response should be string').toBe("string");
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].imageUrl, 'imageUrl value should be null').toBeNull();
    }

    // if (this.getItemsinPOResponseBody.model[0].inbound !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].inbound), 'inbound in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].inbound, 'inbound value should be null').toBeNull();
    // }

    if (this.getItemsinPOResponseBody.model[0].inboundAlert !== null) {
        expect(typeof (this.getItemsinPOResponseBody.model[0].inboundAlert), 'inboundAlert in response should be string').toBe("string");
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].inboundAlert, 'inboundAlert value should be null').toBeNull();
    }

    // if (this.getItemsinPOResponseBody.model[0].inboundAvailable !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].inboundAvailable), 'inboundAvailable in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].inboundAvailable, 'inboundAvailable value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].inboundCustomerOrder !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].inboundCustomerOrder), 'inboundCustomerOrder in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].inboundCustomerOrder, 'inboundCustomerOrder value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].inboundFcProcessing !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].inboundFcProcessing), 'inboundFcProcessing in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].inboundFcProcessing, 'inboundFcProcessing value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].inboundFcTransfer !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].inboundFcTransfer), 'inboundFcTransfer in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].inboundFcTransfer, 'inboundFcTransfer value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].inboundPrice !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].inboundPrice), 'inboundPrice in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].inboundPrice, 'inboundPrice value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].inboundSalesLast30Days !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].inboundSalesLast30Days), 'inboundSalesLast30Days in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].inboundSalesLast30Days, 'inboundSalesLast30Days value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].inboundUnfulfillable !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].inboundUnfulfillable), 'inboundUnfulfillable in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].inboundUnfulfillable, 'inboundUnfulfillable value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].inboundWorking !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].inboundWorking), 'inboundWorking in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].inboundWorking, 'inboundWorking value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].inventorySourcePreference !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].inventorySourcePreference), 'inventorySourcePreference in response should be string').toBe("string");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].inventorySourcePreference, 'inventorySourcePreference value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].isFbm !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].isFbm), 'isFbm in response should be boolean').toBe("boolean");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].isFbm, 'isFbm value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].itemKey !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].itemKey), 'itemKey in response should be string').toBe("string");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].itemKey, 'itemKey value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].itemName !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].itemName), 'itemName in response should be string').toBe("string");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].itemName, 'itemName value should be null').toBeNull();
    // }

    if (this.getItemsinPOResponseBody.model[0].lastOrderDate !== null) {
        expect(Date.parse(this.getItemsinPOResponseBody.model[0].lastOrderDate), 'lastOrderDate in response should be date').not.toBeNull();
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].lastOrderDate, 'lastOrderDate value should be null').toBeNull();
    }

    // if (this.getItemsinPOResponseBody.model[0].leadTime !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].leadTime), 'leadTime in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].leadTime, 'leadTime value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].lotMultipleQty !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].lotMultipleQty), 'lotMultipleQty in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].lotMultipleQty, 'lotMultipleQty value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].meanLtd !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].meanLtd), 'meanLtd in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].meanLtd, 'meanLtd value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].moq !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].moq), 'moq in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].moq, 'moq value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].mwsFulfillmentFee !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].mwsFulfillmentFee), 'mwsFulfillmentFee in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].mwsFulfillmentFee, 'mwsFulfillmentFee value should be null').toBeNull();
    // }

    if (this.getItemsinPOResponseBody.model[0].nextScheduledOrderDate !== null) {
        expect(Date.parse(this.getItemsinPOResponseBody.model[0].nextScheduledOrderDate), 'nextScheduledOrderDate in response should be date').not.toBeNull();
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].nextScheduledOrderDate, 'nextScheduledOrderDate value should be null').toBeNull();
    }

    // if (this.getItemsinPOResponseBody.model[0].onHand !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].onHand), 'onHand in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].onHand, 'onHand value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].onHandFbm !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].onHandFbm), 'onHandFbm in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].onHandFbm, 'onHandFbm value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].onHandMin !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].onHandMin), 'onHandMin in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].onHandMin, 'onHandMin value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].onHandThirdParty !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].onHandThirdParty), 'onHandThirdParty in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].onHandThirdParty, 'onHandThirdParty value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].onHandThirdPartyMin !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].onHandThirdPartyMin), 'onHandThirdPartyMin in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].onHandThirdPartyMin, 'onHandThirdPartyMin value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].onNewPo !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].onNewPo), 'onNewPo in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].onNewPo, 'onNewPo value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].openPurchaseOrders !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].openPurchaseOrders), 'openPurchaseOrders in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].openPurchaseOrders, 'openPurchaseOrders value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].openSalesOrders !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].openSalesOrders), 'openSalesOrders in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].openSalesOrders, 'openSalesOrders value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].orderInterval !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].orderInterval), 'orderInterval in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].orderInterval, 'orderInterval value should be null').toBeNull();
    // }

    if (this.getItemsinPOResponseBody.model[0].outOfStockDate !== null) {
        expect(Date.parse(this.getItemsinPOResponseBody.model[0].outOfStockDate), 'outOfStockDate in response should be date').not.toBeNull();
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].outOfStockDate, 'outOfStockDate value should be null').toBeNull();
    }

    // if (this.getItemsinPOResponseBody.model[0].purchaseQty !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].purchaseQty), 'purchaseQty in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].purchaseQty, 'purchaseQty value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].purchasingSummariesUuid !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].purchasingSummariesUuid), 'purchasingSummariesUuid in response should be string').toBe("string");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].purchasingSummariesUuid, 'purchasingSummariesUuid value should be null').toBeNull();
    // }

    if (this.getItemsinPOResponseBody.model[0].recommendedOrderDate !== null) {
        expect(Date.parse(this.getItemsinPOResponseBody.model[0].recommendedOrderDate), 'recommendedOrderDate in response should be date').not.toBeNull();
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].recommendedOrderDate, 'recommendedOrderDate value should be null').toBeNull();
    }

    // if (this.getItemsinPOResponseBody.model[0].recommendedQty !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].recommendedQty), 'recommendedQty in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].recommendedQty, 'recommendedQty value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].s7d !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].s7d), 's7d in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].s7d, 's7d value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].s30d !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].s30d), 's30d in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].s30d, 's30d value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].s90d !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].s90d), 's90d in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].s90d, 's90d value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].s365d !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].s365d), 's365d in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].s365d, 's365d value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].sMtd !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].sMtd), 'sMtd in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].sMtd, 'sMtd value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].sYtd !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].sYtd), 'sYtd in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].sYtd, 'sYtd value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].s_2d !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].s_2d), 's_2d in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].s_2d, 's_2d value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].s_60d !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].s_60d), 's_60d in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].s_60d, 's_60d value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].s_180d !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].s_180d), 's_180d in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].s_180d, 's_180d value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].safetyStockLtd !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].safetyStockLtd), 'safetyStockLtd in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].safetyStockLtd, 'safetyStockLtd value should be null').toBeNull();
    // }

    // if (this.getItemsinPOResponseBody.model[0].snapshotQty !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].snapshotQty), 'snapshotQty in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].snapshotQty, 'snapshotQty value should be null').toBeNull();
    // }

    if (this.getItemsinPOResponseBody.model[0].tag !== null) {
        expect(typeof (this.getItemsinPOResponseBody.model[0].tag), 'tag in response should be string').toBe("string");
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].tag, 'tag value should be null').toBeNull();
    }

    if (this.getItemsinPOResponseBody.model[0].tags !== null) {
        expect(typeof (this.getItemsinPOResponseBody.model[0].tags), 'tags in response should be object').toBe("object");
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].tags, 'tags value should be null').toBeNull();
    }


    // if (this.getItemsinPOResponseBody.model[0].total !== null) {
    expect(typeof (this.getItemsinPOResponseBody.model[0].total), 'total in response should be number').toBe("number");
    // }
    // else {
    //     expect(this.getItemsinPOResponseBody.model[0].total, 'total value should be null').toBeNull();
    // }

    if (this.getItemsinPOResponseBody.model[0].trueRecommendedQty !== null) {
        expect(typeof (this.getItemsinPOResponseBody.model[0].trueRecommendedQty), 'trueRecommendedQty in response should be number').toBe("number");
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].trueRecommendedQty, 'trueRecommendedQty value should be null').toBeNull();
    }

    expect(typeof (this.getItemsinPOResponseBody.model[0].type), 'type in response should be string').toBe("string");

    const types = ["Make", "Buy"];
    expect(types, 'type in response should be Make or Buy').toContain(this.getItemsinPOResponseBody.model[0].type)

    if (this.getItemsinPOResponseBody.model[0].updated_at !== null) {
        expect(Date.parse(this.getItemsinPOResponseBody.model[0].updated_at), 'updated_at in response should be date').not.toBeNull();
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].updated_at, 'updated_at value should be null').toBeNull();
    }

    if (this.getItemsinPOResponseBody.model[0].vendorKey !== null) {
        expect(typeof (this.getItemsinPOResponseBody.model[0].vendorKey), 'vendorKey in response should be string').toBe("string");
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].vendorKey, 'vendorKey value should be null').toBeNull();
    }

    if (this.getItemsinPOResponseBody.model[0].vendorName !== null) {
        expect(typeof (this.getItemsinPOResponseBody.model[0].vendorName), 'vendorName in response should be string').toBe("string");
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].vendorName, 'vendorName value should be null').toBeNull();
    }

    expect(typeof (this.getItemsinPOResponseBody.model[0].vendorPrice), 'vendorPrice in response should be number').toBe("number");

    if (this.getItemsinPOResponseBody.model[0].imageUrl !== null) {
        expect(typeof (this.getItemsinPOResponseBody.model[0].imageUrl), 'imageUrl in response should be string').toBe("string");
    }
    else {
        expect(this.getItemsinPOResponseBody.model[0].imageUrl, 'imageUrl value should be null').toBeNull();
    }
})