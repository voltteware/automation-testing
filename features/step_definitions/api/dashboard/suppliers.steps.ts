import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as supplierRequest from '../../../../src/api/request/vendor.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";
import { sortLocale } from '../../../../src/helpers/array-helper';

let link: any;

Then(`{} sets GET api endpoint to get suppliers keys`, async function (actor: string) {
    link = Links.API_SUPPLIERS;
});

Then(`{} sets GET api endpoint to get suppliers keys with limit row: {} and sort field: {} with direction: {}`, async function (actor, limitRow, sortField, direction: string) {
    link = encodeURI(`${Links.API_SUPPLIERS}?offset=0&limit=${limitRow}&sort=[{"field":"${sortField}","direction":"${direction}"}]&where={"logic":"and","filters":[]}`);
});

Then(`{} sets GET api endpoint to get suppliers with limit row: {}`, async function (actor, limitRow: string) {
    link = encodeURI(`${Links.API_SUPPLIERS}?offset=0&limit=${limitRow}`);
});

Then(`{} sends a GET request to get list suppliers`, async function (actor) {
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

Then(`{} sends a GET request to get total of suppliers`, async function (actor: string) {
    const link = `${Links.API_SUPPLIERS}/count?where=%7B%22logic%22:%22and%22,%22filters%22:%5B%5D%7D`
    const options = {
        headers: this.headers
    }
    this.getTotalSupplierResponse = this.response = await supplierRequest.getSuppliers(this.request, link, options);
    this.totalSupplier = await this.getTotalSupplierResponse.text();
    logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${this.totalSupplier}`);
    this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${this.totalSupplier}`)
})

Then('{} picks random supplier in above response', async function (actor: string) {
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

Then('{} checks {} supplier exist in the system, if it does not exist will create new supplier', async function (actor, supplierNameKeyword: string) {
    var numberofSuppliers;

    if (supplierNameKeyword != 'any') {
        numberofSuppliers = await this.getSupplierResponseBody.filter((su: any) => su.name.includes(supplierNameKeyword)).length;
    }
    else {
        numberofSuppliers = await this.getSupplierResponseBody.length;
    }

    if (numberofSuppliers < 1) {
        const payload = {
            name: `${faker.company.name()} Auto`
        }
        const createResponse = await supplierRequest.createSupplier(this.request, Links.API_SUPPLIERS, payload, this.headers);
        const responseBodyText = await createResponse.text();
        if (createResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
            await this.getSupplierResponseBody.push(JSON.parse(responseBodyText));
            logger.log('info', `Response POST ${Links.API_SUPPLIERS}` + JSON.stringify(responseBodyText, undefined, 4));
            this.attach(`Response POST ${Links.API_SUPPLIERS}` + JSON.stringify(responseBodyText, undefined, 4))
        }
        else {
            const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
            logger.log('info', `Response POST ${Links.API_SUPPLIERS} has status code ${createResponse.status()} ${createResponse.statusText()} and response body ${responseBodyText}`);
            this.attach(`Response POST ${Links.API_SUPPLIERS} has status code ${createResponse.status()} ${createResponse.statusText()} and response body ${actualResponseText}`)
        }
    }
})

Then('{} filters {} suppliers which has the name includes {}', async function (actor, maximumSuppliers, supplierNameKeyword: string) {
    if (supplierNameKeyword.includes('any character')) {
        this.selectedSuppliers = await this.getSupplierResponseBody;
    }
    else {
        this.selectedSuppliers = await this.getSupplierResponseBody.filter((su: any) => su.name.includes(supplierNameKeyword));
    }

    const suppliers = await this.selectedSuppliers;
    if (maximumSuppliers != 'all') {
        this.selectedSuppliers = suppliers.slice(0, Number(maximumSuppliers))
    }

    logger.log('info', `Selected ${this.selectedSuppliers.length} suppliers which has the name includes ${supplierNameKeyword}` + JSON.stringify(await this.selectedSuppliers, undefined, 4));
    this.attach(`Selected ${this.selectedSuppliers.length} suppliers which has the name includes ${supplierNameKeyword}` + JSON.stringify(await this.selectedSuppliers, undefined, 4));
    expect(this.selectedSuppliers.length, 'Expect that there is at least user is selected').toBeGreaterThan(0);
})

Then('{} sends a DELETE method to delete supplier', async function (actor: string) {
    var supplierKeys = this.selectedSuppliers.map((su: any) => su.key);

    var payLoad = {
        ids: supplierKeys
    }

    logger.log('info', `Payload` + JSON.stringify(payLoad, undefined, 4));
    this.attach(`Payload` + JSON.stringify(payLoad, undefined, 4))

    this.response = await supplierRequest.deleteSupplier(this.request, Links.API_SUPPLIERS, payLoad, this.headers);
    logger.log('info', `Response DELETE ${Links.API_SUPPLIERS} has status code ${this.response.status()} ${this.response.statusText()} and response body ${await this.response.text()}`);
    this.attach(`Response DELETE ${Links.API_SUPPLIERS} has status code ${this.response.status()} ${this.response.statusText()} and response body ${await this.response.text()}`)
})

Then('{} checks the total suppliers is correct', async function (actor: string) {
    const link = `${Links.API_SUPPLIERS}/count?where=%7B%22logic%22:%22and%22,%22filters%22:%5B%5D%7D`;
    const options = {
        headers: this.headers
    }
    const response = await supplierRequest.getSuppliers(this.request, link, options);
    const currentTotalSuppliers = Number(await response.text());
    const beforeTotalSuppliers = Number(this.totalSupplier);
    logger.log('info', `Current total suppliers: ${currentTotalSuppliers}`);
    this.attach(`Current total suppliers: ${currentTotalSuppliers}`);
    expect(currentTotalSuppliers).not.toBeNaN();
    expect(beforeTotalSuppliers).not.toBeNaN();
    expect(currentTotalSuppliers).toEqual(beforeTotalSuppliers - this.selectedSuppliers.length);
})

Then('Check items in the response should be sort by field name with direction {}', async function (direction: 'asc' | 'desc') {
        const expectedList = this.responseBody;
        const sortResult = sortLocale(expectedList, 'name', direction);
        expect(expectedList, `Check items in the response should be sort by field name with direction ${direction}`).toStrictEqual(sortResult);
});