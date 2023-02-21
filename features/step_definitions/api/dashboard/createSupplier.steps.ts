import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as supplierRequest from '../../../../src/api/request/company.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";

let link: any;
let payload: { name?: string, description?: string, email?: string, moq?: Number, leadTime?: Number, orderInterval?: Number, serviceLevel?: Number } = {}

Then(`{} sets POST api endpoint to create suppliers keys`, async function (actor: string) {
    link = Links.API_CREATE_SUPPLIERS;
});

Then('{} sets request body with payload as name: {string} and description: {string} and email: {string} and moq: {int} and leadTime: {int} and orderInterval: {int} and serviceLevel: {int}',
    async function (actor, name, description, email: string, moq, leadTime, orderInterval, serviceLevel: Number) {
        if (name.includes('New Supplier Auto')) {
            payload.name = `supplier auto ${faker.lorem.words(2)}`;
        }
        payload.description = description;
        payload.email = email;
        payload.moq = moq;
        payload.leadTime = leadTime;
        payload.orderInterval = orderInterval;
        payload.serviceLevel = serviceLevel;
        this.attach(`Payload: ${JSON.stringify(payload, undefined, 4)}`)
    });

// Then('{} sends a POST method to create supplier', async function (actor: string) {

//     this.headers = {
//         'Cookie': this.cookie,
//         'COMPANY-KEY': this.companyKey,
//         'COMPANY-TYPE': this.companyType,
//     }
//     this.createSupplierResponse = await supplierRequest.createSupplier(this.request, link, payload, this.headers);
//     this.responseBodyOfASupplierObject = JSON.parse(await this.createSupplierResponse.text())
//     logger.log('info', `Response POST ${link}` + JSON.stringify(this.responseBodyOfASupplierObject, undefined, 4));
//     this.attach(`Response POST ${link}` + JSON.stringify(this.responseBodyOfASupplierObject, undefined, 4))
// })

Then('{} sends a POST method to create supplier', async function (actor: string) {
    this.response = this.createSupplierResponse = await supplierRequest.createSupplier(this.request, link, payload, this.headers);
    const responseBodyText = await this.createSupplierResponse.text();
    console.log(responseBodyText);
    if (this.createSupplierResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBodyOfASupplierObject = JSON.parse(responseBodyText)
        logger.log('info', `Response POST ${link}` + JSON.stringify(this.responseBodyOfACompanyObject, undefined, 4));
        this.attach(`Response POST ${link}` + JSON.stringify(this.responseBodyOfACompanyObject, undefined, 4))
    }
    else if (responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response POST ${link} ${responseBodyText}`);
        this.attach(`Response POST ${link} returns html`)
    }
})

// Then('{} sends a POST method to create supplier with invalid', async function (actor: string) {
//     this.headers = {
//         'Cookie': this.cookieHeaderValue,
//         'COMPANY-KEY': this.companyKeyHeaderValue,
//         'COMPANY-TYPE': this.companyTypeHeaderValue,
//     }
//     this.createSupplierResponse = await supplierRequest.createSupplier(this.request, link, payload, this.headers);
//     this.responseBodyOfASupplierObject = JSON.parse(await this.createSupplierResponse.text())
//     logger.log('info', `Response POST ${link}` + JSON.stringify(this.responseBodyOfASupplierObject, undefined, 4));
//     this.attach(`Response POST ${link}` + JSON.stringify(this.responseBodyOfASupplierObject, undefined, 4))
// })

Then('{} checks values in response of create supplier are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    const expectedSupplierName = payload.name;
    const expectedSupplierDescription = payload.description;
    const expectedSupplierEmail = payload.email;
    const expectedSupplierMoq = payload.moq;
    const expectedSupplierLeadTime = payload.leadTime;
    const expectedSupplierOrderInterval = payload.orderInterval;
    const expectedSupplierserviceLevel = payload.serviceLevel;
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfASupplierObject.companyType);
    expect(this.responseBodyOfASupplierObject.companyKey).not.toBeNull();
    expect(this.responseBodyOfASupplierObject.name, `In response body, name should be matched with the data request: ${expectedSupplierName}`).toBe(expectedSupplierName);
    expect(this.responseBodyOfASupplierObject.description, `In response body, description should be matched with the data request: ${expectedSupplierDescription}`).toBe(expectedSupplierDescription);
    expect(this.responseBodyOfASupplierObject.email, `In response body, email should be matched with the data request: ${expectedSupplierEmail}`).toBe(expectedSupplierEmail);
    expect(this.responseBodyOfASupplierObject.moq, `In response body, moq should be matched with the data request: ${expectedSupplierMoq}`).toBe(expectedSupplierMoq);
    expect(this.responseBodyOfASupplierObject.leadTime, `In response body, leadTime should be matched with the data request: ${expectedSupplierLeadTime}`).toBe(expectedSupplierLeadTime);
    expect(this.responseBodyOfASupplierObject.orderInterval, `In response body, orderInterval should be matched with the data request: ${expectedSupplierOrderInterval}`).toBe(expectedSupplierOrderInterval);
    expect(this.responseBodyOfASupplierObject.serviceLevel, `In response body, serviceLevel should be matched with the data request: ${expectedSupplierserviceLevel}`).toBe(expectedSupplierserviceLevel);
})

