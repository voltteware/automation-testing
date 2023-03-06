import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as supplyRequest from '../../../../src/api/request/supply.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";
import { payLoadSupply } from '../../../../src/utils/supplyPayLoad';

let link: any;
let randomSupplier: any;
let randomItem: any;
let payload: payLoadSupply = {}

Then(`{} sets GET api endpoint to get supply keys`, async function (actor: string) {
    link = Links.API_SUPPLY;
});

Then(`{} sets GET api endpoint to get supply keys with limit row: {} and sort field: {} with direction: {}`, async function (actor, limitRow, sortField, direction: string) {
    link = encodeURI(`${Links.API_SUPPLY}?offset=0&limit=${limitRow}&sort=[{"field":"${sortField}","direction":"${direction}"}]&where={"logic":"and","filters":[]}`);
});

Then(`{} sends a GET request to get list supplies`, async function (actor: string) {
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
})

Then('{} checks {} supply exist in the system, if it does not exist will create new supply', async function (actor, supplyNameKeyword: string) {
    var numberofSupplys;
    randomItem = this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
    randomSupplier = this.getSupplierResponseBody[Math.floor(Math.random() * this.getSupplierResponseBody.length)]

    if (supplyNameKeyword != 'any') {
        numberofSupplys = await this.getSupplyResponseBody.filter((su: any) => su.name.includes(supplyNameKeyword)).length;
    }
    else {
        numberofSupplys = await this.getSupplyResponseBody.length;
    }
    
    if (numberofSupplys < 1) {
        payload.supplyUuid = faker.datatype.uuid();
        payload.refNum = `${faker.random.numeric(4)} AUTO`;
        payload.vendorName = randomSupplier.name;        
        payload.vendorKey = randomSupplier.key;       
        payload.docDate = faker.date.recent();        
        payload.dueDate = faker.date.future();       
        payload.itemName = randomItem.name;       
        payload.itemKey = randomItem.key;          
        payload.orderQty = Number(faker.random.numeric(2));        
        payload.openQty = Number(faker.random.numeric(2));        
        payload.orderKey = faker.datatype.uuid();      
        payload.rowKey = faker.datatype.uuid();

        const createResponse = await supplyRequest.createSupply(this.request, Links.API_CREATE_SUPPLY, payload, payload.vendorKey, payload.rowKey, this.headers);
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
})

Then('{} picks random supply in above response', async function (actor: string) {
    this.responseBodyOfASupplyObject = await this.getSupplyResponseBody[Math.floor(Math.random() * this.getSupplyResponseBody.length)];
    logger.log('info', `Random supply: ${JSON.stringify(this.responseBodyOfASupplyObject, undefined, 4)}`);
    this.attach(`Random supply: ${JSON.stringify(this.responseBodyOfASupplyObject, undefined, 4)}`);
})

Then('Check items in the response should be sort by field refNum with direction {}', async function (direction: string) {
    if (direction == 'asc') {
        const expectedList = this.responseBody;
        const sortedByAsc = _.orderBy(this.responseBody, [(o) => { return o.refNum || '' }], ['asc']);
        expect(expectedList, `Check items in the response should be sort by field refNum with direction ${direction}`).toStrictEqual(sortedByAsc);
    }
    else if (direction == 'desc') {
        const expectedList = this.responseBody;
        const sortedByDesc = _.orderBy(this.responseBody, [(o) => { return o.refNum || '' }], ['desc']);
        expect(expectedList, `Check items in the response should be sort by field refNum with direction ${direction}`).toStrictEqual(sortedByDesc);
    }
});

Then('{} checks values in response of random supply are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfASupplyObject.companyType);
    expect(this.responseBodyOfASupplyObject.companyKey).not.toBeNull();
    expect(this.responseBodyOfASupplyObject.companyName).not.toBeNull();
})