import { When, Then, Given, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as adminRequest from '../../../../src/api/request/administration.service';
import * as registerRequest from '../../../../src/api/request/register.service';
import * as authenticateRequest from '../../../../src/api/request/authentication.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import * as arrayHelper from "../../../../src/helpers/array-helper";
import _ from "lodash";

let allUser: any;
let email: any;
let selectedUser: any;
let link: any;

Then(`{} sets DELETE api endpoint to delete user keys`, async function (actor: string) {
    link = Links.API_ADMIN_USER;
});

Then('Check {} exist in the system, if it does not exist will create user with same email', async function (email: string) {
    allUser = arrayHelper.flattenArray(this.get20LatestUsersResponseBody || [], 'data');
    const foundUser = allUser.find((element: { userId: any; }) => element.userId === email);
    console.log("Found User: ", foundUser);
    if (typeof foundUser == 'undefined') {
        this.payload = {
            firstName: 'Test',
            lastName: 'Auto',
            companyName: 'ITC-Company-Testing',
            companyType: 'ASC',
            phone: '0355025511',
            email: email,
            password: 'Test1111#',
        }
        this.registerResponse = await registerRequest.sendPOSTRegisterRequest(Links.API_REGISTER, this.payload);
        const registerStatusCode = this.registerResponse.status();
        if (registerStatusCode == 201) {
            this.registerResponseBody = JSON.parse(await this.registerResponse.text())
            logger.log('info', `Response Register User ${Links.API_REGISTER}` + JSON.stringify(this.registerResponseBody, undefined, 4));
            this.attach(`Response Register User ${Links.API_REGISTER}` + JSON.stringify(this.registerResponseBody, undefined, 4))
        }
        else {
            logger.log('info', `Response Register User ${Links.API_REGISTER} has status code ${registerStatusCode} ${this.registerResponse.statusText()} and response body` + await this.registerResponse.text());
            this.attach(`Response Register User ${Links.API_REGISTER} has status code ${registerStatusCode} ${this.registerResponse.statusText()} and response body` + await this.registerResponse.text());
        }

        // // Login Admin after check
        // this.payloadLogin = {
        //     username: 'may27pre@gmail.com',
        //     password: 'Test1111#',
        // }
        // this.loginResponse = await authenticateRequest.sendPOSTAuthenticateRequest(Links.API_LOGIN, this.payloadLogin);
        // if (this.loginResponse.status() == 201) {
        //     const responseHeaders = this.loginResponse.headers();
        //     this.cookieLogin = responseHeaders['set-cookie'];
        //     this.loginResponseBody = JSON.parse(await this.loginResponse.text())
        //     logger.log('info', 'Login with admin account to check new user is showed in the response of get all users');
        //     this.attach('Login with admin account to check new user is showed in the response of get all users');
        // }
        // //Get list users after register 
        // const options = {
        //     headers: {
        //         'Cookie': this.cookieLogin
        //     }
        // }

        // const endPointToGet20LatestUser = `${Links.API_ADMIN_GET_USER}offset=0&limit=20&sort=%5B%7B%22field%22:%22createdAt%22,%22direction%22:%22desc%22%7D%5D&where=%7B%22logic%22:%22and%22,%22filters%22:%5B%5D%7D`
        // this.get20LatestUsersResponse = await adminRequest.getUser(this.request, endPointToGet20LatestUser, options);
        // if (this.get20LatestUsersResponse.status() == 200) {
        //     this.get20LatestUsersResponseBody = JSON.parse(await this.get20LatestUsersResponse.text());
        //     expect(await this.get20LatestUsersResponseBody.length).toBeLessThanOrEqual(20);
        //     expect(this.get20LatestUsersResponseBody.map((user: any) => user.userId)).toContain(email);
        // }
        // else {
        //     logger.log('info', `Response Get 20 Users has status code ${this.get20LatestUsersResponse.status()} ${this.get20LatestUsersResponse.statusText()} and response body` + this.get20LatestUsersResponse.text());
        //     this.attach(`Response Get 20 Users has status code ${this.get20LatestUsersResponse.status()} ${this.get20LatestUsersResponse.statusText()} and response body` + this.get20LatestUsersResponse.text());
        // }
    }
})

Then('Login with admin account to check new user {} is showed in the response of get all users', async function (email: string) {
    // Login Admin after check
    this.payloadLogin = {
        username: 'may27pre@gmail.com',
        password: 'Test1111#',
    }
    this.loginResponse = await authenticateRequest.sendPOSTAuthenticateRequest(Links.API_LOGIN, this.payloadLogin);
    if (this.loginResponse.status() == 201) {
        const responseHeaders = this.loginResponse.headers();
        this.cookieLogin = responseHeaders['set-cookie'];
        this.loginResponseBody = JSON.parse(await this.loginResponse.text())
        logger.log('info', 'Login with admin account to check new user is showed in the response of get all users');
        this.attach('Login with admin account to check new user is showed in the response of get all users');
    }
    //Get list users after register 
    const options = {
        headers: {
            'Cookie': this.cookieLogin
        }
    }

    const endPointToGet20LatestUser = `${Links.API_ADMIN_GET_USER}offset=0&limit=20&sort=%5B%7B%22field%22:%22createdAt%22,%22direction%22:%22desc%22%7D%5D&where=%7B%22logic%22:%22and%22,%22filters%22:%5B%5D%7D`
    this.get20LatestUsersResponse = await adminRequest.getUser(this.request, endPointToGet20LatestUser, options);
    if (this.get20LatestUsersResponse.status() == 200) {
        this.get20LatestUsersResponseBody = JSON.parse(await this.get20LatestUsersResponse.text());
        expect(await this.get20LatestUsersResponseBody.length).toBeLessThanOrEqual(20);
        expect(this.get20LatestUsersResponseBody.map((user: any) => user.userId)).toContain(email);
    }
    else {
        logger.log('info', `Response Get 20 Users has status code ${this.get20LatestUsersResponse.status()} ${this.get20LatestUsersResponse.statusText()} and response body` + this.get20LatestUsersResponse.text());
        this.attach(`Response Get 20 Users has status code ${this.get20LatestUsersResponse.status()} ${this.get20LatestUsersResponse.statusText()} and response body` + this.get20LatestUsersResponse.text());
    }

})

Then('{} filters user to get user which has the email as {}', async function (actor, expectedEmail: string) {
    selectedUser = await this.get20LatestUsersResponseBody.find((us: any) => us.userId == expectedEmail)
    logger.log('info', `Response Body before filter: ${JSON.stringify(selectedUser.userId, undefined, 4)}`);
    this.attach(`Response Body before filter: ${JSON.stringify(selectedUser.userId, undefined, 4)}`);
    console.log("selectedUser.userId: ", selectedUser.userId);
    return this.userId = selectedUser.userId;
})

Then('{} sends a DELETE method to delete user {}', async function (actor, email: string) {
    const options = {
        headers: this.headers
    }

    var emailWantToDelete;
    if (email == '') {
        emailWantToDelete = selectedUser.userId;
    }
    else if (email != '') {
        emailWantToDelete = email.includes('random') ? this.randomEmail : email;
    }

    this.response = await adminRequest.deleteUser(this.request, Links.API_ADMIN_USER, emailWantToDelete, options);
    const responseBodyText = await this.response.text();
    logger.log('info', `Response Delete ${Links.API_ADMIN_USER} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
    this.attach(`Response Delete ${Links.API_ADMIN_USER} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`)
})

