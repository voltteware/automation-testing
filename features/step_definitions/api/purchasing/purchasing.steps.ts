import { Then, Given, DataTable } from '@cucumber/cucumber';
import { APIRequestContext, expect } from '@playwright/test';
import * as vendorRequest from '../../../../src/api/request/vendor.service';
import * as itemRequest from '../../../../src/api/request/item.service';
import * as purchasingRequest from '../../../../src/api/request/purchasing.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import { itemsInPurchasingResponseSchema } from '../assertion/purchasing/purchasingAssertionSchema';
import _ from "lodash";

let linkGetRestockSuggestionPurchasing: any;
let linkGetItemInPurchasingCustom: any;
let linkCountSummary: string, linkSummaryVendor: string, linkSummaryVendorWithTotalQtyAndTotalPrice: string, linkCountItemsInPO: string, linkItemsInPO: string;
let linkCountItemsInPurchasingCustom: string, linkGetItemsInPurchasingCustom: string;
let salesVelocitySettingDataArray: any[] = [];
let linkGetRestockSuggestionPurchasingArray: string[] = [];
let linkGetPercentDefaultOfAverages: string[] = [];
let linkGetLimitFiveItemInMySuggested: any;
let linkGetLimitFiveItemInCustom: any;

// My Suggested POs
Then(`{} sets GET api endpoint to get count summary by vendor`, async function (actor: string) {
    linkCountSummary = encodeURI(`${Links.API_GET_COUNT_SUMMARY_BY_VENDOR}/count?where={"logic":"and","filters":[]}`);
    console.log(linkCountSummary);
});

Then(`{} sets GET api endpoint to get summary by vendor`, async function (actor: string) {
    linkSummaryVendor = encodeURI(`${Links.API_GET_COUNT_SUMMARY_BY_VENDOR}?offset=0&limit=100&where={"logic":"and","filters":[]}`);
    console.log(linkSummaryVendor);
});

Then(`{} sets GET api endpoint to get Summary Suggested Purchase Orders: Total Price, Total Qty, Unique Items`, async function (actor: string) {
    linkSummaryVendorWithTotalQtyAndTotalPrice = encodeURI(`${Links.API_GET_COUNT_SUMMARY_BY_VENDOR}?companyKey=${this.companyKey}&companyType=${this.companyType}`);
    console.log(linkSummaryVendorWithTotalQtyAndTotalPrice);
});

