import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as userRequest from '../../../../src/api/request/user.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";

let payload: any;
let userID: any;
let randomCompany: any;
let link: any;

Then(`{} sets GET api endpoint to get company keys`, async function (actor: string) {
    link = Links.API_REALM;
});

Then('{} sends a GET request to get company keys', async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.response = await userRequest.getRealm(this.request, link, options);
    if (this.response.status() == 200) {
        this.responseBody = JSON.parse(await this.response.text());
        logger.log('info', `Response GET ${Links.API_REALM}` + JSON.stringify(this.responseBody, undefined, 4));
        this.attach(`Response GET ${Links.API_REALM}` + JSON.stringify(this.responseBody, undefined, 4))
    }
})

Then('{} picks random company in above response', async function (actor: string) {
    randomCompany = await this.responseBody[Math.floor(Math.random() * this.responseBody.length)];
    logger.log('info', `Random company: ${JSON.stringify(randomCompany, undefined, 4)}`);
    this.attach(`Random company: ${JSON.stringify(randomCompany, undefined, 4)}`);
})

Then('{} checks data type of values in random company object are correct', async function (actor: string) {
    // Check companyType
    expect(typeof (randomCompany.companyType), 'Type of companyType value should be string').toBe("string");
    // Check companyKey is string 
    expect(typeof (randomCompany.companyKey), 'Type of companyKey value should be string').toBe("string");
    // Check userId.
    expect(typeof (randomCompany.userId), 'Type of userId value should be string').toBe("string");
    // Check companyName
    expect(typeof (randomCompany.companyName), 'Type of companyName value should be string').toBe("string");
    // Check created_at
    expect(Date.parse(randomCompany.created_at), 'Created_at in response should be date').not.toBeNaN();
    // Check updated_at
    expect(Date.parse(randomCompany.updated_at), 'updated_at in response should be date').not.toBeNaN();
})

Then('{} checks {} and other values in response of random company are correct', async function (actor, userId: string) {
    const companyType = ['ASC', 'CSV', 'QBFS', 'QBO'];
    expect(companyType, `Company Type should be one of ${companyType}`).toContain(randomCompany.companyType);
    expect(randomCompany.companyKey).not.toBeNaN();
    expect(randomCompany.userId).toBe(userId);
    expect(randomCompany.companyName).not.toBeNaN();
})



