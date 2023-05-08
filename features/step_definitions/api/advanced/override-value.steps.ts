import { Then } from '@cucumber/cucumber';
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
    let year: number[] = [new Date().getFullYear() - 1, new Date().getFullYear() - 2, new Date().getFullYear() - 3, new Date().getFullYear() - 4];
    const gridMonth = Math.floor(Math.random() * month.length);
    const gridYear = year[Math.floor(Math.random() * year.length)];
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

Then('{} checks value after editing history override values of item', async function (actor: string) {
    const historyOverrideModels = this.getHistoryOverrideResponseBody.model
    this.editedHistoryData.forEach((value: number, key: string) => {
        const model =  historyOverrideModels.find((model: any) => model.grid == key);
        expect(model, 'The edited grid must be finded in models').not.toBe(undefined);
        expect(model.orderQty, `The orderQty of grid-${key} must be ${value}`).toEqual(value);
    })
});

Then('User saves the history override values', async function(){
    const historyOverrideModels = this.getHistoryOverrideResponseBody.model
    let months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];        
    const currentMonth = new Date().getMonth() + 1;
    const afterCurrentMonths = months.slice(currentMonth - 1)
    const beforeCurrentMonths = months.slice(0, currentMonth - 1)
    console.log(afterCurrentMonths , beforeCurrentMonths)
    const currentYear = new Date().getFullYear();

    let grids: string[] = []
    for(let index = 4; index > 0; index--){
        let year = currentYear - index
        afterCurrentMonths.forEach(month =>{
            let grid = month + '_' + year
            grids.push(grid)
        })
        year = currentYear - index + 1
        beforeCurrentMonths.forEach(month =>{
            let grid = month + '_' + year
            grids.push(grid)
        })
    }
    console.log(grids)

    let historyOverrideValues: Number[] = []
    for(let index = 0; index < grids.length; index ++){
        const value = await historyOverrideModels.find((model: any) => model.grid == grids[index])
        if (value == undefined) {
            historyOverrideValues.push(0)
        } else {
            historyOverrideValues.push(value.orderQty)
        }
    }
    console.log('historyVAlue:' ,historyOverrideValues)

    let historyOverrideValues1 = historyOverrideValues.slice(0, 12)
    let historyOverrideValues2 = historyOverrideValues.slice(12, 24)          
    let historyOverrideValues3 = historyOverrideValues.slice(24, 36)
    let historyOverrideValues4 = historyOverrideValues.slice(36)

    historyOverrideValues1[11] = historyOverrideValues1[11] === 0 ? historyOverrideValues4[11] : historyOverrideValues1[11]
    historyOverrideValues2 = historyOverrideValues2.map((value, index) => {
        if (value === 0) {
          return historyOverrideValues4[index];
        } else {
          return value;
        }
      });

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

    const firstNonZeroIndex = historyOverrideValues.findIndex((el) => el !== 0);
    if (firstNonZeroIndex !== -1) {
        historyOverrideValues.splice(0, firstNonZeroIndex);
    }
    console.log(historyOverrideValues)
    this.expectedHistoryOverrideValues = historyOverrideValues
    logger.log('info', `History Override Values expected >>> ${this.expectedHistoryOverrideValues}`);
    this.attach(`History Override Values expected >>> ${this.expectedHistoryOverrideValues}`);
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
    console.log("this.historySnapshot: " + this.historySnapshot);
    // If historySnapShot includes override history value will return true
    const actual = this.historySnapshot.includes(this.expectedOrderQty);
    expect(actual,'Order Qty should be in historySnapShot').toBe(true)
});

Then('{} checks override history values must be displayed exactly in Purchasing', async function (actor: string) {
    const actualHistoryOverrideValues = this.getResultsResponseBody.model.historySnapshot;
    logger.log('info', `History Override Values expected >>> ${this.expectedHistoryOverrideValues}`);
    this.attach(`History Override Values expected >>> ${this.expectedHistoryOverrideValues}`);
    logger.log('info', `History Override Values actual >>>>> ${actualHistoryOverrideValues}`);
    this.attach(`History Override Values actual >>>>> ${actualHistoryOverrideValues}`);
    expect(_.isEqual(actualHistoryOverrideValues, this.expectedHistoryOverrideValues)).toBeTruthy()
});

Then(`{} sets PUT api endpoint to update history override for {} full year of data`, async function (actor: string, numberOfYear: number) {    
    this.linkApiUpdateHistoryOverride = `${Links.API_HISTORY_OVERRIDE}`;
    this.numberOfYear = numberOfYear;

    let month: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];    

    this.payloadUpdateHistoryOverride = {
        key: `${this.itemKey}`,
        rows: []
    }    
    const currentMonth = new Date().getMonth() + 1;
    let index = 1;
    let editedHistoryData = new Map<string, number>();
    while (index <= numberOfYear)
    {
        for (let monthNumber = 1; monthNumber <= 12; monthNumber++){
            const gridMonth = month[monthNumber-1]        
            let gridYear = new Date().getFullYear() - index;
            if (monthNumber < currentMonth) gridYear = new Date().getFullYear() - index + 1;
            this.grid = gridMonth + '_' + gridYear;
            const row = {
                itemKey: `${this.itemKey}`,
                itemName: `${this.itemName}`,
                grid: `${this.grid}`,
                forecastKey: "m",
                orderQty: Number(faker.datatype.number({ 'min': 1, 'max': 100 })),
                start: `${Date.UTC(gridYear, monthNumber-1, 15)}`
            }
            editedHistoryData.set(row.grid, row.orderQty)                
            this.payloadUpdateHistoryOverride.rows.push(row)
        }    
        index ++;
    }
    this.editedHistoryData = editedHistoryData
    logger.log('info', `Payload update history override one year >>>>>> ` + JSON.stringify(this.payloadUpdateHistoryOverride, undefined, 4));
    this.attach(`Payload update history override one year >>>>>> ` + JSON.stringify(this.payloadUpdateHistoryOverride, undefined, 4));
});

Then('{} sends a PUT request to update history override for {} full year of data', async function (actor: string, numberOfYear: any) {    
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