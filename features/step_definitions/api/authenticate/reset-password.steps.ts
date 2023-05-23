import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as resetPasswordRequest from '../../../../src/api/request/authentication.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';

let link: any;

Given('{} sets GET reset password service api endpoint', function (actor: string) {
    link = Links.API_USERS_RESET_PASSWORD;
    logger.log('info', `Link API: ${link}`)
});

Then('{} sends a GET request to reset password keys with email {}', async function (actor: string, email: string) {
    this.response = await resetPasswordRequest.resetPassword(this.request, link, email);
    const responseBodyText = await this.response.text();
    if (this.response.status() == 201) {
        this.responseBody = JSON.parse(await this.response.text());
        logger.log('info', `Response GET ${Links.API_USERS_RESET_PASSWORD}` + JSON.stringify(this.responseBody, undefined, 4));
        this.attach(`Response GET ${Links.API_USERS_RESET_PASSWORD} \n` + JSON.stringify(this.responseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${Links.API_USERS_RESET_PASSWORD} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${Links.API_USERS_RESET_PASSWORD} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
})

Then('{} checks values in response body return are correct: {}', async function (actor, email: string) {
    const textExpect = `An e-mail has been sent to ${email} with further instructions.`
    expect(this.responseBody).toBe(textExpect);
})