import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as authenticateRequest from '../../../../src/api/request/authentication.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';

let link: any;
let email: string;
let password: string;

Given('Nancy sets POST login service api endpoint', function () {
  link = Links.API_LOGIN;
  logger.log('info', `Link API: ${link}`)
});

Then('She sends POST requests with payload incorrect email format and check status code, message, success are correct', async function (dataTable) {
  var dataTableHashes = dataTable.hashes();
  for (var index in dataTableHashes) {
    email = dataTableHashes[index].email
    password = dataTableHashes[index].password
    this.payload = {
      email: email,
      password: password,
    };

    //Send POST login request
    this.response = await authenticateRequest.sendPOSTAuthenticateRequest(link, this.payload)
    this.attach(JSON.stringify(this.payload, undefined, 4))

    this.responseBody = JSON.parse(await this.response.text());
    // logger.log('info', 'Response Body:\n' + JSON.stringify(this.responseBody, undefined, 4))
    // this.attach(JSON.stringify(this.responseBody, undefined, 4))

    // Check status code
    var statusCode = Number(dataTableHashes[index].statusCode)
    expect(this.response.status()).toBe(statusCode)

    // Check error message    
    var message = dataTableHashes[index].expectedMessage
    expect(this.responseBody).toHaveProperty('message')
    expect(typeof (this.responseBody.message)).toBe('string')
    expect(this.responseBody.message, `In response body, error message value should be: ${message}`).toContain(message)

    // Check success is false    
    var success = dataTableHashes[index].expectedSuccess
    expect(this.responseBody).toHaveProperty('success')
    expect(typeof (this.responseBody.success)).toBe('boolean')
    expect(this.responseBody.success.toString()).toBe(success);
  }
});

When('She sets request body with payload as email: {string} and passowrd: {string}', async function (email: string, password: string) {
  this.payload = {
    username: email,
    password: password,
  }
  this.attach(`Payload: ${JSON.stringify(this.payload, undefined, 4)}`)
});

Then('She sends a POST method to authenticate account', async function () {
  this.response = await authenticateRequest.sendPOSTAuthenticateRequest(link, this.payload);
  if (this.response.status() == 201) {
    const responseHeaders = this.response.headers();
    this.cookie = responseHeaders['set-cookie'];
    console.log('Cookie----------', this.cookie)
    this.responseBody = JSON.parse(await this.response.text())
    // logger.log('info', 'Response Body:\n' + JSON.stringify(this.responseBody, undefined, 4))
    // this.attach(JSON.stringify(this.responseBody, undefined, 4))
    this.authenticateResponseBody = this.responseBody
  }
})

Then('The success value should be {string}', function (success: string) {
  if (success == 'false') {
    expect(this.responseBody).toHaveProperty('success')
    expect(typeof (this.responseBody.success)).toBe('boolean')
    expect(this.responseBody.success).toBeFalsy()
  }
});