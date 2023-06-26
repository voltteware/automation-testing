import { Then, Given, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as supplierRequest from '../../../../src/api/request/vendor.service';
import * as itemRequest from '../../../../src/api/request/item.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";
import * as keyword from '../../../../src/utils/actionwords';
import { supplierAddressResponseSchema } from '../assertion/dashboard/supplierAssertionSchema';

let link: any;
let supplierKey: string;
let linkUpdateVendorSalesVelocitySettings: any;

Then(`{} sets GET api endpoint to get suppliers keys`, async function (actor: string) {
    link = Links.API_SUPPLIERS;
});

Then(`{} sets GET api endpoint to get suppliers keys with limit row: {} and sort field: {} with direction: {}`, async function (actor, limitRow, sortField, direction: string) {
    link = encodeURI(`${Links.API_SUPPLIERS}?offset=0&limit=${limitRow}&sort=[{"field":"${sortField}","direction":"${direction}"}]&where={"logic":"and","filters":[]}`);
});

Then(`{} sets GET api endpoint to get suppliers with limit row: {}`, async function (actor, limitRow: string) {
    link = encodeURI(`${Links.API_SUPPLIERS}?offset=0&limit=${limitRow}`);
});

Then(`{} sends a GET request to get list suppliers`, async function (actor) {
    const options = {
        headers: this.headers
    }
    this.getSupplierResponse = this.response = await supplierRequest.getSuppliers(this.request, link, options);
    const responseBodyText = await this.getSupplierResponse.text();
    if (this.getSupplierResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getSupplierResponseBody = JSON.parse(await this.getSupplierResponse.text());
        logger.log('info', `Response GET ${link}` + JSON.stringify(this.getSupplierResponseBody, undefined, 4));
        this.attach(`Response GET ${link}` + JSON.stringify(this.getSupplierResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
})

// Get list supplier with filter and sort
Then(`{} sends a GET request with filter {} column {} {} and sort {} {} to get list suppliers`, async function (actor, columnName: string, operator: string, value: string, columnNameSort: string, sort: string) {
    const options = {
        headers: this.headers
    }
    this.getSupplierResponse = this.response = await supplierRequest.getSuppliersWithFilterAndSort(this.request, link, columnName, operator, value, columnNameSort, sort, options);
    const responseBodyText = await this.getSupplierResponse.text();
    if (this.getSupplierResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getSupplierResponseBody = JSON.parse(await this.getSupplierResponse.text());
        this.pickFirstAndEndRow = this.getSupplierResponseBody;
        logger.log('info', `Response GET ${link}` + JSON.stringify(this.getSupplierResponseBody, undefined, 4));
        this.attach(`Response GET ${link}` + JSON.stringify(this.getSupplierResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
})

Then(`{} sends a GET request to get total of suppliers`, async function (actor: string) {
    const link = `${Links.API_SUPPLIERS}/count?where=%7B%22logic%22:%22and%22,%22filters%22:%5B%5D%7D`
    const options = {
        headers: this.headers
    }
    this.getTotalSupplierResponse = this.response = await supplierRequest.getSuppliers(this.request, link, options);
    this.totalSupplier = await this.getTotalSupplierResponse.text();
    this.countItem = this.totalSupplier;
    logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${this.totalSupplier}`);
    this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${this.totalSupplier}`)
})

// Count all supplier when filtering and sorting
Then(`{} sends a GET request with filter {} column {} {} and sort {} {} to get total of suppliers`, async function (actor: string, columnName: string, operator: string, value: string, columnNameSort: string, sort: string) {
    const link = `${Links.API_SUPPLIERS}/count?where=%7B%22logic%22:%22and%22,%22filters%22:%5B%7B%22filters%22:%5B%7B%22field%22:%22${columnName}%22,%22operator%22:%22${operator}%22,%22value%22:${value}%7D%5D,%22logic%22:%22and%22%7D%5D%7D`;
    const options = {
        headers: this.headers
    }
    this.getTotalSupplierWithFilterResponse = this.response = await supplierRequest.getSuppliers(this.request, link, options);
    this.totalSupplier = await this.getTotalSupplierWithFilterResponse.text();
    this.countItem = this.totalSupplier;
    logger.log('info', `Response GET with filter ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${this.totalSupplier}`);
    this.attach(`Response GET with filter ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${this.totalSupplier}`)
})

Then('{} picks random supplier in above response', async function (actor: string) {
    this.responseBodyOfASupplierObject = await this.getSupplierResponseBody[Math.floor(Math.random() * this.getSupplierResponseBody.length)];
    logger.log('info', `Random supplier: ${JSON.stringify(this.responseBodyOfASupplierObject, undefined, 4)}`);
    this.attach(`Random supplier: ${JSON.stringify(this.responseBodyOfASupplierObject, undefined, 4)}`);

    this.supplierName = this.responseBodyOfASupplierObject.name
    this.supplierKey = this.responseBodyOfASupplierObject.key
})

Then('{} picks {} random suppliers in above list suppliers', async function (actor: string, quantity) {
    this.itemsPickedRandomArray = itemRequest.getMultipleRandom(this.getSupplierResponseBody, quantity);
    console.log("itemsPickedRandomArray: ", this.itemsPickedRandomArray);
    return this.itemsPickedRandomArray;
})

Then('{} checks values in response of random supplier are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfASupplierObject.companyType);
    expect(this.responseBodyOfASupplierObject.companyKey).not.toBeNull();
    expect(this.responseBodyOfASupplierObject.companyName).not.toBeNull();
})

Then('{} checks {} supplier exist in the system, if it does not exist will create new supplier', async function (actor, supplierNameKeyword: string) {
    var numberofSuppliers;

    if (supplierNameKeyword != 'any') {
        numberofSuppliers = await this.getSupplierResponseBody.filter((su: any) => su.name.includes(supplierNameKeyword)).length;
    }
    else {
        numberofSuppliers = await this.getSupplierResponseBody.length;
    }

    if (numberofSuppliers < 1) {
        const payload = {
            name: `${faker.company.name()} Auto`
        }
        const createResponse = await supplierRequest.createSupplier(this.request, Links.API_SUPPLIERS, payload, this.headers);
        const responseBodyText = await createResponse.text();
        if (createResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
            this.selectedSuppliers = await this.getSupplierResponseBody.push(JSON.parse(responseBodyText));
            logger.log('info', `Response POST ${Links.API_SUPPLIERS}` + JSON.stringify(responseBodyText, undefined, 4));
            this.attach(`Response POST ${Links.API_SUPPLIERS}` + JSON.stringify(responseBodyText, undefined, 4))
        }
        else {
            const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
            logger.log('info', `Response POST ${Links.API_SUPPLIERS} has status code ${createResponse.status()} ${createResponse.statusText()} and response body ${responseBodyText}`);
            this.attach(`Response POST ${Links.API_SUPPLIERS} has status code ${createResponse.status()} ${createResponse.statusText()} and response body ${actualResponseText}`)
        }
    }
})

Then('{} filters {} suppliers which has the name includes {}', async function (actor, maximumSuppliers, supplierNameKeyword: string) {
    if (supplierNameKeyword.includes('any character')) {
        this.selectedSuppliers = await this.getSupplierResponseBody;
    }
    else {
        this.selectedSuppliers = await this.getSupplierResponseBody.filter((su: any) => su.name.includes(supplierNameKeyword));
    }

    const suppliers = await this.selectedSuppliers;
    if (maximumSuppliers != 'all') {
        this.selectedSuppliers = suppliers.slice(0, Number(maximumSuppliers))
    }

    logger.log('info', `Selected ${this.selectedSuppliers.length} suppliers which has the name includes ${supplierNameKeyword}` + JSON.stringify(await this.selectedSuppliers, undefined, 4));
    this.attach(`Selected ${this.selectedSuppliers.length} suppliers which has the name includes ${supplierNameKeyword}` + JSON.stringify(await this.selectedSuppliers, undefined, 4));
})

Then('{} checks there is at least 1 supplier found', async function (actor: string) {
    expect(this.selectedSuppliers.length, 'Expect that there is at least user is selected').toBeGreaterThan(0);
})

Then('{} search the deleted suppliers and checks that there is no supplier found', async function (actor: string) {
    const options = {
        headers: this.headers
    }

    for await (const supplier of this.selectedSuppliers) {
        const supplierName = supplier.name;
        const link = encodeURI(`${Links.API_SUPPLIERS}?offset=0&limit=50&where={"filters":[{"filters":[{"field":"name","operator":"contains","value":"${supplierName}"}],"logic":"and"}],"logic":"and"}`);
        const searchSupplierResponse = await supplierRequest.getSuppliers(this.request, link, options);
        const responseBodyText = await searchSupplierResponse.text();
        var searchSupplierResponseBody = JSON.parse(responseBodyText);
        if (searchSupplierResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
            logger.log('info', `Response GET ${link}>>>>>>>` + JSON.stringify(responseBodyText, undefined, 4));
            this.attach(`Response GET ${link}>>>>>>>>` + JSON.stringify(responseBodyText, undefined, 4))
        }
        else {
            const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
            logger.log('info', `Response GET ${link} has status code ${searchSupplierResponse.status()} ${searchSupplierResponse.statusText()} and response body ${responseBodyText}`);
            this.attach(`Response GET ${link} has status code ${searchSupplierResponse.status()} ${searchSupplierResponse.statusText()} and response body ${actualResponseText}`)
        }

        expect(searchSupplierResponseBody.length, `Expect that there is no supplier ${supplierName} in the system`).toBe(0);
    }
})

Then('{} filters one column and sorts one column', async function (actor: string, dataTable: DataTable) {
    var columnFilter: string = dataTable.hashes()[0].columnFilter;
    var valueColumnFilter: string = dataTable.hashes()[0].valueColumnFilter;
    var sortColumn: string = dataTable.hashes()[0].sortColumn;
    var directionSort: string = dataTable.hashes()[0].directionSort;
    const options = {
        headers: this.headers
    }
    const link = encodeURI(`${Links.API_SUPPLIERS}?offset=0&limit=100&sort=[{"field":"${sortColumn}","direction":"${directionSort}"}]&where={"filters":[{"filters":[{"field":"${columnFilter}","operator":"contains","value":"${valueColumnFilter}"}],"logic":"and"}],"logic":"and"}`);

    const searchSupplierResponse = await supplierRequest.getSuppliers(this.request, link, options);
    let responseBodyText = await searchSupplierResponse.text();
    this.responseBodyOfASupplierObject = this.getSupplierResponseBody = JSON.parse(responseBodyText);
    if (searchSupplierResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response GET ${link}>>>>>>>` + JSON.stringify(responseBodyText, undefined, 4));
        this.attach(`Response GET ${link}>>>>>>>>` + JSON.stringify(responseBodyText, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${link} has status code ${searchSupplierResponse.status()} ${searchSupplierResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${link} has status code ${searchSupplierResponse.status()} ${searchSupplierResponse.statusText()} and response body ${actualResponseText}`)
    }
})

Then('{} sends a DELETE method to delete supplier', async function (actor: string) {
    var supplierKeys = this.selectedSuppliers.map((su: any) => su.key);

    var payLoad = {
        ids: supplierKeys
    }

    logger.log('info', `Payload` + JSON.stringify(payLoad, undefined, 4));
    this.attach(`Payload` + JSON.stringify(payLoad, undefined, 4))

    this.response = await supplierRequest.deleteSupplier(this.request, Links.API_SUPPLIERS, payLoad, this.headers);
    logger.log('info', `Response DELETE ${Links.API_SUPPLIERS} has status code ${this.response.status()} ${this.response.statusText()} and response body ${await this.response.text()}`);
    this.attach(`Response DELETE ${Links.API_SUPPLIERS} has status code ${this.response.status()} ${this.response.statusText()} and response body ${await this.response.text()}`)
})

Then('{} checks the total suppliers is correct', async function (actor: string) {
    const link = `${Links.API_SUPPLIERS}/count?where=%7B%22logic%22:%22and%22,%22filters%22:%5B%5D%7D`;
    const options = {
        headers: this.headers
    }
    const response = await supplierRequest.getSuppliers(this.request, link, options);
    const currentTotalSuppliers = Number(await response.text());
    const beforeTotalSuppliers = Number(this.totalSupplier);
    logger.log('info', `Current total suppliers: ${currentTotalSuppliers}`);
    this.attach(`Current total suppliers: ${currentTotalSuppliers}`);
    expect(currentTotalSuppliers).not.toBeNaN();
    expect(beforeTotalSuppliers).not.toBeNaN();
    expect(currentTotalSuppliers).toEqual(beforeTotalSuppliers - this.selectedSuppliers.length);
})

Then(`{} saves the supplier key`, async function (actor: string) {
    supplierKey = this.responseBodyOfASupplierObject.key
    logger.log('info', `Supplier key to edit: ${supplierKey}`);
    this.supplierKey = supplierKey
});

Given('User sets PUT api endpoint to edit {} of the above supplier for company type {} with new value: {}', async function (editColumn: string, companyType: string, value: string) {
    // Prepare endpoint for request to edit supplier
    link = `${Links.API_SUPPLIERS}/${supplierKey}`

    switch (editColumn) {
        case 'supplierName':
            if (value == 'random') {
                this.newSupplierName = `${faker.company.name()} ${faker.random.numeric(3)} Auto`;
            } else if (value.includes('Exist Supplier Name')) {
                var randomSupplier = await this.getSupplierResponseBody.filter((su: any) => !(su.key.includes(supplierKey)))
                this.newSupplierName = randomSupplier[1].name
            }

            logger.log('info', `New ${editColumn}: ${this.newSupplierName}`);
            this.attach(`New ${editColumn}: ${this.newSupplierName}`);
            break;
        case 'leadTime':
            if (value == 'random') {
                this.leadTime = Number(faker.datatype.number({
                    'min': 1,
                    'max': 365
                }));
            }

            logger.log('info', `New ${editColumn}: ${this.leadTime}`);
            this.attach(`New ${editColumn}: ${this.leadTime}`);
            break;
        case 'serviceLevel':
            if (value == 'random') {
                this.serviceLevel = Number(faker.random.numeric(2));
            }

            logger.log('info', `New ${editColumn}: ${this.serviceLevel}`);
            this.attach(`New ${editColumn}: ${this.serviceLevel}`);
            break;
        case 'orderInterval':
            if (value == 'random') {
                this.orderInterval = Number(faker.random.numeric());
            }

            logger.log('info', `New ${editColumn}: ${this.orderInterval}`);
            this.attach(`New ${editColumn}: ${this.orderInterval}`);
            break;
        case 'description':
            if (value == 'random') {
                this.description = faker.lorem.words(3);
            }

            logger.log('info', `New ${editColumn}: ${this.description}`);
            this.attach(`New ${editColumn}: ${this.description}`);
            break;
        case 'targetOrderValue':
            if (value == 'random') {
                this.targetOrderValue = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.targetOrderValue}`);
            this.attach(`New ${editColumn}: ${this.targetOrderValue}`);
            break;
        case 'freeFreightMinimum':
            if (value == 'random') {
                this.freeFreightMinimum = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.freeFreightMinimum}`);
            this.attach(`New ${editColumn}: ${this.freeFreightMinimum}`);
            break;
        case 'fabReplenishmentModel':
            var restockModel = ['LOCAL', 'DIRECT_SHIP', 'GLOBAL'];
            const excludedRestockModelValue = this.responseBodyOfASupplierObject.restockModel;

            // Filter out the excluded RestockModel value from the restockModel array
            const filteredArray = restockModel.filter((value) => value !== excludedRestockModelValue);
            this.RestockModel = filteredArray[Math.floor(Math.random() * filteredArray.length)];

            logger.log('info', `New ${editColumn}: ${this.RestockModel}`);
            this.attach(`New ${editColumn}: ${this.RestockModel}`);
            break;
        case 'email':
            if (value == 'random') {
                const timeSendRequest = Date.now();
                this.email = `auto_newemail${timeSendRequest}@gmail.com`;
            }

            logger.log('info', `New ${editColumn}: ${this.email}`);
            this.attach(`New ${editColumn}: ${this.email}`);
            break;
        case 'moq':
            if (value == 'random') {
                this.moq = Number(faker.datatype.number({
                    'min': 1,
                    'max': 10
                }));
            }

            logger.log('info', `New ${editColumn}: ${this.moq}`);
            this.attach(`New ${editColumn}: ${this.moq}`);
            break;
        default:
            break;
    }

    // Prepare payload for request to edit supplier
    if (companyType === 'CSV') {
        this.payLoad = {
            companyType: `${this.responseBodyOfASupplierObject.companyType}`,
            companyKey: `${this.responseBodyOfASupplierObject.companyKey}`,
            key: `${this.responseBodyOfASupplierObject.key}`,
            name: this.newSupplierName === undefined ? this.responseBodyOfASupplierObject.name : `${this.newSupplierName}`,
            description: this.description === undefined ? this.responseBodyOfASupplierObject.description : `${this.description}`,
            isHidden: this.responseBodyOfASupplierObject.isHidden,
            shipVia: this.responseBodyOfASupplierObject.shipVia,
            email: this.email === undefined ? this.responseBodyOfASupplierObject.email : `${this.email}`,
            moq: this.moq === undefined ? this.responseBodyOfASupplierObject.moq : this.moq,
            leadTime: this.leadTime === undefined ? this.responseBodyOfASupplierObject.leadTime : this.leadTime,
            orderInterval: this.orderInterval === undefined ? this.responseBodyOfASupplierObject.orderInterval : this.orderInterval,
            serviceLevel: this.serviceLevel === undefined ? this.responseBodyOfASupplierObject.serviceLevel : this.serviceLevel,
            forecastTags: this.responseBodyOfASupplierObject.forecastTags,
            phone: this.responseBodyOfASupplierObject.phone,
            fax: this.responseBodyOfASupplierObject.fax,
            website: this.responseBodyOfASupplierObject.website,
            addressShippingUuid: this.responseBodyOfASupplierObject.addressShippingUuid,
            addressBillingUuid: this.responseBodyOfASupplierObject.addressBillingUuid,
            targetOrderValue: this.targetOrderValue === undefined ? this.responseBodyOfASupplierObject.targetOrderValue : this.targetOrderValue,
            freeFreightMinimum: this.freeFreightMinimum === undefined ? this.responseBodyOfASupplierObject.freeFreightMinimum : this.freeFreightMinimum,
            averageHistoryLength: this.responseBodyOfASupplierObject.averageHistoryLength,
            created_at: `${this.responseBodyOfASupplierObject.created_at}`,
            updated_at: `${this.responseBodyOfASupplierObject.updated_at}`
        }
    } else if (companyType === 'ASC') {
        this.payLoad = {
            companyType: `${this.responseBodyOfASupplierObject.companyType}`,
            companyKey: `${this.responseBodyOfASupplierObject.companyKey}`,
            key: `${this.responseBodyOfASupplierObject.key}`,
            name: this.newSupplierName === undefined ? this.responseBodyOfASupplierObject.name : `${this.newSupplierName}`,
            description: this.description === undefined ? this.responseBodyOfASupplierObject.description : `${this.description}`,
            isHidden: this.responseBodyOfASupplierObject.isHidden,
            shipVia: this.responseBodyOfASupplierObject.shipVia,
            email: this.email === undefined ? this.responseBodyOfASupplierObject.email : `${this.email}`,
            moq: this.moq === undefined ? this.responseBodyOfASupplierObject.moq : this.moq,
            leadTime: this.leadTime === undefined ? this.responseBodyOfASupplierObject.leadTime : this.leadTime,
            orderInterval: this.orderInterval === undefined ? this.responseBodyOfASupplierObject.orderInterval : this.orderInterval,
            serviceLevel: this.serviceLevel === undefined ? this.responseBodyOfASupplierObject.serviceLevel : this.serviceLevel,
            forecastTags: this.responseBodyOfASupplierObject.forecastTags,
            phone: this.responseBodyOfASupplierObject.phone,
            fax: this.responseBodyOfASupplierObject.fax,
            website: this.responseBodyOfASupplierObject.website,
            addressShippingUuid: this.responseBodyOfASupplierObject.addressShippingUuid,
            addressBillingUuid: this.responseBodyOfASupplierObject.addressBillingUuid,
            targetOrderValue: this.targetOrderValue === undefined ? this.responseBodyOfASupplierObject.targetOrderValue : this.targetOrderValue,
            freeFreightMinimum: this.freeFreightMinimum === undefined ? this.responseBodyOfASupplierObject.freeFreightMinimum : this.freeFreightMinimum,
            restockModel: this.RestockModel === undefined ? this.responseBodyOfASupplierObject.restockModel : this.RestockModel,
            averageHistoryLength: this.responseBodyOfASupplierObject.averageHistoryLength,
            created_at: `${this.responseBodyOfASupplierObject.created_at}`,
            updated_at: `${this.responseBodyOfASupplierObject.updated_at}`,
            links: this.responseBodyOfASupplierObject.links === undefined ? "" : undefined
        }
    } else if (companyType === 'QBFS' || companyType === 'QBO') {
        this.payLoad = {
            companyType: `${this.responseBodyOfASupplierObject.companyType}`,
            companyKey: `${this.responseBodyOfASupplierObject.companyKey}`,
            key: `${this.responseBodyOfASupplierObject.key}`,
            name: this.newSupplierName === undefined ? this.responseBodyOfASupplierObject.name : this.newSupplierName,
            description: this.description === undefined ? this.responseBodyOfASupplierObject.description : `${this.description}`,
            isHidden: this.responseBodyOfASupplierObject.isHidden,
            shipVia: this.responseBodyOfASupplierObject.shipVia,
            email: this.email === undefined ? this.responseBodyOfASupplierObject.email : `${this.email}`,
            moq: this.moq === undefined ? this.responseBodyOfASupplierObject.moq : this.moq,
            leadTime: this.leadTime === undefined ? this.responseBodyOfASupplierObject.leadTime : this.leadTime,
            orderInterval: this.orderInterval === undefined ? this.responseBodyOfASupplierObject.orderInterval : this.orderInterval,
            serviceLevel: this.serviceLevel === undefined ? this.responseBodyOfASupplierObject.serviceLevel : this.serviceLevel,
            forecastTags: this.responseBodyOfASupplierObject.forecastTags,
            phone: this.responseBodyOfASupplierObject.phone,
            fax: this.responseBodyOfASupplierObject.fax,
            website: this.responseBodyOfASupplierObject.website,
            addressShippingUuid: this.responseBodyOfASupplierObject.addressShippingUuid,
            addressBillingUuid: this.responseBodyOfASupplierObject.addressBillingUuid,
            targetOrderValue: this.targetOrderValue === undefined ? this.responseBodyOfASupplierObject.targetOrderValue : this.targetOrderValue,
            freeFreightMinimum: this.freeFreightMinimum === undefined ? this.responseBodyOfASupplierObject.freeFreightMinimum : this.freeFreightMinimum,
            restockModel: this.RestockModel === undefined ? this.responseBodyOfASupplierObject.restockModel : this.RestockModel,
            averageHistoryLength: this.responseBodyOfASupplierObject.averageHistoryLength,
            created_at: `${this.responseBodyOfASupplierObject.created_at}`,
            updated_at: `${this.responseBodyOfASupplierObject.updated_at}`,
        }
    }

    logger.log('info', `Payload` + JSON.stringify(this.payLoad, undefined, 4));
    this.attach(`Payload` + JSON.stringify(this.payLoad, undefined, 4))
});

Given('User sends a PUT request to edit the supplier', async function () {
    // Send PUT request
    this.response = await supplierRequest.editSupplier(this.request, link, this.payLoad, this.headers)
    if (this.response.status() == 200) {
        this.responseBodyOfASupplierObject = this.editSupplierResponseBody = JSON.parse(await this.response.text());
        logger.log('info', `Edit Supplier Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()} and editSupplierResponse body ${JSON.stringify(this.editSupplierResponseBody, undefined, 4)}`)
        this.attach(`Edit Supplier Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()} and editSupplierResponse body ${JSON.stringify(this.editSupplierResponseBody, undefined, 4)}`)
    } else {
        logger.log('info', `Edit Supplier Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
        this.attach(`Edit Supplier Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
    }
});

Then(`The new {} of supplier must be updated successfully`, async function (editColumn: string) {
    switch (editColumn) {
        case 'supplierName':
            expect(this.newSupplierName).toEqual(this.editSupplierResponseBody.name)
            break;
        case 'leadTime':
            expect(this.leadTime).toEqual(this.editSupplierResponseBody.leadTime)
            break;
        case 'serviceLevel':
            expect(this.serviceLevel).toEqual(this.editSupplierResponseBody.serviceLevel)
            break;
        case 'orderInterval':
            expect(this.orderInterval).toEqual(this.editSupplierResponseBody.orderInterval)
            break;
        case 'description':
            expect(this.description).toEqual(this.editSupplierResponseBody.description)
            break;
        case 'targetOrderValue':
            expect(this.targetOrderValue).toEqual(this.editSupplierResponseBody.targetOrderValue)
            break;
        case 'freeFreightMinimum':
            expect(this.freeFreightMinimum).toEqual(this.editSupplierResponseBody.freeFreightMinimum)
            break;
        case 'fabReplenishmentModel':
            expect(this.RestockModel).toEqual(this.editSupplierResponseBody.restockModel)
            break;
        case 'email':
            expect(this.email).toEqual(this.editSupplierResponseBody.email)
            break;
        case 'moq':
            expect(this.moq).toEqual(this.editSupplierResponseBody.moq)
            break;
        default:
            break;
    }
});

Given('User sets PUT api endpoint to update sale velocity settings with type {} of supplier', function (velocityType: string) {
    linkUpdateVendorSalesVelocitySettings = `${Links.API_VENDOR_SALES_VELOCITY}/${this.supplierKey}`
});

Given('User sends PUT request to update sale velocity settings with type {} of above supplier with the total percentage is {}%', async function (velocityType: string, percentage: string) {
    switch (velocityType) {
        case '"Average"':
            const isNumber = !isNaN(parseFloat(percentage)) && isFinite(+percentage);

            this.randomWeightNumbers = []

            if (isNumber) {
                // The function returns the array of 8 numbers that add up to the desired sum (here is percentage of purchasing daily sales)
                this.randomWeightNumbers = keyword.generateRandomNumbers(Number(percentage), 8);

                this.payLoad = {
                    "companyKey": `${this.companyKey}`,
                    "companyType": `${this.companyType}`,
                    "salesVelocityType": "average",
                    "vendorKey": `${this.supplierKey}`,
                    "salesVelocitySettingData": {
                        "percent2Day": this.randomWeightNumbers[0],
                        "percent7Day": this.randomWeightNumbers[1],
                        "percent14Day": this.randomWeightNumbers[2],
                        "percent30Day": this.randomWeightNumbers[3],
                        "percent60Day": this.randomWeightNumbers[4],
                        "percent90Day": this.randomWeightNumbers[5],
                        "percent180Day": this.randomWeightNumbers[6],
                        "percentForecasted": this.randomWeightNumbers[7]
                    },
                    "salesVelocitySettingsType": "purchasing"
                }
            }
            break;
        case '"Automatically Adjusted Weightings"':
            this.payLoad = {
                "companyKey": `${this.companyKey}`,
                "companyType": `${this.companyType}`,
                "salesVelocityType": "auto",
                "vendorKey": `${this.supplierKey}`,
                "salesVelocitySettingsType": "purchasing"
            }
            break;
        default:
            break;
    }

    logger.log('info', `Payload` + JSON.stringify(this.payLoad, undefined, 4));
    this.attach(`Payload` + JSON.stringify(this.payLoad, undefined, 4))

    this.response = await supplierRequest.updateVendorSalesVelocitySettings(this.request, linkUpdateVendorSalesVelocitySettings, this.payLoad, this.headers)
    if (this.response.status() == 200) {
        this.UpdateVendorSalesVelocitySettingsResponseBody = JSON.parse(await this.response.text())
        logger.log('info', `Edit supplier sales velocity ${linkUpdateVendorSalesVelocitySettings} has status code ${this.response.status()} ${this.response.statusText()} and Edit supplier sales velocity response body ${JSON.stringify(this.UpdateVendorSalesVelocitySettingsResponseBody, undefined, 4)}`)
        this.attach(`Edit supplier sales velocity ${linkUpdateVendorSalesVelocitySettings} has status code ${this.response.status()} ${this.response.statusText()} and Edit supplier sales velocity response body ${JSON.stringify(this.UpdateVendorSalesVelocitySettingsResponseBody, undefined, 4)}`)
    } else {
        logger.log('info', `Edit supplier sales velocity ${linkUpdateVendorSalesVelocitySettings} has status code ${this.response.status()} ${this.response.statusText()}`)
        this.attach(`Edit supplier sales velocity ${linkUpdateVendorSalesVelocitySettings} has status code ${this.response.status()} ${this.response.statusText()}`)
    }
});

Then('{} sets GET api endpoint to get supplier address', async function (actor: string) {
    link = `${Links.API_SUPPLIER}`;
});

Then(`{} sends a GET request to get supplier address`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getSupplierAddressResponse = this.response = await supplierRequest.getSuppliers(this.request, link, options);
    const responseBodyText = await this.getSupplierAddressResponse.text();
    if (this.getSupplierAddressResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getSupplierAddressResponseBody = JSON.parse(await this.getSupplierAddressResponse.text());
        logger.log('info', `Response GET ${link}: ` + JSON.stringify(this.getSupplierAddressResponseBody, undefined, 4));
        this.attach(`Response GET ${link}: ` + JSON.stringify(this.getSupplierAddressResponseBody, undefined, 4));
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.getSupplierAddressResponse.status()} ${this.getSupplierAddressResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.getSupplierAddressResponse.status()} ${this.getSupplierAddressResponse.statusText()} and response body ${actualResponseText}`);
    }
});


Then('{} picks random supplier address in above response', async function (actor: string) {
    this.responseBodyOfASupplierAddressObject = await this.getSupplierAddressResponseBody[Math.floor(Math.random() * this.getSupplierAddressResponseBody.length)];
    logger.log('info', `Random supplier address: ${JSON.stringify(this.responseBodyOfASupplierAddressObject, undefined, 4)}`);
    this.attach(`Random supplier address: ${JSON.stringify(this.responseBodyOfASupplierAddressObject, undefined, 4)}`);

    this.addressLine1 = this.responseBodyOfASupplierAddressObject.addressLine1;
    this.addressLine2 = this.responseBodyOfASupplierAddressObject.addressLine2;
    this.city = this.responseBodyOfASupplierAddressObject.city;
    this.countryCode = this.responseBodyOfASupplierAddressObject.countryCode;
    this.addressKey = this.responseBodyOfASupplierAddressObject.key;
    this.phoneNumber = this.responseBodyOfASupplierAddressObject.phoneNumber;
    this.fullName = this.responseBodyOfASupplierAddressObject.fullName;
    this.postalCode = this.responseBodyOfASupplierAddressObject.postalCode;
    this.stateOrProvinceCode = this.responseBodyOfASupplierAddressObject.stateOrProvinceCode;
    this.vendorKey = this.responseBodyOfASupplierAddressObject.vendorKey;
    this.addressKey = this.responseBodyOfASupplierAddressObject.key;
});

Then('{} checks API contract of get supplier address api', async function (actor: string) {
    supplierAddressResponseSchema.parse(this.responseBodyOfASupplierAddressObject);
});

Given('{} sets request body of edit supplier api with payload', async function (actor: string, dataTable: DataTable) {
    // Prepare endpoint for request to edit supplier
    link = `${Links.API_SUPPLIERS}/${supplierKey}`
    var editColumn: string = dataTable.hashes()[0].editColumn;
    var companyType: string = dataTable.hashes()[0].companyType;
    var value: string = dataTable.hashes()[0].value;
    switch (editColumn) {
        case 'averageHistoryLength':
            if (value == 'random') {
                this.responseBodyOfASupplierObject.averageHistoryLength = this.averageHistoryLength = Number(faker.random.numeric());
            }

            logger.log('info', `New ${editColumn}: ${this.averageHistoryLength}`);
            this.attach(`New ${editColumn}: ${this.averageHistoryLength}`);
        case 'supplierName':
            if (value == 'random') {
                this.newSupplierName = `${faker.company.name()} ${faker.random.numeric(3)} Auto`;
            } else if (value.includes('Exist Supplier Name')) {
                var randomSupplier = await this.getSupplierResponseBody.filter((su: any) => !(su.key.includes(supplierKey)))
                this.newSupplierName = randomSupplier[1].name
            }

            logger.log('info', `New ${editColumn}: ${this.newSupplierName}`);
            this.attach(`New ${editColumn}: ${this.newSupplierName}`);
            break;
        case 'leadTime':
            if (value == 'random') {
                this.leadTime = Number(faker.datatype.number({
                    'min': 1,
                    'max': 365
                }));
            }

            logger.log('info', `New ${editColumn}: ${this.leadTime}`);
            this.attach(`New ${editColumn}: ${this.leadTime}`);
            break;
        case 'serviceLevel':
            if (value == 'random') {
                this.serviceLevel = Number(faker.random.numeric(2));
            }

            logger.log('info', `New ${editColumn}: ${this.serviceLevel}`);
            this.attach(`New ${editColumn}: ${this.serviceLevel}`);
            break;
        case 'orderInterval':
            if (value == 'random') {
                this.orderInterval = Number(faker.random.numeric());
            }

            logger.log('info', `New ${editColumn}: ${this.orderInterval}`);
            this.attach(`New ${editColumn}: ${this.orderInterval}`);
            break;
        case 'description':
            if (value == 'random') {
                this.description = faker.lorem.words(3);
            }

            logger.log('info', `New ${editColumn}: ${this.description}`);
            this.attach(`New ${editColumn}: ${this.description}`);
            break;
        case 'targetOrderValue':
            if (value == 'random') {
                this.targetOrderValue = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.targetOrderValue}`);
            this.attach(`New ${editColumn}: ${this.targetOrderValue}`);
            break;
        case 'freeFreightMinimum':
            if (value == 'random') {
                this.freeFreightMinimum = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.freeFreightMinimum}`);
            this.attach(`New ${editColumn}: ${this.freeFreightMinimum}`);
            break;
        case 'fabReplenishmentModel':
            var restockModel = ['LOCAL', 'DIRECT_SHIP', 'GLOBAL'];
            const excludedRestockModelValue = this.responseBodyOfASupplierObject.restockModel;

            // Filter out the excluded RestockModel value from the restockModel array
            const filteredArray = restockModel.filter((value) => value !== excludedRestockModelValue);
            this.RestockModel = filteredArray[Math.floor(Math.random() * filteredArray.length)];

            logger.log('info', `New ${editColumn}: ${this.RestockModel}`);
            this.attach(`New ${editColumn}: ${this.RestockModel}`);
            break;
        case 'email':
            if (value == 'random') {
                const timeSendRequest = Date.now();
                this.email = `auto_newemail${timeSendRequest}@gmail.com`;
            }

            logger.log('info', `New ${editColumn}: ${this.email}`);
            this.attach(`New ${editColumn}: ${this.email}`);
            break;
        case 'moq':
            if (value == 'random') {
                this.moq = Number(faker.datatype.number({
                    'min': 1,
                    'max': 10
                }));
            }

            logger.log('info', `New ${editColumn}: ${this.moq}`);
            this.attach(`New ${editColumn}: ${this.moq}`);
            break;
        default:
            break;
    }

    // Prepare payload for request to edit supplier
    if (companyType === 'CSV') {
        this.payLoad = {
            companyType: `${this.responseBodyOfASupplierObject.companyType}`,
            companyKey: `${this.responseBodyOfASupplierObject.companyKey}`,
            key: `${this.responseBodyOfASupplierObject.key}`,
            name: this.newSupplierName === undefined ? this.responseBodyOfASupplierObject.name : `${this.newSupplierName}`,
            description: this.description === undefined ? this.responseBodyOfASupplierObject.description : `${this.description}`,
            isHidden: this.responseBodyOfASupplierObject.isHidden,
            shipVia: this.responseBodyOfASupplierObject.shipVia,
            email: this.email === undefined ? this.responseBodyOfASupplierObject.email : `${this.email}`,
            moq: this.moq === undefined ? this.responseBodyOfASupplierObject.moq : this.moq,
            leadTime: this.leadTime === undefined ? this.responseBodyOfASupplierObject.leadTime : this.leadTime,
            orderInterval: this.orderInterval === undefined ? this.responseBodyOfASupplierObject.orderInterval : this.orderInterval,
            serviceLevel: this.serviceLevel === undefined ? this.responseBodyOfASupplierObject.serviceLevel : this.serviceLevel,
            forecastTags: this.responseBodyOfASupplierObject.forecastTags,
            phone: this.responseBodyOfASupplierObject.phone,
            fax: this.responseBodyOfASupplierObject.fax,
            website: this.responseBodyOfASupplierObject.website,
            addressShippingUuid: this.responseBodyOfASupplierObject.addressShippingUuid,
            addressBillingUuid: this.responseBodyOfASupplierObject.addressBillingUuid,
            targetOrderValue: this.targetOrderValue === undefined ? this.responseBodyOfASupplierObject.targetOrderValue : this.targetOrderValue,
            freeFreightMinimum: this.freeFreightMinimum === undefined ? this.responseBodyOfASupplierObject.freeFreightMinimum : this.freeFreightMinimum,
            averageHistoryLength: this.responseBodyOfASupplierObject.averageHistoryLength,
            created_at: `${this.responseBodyOfASupplierObject.created_at}`,
            updated_at: `${this.responseBodyOfASupplierObject.updated_at}`
        }
    } else if (companyType === 'ASC') {
        this.payLoad = {
            companyType: `${this.responseBodyOfASupplierObject.companyType}`,
            companyKey: `${this.responseBodyOfASupplierObject.companyKey}`,
            key: `${this.responseBodyOfASupplierObject.key}`,
            name: this.newSupplierName === undefined ? this.responseBodyOfASupplierObject.name : `${this.newSupplierName}`,
            description: this.description === undefined ? this.responseBodyOfASupplierObject.description : `${this.description}`,
            isHidden: this.responseBodyOfASupplierObject.isHidden,
            shipVia: this.responseBodyOfASupplierObject.shipVia,
            email: this.email === undefined ? this.responseBodyOfASupplierObject.email : `${this.email}`,
            moq: this.moq === undefined ? this.responseBodyOfASupplierObject.moq : this.moq,
            leadTime: this.leadTime === undefined ? this.responseBodyOfASupplierObject.leadTime : this.leadTime,
            orderInterval: this.orderInterval === undefined ? this.responseBodyOfASupplierObject.orderInterval : this.orderInterval,
            serviceLevel: this.serviceLevel === undefined ? this.responseBodyOfASupplierObject.serviceLevel : this.serviceLevel,
            forecastTags: this.responseBodyOfASupplierObject.forecastTags,
            phone: this.responseBodyOfASupplierObject.phone,
            fax: this.responseBodyOfASupplierObject.fax,
            website: this.responseBodyOfASupplierObject.website,
            addressShippingUuid: this.responseBodyOfASupplierObject.addressShippingUuid,
            addressBillingUuid: this.responseBodyOfASupplierObject.addressBillingUuid,
            targetOrderValue: this.targetOrderValue === undefined ? this.responseBodyOfASupplierObject.targetOrderValue : this.targetOrderValue,
            freeFreightMinimum: this.freeFreightMinimum === undefined ? this.responseBodyOfASupplierObject.freeFreightMinimum : this.freeFreightMinimum,
            restockModel: this.RestockModel === undefined ? this.responseBodyOfASupplierObject.restockModel : this.RestockModel,
            averageHistoryLength: this.responseBodyOfASupplierObject.averageHistoryLength,
            created_at: `${this.responseBodyOfASupplierObject.created_at}`,
            updated_at: `${this.responseBodyOfASupplierObject.updated_at}`,
            links: this.responseBodyOfASupplierObject.links === undefined ? "" : undefined
        }
    } else if (companyType === 'QBFS' || companyType === 'QBO') {
        this.payLoad = {
            companyType: `${this.responseBodyOfASupplierObject.companyType}`,
            companyKey: `${this.responseBodyOfASupplierObject.companyKey}`,
            key: `${this.responseBodyOfASupplierObject.key}`,
            name: this.newSupplierName === undefined ? this.responseBodyOfASupplierObject.name : this.newSupplierName,
            description: this.description === undefined ? this.responseBodyOfASupplierObject.description : `${this.description}`,
            isHidden: this.responseBodyOfASupplierObject.isHidden,
            shipVia: this.responseBodyOfASupplierObject.shipVia,
            email: this.email === undefined ? this.responseBodyOfASupplierObject.email : `${this.email}`,
            moq: this.moq === undefined ? this.responseBodyOfASupplierObject.moq : this.moq,
            leadTime: this.leadTime === undefined ? this.responseBodyOfASupplierObject.leadTime : this.leadTime,
            orderInterval: this.orderInterval === undefined ? this.responseBodyOfASupplierObject.orderInterval : this.orderInterval,
            serviceLevel: this.serviceLevel === undefined ? this.responseBodyOfASupplierObject.serviceLevel : this.serviceLevel,
            forecastTags: this.responseBodyOfASupplierObject.forecastTags,
            phone: this.responseBodyOfASupplierObject.phone,
            fax: this.responseBodyOfASupplierObject.fax,
            website: this.responseBodyOfASupplierObject.website,
            addressShippingUuid: this.responseBodyOfASupplierObject.addressShippingUuid,
            addressBillingUuid: this.responseBodyOfASupplierObject.addressBillingUuid,
            targetOrderValue: this.targetOrderValue === undefined ? this.responseBodyOfASupplierObject.targetOrderValue : this.targetOrderValue,
            freeFreightMinimum: this.freeFreightMinimum === undefined ? this.responseBodyOfASupplierObject.freeFreightMinimum : this.freeFreightMinimum,
            restockModel: this.RestockModel === undefined ? this.responseBodyOfASupplierObject.restockModel : this.RestockModel,
            averageHistoryLength: this.responseBodyOfASupplierObject.averageHistoryLength,
            created_at: `${this.responseBodyOfASupplierObject.created_at}`,
            updated_at: `${this.responseBodyOfASupplierObject.updated_at}`,
        }
    }

    logger.log('info', `Payload` + JSON.stringify(this.payLoad, undefined, 4));
    this.attach(`Payload` + JSON.stringify(this.payLoad, undefined, 4))
});

Then(`User sets POST api to add new address book with following information:`, async function (dataTable: DataTable) {
    this.linkApiAddNewAddressBook = Links.API_SUPPLIER
    const { country, supplierName, streetLine1, streetLine2, city, state, zipCode, phoneNumber } = dataTable.hashes()[0]
    if (country == 'random') {
        this.country = faker.address.countryCode();
    } else {
        this.country = country
    }

    if (supplierName == 'random') {
        this.supplierKey = this.responseBodyOfASupplierObject.key
        this.supplierName = this.responseBodyOfASupplierObject.name
    }

    if (streetLine1 == 'random') {
        this.streetLine1 = faker.address.streetAddress()
    } else {
        this.streetLine1 = streetLine1
    }

    if (streetLine2 == 'random') {
        this.streetLine2 = faker.address.secondaryAddress()
    } else {
        this.streetLine2 = streetLine2
    }

    if (city == 'random') {
        this.city = faker.address.cityName()
    } else {
        this.city = city
    }

    if (state == 'random') {
        this.state = faker.address.state()
    } else {
        this.state = state
    }

    if (zipCode == 'random') {
        this.zipCode = faker.address.zipCode()
    } else {
        this.zipCode = zipCode
    }

    if (phoneNumber == 'random') {
        this.phoneNumber = faker.phone.number('0#########')
    } else {
        this.phoneNumber = phoneNumber
    }

    this.payloadAddNewAddressBook = {
        "key": "",
        "vendorKey": `${this.supplierKey}`,
        "countryCode": `${this.country}`,
        "fullName": `${this.supplierName}`,
        "addressLine1": `${this.streetLine1}`,
        "addressLine2": `${this.streetLine2}`,
        "city": `${this.city}`,
        "stateOrProvinceCode": `${this.state}`,
        "postalCode": `${this.zipCode}`,
        "phoneNumber": `${this.phoneNumber}`
    }

    logger.log('info', `Payload add new address book` + JSON.stringify(this.payloadAddNewAddressBook, undefined, 4));
    this.attach(`Payload add new address book` + JSON.stringify(this.payloadAddNewAddressBook, undefined, 4))
})

Then(`User sends a POST request to add new address book`, async function () {
    this.response = this.addNewAddressBookResponse = await supplierRequest.createSupplier(this.request, this.linkApiAddNewAddressBook, this.payloadAddNewAddressBook, this.headers);
    const responseBodyText = await this.addNewAddressBookResponse.text();
    console.log(responseBodyText);
    if (this.addNewAddressBookResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.addNewAddressBookResponseBody = JSON.parse(responseBodyText)
        logger.log('info', `Response POST ${this.linkApiAddNewAddressBook}` + JSON.stringify(this.addNewAddressBookResponseBody, undefined, 4));
        this.attach(`Response POST ${this.linkApiAddNewAddressBook}` + JSON.stringify(this.addNewAddressBookResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${this.linkApiAddNewAddressBook} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${this.linkApiAddNewAddressBook} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
})

Then('{} checks API contract of add new address book response', async function (actor: string) {
    supplierAddressResponseSchema.parse(this.addNewAddressBookResponseBody);
});

Then(`User checks values in response of add new address book are correct`, async function () {
    expect(this.addNewAddressBookResponseBody.vendorKey).toBe(this.supplierKey == "" ? null : this.supplierKey)
    expect(this.addNewAddressBookResponseBody.fullName).toBe(this.supplierName == "" ? null : this.supplierName)
    expect(this.addNewAddressBookResponseBody.countryCode).toBe(this.country == "" ? null : this.country)
    expect(this.addNewAddressBookResponseBody.addressLine1).toBe(this.streetLine1 == "" ? null : this.streetLine1)
    expect(this.addNewAddressBookResponseBody.addressLine2).toBe(this.streetLine2 == "" ? null : this.streetLine2)
    expect(this.addNewAddressBookResponseBody.city).toBe(this.city == "" ? null : this.city)
    expect(this.addNewAddressBookResponseBody.stateOrProvinceCode).toBe(this.state == "" ? null : this.state)
    expect(this.addNewAddressBookResponseBody.postalCode).toBe(this.zipCode == "" ? null : this.zipCode)
    expect(this.addNewAddressBookResponseBody.phoneNumber).toBe(this.phoneNumber == "" ? null : this.phoneNumber)
})

Then(`User sets DELETE api to delete address book`, async function () {
    this.linkApiDeleteAddressBook = Links.API_SUPPLIER
    this.payloadDeleteAddressBook = {
        ids: [`${this.addNewAddressBookResponseBody.key}`]
    }
})

Then(`User send a DELETE method to delete address book`, async function () {
    this.response = await supplierRequest.deleteSupplier(this.request, this.linkApiDeleteAddressBook, this.payloadDeleteAddressBook, this.headers);
    logger.log('info', `Response DELETE ${Links.API_SUPPLIERS} has status code ${this.response.status()} ${this.response.statusText()} and response body ${await this.response.text()}`);
    this.attach(`Response DELETE ${Links.API_SUPPLIERS} has status code ${this.response.status()} ${this.response.statusText()} and response body ${await this.response.text()}`)
})

Then(`User sets GET api to get list address books by full name`, async function () {
    this.linkGetListAddressBooks = `${Links.API_SUPPLIER}?offset=0&limit=50&where={"filters":[{"filters":[{"field":"fullName","operator":"contains","value":"${this.addNewAddressBookResponseBody.fullName}"}],"logic":"and"}],"logic":"and"}`;
})

Then(`User sends a GET request to get list address books`, async function () {
    const options = {
        headers: this.headers
    }
    this.getListAddressBooksResponse = this.response = await supplierRequest.getSuppliers(this.request, this.linkGetListAddressBooks, options);
    const responseBodyText = await this.getListAddressBooksResponse.text();
    if (this.getListAddressBooksResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getListAddressBooksResponseBody = JSON.parse(await this.getListAddressBooksResponse.text());
        logger.log('info', `Response list address books  ${this.linkGetListAddressBooks}: ` + JSON.stringify(this.getListAddressBooksResponseBody, undefined, 4));
        this.attach(`Response list address books ${this.linkGetListAddressBooks}: ` + JSON.stringify(this.getListAddressBooksResponseBody, undefined, 4));
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${this.linkGetListAddressBooks} has status code ${this.getListAddressBooksResponse.status()} ${this.getListAddressBooksResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${this.linkGetListAddressBooks} has status code ${this.getListAddressBooksResponse.status()} ${this.getListAddressBooksResponse.statusText()} and response body ${actualResponseText}`);
    }
})

