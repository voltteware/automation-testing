import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as historyOverrideRequest from '../../../../src/api/request/historyOverride.service';
import * as resultsRequest from '../../../../src/api/request/result.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";
import { getHistoryOverrideOfItemResponseSchema, generalResponseSchema } from '../assertion/dashboard/historyOverrideSchema';
import { resultsResponseSchema } from '../assertion/purchasing/purchasingAssertionSchema';

let link: any;

Then(`{} sets PUT api endpoint to update history override`, async function (actor: string) {
    link = `${Links.API_HISTORY_OVERRIDE}`;
});

Then('{} sends a PUT request to update history override', async function (actor: string) {
    let month: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let year: number[] = [new Date().getFullYear() - 1, new Date().getFullYear() - 2, new Date().getFullYear() - 3, new Date().getFullYear() - 4];
    const gridMonth = Math.floor(Math.random() * month.length);
    const gridYear = year[Math.floor(Math.random() * year.length)];
    this.grid = month[gridMonth] + '_' + gridYear;
    // Example of grid in payload: Apr_2022

    let payload = {
        key: `${this.itemKey}`,
        rows: [{
            itemKey: `${this.itemKey}`,
            itemName: `${this.itemName}`,
            grid: `${this.grid}`,
            forecastKey: "m",
            orderQty: Number(faker.datatype.number({ 'min': 1, 'max': 100 })),
            start: Date.UTC(gridYear, gridMonth, 15)
        }]
    }
    logger.log('info', `Payload: ` + JSON.stringify(payload));
    this.attach(`Payload: ` + JSON.stringify(payload));
    this.expectedOrderQty = payload.rows[0].orderQty;
    this.response = await historyOverrideRequest.updateHistoryOverride(this.request, link, payload, this.headers);
    if (this.response.status() == 200) {
        this.updateHistoryOverrideResponseBody = JSON.parse(await this.response.text());
        logger.log('info', `Update History Override ${link} has status code ${this.response.status()} ${this.response.statusText()} and updateHistoryOverrideResponse body ${JSON.stringify(this.updateHistoryOverrideResponseBody, undefined, 4)}`)
        this.attach(`Update History Override ${link} has status code ${this.response.status()} ${this.response.statusText()} and updateHistoryOverrideResponseBody body ${JSON.stringify(this.updateHistoryOverrideResponseBody, undefined, 4)}`)
    } else {
        logger.log('info', `Update History Override ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
        this.attach(`Update History Override ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
    }
});

Then(`{} sets GET api endpoint to get history override of item`, async function (actor: string) {
    link = encodeURI(`${Links.API_HISTORY_OVERRIDE}?id=${this.itemKey}`);
    logger.log('info', `link: ${link}`);
    this.attach(`link: ${link}`);
});

Then(`{} sends a GET request to get history override of item`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getHistoryOverrideResponse = this.response = await historyOverrideRequest.getHistoryOverride(this.request, link, options);
    const responseBodyText = await this.getHistoryOverrideResponse.text();
    if (this.getHistoryOverrideResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getHistoryOverrideResponseBody = JSON.parse(await this.getHistoryOverrideResponse.body());
        logger.log('info', `Response GET ${link}>>>>>` + JSON.stringify(this.getHistoryOverrideResponseBody, undefined, 4));
        this.attach(`Response GET ${link}>>>>>>` + JSON.stringify(this.getHistoryOverrideResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>>${responseBodyText}`);
        this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>>${actualResponseText}`)
    }
});

Then('{} checks API contract of get history override of item api', async function (actor: string) {
    getHistoryOverrideOfItemResponseSchema.parse(this.getHistoryOverrideResponseBody);
});

Then('{} checks API contract of update history override api', async function (actor: string) {
    generalResponseSchema.parse(this.updateHistoryOverrideResponseBody);
});

Then('{} checks value after editing history override of item', async function (actor: string) {
    this.newHistoryOverrideValue = await this.getHistoryOverrideResponseBody.model.find((override: any) => override.grid == this.grid);
    logger.log('info', `History Override Value which has ${this.grid}: ${JSON.stringify(this.newHistoryOverrideValue, undefined, 4)}`);
    this.attach(`History Override Value which has ${this.grid}: ${JSON.stringify(this.newHistoryOverrideValue, undefined, 4)}`);
    const actualOrderQty = this.newHistoryOverrideValue.orderQty;
    expect(actualOrderQty, `Order Qty should be ${this.expectedOrderQty}`).toBe(this.expectedOrderQty);
});

Then('{} sets GET api endpoint to get results of item', async function (actor: string) {
    link = encodeURI(`${Links.API_RESULT}?id=${this.itemKey}`);
});

Then('{} sends a GET request to get results of item', async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getResultsResponse = this.response = await resultsRequest.getResults(this.request, link, options);
    const responseBodyText = await this.getResultsResponse.text();
    if (this.getResultsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getResultsResponseBody = JSON.parse(await this.getResultsResponse.body());
        logger.log('info', `Get results ${link} >>>>>> ` + JSON.stringify(this.getResultsResponseBody, undefined, 4));
        this.attach(`Get results ${link} >>>>>> ` + JSON.stringify(this.getResultsResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
});


Then('{} checks API contract of get results of item', async function (actor: string) {
    resultsResponseSchema.parse(this.getResultsResponseBody);
});

Then('{} checks override history values in Purchasing', async function (actor: string) {
    this.historySnapshot = this.getResultsResponseBody.model.historySnapshot;
    console.log("this.historySnapshot: " + this.historySnapshot);
    // If historySnapShot includes override history value will return true
    const actual = this.historySnapshot.includes(this.expectedOrderQty);
    expect(actual,'Order Qty should be in historySnapShot').toBe(true)
});