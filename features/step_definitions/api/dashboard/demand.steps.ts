import { Then, When, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as demandRequest from '../../../../src/api/request/demand.service';
import * as itemRequest from '../../../../src/api/request/item.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { add, format } from 'date-fns'
import { faker } from '@faker-js/faker';
import _ from "lodash";

let link: any;
let randomItem: any;
let linkLimitRow: any;
let linkSorted: any;
let linkFiltered: any;

Then(`{} sets GET api endpoint to get demand keys`, async function (actor: string) {
    link = Links.API_DEMAND;
});

Then(`{} sets GET api endpoint to get demands with limit row: {}`, async function (actor, limitRow: string) {
    linkLimitRow = `${Links.API_DEMAND}?offset=0&limit=${limitRow}`;
});

Then(`{} sets GET api endpoint to get demands with itemName and dateStart`, async function (actor: string, dataTable: DataTable) {
    var dateStart: number = dataTable.hashes()[0].dateStart;
    var itemName: string = dataTable.hashes()[0].itemName;

    // Format date
    // var dateFormat = format(currentDate, 'yyyy-MM-dd');
    // Add or subtract date 
    // var lastMonthDateFormat = format(add(dateFormat, {months: 1}), 'yyyy-MM-dd');
    
    const dateStartFormat = format(new Date(dateStart), 'yyyy-MM-dd');
    const dateEndFormat = format(add(new Date(dateStartFormat), {days: 30}), 'yyyy-MM-dd');
    logger.log('info', `dateStartFormat:: ` + dateStartFormat);
    this.attach(`dateStartFormat:: ` + dateStartFormat);
    logger.log('info', `dateEndFormat:: ` + dateEndFormat);
    this.attach(`dateEndFormat:: ` + dateEndFormat);

    //Get demand in duration from ... to ...
    linkFiltered = `${Links.API_DEMAND}?offset=0&limit=100&where={"filters":[{"filters":[{"field":"itemName","operator":"contains","value":"${itemName}"}],"logic":"and"},{"filters":[{"field":"dueDate","operator":"lt","value":"${dateEndFormat}"},{"field":"dueDate","operator":"gt","value":"${dateStartFormat}"}],"logic":"and"}],"logic":"and"}`
});

Then(`{} sends a GET request to get list demands`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getDemandResponse = this.response = await demandRequest.getDemand(this.request, linkLimitRow, options);
    const responseBodyText = await this.getDemandResponse.text();
    if (this.getDemandResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getDemandResponseBody = JSON.parse(await this.getDemandResponse.text());
        this.attach(`Response GET ${linkLimitRow} has status code ${this.getDemandResponse.status()} ${this.response.statusText()} and response body ${JSON.stringify(this.getDemandResponseBody)}`)
    }
    else {
        //if response include <!doctype html> => 'html', else => response
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkLimitRow} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${linkLimitRow} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
});

Then('{} picks random demand in above response', async function (actor: string) {
    this.responseBodyOfADemandObject = await this.getDemandResponseBody[Math.floor(Math.random() * this.getDemandResponseBody.length)];
    logger.log('info', `Random demand: ${JSON.stringify(this.responseBodyOfADemandObject, undefined, 4)}`);
    this.attach(`Random demand: ${JSON.stringify(this.responseBodyOfADemandObject, undefined, 4)}`);

    // Get data of demand to compare data in report
    this.orderKeyOfGrid = this.responseBodyOfADemandObject.orderKey;
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
            asin: "",
            docType: "manual",
            dueDate: faker.date.future(),
            fnsku: "",
            imageUrl: "",
            itemKey: randomItem.key,
            itemName: randomItem.name,
            lotMultipleItemKey: null,
            lotMultipleItemName: null,
            lotMultipleQty: null,
            onHandMin: "",
            onHandThirdPartyMin: "",
            openQty: Math.floor(Math.random() * 101),
            orderKey: faker.datatype.uuid(),
            orderQty: Math.floor(Math.random() * 101),
            refNum: "",
            rowKey: faker.datatype.uuid(),
            vendorKey: null,
            vendorName: null,
        }
        const createResponse = await demandRequest.createDemand(this.request, `${Links.API_DEMAND}/manual/${payload.orderKey}/${payload.rowKey}`, payload, this.headers);
        const responseBodyText = await createResponse.text();
        if (createResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
            await this.getDemandResponseBody.push(JSON.parse(responseBodyText));
            logger.log('info', `Response POST ${Links.API_DEMAND}/manual/${payload.orderKey}/${payload.rowKey}` + JSON.stringify(responseBodyText, undefined, 4));
            this.attach(`Response POST ${Links.API_DEMAND}/manual/${payload.orderKey}/${payload.rowKey}` + JSON.stringify(responseBodyText, undefined, 4))
        }
        else {
            const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
            logger.log('info', `Response POST ${Links.API_DEMAND}/manual/${payload.orderKey}/${payload.rowKey}} has status code ${createResponse.status()} ${createResponse.statusText()} and response body ${responseBodyText}`);
            this.attach(`Response POST ${Links.API_DEMAND}/manual/${payload.orderKey}/${payload.rowKey} has status code ${createResponse.status()} ${createResponse.statusText()} and response body ${actualResponseText}`);
        }
    }
});