Then(`User checks just added address book must be found and display the correct information`, async function () {
    expect(this.getListAddressBooksResponseBody.length).toBeGreaterThanOrEqual(1)
    const justAddedAddressBook = this.getListAddressBooksResponseBody.find((addressBook: any) => addressBook.key == this.addNewAddressBookResponseBody.key)
    expect(justAddedAddressBook).not.toBe(undefined)
    expect(justAddedAddressBook.vendorKey).toBe(this.addNewAddressBookResponseBody.vendorKey)
    expect(justAddedAddressBook.fullName).toBe(this.addNewAddressBookResponseBody.fullName)
    expect(justAddedAddressBook.countryCode).toBe(this.addNewAddressBookResponseBody.countryCode)
    expect(justAddedAddressBook.addressLine1).toBe(this.addNewAddressBookResponseBody.addressLine1)
    expect(justAddedAddressBook.addressLine2).toBe(this.addNewAddressBookResponseBody.addressLine2)
    expect(justAddedAddressBook.city).toBe(this.addNewAddressBookResponseBody.city)
    expect(justAddedAddressBook.stateOrProvinceCode).toBe(this.addNewAddressBookResponseBody.stateOrProvinceCode)
    expect(justAddedAddressBook.postalCode).toBe(this.addNewAddressBookResponseBody.postalCode)
    expect(justAddedAddressBook.phoneNumber).toBe(this.addNewAddressBookResponseBody.phoneNumber)
})

