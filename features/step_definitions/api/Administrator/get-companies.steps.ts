import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as companiesRequest from '../../../../src/api/request/administration.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";

let link: any;
let linkGet20Companies: any;

Then(`{} sets GET api endpoint to get companies keys`, async function (actor: string) {
    link = Links.API_ADMIN_GET_COMPANIES;
});

Then(`{} sets GET api endpoint to get 20 companies has just created`, async function (actor: string) {
    linkGet20Companies = encodeURI(`${Links.API_ADMIN_GET_COMPANIES}?offset=0&limit=20&sort=[{"field":"createdAt","direction":"desc"}]&where={"logic":"and","filters":[]}`);
});

Then('{} sends a GET request to get companies keys', async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.response = await companiesRequest.getCompanies(this.request, link, options);
    const responseBodyText = await this.response.text();
    if (this.response.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = JSON.parse(await this.response.text());
        // logger.log('info', `Response GET ${Links.API_ADMIN_GET_COMPANIES}` + JSON.stringify(this.responseBody, undefined, 4));
        // this.attach(`Response GET ${Links.API_ADMIN_GET_COMPANIES}` + JSON.stringify(this.responseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${Links.API_ADMIN_GET_COMPANIES} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${Links.API_ADMIN_GET_COMPANIES} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
})

Then('{} sends a GET request to get 20 latest companies', async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.get20LatestCompaniesResponse = this.response = await companiesRequest.getCompanies(this.request, linkGet20Companies, options);
    const responseBodyText = await this.get20LatestCompaniesResponse.text();
    if (this.get20LatestCompaniesResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.get20LatestCompaniesResponseBody = this.responseBody = JSON.parse(await this.response.text());
        // logger.log('info', `Response GET ${linkGet20Companies}` + JSON.stringify(this.responseBody, undefined, 4));
        this.attach(`Response GET ${linkGet20Companies}` + JSON.stringify(this.responseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkGet20Companies} has status code ${this.get20LatestCompaniesResponse.status()} ${this.get20LatestCompaniesResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${linkGet20Companies} has status code ${this.get20LatestCompaniesResponse.status()} ${this.get20LatestCompaniesResponse.statusText()} and response body ${actualResponseText}`)
    }
})

Then('{} picks random companies in above response', async function (actor: string) {
    this.responseBodyOfACompanyObject = await this.responseBody[Math.floor(Math.random() * this.responseBody.length)];
    logger.log('info', `Random company: ${JSON.stringify(this.responseBodyOfACompanyObject, undefined, 4)}`);
    this.attach(`Random company: ${JSON.stringify(this.responseBodyOfACompanyObject, undefined, 4)}`);
})

Given('User saves information of above company', function () {
    this.companyKey = this.responseBodyOfACompanyObject.companyKey
    this.companyType = this.responseBodyOfACompanyObject.companyType
    this.companyName = this.responseBodyOfACompanyObject.companyName

    logger.log('info', `Conpany key: ${this.companyKey}, Company type: ${this.companyType}, Company name: ${this.companyName}`)
    this.attach(`Conpany key: ${this.companyKey}, Company type: ${this.conpanyType}, Company name: ${this.companyName}`)
});