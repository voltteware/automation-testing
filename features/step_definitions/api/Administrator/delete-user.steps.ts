import { When, Then, Given, DataTable } from '@cucumber/cucumber';
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
    if (typeof foundUser == 'undefined') {
        this.payload = {
            firstName: 'Test',
            lastName: 'Auto',
            companyName: 'ITC-Company-Testing',
            companyType: 'ASC',
            phone: '0355025511',
            email: 'testauto@gmail.com',
            password: 'Test1111!',
        }
        this.registerResponse = await registerRequest.sendPOSTRegisterRequest(Links.API_REGISTER, this.payload);
        this.registerResponseBody = JSON.parse(await this.registerResponse.text())
        // Login Admin after check
        this.payloadLogin = {
            username: 'may27pre@gmail.com',
            password: 'Test1111!',
        }
        this.loginResponse = await authenticateRequest.sendPOSTAuthenticatieRequest(Links.API_LOGIN, this.payloadLogin);
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

Then('Check email exist in the system, if it does not exist will create user with below email', async function (dataTable: DataTable) {
    var email: string = dataTable.hashes()[0].email

    allUser = arrayHelper.flattenArray(getUsersResponseBody, 'data');
    const foundUser = allUser.find((element: { userId: any; }) => element.userId === email);
    if (typeof foundUser == 'undefined') {
        this.payload = {
            firstName: 'Test',
            lastName: 'Auto',
            companyName: 'ITC-Company-Testing',
            companyType: 'ASC',
            phone: '0355025511',
            email: email,
            password: 'Test1111!',
        }
        this.registerResponse = await registerRequest.sendPOSTRegisterRequest(Links.API_REGISTER, this.payload);
        this.registerResponseBody = JSON.parse(await this.registerResponse.text())
        // Login Admin after check
        this.payloadLogin = {
            username: 'may27pre@gmail.com',
            password: 'Test1111!',
        }
        this.loginResponse = await authenticateRequest.sendPOSTAuthenticatieRequest(Links.API_LOGIN, this.payloadLogin);
        if (this.loginResponse.status() == 201) {
            const responseHeaders = this.loginResponse.headers();
            this.cookieLogin = responseHeaders['set-cookie'];
            this.loginResponseBody = JSON.parse(await this.loginResponse.text())
        }
        //Get list users after register 
        const options = {
            headers: this.cookieLogin
        }

        const endPointToGet100LatestUser = `${Links.API_ADMIN_GET_USER}offset=0&limit=100&sort=%5B%7B%22field%22:%22createdAt%22,%22direction%22:%22desc%22%7D%5D&where=%7B%22logic%22:%22and%22,%22filters%22:%5B%5D%7D`
        getUsersResponse = await adminRequest.getUser(this.request, endPointToGet100LatestUser, options);
        if (getUsersResponse.status() == 200) {
            getUsersResponseBody = JSON.parse(await getUsersResponse.text());
            expect(await getUsersResponseBody.length).toEqual(100);
        }
    }
})

// Then('{} filters user to get user which he has the email', async function (actor: string) {
//     selectedUser = await getUsersResponseBody.find((us: any) => us.userId == `testauto@gmail.com`)
//     logger.log('info', `Response Body before filter: ${JSON.stringify(selectedUser, undefined, 4)}`);
//     this.attach(`Response Body before filter: ${JSON.stringify(selectedUser, undefined, 4)}`);
// })

Then('{} filters user to get user which has the email as {}', async function (actor, expectedEmail: string) {
    selectedUser = await getUsersResponseBody.find((us: any) => us.userId == expectedEmail)
    logger.log('info', `Response Body before filter: ${JSON.stringify(selectedUser, undefined, 4)}`);
    this.attach(`Response Body before filter: ${JSON.stringify(selectedUser, undefined, 4)}`);
})

// Then('{} sends a DELETE method to delete user', async function (actor: string) {
//     const options = {
//         headers: this.headers
//     }
//     email = selectedUser.userId;
//     this.response = await adminRequest.deleteUser(this.request, Links.API_ADMIN_DELETE_USER, email, options);
//     deleteUsersResponseBody = JSON.parse(await this.response.text());
// })

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

    this.response = await adminRequest.deleteUser(this.request, Links.API_ADMIN_DELETE_USER, emailWantToDelete, options);
    deleteUsersResponseBody = JSON.parse(await this.response.text());
})

