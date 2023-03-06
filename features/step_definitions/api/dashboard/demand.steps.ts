import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as demandRequest from '../../../../src/api/request/demand.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";

let link: any;
let randomItem: any;

Then(`{} sets GET api endpoint to get demand key`, async function (actor: string) {
    link = Links.API_DEMAND;
});

Then(`{} sends a GET request to get demand information of {} by company key and company type`, async function (actor, email: string) {
    const options = {
        headers: this.headers
    }
    this.getDemandResponse = this.response = await demandRequest.getDemand(this.request, link, options);
    const responseBodyText = await this.getDemandResponse.text();
    if (this.getDemandResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getDemandResponseBody = JSON.parse(await this.getDemandResponse.text());
    }
    else {
        //if response include <!doctype html> => 'html', else => response
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
});

Then('{} picks random demand in above response', async function (actor: string) {
    this.responseBodyOfADemandObject = await this.getDemandResponseBody[Math.floor(Math.random() * this.getDemandResponseBody.length)];
    logger.log('info', `Random demand: ${JSON.stringify(this.responseBodyOfADemandObject, undefined, 4)}`);
    this.attach(`Random demand: ${JSON.stringify(this.responseBodyOfADemandObject, undefined, 4)}`);
});

Then('{} checks values in response of random demand are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfADemandObject.companyType);
    expect(this.responseBodyOfADemandObject.companyKey).not.toBeNull();
    expect(this.responseBodyOfADemandObject.companyName).not.toBeNull();
});

Then('{} checks {} demand exist in the system, if it does not exist will create new demand', async function (actor, demandQtyKeyword: string) {
    var numberofDemand;
    randomItem = this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];

    if (demandQtyKeyword != 'any') {
        numberofDemand = await this.getDemandResponseBody.filter((qty: any) => qty.orderQty.includes(demandQtyKeyword)).length;
    }
    else {
        numberofDemand = await this.getDemandResponseBody.length;
    }
    if (numberofDemand < 1) {
        const payload = {
            docType: "manual",
            dueDate: faker.date.future(),
            itemKey: randomItem.key,
            itemName: randomItem.itemName,
            openQty: Math.floor(Math.random() * 101),
            orderQty: Math.floor(Math.random() * 101),
            orderKey: faker.datatype.uuid(),
            rowKey: faker.datatype.uuid(),
        }
        const createResponse = await demandRequest
        .createDemand(this.request, `${Links.API_DEMAND}/manual/${payload.orderKey}/${payload.rowKey}`, payload, this.headers);
        const responseBodyText = await createResponse.text();
        if (createResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
            await this.getDemandResponseBody.push(JSON.parse(responseBodyText));
            logger.log('info', `Response POST ${Links.API_DEMAND}/manual/${payload.orderKey}/${payload.rowKey}` + JSON.stringify(responseBodyText, undefined, 4));
            this.attach(`Response POST ${Links.API_DEMAND}/${payload.orderKey}/${payload.rowKey}` + JSON.stringify(responseBodyText, undefined, 4))
        }
        else {
            const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
            logger.log('info', `Response POST ${Links.API_DEMAND}/manual/${payload.orderKey}/${payload.rowKey}} has status code ${createResponse.status()} ${createResponse.statusText()} and response body ${responseBodyText}`);
            this.attach(`Response POST ${Links.API_DEMAND}/manual/${payload.orderKey}/${payload.rowKey} has status code ${createResponse.status()} ${createResponse.statusText()} and response body ${actualResponseText}`)
        }
    }
});

Then(`{} sets GET api endpoint to get demand keys with limit row: {} and sort field: {} with direction: {}`, async function (actor, limitRow, sortField, direction: string) {
    link = encodeURI(`${Links.API_DEMAND}?offset=0&limit=${limitRow}&sort=[{"field":"${sortField}","direction":"${direction}"}]&where={"logic":"and","filters":[]}`);
});

Then('Check demand in the response should be sort by field qty with direction {}', async function (direction: string) {
    if (direction == 'asc') {
        const expectedList = this.responseBody;
        const sortedByAsc = _.orderBy(this.responseBody, [(o) => { return o.qty || '' }], ['asc']);
        expect(expectedList, `Check demand in the response should be sort by field qty with direction ${direction}`).toStrictEqual(sortedByAsc);
    }
    else if (direction == 'desc') {
        const expectedList = this.responseBody;
        const sortedByDesc = _.orderBy(this.responseBody, [(o) => { return o.qty || '' }], ['desc']);
        expect(expectedList, `Check demand in the response should be sort by field qty with direction ${direction}`).toStrictEqual(sortedByDesc);
    }
});