Then(`User sets PUT api to update address book with following information:`, async function (dataTable: DataTable) {
    this.linkApiUpdateAddressBook = `${Links.API_SUPPLIER}/${this.addNewAddressBookResponseBody.key}`
    const { country, supplierName, streetLine1, streetLine2, city, state, zipCode, phoneNumber } = dataTable.hashes()[0]
    if (country == 'random') {
        this.country = faker.address.countryCode();
    } else {
        this.country = country
    }

    if (supplierName == 'random') {
        this.supplierKey = this.responseBodyOfASupplierObject.key
        this.supplierName = this.responseBodyOfASupplierObject.name
    }

    if (streetLine1 == 'random') {
        this.streetLine1 = faker.address.streetAddress()
    } else {
        this.streetLine1 = streetLine1
    }

    if (streetLine2 == 'random') {
        this.streetLine2 = faker.address.secondaryAddress()
    } else {
        this.streetLine2 = streetLine2
    }

    if (city == 'random') {
        this.city = faker.address.cityName()
    } else {
        this.city = city
    }

    if (state == 'random') {
        this.state = faker.address.state()
    } else {
        this.state = state
    }

    if (zipCode == 'random') {
        this.zipCode = faker.address.zipCode()
    } else {
        this.zipCode = zipCode
    }

    if (phoneNumber == 'random') {
        this.phoneNumber = faker.phone.number('0#########')
    } else {
        this.phoneNumber = phoneNumber
    }

    this.payloadUpdateAddressBook = {
        "key": `${this.addNewAddressBookResponseBody.key}`,
        "vendorKey": `${this.supplierKey}`,
        "countryCode": `${this.country}`,
        "fullName": `${this.supplierName}`,
        "addressLine1": `${this.streetLine1}`,
        "addressLine2": `${this.streetLine2}`,
        "city": `${this.city}`,
        "stateOrProvinceCode": `${this.state}`,
        "postalCode": `${this.zipCode}`,
        "phoneNumber": `${this.phoneNumber}`
    }

    logger.log('info', `Payload update address book` + JSON.stringify(this.payloadAddNewAddressBook, undefined, 4));
    this.attach(`Payload update address book` + JSON.stringify(this.payloadAddNewAddressBook, undefined, 4))
})

