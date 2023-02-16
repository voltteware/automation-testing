import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as adminRequest from '../../../../src/api/request/administration.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";

let getUsersResponse: any;
let getUsersResponseBody: any;
let deleteUsersResponseBody: any;
let email: any;
let selectedUser: any;
let link: any;

Then(`{} sets DELETE api endpoint to delete user keys`, async function (actor: string) {
    link = Links.API_ADMIN_GET_COMPANIES;
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

Then('{} filters user to get user which he has the email', async function (actor: string) {
    selectedUser = await getUsersResponseBody.find((us: any) => us.userId == `testauto@gmail.com`)
    logger.log('info', `Response Body before filter: ${JSON.stringify(selectedUser, undefined, 4)}`);
    this.attach(`Response Body before filter: ${JSON.stringify(selectedUser, undefined, 4)}`);
})

Then('{} sends a DELETE method to delete user', async function (actor: string) {
    const options = {
      headers: this.headers
    }
    if(selectedUser != null){
        email = selectedUser.userId;
        this.response = await adminRequest.deleteUser(this.request, Links.API_ADMIN_DELETE_USER, email, options);
        deleteUsersResponseBody = JSON.parse(await this.response.text());
    }else{
        logger.log('info', `User not exist in list`);
    }
})

