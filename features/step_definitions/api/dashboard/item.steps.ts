import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as itemRequest from '../../../../src/api/request/item.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";

let link: string;
var linkGetAllItems: string;
let linkLimitRow: string;

Then(`{} sets GET api endpoint to get item summary`, async function (actor: string) {
    link = `${Links.API_ITEMS}?summary=true&companyKey=${this.companyKey}&companyType=${this.companyType}`;
});

Then(`{} sets GET api endpoint to get item with limit row: {}`, async function (actor, limitRow: string) {
    linkLimitRow = `${Links.API_ITEMS}?offset=0&limit=${limitRow}`;
});

Then(`{} sends a GET request to get items information of {} by company key and company type`, async function (actor, email: string) {
    const options = {
        headers: this.headers
    }
    this.getItemsResponse = this.response = await itemRequest.getItem(this.request, linkLimitRow, options);
    const responseBodyText = await this.getItemsResponse.text();
    if (this.getItemsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemsResponseBody = JSON.parse(await this.getItemsResponse.text());
        // logger.log('info', `Response GET ${link}` + JSON.stringify(this.getSupplierResponseBody, undefined, 4));
        // this.attach(`Response GET ${link}` + JSON.stringify(this.getSupplierResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
})

Then(`{} sends GET api request to get all items`, async function (actor: string) {
    const linkGetItemCount = `${Links.API_ITEMS}/count`
    const getItemCountResponse = await itemRequest.getItemCount(this.request, linkGetItemCount, { headers: this.headers });
    expect(getItemCountResponse.status()).toBe(200);
    const totalItemsCount = Number(await getItemCountResponse.text());
    logger.log('info', `Total Items: ${totalItemsCount}`);
    this.attach(`Total Items: ${totalItemsCount}`)
    linkGetAllItems = `${Links.API_ITEMS}?offset=0&limit=${totalItemsCount}`;

    this.getAllItemsResponse = await itemRequest.getItemCount(this.request, linkGetAllItems, { headers: this.headers });

    const responseBodyText = await this.getAllItemsResponse.text();
    if (this.getAllItemsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getAllItemsResponseBody = JSON.parse(responseBodyText);
    }
    else {
        logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()}`);
        this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
    }
});

Then(`{} sends a GET request to get item summary`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getItemSummaryResponse = this.response = await itemRequest.getItemSummary(this.request, link, options);
    const responseBodyText = await this.getItemSummaryResponse.text();
    if (this.getItemSummaryResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemSummaryResponseBody = JSON.parse(responseBodyText);
        logger.log('info', `Response GET ${link}` + JSON.stringify(this.getItemSummaryResponseBody, undefined, 4));
        this.attach(`Response GET ${link}` + JSON.stringify(this.getItemSummaryResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
})

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