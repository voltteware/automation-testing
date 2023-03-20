import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as supplyRequest from '../../../../src/api/request/supply.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";
import { payLoadSupply } from '../../../../src/utils/supplyPayLoad';

let link: any;
let linkLimitRow: any;
let linkSorted: any;
let randomItem: any;
let payload: payLoadSupply = {}

Then(`{} sets GET api endpoint to get supply keys`, async function (actor: string) {
    link = Links.API_SUPPLY;
});

Then(`{} sets GET api endpoint to get supply keys with limit row: {} and sort field: {} with direction: {}`, async function (actor, limitRow, sortField, direction: string) {
    linkSorted = encodeURI(`${Links.API_SUPPLY}?offset=0&limit=${limitRow}&sort=[{"field":"${sortField}","direction":"${direction}"}]&where={"logic":"and","filters":[]}`);
});

Then(`{} sets GET api endpoint to get supplies with limit row: {}`, async function (actor, limitRow: string) {
    linkLimitRow = `${Links.API_SUPPLY}?offset=0&limit=${limitRow}`;
});

Then(`{} sends a GET request to get list supplies`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getSupplyResponse = this.response = await supplyRequest.getSupply(this.request, linkLimitRow, options);
    const responseBodyText = await this.getSupplyResponse.text();
    if (this.getSupplyResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getSupplyResponseBody = JSON.parse(await this.getSupplyResponse.text());
        // logger.log('info', `Response GET ${linkLimitRow}` + JSON.stringify(this.getSupplyResponseBody, undefined, 4));
        this.attach(`Response GET ${linkLimitRow}` + JSON.stringify(this.getSupplyResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkLimitRow} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${linkLimitRow} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
});

Then(`{} sends a GET request to get sorted supplies`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getSupplyResponse = this.response = await supplyRequest.getSupply(this.request, linkSorted, options);
    const responseBodyText = await this.getSupplyResponse.text();
    if (this.getSupplyResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getSupplyResponseBody = JSON.parse(await this.getSupplyResponse.text());
        // logger.log('info', `Response GET ${linkSorted}` + JSON.stringify(this.getSupplyResponseBody, undefined, 4));
        this.attach(`Response GET ${linkSorted}` + JSON.stringify(this.getSupplyResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkSorted} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${linkSorted} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
});

Then(`{} sends a GET request to get all supplies`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getSupplyResponse = this.response = await supplyRequest.getSupply(this.request, link, options);
    const responseBodyText = await this.getSupplyResponse.text();
    if (this.getSupplyResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getSupplyResponseBody = JSON.parse(await this.getSupplyResponse.text());
        // logger.log('info', `Response GET ${link}` + JSON.stringify(this.getSupplyResponseBody, undefined, 4));
        this.attach(`Response GET ${link}` + JSON.stringify(this.getSupplyResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
});

Then('{} checks {} supply exist in the system, if it does not exist will create new supply', async function (actor, supplyRefnumKeyword: string) {
    var numberofSupplys;
    if (supplyRefnumKeyword != 'any') {
        numberofSupplys = await this.getSupplyResponseBody.filter((su: any) => su.refNum.includes(supplyRefnumKeyword)).length;
    }
    else {
        numberofSupplys = await this.getSupplyResponseBody.length;
    }
    
    if (numberofSupplys < 1) {
        randomItem = this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
        // Can create supply with items unassigned supplier
        // randomSupplier = this.getSupplierResponseBody[Math.floor(Math.random() * this.getSupplierResponseBody.length)]

        payload.supplyUuid = faker.datatype.uuid();
        payload.refNum = `${faker.random.numeric(4)} Auto`;
        // payload.vendorName = randomSupplier.name;        
        // payload.vendorKey = randomSupplier.key;       
        payload.docDate = faker.date.recent();        
        payload.dueDate = faker.date.future();       
        payload.itemName = randomItem.name;       
        payload.itemKey = randomItem.key;          
        payload.orderQty = Number(faker.random.numeric(2));        
        payload.openQty = Number(faker.random.numeric(2));        
        payload.orderKey = faker.datatype.uuid();      
        payload.rowKey = faker.datatype.uuid();

        const createResponse = await supplyRequest.createSupply(this.request, Links.API_CREATE_SUPPLY, payload, payload.orderKey, payload.rowKey, this.headers);
        const responseBodyText = await createResponse.text();
        if (createResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
            await this.getSupplyResponseBody.push(JSON.parse(responseBodyText));
            logger.log('info', `Response POST ${Links.API_SUPPLY}` + JSON.stringify(responseBodyText, undefined, 4));
            this.attach(`Response POST ${Links.API_SUPPLY}` + JSON.stringify(responseBodyText, undefined, 4))
        }
        else {
            const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
            logger.log('info', `Response POST ${Links.API_SUPPLY} has status code ${createResponse.status()} ${createResponse.statusText()} and response body ${responseBodyText}`);
            this.attach(`Response POST ${Links.API_SUPPLY} has status code ${createResponse.status()} ${createResponse.statusText()} and response body ${actualResponseText}`)
        }
    }
});

Then('{} picks random supply in above response', async function (actor: string) {
    this.responseBodyOfASupplyObject = await this.getSupplyResponseBody[Math.floor(Math.random() * this.getSupplyResponseBody.length)];
    logger.log('info', `Random supply: ${JSON.stringify(this.responseBodyOfASupplyObject, undefined, 4)}`);
    this.attach(`Random supply: ${JSON.stringify(this.responseBodyOfASupplyObject, undefined, 4)}`);
});

Then('{} filters {} supplies which has the refNum includes {}', async function (actor, maximumSupplies, supplyRefnumKeyword: string) {
    if (supplyRefnumKeyword.includes('any character')) {
        this.selectedSupplies = await this.getSupplyResponseBody;
    }
    else {
        this.selectedSupplies = await this.getSupplyResponseBody.filter((su: any) => su.refNum.includes(supplyRefnumKeyword));
    }

    const supplies = await this.selectedSupplies;
    if (maximumSupplies != 'all') {
        this.selectedSupplies = supplies.slice(0, Number(maximumSupplies))
    }

    logger.log('info', `Selected ${this.selectedSupplies.length} supplies which has the name includes ${supplyRefnumKeyword}` + JSON.stringify(await this.selectedSupplies, undefined, 4));
    this.attach(`Selected ${this.selectedSupplies.length} supplies which has the name includes ${supplyRefnumKeyword}` + JSON.stringify(await this.selectedSupplies, undefined, 4));
    expect(this.selectedSupplies.length, 'Expect that there is at least supply is selected').toBeGreaterThan(0);
});

Then(`{} sends a GET request to get total of supplies`, async function (actor: string) {
    const link = encodeURI(`${Links.API_SUPPLY}/count?where={"logic":"and","filters":[]}`);
    const options = {
        headers: this.headers
    }
    this.getTotalSupplyResponse = this.response = await supplyRequest.getSupply(this.request, link, options);
    this.totalSupply = await this.getTotalSupplyResponse.text();
    logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${this.totalSupply}`);
    this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${this.totalSupply}`)
});

Then('{} sends a DELETE method to delete supply', async function (actor: string) {
    const ids = this.selectedSupplies.map((su: any) => `${su.docType}/${su.orderKey}/${su.rowKey}`);
    var payLoadDelete = {
        ids
    }
    logger.log('info', `Payload` + JSON.stringify(payLoadDelete, undefined, 4));
    this.attach(`Payload` + JSON.stringify(payLoadDelete, undefined, 4))

    this.response = await supplyRequest.deleteSupply(this.request, Links.API_SUPPLY, payLoadDelete, this.headers);
    logger.log('info', `Response DELETE ${Links.API_SUPPLY} has status code ${this.response.status()} ${this.response.statusText()} and response body ${await this.response.text()}`);
    this.attach(`Response DELETE ${Links.API_SUPPLY} has status code ${this.response.status()} ${this.response.statusText()} and response body ${await this.response.text()}`)
});

Then('{} checks the total supplies is correct', async function (actor: string) {
    const link = encodeURI(`${Links.API_SUPPLY}/count?where={"logic":"and","filters":[]}`);
    const options = {
        headers: this.headers
    }
    const response = await supplyRequest.getSupply(this.request, link, options);
    const currentTotalSupplies = Number(await response.text());
    const beforeTotalSupplies = Number(this.totalSupply);
    logger.log('info', `Current total supplies: ${currentTotalSupplies}`);
    this.attach(`Current total supplies: ${currentTotalSupplies}`);
    expect(currentTotalSupplies).not.toBeNaN();
    expect(beforeTotalSupplies).not.toBeNaN();
    expect(currentTotalSupplies).toEqual(beforeTotalSupplies - this.selectedSupplies.length);
});

Then('{} checks values in response of random supply are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfASupplyObject.companyType);
    expect(this.responseBodyOfASupplyObject.companyKey).not.toBeNull();
    expect(this.responseBodyOfASupplyObject.companyName).not.toBeNull();
});