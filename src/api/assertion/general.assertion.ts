import { test, expect } from '@playwright/test';
import _ from "lodash";

async function checkValueOfSuccessKeyInResponseIsFail(response: any) {
    const responseBody = JSON.parse(await response.text());
    console.log(`Response Body: `, responseBody);
    await test.step(`Response status is 200`, async () => {
        expect(response.status()).toBe(200);
    });

    await test.step('Data type of values in the response is correct', async () => {
        expect(typeof (responseBody.success), 'Type of success should be boolean').toBe("boolean");
    });

    await test.step('Value of success key should be false', async () => {
        expect(responseBody.success, 'In response body, success value should be false').toBeFalsy();
    });
}

async function checkValueOfSuccessKeyInResponseIsTrue(response: any) {
    const responseBody = JSON.parse(await response.text());
    console.log(`Response Body: `, responseBody);
    await test.step('Response status is 200', async () => {
        expect(response.status()).toBe(200);
      });
  
      await test.step('Json format is correct', async () => {
        expect(typeof (responseBody.success), 'Type of success value should be boolean').toBe("boolean");
      });
  
      await test.step('Response values are correct', async () => {
        expect(responseBody.success, 'Value of success should be true').toBeTruthy();
      });
}

export {
    checkValueOfSuccessKeyInResponseIsFail,
    checkValueOfSuccessKeyInResponseIsTrue
}
