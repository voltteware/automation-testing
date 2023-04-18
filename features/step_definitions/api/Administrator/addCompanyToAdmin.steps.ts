import { When, Then, Given, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as adminRequest from '../../../../src/api/request/administration.service';
import * as companyRequest from '../../../../src/api/request/company.service';
import logger from '../../../../src/Logger/logger';
import { faker } from '@faker-js/faker';
import { Links } from '../../../../src/utils/links';
import _, { endsWith } from "lodash";
import { payLoadCompany } from '../../../../src/utils/companyPayLoad';
import { addUserToCompanyResponseSchema } from './userAssertionSchema';

let numberofCompanies: any;
let link: any;
let selectedCompany: any;
let randomCompany: any;
let payload: payLoadCompany = {};

Then('User sets POST api endpoint to add company to Admin has username {}', async function (username: string) {
    this.linkApiAddCompanyToAmdin = `${Links.API_USER}`
    
    this.addCompanyToAdminPayload = {
        "companyKey": `${this.companyKey}`,
        "companyName": `${this.companyName}`,
        "companyType": `${this.companyType}`,
        "operation": "addToCompany",
        "userId": username
    }

    logger.log('info', `Payload add to billing ${this.linkApiAddCompanyToAmdin}` + JSON.stringify(this.addCompanyToAdminPayload, undefined, 4));
    this.attach(`Payload add to billing ${this.linkApiAddCompanyToAmdin}` + JSON.stringify(this.addCompanyToAdminPayload, undefined, 4))
})

When('User sends a POST method to add company to Admin', async function () {
    this.response = this.addCompanyToAdminResponse = await adminRequest.addCompanyToAdmin(this.request, this.linkApiAddCompanyToAmdin, this.addCompanyToAdminPayload, this.headers);
    const responseBodyText = await this.addCompanyToAdminResponse.text();
    if (this.addCompanyToAdminResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.addCompanyToAdminResponseBody = JSON.parse(responseBodyText);   

        logger.log('info', `Response POST add company to admin ${this.linkApiAddCompanyToAmdin}` + JSON.stringify(this.responseBody, undefined, 4));
        this.attach(`Response POST add company to admin ${this.linkApiAddCompanyToAmdin}` + JSON.stringify(this.responseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response POST add company to admin ${this.linkApiAddCompanyToAmdin} has status code ${this.addCompanyToAdminResponse.status()} ${this.addCompanyToAdminResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response POST add company to admin ${this.lilinkApiAddCompanyToAmdinnk} has status code ${this.addCompanyToAdminResponse.status()} ${this.addCompanyToAdminResponse.statusText()} and response body ${actualResponseText}`)
    }
})

When('User checks company that just added above exists in Realm', async function () {
    const existCompany = await this.getRealmResponseBody.filter((co: any) => co.companyName.includes(this.companyName)).length;
    console.log("existCompany >>>>>>> ", existCompany);
    expect(existCompany).toEqual(1);
})

Then('{} checks API contract essential types in the response of add company to admin are correct', async function (actor: string) {
    console.log("responseBody:sgdhfgj: ", this.responseBody);
    addUserToCompanyResponseSchema.parse(this.responseBody)
})