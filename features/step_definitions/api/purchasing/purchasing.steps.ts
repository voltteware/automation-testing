import { Then, Given, DataTable } from '@cucumber/cucumber';
import { APIRequestContext, expect } from '@playwright/test';
import * as vendorRequest from '../../../../src/api/request/vendor.service';
import * as itemRequest from '../../../../src/api/request/item.service';
import * as purchasingRequest from '../../../../src/api/request/purchasing.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";

let linkGetRestockSuggestionPurchasing: any;
let linkGetItemInPurchasingCustom: any;
let linkCountSummary: string, linkSummaryVendor: string, linkSummaryVendorWithTotalQtyAndTotalPrice: string, linkCountItemsInPO: string, linkItemsInPO: string;
let linkCountItemsInPurchasingCustom: string, linkGetItemsInPurchasingCustom: string;
let salesVelocitySettingDatas: any[] = [];
let linkGetRestockSuggestionPurchasings: string[] = [];
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
    this.getCountSummaryByVendorResponse = this.response = await vendorRequest.getCountSymmaryByVendor(this.request, linkCountSummary, options);
    const responseBodyText = await this.getCountSummaryByVendorResponse.text();
    if (this.getCountSummaryByVendorResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getCountSummaryByVendorResponseBody = JSON.parse(await this.getCountSummaryByVendorResponse.body());
        logger.log('info', `Response GET ${linkCountSummary} >>>>>>` + JSON.stringify(this.getCountSummaryByVendorResponseBody, undefined, 4));
        this.attach(`Response GET ${linkCountSummary} >>>>>>` + JSON.stringify(this.getCountSummaryByVendorResponseBody, undefined, 4))
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
    this.getSummaryByVendorResponse = this.response = await vendorRequest.getSymmaryByVendor(this.request, linkSummaryVendor, options);
    const responseBodyText = await this.getSummaryByVendorResponse.text();
    if (this.getSummaryByVendorResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getSummaryByVendorResponseBody = JSON.parse(await this.getSummaryByVendorResponse.body());
        logger.log('info', `Response GET ${linkSummaryVendor} >>>>>>` + JSON.stringify(this.getSummaryByVendorResponseBody, undefined, 4));
        this.attach(`Response GET ${linkSummaryVendor} >>>>>>` + JSON.stringify(this.getSummaryByVendorResponseBody, undefined, 4))
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
    this.getSummaryByVendorByCompanyKeyAndTypeResponse = this.response = await vendorRequest.getSymmaryByVendorByComppanyKeyAndType(this.request, linkSummaryVendorWithTotalQtyAndTotalPrice, options);
    const responseBodyText = await this.getSummaryByVendorByCompanyKeyAndTypeResponse.text();
    if (this.getSummaryByVendorByCompanyKeyAndTypeResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getSummaryByVendorByCompanyKeyAndTypeResponseBody = JSON.parse(await this.getSummaryByVendorByCompanyKeyAndTypeResponse.body());
        logger.log('info', `Response GET ${linkSummaryVendorWithTotalQtyAndTotalPrice} >>>>>>` + JSON.stringify(this.getSummaryByVendorByCompanyKeyAndTypeResponseBody, undefined, 4));
        this.attach(`Response GET ${linkSummaryVendorWithTotalQtyAndTotalPrice} >>>>>>` + JSON.stringify(this.getSummaryByVendorByCompanyKeyAndTypeResponseBody, undefined, 4))
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
});

Then(`{} sends a GET request to get count items in PO by vendor by vendor key`, async function (actor) {
    const options = {
        headers: this.headers
    }
    this.getCountItemsinPOResponse = this.response = await vendorRequest.getCountItemsinPO(this.request, linkCountItemsInPO, options);
    const responseBodyText = await this.getCountItemsinPOResponse.text();
    if (this.getCountItemsinPOResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getCountItemsinPOResponseBody = JSON.parse(await this.getCountItemsinPOResponse.body());
        logger.log('info', `Response GET ${linkCountItemsInPO} >>>>>>` + JSON.stringify(this.getCountItemsinPOResponseBody, undefined, 4));
        this.attach(`Response GET ${linkCountItemsInPO} >>>>>>` + JSON.stringify(this.getCountItemsinPOResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkCountItemsInPO} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response GET ${linkCountItemsInPO} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
})

// Vendor Summary
Then(`{} sets api endpoint to get list items in PO of vendor key`, async function (actor: string) {
    linkItemsInPO = encodeURI(`${Links.API_SUMMARY_VENDOR_ITEMS_IN_PO}?offset=0&limit=100&where={"logic":"and","filters":[]}&vendorKey=${this.selectedVendorKey}`);
    console.log(linkItemsInPO);
});

Then(`{} sends a POST request to get list items in PO by vendor by vendor key`, async function (actor) {
    const payload = { "removedItemKeys": [] };
    this.getItemsinPOResponse = this.response = await vendorRequest.getItemsinPO(this.request, linkItemsInPO, payload, this.headers);
    const responseBodyText = await this.getItemsinPOResponse.text();
    if (this.getItemsinPOResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemsinPOResponseBody = JSON.parse(await this.getItemsinPOResponse.body());
        logger.log('info', `Response POST ${linkItemsInPO} >>>>>>` + JSON.stringify(this.getItemsinPOResponseBody, undefined, 4));
        this.attach(`Response POST ${linkItemsInPO} >>>>>>` + JSON.stringify(this.getItemsinPOResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response POST ${linkItemsInPO} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response POST ${linkItemsInPO} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
})

Then('{} checks total items in PO is matched with total in suggested PO of {} and Forecast Recommended Qty > 0 and only show Active Items', async function (actor, supplierName: string) {
    if (supplierName == 'Items Without Supplier') {
        this.selectedVendorKey = null;
    }
    else if (supplierName.includes('random supplier')) {
        // Find the random supplier who has name
        const purchaseOrdersHasSupplierName = await this.getSummaryByVendorResponseBody.filter((po: { vendorKey: null; }) => po.vendorKey != null);
        if (purchaseOrdersHasSupplierName.length > 0) {
            this.selectedVendorKey = this.randomVendorKey = await purchaseOrdersHasSupplierName[Math.floor(Math.random() * purchaseOrdersHasSupplierName.length)].vendorKey;
            logger.log('info', `Random Vendor Key: ${JSON.stringify(this.randomVendorKey, undefined, 4)}`);
            this.attach(`Random Vendor Key: ${JSON.stringify(this.randomVendorKey, undefined, 4)}`);
        }
        else {
            // There is no supplier has name
            this.selectedVendorKey = '';
        }
    }

    // If system did not show any supplier has name, skip to check. We only check if supplierName is Items Without Supplier or specific name.
    if (this.selectedVendorKey != '') {
        linkCountItemsInPO = encodeURI(`${Links.API_SUMMARY_COUNT}?where={"logic":"and","filters":[]}&vendorKey=${this.selectedVendorKey}`);
        const options = {
            headers: this.headers
        }

        // Send request to get Count Items in PO
        this.getCountItemsinPOResponse = this.response = await vendorRequest.getCountItemsinPO(this.request, linkCountItemsInPO, options);
        const getCountItemsinPOResponseText = await this.getCountItemsinPOResponse.text();
        if (this.getCountItemsinPOResponse.status() == 200 && !getCountItemsinPOResponseText.includes('<!doctype html>')) {
            this.responseBody = this.getCountItemsinPOResponseBody = JSON.parse(await this.getCountItemsinPOResponse.text());
            logger.log('info', `Response GET ${linkCountItemsInPO} >>>>>>` + JSON.stringify(this.getCountItemsinPOResponseBody, undefined, 4));
            this.attach(`Response GET ${linkCountItemsInPO} >>>>>>` + JSON.stringify(this.getCountItemsinPOResponseBody, undefined, 4))
        }
        else {
            const actualResponseText = getCountItemsinPOResponseText.includes('<!doctype html>') ? 'html' : getCountItemsinPOResponseText;
            logger.log('info', `Response GET ${linkCountItemsInPO} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${getCountItemsinPOResponseText}`);
            this.attach(`Response GET ${linkCountItemsInPO} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
        }

        // Get Items in PO
        const totalItemsInPO = Number(getCountItemsinPOResponseText);
        linkItemsInPO = encodeURI(`${Links.API_SUMMARY_VENDOR_ITEMS_IN_PO}?offset=0&limit=${totalItemsInPO}&where={"logic":"and","filters":[]}&vendorKey=${this.selectedVendorKey}`);

        const payload = { "removedItemKeys": [] };
        this.getItemsinPOResponse = this.response = await vendorRequest.getItemsinPO(this.request, linkItemsInPO, payload, this.headers);
        const getItemsinPOResponseText = await this.getItemsinPOResponse.text();
        if (this.getItemsinPOResponse.status() == 200 && !getItemsinPOResponseText.includes('<!doctype html>')) {
            this.responseBody = this.getItemsinPOResponseBody = JSON.parse(await this.getItemsinPOResponse.text());
            this.randomAItemObject = this.getItemsinPOResponseBody.model[Math.floor(Math.random() * this.getItemsinPOResponseBody.model.length)];
            logger.log('info', `randomAItemObject in Response POST ${linkItemsInPO} >>>>>>` + JSON.stringify(this.randomAItemObject, undefined, 4));
            this.attach(`randomAItemObject in Response POST ${linkItemsInPO} >>>>>>` + JSON.stringify(this.randomAItemObject, undefined, 4))
        }
        else {
            const actualResponseText = getItemsinPOResponseText.includes('<!doctype html>') ? 'html' : getItemsinPOResponseText;
            logger.log('info', `Response POST ${linkItemsInPO} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${getItemsinPOResponseText}`);
            this.attach(`Response POST ${linkItemsInPO} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
        }

        var expectedTotalItemsInPO = Number(await this.getSummaryByVendorResponseBody.find((v: { vendorKey: any; }) => v.vendorKey == this.selectedVendorKey).uniqueItems);
        const actualTotalItemsInPO = this.getCountItemsinPOResponseBody;
        const itemsInPOListFromSummaryVendorAPI = await this.getItemsinPOResponseBody.model;
        const totalItemsInPOListFromSummaryVendorAPI = itemsInPOListFromSummaryVendorAPI.length;
        expect(expectedTotalItemsInPO, `total items in PO is matched with total in suggested PO of ${supplierName}: ${expectedTotalItemsInPO}`).toEqual(actualTotalItemsInPO);
        expect(totalItemsInPOListFromSummaryVendorAPI, `Total item listed in PO ${totalItemsInPOListFromSummaryVendorAPI} is matched with then number of Total Products in My Suggested of ${supplierName}: ${expectedTotalItemsInPO}`).toEqual(expectedTotalItemsInPO);

        // Check Forecast Recommended Qty is greater than 0
        var forecastRecommendedQtyOfPOs = await this.getItemsinPOResponseBody.model.map((v: { consolidatedQty: any; }) => v.consolidatedQty);
        forecastRecommendedQtyOfPOs.forEach((qty: any) => {
            expect(qty, `Forecast Recommended Qty ${qty} is greater than 0.`).toBeGreaterThan(0);
        })

        // Check Item must be active 
        // get max 10 items only
        const maxRandomItemNumbers = totalItemsInPOListFromSummaryVendorAPI > 10 ? 10 : totalItemsInPOListFromSummaryVendorAPI;
        const randomMax10Items: any = _.sampleSize(itemsInPOListFromSummaryVendorAPI, maxRandomItemNumbers);
        for await (const item of randomMax10Items) {
            const itemKey = item.itemKey;
            const detailItemLink = `${Links.API_ITEMS}/${itemKey}`;
            var itemDetailResponse = await itemRequest.getItems(this.request, detailItemLink, options);
            var itemDetailResponseText = await itemDetailResponse.text();
            if (itemDetailResponse.status() == 200 && !itemDetailResponseText.includes('<!doctype html>')) {
                const itemDetailResponseBody = JSON.parse(itemDetailResponseText);
                logger.log('info', `Response GET ${detailItemLink} >>>>>>` + JSON.stringify(itemDetailResponseBody, undefined, 4));
                this.attach(`Response GET ${detailItemLink} >>>>>>` + JSON.stringify(itemDetailResponseBody, undefined, 4))
                expect(itemDetailResponseBody.isHidden, `Check item ${itemKey} has isHidden = false`).toBeFalsy();
            }
            else {
                const actualResponseText = itemDetailResponseText.includes('<!doctype html>') ? 'html' : itemDetailResponseText;
                logger.log('info', `Response GET ${detailItemLink} has status code ${itemDetailResponse.status()} ${itemDetailResponse.statusText()} and response body >>>>>> ${itemDetailResponseText}`);
                this.attach(`Response GET ${detailItemLink} has status code ${itemDetailResponse.status()} ${itemDetailResponse.statusText()} and response body >>>>>> ${actualResponseText}`)
            }
        }
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
    this.getCountItemsinPurchasingCustomResponse = this.response = await vendorRequest.getCountItemsinPurchasingCustom(this.request, linkCountItemsInPurchasingCustom, options);
    const responseBodyText = await this.getCountItemsinPurchasingCustomResponse.text();
    if (this.getCountItemsinPurchasingCustomResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getCountItemsinPurchasingCustomResponseBody = JSON.parse(await this.getCountItemsinPurchasingCustomResponse.body());
        logger.log('info', `Response GET ${linkCountItemsInPurchasingCustom} >>>>>>` + JSON.stringify(this.getCountItemsinPurchasingCustomResponseBody, undefined, 4));
        this.attach(`Response GET ${linkCountItemsInPurchasingCustom} >>>>>>` + JSON.stringify(this.getCountItemsinPurchasingCustomResponseBody, undefined, 4))
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
    this.getItemsinPurchasingCustomResponse = this.response = await vendorRequest.getItemsinPurchasingCustom(this.request, linkGetItemsInPurchasingCustom, options);
    const responseBodyText = await this.getItemsinPurchasingCustomResponse.text();
    if (this.getItemsinPurchasingCustomResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemsinPurchasingCustomResponseBody = JSON.parse(await this.getItemsinPurchasingCustomResponse.body());
        this.randomAItemObject = this.getItemsinPurchasingCustomResponseBody[Math.floor(Math.random() * this.getItemsinPurchasingCustomResponseBody.length)];
        logger.log('info', `Random object in response GET ${linkGetItemsInPurchasingCustom} >>>>>>` + JSON.stringify(this.randomAItemObject, undefined, 4));
        this.attach(`Random object in response GET ${linkGetItemsInPurchasingCustom} >>>>>>` + JSON.stringify(this.randomAItemObject, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Random object in Response GET ${linkGetItemsInPurchasingCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Random object in Response GET ${linkGetItemsInPurchasingCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
})

Then(`{} checks random items in Purchasing Custom has status is Active`, async function (actor) {
    const options = {
        headers: this.headers
    }

    const maxRandomItemNumbers = this.getCountItemsinPurchasingCustomResponseBody > 10 ? 10 : this.getCountItemsinPurchasingCustomResponseBody;
    const randomMax10Items: any = _.sampleSize(this.getItemsinPurchasingCustomResponseBody, maxRandomItemNumbers);
    for await (const item of randomMax10Items) {
        const itemKey = item.itemKey;
        const detailItemLink = `${Links.API_ITEMS}/${itemKey}`;
        var itemDetailResponse = await itemRequest.getItems(this.request, detailItemLink, options);
        var itemDetailResponseText = await itemDetailResponse.text();
        if (itemDetailResponse.status() == 200 && !itemDetailResponseText.includes('<!doctype html>')) {
            const itemDetailResponseBody = JSON.parse(itemDetailResponseText);
            logger.log('info', `Response GET ${detailItemLink} >>>>>>` + JSON.stringify(itemDetailResponseBody, undefined, 4));
            this.attach(`Response GET ${detailItemLink} >>>>>>` + JSON.stringify(itemDetailResponseBody, undefined, 4))
            expect(itemDetailResponseBody.isHidden, `Check item ${itemKey} has isHidden = false`).toBeFalsy();
        }
        else {
            const actualResponseText = itemDetailResponseText.includes('<!doctype html>') ? 'html' : itemDetailResponseText;
            logger.log('info', `Response GET ${detailItemLink} has status code ${itemDetailResponse.status()} ${itemDetailResponse.statusText()} and response body >>>>>> ${itemDetailResponseText}`);
            this.attach(`Response GET ${detailItemLink} has status code ${itemDetailResponse.status()} ${itemDetailResponse.statusText()} and response body >>>>>> ${actualResponseText}`)
        }
    }
})

Then(`{} checks total items in Custom EQUALS total items active and have lotMultipleItemKey is NULL`, async function (actor) {
    const options = {
        headers: this.headers
    }
    const itemsInCustom = this.getCountItemsinPurchasingCustomResponseBody;
    const itemsActiveAndHaslotMultipleItemKeyNull = this.getCountItemsActiveAndHasLotMultipleItemKeyNullResponseBody;
    expect(itemsInCustom, `Total Items in Purchasing Custom ${itemsInCustom} is equal ${itemsActiveAndHaslotMultipleItemKeyNull}`).toEqual(itemsActiveAndHaslotMultipleItemKeyNull);
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
    this.getItemsinPurchasingCustomResponse = this.response = await vendorRequest.getItemsinPurchasingCustom(this.request, linkGetItemsInPurchasingCustom, options);
    const responseBodyText = await this.getItemsinPurchasingCustomResponse.text();
    if (this.getItemsinPurchasingCustomResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemsinPurchasingCustomResponseBody = JSON.parse(await this.getItemsinPurchasingCustomResponse.body());
        logger.log('info', `Random object in response GET ${linkGetItemsInPurchasingCustom} >>>>>>` + JSON.stringify(this.getItemsinPurchasingCustomResponseBody, undefined, 4));
        this.attach(`Response object in response GET ${linkGetItemsInPurchasingCustom} >>>>>>` + JSON.stringify(this.getItemsinPurchasingCustomResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkGetItemsInPurchasingCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response GET ${linkGetItemsInPurchasingCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
})

Then(`{} selects ramdom items in Purchasing Custom`, async function (actor: string) {
    // Pick random 5 item to check purchasing daily sales rate
    // const shuffledArr = this.getItemsinPurchasingCustomResponseBody.sort(() => Math.random() - 0.5);
    // this.radomFiveItemsInPurchasingCustom = shuffledArr.slice(0, 5)
    this.radomFiveItemsInPurchasingCustom = this.getItemsinPurchasingCustomResponseBody.slice(0, 5)

    this.listKeysOfRandomItems = this.radomFiveItemsInPurchasingCustom.map((item: any) => item.itemKey)

    for (const itemKey of this.listKeysOfRandomItems) {
        logger.log('info', `Item: ${JSON.stringify(itemKey, undefined, 4)}`)
        this.attach(`Item: ${JSON.stringify(itemKey, undefined, 4)}`)
    }
});

Then(`{} selects ramdom items in Purchasing My Suggested`, async function (actor: string) {
    // Use items with name have DefaultPurchasingSaleVelocity to check
    this.getRandomItemsinPurchasingSuggesyion = this.getItemsinPOResponseBody.model.filter((item: any) => item.itemName.includes('DefaultPurchasingSaleVelocity'))
    // Pick random 5 item to check purchasing daily sales rate
    const shuffledArr = this.getRandomItemsinPurchasingSuggesyion.sort(() => Math.random() - 0.5);
    this.radomFiveItemsInPurchasingSuggestion = shuffledArr.slice(0, 5)

    this.listKeysOfRandomItems = this.radomFiveItemsInPurchasingSuggestion.map((item: any) => item.itemKey)

    for (const itemKey of this.listKeysOfRandomItems) {
        logger.log('info', `Item: ${JSON.stringify(itemKey, undefined, 4)}`)
        this.attach(`Item: ${JSON.stringify(itemKey, undefined, 4)}`)
    }
});

Then(`{} sets GET api endpoint to get restock suggestion purchasing`, async function (actor: string) {
    linkGetRestockSuggestionPurchasings = []
    for (const itemKey of this.listKeysOfRandomItems) {
        linkGetRestockSuggestionPurchasings.push(`${Links.API_RESTOCK_SUGGESTION_PURCHASING}/${itemKey}/purchasing`)
        logger.log('info', `Link: ${JSON.stringify(itemKey, undefined, 4)}`)
        this.attach(`Link: ${JSON.stringify(itemKey, undefined, 4)}`)
    }

    for (const link of linkGetRestockSuggestionPurchasings) {
        logger.log('info', `Link: ${JSON.stringify(link, undefined, 4)}`)
        this.attach(`Link: ${JSON.stringify(link, undefined, 4)}`)
    }
});

Then(`{} sends GET request to get restock suggestion purchasing of above items`, async function (actor: string) {
    const options = {
        headers: this.headers
    }

    salesVelocitySettingDatas = []

    for (const linkGetRestockSuggestionPurchasing of linkGetRestockSuggestionPurchasings) {
        this.getRestockSuggestionPurchasingResponse = this.response = await purchasingRequest.getRestockSuggestionPurchasing(this.request, linkGetRestockSuggestionPurchasing, options);
        const responseBodyText = await this.getRestockSuggestionPurchasingResponse.text();
        if (this.getRestockSuggestionPurchasingResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
            this.responseBody = this.getRestockSuggestionPurchasingResponseBody = JSON.parse(await this.getRestockSuggestionPurchasingResponse.body());
            const salesVelocitySettingData = this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData
            salesVelocitySettingDatas.push(salesVelocitySettingData)
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
    for (const salesVelocitySettingData of salesVelocitySettingDatas) {
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
    linkGetItemInPurchasingCustom = encodeURI(`${Links.API_SUMMARY_ITEMS_IN_PURCHASING_CUSTOM}?offset=0&limit=100&where={"filters":[{"filters":[{"field":"itemName","operator":"contains","value":"${itemName}"}],"logic":"and"}],"logic":"and"}`);

    console.log(linkGetItemInPurchasingCustom);
});

Then('User sends a GET request to get item in Purchasing Custom to check purchasing daily sales rate', async function () {
    const options = {
        headers: this.headers
    }
    this.getItemInPurchasingCustomResponse = this.response = await vendorRequest.getItemsinPurchasingCustom(this.request, linkGetItemsInPurchasingCustom, options);
    const responseBodyText = await this.getItemInPurchasingCustomResponse.text();
    if (this.getItemInPurchasingCustomResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemInPurchasingCustomResponseBody = JSON.parse(await this.getItemInPurchasingCustomResponse.body());
        logger.log('info', `Item in response GET ${linkGetItemInPurchasingCustom} >>>>>>` + JSON.stringify(this.randomAItemObject, undefined, 4));
        this.attach(`Item in response GET ${linkGetItemInPurchasingCustom} >>>>>>` + JSON.stringify(this.randomAItemObject, undefined, 4))
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
    linkItemsInPO = encodeURI(`${Links.API_SUMMARY_VENDOR_ITEMS_IN_PO}?offset=0&limit=100&where={"logic":"and","filters":[]}&vendorKey=null`);
    console.log(linkItemsInPO);
});

Then('User sends GET request to get list items in "Purchasing > My Suggested"', async function () {
    const payload = { "removedItemKeys": [] };
    this.getItemsinPOResponse = this.response = await vendorRequest.getItemsinPO(this.request, linkItemsInPO, payload, this.headers);
    const responseBodyText = await this.getItemsinPOResponse.text();
    if (this.getItemsinPOResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemsinPOResponseBody = JSON.parse(await this.getItemsinPOResponse.body());
        // logger.log('info', `Response POST ${linkItemsInPO} >>>>>>` + JSON.stringify(this.getItemsinPOResponseBody, undefined, 4));
        // this.attach(`Response POST ${linkItemsInPO} >>>>>>` + JSON.stringify(this.getItemsinPOResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response POST ${linkItemsInPO} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response POST ${linkItemsInPO} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
});

Then('User save a random item in above list suggested items', function () {
    // Use items with name have DefaultPurchasingSaleVelocity to check
    this.getRandomItemsinPurchasingSuggested = this.getItemsinPOResponseBody.model.filter((item: any) => !item.itemName.includes('DefaultPurchasingSaleVelocity'))
    // Pick random 1 item to check purchasing daily sales rate    
    this.radomAItemsInPurchasingSuggested = this.getRandomItemsinPurchasingSuggested[Math.floor(Math.random() * this.getRandomItemsinPurchasingSuggested.length)]
    this.responseBodyOfAItemObject = this.radomAItemsInPurchasingSuggested
    this.itemName = this.radomAItemsInPurchasingSuggested.itemName
    this.itemKey = this.radomAItemsInPurchasingSuggested.itemKey

    logger.log('info', `Item: ${JSON.stringify(this.radomAItemsInPurchasingSuggested, undefined, 4)}`)
    this.attach(`Item: ${JSON.stringify(this.radomAItemsInPurchasingSuggested, undefined, 4)}`)
});

Then('User save a random item in above list suggested items to assign supplier', function () {
    this.getRandomItemsinPurchasingSuggested = this.getItemsinPOResponseBody.model.filter((item: any) => item.itemName.includes('DefaultPurchasingSaleVelocity'))
    // Pick random 1 item to check purchasing daily sales rate    
    this.radomAItemsInPurchasingSuggested = this.getRandomItemsinPurchasingSuggested[Math.floor(Math.random() * this.getRandomItemsinPurchasingSuggested.length)]
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
    this.getLimitFiveItemResponse = this.response = await vendorRequest.getItemsinPurchasingCustom(this.request, linkGetLimitFiveItemInCustom, options);
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

    salesVelocitySettingDatas = []

    for (const linkGetPercentDefaultOfAverage of linkGetPercentDefaultOfAverages) {
        this.getRestockSuggestionPurchasingResponse = this.response = await purchasingRequest.getRestockSuggestionPurchasing(this.request, linkGetPercentDefaultOfAverage, options);
        const responseBodyText = await this.getRestockSuggestionPurchasingResponse.text();
        if (this.getRestockSuggestionPurchasingResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
            this.responseBody = this.getRestockSuggestionPurchasingResponseBody = JSON.parse(await this.getRestockSuggestionPurchasingResponse.body());
            const salesVelocitySettingData = this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData
            salesVelocitySettingDatas.push(salesVelocitySettingData)
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
    for (const salesVelocitySettingData of salesVelocitySettingDatas) {
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
    this.getItemInPOResponse = this.response = await vendorRequest.getItemsinPO(this.request, linkGetLimitFiveItemInMySuggested, payload, this.headers);
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