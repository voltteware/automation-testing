import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as supplyRequest from '../../../../src/api/request/supply.service';
import * as itemRequest from '../../../../src/api/request/item.service';
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

Then(`{} sets GET api endpoint to get supplies by item name {}`, async function (actor, itemName: string) {
    if (itemName == 'itemAbove') {
        itemName = this.editItemResponseBody.name
    }
    linkLimitRow = encodeURI(`${Links.API_SUPPLY}?offset=0&limit=100&where={"filters":[{"filters":[{"field":"itemName","operator":"contains","value":"${itemName}"}],"logic":"and"}],"logic":"and"}`);
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

Then(`User saves the Open qty of supply`, async function () {
    expect(this.getSupplyResponseBody.length).toBeGreaterThan(0)
    this.expectedOpenTy = 0
    Array.from(this.getSupplyResponseBody).forEach((supply: any) => {
        this.expectedOpenTy += Number(supply.openQty)
    })

    logger.log('info', `The expected open qty: ${this.expectedOpenTy}`);
    this.attach(`The expected open qty: ${this.expectedOpenTy}`)
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
    var numberOfSupply;
    if (supplyRefnumKeyword != 'any') {
        numberOfSupply = await this.getSupplyResponseBody.filter((su: any) => su.refNum.includes(supplyRefnumKeyword)).length;
    }
    else {
        numberOfSupply = await this.getSupplyResponseBody.length;
    }

    if (numberOfSupply < 1) {        
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
    this.countItem = this.totalSupply;
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

Then('{} searches the deleted supplies by refNum and checks that there is no supply found', async function (actor: string) {
    const options = {
        headers: this.headers
    }

    for await (const supply of this.selectedSupplies) {
        const PONum = supply.refNum;
        const link = encodeURI(`${Links.API_SUPPLY}?offset=0&limit=50&where={"filters":[{"filters":[{"field":"refNum","operator":"contains","value":"${PONum}"}],"logic":"and"}],"logic":"and"}`);
        const searchSupplyResponse = await supplyRequest.getSupply(this.request, link, options);
        const responseBodyText = await searchSupplyResponse.text();
        var searchSupplyResponseBody = JSON.parse(responseBodyText);
        if (searchSupplyResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
            logger.log('info', `Response GET ${link}>>>>>>>` + JSON.stringify(responseBodyText, undefined, 4));
            this.attach(`Response GET ${link}>>>>>>>>` + JSON.stringify(responseBodyText, undefined, 4))
        }
        else {
            const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
            logger.log('info', `Response GET ${link} has status code ${searchSupplyResponse.status()} ${searchSupplyResponse.statusText()} and response body ${responseBodyText}`);
            this.attach(`Response GET ${link} has status code ${searchSupplyResponse.status()} ${searchSupplyResponse.statusText()} and response body ${actualResponseText}`)
        }

        expect(searchSupplyResponseBody.length, `Expect that there is no supply ${PONum} in the system`).toBe(0);
    }
})

Then('{} checks values in response of random supply are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfASupplyObject.companyType);
    expect(this.responseBodyOfASupplyObject.companyKey).not.toBeNull();
    expect(this.responseBodyOfASupplyObject.companyName).not.toBeNull();
});

When('User picks a random supply in above list supplies', async function () {
    this.responseBodyOfASupplyObject = await this.getSupplyResponseBody[Math.floor(Math.random() * this.getSupplyResponseBody.length)];
    logger.log('info', `Random Supply: ${JSON.stringify(this.responseBodyOfASupplyObject, undefined, 4)}`);
    this.attach(`Random Supply: ${JSON.stringify(this.responseBodyOfASupplyObject, undefined, 4)}`);

    this.docType = this.responseBodyOfASupplyObject.docType;
    this.itemName = this.responseBodyOfASupplyObject.itemName;
});

When('User saves the supply key and order key', function () {
    this.supplyKey = this.responseBodyOfASupplyObject.rowKey
    logger.log('info', `Supply key to edit: ${this.supplyKey}`);
    this.attach(`Supply key to edit: ${this.supplyKey}`)

    this.orderKey = this.responseBodyOfASupplyObject.orderKey
    logger.log('info', `Order key to edit: ${this.orderKey}`);
    this.attach(`Order key to edit: ${this.orderKey}`)
});

When('User sets PUT api endpoint to edit {} of the above supply for company type {} with new value: {}', function (editColumn: string, companyType: string, value: string) {
    // Prepare endpoint for request to edit demand
    link = `${Links.API_SUPPLY}/${this.docType}/${this.orderKey}/${this.supplyKey}`;

    switch (editColumn) {
        case 'poNum':
            if (value == 'random') {
                this.refNum = `${faker.random.numeric(4)} Auto`;
            }

            logger.log('info', `New ${editColumn}: ${this.refNum}`);
            this.attach(`New ${editColumn}: ${this.refNum}`);
            break;
        case 'suppliername':
            if (value == 'random') {
                const excludedSupplierKey = this.responseBodyOfASupplyObject.vendorKey

                // Filter out the excluded supplier have excludedSupplierKey from the list suppliers
                const filteredArray = this.getSupplierResponseBody.filter((supplier: any) => supplier.key !== excludedSupplierKey);
                const randomSupplier = filteredArray[Math.floor(Math.random() * filteredArray.length)];

                this.vendorKey = randomSupplier.key;
                this.vendorName = randomSupplier.name;
            }

            logger.log('info', `New ${editColumn}: ${this.vendorName}`);
            this.attach(`New ${editColumn}: ${this.vendorName}`);
            logger.log('info', `New ${editColumn}: ${this.vendorKey}`);
            this.attach(`New ${editColumn}: ${this.vendorKey}`);
            break;
        case 'receiveDate':
            // Receive date greater PO Date
            if (value == 'random') {
                const poDate = new Date(this.responseBodyOfASupplyObject.docDate);                
                const daysToAdd = Math.floor(Math.random() * 30) + 1;
                const receiveDate = new Date(poDate);
                receiveDate.setDate(poDate.getDate() + daysToAdd); 
                
                // Outputs a date string in the format "mm/dd/yyyy"
                // The expected due date have format "mm/dd/yyyy" because after edit the responseBody return due date with format mm/dd/yyyy
                this.expectedDueDate = receiveDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

                // And  the due date in request body have format yyyy-mm-dd
                const year = receiveDate.getFullYear();
                const month = ('0' + (receiveDate.getMonth() + 1)).slice(-2);
                const day = ('0' + receiveDate.getDate()).slice(-2);
                this.dueDate = `${year}-${month}-${day}`;
            }

            logger.log('info', `New ${editColumn}: ${this.dueDate}`);
            this.attach(`New ${editColumn}: ${this.dueDate}`);
            break;
        case 'poDate':
            if (value == 'random') {
                const poDate = new Date(this.responseBodyOfASupplyObject.dueDate);                
                const daysToSubtract = Math.floor(Math.random() * 30) + 1;
                const receiveDate = new Date(poDate);
                receiveDate.setDate(poDate.getDate() - daysToSubtract); 
                
                // And  the due date in request body have format yyyy-mm-dd
                const year = receiveDate.getFullYear();
                const month = ('0' + (receiveDate.getMonth() + 1)).slice(-2);
                const day = ('0' + receiveDate.getDate()).slice(-2);
                this.docDate = `${year}-${month}-${day}`;
                this.expectedDocDate = new Date(this.docDate).toISOString();
            }

            logger.log('info', `New ${editColumn}: ${this.docDate}`);
            this.attach(`New ${editColumn}: ${this.docDate}`);
            break;
        case 'orderQty':
            if (value == 'random') {
                this.orderQty = Math.floor(Math.random() * 101);
            }

            logger.log('info', `New ${editColumn}: ${this.orderQty}`);
            this.attach(`New ${editColumn}: ${this.orderQty}`);
            break;
        case 'openQty':
            if (value == 'random') {
                this.openQty = Math.floor(Math.random() * 101);
            }

            logger.log('info', `New ${editColumn}: ${this.openQty}`);
            this.attach(`New ${editColumn}: ${this.openQty}`);
            break;
        case 'asin':
            if (value == 'random') {
                this.asin = `${faker.random.alphaNumeric(10).toUpperCase()}`;
            }

            logger.log('info', `New ${editColumn}: ${this.asin}`);
            this.attach(`New ${editColumn}: ${this.asin}`);
            break;

        default:
            break;
    }

    this.payLoad = {
        "companyType": `${this.responseBodyOfASupplyObject.companyType}`,
        "companyKey": `${this.responseBodyOfASupplyObject.companyKey}`,
        "supplyUuid": `${this.responseBodyOfASupplyObject.supplyUuid}`,
        "docType": `${this.responseBodyOfASupplyObject.docType}`,
        "orderKey": `${this.responseBodyOfASupplyObject.orderKey}`,
        "rowKey": `${this.responseBodyOfASupplyObject.rowKey}`,
        "refNum": this.refNum === undefined ? this.responseBodyOfASupplyObject.refNum : `${this.refNum}`,
        "vendorKey": this.vendorKey === undefined ? this.responseBodyOfASupplyObject.vendorKey : `${this.vendorKey}`,
        "vendorName": this.vendorName === undefined ? this.responseBodyOfASupplyObject.vendorName : `${this.vendorName}`,
        "dueDate": this.dueDate === undefined ? this.responseBodyOfASupplyObject.dueDate : `${this.dueDate}`,
        "docDate": this.docDate === undefined ? this.responseBodyOfASupplyObject.docDate : `${this.docDate}`,
        "itemKey": `${this.responseBodyOfASupplyObject.itemKey}`,
        "itemName": `${this.responseBodyOfASupplyObject.itemName}`,
        "asin": this.asin === undefined ? this.responseBodyOfASupplyObject.asin : `${this.asin}`,
        "orderQty": this.orderQty === undefined ? this.responseBodyOfASupplyObject.orderQty : this.orderQty,
        "openQty": this.openQty === undefined ? this.responseBodyOfASupplyObject.openQty : this.openQty,
        "purchasingSummariesUuid": this.responseBodyOfASupplyObject.purchasingSummariesUuid,
        "documentUuid": this.responseBodyOfASupplyObject.documentUuid,
        "reconciledStatus": this.responseBodyOfASupplyObject.reconciledStatus,
        "fnsku": `${this.responseBodyOfASupplyObject.fnsku}`,
        "imageUrl": this.responseBodyOfASupplyObject.imageUrl,
    }
});

When('User sends a PUT request to edit the supply', async function () {
    // Send PUT request
    this.response = await supplyRequest.editSupply(this.request, link, this.payLoad, this.headers)
    if (this.response.status() == 200) {
        this.responseBodyOfASupplyObject = this.editSupplyResponseBody = JSON.parse(await this.response.text());
        logger.log('info', `Edit Supply Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()} and editSupplyResponse body ${JSON.stringify(this.editSupplyResponseBody, undefined, 4)}`)
        this.attach(`Edit Supply Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()} and editSupplyResponse body ${JSON.stringify(this.editSupplyResponseBody, undefined, 4)}`)
    } else {
        logger.log('info', `Edit Supply Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
        this.attach(`Edit Supply Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
    }
});

Then('The new {} of supply must be updated successfully', function (editColumn: string) {
    switch (editColumn) {
        case 'poNum':
            expect(this.refNum).toEqual(this.editSupplyResponseBody.refNum)
            break;
        case 'suppliername':
            expect(this.vendorName).toEqual(this.editSupplyResponseBody.vendorName)
            break;
        case 'receiveDate':
            expect(this.editSupplyResponseBody.dueDate).toEqual(this.expectedDueDate)
            break;
        case 'poDate':
            expect(this.editSupplyResponseBody.docDate).toEqual(this.expectedDocDate)
            break;
        case 'orderQty':
            expect(this.orderQty).toEqual(this.editSupplyResponseBody.orderQty)
            break;
        case 'openQty':
            expect(this.openQty).toEqual(this.editSupplyResponseBody.openQty)
            break;
        case 'asin':
            expect(this.asin).toEqual(this.editSupplyResponseBody.asin)
            break;
        default:
            break;
    }
});

Then('{} picks {} random supplies in above list supplies', async function (actor: string, quantity) {
    this.itemsPickedRandomArray =  itemRequest.getMultipleRandom(this.getSupplyResponseBody, quantity);
    console.log("itemsPickedRandomArray: ", this.itemsPickedRandomArray);
    return this.itemsPickedRandomArray;
})