import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as adminRequest from '../../../../src/api/request/administration.service';
import * as registerRequest from '../../../../src/api/request/register.service';
import * as authenticateRequest from '../../../../src/api/request/authentication.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import * as arrayHelper from "../../../../src/helpers/array-helper";
import _ from "lodash";

let getUsersResponse: any;
let getUsersResponseBody: any;
let deleteUsersResponseBody: any;
let allUser: any;
let email: any;
let selectedUser: any;
let link: any;

Then(`{} sets DELETE api endpoint to delete user keys`, async function (actor: string) {
    link = Links.API_ADMIN_DELETE_USER;
});

Then(`{} send request GET to get users keys`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    getUsersResponse = await adminRequest.getUser(this.request, Links.API_ADMIN_GET_USER, options);
    if (getUsersResponse.status() == 200) {
        getUsersResponseBody = JSON.parse(await getUsersResponse.text());
    }
});

Then('Check email exist in the system, if it does not exist will create user with email <testauto@gmail.com>', async function () {
    allUser = arrayHelper.flattenArray(getUsersResponseBody, 'data');
    const foundUser = allUser.find((element: { userId: any; }) => element.userId === `testauto@gmail.com`);
    if(typeof foundUser == 'undefined'){
        this.payload = {
            firstName: 'Test',
            lastName: 'Auto',
            companyName: 'ITC-Company-Testing',
            companyType: 'ASC',
            phone: '0355025511',
            email: 'testauto@gmail.com',
            password: 'Test1111!',
        }
        this.registerResponse = await registerRequest.sendPOSTRegisterRequest(this.request, Links.API_REGISTER, this.payload);
        this.registerResponseBody = JSON.parse(await this.registerResponse.text())
        // Login Admin after check
        this.payloadLogin = {
            username: 'may27pre@gmail.com',
            password: 'Test1111!',
          }
        this.loginResponse = await authenticateRequest.sendPOSTAuthenticatieRequest(this.request, Links.API_LOGIN, this.payloadLogin);
        if (this.loginResponse.status() == 201) {
            const responseHeaders = this.loginResponse.headers();
            this.cookieLogin = responseHeaders['set-cookie'];
            this.loginResponseBody = JSON.parse(await this.loginResponse.text())
        }
        //Get list users after register 
        const options = {
            headers: this.cookieLogin
        }
        getUsersResponse = await adminRequest.getUser(this.request, Links.API_ADMIN_GET_USER, options);
        if (getUsersResponse.status() == 200) {
            getUsersResponseBody = JSON.parse(await getUsersResponse.text());
        }
    }
})

Then('{} filters user to get user which he has the email', async function (actor: string) {
    selectedUser = await getUsersResponseBody.find((us: any) => us.userId == `testauto@gmail.com`)
    logger.log('info', `Response Body before filter: ${JSON.stringify(selectedUser, undefined, 4)}`);
    this.attach(`Response Body before filter: ${JSON.stringify(selectedUser, undefined, 4)}`);
})

Then('{} sends a DELETE method to delete user', async function (actor: string) {
    const options = {
      headers: this.headers
    }
    email = selectedUser.userId;
    this.response = await adminRequest.deleteUser(this.request, Links.API_ADMIN_DELETE_USER, email, options);
    deleteUsersResponseBody = JSON.parse(await this.response.text());
})

