import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as supplierRequest from '../../../../src/api/request/company.service';
import * as authenticateRequest from '../../../../src/api/request/authentication.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";

let link: any;

Then(`{} sets GET api endpoint to get suppliers keys`, async function (actor: string) {
    link = Links.API_SUPPLIERS;
});

Then(`{} sets GET api endpoint to get suppliers keys with limit row: {} and sort field: {} with direction: {}`, async function (actor, limitRow, sortField, direction: string) {
    link = `${Links.API_SUPPLIERS}?offset=0&limit=${limitRow}&sort=%5B%7B%22field%22:%22${sortField}%22,%22direction%22:%22${direction}%22%7D%5D&where=%7B%22logic%22:%22and%22,%22filters%22:%5B%5D%7D`;
});

Then(`{} sends a GET request to get suppliers information of {} by company key and company type`, async function (actor, email: string) {
    const options = {
        headers: this.headers
    }
    this.getSupplierResponse = this.response = await supplierRequest.getSuppliers(this.request, link, options);
    const responseBodyText = await this.getSupplierResponse.text();
    if (this.getSupplierResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getSupplierResponseBody = JSON.parse(await this.getSupplierResponse.text());
        // logger.log('info', `Response GET ${link}` + JSON.stringify(this.getSupplierResponseBody, undefined, 4));
        // this.attach(`Response GET ${link}` + JSON.stringify(this.getSupplierResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
})

Then('Check supplier exist in the company, if it does not exist will create supplier', async function () {

    if (this.getSupplierResponseBody.length < 1) {
        this.headers = {
            'Cookie': this.cookie,
            'COMPANY-KEY': this.companyKey,
            'COMPANY-TYPE': this.companyType,
        }
        this.payload = {
            name: `new supplier ${faker.lorem.words(3)}`,
        }
        this.createSupplierResponse = await supplierRequest.createSupplier(this.request, Links.API_CREATE_SUPPLIERS, this.payload, this.headers);
        this.createSupplierResponseBody = JSON.parse(await this.createSupplierResponse.text())
        logger.log('info', `Response after create ${link}` + JSON.stringify(this.createSupplierResponseBody, undefined, 4));
        this.attach(`Response after create ${link}` + JSON.stringify(this.createSupplierResponseBody, undefined, 4))
        // Get list after create supplier new
        const options = {
            headers: this.headers
        }
        this.getSupplierResponse = this.response = await supplierRequest.getSuppliers(this.request, link, options);
        const responseBodyText = await this.getSupplierResponse.text();
        if (this.response.status() == 200) {
            this.getSupplierResponseBody = JSON.parse(await this.getSupplierResponse.text());
            logger.log('info', `Response GET ${link}` + JSON.stringify(this.getSupplierResponseBody, undefined, 4));
            this.attach(`Response GET ${link}` + JSON.stringify(this.getSupplierResponseBody, undefined, 4))
        }
        else {
            const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
            logger.log('info', `Response GET ${link} has status code ${this.getSupplierResponse.status()} ${this.getSupplierResponse.statusText()} and response body ${responseBodyText}`);
            this.attach(`Response GET ${link} has status code ${this.getSupplierResponse.status()} ${this.getSupplierResponse.statusText()} and response body ${actualResponseText}`)
        }
    }
})

Then('{} picks random suppliers in above response', async function (actor: string) {
    this.responseBodyOfASupplierObject = await this.getSupplierResponseBody[Math.floor(Math.random() * this.getSupplierResponseBody.length)];
    logger.log('info', `Random supplier: ${JSON.stringify(this.responseBodyOfASupplierObject, undefined, 4)}`);
    this.attach(`Random supplier: ${JSON.stringify(this.responseBodyOfASupplierObject, undefined, 4)}`);
})

Then('{} checks values in response of random supplier are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfASupplierObject.companyType);
    expect(this.responseBodyOfASupplierObject.companyKey).not.toBeNull();
    expect(this.responseBodyOfASupplierObject.companyName).not.toBeNull();
})

Then('Check items in the response should be sort by field leadTime with direction {}', async function (direction: string) {
    if (direction == 'asc') {
        const expectedList = this.responseBody;
        // const sortedByAsc = _.orderBy(this.responseBody, [`${sortField}`], ['asc']);
        const sortedByAsc = _.orderBy(this.responseBody, [(o) => { return o.leadTime || '' }], ['asc']);

        console.log('22222', expectedList === this.responseBody);
        expect(expectedList, `Check items in the response should be sort by field lead time with direction ${direction}`).toStrictEqual(sortedByAsc);
    }
    else if (direction == 'desc') {
        const expectedList = this.responseBody;
        const sortedByDesc = _.orderBy(this.responseBody, [(o) => { return o.leadTime || '' }], ['desc']);
        expect(expectedList, `Check items in the response should be sort by field lead time with direction ${direction}`).toStrictEqual(sortedByDesc);
    }
});

