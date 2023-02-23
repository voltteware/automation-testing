import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as companiesRequest from '../../../../src/api/request/administration.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";

let link: any;

Then(`{} sets GET api endpoint to get companies keys`, async function (actor: string) {
    link = Links.API_ADMIN_GET_COMPANIES;
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

Then('{} picks random companies in above response', async function (actor: string) {
    this.responseBodyOfACompanyObject = await this.responseBody[Math.floor(Math.random() * this.responseBody.length)];
    logger.log('info', `Random company: ${JSON.stringify(this.responseBodyOfACompanyObject, undefined, 4)}`);
    this.attach(`Random company: ${JSON.stringify(this.responseBodyOfACompanyObject, undefined, 4)}`);
})