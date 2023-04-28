import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import logger from '../../../../../src/Logger/logger';
import { itemsInPurchasingResponseSchema } from './purchasingAssertionSchema';

// My Suggested
Then(`{} checks API contract get count summary by vendor are correct`, async function (actor) {
    expect(typeof (this.getCountSummaryByVendorResponseBody), 'Get Count Summary Vendor response is a number').toBe("number");
})

Then(`{} checks API contract get count items by vendor key are correct`, async function (actor) {
    // If system did not show any supplier has name, skip to check. We only check if supplierName is Items Without Supplier or specific name.
    if (this.selectedVendorKey != '') {
        expect(typeof (this.getCountItemsinPOResponseBody), 'Get Count Items By Vendor Key response is a number').toBe("number");
    }
    else {
        // There is no supplier has name
        this.selectedVendorKey = '';
        logger.log('info', `There is no supplier has vendor name not null`);
        this.attach(`There is no supplier has vendor name not null`);
    }
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
    logger.log('info', `Total records shown in the grid from API Get Summary Vendor on POs API >>>>>>${totalObjectInSummaryByVendorDetail}`);
    this.attach(`Total records shown in the grid from API Get Count Summary Vendor on POs API >>>>>>${totalObjectInSummaryByVendorDetail}`);
    const countSummaryByVendorByCompanyKeyAndCompanyType = Number(await this.getSummaryByVendorByCompanyKeyAndTypeResponseBody.model.count);
    logger.log('info', `Number of Suggested Purchase Orders will be showed on the header from API is >>>>>>${countSummaryByVendorByCompanyKeyAndCompanyType}`);
    this.attach(`Number of Suggested Purchase Orders will be showed on the header from API is >>>>>>${countSummaryByVendorByCompanyKeyAndCompanyType}`);
    expect(totalObjectInSummaryByVendorDetail, `totalObjectInSummaryByVendorDetail should be equal ${suggestedPurchaseOrdersNumber}`).toEqual(suggestedPurchaseOrdersNumber);
    expect(countSummaryByVendorByCompanyKeyAndCompanyType, `countSummaryByVendorByCompanyKeyAndCompanyType should be equal ${suggestedPurchaseOrdersNumber}`).toEqual(suggestedPurchaseOrdersNumber);
})

Then('{} checks Total Cost of Suggested Purchase Orders is correct', async function (actor: string) {
    var expectedTotalCost = 0;
    this.getSummaryByVendorResponseBody.forEach((v: { totalPrice: any; }) => {
        expectedTotalCost += v.totalPrice;
    });
    const actualTotalCost = this.getSummaryByVendorByCompanyKeyAndTypeResponseBody.model.totalPrice;
    logger.log('info', `Total cost of all records shown in the grid from API Get Summary Vendor on POs API >>>>>>${expectedTotalCost}`);
    this.attach(`Total cost of all records shown in the grid from API Get Summary Vendor on POs API >>>>>>${expectedTotalCost}`);
    logger.log('info', `Number of Total Cost of Suggested Purchase Orders will be showed on the header from API is >>>>>>${actualTotalCost}`);
    this.attach(`Number of Total Cost of Suggested Purchase Orders will be showed on the header from API is >>>>>>${actualTotalCost}`);
    expect(expectedTotalCost, `Total Cost of Suggested Purchase Orders should be equal ${expectedTotalCost}`).toEqual(actualTotalCost);
})

Then('{} checks Total Items on Suggested Purchase Orders is correct', async function (actor: string) {
    var expectedTotalItems = 0;
    this.getSummaryByVendorResponseBody.forEach((v: { uniqueItems: any; }) => {
        expectedTotalItems += Number(v.uniqueItems);
    });

    const actualTotalItems = this.getSummaryByVendorByCompanyKeyAndTypeResponseBody.model.uniqueItems;

    logger.log('info', `Total products of all records shown in the grid from API Get Summary Vendor on POs API >>>>>>${expectedTotalItems}`);
    this.attach(`Total products of all records shown in the grid from API Get Summary Vendor on POs API >>>>>>${expectedTotalItems}`);
    logger.log('info', `Number of Total Items on Suggested Purchase Orders will be showed on the header from API is >>>>>>${actualTotalItems}`);
    this.attach(`Number of Total Items on Suggested Purchase Orders will be showed on the header from API is >>>>>>${actualTotalItems}`);

    expect(expectedTotalItems, `Total Unique Items on Suggested Purchase Orders should be equal ${expectedTotalItems}`).toEqual(actualTotalItems);
})

