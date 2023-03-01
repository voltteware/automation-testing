import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as itemRequest from '../../../../src/api/request/item.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";

let link: any;
let randomSupplier: any;
let payload: {
    name?: string,
    asin?: string,
    fnsku?: string,
    description?: string,
    vendorName?: string,
    vendorPrice?: Number,
    moq?: Number,
    leadTime?: Number,
    orderInterval?: Number,
    serviceLevel?: Number,
    onHand?: Number,
    onHandMin?: Number,
    onHandThirdParty?: Number,
    onHandThirdPartyMin?: Number,
    lotMultipleQty?: Number,
    lotMultipleItemName?: string,
    skuNotes?: string,
    prepNotes?: string,
    supplierRebate?: Number,
    inboundShippingCost?: Number,
    reshippingCost?: Number,
    repackagingMaterialCost?: Number,
    repackingLaborCost?: Number,
    rank?: Number,
    inventorySourcePreference?: string,
    average7DayPrice?: Number,
    isFbm?: Boolean,
    key?: string,
    vendorKey?: string,
} = {}

Then(`{} sets POST api endpoint to create item`, async function (actor: string) {
    link = Links.API_ITEMS;
});

Then('{} sets request body with payload as name: {string} and description: {string} and vendorName: {string} and vendorPrice: {string} and moq: {string} and leadTime: {string} and orderInterval: {string} and serviceLevel: {string} and onHand: {string} and onHandMin: {string} and onHandThirdParty: {string} and onHandThirdPartyMin: {string} and lotMultipleQty: {string} and lotMultipleItemName: {string} and asin: {string} and fnsku: {string} and skuNotes: {string} and prepNotes: {string} and supplierRebate: {string} and inboundShippingCost: {string} and reshippingCost: {string} and repackagingMaterialCost: {string} and repackingLaborCost: {string} and rank: {string} and inventorySourcePreference: {string} and average7DayPrice: {string} and isFbm: {string} and key: {string} and vendorKey: {string}',
    async function (actor, name, description, vendorName, vendorPrice, moq, leadTime, orderInterval, serviceLevel, onHand, onHandMin, onHandThirdParty, onHandThirdPartyMin, lotMultipleQty, lotMultipleItemName, asin, fnsku, skuNotes, prepNotes, supplierRebate, inboundShippingCost, reshippingCost, repackagingMaterialCost, repackingLaborCost, rank, inventorySourcePreference, average7DayPrice, isFbm, key, vendorKey: string) {
        if (name.includes('New Item Auto')) {
            payload.name = `${faker.commerce.productName()} Auto`;
        }
        payload.description = description;
        randomSupplier = this.getSupplierResponseBody[Math.floor(Math.random() * this.getSupplierResponseBody.length)]
        if(vendorName == 'random'){
            payload.vendorName = randomSupplier.name;
        }
        if(vendorKey == 'random'){
            payload.vendorKey = randomSupplier.key;
        }
        if (vendorPrice == 'random') {
            payload.vendorPrice = Number(faker.random.numeric());
        }
        else {
            payload.vendorPrice = Number(vendorPrice);
        }

        if (moq == 'random') {
            payload.moq = Number(faker.random.numeric());
        }
        else {
            payload.moq = Number(moq);
        }

        if (leadTime == 'random') {
            payload.leadTime = Number(faker.datatype.number({
                'min': 1,
                'max': 365
            }));
        }
        else {
            payload.leadTime = Number(leadTime);
        }

        if (orderInterval == 'random') {
            payload.orderInterval = Number(faker.datatype.number({
                'min': 1,
                'max': 365
            }));
        }
        else {
            payload.orderInterval = Number(orderInterval);
        }

        if (serviceLevel == 'random') {
            payload.serviceLevel = Number(faker.datatype.number({
                'min': 1,
                'max': 99
            }));
        }
        else {
            payload.serviceLevel = Number(serviceLevel);
        }

        if (onHand == 'random') {
            payload.onHand = Number(faker.random.numeric(3));
        }
        else {
            payload.onHand = Number(onHand);
        }

        if (onHandMin == 'random') {
            payload.onHandMin = Number(faker.random.numeric(3));
        }
        else {
            payload.onHandMin = Number(onHandMin);
        }

        if (onHandThirdParty == 'random') {
            payload.onHandThirdParty = Number(faker.random.numeric(3));
        }
        else {
            payload.onHandThirdParty = Number(onHandThirdParty);
        }

        if (onHandThirdPartyMin == 'random') {
            payload.onHandThirdPartyMin = Number(faker.random.numeric(3));
        }
        else {
            payload.onHandThirdPartyMin = Number(onHandThirdPartyMin);
        }

        if (lotMultipleQty == 'random') {
            payload.lotMultipleQty = Number(faker.random.numeric(3));
        }
        else {
            payload.lotMultipleQty = Number(lotMultipleQty);
        }

        if(lotMultipleItemName == 'random'){
            payload.lotMultipleItemName = this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)].name;
        }

        if (asin == 'random') {
            payload.asin = `${faker.random.alphaNumeric(10)}`;
        }
        else {
            payload.asin = asin;
        }

        if (fnsku == 'random') {
            payload.fnsku = `${faker.random.alphaNumeric(10)}`;
        }
        else {
            payload.fnsku = fnsku;
        }

        if (skuNotes == 'random') {
            payload.skuNotes = `SkuNotes ${faker.lorem.word(2)}`;
        }
        else {
            payload.skuNotes = skuNotes;
        }

        if (prepNotes == 'random') {
            payload.prepNotes = `PrepNotes ${faker.lorem.word(2)}`;
        }
        else {
            payload.prepNotes = prepNotes;
        }

        if (supplierRebate == 'random') {
            payload.supplierRebate = Number(faker.random.numeric(3));
        }
        else {
            payload.supplierRebate = Number(supplierRebate);
        }

        if (inboundShippingCost == 'random') {
            payload.inboundShippingCost = Number(faker.random.numeric(3));
        }
        else {
            payload.inboundShippingCost = Number(inboundShippingCost);
        }

        if (reshippingCost == 'random') {
            payload.reshippingCost = Number(faker.random.numeric(3));
        }
        else {
            payload.reshippingCost = Number(reshippingCost);
        }

        if (repackagingMaterialCost == 'random') {
            payload.repackagingMaterialCost = Number(faker.random.numeric(3));
        }
        else {
            payload.repackagingMaterialCost = Number(repackagingMaterialCost);
        }

        if (repackingLaborCost == 'random') {
            payload.repackingLaborCost = Number(faker.random.numeric(3));
        }
        else {
            payload.repackingLaborCost = Number(repackingLaborCost);
        }

        if (rank == 'random') {
            payload.rank = Number(faker.random.numeric(4));
        }
        else {
            payload.rank = rank;
        }
        
        payload.inventorySourcePreference = inventorySourcePreference;
        payload.key = key;

        if (average7DayPrice == 'random') {
            payload.average7DayPrice = Number(faker.random.numeric(3));
        }
        else {
            payload.average7DayPrice = Number(average7DayPrice);
        }

        if (isFbm == 'random') {
            payload.isFbm = Boolean(faker.datatype.boolean);
        }
        else {
            payload.isFbm = Boolean(isFbm);
        }
        this.attach(`Payload: ${JSON.stringify(payload, undefined, 4)}`)
    });

