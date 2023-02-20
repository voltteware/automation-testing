import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as companyRequest from '../../../../src/api/request/company.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import exp from 'constants';

let companyType: any;
let companyKey: any;
let link: any;

Then(`{} sets GET api endpoint to get company keys`, async function (actor: string) {
    link = Links.API_REALM;
});

Then('{} sends a GET request to get company keys', async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getRealmResponse = this.response = await companyRequest.getRealm(this.request, link, options);
    if (this.getRealmResponse.status() == 200) {
        this.getRealmResponseBody = JSON.parse(await this.getRealmResponse.text());
        // logger.log('info', `Response GET ${Links.API_REALM}` + JSON.stringify(this.getRealmResponseBody, undefined, 4));
        // this.attach(`Response GET ${Links.API_REALM}` + JSON.stringify(this.getRealmResponseBody, undefined, 4))
    }
})

Then('{} picks random company in above response', async function (actor: string) {
    this.randomCompany = await this.getRealmResponseBody[Math.floor(Math.random() * this.getRealmResponseBody.length)];
    logger.log('info', `Random company: ${JSON.stringify(this.randomCompany, undefined, 4)}`);
    this.attach(`Random company: ${JSON.stringify(this.randomCompany, undefined, 4)}`);
})

Then('{} checks API contract types in random company object are correct', async function (actor: string) {
    // Check companyType
    expect(typeof (this.randomCompany.companyType), 'Type of companyType value should be string').toBe("string");
    // Check companyKey is string 
    expect(typeof (this.randomCompany.companyKey), 'Type of companyKey value should be string').toBe("string");
    // Check userId.
    expect(typeof (this.randomCompany.userId), 'Type of userId value should be string').toBe("string");
    // Check companyName
    expect(typeof (this.randomCompany.companyName), 'Type of companyName value should be string').toBe("string");
    // Check created_at
    expect(Date.parse(this.randomCompany.created_at), 'Created_at in response should be date').not.toBeNull();
    // Check updated_at
    expect(Date.parse(this.randomCompany.updated_at), 'updated_at in response should be date').not.toBeNull();
})

Then('{} checks {} and other values in response of random company are correct', async function (actor, userId: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.randomCompany.companyType);
    expect(this.randomCompany.companyKey).not.toBeNull();
    expect(this.randomCompany.userId).toBe(userId);
    expect(this.randomCompany.companyName).not.toBeNull();
})

Then(`{} sets GET api endpoint to get information of a company belongs to {} using company key {}`, async function (actor, email, company: string) {
    if (company == 'random') {
        this.selectedCompany = this.randomCompany;
    }
    else {
        this.selectedCompany = this.getRealmResponseBody.find((co: any) => co.companyKey == company);
    }

    logger.log('info', `Selected company of account ${email}: ${JSON.stringify(this.selectedCompany, undefined, 4)}`);
    this.attach(`Selected company of account ${email}: ${JSON.stringify(this.selectedCompany, undefined, 4)}`);

    this.companyKey = this.selectedCompany.companyKey;
    this.companyType = this.selectedCompany.companyType;
    logger.log('info', `companyKey: ${this.companyKey}`);
    this.attach(`COMPANY KEY: ${this.companyKey}`);
    logger.log('info', `companyType: ${this.companyType}`);
    this.attach(`COMPANY TYPE: ${this.companyType}`);
    link = `${Links.API_COMPANY}${this.companyKey}`;
});

When(`{} sends a GET request to get company information of {} by company key`, async function (actor, email: string) {
    const options = {
        headers: this.headers
    }
    // console.log(this.request.headers())
    this.getCompanyInfoResponse = this.response = await companyRequest.getCompanyInfo(this.request, link, options);
    if (this.response.status() == 200) {
        this.responseBodyOfACompanyObject = JSON.parse(await this.getCompanyInfoResponse.text());
        logger.log('info', `Response GET ${link}` + JSON.stringify(this.responseBodyOfACompanyObject, undefined, 4));
        this.attach(`Response GET ${link}` + JSON.stringify(this.responseBodyOfACompanyObject, undefined, 4))
    }
})