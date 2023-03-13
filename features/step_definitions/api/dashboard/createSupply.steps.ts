import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as supplyRequest from '../../../../src/api/request/supply.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";
import { payLoadSupply } from '../../../../src/utils/supplyPayLoad';

let link: any;
let payload: payLoadSupply = {}
let randomSupplier: any;
let randomItem: any;

Then(`{} sets POST api endpoint to create supply`, async function (actor: string) {
    link = Links.API_CREATE_SUPPLY;
});

Then('{} sets request body with payload as supplyUuid: {string} and refNum: {string} and vendorName: {string} and vendorKey: {string} and docDate: {string} and dueDate: {string} and itemName: {string} and itemKey: {string} and orderQty: {string} and openQty: {string} and orderKey: {string} and rowKey: {string}',
    async function (actor, supplyUuid, refNum, vendorName, vendorKey, docDate, dueDate, itemName, itemKey, orderQty, openQty, orderKey, rowKey: string) {

        randomItem = this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
        if(vendorName && vendorKey == 'random'){
            randomSupplier = this.getSupplierResponseBody[Math.floor(Math.random() * this.getSupplierResponseBody.length)]
        }
        
        if (supplyUuid == 'random') {
            payload.supplyUuid = faker.datatype.uuid();
        }
        else {
            payload.supplyUuid = supplyUuid;
        }

        if (refNum == 'random') {
            payload.refNum = `${faker.random.numeric(4)} Auto`;
        }
        else {
            payload.refNum = refNum;
        }

        if(vendorName == 'random'){
            payload.vendorName = randomSupplier.name;
        }else{
            payload.vendorName = vendorName;
        }

        if(vendorKey == 'random'){
            payload.vendorKey = randomSupplier.key;
        }else{
            payload.vendorKey = vendorKey;
        }
        
        if(docDate == 'random'){
            payload.docDate = faker.date.recent();
        }else{
            payload.docDate = docDate;
        }

        if(docDate == 'random'){
            payload.dueDate = faker.date.future();
        }else{
            payload.dueDate = dueDate;
        }

        if(itemName == 'random'){
            payload.itemName = randomItem.name;
        }else{
            payload.itemName = itemName;
        }

        if(itemKey == 'random'){
            payload.itemKey = randomItem.key;   
        }else{
            payload.itemKey = itemKey;
        }

        if (orderQty == 'random') {
            payload.orderQty = Number(faker.random.numeric(2));
        }
        else {
            payload.orderQty = Number(orderQty);
        }

        if (openQty == 'random') {
            payload.openQty = Number(faker.random.numeric(2));
        }
        else {
            payload.openQty = Number(openQty);
        }

        if (orderKey == 'random') {
            payload.orderKey = faker.datatype.uuid();
        }
        else {
            payload.orderKey = orderKey;
        }

        if (rowKey == 'random') {
            payload.rowKey = faker.datatype.uuid();
        }
        else {
            payload.rowKey = rowKey;
        }
        this.attach(`Payload: ${JSON.stringify(payload, undefined, 4)}`)
    });

Then('{} sends a POST method to create supply', async function (actor: string) {
    let rowKey = payload.rowKey;
    let orderKey = payload.orderKey;
    this.response = this.createSupplyResponse = await supplyRequest.createSupply(this.request, link, payload, orderKey, rowKey, this.headers);
    const responseBodyText = await this.createSupplyResponse.text();
    console.log(responseBodyText);
    if (this.createSupplyResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBodyOfASupplyObject = JSON.parse(responseBodyText)
        logger.log('info', `Response POST ${link}` + JSON.stringify(this.responseBodyOfASupplyObject, undefined, 4));
        this.attach(`Response POST ${link}` + JSON.stringify(this.responseBodyOfASupplyObject, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
})

Then('{} checks values in response of create supply are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfASupplyObject.companyType);
    expect(this.responseBodyOfASupplyObject.companyKey).not.toBeNull();
    if(payload.supplyUuid){
        expect(this.responseBodyOfASupplyObject.supplyUuid, `In response body, supplyUuid should be matched with the data request: ${payload.supplyUuid}`).toBe(payload.supplyUuid);
    }
    if(payload.refNum){
        expect(this.responseBodyOfASupplyObject.refNum, `In response body, refNum should be matched with the data request: ${payload.refNum}`).toBe(payload.refNum);
    }
    if(payload.vendorName){
        expect(this.responseBodyOfASupplyObject.vendorName, `In response body, vendorName should be matched with the data request: ${payload.vendorName}`).toBe(payload.vendorName);
    }
    if(payload.vendorKey){
        expect(this.responseBodyOfASupplyObject.vendorKey, `In response body, vendorKey should be matched with the data request: ${payload.vendorKey}`).toBe(payload.vendorKey);
    }
    if(payload.itemName){
        expect(this.responseBodyOfASupplyObject.itemName, `In response body, itemName should be matched with the data request: ${payload.itemName}`).toBe(payload.itemName);
    }
    if(payload.itemKey){
        expect(this.responseBodyOfASupplyObject.itemKey, `In response body, itemKey should be matched with the data request: ${payload.itemKey}`).toBe(payload.itemKey);
    }
    if (payload.orderQty) {
        expect(this.responseBodyOfASupplyObject.orderQty, `In response body, orderQty should be matched with the data request: ${payload.orderQty}`).toBe(payload.orderQty);
    }
    if (payload.openQty) {
        expect(this.responseBodyOfASupplyObject.openQty, `In response body, openQty should be matched with the data request: ${payload.openQty}`).toBe(payload.openQty);
    }
    if (payload.orderKey) {
        expect(this.responseBodyOfASupplyObject.orderKey, `In response body, orderKey should be matched with the data request: ${payload.orderKey}`).toBe(payload.orderKey);
    }
    if (payload.rowKey) {
        expect(this.responseBodyOfASupplyObject.rowKey, `In response body, rowKey should be matched with the data request: ${payload.rowKey}`).toBe(payload.rowKey);
    }
})

