import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as registerRequest from '../../../../src/api/request/register.service';
import * as adminRequest from '../../../../src/api/request/administration.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';

let link: any;
let registerResponseBody: any;

Given('User sets POST register service api endpoint', function () {
  link = Links.API_REGISTER;
  logger.log('info', `Link API: ${link}`)
});

When('User sets request body with payload as firstName: {string} and lastName: {string} and companyName: {string} and companyType: {string} and phone: {string} and email: {string} and password: {string}',
  async function (firstName: string, lastName: string, companyName: string, companyType: string, phone: string, email: string, password: string) {
    this.randomEmail = email;
    if (email.includes('<random>')) {
      this.randomEmail = email.replace('<random>', Date.now().toString())
    }

    this.payload = {
      firstName: firstName,
      lastName: lastName,
      companyName: companyName,
      companyType: companyType,
      phone: phone,
      email: this.randomEmail,
      password: password,
    }
    this.attach(`Payload: ${JSON.stringify(this.payload, undefined, 4)}`)
  });

Then('User sends a POST method to register account', async function () {
  this.response = await registerRequest.sendPOSTRegisterRequest(link, this.payload);
  const responseBodyText = await this.response.text();
  if (this.response.status() == 201) {
    const responseHeaders = this.response.headers();
    this.cookie = responseHeaders['set-cookie'];
    console.log('Cookie----------', this.cookie)
    this.responseBody = JSON.parse(await this.response.text())
    registerResponseBody = this.responseBody;

    logger.log('info', `Response ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${JSON.stringify(this.responseBody, undefined, 4)}`);
    this.attach(`Response ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${JSON.stringify(this.responseBody, undefined, 4)}`)
  }
  else {
    const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
    logger.log('info', `Response ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
    this.attach(`Response ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
  }
})

Given('User saves information of user just created', function () {
  this.userId = registerResponseBody.userId

  logger.log('info', `User id: ${this.userId}`)
  this.attach(`User id: ${this.userId}`)
});

Then('User sends a DELETE method to delete user just created', async function () {
  const options = {
    headers: this.headers
  }
  const email = registerResponseBody.userId;
  this.response = await adminRequest.deleteUser(this.request, Links.API_ADMIN_USER, email, options);
})