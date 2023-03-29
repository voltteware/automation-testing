import { Then, Given, DataTable } from '@cucumber/cucumber';
import { APIRequestContext, expect } from '@playwright/test';
import * as vendorRequest from '../../../../src/api/request/vendor.service';
import * as itemRequest from '../../../../src/api/request/item.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";

let linkCountSummary: string, linkSummaryVendor: string, linkSummaryVendorWithTotalQtyAndTotalPrice: string, linkCountItemsInPO: string, linkItemsInPO: string;
let linkCountItemsInPurchasingCustom: string, linkGetItemsInPurchasingCustom: string;

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
            logger.log('info', `Response POST ${linkItemsInPO} >>>>>>` + JSON.stringify(this.getItemsinPOResponseBody, undefined, 4));
            this.attach(`Response POST ${linkItemsInPO} >>>>>>` + JSON.stringify(this.getItemsinPOResponseBody, undefined, 4))
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
        logger.log('info', `Response GET ${linkGetItemsInPurchasingCustom} >>>>>>` + JSON.stringify(this.getItemsinPurchasingCustomResponseBody, undefined, 4));
        this.attach(`Response GET ${linkGetItemsInPurchasingCustom} >>>>>>` + JSON.stringify(this.getItemsinPurchasingCustomResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkGetItemsInPurchasingCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response GET ${linkGetItemsInPurchasingCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
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
