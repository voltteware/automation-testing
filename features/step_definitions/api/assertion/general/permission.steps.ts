import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

//Check error if no token in request
Then('Check error no token in request, status is {int}', async function (statusCode) {
    expect(this.response.status()).toBe(statusCode);
});

Then('Check error no token in request, data type of values in the response is correct', async function () {
    expect(typeof (this.responseBody.message), 'Type of message value should be string').toBe("string");
    expect(typeof (this.responseBody.success), 'Type of success value should be boolean').toBe("boolean");
});

Then('Check error no token in request, response values success={string},message={string} are correct', function (successStatus, errorMessage) {
    expect(this.responseBody.message, `In response body, error message value should be: ${errorMessage}`).toContain(errorMessage);
    expect(this.responseBody.success.toString(), 'In response body, success value should be false').toBe(successStatus);
});

//Check error no permission
Then('Check error no permission, response status is {int}', async function (statusCode) {
    expect(this.response.status()).toBe(statusCode);
});


Then('Check error no permission, data type of values in the response is correct', async function () {
    expect(typeof (this.responseBody.message), 'Type of message value should be string').toBe("string");
    expect(typeof (this.responseBody.success), 'Type of success value should be boolean').toBe("boolean");
});

Then('Check error no permission, response values success={string},message={string} are correct', async function (successStatus, errorMessage) {
    expect(this.responseBody.message, `In response body, error message value should be: ${errorMessage}`).toContain(errorMessage);
    expect(this.responseBody.success.toString(), 'In response body, success value should be false').toBe(successStatus);
});

//I check error invalid/expired Token
Then('{} check error {} Token, Response status is {int}', async function (any, tokenType, statusCode) {
    expect(this.response.status()).toBe(statusCode);
});

Then('Check error {} Token, data type of values in the response is correct', async function (any) {
    expect(typeof (this.responseBody.message), 'Type of message value should be string').toBe("string");
    expect(typeof (this.responseBody.success), 'Type of success value should be boolean').toBe("boolean");
});

Then('Check error {} Token, response values success={string}, message={string} are correct', async function (any, successStatus, errorMessage) {
    expect(this.responseBody.message, `In response body, error message value should be: ${errorMessage}`).toContain(errorMessage);
    expect(this.responseBody.success.toString(), 'In response body, success value should be false').toBe(successStatus);
});