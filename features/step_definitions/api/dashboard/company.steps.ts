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
    const responseBodyText = await this.getRealmResponse.text();
    if (this.getRealmResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getRealmResponseBody = JSON.parse(await this.getRealmResponse.text());
        // logger.log('info', `Response GET ${Links.API_REALM}` + JSON.stringify(this.getRealmResponseBody, undefined, 4));
        // this.attach(`Response GET ${Links.API_REALM}` + JSON.stringify(this.getRealmResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.getRealmResponse.status()} ${this.getRealmResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.getRealmResponse.status()} ${this.getRealmResponse.statusText()} and response body ${actualResponseText}`)
    }
})

Then('{} picks random company in above response', async function (actor: string) {
    this.randomCompany = await this.getRealmResponseBody[Math.floor(Math.random() * this.getRealmResponseBody.length)];
    logger.log('info', `Random company: ${JSON.stringify(this.randomCompany, undefined, 4)}`);
    this.attach(`Random company: ${JSON.stringify(this.randomCompany, undefined, 4)}`);
    this.companyKey = this.randomCompany.companyKey;
    this.companyType = this.randomCompany.companyType;
    logger.log('info', `companyKey: ${this.companyKey}`);
    this.attach(`COMPANY KEY: ${this.companyKey}`);
    logger.log('info', `companyType: ${this.companyType}`);
    this.attach(`COMPANY TYPE: ${this.companyType}`);
})

Then('{} picks company with type {} in above response', async function (actor, companyType: string) {
    this.selectedCompany = await this.getRealmResponseBody.find((co: any) => co.companyType == companyType)
    logger.log('info', `Company which has type ${companyType}: ${JSON.stringify(this.selectedCompany, undefined, 4)}`);
    this.attach(`Company which has type ${companyType}: ${JSON.stringify(this.selectedCompany, undefined, 4)}`);
    this.companyKey = this.selectedCompany.companyKey;
    this.companyType = this.selectedCompany.companyType;
    logger.log('info', `companyKey: ${this.companyKey}`);
    this.attach(`COMPANY KEY: ${this.companyKey}`);
    logger.log('info', `companyType: ${this.companyType}`);
    this.attach(`COMPANY TYPE: ${this.companyType}`);
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
    link = `${Links.API_UPDATE_COMPANY}${this.companyKey}`;
});

When(`{} sends a GET request to get company information of {} by company key`, async function (actor, email: string) {
    const options = {
        headers: this.headers
    }

    this.getCompanyInfoResponse = this.response = await companyRequest.getCompanyInfo(this.request, link, options);
    const responseBodyText = await this.getCompanyInfoResponse.text();
    if (this.getCompanyInfoResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBodyOfACompanyObject = JSON.parse(await this.getCompanyInfoResponse.text());
        logger.log('info', `Response GET ${link}` + JSON.stringify(this.responseBodyOfACompanyObject, undefined, 4));
        this.attach(`Response GET ${link}` + JSON.stringify(this.responseBodyOfACompanyObject, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.getCompanyInfoResponse.status()} ${this.getCompanyInfoResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.getCompanyInfoResponse.status()} ${this.getCompanyInfoResponse.statusText()} and response body ${actualResponseText}`)
    }
})

Then('{} checks {} and other values in response of random company are correct', async function (actor, userId: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(this.randomCompany.companyType);
    expect(this.randomCompany.companyKey).not.toBeNull();
    expect(this.randomCompany.userId).toBe(userId);
    expect(this.randomCompany.companyName).not.toBeNull();
})

Then('{} checks that the lastForecastDate field was updated in company detail information after running forecast', { timeout: 20 * 60 * 1000 }, async function (actor: string) {
    const linkGetCompanyInfo = `${Links.API_GET_COMPANY}/${this.companyKey}`;
    const options = {
        headers: this.headers
    }
    const beforeForecastDate = Date.parse(this.lastForecastDate);
    logger.log('info', `Before Last Forecast Date: >>>>>>` + beforeForecastDate);
    this.attach(`Before Last Forecast Date: >>>>>>` + beforeForecastDate);

    await expect.poll(async () => {
        const getCompanyInfoResponse = await companyRequest.getCompanyInfo(this.request, linkGetCompanyInfo, options);
        const getCompanyInfoResponseBody = JSON.parse(await getCompanyInfoResponse.text());
        const lastForecastDateAfterRunningForecast = Date.parse(getCompanyInfoResponseBody.lastForecastDate);
        console.log(`last Forecast Date After Running Forecast is: >>>>>>`, lastForecastDateAfterRunningForecast);
        logger.log('info', `last Forecast Date After Running Forecast is is: >>>>>>` + lastForecastDateAfterRunningForecast);
        this.attach(`llast Forecast Date After Running Forecast is: >>>>>>` + lastForecastDateAfterRunningForecast);
        return lastForecastDateAfterRunningForecast;
    }, {
        // Custom error message, optional.
        message: `make sure Last Forecast Date is after the moment user clicks Run Forecast`, // custom error message
        // Probe, wait 1s, probe, wait 2s, probe, wait 10s, probe, wait 10s, probe, .... Defaults to [100, 250, 500, 1000].
        intervals: [5_000, 10_000, 20_000],
        timeout: 15 * 60 * 1000,
    }).toBeGreaterThan(beforeForecastDate);
})