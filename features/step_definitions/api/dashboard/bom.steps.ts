import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as bomRequest from '../../../../src/api/request/bom.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";

let link: any;
let linkLimit: any;
let randomChildItem: any;
let randomParentItem: any;
let payLoadDelete: any;
let linkSorted: any;

Then(`{} sets GET api endpoint to get bom keys`, async function (actor: string) {
    link = Links.API_BOM;
});

Then(`{} sets GET api endpoint to get boms with limit row: {}`, async function (actor, limitRow: string) {
    linkLimit = encodeURI(`${Links.API_BOM}?offset=0&limit=${limitRow}&where={"filters":[],"logic":"and"}`);
});

Then(`{} sends a GET request to get list limited boms`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getBomResponse = this.response = await bomRequest.getBom(this.request, linkLimit, options);
    const responseBodyText = await this.getBomResponse.text();
    if (this.getBomResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getBomResponseBody = JSON.parse(await this.getBomResponse.text());

        logger.log('info', `Get Boms Response  ${link} has status code ${this.response.status()} ${this.response.statusText()} and get list bom body ${JSON.stringify(this.getBomResponseBody, undefined, 4)}`)
        this.attach(`Get Boms Response  ${link} has status code ${this.response.status()} ${this.response.statusText()} and get list bom body ${JSON.stringify(this.getBomResponseBody, undefined, 4)}`)
    }
    else {
        //if response include <!doctype html> => 'html', else => response
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkLimit} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${linkLimit} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
});

Then(`{} sends a GET request to get all boms`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getBomResponse = this.response = await bomRequest.getBom(this.request, link, options);
    const responseBodyText = await this.getBomResponse.text();
    if (this.getBomResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getBomResponseBody = JSON.parse(await this.getBomResponse.text());
        logger.log('info', `Get Boms Response  ${link} has status code ${this.response.status()} ${this.response.statusText()} and get list bom body ${JSON.stringify(this.getBomResponseBody, undefined, 4)}`)
        this.attach(`Get Boms Response  ${link} has status code ${this.response.status()} ${this.response.statusText()} and get list bom body ${JSON.stringify(this.getBomResponseBody, undefined, 4)}`)
    }
    else {
        //if response include <!doctype html> => 'html', else => response
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
});

Then('{} checks {} bom exist in the system, if it does not exist will create new bom', async function (actor, bomParentNameKeyword: string) {
    var numberofBom;
    randomChildItem = this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
    randomParentItem = this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
    // check parent can't be child
    for (var i = 0; i < this.getBomResponseBody.length; i++) {
        if (randomParentItem.key == this.getBomResponseBody[i].childKey) {
            randomParentItem = this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
        }
    }
    // check child can't be parent
    for (var i = 0; i < this.getBomResponseBody.length; i++) {
        if (randomChildItem.key == this.getBomResponseBody[i].parentKey) {
            randomChildItem = this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
        }
    }
    // compare parent item and child item
    if (randomParentItem.key == randomChildItem.key) {
        randomParentItem = this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
    }
    if (bomParentNameKeyword != 'any') {
        numberofBom = await this.getBomResponseBody.filter((bo: any) => bo.parentName.includes(bomParentNameKeyword)).length;
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
            parentKey: randomParentItem.key,
            parentName: randomParentItem.name,
            qty: Math.floor(Math.random() * 101),
        }
        const createResponse = await bomRequest
            .createBom(this.request, link, payload, payload.parentKey, payload.childKey, this.headers);
        const responseBodyText = await createResponse.text();
        if (createResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
            await this.getBomResponseBody.push(JSON.parse(responseBodyText));
            logger.log('info', `Response POST ${link}/${randomParentItem.key}/${randomChildItem.key}` + JSON.stringify(responseBodyText, undefined, 4));
            this.attach(`Response POST ${link}/${randomParentItem.key}/${randomChildItem.key}` + JSON.stringify(responseBodyText, undefined, 4))
        }
        else {
            const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
            logger.log('info', `Response POST ${link}/${randomParentItem.key}/${randomChildItem.key} has status code ${createResponse.status()} ${createResponse.statusText()} and response body ${responseBodyText}`);
            this.attach(`Response POST ${link}/${randomParentItem.key}/${randomChildItem.key} has status code ${createResponse.status()} ${createResponse.statusText()} and response body ${actualResponseText}`)
        }
    }
});

Then('{} picks random bom in above response', async function (actor: string) {
    this.responseBodyOfABomObject = await this.getBomResponseBody[Math.floor(Math.random() * this.getBomResponseBody.length)];
    logger.log('info', `Random bom: ${JSON.stringify(this.responseBodyOfABomObject, undefined, 4)}`);
    this.attach(`Random bom: ${JSON.stringify(this.responseBodyOfABomObject, undefined, 4)}`);
});

