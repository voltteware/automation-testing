import { When, Then, Given, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as adminRequest from '../../../../src/api/request/administration.service';
import * as companyRequest from '../../../../src/api/request/company.service';
import logger from '../../../../src/Logger/logger';
import { faker } from '@faker-js/faker';
import { Links } from '../../../../src/utils/links';
import _, { endsWith } from "lodash";
import { payLoadCompany } from '../../../../src/utils/companyPayLoad';

let numberofCompanies: any;
const arrCompanyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
const marketplaceIDS = ['NA', 'EU', 'A2EUQ1WTGCTBG2', 'A1PA6795UKMFR9', 'A1RKKUPIHCS9HS', 'A13V1IB3VIYZZH', 'APJ6JRA9NG5V4', 'A1AM78C64UM0Y8', 'A1F83G8C2ARO7P', 'ATVPDKIKX0DER'];
const endPointToGet20LatestCompany = encodeURI(`${Links.API_ADMIN_GET_COMPANIES}?offset=0&limit=20&sort=[{"field":"createdAt","direction":"desc"}]&where={"logic":"and","filters":[]}`);
let link: any;
let selectedCompany: any;
let randomCompany: any;
let payload: payLoadCompany = {};

Then(`{} sets DELETE api endpoint to delete company`, async function (actor: string) {
    link = Links.API_ADMIN_DELETE_COMPANY;
});

Then('Check {} company exist in the system, if it does not exist will create company', async function (companyNameKeyWord: string) {
    //Get list 20 companies after create
    const options = {
        headers: this.headers
    }
    this.get20LatestCompaniesResponse = await adminRequest.getCompanies(this.request, endPointToGet20LatestCompany, options);
    if (this.get20LatestCompaniesResponse.status() == 200) {
        this.get20LatestCompaniesResponseBody = JSON.parse(await this.get20LatestCompaniesResponse.text());
        this.attach(`Response GET ${endPointToGet20LatestCompany}` + JSON.stringify(this.get20LatestCompaniesResponseBody, undefined, 4))
    }
    else {
        logger.log('info', `Response GET ${endPointToGet20LatestCompany} has status code ${this.get20LatestCompaniesResponse.status()} ${this.get20LatestCompaniesResponse.statusText()} and response body ${this.get20LatestCompaniesResponse.text()}`);
        this.attach(`Response GET ${endPointToGet20LatestCompany} has status code ${this.get20LatestCompaniesResponse.status()} ${this.get20LatestCompaniesResponse.statusText()} and response body ${this.get20LatestCompaniesResponse.text()}`)
    }

    if (companyNameKeyWord != 'any') {
        numberofCompanies = await this.get20LatestCompaniesResponseBody.filter((co: any) => co.companyName.includes(companyNameKeyWord)).length;
    }
    else {
        numberofCompanies = await this.get20LatestCompaniesResponseBody.length;
    }

    if (numberofCompanies < 1) {
        payload.companyName = `${faker.company.name()}-${companyNameKeyWord}`;
        payload.companyKey = '';
        payload.companyType = arrCompanyType[Math.floor(Math.random() * arrCompanyType.length)];
        payload.leadTime = Number(faker.datatype.number({'min': 1,'max': 365}));
        payload.orderInterval = Number(faker.datatype.number({'min': 1,'max': 365}));
        payload.serviceLevel = Number(faker.datatype.number({'min': 1,'max': 99}));
        if (payload.companyType == 'ASC'){
            payload.initialSyncDate = new Date();
            payload.marketplaceId = `${marketplaceIDS[Math.floor(Math.random() * 10)]}`;
        }

        this.response = this.createCompanyResponse = await companyRequest.createCompany(this.request, Links.API_CREATE_COMPANY, payload, this.headers);
        const responseBodyText = await this.createCompanyResponse.text();
        if (this.createCompanyResponse.status() == 201 && !responseBodyText.includes('<!doctype html>')) {
            this.createCompanyResponseBody = JSON.parse(responseBodyText);
            logger.log('info', `Response POST ${Links.API_CREATE_COMPANY}` + JSON.stringify(this.createCompanyResponseBody, undefined, 4));
            this.attach(`Response Create New Company POST >>>>>> ${Links.API_CREATE_COMPANY}` + JSON.stringify(this.createCompanyResponseBody, undefined, 4));
            this.get20LatestCompaniesResponseBody = this.createCompanyResponseBody;
        }
        else {
            const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
            logger.log('info', `Response ${Links.API_CREATE_COMPANY} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
            this.attach(`Response ${Links.API_CREATE_COMPANY} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
        }
    }    
})

Then('{} filters company to get company which has the company name included {}', async function (actor, companyNameKeyWord: string) {
    const options = {
        headers: this.headers
    }

    this.get20LatestCompaniesResponse = await adminRequest.getCompanies(this.request, endPointToGet20LatestCompany, options);
    this.get20LatestCompaniesResponseBody = JSON.parse(await this.get20LatestCompaniesResponse.text());
    selectedCompany = await this.get20LatestCompaniesResponseBody.filter((co: any) => (co.companyName).endsWith(companyNameKeyWord));
    randomCompany = selectedCompany[Math.floor(Math.random() * selectedCompany.length)];
    //logger.log('info', `Response Body before filter: ${JSON.stringify(selectedCompany, undefined, 4)}`);
    this.companyKey = randomCompany.companyKey;
    this.companyType = randomCompany.companyType;
    this.companyName = randomCompany.companyName;
    this.customerId = randomCompany.customerId;
    this.attach(`Response Body before filter: ${JSON.stringify(this.randomCompany, undefined, 4)}`);
})

Then('{} sends a DELETE method to {} delete the {} company', async function (actor, deleteType: string, actionCompany: string) {
    this.deleteType = deleteType;
    const options = {
        headers: this.headers
    }

    if (actionCompany == 'created'){
        this.companyKeyUrl = this.responseBodyOfACompanyObject.companyKey;
        this.companyTypeUrl = this.responseBodyOfACompanyObject.companyType;
    }else {
        this.companyKeyUrl = randomCompany.companyKey;
        this.companyTypeUrl = randomCompany.companyType;
    }
    this.response = await adminRequest.deleteCompany(this.request, link, this.companyKeyUrl, this.companyTypeUrl, options, this.deleteType);
    const responseBodyText = await this.response.text();
    logger.log('info', `Response Delete ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
    this.attach(`Response Delete ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`)
})

Then('{} sends a DELETE method to delete the {} company', async function (actor, actionCompany: string) {
    const options = {
        headers: this.headers
    }
    if (actionCompany == 'created'){
        this.companyKeyUrl = this.responseBodyOfACompanyObject.companyKey;
        this.companyTypeUrl = this.responseBodyOfACompanyObject.companyType;
    }else {
        this.companyKeyUrl = randomCompany.companyKey;
        this.companyTypeUrl = randomCompany.companyType;
    }
    this.response = await adminRequest.deleteCompany(this.request, link, this.companyKeyUrl, this.companyTypeUrl, options);
    const responseBodyText = await this.response.text();
    logger.log('info', `Response Delete ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
    this.attach(`Response Delete ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`)
})

Then('Check that the company just deleted not exists in the current companies list', async function () {
    const options = {
        headers: this.headers
    }
    this.get20LatestCompaniesResponse = await adminRequest.getCompanies(this.request, endPointToGet20LatestCompany, options);
    this.get20LatestCompaniesResponseBody = JSON.parse(await this.get20LatestCompaniesResponse.text());
    if(this.actionCompany) {
        this.foundCompany = this.get20LatestCompaniesResponseBody.some((element: { companyKey: any; }) => element.companyKey == this.createCompanyResponseBody.companyKey);
    }
    else {
        this.foundCompany = this.get20LatestCompaniesResponseBody.some((element: { companyKey: any; }) => element.companyKey == randomCompany.companyKey);
    }
    expect(this.foundCompany, 'Company should not exist in the list companies').toBeFalsy();
})

Then('Check that the company just soft deleted still exists but the subscription has been canceled', async function () {
    const options = {
        headers: this.headers
    }
    const endPointToGetCompanyInfoResponse = encodeURI(`${Links.API_ADMIN_GET_COMPANIES}/${this.companyKeyUrl}/${this.companyTypeUrl}`);
    const getCompanyInfoResponseAfterSoftDelete = await adminRequest.getCompanies(this.request, endPointToGetCompanyInfoResponse, options);
    const responseBodyOfCompany = JSON.parse(await getCompanyInfoResponseAfterSoftDelete.text());
    const subscriptionStatusOfComapny = await responseBodyOfCompany.subscriptionStatus;
    this.attach(`Response get company info after soft delete ${subscriptionStatusOfComapny}`)
    expect(subscriptionStatusOfComapny).toEqual('canceled');
})

Then('User verify that has no item in item summary', async function () {
    this.expect = {"err": null, "model": {}};
    expect(this.getItemSummaryResponseBody).toEqual(this.expect);
})