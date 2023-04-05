import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as companyRequest from '../../../../src/api/request/company.service';
import * as vendorRequest from '../../../../src/api/request/vendor.service';
import * as purchasingRequest from '../../../../src/api/request/purchasing.service';
import * as itemRequest from '../../../../src/api/request/item.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import exp from 'constants';
import * as keyword from '../../../../src/utils/actionwords'

let link: any;
let linkGetItemsInPurchasingCustom: any;
let linkGetAItemFilterByName: any;
let linkUpdateVendorSalesVelocitySettings: any;
let linkUpdateItemSalesVelocitySettings: any;
let linkGetItemSalesVelocitySettings: any;
let linkGetItemsWithFilter: any;
let linkGetItemInPurchasingCustom: any;
let linkGetRestockSuggestionPurchasing: any;
let linkItemsInPO: any;
let linkGetLimitFiveItemInMySuggested: any;
let linkGetLimitFiveItemInCustom: any;
let linkGetLimitFiveItemInItems: any;
let linkGetRestockSuggestionPurchasings: string[] = [];
let linkGetPercentDefaultOfAverages: string[] = [];
let salesVelocitySettingDatas: any[] = [];
let randomWeightNumbers: number[] = [];
Then(`{} sets GET api endpoint to get items in Purchasing Custom to check purchasing daily sales rate`, async function (actor: string) {
    // Use items with name have DefaultPurchasingSaleVelocity to check
    linkGetItemsInPurchasingCustom = encodeURI(`${Links.API_SUMMARY_ITEMS_IN_PURCHASING_CUSTOM}?offset=0&limit=100&where={"filters":[{"filters":[{"field":"itemName","operator":"contains","value":"DefaultPurchasingSaleVelocity"}],"logic":"and"}],"logic":"and"}`);

    console.log(linkGetItemsInPurchasingCustom);
});