Then(`{} sends a GET request to get count summary by vendor`, async function (actor) {
    const options = {
        headers: this.headers
    }
    this.getCountSummaryByVendorResponse = this.response = await vendorRequest.getCountSummaryByVendor(this.request, linkCountSummary, options);
    const responseBodyText = await this.getCountSummaryByVendorResponse.text();
    if (this.getCountSummaryByVendorResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getCountSummaryByVendorResponseBody = JSON.parse(await this.getCountSummaryByVendorResponse.body());
        logger.log('info', `Response GET ${linkCountSummary} returns number of items should be showed on My Suggested page>>>>>>` + JSON.stringify(this.getCountSummaryByVendorResponseBody, undefined, 4));
        this.attach(`Response GET ${linkCountSummary} returns number of items should be showed on My Suggested page>>>>>>` + JSON.stringify(this.getCountSummaryByVendorResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkCountSummary} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response GET ${linkCountSummary} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
})

Then(`{} sends a GET request to get summary by vendor`, async function (actor) {
    const options = {
        headers: this.headers
    }
    this.getSummaryByVendorResponse = this.response = await vendorRequest.getSummaryByVendor(this.request, linkSummaryVendor, options);
    const responseBodyText = await this.getSummaryByVendorResponse.text();
    if (this.getSummaryByVendorResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getSummaryByVendorResponseBody = JSON.parse(await this.getSummaryByVendorResponse.body());
        logger.log('info', `Response GET ${linkSummaryVendor} returns list items showed on My Suggested page >>>>>>` + JSON.stringify(this.getSummaryByVendorResponseBody, undefined, 4));
        this.attach(`Response GET ${linkSummaryVendor} returns list items showed on My Suggested page >>>>>>` + JSON.stringify(this.getSummaryByVendorResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkSummaryVendor} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response GET ${linkSummaryVendor} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
})

Then(`{} sends a GET request to get total price, total qty and unique items on Purchasing My Suggest`, async function (actor) {
    const options = {
        headers: this.headers
    }
    this.getSummaryByVendorByCompanyKeyAndTypeResponse = this.response = await vendorRequest.getSummaryByVendorByCompanyKeyAndType(this.request, linkSummaryVendorWithTotalQtyAndTotalPrice, options);
    const responseBodyText = await this.getSummaryByVendorByCompanyKeyAndTypeResponse.text();
    if (this.getSummaryByVendorByCompanyKeyAndTypeResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getSummaryByVendorByCompanyKeyAndTypeResponseBody = JSON.parse(await this.getSummaryByVendorByCompanyKeyAndTypeResponse.body());
        logger.log('info', `Response GET ${linkSummaryVendorWithTotalQtyAndTotalPrice} returns information to show in the header of Purchasing My Suggest >>>>>>` + JSON.stringify(this.getSummaryByVendorByCompanyKeyAndTypeResponseBody, undefined, 4));
        this.attach(`Response GET ${linkSummaryVendorWithTotalQtyAndTotalPrice} returns information to show in the header of Purchasing My Suggest >>>>>>` + JSON.stringify(this.getSummaryByVendorByCompanyKeyAndTypeResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkSummaryVendorWithTotalQtyAndTotalPrice} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response GET ${linkSummaryVendorWithTotalQtyAndTotalPrice} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
})

Then(`{} selects any suggested purchase orders above that has supplier name`, async function (actor: string) {
    const purchaseOrdersHasSupplierName = await this.getSummaryByVendorResponseBody.filter((po: { vendorKey: null; }) => po.vendorKey != null);
    if (purchaseOrdersHasSupplierName.length > 0) {
        this.randomVendorKey = await purchaseOrdersHasSupplierName[Math.floor(Math.random() * purchaseOrdersHasSupplierName.length)].vendorKey;
        logger.log('info', `Random Vendor Key: ${JSON.stringify(this.randomVendorKey, undefined, 4)}`);
        this.attach(`Random Vendor Key: ${JSON.stringify(this.randomVendorKey, undefined, 4)}`);
    }
});

// My Suggested - Items in PO
Then(`{} sets GET api endpoint to get count items in PO by vendor key {}`, async function (actor, vendorKey: string) {
    // If system did not show any supplier has name, skip to check. We only check if supplierName is Items Without Supplier or specific name.
    if (this.selectedVendorKey != '') {
        if (vendorKey == 'null') {
            this.selectedVendorKey = null;
            linkCountItemsInPO = encodeURI(`${Links.API_SUMMARY_COUNT}?where={"logic":"and","filters":[]}&vendorKey=null`);
        }
        else if (vendorKey == 'random') {
            this.selectedVendorKey = this.randomVendorKey;
            linkCountItemsInPO = encodeURI(`${Links.API_SUMMARY_COUNT}?where={"logic":"and","filters":[]}&vendorKey=${this.selectedVendorKey}`);
        }
        else {
            this.selectedVendorKey = vendorKey;
            linkCountItemsInPO = encodeURI(`${Links.API_SUMMARY_COUNT}?where={"logic":"and","filters":[]}&vendorKey=${this.selectedVendorKey}`);
        }

        console.log(linkCountItemsInPO);
    }
    else {
        // There is no supplier has name
        this.selectedVendorKey = '';
        logger.log('info', `There is no supplier has vendor name not null`);
        this.attach(`There is no supplier has vendor name not null`);
    }
});

Then(`{} sends request to get count items on Items in PO by vendor key`, async function (actor) {
    // If system did not show any supplier has name, skip to check. We only check if supplierName is Items Without Supplier or specific name.
    if (this.selectedVendorKey != '') {
        const options = {
            headers: this.headers
        }
        this.getCountItemsinPOResponse = this.response = await vendorRequest.getCountItemsInPO(this.request, linkCountItemsInPO, options);
        const responseBodyText = await this.getCountItemsinPOResponse.text();
        if (this.getCountItemsinPOResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
            this.responseBody = this.getCountItemsinPOResponseBody = JSON.parse(await this.getCountItemsinPOResponse.body());
            this.totalItems = this.getCountItemsinPOResponseBody;
            logger.log('info', `Response GET ${linkCountItemsInPO} >>>>>>` + JSON.stringify(this.getCountItemsinPOResponseBody, undefined, 4));
            this.attach(`Response GET ${linkCountItemsInPO} >>>>>>` + JSON.stringify(this.getCountItemsinPOResponseBody, undefined, 4))
        }
        else {
            const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
            logger.log('info', `Response GET ${linkCountItemsInPO} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
            this.attach(`Response GET ${linkCountItemsInPO} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
        }
    }
    else {
        // There is no supplier has name
        this.selectedVendorKey = '';
        logger.log('info', `There is no supplier has vendor name not null`);
        this.attach(`There is no supplier has vendor name not null`);
    }
})

// Vendor Summary
Then(`{} sets api endpoint to get list items in PO of vendor key`, async function (actor: string) {
    // If system did not show any supplier has name, skip to check. We only check if supplierName is Items Without Supplier or specific name.
    if (this.selectedVendorKey != '') {
        const limitItems = this.totalItems != 0 ? this.totalItems : 100;
        linkItemsInPO = encodeURI(`${Links.API_SUMMARY_VENDOR_ITEMS_IN_PO}?offset=0&limit=${limitItems}&where={"logic":"and","filters":[]}&vendorKey=${this.selectedVendorKey}`);
        console.log(linkItemsInPO);
    }
    else {
        // There is no supplier has name
        this.selectedVendorKey = '';
        logger.log('info', `There is no supplier has vendor name not null`);
        this.attach(`There is no supplier has vendor name not null`);
    }
});

Then(`{} sends a POST request to get list items in PO by vendor key`, async function (actor) {
    // If system did not show any supplier has name, skip to check. We only check if supplierName is Items Without Supplier or specific name.
    if (this.selectedVendorKey != '') {
        const payload = { "removedItemKeys": [] };
        this.getItemsinPOResponse = this.response = await vendorRequest.getItemsInPO(this.request, linkItemsInPO, payload, this.headers);
        const responseBodyText = await this.getItemsinPOResponse.text();
        if (this.getItemsinPOResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
            this.responseBody = this.getItemsInPOResponseBody = JSON.parse(await this.getItemsinPOResponse.body());
            this.getItemsResponseBody = this.getItemsInPOResponseBody.model;
            this.randomAItemObject = this.getItemsInPOResponseBody.model[Math.floor(Math.random() * this.getItemsInPOResponseBody.model.length)];

            logger.log('info', `Response POST ${linkItemsInPO} >>>>>>` + JSON.stringify(this.randomAItemObject, undefined, 4));
            this.attach(`Response POST ${linkItemsInPO} >>>>>>` + JSON.stringify(this.randomAItemObject, undefined, 4))
        }
        else {
            const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
            logger.log('info', `Response POST ${linkItemsInPO} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
            this.attach(`Response POST ${linkItemsInPO} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
        }
    }
    else {
        // There is no supplier has name
        this.selectedVendorKey = '';
        this.getItemsResponseBody = null;
        logger.log('info', `There is no supplier has vendor name not null`);
        this.attach(`There is no supplier has vendor name not null`);
    }
})

Then('{} selects suggested PO of {}', async function (actor, supplierName: string) {
    if (supplierName == 'Items Without Supplier') {
        this.selectedVendorKey = null;
        this.selectedVendorName = null;
    }
    else if (supplierName.includes('random supplier')) {
        // Find the random supplier
        const purchaseOrdersHasSupplierName = await this.getSummaryByVendorResponseBody.filter((po: { vendorKey: null; }) => po.vendorKey != null);
        if (purchaseOrdersHasSupplierName.length > 0) {
            const selectedVendor = await purchaseOrdersHasSupplierName[Math.floor(Math.random() * purchaseOrdersHasSupplierName.length)];
            this.selectedVendorKey = this.randomVendorKey = await selectedVendor.vendorKey;
            this.selectedVendorName = await selectedVendor.vendorName;
            logger.log('info', `Random Vendor Key: ${JSON.stringify(this.selectedVendorKey, undefined, 4)}`);
            this.attach(`Random Vendor Key: ${JSON.stringify(this.selectedVendorKey, undefined, 4)}`);
            logger.log('info', `Random Vendor Name: ${JSON.stringify(this.selectedVendorName, undefined, 4)}`);
            this.attach(`Random Vendor Name: ${JSON.stringify(this.selectedVendorName, undefined, 4)}`);
        }
        else {
            // There is no supplier has name
            this.selectedVendorKey = '';
            logger.log('info', `There is no supplier has vendor name not null`);
            this.attach(`There is no supplier has vendor name not null`);
        }
    }
})

Then(`{} checks total items in PO is matched with total products in suggested PO of {}`, async function (actor, supplierName: string) {
    // If system did not show any supplier has name, skip to check. We only check if supplierName is Items Without Supplier or specific name.
    if (this.selectedVendorKey != '') {
        linkCountItemsInPO = encodeURI(`${Links.API_SUMMARY_COUNT}?where={"logic":"and","filters":[]}&vendorKey=${this.selectedVendorKey}`);
        const options = {
            headers: this.headers
        }

        const selectedSuggestedPO = await this.getSummaryByVendorResponseBody.find((v: { vendorKey: any; }) => v.vendorKey == this.selectedVendorKey);
        var totalProductsOfSpecificRecordsOnSuggestedPOs = Number(await selectedSuggestedPO.uniqueItems);
        const actualTotalItemsInPO = this.getCountItemsinPOResponseBody;
        const itemsInPOListFromSummaryVendorAPI = await this.getItemsInPOResponseBody.model;
        const totalItemsInPOListFromSummaryVendorAPI = itemsInPOListFromSummaryVendorAPI.length;
        logger.log('info', `Total Products in Suggested POs of ${supplierName} >>>>>> ${totalProductsOfSpecificRecordsOnSuggestedPOs}`);
        this.attach(`Total Products in Suggested POs of ${supplierName} >>>>>> ${totalProductsOfSpecificRecordsOnSuggestedPOs}`);
        logger.log('info', `Number of records on Items in PO of ${supplierName} >>>>>> ${totalItemsInPOListFromSummaryVendorAPI}`);
        this.attach(`Number of records on Items in PO of ${supplierName} >>>>>> ${totalItemsInPOListFromSummaryVendorAPI}`);
        expect(actualTotalItemsInPO, `Number in the response of Get Count Items in PO is matched with Total Products in Suggested POs of ${supplierName} on My Suggested: ${totalProductsOfSpecificRecordsOnSuggestedPOs}`).toEqual(totalProductsOfSpecificRecordsOnSuggestedPOs);
        expect(totalItemsInPOListFromSummaryVendorAPI, `Total item listed  Items in PO ${totalItemsInPOListFromSummaryVendorAPI} is matched with then number of Total Products in My Suggested of ${supplierName}: ${totalProductsOfSpecificRecordsOnSuggestedPOs}`).toEqual(totalProductsOfSpecificRecordsOnSuggestedPOs);
    }
    else {
        // There is no supplier has name
        this.selectedVendorKey = '';
        logger.log('info', `There is no supplier has vendor name not null`);
        this.attach(`There is no supplier has vendor name not null`);
    }
})

Then('{} checks Total Qty of all Items in PO is matched with Total Qty in suggested PO of {}', async function (actor, supplierName: string) {
    // If system did not show any supplier has name, skip to check. We only check if supplierName is Items Without Supplier or specific name.
    if (this.selectedVendorKey != '') {
        let totalQtyOfItemsinPOOfSelectedSuggestedPO: Number = 0;
        let totalQtyInSuggestedPO: Number = 0;

        totalQtyInSuggestedPO = this.getSummaryByVendorResponseBody.find((v: { vendorKey: null; }) => v.vendorKey == this.selectedVendorKey).totalQty;
        this.getItemsInPOResponseBody.model.forEach((v: { purchaseQty: any; }) => {
            totalQtyOfItemsinPOOfSelectedSuggestedPO += v.purchaseQty;
        });

        logger.log('info', `Total Qty of all items in Items in PO of ${supplierName} >>>>>> ${totalQtyOfItemsinPOOfSelectedSuggestedPO}`);
        this.attach(`Total Qty of all items in Items in PO of ${supplierName} >>>>>> ${totalQtyOfItemsinPOOfSelectedSuggestedPO}`);
        logger.log('info', `Total Qty in suggested PO of ${supplierName} >>>>>> ${totalQtyInSuggestedPO}`);
        this.attach(`Total Qty in suggested PO of ${supplierName} >>>>>> ${totalQtyInSuggestedPO}`);
        expect(totalQtyOfItemsinPOOfSelectedSuggestedPO, `Total Qty of all Items in PO is matched with Total Qty in suggested PO of ${supplierName} on My Suggested: ${totalQtyInSuggestedPO}`).toEqual(totalQtyInSuggestedPO);
    }
    else {
        // There is no supplier has name
        this.selectedVendorKey = '';
        logger.log('info', `There is no supplier has vendor name not null`);
        this.attach(`There is no supplier has vendor name not null`);
    }
})

Then('{} checks Total Cost of all Items in PO is matched with Total Cost in suggested PO of {}', async function (actor, supplierName: string) {
    // If system did not show any supplier has name, skip to check. We only check if supplierName is Items Without Supplier or specific name.
    if (this.selectedVendorKey != '') {
        let totalCostOfItemsinPOOfSelectedSuggestedPO: Number = 0;
        let totalCostInSuggestedPO: Number = 0;

        totalCostInSuggestedPO = this.getSummaryByVendorResponseBody.find((v: { vendorKey: null; }) => v.vendorKey == this.selectedVendorKey).totalPrice;
        this.getItemsInPOResponseBody.model.forEach((v: { total: any; }) => {
            totalCostOfItemsinPOOfSelectedSuggestedPO += v.total;
        });

        logger.log('info', `Total Cost of all items in Items in PO of ${supplierName} >>>>>> ${totalCostOfItemsinPOOfSelectedSuggestedPO}`);
        this.attach(`Total Cost of all items in Items in PO of ${supplierName} >>>>>> ${totalCostOfItemsinPOOfSelectedSuggestedPO}`);
        logger.log('info', `Total Cost in suggested PO of ${supplierName} >>>>>> ${totalCostInSuggestedPO}`);
        this.attach(`Total Cost in suggested PO of ${supplierName} >>>>>> ${totalCostInSuggestedPO}`);
        expect(totalCostOfItemsinPOOfSelectedSuggestedPO, `Total Cost of all Items in PO is matched with Total Cost in suggested PO of ${supplierName} on My Suggested: ${totalCostInSuggestedPO}`).toEqual(totalCostInSuggestedPO);
    }
    else {
        // There is no supplier has name
        this.selectedVendorKey = '';
        logger.log('info', `There is no supplier has vendor name not null`);
        this.attach(`There is no supplier has vendor name not null`);
    }
})

Then(`{} checks Forecast Recommended Qty of all items in PO of suggested PO of {} > 0`, async function (actor, supplierName: string) {
    // If system did not show any supplier has name, skip to check. We only check if supplierName is Items Without Supplier or specific name.
    if (this.selectedVendorKey != '') {
        // Check Forecast Recommended Qty is greater than 0
        var forecastRecommendedQtyOfPOs = await this.getItemsInPOResponseBody.model.map((v: { consolidatedQty: any; }) => v.consolidatedQty);
        forecastRecommendedQtyOfPOs.forEach((qty: any) => {
            expect(qty, `Forecast Recommended Qty ${qty} is greater than 0.`).toBeGreaterThan(0);
        })
    }
    else {
        // There is no supplier has name
        this.selectedVendorKey = '';
        logger.log('info', `There is no supplier has vendor name not null`);
        this.attach(`There is no supplier has vendor name not null`);
    }
})

// Custom
Then(`{} sets GET api endpoint to get count items in Purchasing Custom`, async function (actor: string) {
    linkCountItemsInPurchasingCustom = encodeURI(`${Links.API_SUMMARY_COUNT}?where={"logic":"and","filters":[]}`);

    console.log(linkCountItemsInPurchasingCustom);
});

Then(`{} sends a GET request to get count items in Purchasing Custom`, async function (actor) {
    const options = {
        headers: this.headers
    }
    this.getCountItemsInPurchasingCustomResponse = this.response = await itemRequest.getCountItemsInPurchasingCustom(this.request, linkCountItemsInPurchasingCustom, options);
    const responseBodyText = await this.getCountItemsInPurchasingCustomResponse.text();
    if (this.getCountItemsInPurchasingCustomResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getCountItemsInPurchasingCustomResponseBody = JSON.parse(await this.getCountItemsInPurchasingCustomResponse.body());
        logger.log('info', `Response GET ${linkCountItemsInPurchasingCustom} >>>>>>` + JSON.stringify(this.getCountItemsInPurchasingCustomResponseBody, undefined, 4));
        this.attach(`Response GET ${linkCountItemsInPurchasingCustom} >>>>>>` + JSON.stringify(this.getCountItemsInPurchasingCustomResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkCountItemsInPurchasingCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response GET ${linkCountItemsInPurchasingCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
})

Then(`{} sets GET api endpoint to get items in Purchasing Custom`, async function (actor: string) {
    linkGetItemsInPurchasingCustom = encodeURI(`${Links.API_SUMMARY_ITEMS_IN_PURCHASING_CUSTOM}?offset=0&limit=100&where={"logic":"and","filters":[]}`);

    console.log(linkGetItemsInPurchasingCustom);
});

Then(`{} sends a GET request to get items in Purchasing Custom`, async function (actor) {
    const options = {
        headers: this.headers
    }
    this.getItemsInPurchasingCustomResponse = this.response = await itemRequest.getItemsInPurchasingCustom(this.request, linkGetItemsInPurchasingCustom, options);
    const responseBodyText = await this.getItemsInPurchasingCustomResponse.text();
    if (this.getItemsInPurchasingCustomResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemsInPurchasingCustomResponseBody = this.getItemsResponseBody = JSON.parse(await this.getItemsInPurchasingCustomResponse.body());
        this.randomAItemObject = this.getItemsInPurchasingCustomResponseBody[Math.floor(Math.random() * this.getItemsInPurchasingCustomResponseBody.length)];
        logger.log('info', `Random object in response GET ${linkGetItemsInPurchasingCustom} >>>>>>` + JSON.stringify(this.randomAItemObject, undefined, 4));
        this.attach(`Random object in response GET ${linkGetItemsInPurchasingCustom} >>>>>>` + JSON.stringify(this.randomAItemObject, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Random object in Response GET ${linkGetItemsInPurchasingCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Random object in Response GET ${linkGetItemsInPurchasingCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
})

Then(`{} checks total items in Custom EQUALS total items active and have lotMultipleItemKey is NULL`, async function (actor) {
    const options = {
        headers: this.headers
    }
    const itemsInCustom = this.getCountItemsInPurchasingCustomResponseBody;
    const itemsActiveAndHasLotMultipleItemKeyNull = this.getCountItemsActiveAndHasLotMultipleItemKeyNullResponseBody;
    expect(itemsInCustom, `Total Items in Purchasing Custom ${itemsInCustom} is equal ${itemsActiveAndHasLotMultipleItemKeyNull}`).toEqual(itemsActiveAndHasLotMultipleItemKeyNull);
})

Then(`{} sets GET api endpoint to get items in Purchasing Custom to check purchasing daily sales rate`, async function (actor: string) {
    // Use items with name have DefaultPurchasingSaleVelocity to check
    linkGetItemsInPurchasingCustom = encodeURI(`${Links.API_SUMMARY_ITEMS_IN_PURCHASING_CUSTOM}?offset=0&limit=100&where={"filters":[{"filters":[{"field":"itemName","operator":"contains","value":"DefaultPurchasingSaleVelocity"}],"logic":"and"}],"logic":"and"}`);

    console.log(linkGetItemsInPurchasingCustom);
});

Then(`{} sends a GET request to get items in Purchasing Custom to check purchasing daily sales rate`, async function (actor) {
    const options = {
        headers: this.headers
    }
    this.getItemsInPurchasingCustomResponse = this.response = await itemRequest.getItemsInPurchasingCustom(this.request, linkGetItemsInPurchasingCustom, options);
    const responseBodyText = await this.getItemsInPurchasingCustomResponse.text();
    if (this.getItemsInPurchasingCustomResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemsInPurchasingCustomResponseBody = JSON.parse(await this.getItemsInPurchasingCustomResponse.body());
        logger.log('info', `Random object in response GET ${linkGetItemsInPurchasingCustom} >>>>>>` + JSON.stringify(this.getItemsInPurchasingCustomResponseBody, undefined, 4));
        this.attach(`Response object in response GET ${linkGetItemsInPurchasingCustom} >>>>>>` + JSON.stringify(this.getItemsInPurchasingCustomResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkGetItemsInPurchasingCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response GET ${linkGetItemsInPurchasingCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
})

Then(`{} selects random items in Purchasing Custom`, async function (actor: string) {
    // Pick random 5 item to check purchasing daily sales rate
    // const shuffledArr = this.getItemsInPurchasingCustomResponseBody.sort(() => Math.random() - 0.5);
    // this.radomFiveItemsInPurchasingCustom = shuffledArr.slice(0, 5)
    this.radomFiveItemsInPurchasingCustom = this.getItemsInPurchasingCustomResponseBody.slice(0, 5)

    this.listKeysOfRandomItems = this.radomFiveItemsInPurchasingCustom.map((item: any) => item.itemKey)

    for (const itemKey of this.listKeysOfRandomItems) {
        logger.log('info', `Item: ${JSON.stringify(itemKey, undefined, 4)}`)
        this.attach(`Item: ${JSON.stringify(itemKey, undefined, 4)}`)
    }
});

Then(`{} selects random items in Purchasing My Suggested`, async function (actor: string) {
    // Use items with name have DefaultPurchasingSaleVelocity to check
    this.getRandomItemsInPurchasingSuggestion = this.getItemsInPOResponseBody.model.filter((item: any) => item.itemName != null && item.itemName.includes('DefaultPurchasingSaleVelocity'))
    // Pick random 5 item to check purchasing daily sales rate
    const shuffledArr = this.getRandomItemsInPurchasingSuggestion.sort(() => Math.random() - 0.5);
    this.radomFiveItemsInPurchasingSuggestion = shuffledArr.slice(0, 5)

    this.listKeysOfRandomItems = this.radomFiveItemsInPurchasingSuggestion.map((item: any) => item.itemKey)

    for (const itemKey of this.listKeysOfRandomItems) {
        logger.log('info', `Item: ${JSON.stringify(itemKey, undefined, 4)}`)
        this.attach(`Item: ${JSON.stringify(itemKey, undefined, 4)}`)
    }
});

Then(`{} sets GET api endpoint to get restock suggestion purchasing`, async function (actor: string) {
    linkGetRestockSuggestionPurchasing = []
    for (const itemKey of this.listKeysOfRandomItems) {
        linkGetRestockSuggestionPurchasing.push(`${Links.API_RESTOCK_SUGGESTION_PURCHASING}/${itemKey}/purchasing`)
        logger.log('info', `Link: ${JSON.stringify(itemKey, undefined, 4)}`)
        this.attach(`Link: ${JSON.stringify(itemKey, undefined, 4)}`)
    }

    for (const link of linkGetRestockSuggestionPurchasing) {
        logger.log('info', `Link: ${JSON.stringify(link, undefined, 4)}`)
        this.attach(`Link: ${JSON.stringify(link, undefined, 4)}`)
    }
});

Then(`{} sends GET request to get restock suggestion purchasing of above items`, async function (actor: string) {
    const options = {
        headers: this.headers
    }

    salesVelocitySettingDataArray = []

    for (const linkGetRestockSuggestionPurchasing of linkGetRestockSuggestionPurchasingArray) {
        this.getRestockSuggestionPurchasingResponse = this.response = await purchasingRequest.getRestockSuggestionPurchasing(this.request, linkGetRestockSuggestionPurchasing, options);
        const responseBodyText = await this.getRestockSuggestionPurchasingResponse.text();
        if (this.getRestockSuggestionPurchasingResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
            this.responseBody = this.getRestockSuggestionPurchasingResponseBody = JSON.parse(await this.getRestockSuggestionPurchasingResponse.body());
            const salesVelocitySettingData = this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData
            salesVelocitySettingDataArray.push(salesVelocitySettingData)
            logger.log('info', `Response GET ${linkGetRestockSuggestionPurchasing} >>>>>>` + JSON.stringify(this.getRestockSuggestionPurchasingResponseBody, undefined, 4));
            this.attach(`Response GET ${linkGetRestockSuggestionPurchasing} >>>>>>` + JSON.stringify(this.getRestockSuggestionPurchasingResponseBody, undefined, 4))
        }
        else {
            const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
            logger.log('info', `Response GET ${linkGetRestockSuggestionPurchasing} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
            this.attach(`Response GET ${linkGetRestockSuggestionPurchasing} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
        }
    }
});

Then(`{} checks purchasing daily sales rate of item using default setting on company detail`, async function (actor: string) {
    for (const salesVelocitySettingData of salesVelocitySettingDataArray) {
        expect(salesVelocitySettingData.percent2Day, `The weight of 2-day is equal ${this.randomWeightNumbers[0]}`).toEqual(this.randomWeightNumbers[0]);
        expect(salesVelocitySettingData.percent7Day, `The weight of 7-day is equal ${this.randomWeightNumbers[1]}`).toEqual(this.randomWeightNumbers[1]);
        expect(salesVelocitySettingData.percent14Day, `The weight of 14-day is equal ${this.randomWeightNumbers[2]}`).toEqual(this.randomWeightNumbers[2]);
        expect(salesVelocitySettingData.percent30Day, `The weight of 30-day is equal ${this.randomWeightNumbers[3]}`).toEqual(this.randomWeightNumbers[3]);
        expect(salesVelocitySettingData.percent60Day, `The weight of 60-day is equal ${this.randomWeightNumbers[4]}`).toEqual(this.randomWeightNumbers[4]);
        expect(salesVelocitySettingData.percent90Day, `The weight of 90-day is equal ${this.randomWeightNumbers[5]}`).toEqual(this.randomWeightNumbers[5]);
        expect(salesVelocitySettingData.percent180Day, `The weight of 180-day is equal ${this.randomWeightNumbers[6]}`).toEqual(this.randomWeightNumbers[6]);
        expect(salesVelocitySettingData.percentForecasted, `The weight of forecastRx demand is equal ${this.randomWeightNumbers[7]}`).toEqual(this.randomWeightNumbers[7]);
    }
});

Then(`{} checks average daily sales rate number of item in {}`, async function (actor: string, string) {
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent2Day, `The weight of 2-day is equal ${this.randomWeightNumbers[0]}`).toEqual(this.randomWeightNumbers[0]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent7Day, `The weight of 7-day is equal ${this.randomWeightNumbers[1]}`).toEqual(this.randomWeightNumbers[1]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent14Day, `The weight of 14-day is equal ${this.randomWeightNumbers[2]}`).toEqual(this.randomWeightNumbers[2]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent30Day, `The weight of 30-day is equal ${this.randomWeightNumbers[3]}`).toEqual(this.randomWeightNumbers[3]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent60Day, `The weight of 60-day is equal ${this.randomWeightNumbers[4]}`).toEqual(this.randomWeightNumbers[4]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent90Day, `The weight of 90-day is equal ${this.randomWeightNumbers[5]}`).toEqual(this.randomWeightNumbers[5]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent180Day, `The weight of 180-day is equal ${this.randomWeightNumbers[6]}`).toEqual(this.randomWeightNumbers[6]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percentForecasted, `The weight of forecastRx demand is equal ${this.randomWeightNumbers[7]}`).toEqual(this.randomWeightNumbers[7]);
});

Then('User sets GET api endpoint to get item in Purchasing Custom to check purchasing daily sales rate', function () {
    const itemName = this.itemName
    linkGetItemInPurchasingCustom = encodeURI(`${Links.API_SUMMARY_ITEMS_IN_PURCHASING_CUSTOM}?offset=0&limit=10&where={"filters":[{"filters":[{"field":"itemName","operator":"contains","value":"${itemName}"}],"logic":"and"}],"logic":"and"}`);
    logger.log('info', `linkGetItemInPurchasingCustom ${linkGetItemInPurchasingCustom}`);
    this.attach(`linkGetItemInPurchasingCustom: ${linkGetItemInPurchasingCustom}`);
});

Then('User sends a GET request to get item in Purchasing Custom to check purchasing daily sales rate', async function () {
    const options = {
        headers: this.headers
    }
    this.getItemInPurchasingCustomResponse = this.response = await itemRequest.getItemsInPurchasingCustom(this.request, linkGetItemInPurchasingCustom, options);
    const responseBodyText = await this.getItemInPurchasingCustomResponse.text();
    if (this.getItemInPurchasingCustomResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemInPurchasingCustomResponseBody = JSON.parse(await this.getItemInPurchasingCustomResponse.body());
        logger.log('info', `Item in response GET ${linkGetItemInPurchasingCustom} >>>>>> ` + JSON.stringify(this.getItemInPurchasingCustomResponseBody, undefined, 4));
        this.attach(`Item in response GET ${linkGetItemInPurchasingCustom} >>>>>> ` + JSON.stringify(this.getItemInPurchasingCustomResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkGetItemInPurchasingCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response GET ${linkGetItemInPurchasingCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
});

Then('User sets GET api endpoint to get restock suggestion purchasing of an above item', function () {
    linkGetRestockSuggestionPurchasing = `${Links.API_RESTOCK_SUGGESTION_PURCHASING}/${this.itemKey}/purchasing`;
    logger.log('info', `Link: ${JSON.stringify(linkGetRestockSuggestionPurchasing, undefined, 4)}`)
    this.attach(`Link: ${JSON.stringify(linkGetRestockSuggestionPurchasing, undefined, 4)}`)
});

Then('User sends GET request to get restock suggestion purchasing of an above item', async function () {
    const options = {
        headers: this.headers
    }

    this.getRestockSuggestionPurchasingResponse = this.response = await purchasingRequest.getRestockSuggestionPurchasing(this.request, linkGetRestockSuggestionPurchasing, options);
    const responseBodyText = await this.getRestockSuggestionPurchasingResponse.text();
    if (this.getRestockSuggestionPurchasingResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getRestockSuggestionPurchasingResponseBody = JSON.parse(await this.getRestockSuggestionPurchasingResponse.body());
        logger.log('info', `Response GET ${linkGetRestockSuggestionPurchasing} >>>>>>` + JSON.stringify(this.getRestockSuggestionPurchasingResponseBody, undefined, 4));
        this.attach(`Response GET ${linkGetRestockSuggestionPurchasing} >>>>>>` + JSON.stringify(this.getRestockSuggestionPurchasingResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkGetRestockSuggestionPurchasing} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response GET ${linkGetRestockSuggestionPurchasing} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
});

Then('User sets GET api endpoint to get list items in "Purchasing > My Suggested"', function () {
    linkItemsInPO = encodeURI(`${Links.API_SUMMARY_VENDOR_ITEMS_IN_PO}?offset=0&limit=5&where={"filters":[{"filters":[{"field":"itemName","operator":"contains","value":"DefaultPurchasingSaleVelocity"}],"logic":"and"}],"logic":"and"}&vendorKey=null`);
    console.log(linkItemsInPO);
});

Then('User sends GET request to get list items in "Purchasing > My Suggested"', async function () {
    const payload = { "removedItemKeys": [] };
    this.getItemsInPOResponse = this.response = await vendorRequest.getItemsInPO(this.request, linkItemsInPO, payload, this.headers);
    const responseBodyText = await this.getItemsInPOResponse.text();
    if (this.getItemsInPOResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemsInPOResponseBody = JSON.parse(await this.getItemsInPOResponse.body());
        logger.log('info', `Response POST ${linkItemsInPO} >>>>>>` + JSON.stringify(this.getItemsInPOResponseBody, undefined, 4));
        this.attach(`Response POST ${linkItemsInPO} >>>>>>` + JSON.stringify(this.getItemsInPOResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response POST ${linkItemsInPO} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response POST ${linkItemsInPO} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
});

Then('User save a random item in above list suggested items', function () {
    // Use items with name have DefaultPurchasingSaleVelocity to check
    this.getRandomItemsInPurchasingSuggested = this.getItemsInPOResponseBody.model.filter((item: any) => item.itemName != null && item.itemName.includes('DefaultPurchasingSaleVelocity'))
    // Pick random 1 item to check purchasing daily sales rate    
    this.radomAItemsInPurchasingSuggested = this.getRandomItemsInPurchasingSuggested[Math.floor(Math.random() * this.getRandomItemsInPurchasingSuggested.length)]
    this.responseBodyOfAItemObject = this.radomAItemsInPurchasingSuggested
    this.itemName = this.radomAItemsInPurchasingSuggested.itemName
    this.itemKey = this.radomAItemsInPurchasingSuggested.itemKey

    logger.log('info', `Item: ${JSON.stringify(this.radomAItemsInPurchasingSuggested, undefined, 4)}`)
    this.attach(`Item: ${JSON.stringify(this.radomAItemsInPurchasingSuggested, undefined, 4)}`)
});

Then('User save a random item in above list suggested items to assign supplier', function () {
    this.getRandomItemsInPurchasingSuggested = this.getItemsInPOResponseBody.model.filter((item: any) => item.itemName != null && item.itemName.includes('DefaultPurchasingSaleVelocity'))
    // Pick random 1 item to check purchasing daily sales rate    
    this.radomAItemsInPurchasingSuggested = this.getRandomItemsInPurchasingSuggested[Math.floor(Math.random() * this.getRandomItemsInPurchasingSuggested.length)]
    this.responseBodyOfAItemObject = this.radomAItemsInPurchasingSuggested
    this.itemName = this.radomAItemsInPurchasingSuggested.itemName
    this.itemKey = this.radomAItemsInPurchasingSuggested.itemKey

    logger.log('info', `Item: ${JSON.stringify(this.radomAItemsInPurchasingSuggested, undefined, 4)}`)
    this.attach(`Item: ${JSON.stringify(this.radomAItemsInPurchasingSuggested, undefined, 4)}`)
});

Given(`User sets GET api endpoint to get list items in "Purchasing > Custom" to check default purchasing daily sales rate`, function () {
    linkGetLimitFiveItemInCustom = `${Links.API_SUMMARY_ITEMS_IN_PURCHASING_CUSTOM}?offset=0&limit=5`
});

Given(`User sends a GET request to get list items in items in "Purchasing > Custom" to check default purchasing daily sales rate`, async function () {
    const options = {
        headers: this.headers
    }
    this.getLimitFiveItemResponse = this.response = await itemRequest.getItemsInPurchasingCustom(this.request, linkGetLimitFiveItemInCustom, options);
    const responseBodyText = await this.getLimitFiveItemResponse.text();
    if (this.getLimitFiveItemResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getLimitFiveItemResponseBody = JSON.parse(await this.getLimitFiveItemResponse.body());
        logger.log('info', `Random object in response GET ${linkGetItemsInPurchasingCustom} >>>>>>` + JSON.stringify(this.getLimitFiveItemResponseBody, undefined, 4));
        this.attach(`Response object in response GET ${linkGetItemsInPurchasingCustom} >>>>>>` + JSON.stringify(this.getLimitFiveItemResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkGetItemsInPurchasingCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response GET ${linkGetItemsInPurchasingCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
});

Then(`{} sets GET api endpoint to get percent default of "Average"`, async function (actor: string) {
    linkGetPercentDefaultOfAverages = []
    for (const item of this.getLimitFiveItemResponseBody) {
        linkGetPercentDefaultOfAverages.push(`${Links.API_RESTOCK_SUGGESTION_PURCHASING}/${item.itemKey}/purchasing`)
        logger.log('info', `Link: ${JSON.stringify(item.itemKey, undefined, 4)}`)
        this.attach(`Link: ${JSON.stringify(item.itemKey, undefined, 4)}`)
    }

    for (const link of linkGetPercentDefaultOfAverages) {
        logger.log('info', `Link: ${JSON.stringify(link, undefined, 4)}`)
        this.attach(`Link: ${JSON.stringify(link, undefined, 4)}`)
    }
});

Then(`{} sends GET request to get percent default of "Average"`, async function (actor: string) {
    const options = {
        headers: this.headers
    }

    salesVelocitySettingDataArray = []

    for (const linkGetPercentDefaultOfAverage of linkGetPercentDefaultOfAverages) {
        this.getRestockSuggestionPurchasingResponse = this.response = await purchasingRequest.getRestockSuggestionPurchasing(this.request, linkGetPercentDefaultOfAverage, options);
        const responseBodyText = await this.getRestockSuggestionPurchasingResponse.text();
        if (this.getRestockSuggestionPurchasingResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
            this.responseBody = this.getRestockSuggestionPurchasingResponseBody = JSON.parse(await this.getRestockSuggestionPurchasingResponse.body());
            const salesVelocitySettingData = this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData
            salesVelocitySettingDataArray.push(salesVelocitySettingData)
            logger.log('info', `Response GET ${linkGetPercentDefaultOfAverage} >>>>>>` + JSON.stringify(this.getRestockSuggestionPurchasingResponseBody, undefined, 4));
            this.attach(`Response GET ${linkGetPercentDefaultOfAverage} >>>>>>` + JSON.stringify(this.getRestockSuggestionPurchasingResponseBody, undefined, 4))
        }
        else {
            const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
            logger.log('info', `Response GET ${linkGetRestockSuggestionPurchasing} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
            this.attach(`Response GET ${linkGetRestockSuggestionPurchasing} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
        }
    }
});

Then(`{} checks the percent default of "Average" is the same as setting in company default`, async function (actor: string) {
    const percentDefaultOfAverage: number[] = [0, 20, 0, 20, 10, 0, 0, 50]
    for (const salesVelocitySettingData of salesVelocitySettingDataArray) {
        expect.soft(salesVelocitySettingData.percent2Day, `The weight of 2-day is equal ${percentDefaultOfAverage[0]}`).toEqual(percentDefaultOfAverage[0]);
        expect.soft(salesVelocitySettingData.percent7Day, `The weight of 7-day is equal ${percentDefaultOfAverage[1]}`).toEqual(percentDefaultOfAverage[1]);
        expect.soft(salesVelocitySettingData.percent14Day, `The weight of 14-day is equal ${percentDefaultOfAverage[2]}`).toEqual(percentDefaultOfAverage[2]);
        expect.soft(salesVelocitySettingData.percent30Day, `The weight of 30-day is equal ${percentDefaultOfAverage[3]}`).toEqual(percentDefaultOfAverage[3]);
        expect.soft(salesVelocitySettingData.percent60Day, `The weight of 60-day is equal ${percentDefaultOfAverage[4]}`).toEqual(percentDefaultOfAverage[4]);
        expect.soft(salesVelocitySettingData.percent90Day, `The weight of 90-day is equal ${percentDefaultOfAverage[5]}`).toEqual(percentDefaultOfAverage[5]);
        expect.soft(salesVelocitySettingData.percent180Day, `The weight of 180-day is equal ${percentDefaultOfAverage[6]}`).toEqual(percentDefaultOfAverage[6]);
        expect.soft(salesVelocitySettingData.percentForecasted, `The weight of forecastRx demand is equal ${percentDefaultOfAverage[7]}`).toEqual(percentDefaultOfAverage[7]);
    }
});

Given(`User sets GET api endpoint to get list items in "Purchasing > My Suggested" to check default purchasing daily sales rate`, function () {
    linkGetLimitFiveItemInMySuggested = encodeURI(`${Links.API_SUMMARY_VENDOR_ITEMS_IN_PO}?offset=0&limit=5&where={"logic":"and","filters":[]}&vendorKey=null`);
});

Given(`User sends a GET request to get list items in items in "Purchasing > My Suggested" to check default purchasing daily sales rate`, async function () {
    const payload = { "removedItemKeys": [] };
    this.getItemInPOResponse = this.response = await vendorRequest.getItemsInPO(this.request, linkGetLimitFiveItemInMySuggested, payload, this.headers);
    const responseBodyText = await this.getItemInPOResponse.text();
    if (this.getItemInPOResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemInPOResponseBody = JSON.parse(await this.getItemInPOResponse.body());
        logger.log('info', `Response POST ${linkGetLimitFiveItemInMySuggested} >>>>>>` + JSON.stringify(this.getItemInPOResponseBody, undefined, 4));
        this.attach(`Response POST ${linkGetLimitFiveItemInMySuggested} >>>>>>` + JSON.stringify(this.getItemInPOResponseBody, undefined, 4))

        this.getLimitFiveItemResponseBody = this.getItemInPOResponseBody.model
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response POST ${linkGetLimitFiveItemInMySuggested} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response POST ${linkGetLimitFiveItemInMySuggested} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
});

Then('{} checks API contract of get items in Purchasing Custom api', async function (actor: string) {
    itemsInPurchasingResponseSchema.parse(this.radomFiveItemsInPurchasingCustom);
});