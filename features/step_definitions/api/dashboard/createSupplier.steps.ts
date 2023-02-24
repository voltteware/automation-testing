import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as supplierRequest from '../../../../src/api/request/vendor.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";

let link: any;
let payload: {
    name?: string,
    description?: string,
    email?: string,
    moq?: Number,
    leadTime?: Number,
    orderInterval?: Number,
    serviceLevel?: Number,
    targetOrderValue?: Number,
    freeFreightMinimum?: Number,
    restockModel?: string,
    addressData?: [
        {
            key?: string,
            vendorKey?: string,
            countryCode?: string,
            fullName?: string,
            addressLine1?: string,
            addressLine2?: string,
            city?: string,
            stateOrProvinceCode?: string,
            postalCode?: string,
            phoneNumber?: string
        }
    ],

} = {}

Then(`{} sets POST api endpoint to create suppliers`, async function (actor: string) {
    link = Links.API_SUPPLIERS;
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

Then('{} sets request body with payload as name: {string} and description: {string} and email: {string} and moq: {string} and leadTime: {string} and orderInterval: {string} and serviceLevel: {string} and targetOrderValue: {string} and freeFreightMinimum: {string} and restockModel: {string}',
    async function (actor, name, description, email, moq, leadTime, orderInterval, serviceLevel, targetOrderValue, freeFreightMinimum, restockModel: string) {
        if (name.includes('New Supplier Auto')) {
            payload.name = `${faker.company.name()} Auto`;
        }
        payload.description = description;
        payload.email = email;
        if (moq == 'random') {
            payload.moq = Number(faker.datatype.number({
                'min': 1,
                'max': 10
            }));
        }
        else {
            payload.moq = Number(moq);
        }

        if (leadTime == 'random') {
            payload.leadTime = Number(faker.datatype.number({
                'min': 1,
                'max': 365
            }));
        }
        else {
            payload.leadTime = Number(leadTime);
        }

        if (orderInterval == 'random') {
            payload.orderInterval = Number(faker.random.numeric());
        }
        else {
            payload.orderInterval = Number(orderInterval);
        }

        if (serviceLevel == 'random') {
            payload.serviceLevel = Number(faker.random.numeric(2));
        }
        else {
            payload.serviceLevel = Number(serviceLevel);
        }

        if (targetOrderValue == 'random') {
            payload.targetOrderValue = Number(faker.random.numeric(3));
        }
        else {
            payload.targetOrderValue = Number(targetOrderValue);
        }

        if (freeFreightMinimum == 'random') {
            payload.freeFreightMinimum = Number(faker.random.numeric(3));
        }
        else {
            payload.freeFreightMinimum = Number(freeFreightMinimum);
        }
        payload.restockModel = restockModel;

        this.attach(`Payload: ${JSON.stringify(payload, undefined, 4)}`)
    });

Then('{} adds address information in the payload: address {string} and city {string} and stateOrProvinceCode {string} and postalCode {string} and countryCode {string} and phoneNumber {string}',
    async function (actor, address, city, stateOrProvinceCode, postalCode, countryCode, phoneNumber: string) {
        if (address == 'random') {
            payload.addressData = [
                {
                    countryCode: countryCode,
                    addressLine1: faker.address.streetAddress(),
                    city: faker.address.city(),
                    stateOrProvinceCode: faker.address.state(),
                    postalCode: faker.address.zipCode()
                }
            ]
        }
        else {
            payload.addressData = [
                {
                    countryCode: countryCode,
                    addressLine1: address,
                    city: city,
                    stateOrProvinceCode: stateOrProvinceCode,
                    postalCode: postalCode
                }
            ]
        }
        this.attach(`Payload: ${JSON.stringify(payload, undefined, 4)}`)
    });

Then('{} sends a POST method to create supplier', async function (actor: string) {
    this.response = this.createSupplierResponse = await supplierRequest.createSupplier(this.request, link, payload, this.headers);
    const responseBodyText = await this.createSupplierResponse.text();
    console.log(responseBodyText);
    if (this.createSupplierResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBodyOfASupplierObject = JSON.parse(responseBodyText)
        logger.log('info', `Response POST ${link}` + JSON.stringify(this.responseBodyOfASupplierObject, undefined, 4));
        this.attach(`Response POST ${link}` + JSON.stringify(this.responseBodyOfASupplierObject, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
})

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
    if (payload.targetOrderValue) {
        expect(this.responseBodyOfASupplierObject.targetOrderValue, `In response body, targetOrderValue should be matched with the data request: ${payload.targetOrderValue}`).toBe(payload.targetOrderValue);
    }

    if (payload.freeFreightMinimum) {
        expect(this.responseBodyOfASupplierObject.freeFreightMinimum, `In response body, freeFreightMinimum should be matched with the data request: ${payload.freeFreightMinimum}`).toBe(payload.freeFreightMinimum);
    }

    if (payload.restockModel) {
        expect(this.responseBodyOfASupplierObject.restockModel, `In response body, restockModel should be matched with the data request: ${payload.restockModel}`).toBe(payload.restockModel);
    }
})

