import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as adminRequest from '../../../../src/api/request/administration.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { changeRoleResponseSchema } from '../assertion/administrator/changeRoleAssertionSchema';

Then('{} sets PUT api endpoint to change {} to {} role', async function (actor: string, role1: string, role: string) {
    let isAdmin;
    this.linkApiChangeRoleToAdminThenRemove = `${Links.API_ADMIN_USER}${this.userId}`

    if(role == "admin") {
        isAdmin = true;
    }
    else isAdmin =  false;
    
    this.changeRoleToAdminThenRemovePayload = {
        "userId": this.userId,
        "isAdmin": isAdmin,
        "isRestrictAddCSV": false
    }

    logger.log('info', `Payload change user to admin role then remove ${this.linkApiChangeRoleToAdminThenRemove}` + JSON.stringify(this.changeRoleToAdminThenRemovePayload, undefined, 4));
    this.attach(`Payload change user to admin role then remove ${this.linkApiChangeRoleToAdminThenRemove}` + JSON.stringify(this.changeRoleToAdminThenRemovePayload, undefined, 4))
})

When('{} sends a PUT method to change {} to {} role', async function (actor: string, role1: string, role: string) {
    this.response = this.changeRoleToAdminThenRemoveResponse = await adminRequest.changeRoleToAdminThenRemove(this.request, this.linkApiChangeRoleToAdminThenRemove, this.changeRoleToAdminThenRemovePayload, this.headers);
    const responseBodyText = await this.changeRoleToAdminThenRemoveResponse.text();
    if (this.changeRoleToAdminThenRemoveResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.changeRoleToAdminThenRemoveResponseBody = JSON.parse(responseBodyText);   

        logger.log('info', `Response PUT change user to admin role then remove ${this.linkApiChangeRoleToAdminThenRemove}` + JSON.stringify(this.responseBody, undefined, 4));
        this.attach(`Response PUT change user to admin role then remove ${this.linkApiChangeRoleToAdminThenRemove}` + JSON.stringify(this.responseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response PUT change user to admin role then remove ${this.linkApiChangeRoleToAdminThenRemove} has status code ${this.changeRoleToAdminThenRemoveResponse.status()} ${this.changeRoleToAdminThenRemoveResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response PUT change user to admin role then remove ${this.linkApiChangeRoleToAdminThenRemove} has status code ${this.changeRoleToAdminThenRemoveResponse.status()} ${this.changeRoleToAdminThenRemoveResponse.statusText()} and response body ${actualResponseText}`)
    }
})

When('{} checks that Admin status is {}', async function (actor: string, status: string) {
    let isAdmin;
    if(status == "true"){
        isAdmin = true;
    }
    else isAdmin = false;
    const adminStatus = this.responseBody.model[0].isAdmin;
    console.log("adminStatus >>>>>>> ", adminStatus);
    expect(adminStatus).toEqual(isAdmin);
})

Then('{} checks API contract essential types in the response of change {} to {} role are correct', async function (actor: string, role1: string, role: string) {
    changeRoleResponseSchema.parse(this.responseBody)
})