import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as adminRequest from '../../../../src/api/request/administration.service';
import logger from '../../../../src/Logger/logger';
import { faker } from '@faker-js/faker';
import { Links } from '../../../../src/utils/links';
import _, { endsWith } from "lodash";

let selectedCompany, link: any;

Then('{} sets GET api endpoint to get list locked companies', async function (actor: string) {
    this.linkGetCompanies = encodeURI(`${Links.API_ADMIN_GET_COMPANIES}?offset=0&limit=10&sort=[{"field":"companyName","direction":"asc"}]&where={"filters":[{"filters":[{"field":"jobInitiator","operator":"isnotnull","value":null}],"logic":"and"}],"logic":"and"}`);
});

Then('{} checks and finds locked company of {}', async function (actor, email: string) {
    this.responseBodyOfACompanyObject = selectedCompany = await this.getLockedCompaniesResponseBody.find((co: any) => co.jobInitiator == email && co.companyKey == this.companyKey);
    logger.log('info', `Selected Company: ${JSON.stringify(selectedCompany, undefined, 4)}`);
    this.attach(`Selected Company: ${JSON.stringify(selectedCompany, undefined, 4)}`);
    const jobInitiator = selectedCompany.jobInitiator;
    expect(jobInitiator, `jobInitiator should be ${email}`).toBe(email);
});

Then('{} sends a GET request to get list locked companies', async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getLockedCompaniesResponse = this.response = await adminRequest.getCompanies(this.request, this.linkGetCompanies, options);
    const responseBodyText = await this.getLockedCompaniesResponse.text();
    if (this.getLockedCompaniesResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getLockedCompaniesResponseBody = JSON.parse(await this.getLockedCompaniesResponse.text());
        logger.log('info', `Response GET ${this.linkGetCompanies} ` + JSON.stringify(this.getLockedCompaniesResponseBody, undefined, 4));
        this.attach(`Response GET ${this.linkGetCompanies} ` + JSON.stringify(this.getLockedCompaniesResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${this.linkGetCompanies} has status code ${this.getLockedCompaniesResponse.status()} ${this.getLockedCompaniesResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${this.linkGetCompanies} has status code ${this.getLockedCompaniesResponse.status()} ${this.getLockedCompaniesResponse.statusText()} and response body ${actualResponseText}`)
    }
});

Then('{} sets PUT api endpoint to unlock company', async function (actor: string) {
    link = `${Links.API_UNLOCK_COMPANY}/${this.companyKey}`;
});

Then(`{} sends a PUT request to unlock company`, async function (actor: string) {
    this.unlockCompanyResponse = this.response = await adminRequest.unlockCompany(this.request, link, this.getInformationCompanyResponseBody, this.headers);
    const responseBodyText = await this.unlockCompanyResponse.text();
    if (this.unlockCompanyResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBodyOfACompanyObject = this.unlockCompanyResponseBody = JSON.parse(await this.unlockCompanyResponse.text());
        logger.log('info', `Response PUT ${link}: ` + JSON.stringify(this.unlockCompanyResponseBody, undefined, 4));
        this.attach(`Response PUT ${link}: ` + JSON.stringify(this.unlockCompanyResponseBody, undefined, 4));
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.unlockCompanyResponse.status()} ${this.unlockCompanyResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.unlockCompanyResponse.status()} ${this.unlockCompanyResponse.statusText()} and response body ${actualResponseText}`);
    }
});

Then('{} checks whether company is locked or not', async function (actor: string) {
    expect(this.getLockedCompaniesResponseBody, `Get locked companies should be null`).toBeTruthy();
});