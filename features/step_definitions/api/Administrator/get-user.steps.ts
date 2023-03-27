import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as userRequest from '../../../../src/api/request/administration.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";

let randomUser: any;
let link: any;

Then(`{} sets GET api endpoint to get 20 users has just created`, async function (actor: string) {
    link = encodeURI(`${Links.API_ADMIN_GET_USER}offset=0&limit=20&sort=[{"field":"createdAt","direction":"desc"}]&where={"logic":"and","filters":[]}`);
});

Then('{} sends a GET request to get 20 latest users', async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.get20LatestUsersResponse = this.response = await userRequest.getUser(this.request, link, options);
    const responseBodyText = await this.get20LatestUsersResponse.text();
    if (this.get20LatestUsersResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.get20LatestUsersResponseBody = this.responseBody = JSON.parse(await this.response.text());
        // logger.log('info', `Response GET ${Links.API_ADMIN_GET_USER}` + JSON.stringify(this.responseBody.userId, undefined, 4));
        // this.attach(`Response GET ${Links.API_ADMIN_GET_USER}` + JSON.stringify(this.responseBody.userId, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${Links.API_ADMIN_GET_USER} has status code ${this.get20LatestUsersResponse.status()} ${this.get20LatestUsersResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${Links.API_ADMIN_GET_USER} has status code ${this.get20LatestUsersResponse.status()} ${this.get20LatestUsersResponse.statusText()} and response body ${actualResponseText}`)
    }
})

Then('{} picks random user in above response', async function (actor: string) {
    this.responseBodyOfAUserObject = randomUser = await this.responseBody[Math.floor(Math.random() * this.responseBody.length)];
    logger.log('info', `Random user: ${JSON.stringify(randomUser, undefined, 4)}`);
    this.attach(`Random user: ${JSON.stringify(randomUser, undefined, 4)}`);
})

Then('{} checks data type of password field in response of any user are correct', async function (actor: string) {
    //Check password 
    if (randomUser.password !== null) {
        expect(typeof (randomUser.password), 'Type of password value should be string').toBe("string");
    }
    else {
        expect(randomUser.password, 'password value should be null').toBeNull();
    }
})