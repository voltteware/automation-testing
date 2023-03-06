import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as bomRequest from '../../../../src/api/request/bom.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";

let link: any;
let randomChildItem: any;
let randomParentItem: any;

Then(`{} sets GET api endpoint to get bom keys`, async function (actor: string) {
    link = Links.API_BOM;
});

Then(`{} sends a GET request to get list boms`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getBomResponse = this.response = await bomRequest.getBom(this.request, link, options);
    const responseBodyText = await this.getBomResponse.text();
    if (this.getBomResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getBomResponseBody = JSON.parse(await this.getBomResponse.text());
    }
    else {
        //if response include <!doctype html> => 'html', else => response
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
});

Then('{} checks {} bom exist in the system, if it does not exist will create new bom', async function (actor, bomQtyKeyword: string) {
    var numberofBom;
    randomChildItem = this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
    randomParentItem = this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
    // compare parent item and child item
    if (randomParentItem.key == randomChildItem.key){
        randomParentItem = this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
    }       
    if (bomQtyKeyword != 'any') {
        numberofBom = await this.getBomResponseBody.filter((qty: any) => qty.qty.includes(bomQtyKeyword)).length;
    }
    else {
        numberofBom = await this.getBomResponseBody.length;
    }
    if (numberofBom < 1) {
        const payload = {
            childKey: randomChildItem.key,
            childName: randomChildItem.name,
            companyKey: this.getRealmResponseBody.companyKey,
            companyType: this.getRealmResponseBody.companyType,
            parentKey : randomParentItem.key,
            parentName: randomParentItem.name,
            qty: Math.floor(Math.random() * 101),
        }
        const createResponse = await bomRequest
        .createBom(this.request, `${Links.API_BOM}/${randomParentItem.key}/${randomChildItem.key}`, payload, this.headers);
        const responseBodyText = await createResponse.text();
        if (createResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
            await this.getBomResponseBody.push(JSON.parse(responseBodyText));
            logger.log('info', `Response PUT ${Links.API_BOM}/${randomParentItem.key}/${randomChildItem.key}` + JSON.stringify(responseBodyText, undefined, 4));
            this.attach(`Response PUT ${Links.API_BOM}/${randomParentItem.key}/${randomChildItem.key}` + JSON.stringify(responseBodyText, undefined, 4))
        }
        else {
            const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
            logger.log('info', `Response PUT  ${Links.API_BOM}/${randomParentItem.key}/${randomChildItem.key} has status code ${createResponse.status()} ${createResponse.statusText()} and response body ${responseBodyText}`);
            this.attach(`Response PUT  ${Links.API_BOM}/${randomParentItem.key}/${randomChildItem.key} has status code ${createResponse.status()} ${createResponse.statusText()} and response body ${actualResponseText}`)
        }
    }
});

Then('{} picks random bom in above response', async function (actor: string) {
    this.responseBodyOfABomObject = await this.getBomResponseBody[Math.floor(Math.random() * this.getBomResponseBody.length)];
    logger.log('info', `Random bom: ${JSON.stringify(this.responseBodyOfABomObject, undefined, 4)}`);
    this.attach(`Random bom: ${JSON.stringify(this.responseBodyOfABomObject, undefined, 4)}`);
});

Then('{} checks values in response of random bom are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfABomObject.companyType);
    expect(this.responseBodyOfABomObject.companyKey).not.toBeNull();
    expect(this.responseBodyOfABomObject.companyName).not.toBeNull();
});

Then('Check bom in the response should be sort by field qty with direction {}', async function (direction: string) {
    if (direction == 'asc') {
        const expectedList = this.responseBody;
        const sortedByAsc = _.orderBy(this.responseBody, [(o) => { return o.qty || '' }], ['asc']);
        expect(expectedList, `Check bom in the response should be sort by field qty with direction ${direction}`).toStrictEqual(sortedByAsc);
    }
    else if (direction == 'desc') {
        const expectedList = this.responseBody;
        const sortedByDesc = _.orderBy(this.responseBody, [(o) => { return o.qty || '' }], ['desc']);
        expect(expectedList, `Check bom in the response should be sort by field qty with direction ${direction}`).toStrictEqual(sortedByDesc);
    }
});

Then(`{} sets GET api endpoint to get bom keys with limit row: {} and sort field: {} with direction: {}`, async function (actor, limitRow, sortField, direction: string) {
    link = encodeURI(`${Links.API_BOM}?offset=0&limit=${limitRow}&sort=[{"field":"${sortField}","direction":"${direction}"}]&where={"logic":"and","filters":[]}`);
});