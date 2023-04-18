import { When, Then, Given, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as adminRequest from '../../../../src/api/request/administration.service';
import * as companyRequest from '../../../../src/api/request/company.service';
import logger from '../../../../src/Logger/logger';
import { faker } from '@faker-js/faker';
import { Links } from '../../../../src/utils/links';
import _, { endsWith } from "lodash";
import { payLoadCompany } from '../../../../src/utils/companyPayLoad';
import { renewTrialSchema } from '../assertion/administrator/adminAssertionSchema';

let numberofCompanies: any;
let link: any;
let selectedCompany: any;
let randomCompany: any;
let payload: payLoadCompany = {};

Then('User sets POST api endpoint to renew trial', async function () {
    this.linkApiRenewTrial = `${Links.API_ADMIN_EXTEND_TRIAL}/${this.customerId}`
    
    this.renewTrialPayload = {
        "companyKey": `${this.companyKey}`,
        "companyName": `${this.companyName}`,
        "companyType": `${this.companyType}`,
        "subscriptionId": null,
    }

    logger.log('info', `Payload add to billing ${this.linkApiRenewTrial}` + JSON.stringify(this.renewTrialPayload, undefined, 4));
    this.attach(`Payload add to billing ${this.linkApiRenewTrial}` + JSON.stringify(this.renewTrialPayload, undefined, 4))
})

When('User sends a POST method to renew trial', async function () {
    this.response = this.renewTrialResponse = await adminRequest.renewTrial(this.request, this.linkApiRenewTrial, this.renewTrialPayload, this.headers);
    const responseBodyText = await this.renewTrialResponse.text();
    if (this.renewTrialResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.renewTrialResponseBody = JSON.parse(responseBodyText);   

        logger.log('info', `Response POST renew Trial ${this.linkApiRenewTrial}` + JSON.stringify(this.responseBody, undefined, 4));
        this.attach(`Response POST renew Trial ${this.linkApiRenewTrial}` + JSON.stringify(this.responseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response POST renew Trial ${this.linkApiRenewTrial} has status code ${this.renewTrialResponse.status()} ${this.renewTrialResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response POST renew Trial ${this.lilinkApiRenewTrialnk} has status code ${this.renewTrialResponse.status()} ${this.renewTrialResponse.statusText()} and response body ${actualResponseText}`)
    }
})

Then('User checks the status of company that just renewed trial is Trialing', async function () {
    expect(this.responseBody.status).toEqual('trialing');
})

When('User checks API contract essential types in the response of renew trial are correct', async function () {
    renewTrialSchema.parse(this.responseBody);
})