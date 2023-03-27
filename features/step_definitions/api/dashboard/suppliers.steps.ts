import { Then, Given, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as supplierRequest from '../../../../src/api/request/vendor.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";

let link: any;
let supplierKey: string;

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
        // logger.log('info', `Response GET ${link}` + JSON.stringify(this.getSupplierResponseBody, undefined, 4));
        // this.attach(`Response GET ${link}` + JSON.stringify(this.getSupplierResponseBody, undefined, 4))
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
    logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${this.totalSupplier}`);
    this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${this.totalSupplier}`)
})

Then('{} picks random supplier in above response', async function (actor: string) {
    this.responseBodyOfASupplierObject = await this.getSupplierResponseBody[Math.floor(Math.random() * this.getSupplierResponseBody.length)];
    logger.log('info', `Random supplier: ${JSON.stringify(this.responseBodyOfASupplierObject, undefined, 4)}`);
    this.attach(`Random supplier: ${JSON.stringify(this.responseBodyOfASupplierObject, undefined, 4)}`);
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
            await this.getSupplierResponseBody.push(JSON.parse(responseBodyText));
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
    expect(this.selectedSuppliers.length, 'Expect that there is at least user is selected').toBeGreaterThan(0);
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
        default:
            break;
    }

    // Prepare payload for request to edit supplier
    if (companyType === 'CSV') {
        this.payLoad = {
            companyType: `${this.responseBodyOfASupplierObject.companyType}`,
            companyKey: `${this.responseBodyOfASupplierObject.companyKey}`,
            key: `${this.responseBodyOfASupplierObject.key}`,
            name: this.newSupplierName === undefined ? this.responseBodyOfASupplierObject.name : this.newSupplierName,
            description: `${this.description === undefined ? this.responseBodyOfASupplierObject.description : this.description}`,
            isHidden: this.responseBodyOfASupplierObject.isHidden,
            shipVia: this.responseBodyOfASupplierObject.shipVia,
            email: `${this.responseBodyOfASupplierObject.email}`,
            moq: this.responseBodyOfASupplierObject.moq,
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
            name: this.newSupplierName === undefined ? this.responseBodyOfASupplierObject.name : this.newSupplierName,
            description: `${this.description === undefined ? this.responseBodyOfASupplierObject.description : this.description}`,
            isHidden: this.responseBodyOfASupplierObject.isHidden,
            shipVia: this.responseBodyOfASupplierObject.shipVia,
            email: `${this.responseBodyOfASupplierObject.email}`,
            moq: this.responseBodyOfASupplierObject.moq,
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
            links: `${this.responseBodyOfASupplierObject.links === undefined ? "" : undefined}`
        }
    } else if (companyType === 'QBFS' || companyType === 'QBO') {
        this.payLoad = {
            companyType: `${this.responseBodyOfASupplierObject.companyType}`,
            companyKey: `${this.responseBodyOfASupplierObject.companyKey}`,
            key: `${this.responseBodyOfASupplierObject.key}`,
            name: this.newSupplierName === undefined ? this.responseBodyOfASupplierObject.name : this.newSupplierName,
            description: `${this.description === undefined ? this.responseBodyOfASupplierObject.description : this.description}`,
            isHidden: this.responseBodyOfASupplierObject.isHidden,
            shipVia: this.responseBodyOfASupplierObject.shipVia,
            email: `${this.responseBodyOfASupplierObject.email}`,
            moq: this.responseBodyOfASupplierObject.moq,
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
        this.editSupplierResponseBody = JSON.parse(await this.response.text())
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
        default:
            break;
    }
});