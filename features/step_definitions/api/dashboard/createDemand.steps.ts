import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as demandRequest from '../../../../src/api/request/demand.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";

let link: any;

Then(`{} sets POST api endpoint to create demand`, async function (actor: string) {
    this.orderKey = faker.datatype.uuid()
    this.rowKey = faker.datatype.uuid()
    link = `${Links.API_DEMAND}/manual/${this.orderKey}/${this.rowKey}`;
});

Then('{} sets request body with payload as itemName: {string} and dateOfSale: {string} and saleOrderQty: {string} and openSaleOrderQty: {string} and referenceNumber: {string}', async function (actor, itemName: string, dateOfSale: string, saleOrderQty: string, openSaleOrderQty: string, referenceNumber: string) {

    switch (itemName) {
        case 'random':
            const randomItem = this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
            this.itemKey = randomItem.key
            this.itemName = randomItem.name
            break;
        case '':
            this.itemKey = null
            this.itemName = null
            break;
        default:
            break;
    }

    switch (dateOfSale) {
        case 'random':
            const currentDate = new Date();
            // Outputs a date string in the format "mm/dd/yyyy"
            // The expected due date have format "mm/dd/yyyy" because after edit the reponsebody return due date with format mm/dd/yyyy
            this.expectedDueDate = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

            // And  the due date in request body have format yyyy-mm-dd
            const year = currentDate.getFullYear();
            const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
            const day = ('0' + currentDate.getDate()).slice(-2);
            this.dueDate = `${year}-${month}-${day}`;
            break;

        default:
            break;
    }

    switch (saleOrderQty) {
        case 'random':
            // generates a random integer between 0 and 100 inclusive
            this.orderQty = Math.floor(Math.random() * 101);
            break;
        case 'nonnumerical':
            this.orderQty = "abc"
            break;
        default:
            const isNumber = !isNaN(parseFloat(saleOrderQty)) && isFinite(+saleOrderQty);
            if (isNumber) {
                this.orderQty = +saleOrderQty
            } else {
                console.log('The saleOrderQty is not a valid number.');
            }

            logger.log('info', `Sale Order Qty: ${this.orderQty}`);
            this.attach(`Sale Order Qty: ${this.orderQty}`);
            break;
    }

    switch (openSaleOrderQty) {
        case 'random':
            this.openQty = Math.floor(Math.random() * 101);
            break;
        case 'greaterThanSaleOrderQty':
            // Outputs a random number greater than or equal to minNumber
            const minNumber = this.orderQty + 1;
            this.openQty = Math.floor(Math.random() * (200 - minNumber) + minNumber);
            break;
        case 'nonnumerical':
            this.openQty = "abc"
            break;
        default:
            const isNumber = !isNaN(parseFloat(openSaleOrderQty)) && isFinite(+openSaleOrderQty);
            if (isNumber) {
                this.openQty = +openSaleOrderQty
            } else {
                console.log('The openSaleOrderQty is not a valid number.');
            }

            logger.log('info', `Opens Sale Order Qty: ${this.openQty}`);
            this.attach(`Opens Sale Order Qty: ${this.openQty}`);
            break;
    }

    switch (referenceNumber) {
        case 'random':
            this.refNum = Math.floor(Math.random() * 101);
            break;
        default:
            break;
    }

    this.payLoad = {
        "docType": "manual",
        "orderKey": `${this.orderKey}`,
        "rowKey": `${this.rowKey}`,
        "refNum": `${this.refNum}`,
        "itemKey": `${this.itemKey}`,
        "itemName": `${this.itemName}`,
        "fnsku": "",
        "imageUrl": "",
        "asin": "",
        "dueDate": `${this.dueDate}`,
        "orderQty": this.orderQty,
        "openQty": this.openQty,
        "lotMultipleItemKey": null,
        "lotMultipleItemName": null,
        "lotMultipleQty": null,
        "vendorKey": null,
        "vendorName": null,
        "onHandMin": "",
        "onHandThirdPartyMin": ""
    }

    this.attach(`Payload: ${JSON.stringify(this.payLoad, undefined, 4)}`)
});

Then('{} sends a POST method to create demand', async function (actor: string) {
    const createDemandResponse = await demandRequest.createDemand(this.request, link, this.payLoad, this.headers);
    this.response = createDemandResponse
    const responseBodyText = await createDemandResponse.text();
    if (createDemandResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBodyOfADemandObject = JSON.parse(responseBodyText)
        logger.log('info', `Response POST ${link}` + JSON.stringify(this.responseBodyOfADemandObject, undefined, 4));
        this.attach(`Response POST ${link}` + JSON.stringify(this.responseBodyOfADemandObject, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response POST ${link}} has status code ${createDemandResponse.status()} ${createDemandResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response POST ${link} has status code ${createDemandResponse.status()} ${createDemandResponse.statusText()} and response body ${actualResponseText}`);
    }
})

Then('{} checks values in response of create demand are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfADemandObject.companyType);
    expect(this.responseBodyOfADemandObject.companyKey).not.toBeNull();

    if (this.payLoad.orderKey) {
        expect(this.responseBodyOfADemandObject.orderKey, `In response body, orderKey should be matched with the data request: ${this.payLoad.orderKey}`).toBe(this.orderKey);
    }
    if (this.payLoad.rowKey) {
        expect(this.responseBodyOfADemandObject.rowKey, `In response body, rowKey should be matched with the data request: ${this.payLoad.rowKey}`).toBe(this.rowKey);
    }
    if (this.payLoad.itemKey) {
        expect(this.responseBodyOfADemandObject.itemKey, `In response body, itemKey should be matched with the data request: ${this.payLoad.itemKey}`).toBe(this.itemKey);
    }
    if (this.payLoad.itemName) {
        expect(this.responseBodyOfADemandObject.itemName, `In response body, itemName should be matched with the data request: ${this.payLoad.itemName}`).toBe(this.itemName);
    }
    if (this.payLoad.dueDate) {
        expect(this.responseBodyOfADemandObject.dueDate, `In response body, dueDate should be matched with the data request: ${this.payLoad.dueDate}`).toBe(this.expectedDueDate);
    }
    if (this.payLoad.orderQty) {
        expect(this.responseBodyOfADemandObject.orderQty, `In response body, orderQty should be matched with the data request: ${this.payLoad.orderQty}`).toBe(this.orderQty);
    }
    if (this.payLoad.openQty) {
        expect(this.responseBodyOfADemandObject.openQty, `In response body, openQty should be matched with the data request: ${this.payLoad.openQty}`).toBe(this.openQty);
    }
    if (this.payLoad.refNum) {
        expect(this.responseBodyOfADemandObject.refNum, `In response body, refNum should be matched with the data request: ${this.payLoad.refNum}`).toBe(`${this.refNum}`);
    }
})