Then(`{} sets GET api endpoint to get demand with limit row: {} and sort field: {} with direction: {}`, async function (actor, limitRow, sortField, direction: string) {
    linkSorted = encodeURI(`${Links.API_DEMAND}?offset=0&limit=${limitRow}&sort=[{"field":"${sortField}","direction":"${direction}"}]&where={"logic":"and","filters":[]}`);
});

Then(`{} sends a GET request to get all demands`, async function (actor: string) {
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

Then(`{} sends a GET request to get sorted demands`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getDemandResponse = this.response = await demandRequest.getDemand(this.request, linkSorted, options);
    const responseBodyText = await this.getDemandResponse.text();
    if (this.getDemandResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getDemandResponseBody = JSON.parse(await this.getDemandResponse.text());
    }
    else {
        //if response include <!doctype html> => 'html', else => response
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkSorted} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${linkSorted} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
});

Then('User picks a random demand in above list demands', async function () {
    this.responseBodyOfADemandObject = await this.getDemandResponseBody[Math.floor(Math.random() * this.getDemandResponseBody.length)];
    logger.log('info', `Random Demand: ${JSON.stringify(this.responseBodyOfADemandObject, undefined, 4)}`);
    this.attach(`Random Demand: ${JSON.stringify(this.responseBodyOfADemandObject, undefined, 4)}`);
    this.itemName = this.responseBodyOfADemandObject.itemName;
});

When('User saves the demand key and order key', function () {
    this.demandKey = this.responseBodyOfADemandObject.rowKey
    logger.log('info', `Demand key to edit: ${this.demandKey}`);
    this.attach(`Demand key to edit: ${this.demandKey}`)

    this.orderKey = this.responseBodyOfADemandObject.orderKey
    logger.log('info', `Order key to edit: ${this.orderKey}`);
    this.attach(`Order key to edit: ${this.orderKey}`)
});

When('User sets PUT api endpoint to edit {} of the above demand for company type {} with new value: {}', async function (editColumn: string, companyType: string, value: string) {
    // Prepare endpoint for request to edit demand
    link = `${Links.API_DEMAND}/manual/${this.orderKey}/${this.demandKey}`;

    switch (editColumn) {
        case 'itemName':
            if (value == 'random') {
                const excludedItemName = this.responseBodyOfADemandObject.itemName

                // Filter out the excluded item have excludedItemName from the list items
                const filteredArray = this.getItemsResponseBody.filter((item: any) => item.name !== excludedItemName);
                const randomItem = filteredArray[Math.floor(Math.random() * filteredArray.length)];

                this.itemKey = randomItem.key
                this.itemName = randomItem.name
            }

            logger.log('info', `New ${editColumn}: ${this.lotMultipleItemName}`);
            this.attach(`New ${editColumn}: ${this.lotMultipleItemName}`);
            break;
        case 'dateOfSale':
            if (value == 'random') {
                const currentDate = new Date();
                const minDate = new Date();
                minDate.setFullYear(currentDate.getFullYear() - 1);
                const randomTime = Math.floor(Math.random() * (currentDate.getTime() - minDate.getTime()));
                const randomDate = new Date(minDate.getTime() + randomTime);

                // Outputs a date string in the format "mm/dd/yyyy"
                // The expected due date have format "mm/dd/yyyy" because after edit the responseBody return due date with format mm/dd/yyyy
                this.expectedDueDate = randomDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

                // And  the due date in request body have format yyyy-mm-dd
                const year = randomDate.getFullYear();
                const month = ('0' + (randomDate.getMonth() + 1)).slice(-2);
                const day = ('0' + randomDate.getDate()).slice(-2);
                this.dueDate = `${year}-${month}-${day}`;
            }

            logger.log('info', `New ${editColumn}: ${this.dueDate}`);
            this.attach(`New ${editColumn}: ${this.dueDate}`);
            break;
        case 'salesOrderQty':
            if (value == 'random') {
                this.orderQty = Math.floor(Math.random() * 101);
            }

            logger.log('info', `New ${editColumn}: ${this.orderQty}`);
            this.attach(`New ${editColumn}: ${this.orderQty}`);
            break;
        case 'openSalesOrderQty':
            if (value == 'random') {
                this.openQty = Math.floor(Math.random() * 101);
            }

            logger.log('info', `New ${editColumn}: ${this.openQty}`);
            this.attach(`New ${editColumn}: ${this.openQty}`);
            break;
        case 'referenceNumber':
            if (value == 'random') {
                this.refNum = Math.floor(Math.random() * 101);
            }

            logger.log('info', `New ${editColumn}: ${this.refNum}`);
            this.attach(`New ${editColumn}: ${this.refNum}`);
            break;
        default:
            break;
    }

    const currentDate = new Date();
    const updatedDate = currentDate.toISOString();

    // Prepare payload for request to edit demand
    this.payLoad = {
        "companyType": `${this.responseBodyOfADemandObject.companyType}`,
        "companyKey": `${this.responseBodyOfADemandObject.companyKey}`,
        "docType": `${this.responseBodyOfADemandObject.docType}`,
        "orderKey": `${this.responseBodyOfADemandObject.orderKey}`,
        "rowKey": `${this.responseBodyOfADemandObject.rowKey}`,
        "itemKey": this.itemKey === undefined ? this.responseBodyOfADemandObject.itemKey : `${this.itemKey}`,
        "itemName": this.itemName === undefined ? this.responseBodyOfADemandObject.itemName : `${this.itemName}`,
        "asin": `${this.responseBodyOfADemandObject.asin}`,
        "dueDate": this.dueDate === undefined ? this.responseBodyOfADemandObject.dueDate : `${this.dueDate}`,
        "orderQty": this.orderQty === undefined ? this.responseBodyOfADemandObject.orderQty : this.orderQty,
        "openQty": this.openQty === undefined ? this.responseBodyOfADemandObject.openQty : this.openQty,
        "refNum": this.refNum === undefined ? this.responseBodyOfADemandObject.refNum : this.refNum,
        "orderStatus": `${this.responseBodyOfADemandObject.orderStatus}`,
        "fnsku": `${this.responseBodyOfADemandObject.fnsku}`,
        "imageUrl": this.responseBodyOfADemandObject.imageUrl,
        "updated_at": `${updatedDate}`
    }

    logger.log('info', `Payload` + JSON.stringify(this.payLoad, undefined, 4));
    this.attach(`Payload` + JSON.stringify(this.payLoad, undefined, 4))
});

When('User sends a PUT request to edit the demand', async function () {
    // Send PUT request
    this.response = await demandRequest.editDemand(this.request, link, this.payLoad, this.headers)
    if (this.response.status() == 200) {
        this.editDemandResponseBody = JSON.parse(await this.response.text())
        logger.log('info', `Edit Demand Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()} and editDemandResponse body ${JSON.stringify(this.editDemandResponseBody, undefined, 4)}`)
        this.attach(`Edit Demand Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()} and editDemandResponse body ${JSON.stringify(this.editDemandResponseBody, undefined, 4)}`)
    } else {
        logger.log('info', `Edit Demand Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
        this.attach(`Edit Demand Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
    }
});

Then('The new {} of demand must be updated successfully', function (editColumn: string) {
    switch (editColumn) {
        case 'itemName':
            expect(this.itemName).toEqual(this.editDemandResponseBody.itemName)
            break;
        case 'dateOfSale':
            expect(this.expectedDueDate).toEqual(this.editDemandResponseBody.dueDate)
            break;
        case 'salesOrderQty':
            expect(this.orderQty).toEqual(this.editDemandResponseBody.orderQty)
            break;
        case 'openSalesOrderQty':
            expect(this.openQty).toEqual(this.editDemandResponseBody.openQty)
            break;
        case 'referenceNumber':
            expect(Number(this.refNum)).toEqual(Number(this.editDemandResponseBody.refNum))
            break;
        default:
            break;
    }
});

Then(`{} sends a GET request to get specific demand of item`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getDemandResponse = this.response = await demandRequest.getDemand(this.request, linkFiltered, options);
    const responseBodyText = await this.getDemandResponse.text();
    if (this.getDemandResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getDemandResponseBody = JSON.parse(await this.getDemandResponse.text());
        logger.log('info', `Response GET ${linkFiltered}: ` + JSON.stringify(this.getDemandResponseBody, undefined, 4));
        this.attach(`Response GET ${linkFiltered}: ` + JSON.stringify(this.getDemandResponseBody, undefined, 4));
        this.countItem = this.getDemandResponseBody.length
        logger.log('info', `this.getDemandResponseBody.length:: ` + this.getDemandResponseBody.length);
        this.attach(`this.getDemandResponseBody.length:: ` + this.getDemandResponseBody.length);
    }
    else {
        //if response include <!doctype html> => 'html', else => response
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkFiltered} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${linkFiltered} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
});

Then(`{} sends a GET request to get total of demands`, async function (actor: string) {
    const link = `${Links.API_DEMAND}/count?where=%7B%22logic%22:%22and%22,%22filters%22:%5B%5D%7D`
    const options = {
        headers: this.headers
    }
    this.getTotalDemandResponse = this.response = await demandRequest.getDemand(this.request, link, options);
    this.totalDemand = await this.getTotalDemandResponse.text();
    this.countItem = this.totalDemand;
    logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${this.totalDemand}`);
    this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${this.totalDemand}`)
})