Then('{} filters {} boms which has the parentName includes {}', async function (actor, maximumBoms, bomParentNameKeyword: string) {
    if (bomParentNameKeyword.includes('any character')) {
        this.selectedBoms = await this.getBomResponseBody;
    }
    else {
        this.selectedBoms = await this.getBomResponseBody.filter((bo: any) => bo.parentName.includes(bomParentNameKeyword));
    }

    const boms = await this.selectedBoms;
    if (maximumBoms != 'all') {
        this.selectedBoms = boms.slice(0, Number(maximumBoms))
    }

    logger.log('info', `Selected ${this.selectedBoms.length} boms which has the name includes ${bomParentNameKeyword}` + JSON.stringify(await this.selectedBoms, undefined, 4));
    this.attach(`Selected ${this.selectedBoms.length} boms which has the name includes ${bomParentNameKeyword}` + JSON.stringify(await this.selectedBoms, undefined, 4));
    expect(this.selectedBoms.length, 'Expect that there is at least bom is selected').toBeGreaterThan(0);
})

Then(`{} sends a GET request to get total of boms`, async function (actor: string) {
    const link = encodeURI(`${Links.API_BOM}/count?where={"logic":"and","filters":[]}`);
    const options = {
        headers: this.headers
    }
    this.getTotalBomResponse = this.response = await bomRequest.getBom(this.request, link, options);
    this.totalBom = await this.getTotalBomResponse.text();
    logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${this.totalBom}`);
    this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${this.totalBom}`)
})

Then('{} sends a DELETE method to delete bom {}', async function (actor, bomKey: string) {
    if (bomKey == 'child') {
        payLoadDelete = {
            ids: this.selectedBoms.map((bo: any) => `${bo.parentKey}/${bo.childKey}`),
        }
    } else {
        payLoadDelete = {
            ids: this.selectedBoms.map((bo: any) => `${bo.parentKey}`),
        }
    }
    logger.log('info', `Payload` + JSON.stringify(payLoadDelete, undefined, 4));
    this.attach(`Payload` + JSON.stringify(payLoadDelete, undefined, 4))

    this.response = await bomRequest.deleteBom(this.request, Links.API_BOM, payLoadDelete, this.headers);
    logger.log('info', `Response DELETE ${Links.API_BOM} has status code ${this.response.status()} ${this.response.statusText()} and response body ${await this.response.text()}`);
    this.attach(`Response DELETE ${Links.API_BOM} has status code ${this.response.status()} ${this.response.statusText()} and response body ${await this.response.text()}`)
})

Then('{} checks values in response of random bom are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfABomObject.companyType);
    expect(this.responseBodyOfABomObject.companyKey).not.toBeNull();
    expect(this.responseBodyOfABomObject.companyName).not.toBeNull();
});

Then('{} checks the total boms is correct', async function (actor: string) {
    const link = encodeURI(`${Links.API_BOM}/count?where={"logic":"and","filters":[]}`);
    const options = {
        headers: this.headers
    }
    const response = await bomRequest.getBom(this.request, link, options);
    const currentTotalBoms = Number(await response.text());
    const beforeTotalBoms = Number(this.totalBom);
    logger.log('info', `Current total boms: ${currentTotalBoms}`);
    this.attach(`Current total boms: ${currentTotalBoms}`);
    expect(currentTotalBoms).not.toBeNaN();
    expect(beforeTotalBoms).not.toBeNaN();
    expect(currentTotalBoms).toEqual(beforeTotalBoms - this.selectedBoms.length);
})

Then('{} check that the deleted BOM and its child are not included in the current BOM list', async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getBomResponse = await bomRequest.getBom(this.request, link, options);
    this.getBomResponseBody = JSON.parse(await this.getBomResponse.text());
    const foundBom = this.getBomResponseBody.some((element: { parentKey: any; }) => element.parentKey == payLoadDelete.ids);
    expect(foundBom, 'Bom should not be included in the list boms').toBeFalsy();
})

Then(`{} sets GET api endpoint to get bom keys with limit row: {} and sort field: {} with direction: {}`, async function (actor, limitRow, sortField, direction: string) {
    linkSorted = encodeURI(`${Links.API_BOM}?offset=0&limit=${limitRow}&sort=[{"field":"${sortField}","direction":"${direction}"}]&where={"logic":"and","filters":[]}`);
});

Then(`{} sends a GET request to get sorted boms`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getBomResponse = this.response = await bomRequest.getBom(this.request, linkSorted, options);
    const responseBodyText = await this.getBomResponse.text();
    if (this.getBomResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getBomResponseBody = JSON.parse(await this.getBomResponse.text());
    }
    else {
        //if response include <!doctype html> => 'html', else => response
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkSorted} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${linkSorted} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
});

Given('User picks a random bom in above list boms', async function () {
    this.responseBodyOfABomObject = await this.getBomResponseBody[Math.floor(Math.random() * this.getBomResponseBody.length)];
    logger.log('info', `Random Bom: ${JSON.stringify(this.responseBodyOfABomObject, undefined, 4)}`);
    this.attach(`Random Bom: ${JSON.stringify(this.responseBodyOfABomObject, undefined, 4)}`);
});

