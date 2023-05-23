import { Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as historyOverrideRequest from '../../../../src/api/request/historyOverride.service';
import * as resultsRequest from '../../../../src/api/request/result.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";
import { getHistoryOverrideOfItemResponseSchema, generalResponseSchema } from '../assertion/dashboard/historyOverrideSchema';
import { resultsResponseSchema } from '../assertion/purchasing/purchasingAssertionSchema';

let link: any;

Then(`{} sets PUT api endpoint to update history override`, async function (actor: string) {
    link = `${Links.API_HISTORY_OVERRIDE}`;
});

Then('{} sends a PUT request to update history override', async function (actor: string) {
    let month: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let year: number[] = [new Date().getFullYear() - 1, new Date().getFullYear() - 2, new Date().getFullYear() - 3];
    const gridYear = year[Math.floor(Math.random() * year.length)];
    const gridMonth = Math.floor(Math.random() * month.length);

    this.grid = month[gridMonth] + '_' + gridYear;
    // Example of grid in payload: Apr_2022

    let payload = {
        key: `${this.itemKey}`,
        rows: [{
            itemKey: `${this.itemKey}`,
            itemName: `${this.itemName}`,
            grid: `${this.grid}`,
            forecastKey: "m",
            orderQty: Number(faker.datatype.number({ 'min': 1, 'max': 100 })),
            start: Date.UTC(gridYear, gridMonth, 15)
        }]
    }
    logger.log('info', `Payload: ` + JSON.stringify(payload));
    this.attach(`Payload: ` + JSON.stringify(payload));
    this.expectedOrderQty = payload.rows[0].orderQty;
    this.response = await historyOverrideRequest.updateHistoryOverride(this.request, link, payload, this.headers);
    if (this.response.status() == 200) {
        this.updateHistoryOverrideResponseBody = JSON.parse(await this.response.text());
        logger.log('info', `Update History Override ${link} has status code ${this.response.status()} ${this.response.statusText()} and updateHistoryOverrideResponse body ${JSON.stringify(this.updateHistoryOverrideResponseBody, undefined, 4)}`)
        this.attach(`Update History Override ${link} has status code ${this.response.status()} ${this.response.statusText()} and updateHistoryOverrideResponseBody body ${JSON.stringify(this.updateHistoryOverrideResponseBody, undefined, 4)}`)
    } else {
        logger.log('info', `Update History Override ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
        this.attach(`Update History Override ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
    }
});

Then(`{} sets GET api endpoint to get history override of item`, async function (actor: string) {
    link = encodeURI(`${Links.API_HISTORY_OVERRIDE}?id=${this.itemKey}`);
    logger.log('info', `link: ${link}`);
    this.attach(`link: ${link}`);
});

Then(`{} sends a GET request to get history override of item`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getHistoryOverrideResponse = this.response = await historyOverrideRequest.getHistoryOverride(this.request, link, options);
    const responseBodyText = await this.getHistoryOverrideResponse.text();
    if (this.getHistoryOverrideResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getHistoryOverrideResponseBody = JSON.parse(await this.getHistoryOverrideResponse.body());
        logger.log('info', `Response GET ${link}>>>>>` + JSON.stringify(this.getHistoryOverrideResponseBody, undefined, 4));
        this.attach(`Response GET ${link}>>>>>>` + JSON.stringify(this.getHistoryOverrideResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>>${responseBodyText}`);
        this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>>${actualResponseText}`)
    }
});

Then('{} checks value after editing history override values of item must be displayed exactly', async function (actor: string) {
    const historyOverrideModels = this.getHistoryOverrideResponseBody.model
    this.editedHistoryData.forEach((value: number, key: string) => {
        const model = historyOverrideModels.find((model: any) => model.grid == key);
        expect(model, 'The edited grid must be found in models').not.toBe(undefined);
        expect(model.orderQty, `The orderQty of grid-${key} must be ${value}`).toEqual(value);
    })
});

Then('User calculates the order qty of other years after turning on backfill feature and saves those values', async function () {
    const historyOverrideModels = this.getHistoryOverrideResponseBody.model
    let months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // We have 12 months, and I split it in 2 array by the current month, for creating the first part of the grid
    // Example of a grid: May_2022  
    // This is why i split it in 2 arrays:
    // Ex: Current month is: May, 2023. 
    // then grids = ['May_2022', 'Jun_2022', 'Jul_2022', 'Aug_2022', 'Sep_2022', 'Oct_2022', 'Nov_2022', 'Dec_2022', 'Jan_2023', 'Feb_2023', 'Mar_2023', 'Apr_2023'] (1st row in data table 2022-2023)
    // cannot have history for May_2023, 'Jun_2023', 'Jul_2023', 'Aug_2023', 'Sep_2023', 'Oct_2023', 'Nov_2023', 'Dec_2023'. because current is May, 2023
    const currentMonth = new Date().getMonth() + 1;
    const afterCurrentMonths = months.slice(currentMonth - 1)
    const beforeCurrentMonths = months.slice(0, currentMonth - 1)
    console.log(afterCurrentMonths, beforeCurrentMonths)
    const currentYear = new Date().getFullYear();

    // On theUI the data is show as a table, with the column being the month, the row being the year
    // Here I use grid with first part is month, second part is year to represent data
    let grids: string[] = []
    // Row = 4, represent for 4 row in data table on UI
    // Ex: current is 2023
    // row 1: 2022-2023
    // row 2: 2021-2022
    // row 3: 2020-2021
    // row 4: 2019-2020
    for (let row = 4; row > 0; row--) {
        let year = currentYear - row
        afterCurrentMonths.forEach(month => {
            let grid = month + '_' + year
            grids.push(grid)
        })
        year = currentYear - row + 1
        beforeCurrentMonths.forEach(month => {
            let grid = month + '_' + year
            grids.push(grid)
        })
    }
    console.log(grids)

    // Example a model:  {
    //         "itemKey": "3a796eb9-a2dd-4c11-89f2-b06bbd669c71",
    //        "itemName": "L8FYXO7R2Q-51-Auto",
    //        "grid": "Nov_2022",
    //         "forecastKey": "m",
    //         "orderQty": 45,
    //         "start": "1668470400000"
    //     }
    // After creating grids, i find order qty of this grid in historyOverrideModels then save those value in historyOverrideValues
    // If cannot find grid in historyOverrideModels, means it has no orderQty in the dataTable on UI, then I set it = 0
    let historyOverrideValues: Number[] = []
    for (let index = 0; index < grids.length; index++) {
        const value = await historyOverrideModels.find((model: any) => model.grid == grids[index])
        if (value == undefined) {
            historyOverrideValues.push(0)
        } else {
            historyOverrideValues.push(value.orderQty)
        }
    }
    console.log('historyValue:', historyOverrideValues)

    // cut the historyOverrideValues into four, corresponding to 4 rows on the UI
    // Ex: if current 2023, then
    // 2019-2020
    let historyOverrideValues1 = historyOverrideValues.slice(0, 12)
    // 2020-2021
    let historyOverrideValues2 = historyOverrideValues.slice(12, 24)
    // 2021-2022
    let historyOverrideValues3 = historyOverrideValues.slice(24, 36)
    // 2022-2023
    let historyOverrideValues4 = historyOverrideValues.slice(36)

    // Backfill data for other years

    // Fill one month for 4th year
    historyOverrideValues1[11] = historyOverrideValues1[11] === 0 ? historyOverrideValues4[11] : historyOverrideValues1[11]
    // Fill in the historyOverrideValues2 based on historyOverrideValues4 - 12 months
    historyOverrideValues2 = historyOverrideValues2.map((value, index) => {
        if (value === 0) {
            return historyOverrideValues4[index];
        } else {
            return value;
        }
    });
    // Fill in the historyOverrideValues3 based on historyOverrideValues4  - 12 months
    historyOverrideValues3 = historyOverrideValues3.map((value, index) => {
        if (value === 0) {
            return historyOverrideValues4[index];
        } else {
            return value;
        }
    });

    console.log(historyOverrideValues1)
    console.log(historyOverrideValues2)
    console.log(historyOverrideValues3)
    console.log(historyOverrideValues4)

    historyOverrideValues = [...historyOverrideValues1, ...historyOverrideValues2, ...historyOverrideValues3, ...historyOverrideValues4]
    console.log(historyOverrideValues)

    // Any 0 values at the beginning of the historyOverrideValues array are removed
    const firstNonZeroIndex = historyOverrideValues.findIndex((el) => el !== 0);
    if (firstNonZeroIndex !== -1) {
        historyOverrideValues.splice(0, firstNonZeroIndex);
    }
    console.log(historyOverrideValues)
    this.expectedHistoryOverrideValues = historyOverrideValues
    logger.log('info', `History Override Values expected >>> ${this.expectedHistoryOverrideValues}`);
    this.attach(`History Override Values expected >>> ${this.expectedHistoryOverrideValues}`);

    for (let index = firstNonZeroIndex; index < historyOverrideValues.length; index++) {
        logger.log('info', `History Override Month ${grids[index]} = ${historyOverrideValues[index]}`);
        this.attach(`History Override Month ${grids[index]} = ${historyOverrideValues[index]}`);
    }
})

Then('{} checks API contract of get history override of item api', async function (actor: string) {
    getHistoryOverrideOfItemResponseSchema.parse(this.getHistoryOverrideResponseBody);
});

Then('{} checks API contract of update history override api', async function (actor: string) {
    generalResponseSchema.parse(this.updateHistoryOverrideResponseBody);
});

Then('{} checks value after editing history override of item', async function (actor: string) {
    this.newHistoryOverrideValue = await this.getHistoryOverrideResponseBody.model.find((override: any) => override.grid == this.grid);
    logger.log('info', `History Override Value which has ${this.grid}: ${JSON.stringify(this.newHistoryOverrideValue, undefined, 4)}`);
    this.attach(`History Override Value which has ${this.grid}: ${JSON.stringify(this.newHistoryOverrideValue, undefined, 4)}`);
    const actualOrderQty = this.newHistoryOverrideValue.orderQty;
    expect(actualOrderQty, `Order Qty should be ${this.expectedOrderQty}`).toBe(this.expectedOrderQty);
});

Then('{} sets GET api endpoint to get results of item', async function (actor: string) {
    link = encodeURI(`${Links.API_RESULT}?id=${this.itemKey}`);
});

Then('{} sends a GET request to get results of item', async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getResultsResponse = this.response = await resultsRequest.getResults(this.request, link, options);
    const responseBodyText = await this.getResultsResponse.text();
    if (this.getResultsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getResultsResponseBody = JSON.parse(await this.getResultsResponse.body());
        logger.log('info', `Get results ${link} >>>>>> ` + JSON.stringify(this.getResultsResponseBody, undefined, 4));
        this.attach(`Get results ${link} >>>>>> ` + JSON.stringify(this.getResultsResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
});


Then('{} checks API contract of get results of item', async function (actor: string) {
    resultsResponseSchema.parse(this.getResultsResponseBody);
});

Then('{} checks override history values in Purchasing', async function (actor: string) {
    this.historySnapshot = this.getResultsResponseBody.model.historySnapshot;
    logger.log('info', `historySnapshot: >>> ${this.historySnapshot}`);
    this.attach(`historySnapshot: >>> ${this.historySnapshot}`);
    // If historySnapShot includes override history value will return true
    const actual = this.historySnapshot.includes(this.expectedOrderQty);
    expect(actual, 'Order Qty should be in historySnapShot').toBe(true)
});

Then('{} checks override history values must be displayed exactly in Purchasing', async function (actor: string) {
    const actualHistoryOverrideValues = this.getResultsResponseBody.model.historySnapshot;
    logger.log('info', `History Override Values expected >>> ${this.expectedHistoryOverrideValues}`);
    this.attach(`History Override Values expected >>> ${this.expectedHistoryOverrideValues}`);
    logger.log('info', `History Override Values actual >>>>> ${actualHistoryOverrideValues}`);
    this.attach(`History Override Values actual >>>>> ${actualHistoryOverrideValues}`);
    expect(_.isEqual(actualHistoryOverrideValues, this.expectedHistoryOverrideValues)).toBeTruthy()
});

Then(`{} sets PUT api endpoint to update history override for full year of {} top row in data table`, async function (actor: string, rowNum: number) {
    this.linkApiUpdateHistoryOverride = `${Links.API_HISTORY_OVERRIDE}`;
    this.rowNum = rowNum;

    let month: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    this.payloadUpdateHistoryOverride = {
        key: `${this.itemKey}`,
        rows: []
    }
    const currentMonth = new Date().getMonth() + 1;
    let index = 1;
    let editedHistoryData = new Map<string, number>();
    while (index <= rowNum) {
        for (let monthNumber = 1; monthNumber <= 12; monthNumber++) {
            const gridMonth = month[monthNumber - 1]
            let gridYear = new Date().getFullYear() - index;
            if (monthNumber < currentMonth) gridYear = new Date().getFullYear() - index + 1;
            this.grid = gridMonth + '_' + gridYear;
            const row = {
                itemKey: `${this.itemKey}`,
                itemName: `${this.itemName}`,
                grid: `${this.grid}`,
                forecastKey: "m",
                orderQty: Number(faker.datatype.number({ 'min': 1, 'max': 100 })),
                start: `${Date.UTC(gridYear, monthNumber - 1, 15)}`
            }
            editedHistoryData.set(row.grid, row.orderQty)
            this.payloadUpdateHistoryOverride.rows.push(row)
        }
        index++;
    }
    this.editedHistoryData = editedHistoryData
    logger.log('info', `Payload update history override one year >>>>>> ` + JSON.stringify(this.payloadUpdateHistoryOverride, undefined, 4));
    this.attach(`Payload update history override one year >>>>>> ` + JSON.stringify(this.payloadUpdateHistoryOverride, undefined, 4));
});

Then('{} sends a PUT request to update history override for full year of {} top row in data table', async function (actor: string, rowNum: any) {
    this.response = await historyOverrideRequest.updateHistoryOverride(this.request, this.linkApiUpdateHistoryOverride, this.payloadUpdateHistoryOverride, this.headers);
    if (this.response.status() == 200) {
        this.updateHistoryOverrideResponseBody = JSON.parse(await this.response.text());
        logger.log('info', `Update History Override ${this.linkApiUpdateHistoryOverride} has status code ${this.response.status()} ${this.response.statusText()} and updateHistoryOverrideResponse body ${JSON.stringify(this.updateHistoryOverrideResponseBody, undefined, 4)}`)
        this.attach(`Update History Override ${this.linkApiUpdateHistoryOverride} has status code ${this.response.status()} ${this.response.statusText()} and updateHistoryOverrideResponseBody body ${JSON.stringify(this.updateHistoryOverrideResponseBody, undefined, 4)}`)
    } else {
        logger.log('info', `Update History Override ${this.linkApiUpdateHistoryOverride} has status code ${this.response.status()} ${this.response.statusText()}`)
        this.attach(`Update History Override ${this.linkApiUpdateHistoryOverride} has status code ${this.response.status()} ${this.response.statusText()}`)
    }
});

Then(`User sets DELETE api to delete history override`, async function () {
    this.linkApiDeleteHistoryOverride = `${Links.API_HISTORY_OVERRIDE}`;

    this.payloadDeleteHistoryOverride = {
        "itemKey": `${this.itemKey}`,
        "itemName": `${this.itemName}`,
        "grid": "",
        "forecastKey": "",
        "start": null
    }

    logger.log('info', `Payload Delete history override one year >>>>>> ` + JSON.stringify(this.payloadDeleteHistoryOverride, undefined, 4));
    this.attach(`Payload Delete history override one year >>>>>> ` + JSON.stringify(this.payloadDeleteHistoryOverride, undefined, 4));
});

Then('User sends a DELETE request to delete history override', async function () {
    this.response = await historyOverrideRequest.deleteHistoryOverride(this.request, this.linkApiDeleteHistoryOverride, this.payloadDeleteHistoryOverride, this.headers);
    if (this.response.status() == 200) {
        this.deleteHistoryOverrideResponseBody = JSON.parse(await this.response.text());
        logger.log('info', `Delete History Override ${this.linkApiDeleteHistoryOverride} has status code ${this.response.status()} ${this.response.statusText()} and deleteHistoryOverrideResponse body ${JSON.stringify(this.deleteHistoryOverrideResponseBody, undefined, 4)}`)
        this.attach(`Delete History Override ${this.linkApiDeleteHistoryOverride} has status code ${this.response.status()} ${this.response.statusText()} and deleteHistoryOverrideResponseBody body ${JSON.stringify(this.deleteHistoryOverrideResponseBody, undefined, 4)}`)
    } else {
        logger.log('info', `Delete History Override ${this.linkApiDeleteHistoryOverride} has status code ${this.response.status()} ${this.response.statusText()}`)
        this.attach(`Delete History Override ${this.linkApiDeleteHistoryOverride} has status code ${this.response.status()} ${this.response.statusText()}`)
    }
});

Then('User sets PUT api to update history override with the following data:', async function (dataTable: DataTable) {
    const historyValuesOfYears = dataTable.raw();

    this.linkApiUpdateHistoryOverride = `${Links.API_HISTORY_OVERRIDE}`;

    let months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth() + 1;

    this.payloadUpdateHistoryOverride = {
        key: `${this.itemKey}`,
        rows: []
    }
    let row = 1;
    while (row <= historyValuesOfYears.length - 1) {
        for (let monthNumber = 1; monthNumber <= 12; monthNumber++) {
            const gridMonth = months[monthNumber - 1]
            let gridYear = new Date().getFullYear() - row;
            if (monthNumber < currentMonth) gridYear = new Date().getFullYear() - row + 1;
            this.grid = gridMonth + '_' + gridYear;
            const orderQty = historyValuesOfYears[row][(monthNumber + 12 + -5) % 12]
            if (orderQty !== '') {
                const row = {
                    itemKey: `${this.itemKey}`,
                    itemName: `${this.itemName}`,
                    grid: `${this.grid}`,
                    forecastKey: "m",
                    orderQty: Number(orderQty),
                    start: `${Date.UTC(gridYear, monthNumber - 1, 15)}`
                }
                this.payloadUpdateHistoryOverride.rows.push(row)
            }
        }
        row++;
    }
    logger.log('info', `Payload update history override one year >>>>>> ` + JSON.stringify(this.payloadUpdateHistoryOverride, undefined, 4));
    this.attach(`Payload update history override one year >>>>>> ` + JSON.stringify(this.payloadUpdateHistoryOverride, undefined, 4));
});

Then('User sends a PUT request to update history override values', async function () {
    this.response = await historyOverrideRequest.updateHistoryOverride(this.request, this.linkApiUpdateHistoryOverride, this.payloadUpdateHistoryOverride, this.headers);
    if (this.response.status() == 200) {
        this.updateHistoryOverrideResponseBody = JSON.parse(await this.response.text());
        logger.log('info', `Update History Override ${this.linkApiUpdateHistoryOverride} has status code ${this.response.status()} ${this.response.statusText()} and updateHistoryOverrideResponse body ${JSON.stringify(this.updateHistoryOverrideResponseBody, undefined, 4)}`)
        this.attach(`Update History Override ${this.linkApiUpdateHistoryOverride} has status code ${this.response.status()} ${this.response.statusText()} and updateHistoryOverrideResponseBody body ${JSON.stringify(this.updateHistoryOverrideResponseBody, undefined, 4)}`)
    } else {
        logger.log('info', `Update History Override ${this.linkApiUpdateHistoryOverride} has status code ${this.response.status()} ${this.response.statusText()}`)
        this.attach(`Update History Override ${this.linkApiUpdateHistoryOverride} has status code ${this.response.status()} ${this.response.statusText()}`)
    }
});

Then('User checks override history values must be displayed exactly in Purchasing as the following data:', async function (dataTable: DataTable) {
    const historyValuesOfYears = dataTable.raw();
    const historyValuesOfFirstYear = historyValuesOfYears[1];
    const historyValuesOfSecondYear = historyValuesOfYears[2];
    const historyValuesOfThirdYear = historyValuesOfYears[3];
    const historyValuesOfFourthYear = historyValuesOfYears[4];
    const historySnapShotExpected = [...historyValuesOfFourthYear, ...historyValuesOfThirdYear, ...historyValuesOfSecondYear, ...historyValuesOfFirstYear];
    // Any empty values at the beginning of the historySnapShotExpected array are removed
    const firstNonEmptyIndex = historySnapShotExpected.findIndex((el) => el !== '');
    if (firstNonEmptyIndex !== -1) {
        historySnapShotExpected.splice(0, firstNonEmptyIndex);
    }
    const historySnapShotActual = this.getResultsResponseBody.model.historySnapshot;
    logger.log('info', `History Override Values expected >>> ${historySnapShotExpected}`);
    this.attach(`History Override Values expected >>> ${historySnapShotExpected}`);
    logger.log('info', `History Override Values actual >>>>> ${historySnapShotActual}`);
    this.attach(`History Override Values actual >>>>> ${historySnapShotActual}`);
    expect(_.isEqual(historySnapShotExpected.map(Number), historySnapShotActual.map(Number))).toBeTruthy()
})