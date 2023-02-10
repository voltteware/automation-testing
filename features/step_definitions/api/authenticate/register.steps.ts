import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as registerRequest from '../../../../src/api/request/register.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';

let link: any;

Given('User sets POST register service api endpoint', function () {
    link = Links.API_REGISTER;
    logger.log('info', `Link API: ${link}`)
});

When('User sets request body with payload as firstName: {string} and lastName: {string} and companyName: {string} and companyType: {string} and phone: {string} and email: {string} and password: {string}',
 async function (firstName: string, lastName: string, companyName: string, companyType: string, phone: string, email: string, password: string) {
  this.payload = {
    firstName: firstName,
    lastName: lastName,
    companyName: companyName,
    companyType: companyType,
    phone: phone,
    email: email,
    password: password,
  }
  this.attach(`Payload: ${JSON.stringify(this.payload, undefined, 4)}`)
});

Then('User sends a POST method to authenticate account', async function () {
  this.response = await registerRequest.sendPOSTRegisterRequest(this.request, link, this.payload);
  if (this.response.status() == 201) {
    const responseHeaders = this.response.headers();
    this.cookie = responseHeaders['set-cookie'];
    console.log('Cookie----------', this.cookie)
    this.responseBody = JSON.parse(await this.response.text())
    // logger.log('info', 'Response Body:\n' + JSON.stringify(this.responseBody, undefined, 4))
    // this.attach(JSON.stringify(this.responseBody, undefined, 4))
    this.registerResponseBody = this.responseBody
  }
})

