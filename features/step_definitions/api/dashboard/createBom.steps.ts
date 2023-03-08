import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as bomRequest from '../../../../src/api/request/bom.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";

let link: any;
let payload: {
    parentKey?: string
    parentName?: string
    childKey?: string
    childName?: string
    qty?: Number
} = {}
let randomParentItem: any;
let randomChildItem: any;
let randomBom: any;

Then(`{} sets POST api endpoint to create bom`, async function (actor: string) {
    link = Links.API_BOM;
});

Then('{} sets request body with payload as parentName: {string} and parentKey: {string} and childName: {string} and childKey: {string} and qty: {string}',
    async function (actor, parentName, parentKey, childName, childKey, qty: string) {
        randomParentItem = this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
        randomChildItem = this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
        randomBom = this.getBomResponseBody[Math.floor(Math.random() * this.getBomResponseBody.length)];
        // check parent can't be child
        for(var i = 0; i < this.getBomResponseBody.length; i++) {
            if (randomParentItem.key == this.getBomResponseBody[i].childKey) {
                randomParentItem = this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
            }
        }
        // check child can't be parent
        for(var i = 0; i < this.getBomResponseBody.length; i++) {
            if (randomChildItem.key == this.getBomResponseBody[i].parentKey) {
                randomChildItem = this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
            }
        }
        // compare parent item and child item
        if(randomParentItem.key == randomChildItem.key){
            randomParentItem = this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
        }

        if(parentName == 'random'){
            payload.parentName = randomParentItem.name;
        }
        else if(parentName == 'childName'){
            payload.parentName = randomBom.childName;
        }
        else{
            payload.parentName = parentName;
        }

        if(parentKey == 'random'){
            payload.parentKey = randomParentItem.key;   
        }
        else if(parentKey == 'childKey'){
            payload.parentKey = randomBom.childKey;
        }
        else{
            payload.parentKey = parentKey;
        }

        if(childName == 'random'){
            payload.childName = randomChildItem.name;
        }
        else if(childName == 'parentName'){
            payload.childName = randomBom.parentName;
        }
        else{
            payload.childName = childName;
        }

        if(childKey == 'random'){
            payload.childKey = randomChildItem.key;   
        }
        else if(childKey == 'parentKey'){
            payload.childKey = randomBom.parentKey;
        }
        else{
            payload.childKey = childKey;
        }

        if (qty == 'random') {
            payload.qty = Number(faker.random.numeric(2));
        }
        else {
            payload.qty = Number(qty);
        }

        this.attach(`Payload: ${JSON.stringify(payload, undefined, 4)}`)
    });

Then('{} sends a POST method to create bom', async function (actor: string) {
    let parentKey = payload.parentKey;
    let childKey = payload.childKey;
    if(parentKey == ''){
        parentKey = faker.datatype.uuid();
    }
    this.response = this.createBomResponse = await bomRequest.createBom(this.request, link, payload, parentKey, childKey, this.headers);
    const responseBodyText = await this.createBomResponse.text();
    console.log(responseBodyText);
    if (this.createBomResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBodyOfABomObject = JSON.parse(responseBodyText)
        logger.log('info', `Response POST ${link}/${parentKey}/${childKey}` + JSON.stringify(this.responseBodyOfABomObject, undefined, 4));
        this.attach(`Response POST ${link}/${parentKey}/${childKey}` + JSON.stringify(this.responseBodyOfABomObject, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link}/${parentKey}/${childKey} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link}/${parentKey}/${childKey} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
})

Then('{} checks values in response of create bom are correct', async function (actor: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.responseBodyOfABomObject.companyType);
    expect(this.responseBodyOfABomObject.companyKey).not.toBeNull();
    
    if(payload.parentKey){
        expect(this.responseBodyOfABomObject.parentKey, `In response body, parentKey should be matched with the data request: ${payload.parentKey}`).toBe(payload.parentKey);
    }
    if(payload.parentName){
        expect(this.responseBodyOfABomObject.parentName, `In response body, parentName should be matched with the data request: ${payload.parentName}`).toBe(payload.parentName);
    }
    if(payload.childKey){
        expect(this.responseBodyOfABomObject.childKey, `In response body, childKey should be matched with the data request: ${payload.childKey}`).toBe(payload.childKey);
    }
    if(payload.childName){
        expect(this.responseBodyOfABomObject.childName, `In response body, childName should be matched with the data request: ${payload.childName}`).toBe(payload.childName);
    }
    if (payload.qty) {
        expect(this.responseBodyOfABomObject.qty, `In response body, qty should be matched with the data request: ${payload.qty}`).toBe(payload.qty);
    }
})