Then(`{} sends a GET request to get items in Purchasing Custom to check purchasing daily sales rate`, async function (actor) {
    const options = {
        headers: this.headers
    }
    this.getItemsinPurchasingCustomResponse = this.response = await vendorRequest.getItemsinPurchasingCustom(this.request, linkGetItemsInPurchasingCustom, options);
    const responseBodyText = await this.getItemsinPurchasingCustomResponse.text();
    if (this.getItemsinPurchasingCustomResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemsinPurchasingCustomResponseBody = JSON.parse(await this.getItemsinPurchasingCustomResponse.body());
        logger.log('info', `Random object in response GET ${linkGetItemsInPurchasingCustom} >>>>>>` + JSON.stringify(this.getItemsinPurchasingCustomResponseBody, undefined, 4));
        this.attach(`Response object in response GET ${linkGetItemsInPurchasingCustom} >>>>>>` + JSON.stringify(this.getItemsinPurchasingCustomResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkGetItemsInPurchasingCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response GET ${linkGetItemsInPurchasingCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
})

Then(`{} sets PUT api endpoint to update "Purchasing Daily Sales Rate Rules > Average" in the "Manage Company > Company Details" of a bove company with the total percentage is {}%`, async function (actor: string, percentage: string) {
    link = `${Links.API_GET_COMPANY}/${this.companyKey}`;
    this.payLoad = this.responseBodyOfACompanyObject

    randomWeightNumbers=[]

    const isNumber = !isNaN(parseFloat(percentage)) && isFinite(+percentage);
    if (isNumber) {
        // The function returns the array of 8 numbers that add up to the desired sum (here is percentage of purchasing daily sales)
        randomWeightNumbers = keyword.generateRandomNumbers(Number(percentage), 8);

        this.payLoad.purchasingSalesVelocitySettingData.percent2Day = randomWeightNumbers[0]
        this.payLoad.purchasingSalesVelocitySettingData.percent7Day = randomWeightNumbers[1]
        this.payLoad.purchasingSalesVelocitySettingData.percent14Day = randomWeightNumbers[2]
        this.payLoad.purchasingSalesVelocitySettingData.percent30Day = randomWeightNumbers[3]
        this.payLoad.purchasingSalesVelocitySettingData.percent60Day = randomWeightNumbers[4]
        this.payLoad.purchasingSalesVelocitySettingData.percent90Day = randomWeightNumbers[5]
        this.payLoad.purchasingSalesVelocitySettingData.percent180Day = randomWeightNumbers[6]
        this.payLoad.purchasingSalesVelocitySettingData.percentForecasted = randomWeightNumbers[7]
    }

    logger.log('info', `Payload` + JSON.stringify(this.payLoad, undefined, 4));
    this.attach(`Payload` + JSON.stringify(this.payLoad, undefined, 4))
});

Then(`{} sends PUT request to update "Purchasing Daily Sales Rate Rules > Average"`, async function (actor: string) {
    this.response = await companyRequest.editPurchasingDailyRate(this.request, link, this.payLoad, this.headers)
    if (this.response.status() == 200) {
        this.editCompanyResponseBody = JSON.parse(await this.response.text())
        logger.log('info', `Edit Company Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()} and editCompanyResponse body ${JSON.stringify(this.editCompanyResponseBody, undefined, 4)}`)
        this.attach(`Edit Company Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()} and editCompanyResponse body ${JSON.stringify(this.editCompanyResponseBody, undefined, 4)}`)
    } else {
        logger.log('info', `Edit Company Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
        this.attach(`Edit Company Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
    }
});

Then(`{} selects ramdom items in Purchasing Custom`, async function (actor: string) {
    // Pick random 5 item to check purchasing daily sales rate
    // const shuffledArr = this.getItemsinPurchasingCustomResponseBody.sort(() => Math.random() - 0.5);
    // this.radomFiveItemsInPurchasingCustom = shuffledArr.slice(0, 5)
    this.radomFiveItemsInPurchasingCustom = this.getItemsinPurchasingCustomResponseBody.slice(0, 5)

    this.listKeysOfRandomItems = this.radomFiveItemsInPurchasingCustom.map((item: any) => item.itemKey)

    for (const itemKey of this.listKeysOfRandomItems) {
        logger.log('info', `Item: ${JSON.stringify(itemKey, undefined, 4)}`)
        this.attach(`Item: ${JSON.stringify(itemKey, undefined, 4)}`)
    }
});

Then(`{} selects ramdom items in Purchasing My Suggested`, async function (actor: string) {
    // Use items with name have DefaultPurchasingSaleVelocity to check
    this.getRandomItemsinPurchasingSuggesyion = this.getItemsinPOResponseBody.model.filter((item: any) => item.itemName.includes('DefaultPurchasingSaleVelocity'))
    // Pick random 5 item to check purchasing daily sales rate
    const shuffledArr = this.getRandomItemsinPurchasingSuggesyion.sort(() => Math.random() - 0.5);
    this.radomFiveItemsInPurchasingSuggestion = shuffledArr.slice(0, 5)

    this.listKeysOfRandomItems = this.radomFiveItemsInPurchasingSuggestion.map((item: any) => item.itemKey)

    for (const itemKey of this.listKeysOfRandomItems) {
        logger.log('info', `Item: ${JSON.stringify(itemKey, undefined, 4)}`)
        this.attach(`Item: ${JSON.stringify(itemKey, undefined, 4)}`)
    }
});

Then(`{} sets GET api endpoint to get restock suggestion purchasing`, async function (actor: string) {
    linkGetRestockSuggestionPurchasings = []
    for (const itemKey of this.listKeysOfRandomItems) {
        linkGetRestockSuggestionPurchasings.push(`${Links.API_RESTOCK_SUGGESTION_PURCHASING}/${itemKey}/purchasing`)
        logger.log('info', `Link: ${JSON.stringify(itemKey, undefined, 4)}`)
        this.attach(`Link: ${JSON.stringify(itemKey, undefined, 4)}`)
    }

    for (const link of linkGetRestockSuggestionPurchasings) {
        logger.log('info', `Link: ${JSON.stringify(link, undefined, 4)}`)
        this.attach(`Link: ${JSON.stringify(link, undefined, 4)}`)
    }
});

Then(`{} sends GET request to get restock suggestion purchasing of above items`, async function (actor: string) {
    const options = {
        headers: this.headers
    }

    salesVelocitySettingDatas = []

    for (const linkGetRestockSuggestionPurchasing of linkGetRestockSuggestionPurchasings) {
        this.getRestockSuggestionPurchasingResponse = this.response = await purchasingRequest.getRestockSuggestionPurchasing(this.request, linkGetRestockSuggestionPurchasing, options);
        const responseBodyText = await this.getRestockSuggestionPurchasingResponse.text();
        if (this.getRestockSuggestionPurchasingResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
            this.responseBody = this.getRestockSuggestionPurchasingResponseBody = JSON.parse(await this.getRestockSuggestionPurchasingResponse.body());
            const salesVelocitySettingData = this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData
            salesVelocitySettingDatas.push(salesVelocitySettingData)
            logger.log('info', `Response GET ${linkGetRestockSuggestionPurchasing} >>>>>>` + JSON.stringify(this.getRestockSuggestionPurchasingResponseBody, undefined, 4));
            this.attach(`Response GET ${linkGetRestockSuggestionPurchasing} >>>>>>` + JSON.stringify(this.getRestockSuggestionPurchasingResponseBody, undefined, 4))
        }
        else {
            const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
            logger.log('info', `Response GET ${linkGetRestockSuggestionPurchasing} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
            this.attach(`Response GET ${linkGetRestockSuggestionPurchasing} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
        }
    }
});

Then(`{} checks purchasing daily sales rate of item using default setting on company detail`, async function (actor: string) {
    for (const salesVelocitySettingData of salesVelocitySettingDatas) {
        expect(salesVelocitySettingData.percent2Day, `The weight of 2-day is equal ${randomWeightNumbers[0]}`).toEqual(randomWeightNumbers[0]);
        expect(salesVelocitySettingData.percent7Day, `The weight of 7-day is equal ${randomWeightNumbers[1]}`).toEqual(randomWeightNumbers[1]);
        expect(salesVelocitySettingData.percent14Day, `The weight of 14-day is equal ${randomWeightNumbers[2]}`).toEqual(randomWeightNumbers[2]);
        expect(salesVelocitySettingData.percent30Day, `The weight of 30-day is equal ${randomWeightNumbers[3]}`).toEqual(randomWeightNumbers[3]);
        expect(salesVelocitySettingData.percent60Day, `The weight of 60-day is equal ${randomWeightNumbers[4]}`).toEqual(randomWeightNumbers[4]);
        expect(salesVelocitySettingData.percent90Day, `The weight of 90-day is equal ${randomWeightNumbers[5]}`).toEqual(randomWeightNumbers[5]);
        expect(salesVelocitySettingData.percent180Day, `The weight of 180-day is equal ${randomWeightNumbers[6]}`).toEqual(randomWeightNumbers[6]);
        expect(salesVelocitySettingData.percentForecasted, `The weight of forecastRx demand is equal ${randomWeightNumbers[7]}`).toEqual(randomWeightNumbers[7]);
    }
});

Given('User sets PUT api endpoint to update sale velocity settings with type {} of supplier', function (velocityType: string) {
    linkUpdateVendorSalesVelocitySettings = `${Links.API_VENDOR_SALES_VELOCITY}/${this.supplierKey}`
});

When('User sends PUT request to update sale velocity settings with type {} of above supplier with the total percentage is {}%', async function (velocityType: string, percentage: string) {
    const isNumber = !isNaN(parseFloat(percentage)) && isFinite(+percentage);

    randomWeightNumbers=[]

    if (isNumber) {
        // The function returns the array of 8 numbers that add up to the desired sum (here is percentage of purchasing daily sales)
        randomWeightNumbers = keyword.generateRandomNumbers(Number(percentage), 8);

        this.payLoad = {
            "companyKey": `${this.companyKey}`,
            "companyType": `${this.companyType}`,
            "salesVelocityType": "average",
            "vendorKey": `${this.supplierKey}`,
            "salesVelocitySettingData": {
                "percent2Day": randomWeightNumbers[0],
                "percent7Day": randomWeightNumbers[1],
                "percent14Day": randomWeightNumbers[2],
                "percent30Day": randomWeightNumbers[3],
                "percent60Day": randomWeightNumbers[4],
                "percent90Day": randomWeightNumbers[5],
                "percent180Day": randomWeightNumbers[6],
                "percentForecasted": randomWeightNumbers[7]
            },
            "salesVelocitySettingsType": "purchasing"
        }
    }

    logger.log('info', `Payload` + JSON.stringify(this.payLoad, undefined, 4));
    this.attach(`Payload` + JSON.stringify(this.payLoad, undefined, 4))

    this.response = await vendorRequest.updateVendorSalesVelocitySettings(this.request, linkUpdateVendorSalesVelocitySettings, this.payLoad, this.headers)
    if (this.response.status() == 200) {
        this.UpdateVendorSalesVelocitySettingsResponseBody = JSON.parse(await this.response.text())
        logger.log('info', `Edit Company Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()} and editCompanyResponse body ${JSON.stringify(this.UpdateVendorSalesVelocitySettingsResponseBody, undefined, 4)}`)
        this.attach(`Edit Company Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()} and editCompanyResponse body ${JSON.stringify(this.UpdateVendorSalesVelocitySettingsResponseBody, undefined, 4)}`)
    } else {
        logger.log('info', `Edit Company Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
        this.attach(`Edit Company Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
    }
});

Given(`User sets GET api endpoint to get a item in "Manage Company > Item" to assign supplier`, function () {
    // Use items with name have DefaultPurchasingSaleVelocity to check
    const name = 'DefaultPurchasingSaleVelocity';
    linkGetAItemFilterByName = `${Links.API_ITEMS}?offset=0&limit=1&where={"filters":[{"filters":[{"field":"name","operator":"contains","value":"${name}"}],"logic":"and"}],"logic":"and"}`
});

Given(`User sends GET request to get a item in "Manage Company > Item" to assign supplier`, async function () {
    const options = {
        headers: this.headers
    }
    this.getItemsResponse = this.response = await itemRequest.getItems(this.request, linkGetAItemFilterByName, options);
    const responseBodyText = await this.getItemsResponse.text();
    if (this.getItemsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemsResponseBody = JSON.parse(await this.getItemsResponse.text());
        logger.log('info', `Response GET ${linkGetAItemFilterByName}` + JSON.stringify(this.getItemsResponseBody, undefined, 4));
        this.attach(`Response GET ${linkGetAItemFilterByName}` + JSON.stringify(this.getItemsResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkGetAItemFilterByName} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${linkGetAItemFilterByName} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }

    this.itemToCheckSaleVelocitySetting = this.getItemsResponseBody[0]
    this.itemKey = this.itemToCheckSaleVelocitySetting.key
    this.itemName = this.itemToCheckSaleVelocitySetting.name
    this.responseBodyOfAItemObject = this.itemToCheckSaleVelocitySetting
});

Then('User sets GET api endpoint to get item sales velocity settings', function () {
    linkGetItemSalesVelocitySettings = `${Links.API_ITEM_SALES_VELOCITY}/${this.itemKey}/purchasing`
});

Then('User sends GET request to get item sales velocity settings', async function () {
    const options = {
        headers: this.headers
    }

    this.getItemSalesVelocitySettingsResponse = this.response = await itemRequest.getItemSalesVelocitySettings(this.request, linkGetItemSalesVelocitySettings, options);
    const responseBodyText = await this.getItemSalesVelocitySettingsResponse.text();
    console.log('aksgcuygahsf')
    console.log(this.getItemSalesVelocitySettingsResponse.status() + '-' + this.response.statusText())
    if (this.getItemSalesVelocitySettingsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemSalesVelocitySettingsResponseBody = JSON.parse(await this.getItemSalesVelocitySettingsResponse.text());
        logger.log('info', `Response GET ${linkGetItemSalesVelocitySettings}` + JSON.stringify(this.getItemSalesVelocitySettingsResponseBody, undefined, 4));
        this.attach(`Response GET ${linkGetItemSalesVelocitySettings}` + JSON.stringify(this.getItemSalesVelocitySettingsResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkGetItemSalesVelocitySettings} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${linkGetItemSalesVelocitySettings} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
});

Then(`{} checks average daily sales rate number of item in "Purchasing > Custom" must be the same settings of its supplier`, async function (actor: string) {
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent2Day, `The weight of 2-day is equal ${randomWeightNumbers[0]}`).toEqual(randomWeightNumbers[0]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent7Day, `The weight of 7-day is equal ${randomWeightNumbers[1]}`).toEqual(randomWeightNumbers[1]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent14Day, `The weight of 14-day is equal ${randomWeightNumbers[2]}`).toEqual(randomWeightNumbers[2]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent30Day, `The weight of 30-day is equal ${randomWeightNumbers[3]}`).toEqual(randomWeightNumbers[3]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent60Day, `The weight of 60-day is equal ${randomWeightNumbers[4]}`).toEqual(randomWeightNumbers[4]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent90Day, `The weight of 90-day is equal ${randomWeightNumbers[5]}`).toEqual(randomWeightNumbers[5]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent180Day, `The weight of 180-day is equal ${randomWeightNumbers[6]}`).toEqual(randomWeightNumbers[6]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percentForecasted, `The weight of forecastRx demand is equal ${randomWeightNumbers[7]}`).toEqual(randomWeightNumbers[7]);
});

Given(`User sets GET api endpoint to get items in "Manage Company > Item"`, function () {
    // Get items that its purcchase as is null and its name is not contain DefaultPurchasingSaleVelocity
    linkGetItemsWithFilter = `${Links.API_ITEMS}?offset=0&limit=50&where={"filters":[{"filters":[{"field":"name","operator":"doesnotcontain","value":"DefaultPurchasingSaleVelocity"}],"logic":"and"},{"filters":[{"field":"vendorName","operator":"isnull","value":null}],"logic":"and"},{"filters":[{"field":"lotMultipleItemName","operator":"isnull","value":null}],"logic":"and"}],"logic":"and"}`
});

Given(`User sends GET request to get items in {string}`, async function (string) {
    const options = {
        headers: this.headers
    }
    this.getItemsResponse = this.response = await itemRequest.getItems(this.request, linkGetItemsWithFilter, options);
    const responseBodyText = await this.getItemsResponse.text();
    if (this.getItemsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemsResponseBody = JSON.parse(await this.getItemsResponse.text());
        // logger.log('info', `Response GET ${linkGetItemsWithFilter}` + JSON.stringify(this.getItemsResponseBody, undefined, 4));
        // this.attach(`Response GET ${linkGetItemsWithFilter}` + JSON.stringify(this.getItemsResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkGetItemsWithFilter} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${linkGetItemsWithFilter} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
});

Given(`User picks random a item from above list items`, async function () {
    this.responseBodyOfAItemObject = await this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
    logger.log('info', `Random Item: ${JSON.stringify(this.responseBodyOfAItemObject, undefined, 4)}`);
    this.attach(`Random Item: ${JSON.stringify(this.responseBodyOfAItemObject, undefined, 4)}`);

    this.itemKey = this.responseBodyOfAItemObject.key
    this.itemName = this.responseBodyOfAItemObject.name
});

Given('User sets PUT api endpoint to update item sales velocity setting with type {}', function (velocityType: string) {
    linkUpdateItemSalesVelocitySettings = `${Links.API_ITEM_SALES_VELOCITY}/${this.itemKey}`
});

When('User sends PUT request to update item sales velocity setting type {} with the total percentage is {}%', async function (velocityType: string, percentage: string) {
    const isNumber = !isNaN(parseFloat(percentage)) && isFinite(+percentage);

    randomWeightNumbers=[]

    if (isNumber) {
        // The function returns the array of 8 numbers that add up to the desired sum (here is percentage of purchasing daily sales)
        randomWeightNumbers = keyword.generateRandomNumbers(Number(percentage), 8);

        this.payLoad = {
            "companyType": `${this.responseBodyOfAItemObject.companyType}`,
            "companyKey": `${this.responseBodyOfAItemObject.companyKey}`,
            "itemKey": `${this.responseBodyOfAItemObject.key === undefined ? this.responseBodyOfAItemObject.itemKey : this.responseBodyOfAItemObject.key}`,
            "salesVelocitySettingsType": "purchasing",
            "restockModel": "DIRECT_SHIP",
            "localLeadTime": 7,
            "targetQtyOnHandMin": 30,
            "targetQtyOnHandMax": 60,
            "salesVelocityType": "average",
            "salesVelocitySettingData": {
                "percent2Day": randomWeightNumbers[0],
                "percent7Day": randomWeightNumbers[1],
                "percent14Day": randomWeightNumbers[2],
                "percent30Day": randomWeightNumbers[3],
                "percent60Day": randomWeightNumbers[4],
                "percent90Day": randomWeightNumbers[5],
                "percent180Day": randomWeightNumbers[6],
                "percentForecasted": randomWeightNumbers[7]
            }
        }
    }

    logger.log('info', `Payload` + JSON.stringify(this.payLoad, undefined, 4));
    this.attach(`Payload` + JSON.stringify(this.payLoad, undefined, 4))

    this.response = await itemRequest.updateItemSalesVelocitySettings(this.request, linkUpdateItemSalesVelocitySettings, this.payLoad, this.headers)
    if (this.response.status() == 200) {
        this.UpdateItemSalesVelocitySettingsResponseBody = JSON.parse(await this.response.text())
        logger.log('info', `Update Item Sales Velocity Settings Response edit ${linkUpdateItemSalesVelocitySettings} has status code ${this.response.status()} ${this.response.statusText()} and updateItemSalesVelocitySettings body ${JSON.stringify(this.UpdateItemSalesVelocitySettingsResponseBody, undefined, 4)}`)
        this.attach(`Update Item Sales Velocity Settings Response edit ${linkUpdateItemSalesVelocitySettings} has status code ${this.response.status()} ${this.response.statusText()} and updateItemSalesVelocitySettings body ${JSON.stringify(this.UpdateItemSalesVelocitySettingsResponseBody, undefined, 4)}`)
    } else {
        logger.log('info', `Update Item Sales Velocity Settings Response edit ${linkUpdateItemSalesVelocitySettings} has status code ${this.response.status()} ${this.response.statusText()}`)
        this.attach(`Update Item Sales Velocity Settings Response edit ${linkUpdateItemSalesVelocitySettings} has status code ${this.response.status()} ${this.response.statusText()}`)
    }
});

Then('User sets GET api endpoint to get item in Purchasing Custom to check purchasing daily sales rate', function () {
    const itemName = this.itemName
    linkGetItemInPurchasingCustom = encodeURI(`${Links.API_SUMMARY_ITEMS_IN_PURCHASING_CUSTOM}?offset=0&limit=100&where={"filters":[{"filters":[{"field":"itemName","operator":"contains","value":"${itemName}"}],"logic":"and"}],"logic":"and"}`);

    console.log(linkGetItemInPurchasingCustom);
});

Then('User sends a GET request to get item in Purchasing Custom to check purchasing daily sales rate', async function () {
    const options = {
        headers: this.headers
    }
    this.getItemInPurchasingCustomResponse = this.response = await vendorRequest.getItemsinPurchasingCustom(this.request, linkGetItemsInPurchasingCustom, options);
    const responseBodyText = await this.getItemInPurchasingCustomResponse.text();
    if (this.getItemInPurchasingCustomResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemInPurchasingCustomResponseBody = JSON.parse(await this.getItemInPurchasingCustomResponse.body());
        logger.log('info', `Item in response GET ${linkGetItemInPurchasingCustom} >>>>>>` + JSON.stringify(this.randomAItemObject, undefined, 4));
        this.attach(`Item in response GET ${linkGetItemInPurchasingCustom} >>>>>>` + JSON.stringify(this.randomAItemObject, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkGetItemInPurchasingCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response GET ${linkGetItemInPurchasingCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
});

Then('User sets GET api endpoint to get restock suggestion purchasing of an above item', function () {
    linkGetRestockSuggestionPurchasing = `${Links.API_RESTOCK_SUGGESTION_PURCHASING}/${this.itemKey}/purchasing`;
    logger.log('info', `Link: ${JSON.stringify(linkGetRestockSuggestionPurchasing, undefined, 4)}`)
    this.attach(`Link: ${JSON.stringify(linkGetRestockSuggestionPurchasing, undefined, 4)}`)
});

Then('User sends GET request to get restock suggestion purchasing of an above item', async function () {
    const options = {
        headers: this.headers
    }

    this.getRestockSuggestionPurchasingResponse = this.response = await purchasingRequest.getRestockSuggestionPurchasing(this.request, linkGetRestockSuggestionPurchasing, options);
    const responseBodyText = await this.getRestockSuggestionPurchasingResponse.text();
    if (this.getRestockSuggestionPurchasingResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getRestockSuggestionPurchasingResponseBody = JSON.parse(await this.getRestockSuggestionPurchasingResponse.body());
        logger.log('info', `Response GET ${linkGetRestockSuggestionPurchasing} >>>>>>` + JSON.stringify(this.getRestockSuggestionPurchasingResponseBody, undefined, 4));
        this.attach(`Response GET ${linkGetRestockSuggestionPurchasing} >>>>>>` + JSON.stringify(this.getRestockSuggestionPurchasingResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkGetRestockSuggestionPurchasing} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response GET ${linkGetRestockSuggestionPurchasing} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
});

Then(`{} checks average daily sales rate number of item in "Purchasing > Custom" as updated above`, async function (actor: string) {
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent2Day, `The weight of 2-day is equal ${randomWeightNumbers[0]}`).toEqual(randomWeightNumbers[0]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent7Day, `The weight of 7-day is equal ${randomWeightNumbers[1]}`).toEqual(randomWeightNumbers[1]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent14Day, `The weight of 14-day is equal ${randomWeightNumbers[2]}`).toEqual(randomWeightNumbers[2]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent30Day, `The weight of 30-day is equal ${randomWeightNumbers[3]}`).toEqual(randomWeightNumbers[3]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent60Day, `The weight of 60-day is equal ${randomWeightNumbers[4]}`).toEqual(randomWeightNumbers[4]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent90Day, `The weight of 90-day is equal ${randomWeightNumbers[5]}`).toEqual(randomWeightNumbers[5]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent180Day, `The weight of 180-day is equal ${randomWeightNumbers[6]}`).toEqual(randomWeightNumbers[6]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percentForecasted, `The weight of forecastRx demand is equal ${randomWeightNumbers[7]}`).toEqual(randomWeightNumbers[7]);
});

Then('User sets GET api endpoint to get list items in "Purchasing > My Suggested"', function () {
    linkItemsInPO = encodeURI(`${Links.API_SUMMARY_VENDOR_ITEMS_IN_PO}?offset=0&limit=100&where={"logic":"and","filters":[]}&vendorKey=null`);
    console.log(linkItemsInPO);
});

Then('User sends GET request to get list items in "Purchasing > My Suggested"', async function () {
    const payload = { "removedItemKeys": [] };
    this.getItemsinPOResponse = this.response = await vendorRequest.getItemsinPO(this.request, linkItemsInPO, payload, this.headers);
    const responseBodyText = await this.getItemsinPOResponse.text();
    if (this.getItemsinPOResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemsinPOResponseBody = JSON.parse(await this.getItemsinPOResponse.body());
        // logger.log('info', `Response POST ${linkItemsInPO} >>>>>>` + JSON.stringify(this.getItemsinPOResponseBody, undefined, 4));
        // this.attach(`Response POST ${linkItemsInPO} >>>>>>` + JSON.stringify(this.getItemsinPOResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response POST ${linkItemsInPO} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response POST ${linkItemsInPO} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
});

Then('User save a random item in above list suggested items', function () {
    // Use items with name have DefaultPurchasingSaleVelocity to check
    this.getRandomItemsinPurchasingSuggested = this.getItemsinPOResponseBody.model.filter((item: any) => !item.itemName.includes('DefaultPurchasingSaleVelocity'))
    // Pick random 1 item to check purchasing daily sales rate    
    this.radomAItemsInPurchasingSuggested = this.getRandomItemsinPurchasingSuggested[Math.floor(Math.random() * this.getRandomItemsinPurchasingSuggested.length)]
    this.responseBodyOfAItemObject = this.radomAItemsInPurchasingSuggested
    this.itemName = this.radomAItemsInPurchasingSuggested.itemName
    this.itemKey = this.radomAItemsInPurchasingSuggested.itemKey

    logger.log('info', `Item: ${JSON.stringify(this.radomAItemsInPurchasingSuggested, undefined, 4)}`)
    this.attach(`Item: ${JSON.stringify(this.radomAItemsInPurchasingSuggested, undefined, 4)}`)
});

Then(`{} checks average daily sales rate number of item in "Purchasing > My Suggested" must be the same settings of its supplier`, async function (actor: string) {
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent2Day, `The weight of 2-day is equal ${randomWeightNumbers[0]}`).toEqual(randomWeightNumbers[0]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent7Day, `The weight of 7-day is equal ${randomWeightNumbers[1]}`).toEqual(randomWeightNumbers[1]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent14Day, `The weight of 14-day is equal ${randomWeightNumbers[2]}`).toEqual(randomWeightNumbers[2]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent30Day, `The weight of 30-day is equal ${randomWeightNumbers[3]}`).toEqual(randomWeightNumbers[3]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent60Day, `The weight of 60-day is equal ${randomWeightNumbers[4]}`).toEqual(randomWeightNumbers[4]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent90Day, `The weight of 90-day is equal ${randomWeightNumbers[5]}`).toEqual(randomWeightNumbers[5]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent180Day, `The weight of 180-day is equal ${randomWeightNumbers[6]}`).toEqual(randomWeightNumbers[6]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percentForecasted, `The weight of forecastRx demand is equal ${randomWeightNumbers[7]}`).toEqual(randomWeightNumbers[7]);
});

Then('User save a random item in above list suggested items to assign supplier', function () {
    this.getRandomItemsinPurchasingSuggested = this.getItemsinPOResponseBody.model.filter((item: any) => item.itemName.includes('DefaultPurchasingSaleVelocity'))
    // Pick random 1 item to check purchasing daily sales rate    
    this.radomAItemsInPurchasingSuggested = this.getRandomItemsinPurchasingSuggested[Math.floor(Math.random() * this.getRandomItemsinPurchasingSuggested.length)]
    this.responseBodyOfAItemObject = this.radomAItemsInPurchasingSuggested
    this.itemName = this.radomAItemsInPurchasingSuggested.itemName
    this.itemKey = this.radomAItemsInPurchasingSuggested.itemKey

    logger.log('info', `Item: ${JSON.stringify(this.radomAItemsInPurchasingSuggested, undefined, 4)}`)
    this.attach(`Item: ${JSON.stringify(this.radomAItemsInPurchasingSuggested, undefined, 4)}`)
});

Then(`{} checks average daily sales rate number of item in "Purchasing > My Suggested" as updated above`, async function (actor: string) {
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent2Day, `The weight of 2-day is equal ${randomWeightNumbers[0]}`).toEqual(randomWeightNumbers[0]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent7Day, `The weight of 7-day is equal ${randomWeightNumbers[1]}`).toEqual(randomWeightNumbers[1]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent14Day, `The weight of 14-day is equal ${randomWeightNumbers[2]}`).toEqual(randomWeightNumbers[2]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent30Day, `The weight of 30-day is equal ${randomWeightNumbers[3]}`).toEqual(randomWeightNumbers[3]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent60Day, `The weight of 60-day is equal ${randomWeightNumbers[4]}`).toEqual(randomWeightNumbers[4]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent90Day, `The weight of 90-day is equal ${randomWeightNumbers[5]}`).toEqual(randomWeightNumbers[5]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent180Day, `The weight of 180-day is equal ${randomWeightNumbers[6]}`).toEqual(randomWeightNumbers[6]);
    expect(this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percentForecasted, `The weight of forecastRx demand is equal ${randomWeightNumbers[7]}`).toEqual(randomWeightNumbers[7]);
});
//////
Given(`User sets GET api endpoint to get list items in "Purchasing > Custom" to check default purchasing daily sales rate`, function () {    
    linkGetLimitFiveItemInCustom = `${Links.API_SUMMARY_ITEMS_IN_PURCHASING_CUSTOM}?offset=0&limit=5`
});

Given(`User sends a GET request to get list items in items in "Purchasing > Custom" to check default purchasing daily sales rate`, async function () {
    const options = {
        headers: this.headers
    }
    this.getLimitFiveItemResponse = this.response = await vendorRequest.getItemsinPurchasingCustom(this.request, linkGetLimitFiveItemInCustom, options);
    const responseBodyText = await this.getLimitFiveItemResponse.text();
    if (this.getLimitFiveItemResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getLimitFiveItemResponseBody = JSON.parse(await this.getLimitFiveItemResponse.body());
        logger.log('info', `Random object in response GET ${linkGetItemsInPurchasingCustom} >>>>>>` + JSON.stringify(this.getLimitFiveItemResponseBody, undefined, 4));
        this.attach(`Response object in response GET ${linkGetItemsInPurchasingCustom} >>>>>>` + JSON.stringify(this.getLimitFiveItemResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkGetItemsInPurchasingCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response GET ${linkGetItemsInPurchasingCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
});

Then(`{} sets GET api endpoint to get percent default of "Average"`, async function (actor: string) {
    linkGetPercentDefaultOfAverages = []
    for (const item of this.getLimitFiveItemResponseBody) {
        linkGetPercentDefaultOfAverages.push(`${Links.API_RESTOCK_SUGGESTION_PURCHASING}/${item.itemKey}/purchasing`)
        logger.log('info', `Link: ${JSON.stringify(item.itemKey, undefined, 4)}`)
        this.attach(`Link: ${JSON.stringify(item.itemKey, undefined, 4)}`)
    }

    for (const link of linkGetPercentDefaultOfAverages) {
        logger.log('info', `Link: ${JSON.stringify(link, undefined, 4)}`)
        this.attach(`Link: ${JSON.stringify(link, undefined, 4)}`)
    }
});

Then(`{} sends GET request to get percent default of "Average"`, async function (actor: string) {
    const options = {
        headers: this.headers
    }

    salesVelocitySettingDatas = []

    for (const linkGetPercentDefaultOfAverage of linkGetPercentDefaultOfAverages) {
        this.getRestockSuggestionPurchasingResponse = this.response = await purchasingRequest.getRestockSuggestionPurchasing(this.request, linkGetPercentDefaultOfAverage, options);
        const responseBodyText = await this.getRestockSuggestionPurchasingResponse.text();
        if (this.getRestockSuggestionPurchasingResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
            this.responseBody = this.getRestockSuggestionPurchasingResponseBody = JSON.parse(await this.getRestockSuggestionPurchasingResponse.body());
            const salesVelocitySettingData = this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData
            salesVelocitySettingDatas.push(salesVelocitySettingData)
            logger.log('info', `Response GET ${linkGetPercentDefaultOfAverage} >>>>>>` + JSON.stringify(this.getRestockSuggestionPurchasingResponseBody, undefined, 4));
            this.attach(`Response GET ${linkGetPercentDefaultOfAverage} >>>>>>` + JSON.stringify(this.getRestockSuggestionPurchasingResponseBody, undefined, 4))
        }
        else {
            const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
            logger.log('info', `Response GET ${linkGetRestockSuggestionPurchasing} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
            this.attach(`Response GET ${linkGetRestockSuggestionPurchasing} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
        }
    }
});

Then(`{} checks the percent default of "Average" is the same as setting in company default`, async function (actor: string) {
    const percentDefaultOfAverage: number[] = [0, 20, 0, 20, 10, 0, 0, 50]
    for (const salesVelocitySettingData of salesVelocitySettingDatas) {
        expect.soft(salesVelocitySettingData.percent2Day, `The weight of 2-day is equal ${percentDefaultOfAverage[0]}`).toEqual(percentDefaultOfAverage[0]);
        expect.soft(salesVelocitySettingData.percent7Day, `The weight of 7-day is equal ${percentDefaultOfAverage[1]}`).toEqual(percentDefaultOfAverage[1]);
        expect.soft(salesVelocitySettingData.percent14Day, `The weight of 14-day is equal ${percentDefaultOfAverage[2]}`).toEqual(percentDefaultOfAverage[2]);
        expect.soft(salesVelocitySettingData.percent30Day, `The weight of 30-day is equal ${percentDefaultOfAverage[3]}`).toEqual(percentDefaultOfAverage[3]);
        expect.soft(salesVelocitySettingData.percent60Day, `The weight of 60-day is equal ${percentDefaultOfAverage[4]}`).toEqual(percentDefaultOfAverage[4]);
        expect.soft(salesVelocitySettingData.percent90Day, `The weight of 90-day is equal ${percentDefaultOfAverage[5]}`).toEqual(percentDefaultOfAverage[5]);
        expect.soft(salesVelocitySettingData.percent180Day, `The weight of 180-day is equal ${percentDefaultOfAverage[6]}`).toEqual(percentDefaultOfAverage[6]);
        expect.soft(salesVelocitySettingData.percentForecasted, `The weight of forecastRx demand is equal ${percentDefaultOfAverage[7]}`).toEqual(percentDefaultOfAverage[7]);
    }
});

Given(`User sets GET api endpoint to get list items in "Purchasing > My Suggested" to check default purchasing daily sales rate`, function () {    
    linkGetLimitFiveItemInMySuggested = encodeURI(`${Links.API_SUMMARY_VENDOR_ITEMS_IN_PO}?offset=0&limit=5&where={"logic":"and","filters":[]}&vendorKey=null`);
});

Given(`User sends a GET request to get list items in items in "Purchasing > My Suggested" to check default purchasing daily sales rate`, async function () {
    const payload = { "removedItemKeys": [] };
    this.getItemInPOResponse = this.response = await vendorRequest.getItemsinPO(this.request, linkGetLimitFiveItemInMySuggested, payload, this.headers);
    const responseBodyText = await this.getItemInPOResponse.text();
    if (this.getItemInPOResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemInPOResponseBody = JSON.parse(await this.getItemInPOResponse.body());
        logger.log('info', `Response POST ${linkGetLimitFiveItemInMySuggested} >>>>>>` + JSON.stringify(this.getItemInPOResponseBody, undefined, 4));
        this.attach(`Response POST ${linkGetLimitFiveItemInMySuggested} >>>>>>` + JSON.stringify(this.getItemInPOResponseBody, undefined, 4))

        this.getLimitFiveItemResponseBody = this.getItemInPOResponseBody.model
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response POST ${linkGetLimitFiveItemInMySuggested} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Response POST ${linkGetLimitFiveItemInMySuggested} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
});

Given(`User sets GET api endpoint to get list items in "Manage Company > Items" to check default purchasing daily sales rate`, function () {
    // Use items with name DefaultPurchasingSaleVelocity to check
    linkGetLimitFiveItemInItems = encodeURI(`${Links.API_ITEMS}?offset=0&limit=5&where={"logic":"and","filters":[{"filters":[{"field":"name","operator":"contains","value":"DefaultPurchasingSaleVelocity"}],"logic":"and"}]}`)
});

Given(`User sends a GET request to get list items in items in "Manage Company > Items" to check default purchasing daily sales rate`, async function () {
    const options = {
        headers: this.headers
    }

    this.getLimitFiveItemsResponse = this.response = await itemRequest.getItems(this.request, linkGetLimitFiveItemInItems, options);
    const responseBodyText = await this.getLimitFiveItemsResponse.text();
    if (this.getLimitFiveItemsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getLimitFiveItemsResponseBody = JSON.parse(await this.getLimitFiveItemsResponse.text());
        logger.log('info', `Response GET ${linkGetLimitFiveItemInItems}` + JSON.stringify(this.getLimitFiveItemsResponseBody, undefined, 4));
        this.attach(`Response GET ${linkGetLimitFiveItemInItems}` + JSON.stringify(this.getLimitFiveItemsResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkGetLimitFiveItemInItems} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${linkGetLimitFiveItemInItems} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
});