Given('User saves the parentKey key and childKey key', function () {
    this.parentKey = this.responseBodyOfABomObject.parentKey
    logger.log('info', `Parent key to edit: ${this.parentKey}`);
    this.attach(`Parent key to edit: ${this.parentKey}`)

    this.childKey = this.responseBodyOfABomObject.childKey
    logger.log('info', `Child key to edit: ${this.childKey}`);
    this.attach(`Child key to edit: ${this.childKey}`)
});

Given('User sets PUT api endpoint to edit {} of the above bom for company type {} with new value: {}', function (editColumn: string, companyType: string, value: string) {
    // Prepare endpoint for request to edit demand
    link = `${Links.API_BOM}/${this.parentKey}/${this.childKey}`;

    switch (editColumn) {
        case 'parentName':
            if (value == 'random') {
                const excludedItemKey = this.childKey
                const listParentKey = this.getBomResponseBody.map((bom: any) => bom.parentKey)
                console.log('beeeee'+listParentKey)

                // Filter out the excluded item have excludedItemKey and item that is a parent from the list items 
                const filteredArray = this.getItemsResponseBody.filter((item: any) => ((item.key !== excludedItemKey) && (!listParentKey.includes(item.key))));
                const randomItem = filteredArray[Math.floor(Math.random() * filteredArray.length)];

                this.parentName = randomItem.name
                this.parentKey = randomItem.key
            }

            logger.log('info', `New ${editColumn}: ${this.parentName}`);
            this.attach(`New ${editColumn}: ${this.parentName}`);
            break;
        case 'componentName':
            if (value == 'random') {
                const excludedItemKey = this.childKey
                const listParentKey = this.getBomResponseBody.map((bom: any) => bom.parentKey)

                // Filter out the excluded item have excludedItemKey and item that is a parent from the list items
                const filteredArray = this.getItemsResponseBody.filter((item: any) => ((item.key !== excludedItemKey) && (!listParentKey.includes(item.key))));
                const randomItem = filteredArray[Math.floor(Math.random() * filteredArray.length)];

                this.childName = randomItem.name
                this.childKey = randomItem.key
            }

            logger.log('info', `New ${editColumn}: ${this.childName}`);
            this.attach(`New ${editColumn}: ${this.childName}`);
            break;
        case 'kitQty':
            if (value == 'random') {
                this.kitQty = Math.floor(Math.random() * 101)
            }

            logger.log('info', `New ${editColumn}: ${this.kitQty}`);
            this.attach(`New ${editColumn}: ${this.kitQty}`);
            break;
        default:
            break;
    }

    this.payLoad = {
        "companyType": `${this.responseBodyOfABomObject.companyType}`,
        "companyKey": `${this.responseBodyOfABomObject.companyKey}`,
        "parentKey": `${this.parentKey === undefined ? this.responseBodyOfABomObject.parentKey : this.parentKey}`,
        "parentName": `${this.parentName === undefined ? this.responseBodyOfABomObject.parentName : this.parentName}`,
        "childKey": `${this.childKey === undefined ? this.responseBodyOfABomObject.childKey : this.childKey}`,
        "childName": `${this.childName === undefined ? this.responseBodyOfABomObject.childName : this.childName}`,
        "qty": this.kitQty === undefined ? this.responseBodyOfABomObject.qty : this.kitQty,
        "created_at": `${this.responseBodyOfABomObject.created_at}`,
        "updated_at": `${this.responseBodyOfABomObject.updated_at}`,
    }

    logger.log('info', `Payload` + JSON.stringify(this.payLoad, undefined, 4));
    this.attach(`Payload` + JSON.stringify(this.payLoad, undefined, 4))
});

When('User sends a PUT request to edit the bom', async function () {
    // Send PUT request
    this.response = await bomRequest.editBom(this.request, link, this.payLoad, this.headers)
    if (this.response.status() == 200) {
        this.editBomResponseBody = JSON.parse(await this.response.text())
        logger.log('info', `Edit Bom Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()} and editBomResponse body ${JSON.stringify(this.editBomResponseBody, undefined, 4)}`)
        this.attach(`Edit Bom Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()} and editBomResponse body ${JSON.stringify(this.editBomResponseBody, undefined, 4)}`)
    } else {
        logger.log('info', `Edit Bom Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
        this.attach(`Edit Bom Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
    }
});

Then('The new {} of bom must be updated successfully', function (editColumn: string) {
    switch (editColumn) {
        case 'parentName':
            expect(this.editBomResponseBody.parentName).toEqual(this.parentName)
            break;
        case 'componentName':
            expect(this.editBomResponseBody.childName).toEqual(this.childName)
            break;
        case 'kitQty':
            expect(this.editBomResponseBody.qty).toEqual(this.kitQty)
            break;
        default:
            break;
    }
});