Then('{} sends a POST method to create item', async function (actor: string) {
    this.response = this.createItemResponse = await itemRequest.createItem(this.request, link, payload, this.headers);
    const responseBodyText = await this.createItemResponse.text();
    console.log(responseBodyText);
    if (this.createItemResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBodyOfAItemObject = JSON.parse(responseBodyText)
        logger.log('info', `Response POST ${link}` + JSON.stringify(this.responseBodyOfAItemObject, undefined, 4));
        this.attach(`Response POST ${link}` + JSON.stringify(this.responseBodyOfAItemObject, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
})

Then('{} checks values in response of create item are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfAItemObject.companyType);
    expect(this.responseBodyOfAItemObject.companyKey).not.toBeNull();
    expect(this.responseBodyOfAItemObject.name, `In response body, name should be matched with the data request: ${payload.name}`).toBe(payload.name);
    expect(this.responseBodyOfAItemObject.description, `In response body, description should be matched with the data request: ${payload.description}`).toBe(payload.description);
    expect(this.responseBodyOfAItemObject.vendorName, `In response body, vendorName should be matched with the data request: ${payload.vendorName}`).toBe(payload.vendorName);
    expect(this.responseBodyOfAItemObject.vendorPrice, `In response body, vendorPrice should be matched with the data request: ${payload.vendorPrice}`).toBe(payload.vendorPrice);
    expect(this.responseBodyOfAItemObject.moq, `In response body, moq should be matched with the data request: ${payload.moq}`).toBe(payload.moq);
    expect(this.responseBodyOfAItemObject.leadTime, `In response body, leadTime should be matched with the data request: ${payload.leadTime}`).toBe(payload.leadTime);
    expect(this.responseBodyOfAItemObject.orderInterval, `In response body, orderInterval should be matched with the data request: ${payload.orderInterval}`).toBe(payload.orderInterval);
    expect(this.responseBodyOfAItemObject.serviceLevel, `In response body, serviceLevel should be matched with the data request: ${payload.serviceLevel}`).toBe(payload.serviceLevel);
    expect(this.responseBodyOfAItemObject.onHand, `In response body, onHand should be matched with the data request: ${payload.onHand}`).toBe(payload.onHand);
    expect(this.responseBodyOfAItemObject.onHandMin, `In response body, onHandMin should be matched with the data request: ${payload.onHandMin}`).toBe(payload.onHandMin);
    expect(this.responseBodyOfAItemObject.onHandThirdParty, `In response body, onHandThirdParty should be matched with the data request: ${payload.onHandThirdParty}`).toBe(payload.onHandThirdParty);
    expect(this.responseBodyOfAItemObject.onHandThirdPartyMin, `In response body, onHandThirdPartyMin should be matched with the data request: ${payload.onHandThirdPartyMin}`).toBe(payload.onHandThirdPartyMin);
    expect(this.responseBodyOfAItemObject.lotMultipleQty, `In response body, lotMultipleQty should be matched with the data request: ${payload.lotMultipleQty}`).toBe(payload.lotMultipleQty);
    expect(this.responseBodyOfAItemObject.lotMultipleItemName, `In response body, lotMultipleItemName should be matched with the data request: ${payload.lotMultipleItemName}`).toBe(payload.lotMultipleItemName);
    if (this.companyType == "ASC") {
    expect(this.responseBodyOfAItemObject.skuNotes, `In response body, skuNotes should be matched with the data request: ${payload.skuNotes}`).toBe(payload.skuNotes);
    expect(this.responseBodyOfAItemObject.prepNotes, `In response body, prepNotes should be matched with the data request: ${payload.prepNotes}`).toBe(payload.prepNotes);
    expect(this.responseBodyOfAItemObject.supplierRebate, `In response body, supplierRebate should be matched with the data request: ${payload.supplierRebate}`).toBe(payload.supplierRebate);
    expect(this.responseBodyOfAItemObject.inboundShippingCost, `In response body, inboundShippingCost should be matched with the data request: ${payload.inboundShippingCost}`).toBe(payload.inboundShippingCost);
    expect(this.responseBodyOfAItemObject.reshippingCost, `In response body, reshippingCost should be matched with the data request: ${payload.reshippingCost}`).toBe(payload.reshippingCost);
    expect(this.responseBodyOfAItemObject.repackagingMaterialCost, `In response body, repackagingMaterialCost should be matched with the data request: ${payload.repackagingMaterialCost}`).toBe(payload.repackagingMaterialCost);
    expect(this.responseBodyOfAItemObject.repackingLaborCost, `In response body, repackingLaborCost should be matched with the data request: ${payload.repackingLaborCost}`).toBe(payload.repackingLaborCost);
    expect(this.responseBodyOfAItemObject.rank, `In response body, rank should be matched with the data request: ${payload.rank}`).toBe(payload.rank);
    expect(this.responseBodyOfAItemObject.inventorySourcePreference, `In response body, inventorySourcePreference should be matched with the data request: ${payload.inventorySourcePreference}`).toBe(payload.inventorySourcePreference);
    expect(this.responseBodyOfAItemObject.average7DayPrice, `In response body, average7DayPrice should be matched with the data request: ${payload.average7DayPrice}`).toBe(payload.average7DayPrice);
    expect(this.responseBodyOfAItemObject.isFbm, `In response body, isFbm should be matched with the data request: ${payload.isFbm}`).toBe(payload.isFbm);
    expect(this.responseBodyOfAItemObject.asin, `In response body, asin should be matched with the data request: ${payload.asin}`).toBe(payload.asin);
    expect(this.responseBodyOfAItemObject.fnsku, `In response body, fnsku should be matched with the data request: ${payload.fnsku}`).toBe(payload.fnsku);
    }
})