Then('{} picks {} random demands in above list demands', async function (actor: string, quantity) {
    this.itemsPickedRandomArray =  itemRequest.getMultipleRandom(this.getDemandResponseBody, quantity);
    console.log("itemsPickedRandomArray: ", this.itemsPickedRandomArray);
    return this.itemsPickedRandomArray;
})

Then(`User sets POST api to get demand aggregation of item`, async function () {
    this.linkGetDemandAggregation = `${Links.API_DEMAND_AGGREGATION}`

    const currentDate: Date = new Date();
    const currentMonth: number = currentDate.getMonth() + 1;

    currentDate.setMonth(currentMonth - 1, 0) // Set the date to the last day of the previous month
    const lastDayOfPreviousMonth = currentDate.toISOString().substring(0,10)    
    currentDate.setFullYear(currentDate.getFullYear() - 4)  // Get the date that í 4 years before the start date
    const fourYearsAgo = currentDate.toISOString().substring(0,10)

    this.payloadGetDemandAggregation = {
        "key": `${this.itemKey}`,
        "operation": "range",
        "start": `${fourYearsAgo}T17:00:00.000Z`,
        "end": `${lastDayOfPreviousMonth}T16:59:59.000Z`
    }
})

Then(`User sends a POST request to get demand aggregation of item`, async function () {
    this.response = this.getDemandAggregationResponse = await demandRequest.getDemandAggregation(this.request, this.linkGetDemandAggregation, this.payloadGetDemandAggregation, this.headers);
    const responseBodyText = await this.getDemandAggregationResponse.text();
    if (this.getDemandAggregationResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getDemandAggregationResponseBody = JSON.parse(responseBodyText);        

        logger.log('info', `Response POST get demand aggregation ${this.linkGetDemandAggregation}` + JSON.stringify(this.responseBody, undefined, 4));
        this.attach(`Response POST get demand aggregation ${this.linkGetDemandAggregation}` + JSON.stringify(this.responseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response POST get demand aggregation ${this.linkGetDemandAggregation} has status code ${this.getDemandAggregationResponse.status()} ${this.getDemandAggregationResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response POST get demand aggregation ${this.linkGetDemandAggregation} has status code ${this.getDemandAggregationResponse.status()} ${this.getDemandAggregationResponse.statusText()} and response body ${actualResponseText}`)
    }
})

Then(`{} finds the list demand contain value: {}`, async function (actor, valueContain: string) {
    let link = `${Links.API_DEMAND}?offset=0&limit=100&where={"filters":[{"filters":[{"field":"itemName","operator":"contains","value":"${valueContain}"}],"logic":"and"}],"logic":"and"}`;
    const options = {
        headers: this.headers
    }
    this.getDemandResponse = this.response = await demandRequest.getDemand(this.request, link, options);
    const responseBodyText = await this.getDemandResponse.text();
    if (this.getDemandResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getDemandResponseBody = JSON.parse(await this.getDemandResponse.text());
        logger.log('info', `Response GET ${link}` + JSON.stringify(this.getDemandResponseBody, undefined, 4));
        this.attach(`Response GET ${link}` + JSON.stringify(this.getDemandResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
});