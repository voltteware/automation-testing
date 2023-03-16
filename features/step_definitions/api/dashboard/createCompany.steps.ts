import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as companyRequest from '../../../../src/api/request/company.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";

let link: any;
let arrCompanyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
let payload: {
    companyKey ?: string
    companyType?: string
    companyName?: string
    initialSyncDate?: Date
    marketplaceId?: string
    serviceLevel?: Number
    leadTime?: Number
    orderInterval?: Number
} = {}

Then(`{} sets POST api endpoint to create company`, async function (actor: string) {
    link = Links.API_CREATE_COMPANY;
});

Then('{} sets request body with payload as companyName: {string} and companyKey: {string} and companyType: {string} and serviceLevel: {string} and leadTime: {string} and orderInterval: {string} and initialSyncDate: {string} and marketplaceId: {string}',
    async function (actor, companyName, companyKey, companyType, serviceLevel, leadTime, orderInterval, initialSyncDate, marketplaceId: string) {

        const marketplaceIDS = ['NA', 'EU', 'A2EUQ1WTGCTBG2', 'A1PA6795UKMFR9', 'A1RKKUPIHCS9HS', 'A13V1IB3VIYZZH', 'APJ6JRA9NG5V4', 'A1AM78C64UM0Y8', 'A1F83G8C2ARO7P', 'ATVPDKIKX0DER'];
        if(companyName == 'random'){
            payload.companyName = `${faker.company.name()}-AutoTest`;
        }
        else{
            payload.companyName = companyName;
        }

        payload.companyKey = companyKey;

        if(companyType == 'random'){
            payload.companyType = arrCompanyType[Math.floor(Math.random() * arrCompanyType.length)];
        }else{
            payload.companyType = companyType;
        }
        
        if(payload.companyType == 'ASC'){
            if(initialSyncDate == 'currentDate'){
                payload.initialSyncDate = new Date();
            }
            if(marketplaceId == 'random'){
                payload.marketplaceId = `${marketplaceIDS[Math.floor(Math.random() * 10)]}`;
            }
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

        this.attach(`Payload: ${JSON.stringify(payload, undefined, 4)}`)
    });

Then('{} sends a POST method to create company', async function (actor: string) {
    this.response = this.createCompanyResponse = await companyRequest.createCompany(this.request, link, payload, this.headers);
    const responseBodyText = await this.createCompanyResponse.text();
    if (this.createCompanyResponse.status() == 201 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBodyOfACompanyObject = JSON.parse(responseBodyText)
        logger.log('info', `Response POST ${link}` + JSON.stringify(this.responseBodyOfACompanyObject, undefined, 4));
        this.attach(`Response POST ${link}` + JSON.stringify(this.responseBodyOfACompanyObject, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
})

Then('Check that the company just created exists in the current companies list of his', async function () {
    const options = {
        headers: this.headers
    }
    this.getRealmResponse = this.response = await companyRequest.getRealm(this.request, link, options);
    this.getRealmResponseBody = JSON.parse(await this.getRealmResponse.text());
    const foundCompany = this.getRealmResponseBody.some((element: { companyName: any; }) => element.companyName == payload.companyName);
    expect(foundCompany, 'Company should be exists in the list companies').toBeTruthy();
})

Then('{} checks values in response of create company are correct', async function (actor: string) {
    
    expect(arrCompanyType, `Company Type should be one of ${arrCompanyType}`).toContain(this.responseBodyOfACompanyObject.companyType);
    expect(this.responseBodyOfACompanyObject.companyKey).not.toBeNull();
    
    if(payload.companyKey){
        expect(this.responseBodyOfACompanyObject.companyKey, `In response body, parentKey should be matched with the data request: ${payload.companyKey}`).toBe(payload.companyKey);
    }
    if(payload.companyName){
        expect(this.responseBodyOfACompanyObject.companyName, `In response body, companyName should be matched with the data request: ${payload.companyName}`).toBe(payload.companyName);
    }
    if(payload.marketplaceId){
        expect(this.responseBodyOfACompanyObject.marketplaceId, `In response body, marketplaceId should be matched with the data request: ${payload.marketplaceId}`).toBe(payload.marketplaceId);
    }
    if (payload.serviceLevel) {
        expect(this.responseBodyOfACompanyObject.serviceLevel, `In response body, serviceLevel should be matched with the data request: ${payload.serviceLevel}`).toBe(payload.serviceLevel);
    }
    if (payload.leadTime) {
        expect(this.responseBodyOfACompanyObject.leadTime, `In response body, leadTime should be matched with the data request: ${payload.leadTime}`).toBe(payload.leadTime);
    }
    if (payload.orderInterval) {
        expect(this.responseBodyOfACompanyObject.orderInterval, `In response body, orderInterval should be matched with the data request: ${payload.orderInterval}`).toBe(payload.orderInterval);
    }
})