Then('{} checks Total Units on Suggested Purchase Orders is correct', async function (actor: string) {
    var expectedTotalUnits = 0;
    this.getSummaryByVendorResponseBody.forEach((v: { totalQty: any; }) => {
        expectedTotalUnits += v.totalQty;
    });
    const actualTotalUnits = this.getSummaryByVendorByCompanyKeyAndTypeResponseBody.model.totalQty;

    logger.log('info', `Total Qty of all records shown in the grid from API Get Summary Vendor on POs API >>>>>>${expectedTotalUnits}`);
    this.attach(`Total Qty of all records shown in the grid from API Get Summary Vendor on POs API >>>>>>${expectedTotalUnits}`);
    logger.log('info', `Number of Total Units on Suggested Purchase Orders will be showed on the header from API is >>>>>>${actualTotalUnits}`);
    this.attach(`Number of Total Units on Suggested Purchase Orders will be showed on the header from API is >>>>>>${actualTotalUnits}`);

    expect(expectedTotalUnits, `Total Units on Suggested Purchase Orders should be equal ${expectedTotalUnits}`).toEqual(actualTotalUnits);
})

Then('{} checks total items in PO is matched with total in suggested POs', async function (actor: string) {
    var expectedTotalItemsInPO = Number(await this.getSummaryByVendorResponseBody.find((v: { vendorKey: any; }) => v.vendorKey == this.selectedVendorKey).uniqueItems);
    const actualTotalItemsInPO = this.getCountItemsInPOResponseBody;
    const itemsInPOListFromSummaryVendorAPI = await this.getItemsInPOResponseBody.model.length;
    expect(expectedTotalItemsInPO, `total items in PO is matched with total in suggested POs ${expectedTotalItemsInPO}`).toEqual(actualTotalItemsInPO);
    expect(itemsInPOListFromSummaryVendorAPI, `Total item listed in PO ${itemsInPOListFromSummaryVendorAPI} is matched with then number of Total Products in My Suggested ${expectedTotalItemsInPO}`).toEqual(expectedTotalItemsInPO);
})

Then('{} checks Forecast Recommended Qty is greater than 0', async function (actor: string) {
    var forecastRecommendedQtyOfPOs = await this.getItemsInPOResponseBody.model.map((v: { consolidatedQty: any; }) => v.consolidatedQty);
    forecastRecommendedQtyOfPOs.forEach((qty: any) => {
        expect(qty, `Forecast Recommended Qty ${qty} is greater than 0.`).toBeGreaterThan(0);
    })
})

Then(`{} checks API contract get items in po by vendor key are correct`, async function (actor) {
    // If system did not show any supplier has name, skip to check. We only check if supplierName is Items Without Supplier or specific name.
    if (this.selectedVendorKey != '') {
        if (this.getItemsInPOResponseBody.err !== null) {
            expect(typeof (this.getItemsInPOResponseBody.err), 'err in response is a string').toBe("string");
        }
        else {
            expect(this.getItemsInPOResponseBody.err, 'err value should be null').toBeNull();
        }

        expect(typeof (this.getItemsInPOResponseBody.model), 'model response is a object').toBe("object");
    }
    else {
        // There is no supplier has name
        this.selectedVendorKey = '';
        logger.log('info', `There is no supplier has vendor name not null`);
        this.attach(`There is no supplier has vendor name not null`);
    }
})

Then(`{} checks API contract of item object is purchasing is correct`, async function (actor) {
    // If system did not show any supplier has name, skip to check. We only check if supplierName is Items Without Supplier or specific name.
    if (this.selectedVendorKey != '') {
        logger.log('info', `Random object >>>>>>` + JSON.stringify(this.randomAItemObject, undefined, 4));
        this.attach(`Random object >>>>>>` + JSON.stringify(this.randomAItemObject, undefined, 4));
        itemsInPurchasingResponseSchema.parse(this.randomAItemObject);
    }
    else {
        // There is no supplier has name
        this.selectedVendorKey = '';
        logger.log('info', `There is no supplier has vendor name not null`);
        this.attach(`There is no supplier has vendor name not null`);
    }
})

// Custom 

Then(`{} checks API contract get count items in purchasing custom are correct`, async function (actor) {
    expect(typeof (this.getCountItemsInPurchasingCustomResponseBody), 'Get Count Items in Purchasing Custom response is a number').toBe("number");
})