Then(`User sends a PUT request to update address book`, async function () {
    this.response = this.updateAddressBookResponse = await supplierRequest.editSupplier(this.request, this.linkApiUpdateAddressBook, this.payloadUpdateAddressBook, this.headers);
    const responseBodyText = await this.updateAddressBookResponse.text();
    console.log(responseBodyText);
    if (this.updateAddressBookResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.updateAddressBookResponseBody = JSON.parse(responseBodyText)
        logger.log('info', `Response update address book ${this.linkApiUpdateAddressBook}` + JSON.stringify(this.updateAddressBookResponseBody, undefined, 4));
        this.attach(`Response update address book ${this.linkApiUpdateAddressBook}` + JSON.stringify(this.updateAddressBookResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${this.linkApiUpdateAddressBook} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${this.linkApiUpdateAddressBook} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
})

Then(`User checks values in response of update address book are correct`, async function () {
    expect(this.updateAddressBookResponseBody.key).toBe(this.addNewAddressBookResponseBody.key)
    expect(this.updateAddressBookResponseBody.vendorKey).toBe(this.supplierKey)
    expect(this.updateAddressBookResponseBody.fullName).toBe(this.supplierName)
    expect(this.updateAddressBookResponseBody.countryCode).toBe(this.country)
    expect(this.updateAddressBookResponseBody.addressLine1).toBe(this.streetLine1)
    expect(this.updateAddressBookResponseBody.addressLine2).toBe(this.streetLine2)
    expect(this.updateAddressBookResponseBody.city).toBe(this.city)
    expect(this.updateAddressBookResponseBody.stateOrProvinceCode).toBe(this.state)
    expect(this.updateAddressBookResponseBody.postalCode).toBe(this.zipCode)
    expect(this.updateAddressBookResponseBody.phoneNumber).toBe(this.phoneNumber)
})

Then('{} checks API contract of update address book response', async function (actor: string) {
    supplierAddressResponseSchema.parse(this.updateAddressBookResponseBody);
});
