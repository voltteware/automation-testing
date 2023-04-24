import { When, Then, Given, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as adminRequest from '../../../../src/api/request/administration.service';
import * as companyRequest from '../../../../src/api/request/company.service';
import logger from '../../../../src/Logger/logger';
import { faker } from '@faker-js/faker';
import { Links } from '../../../../src/utils/links';
import _, { endsWith } from "lodash";
import { payLoadCompany } from '../../../../src/utils/companyPayLoad';
import { addUserToCompanyResponseSchema } from '../assertion/administrator/userAssertionSchema';

Then('User sets POST api endpoint to {} company {} Admin with usernames {} and operation {}', async function (action: string, preposition: string, username: string, operation: string) {
    this.linkApiAddCompanyToAdmin = `${Links.API_USER}`
    
    this.addCompanyToAdminPayload = {
        "companyKey": `${this.companyKey}`,
        "companyName": `${this.companyName}`,
        "companyType": `${this.companyType}`,
        "operation": operation,
        "userId": username
    }

    logger.log('info', `Payload add to billing ${this.linkApiAddCompanyToAdmin}` + JSON.stringify(this.addCompanyToAdminPayload, undefined, 4));
    this.attach(`Payload add to billing ${this.linkApiAddCompanyToAdmin}` + JSON.stringify(this.addCompanyToAdminPayload, undefined, 4))
})

When('User sends a POST method to {} company {} Admin', async function (action: string, preposition: string) {
    this.response = this.addCompanyToAdminResponse = await adminRequest.addCompanyToAdminThenRemove(this.request, this.linkApiAddCompanyToAdmin, this.addCompanyToAdminPayload, this.headers);
    const responseBodyText = await this.addCompanyToAdminResponse.text();
    if (this.addCompanyToAdminResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.addCompanyToAdminResponseBody = JSON.parse(responseBodyText);   

        logger.log('info', `Response POST add company to admin ${this.linkApiAddCompanyToAdmin}` + JSON.stringify(this.responseBody, undefined, 4));
        this.attach(`Response POST add company to admin ${this.linkApiAddCompanyToAdmin}` + JSON.stringify(this.responseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response POST add company to admin ${this.linkApiAddCompanyToAdmin} has status code ${this.addCompanyToAdminResponse.status()} ${this.addCompanyToAdminResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response POST add company to admin ${this.linkApiAddCompanyToAdmin} has status code ${this.addCompanyToAdminResponse.status()} ${this.addCompanyToAdminResponse.statusText()} and response body ${actualResponseText}`)
    }
})

When('User verifies the above-mentioned company\'s existence in the Realm after {} successfully', async function (action: string) {
    let length = null;
    if(action == "adding"){
        length = 1;
    }
    else length = 0;
    const existCompany = await this.getRealmResponseBody.filter((co: any) => co.companyName.includes(this.companyName)).length;
    console.log("existCompany >>>>>>> ", existCompany);
    expect(existCompany).toEqual(length);
})

Then('{} checks API contract essential types in the response of {} company {} admin are correct', async function (actor: string, action: string, preposition: string) {
    addUserToCompanyResponseSchema.parse(this.responseBody)
})