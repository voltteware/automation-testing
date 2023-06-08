import { When, Then, Given, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as itemRequest from '../../../../src/api/request/item.service';
import * as vendorRequest from '../../../../src/api/request/vendor.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";
import * as keyword from '../../../../src/utils/actionwords'
import exp from 'constants';
import { itemInfoResponseSchema } from '../assertion/dashboard/itemAssertionSchema';

let linkUpdateVendorSalesVelocitySettings: any;
let linkUpdateItemSalesVelocitySettings: any;
let linkGetItemsWithFilter: any;
let linkGetItemSalesVelocitySettings: any;
let linkGetAItemFilterByName: any;
let link: string;
var linkGetAllItems: string;
var linkGetFilterItem: string;
let linkCountItems: string;
let linkGetItems: string;
var linkGetActiveAndHasLotMultipleItemKeyNullItem: string;
let linkItemKey: any;
let linkItemByFiltered: any;
let linkCountItemsThatIsHidden: any;

Then(`{} sets GET api endpoint to get item summary`, async function (actor: string) {
    link = `${Links.API_ITEMS}?summary=true&companyKey=${this.companyKey}&companyType=${this.companyType}`;
});

Then(`{} sets GET api endpoint to get item with limit row: {}`, async function (actor, limitRow: string) {
    linkGetItems = `${Links.API_ITEMS}?offset=0&limit=${limitRow}&where={"logic":"and","filters":[{"logic":"and","filters":[{"field":"isHidden","operator":"eq","value":false}]}]}`;
});

Then(`{} sets GET api endpoint to get items that have purchase as`, async function (actor) {
    linkGetItems = `${Links.API_ITEMS}?offset=0&limit=100&where={"filters":[{"filters":[{"field":"lotMultipleItemName","operator":"isnotnull","value":null}],"logic":"and"}],"logic":"and"}`
});

Then(`{} sets GET api endpoint to get items that have not purchase as`, async function (actor) {
    linkGetItems = `${Links.API_ITEMS}?offset=0&limit=50&where={"filters":[{"filters":[{"field":"lotMultipleItemName","operator":"isnull","value":null}],"logic":"and"}],"logic":"and"}`
});

Then(`{} finds the list items contain value: {}`, async function (actor, valueContain: string) {
    let link = `${Links.API_ITEMS}?offset=0&limit=10&where={"filters":[{"filters":[{"field":"name","operator":"contains","value":"${valueContain}"}],"logic":"and"}],"logic":"and"}`;
    const options = {
        headers: this.headers
    }
    this.getItemsResponse = this.response = await itemRequest.getItems(this.request, link, options);
    const responseBodyText = await this.getItemsResponse.text();
    if (this.getItemsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemsResponseBody = JSON.parse(await this.getItemsResponse.text());
        logger.log('info', `Response GET ${linkGetItems}` + JSON.stringify(this.getItemsResponseBody, undefined, 4));
        this.attach(`Response GET ${linkGetItems}` + JSON.stringify(this.getItemsResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkGetItems} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${linkGetItems} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
});

Then(`{} set GET api endpoint to get items with name contains {string}`, async function (actor, containText: string) {
    containText === 'itemInListItemInPO' ? containText = this.randomAItemObject.itemName : containText === 'itemInEditedSupplyAbove' ? containText = this.editSupplyResponseBody.itemName : containText === 'itemInEditedDemandAbove' ? containText = this.editDemandResponseBody.itemName : undefined
    linkGetItems = `${Links.API_ITEMS}?offset=0&limit=2&where={"filters":[{"filters":[{"field":"name","operator":"contains","value":"${containText}"}],"logic":"and"},{"filters":[{"field":"isHidden","operator":"eq","value":true},{"field":"isHidden","operator":"eq","value":false}],"logic":"or"}],"logic":"and"}`
});

Then(`{} set GET api endpoint to get item that is hidden`, async function (actor) {
    linkGetItems = `${Links.API_ITEMS}?offset=0&limit=1&where={"filters":[{"filters":[{"field":"name","operator":"eq","value":"${this.nameOfHiddenItem}"}],"logic":"and"}],"logic":"and"}`
});

Then(`{} checks doNotOrder function: {}`, async function (actor: string, option: boolean) {
    switch (option) {
        case true:
            // when find HB-02-PC1-825-BLK-K in Purchasing maybe will get two results: HB-02-PC1-825-BLK-K and HB-02-PC1-825-BLK-K-2PACK
            if (this.getItemsInPurchasingCustomResponseBody.length > 0) {
                const result = this.getItemsInPurchasingCustomResponseBody.itemName === `${this.itemName}`;
                expect(result).toBe(false);
                break;
            }
            expect(this.getItemsInPurchasingCustomResponseBody.length).toEqual(0);
            break;
        case false:
            if (this.getItemsInPurchasingCustomResponseBody.length > 0) {
                expect(this.getItemsInPurchasingCustomResponseBody.length).toBeGreaterThanOrEqual(1);
                break;
            }
            logger.log('info', "getItemsInPurchasingCustomResponseBody:: " + this.getItemsInPurchasingCustomResponseBody.length + " => Please check on the UI");
            this.attach("getItemsInPurchasingCustomResponseBody:: " + this.getItemsInPurchasingCustomResponseBody.length + " => Please check on the UI");
            expect(this.getItemsInPurchasingCustomResponseBody.length).toBeGreaterThan(0);
            break;
    }
});

Then(`{} checks doNotRestock function: {}`, async function (actor: string, option: boolean) {
    switch (option) {
        case true:
            // when find HB-02-PC1-825-BLK-K in RestockAMZ maybe will get two results: HB-02-PC1-825-BLK-K and HB-02-PC1-825-BLK-K-2PACK
            if (this.restockSuggestionResponseBody.length > 0) {
                const result = this.restockSuggestionResponseBody.forecastconstant.itemName === `${this.itemName}`;
                expect(result).toBe(false);
                break;
            }
            expect(this.restockSuggestionResponseBody.length).toEqual(0);
            break;
        case false:
            if (this.restockSuggestionResponseBody.length > 0) {
                expect(this.restockSuggestionResponseBody.length).toBeGreaterThanOrEqual(1);
                break;
            }
            logger.log('info', "restockSuggestionResponseBody:: " + this.restockSuggestionResponseBody.length + " => Please check on the UI");
            this.attach("restockSuggestionResponseBody:: " + this.restockSuggestionResponseBody.length + " => Please check on the UI");
            expect(this.restockSuggestionResponseBody.length).toBeGreaterThan(0);
            break;
    }
});

Then(`{} set GET api endpoint to count item that is hidden`, async function (actor) {
    linkCountItemsThatIsHidden = encodeURI(`${Links.API_ITEM_COUNT}?where={"filters":[{"filters":[{"field":"isHidden","operator":"eq","value":"true"}],"logic":"and"}],"logic":"and"}`);
});

Then(`{} sets GET api endpoint to count items that is active and have lotMultipleItemKey is NULL`, async function (actor: string) {
    linkCountItems = linkGetActiveAndHasLotMultipleItemKeyNullItem = encodeURI(`${Links.API_ITEM_COUNT}?where={"filters":[{"filters":[{"field":"isHidden","operator":"eq","value":false},{"field":"isHidden","operator":"eq","value":null},{"field":"isHidden","operator":"eq","value":null}],"logic":"or"},{"filters":[{"field":"lotMultipleItemName","operator":"isnull","value":null}],"logic":"and"}],"logic":"and"}`);
});

Then('{} sets GET api endpoint to get items with filtered', async function (actor: string, dataTable: DataTable) {
    var limitRow: string = dataTable.hashes()[0].limitRow;
    var field1: string = dataTable.hashes()[0].field1;
    var value1: string = dataTable.hashes()[0].value1;
    var field2: string = dataTable.hashes()[0].field2;
    var value2: string = dataTable.hashes()[0].value2;
    linkGetItems = linkGetFilterItem = `${Links.API_ITEMS}?offset=0&limit=${limitRow}&where={"filters":[{"filters":[{"field":"${field1}","operator":"eq","value":${value1}},{"field":"${field1}","operator":"eq","value":null},{"field":"${field1}","operator":"eq","value":null},{"field":"${field1}","operator":"eq","value":null}],"logic":"or"},{"filters":[{"field":"${field2}","operator":"eq","value":${value2}},{"field":"${field2}","operator":"eq","value":null}],"logic":"or"}],"logic":"and"}`

    logger.log('info', `linkGetItems:: ` + linkGetItems);
    this.attach(`linkGetItems:: ` + linkGetItems);
});

Then(`{} sets GET api endpoint to get items with limit row: {} and filter field: {} equals {}`, async function (actor, limitRow, filterField, filterValue: string) {
    linkGetItems = linkGetFilterItem = encodeURI(`${Links.API_ITEMS}?offset=0&limit=${limitRow}&where={"logic":"and","filters":[{"filters":[{"field":"${filterField}","operator":"eq","value":${filterValue}}],"logic":"and"}]}`);
});

Then(`{} sends a GET request to get count items active and have lotMultipleItemKey is NULL`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getCountItemsActiveAndHasLotMultipleItemKeyNullResponse = this.response = await itemRequest.getItems(this.request, linkGetActiveAndHasLotMultipleItemKeyNullItem, options);
    const responseBodyText = await this.getCountItemsActiveAndHasLotMultipleItemKeyNullResponse.text();
    if (this.getCountItemsActiveAndHasLotMultipleItemKeyNullResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getCountItemsActiveAndHasLotMultipleItemKeyNullResponseBody = JSON.parse(await this.getCountItemsActiveAndHasLotMultipleItemKeyNullResponse.body());
        logger.log('info', `Response GET ${linkGetActiveAndHasLotMultipleItemKeyNullItem}>>>>>` + JSON.stringify(this.getCountItemsActiveAndHasLotMultipleItemKeyNullResponseBody, undefined, 4));
        this.attach(`Response GET ${linkGetActiveAndHasLotMultipleItemKeyNullItem}>>>>>>` + JSON.stringify(this.getCountItemsActiveAndHasLotMultipleItemKeyNullResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkGetActiveAndHasLotMultipleItemKeyNullItem} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>>${responseBodyText}`);
        this.attach(`Response GET ${linkGetActiveAndHasLotMultipleItemKeyNullItem} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>>${actualResponseText}`)
    }
})

Then(`{} sends a GET request to get count items`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getCountItemsActiveResponse = this.response = await itemRequest.getItems(this.request, this.linkCountItems, options);
    const responseBodyText = await this.getCountItemsActiveResponse.text();
    if (this.getCountItemsActiveResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getCountItemsActiveResponseBody = JSON.parse(await this.getCountItemsActiveResponse.body());
        this.countItem = this.getCountItemsActiveResponseBody;
        logger.log('info', `Response GET ${linkCountItems}>>>>>` + JSON.stringify(this.getCountItemsActiveResponseBody, undefined, 4));
        this.attach(`Response GET ${linkCountItems}>>>>>>` + JSON.stringify(this.getCountItemsActiveResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkCountItems} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>>${responseBodyText}`);
        this.attach(`Response GET ${linkCountItems} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>>${actualResponseText}`)
    }
})

Then('{} sends GET api endpoint to count item that is hidden', async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getCountItemsThatIsHiddenResponse = await itemRequest.getCountItemsThatIsHidden(this.request, linkCountItemsThatIsHidden, options);
    const responseBodyText = await this.getCountItemsThatIsHiddenResponse.text();
    if (this.getCountItemsThatIsHiddenResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getCountItemsThatIsHiddenResponseBody = JSON.parse(await this.getCountItemsThatIsHiddenResponse.text());
        logger.log('info', `Response GET ${linkCountItemsThatIsHidden}>>>>>` + JSON.stringify(this.getCountItemsThatIsHiddenResponseBody, undefined, 4));
        this.attach(`Response GET ${linkCountItemsThatIsHidden}>>>>>>` + JSON.stringify(this.getCountItemsThatIsHiddenResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkCountItemsThatIsHidden} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>>${responseBodyText}`);
        this.attach(`Response GET ${linkCountItemsThatIsHidden} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>>${actualResponseText}`)
    }
})

Then(`{} sends a GET request to get list items`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getItemsResponse = this.response = await itemRequest.getItems(this.request, linkGetItems, options);
    const responseBodyText = await this.getItemsResponse.text();
    if (this.getItemsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemsResponseBody = JSON.parse(await this.getItemsResponse.text());
        logger.log('info', `Response GET ${linkGetItems}` + JSON.stringify(this.getItemsResponseBody, undefined, 4));
        this.attach(`Response GET ${linkGetItems}` + JSON.stringify(this.getItemsResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkGetItems} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${linkGetItems} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
})

Then('User checks that there are no item in list', function () {
    expect(this.getItemsResponseBody.length).toEqual(0)
});

Then('{} checks API contract essential types in the response of hidden item are correct', async function (actor: string) {
    itemInfoResponseSchema.parse(this.editItemResponseBody);
});

Then(`{} sends GET api request to get all items`, async function (actor: string) {
    const linkGetItemCount = `${Links.API_ITEMS}/count`
    const getItemCountResponse = await itemRequest.getItemCount(this.request, linkGetItemCount, { headers: this.headers });
    expect(getItemCountResponse.status()).toBe(200);
    const totalItemsCount = Number(await getItemCountResponse.text());
    this.countItem = totalItemsCount;
    logger.log('info', `Total Items: ${totalItemsCount}`);
    this.attach(`Total Items: ${totalItemsCount}`)
    linkGetAllItems = `${Links.API_ITEMS}?offset=0&limit=${totalItemsCount}`;

    this.getAllItemsResponse = await itemRequest.getItemCount(this.request, linkGetAllItems, { headers: this.headers });

    const responseBodyText = await this.getAllItemsResponse.text();
    if (this.getAllItemsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getAllItemsResponseBody = JSON.parse(responseBodyText);
    }
    else {
        logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()}`);
        this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
    }
});

Then(`{} sends a GET request to get item summary`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getItemSummaryResponse = this.response = await itemRequest.getItemSummary(this.request, link, options);
    const responseBodyText = await this.getItemSummaryResponse.text();
    if (this.getItemSummaryResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemSummaryResponseBody = JSON.parse(responseBodyText);
        logger.log('info', `Response GET ${link}` + JSON.stringify(this.getItemSummaryResponseBody, undefined, 4));
        this.attach(`Response GET ${link}` + JSON.stringify(this.getItemSummaryResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${link} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
})

Given('User picks a random item in above list items', async function () {
    // expect(this.getItemsResponseBody.length, 'There is at least 1 item to pick random').toBeGreaterThanOrEqual(1);
    this.responseBodyOfAItemObject = await this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
    this.randomItem = this.responseBodyOfAItemObject;
    this.itemHistoryLengthInDay = this.responseBodyOfAItemObject.itemHistoryLengthInDay;
    logger.log('info', `Random Item: ${JSON.stringify(this.responseBodyOfAItemObject, undefined, 4)}`);
    this.attach(`Random Item: ${JSON.stringify(this.responseBodyOfAItemObject, undefined, 4)}`);
});

When('{} picks {} random items in above list items', async function (actor, quantity: number) {
    this.itemsPickedRandomArray = itemRequest.getMultipleRandom(this.getItemsResponseBody, quantity);
    return this.itemsPickedRandomArray;
});

Given('User saves list items that have already set as purchas as of orther items', async function () {
    // expect(this.getItemsResponseBody.length, 'There is at least 1 item to pick random').toBeGreaterThanOrEqual(1);
    this.listItemsAlreadySetAsPurchaseAsOfOrtherItem = this.getItemsResponseBody.map((item: any) => item.lotMultipleItemKey)
    logger.log('info', `list items that have already set as purchas as of orther items: ${JSON.stringify(this.listItemsAlreadySetAsPurchaseAsOfOrtherItem, undefined, 4)}`);
    this.attach(`list items that have already set as purchas as of orther items: ${JSON.stringify(this.listItemsAlreadySetAsPurchaseAsOfOrtherItem, undefined, 4)}`);
});

Given('{} picks a random item which does not have Purchase As', async function (actor: string) {
    expect(this.getItemsResponseBody.length, 'There is at least 1 item to pick random').toBeGreaterThanOrEqual(1);
    // Get items which are not related to Purchase As
    this.listItemsNotPurchaseAs = this.getItemsResponseBody.filter((item: any) => item.lotMultipleItemKey == null && item.lotMultipleItemName == null);
    this.responseBodyOfAItemObject = await this.listItemsNotPurchaseAs[Math.floor(Math.random() * this.listItemsNotPurchaseAs.length)];
    logger.log('info', `Random Item: ${JSON.stringify(this.responseBodyOfAItemObject, undefined, 4)}`);
    this.attach(`Random Item: ${JSON.stringify(this.responseBodyOfAItemObject, undefined, 4)}`);
});

Given('User picks max 10 random items in the above list items', async function () {
    // Add this if else condition to skip test in Purchasing My Suggested if system only show Items without Suppliers, there is no item has Supplier Name not null. 
    if (this.getItemsResponseBody != undefined || null) {
        const shuffledArr = this.getItemsResponseBody.sort(() => Math.random() - 0.5);
        this.randomMax10Items = shuffledArr.slice(0, 10)
        logger.log('info', `Random Item: ${JSON.stringify(this.randomMax10Items, undefined, 4)}`);
        this.attach(`Random Item: ${JSON.stringify(this.randomMax10Items, undefined, 4)}`);
    }
    else {
        this.randomMax10Items = null;
        logger.log('info', `There is no item in getItemsResponseBody`);
        this.attach(`There is no item in getItemsResponseBody`);
    }
});

Then(`{} checks random items has status is Active`, async function (actor) {
    // Add this if else condition to skip test in Purchasing My Suggested if system only show Items without Suppliers, there is no item has Supplier Name not null. 
    if (this.randomMax10Items != undefined || null) {
        const options = {
            headers: this.headers
        }

        // const maxRandomItemNumbers = this.getCountItemsinPurchasingCustomResponseBody > 10 ? 10 : this.getCountItemsinPurchasingCustomResponseBody;
        // const randomMax10Items: any = _.sampleSize(this.getItemsinPurchasingCustomResponseBody, maxRandomItemNumbers);
        for await (const item of this.randomMax10Items) {
            var itemKey = item.itemKey || item.key;
            const detailItemLink = `${Links.API_ITEMS}/${itemKey}`;
            var itemDetailResponse = await itemRequest.getItems(this.request, detailItemLink, options);
            var itemDetailResponseText = await itemDetailResponse.text();
            if (itemDetailResponse.status() == 200 && !itemDetailResponseText.includes('<!doctype html>')) {
                const itemDetailResponseBody = JSON.parse(itemDetailResponseText);
                logger.log('info', `Response GET ${detailItemLink} >>>>>>` + JSON.stringify(itemDetailResponseBody, undefined, 4));
                this.attach(`Response GET ${detailItemLink} >>>>>>` + JSON.stringify(itemDetailResponseBody, undefined, 4))
                expect(itemDetailResponseBody.isHidden, `Check item ${itemKey} has isHidden = false`).toBeFalsy();
            }
            else {
                const actualResponseText = itemDetailResponseText.includes('<!doctype html>') ? 'html' : itemDetailResponseText;
                logger.log('info', `Response GET ${detailItemLink} has status code ${itemDetailResponse.status()} ${itemDetailResponse.statusText()} and response body >>>>>> ${itemDetailResponseText}`);
                this.attach(`Response GET ${detailItemLink} has status code ${itemDetailResponse.status()} ${itemDetailResponse.statusText()} and response body >>>>>> ${actualResponseText}`);
                expect(itemDetailResponse.status()).toEqual(200);
            }
        }
    }
    else {
        logger.log('info', `There is no item`);
        this.attach(`There is no item`);
    }
})

Then(`{} checks supplier name of above random items in Manage Company Items`, async function (actor: string) {
    if (this.randomMax10Items != undefined || null) {
        const options = {
            headers: this.headers
        }

        for (const item of this.randomMax10Items) {
            const itemName = item.itemName;
            linkGetItemsWithFilter = `${Links.API_ITEMS}?offset=0&limit=100&where={"filters":[{"filters":[{"field":"name","operator":"contains","value":"${itemName}"}],"logic":"and"}],"logic":"and"}`;
            const itemInMangeCompanyItemsResponse = await itemRequest.getItems(this.request, linkGetItemsWithFilter, options);
            const responseBodyText = await itemInMangeCompanyItemsResponse.text();
            if (itemInMangeCompanyItemsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
                const itemInMangeCompanyItemsResponseBody = JSON.parse(responseBodyText);
                const vendorName = itemInMangeCompanyItemsResponseBody[0].vendorName;
                logger.log('info', `Vendor Name of ${itemName} >>>>>> ${vendorName}`);
                this.attach(`Vendor Name of ${itemName} >>>>>> ${vendorName}`);
                expect(vendorName, `Vendor Name of ${itemName} should be ${vendorName}`).toBe(this.selectedVendorName);
            }
            else {
                const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
                logger.log('info', `Response GET ${linkGetItemsWithFilter} has status code ${itemInMangeCompanyItemsResponse.status()} ${itemInMangeCompanyItemsResponse.statusText()} and response body >>>>>> ${responseBodyText}`);
                this.attach(`Response GET ${linkGetItemsWithFilter} has status code ${itemInMangeCompanyItemsResponse.status()} ${itemInMangeCompanyItemsResponse.statusText()} and response body >>>>>> ${actualResponseText}`)
            }
        }
    }
    else {
        logger.log('info', `There is no item`);
        this.attach(`There is no item`);
    }
});

// Given('User picks a random item in above list items', async function () {
//     this.responseBodyOfAItemObject = await this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
//     logger.log('info', `Random Item: ${JSON.stringify(this.responseBodyOfAItemObject, undefined, 4)}`);
//     this.attach(`Random Item: ${JSON.stringify(this.responseBodyOfAItemObject, undefined, 4)}`);
// });

Then(`{} saves the item key`, async function (actor: string) {
    this.itemKey = this.responseBodyOfAItemObject.key;
    this.itemName = this.responseBodyOfAItemObject.name;
    logger.log('info', `Item name: ${this.itemName}`);
    this.attach(`Item name: ${this.itemName}`);
    logger.log('info', `Item key: ${this.itemKey}`);
    this.attach(`Item key: ${this.itemKey}`);
});

Then(`{} sets api endpoint to edit some values of a item`, async function (actor: string, dataTable: DataTable) {
    link = `${Links.API_ITEMS}/${this.itemKey}`
    logger.log('info', `Link edit item: ${link}`);
    this.attach(`Link edit item: ${link}`);

    const rows = dataTable.hashes();
    const { purchaseAs, isHidden, supplierName, supplierPrice, moq, onHandFbaQty, onHandFbmQty, serviceLevel, warehouseQty, description, leadTime, orderInterval, casePackQty, tags, onHandQtyMin, wareHouseQtyMin, inventorySourcePreference, doNotOrder } = rows[0]
    this.payLoad = this.responseBodyOfAItemObject

    if (doNotOrder === 'false') {
        this.payLoad.doNotOrder = false
    }

    if (supplierName === 'random') {
        const excludedSupplierKey = this.responseBodyOfAItemObject.vendorKey

        // Filter out the excluded supplier have excludedSupplierKey from the list suppliers
        const filteredArray = this.getSupplierResponseBody.filter((supplier: any) => supplier.key !== excludedSupplierKey);
        const randomSupplier = filteredArray[Math.floor(Math.random() * filteredArray.length)];
        logger.log('info', `Random supplier` + JSON.stringify(randomSupplier, undefined, 4));
        this.attach(`Random supplier` + JSON.stringify(randomSupplier, undefined, 4))

        this.payLoad.vendorKey = randomSupplier.key;
        this.payLoad.vendorName = randomSupplier.name;
    } else if (supplierName === 'null') {
        this.payLoad.vendorKey = null;
        this.payLoad.vendorName = null;
    } else if (supplierName === 'supplierUpdatedSalesVelocity') {
        this.payLoad.vendorKey = this.supplierKey;
        this.payLoad.vendorName = this.supplierName;
    }

    if (supplierPrice === 'random') {
        this.payLoad.vendorPrice = Number(faker.random.numeric());
    }

    if (moq === 'random') {
        this.payLoad.moq = Number(faker.random.numeric());
    }

    if (onHandFbaQty === 'random') {
        this.payLoad.onHand = Number(faker.random.numeric(1));
    }

    if (onHandFbmQty === 'random') {
        this.payLoad.onHandFbm = Number(faker.random.numeric(1));
    }

    if (serviceLevel === 'random') {
        this.payLoad.serviceLevel = Number(faker.random.numeric(1));
    }

    if (warehouseQty === 'random') {
        this.payLoad.onHandThirdParty = Number(faker.random.numeric(1));
    }

    if (description === 'random') {
        this.payLoad.description = faker.lorem.words(3);
    }

    if (leadTime === 'random') {
        this.payLoad.leadTime = Number(faker.datatype.number({
            'min': 1,
            'max': 365
        }));
    }

    if (orderInterval === 'random') {
        this.payLoad.orderInterval = Number(faker.random.numeric());
    }

    if (casePackQty == 'random') {
        this.payLoad.lotMultipleQty = Number(faker.random.numeric(1));
    }

    if (tags === 'random') {
        // TODO: If there is a tag, delete it, if not, add a new tag
        const tags = this.payLoad.tags
        if (tags.length < 3) {
            tags.push(`Tag${Number(faker.random.numeric(2))}`)
        } else {
            tags.shift()
        }

        this.payLoad.tags = tags
    }

    if (onHandQtyMin === 'random') {
        this.payLoad.onHandMin = Number(faker.random.numeric(1));
    }

    if (wareHouseQtyMin === 'random') {
        this.payLoad.onHandThirdPartyMin = Number(faker.random.numeric(1));
    }

    if (inventorySourcePreference == 'random') {
        const inventorySources = ['FBA', 'FBM', 'FBA+FBM'];
        const excludedInventorySource = this.responseBodyOfAItemObject.inventorySourcePreference;

        // Filter out the excluded inventory source value from the inventorySources array
        const filteredArray = inventorySources.filter((value) => value !== excludedInventorySource);
        this.payLoad.inventorySourcePreference = filteredArray[Math.floor(Math.random() * filteredArray.length)];
    }

    if (isHidden === 'false') {
        this.payLoad.isHidden = false
    }

    if (purchaseAs === 'null') {
        this.payLoad.lotMultipleItemName = null
        this.payLoad.lotMultipleItemKey = null
    }

    logger.log('info', `Payload edit some values of item` + JSON.stringify(this.payLoad, undefined, 4));
    this.attach(`Payload edit some values of item` + JSON.stringify(this.payLoad, undefined, 4))
});

Given('User sets PUT api endpoint to edit {} of the above item for company type {} with new value: {}', async function (editColumn: string, companyType: string, value: string) {
    // Prepare endpoint for request to edit item
    link = `${Links.API_ITEMS}/${this.itemKey === undefined ? this.responseBodyOfAItemObject.key : this.itemKey}`

    this.payLoad = this.responseBodyOfAItemObject

    switch (editColumn) {
        case 'itemName':
            if (value == 'random') {
                this.name = `${faker.random.alphaNumeric(10).toUpperCase()}-${faker.datatype.number(500)}-Auto`;
            }

            logger.log('info', `New ${editColumn}: ${this.name}`);
            this.attach(`New ${editColumn}: ${this.name}`);

            this.payLoad.name = this.name
            break;
        case 'asin':
            if (value == 'random') {
                this.asin = `${faker.random.alphaNumeric(10).toUpperCase()}`;
            }

            logger.log('info', `New ${editColumn}: ${this.asin}`);
            this.attach(`New ${editColumn}: ${this.asin}`);

            this.payLoad.asin = this.asin
            break;
        case 'fnsku':
            if (value == 'random') {
                this.fnsku = `${faker.random.alphaNumeric(10).toUpperCase()}`;
            }

            logger.log('info', `New ${editColumn}: ${this.fnsku}`);
            this.attach(`New ${editColumn}: ${this.fnsku}`);

            this.payLoad.fnsku = this.fnsku
            break;
        case 'description':
            if (value == 'random') {
                this.description = faker.lorem.words(3);
            }

            logger.log('info', `New ${editColumn}: ${this.description}`);
            this.attach(`New ${editColumn}: ${this.description}`);

            this.payLoad.description = this.description
            break;
        case 'supplierName':
            if (value == 'random') {
                const excludedSupplierKey = this.responseBodyOfAItemObject.vendorKey

                // Filter out the excluded supplier have excludedSupplierKey from the list suppliers                
                const filteredArray = this.getSupplierResponseBody.filter((supplier: any) => supplier.key !== excludedSupplierKey);
                const randomSupplier = filteredArray[Math.floor(Math.random() * filteredArray.length)];
                logger.log('info', `Random supplier` + JSON.stringify(randomSupplier, undefined, 4));
                this.attach(`Random supplier` + JSON.stringify(randomSupplier, undefined, 4))

                if (randomSupplier === undefined) {
                    this.vendorKey = null
                    this.vendorName = null
                } else {
                    this.vendorKey = randomSupplier.key;
                    this.vendorName = randomSupplier.name;
                }
            } else if (value == 'supplierUpdatedSalesVelocity') {
                this.vendorKey = this.supplierKey;
                this.vendorName = this.supplierName;
            } else if (value == 'null') {
                this.vendorKey = null
                this.vendorName = null
            }

            logger.log('info', `New ${editColumn}: ${this.vendorName} - ${this.supplierKey}`);
            this.attach(`New ${editColumn}: ${this.vendorName} - ${this.supplierKey}`);

            this.payLoad.vendorKey = this.vendorKey
            this.payLoad.vendorName = this.vendorName
            break;
        case 'supplierPrice':
            if (value == 'random') {
                this.vendorPrice = Number(faker.random.numeric());
            }

            logger.log('info', `New ${editColumn}: ${this.vendorPrice}`);
            this.attach(`New ${editColumn}: ${this.vendorPrice}`);

            this.payLoad.vendorPrice = this.vendorPrice
            break;
        case 'moq':
            if (value == 'random') {
                this.moq = Number(faker.random.numeric());
            }

            logger.log('info', `New ${editColumn}: ${this.moq}`);
            this.attach(`New ${editColumn}: ${this.moq}`);

            this.payLoad.moq = this.moq
            break;
        case 'leadTime':
            if (value == 'random') {
                this.leadTime = Number(faker.datatype.number({
                    'min': 1,
                    'max': 365
                }));
            }

            logger.log('info', `New ${editColumn}: ${this.leadTime}`);
            this.attach(`New ${editColumn}: ${this.leadTime}`);

            this.payLoad.leadTime = this.leadTime
            break;
        case 'orderInterval':
            if (value == 'random') {
                this.orderInterval = Number(faker.random.numeric());
            }

            logger.log('info', `New ${editColumn}: ${this.orderInterval}`);
            this.attach(`New ${editColumn}: ${this.orderInterval}`);

            this.payLoad.orderInterval = this.orderInterval
            break;
        case 'serviceLevel':
            if (value == 'random') {
                this.serviceLevel = Number(faker.random.numeric(2));
            }

            logger.log('info', `New ${editColumn}: ${this.serviceLevel}`);
            this.attach(`New ${editColumn}: ${this.serviceLevel}`);

            this.payLoad.serviceLevel = this.serviceLevel
            break;
        case 'onHanFBAQty':
            if (value == 'random') {
                this.onHand = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.onHand}`);
            this.attach(`New ${editColumn}: ${this.onHand}`);

            this.payLoad.onHand = this.onHand
            break;
        case 'onHanQty':
            if (value == 'random') {
                this.onHand = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.onHand}`);
            this.attach(`New ${editColumn}: ${this.onHand}`);

            this.payLoad.onHand = this.onHand
            break;
        case 'onHandQtyMin':
            if (value == 'random') {
                this.onHandMin = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.onHandMin}`);
            this.attach(`New ${editColumn}: ${this.onHandMin}`);

            this.payLoad.onHandMin = this.onHandMin
            break;
        case 'warehouseQty':
            if (value == 'random') {
                this.onHandThirdParty = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.onHandThirdParty}`);
            this.attach(`New ${editColumn}: ${this.onHandThirdParty}`);

            this.payLoad.onHandThirdParty = this.onHandThirdParty
            break;
        case 'warehouseQtyMin':
            if (value == 'random') {
                this.onHandThirdPartyMin = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.onHandThirdPartyMin}`);
            this.attach(`New ${editColumn}: ${this.onHandThirdPartyMin}`);

            this.payLoad.onHandThirdPartyMin = this.onHandThirdPartyMin
            break;
        case 'onHandFBMQty':
            if (value == 'random') {
                this.onHandFbm = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.onHandFbm}`);
            this.attach(`New ${editColumn}: ${this.onHandFbm}`);

            this.payLoad.onHandFbm = this.onHandFbm
            break;
        case 'skuNotes':
            if (value == 'random') {
                this.skuNotes = `SkuNotes ${faker.lorem.word(2)}`;
            }

            logger.log('info', `New ${editColumn}: ${this.skuNotes}`);
            this.attach(`New ${editColumn}: ${this.skuNotes}`);

            this.payLoad.skuNotes = this.skuNotes
            break;
        case 'prepNotes':
            if (value == 'random') {
                this.prepNotes = `PrepNotes ${faker.lorem.word(2)}`;
            }

            logger.log('info', `New ${editColumn}: ${this.prepNotes}`);
            this.attach(`New ${editColumn}: ${this.prepNotes}`);

            this.payLoad.prepNotes = this.prepNotes
            break;
        case 'supplierRebate':
            if (value == 'random') {
                this.supplierRebate = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.supplierRebate}`);
            this.attach(`New ${editColumn}: ${this.supplierRebate}`);

            this.payLoad.supplierRebate = this.supplierRebate
            break;
        case 'inboundShippingCost':
            if (value == 'random') {
                this.inboundShippingCost = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.supplierRebate}`);
            this.attach(`New ${editColumn}: ${this.supplierRebate}`);

            this.payLoad.inboundShippingCost = this.inboundShippingCost
            break;
        case 'reshippingCost':
            if (value == 'random') {
                this.reshippingCost = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.reshippingCost}`);
            this.attach(`New ${editColumn}: ${this.reshippingCost}`);

            this.payLoad.reshippingCost = this.reshippingCost
            break;
        case 'repackagingMaterialCost':
            if (value == 'random') {
                this.repackagingMaterialCost = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.repackagingMaterialCost}`);
            this.attach(`New ${editColumn}: ${this.repackagingMaterialCost}`);

            this.payLoad.repackagingMaterialCost = this.repackagingMaterialCost
            break;
        case 'repackingLaborCost':
            if (value == 'random') {
                this.repackingLaborCost = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.repackingLaborCost}`);
            this.attach(`New ${editColumn}: ${this.repackingLaborCost}`);

            this.payLoad.repackingLaborCost = this.repackingLaborCost
            break;
        case 'isHidden':
            if (value == 'random') {
                this.isHidden = !Boolean(this.responseBodyOfAItemObject.isHidden);
            } else {
                this.isHidden = Boolean(value)
            }

            logger.log('info', `New ${editColumn}: ${this.isHidden}`);
            this.attach(`New ${editColumn}: ${this.isHidden}`);

            this.payLoad.isHidden = this.isHidden
            break;
        case 'useHistoryOverride':
            if (value == 'random') {
                this.useHistoryOverride = !(Boolean(this.responseBodyOfAItemObject.useHistoryOverride));
            }
            else {
                this.useHistoryOverride = true;
            }
            logger.log('info', `New ${editColumn}: ${this.useHistoryOverride}`);
            this.attach(`New ${editColumn}: ${this.useHistoryOverride}`);

            this.payLoad.useHistoryOverride = this.useHistoryOverride
            break;
        case 'casePackQty':
            if (value == 'random') {
                this.lotMultipleQty = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.lotMultipleQty}`);
            this.attach(`New ${editColumn}: ${this.lotMultipleQty}`);

            this.payLoad.lotMultipleQty = this.lotMultipleQty
            break;
        case 'inventorySourcePreference':
            if (value == 'random') {
                const inventorySources = ['FBA', 'FBM', 'FBA+FBM'];
                const excludedInventorySource = this.responseBodyOfAItemObject.inventorySourcePreference;

                // Filter out the excluded inventory source value from the inventorySources array
                const filteredArray = inventorySources.filter((value) => value !== excludedInventorySource);
                this.inventorySourcePreference = filteredArray[Math.floor(Math.random() * filteredArray.length)];
            }

            logger.log('info', `New ${editColumn}: ${this.inventorySourcePreference}`);
            this.attach(`New ${editColumn}: ${this.inventorySourcePreference}`);

            this.payLoad.inventorySourcePreference = this.inventorySourcePreference
            break;
        case 'purchaseAs':
            if (value == 'random') {
                if (companyType !== "QBFS") {
                    this.payloadCreateItem = {
                        "key": "",
                        "name": `${faker.random.alphaNumeric(6).toUpperCase()}-${faker.datatype.number(500)}-Auto`,
                        "asin": companyType === "ASC" ? `${faker.random.alphaNumeric(10).toUpperCase()}` : "",
                        "fnsku": companyType === "ASC" ? `${faker.random.alphaNumeric(10).toUpperCase()}` : "",
                        "description": "",
                        "vendorKey": null,
                        "vendorName": null,
                        "vendorPrice": 0,
                        "moq": 1,
                        "leadTime": 1,
                        "orderInterval": 0,
                        "serviceLevel": 85,
                        "onHand": 0,
                        "onHandMin": "",
                        "onHandThirdParty": 0,
                        "onHandThirdPartyMin": "",
                        "growthTrend": 0,
                        "isHidden": false,
                        "useHistoryOverride": false,
                        "lotMultipleQty": 1,
                        "lotMultipleItemKey": null,
                        "lotMultipleItemName": null,
                        "forecastDirty": false,
                        "forecastTags": [],
                        "tags": [],
                        "useBackfill": false,
                        "useLostSalesOverride": false,
                        "createdAt": "2023-04-11T08:09:03.909Z",
                        "isFbm": false,
                        "inventorySourcePreference": "",
                        "skuNotes": "",
                        "prepNotes": "",
                        "supplierRebate": "",
                        "inboundShippingCost": 0,
                        "reshippingCost": 0,
                        "repackagingMaterialCost": 0,
                        "repackingLaborCost": 0,
                        "inboundShipped": 0,
                        "inboundReceiving": 0,
                        "inbound": 0,
                        "inboundFcTransfer": 0,
                        "referralFee": 0,
                        "fbaFee": 0,
                        "rank": 0,
                        "variableClosingFee": 0,
                        "lowestFba": 0,
                        "newBuyBox": 0,
                        "listPrice": 0,
                        "average7DayPrice": 0,
                        "itemHistoryLength": 0,
                        "history": null,
                        "links": null,
                        "packageWeight": "",
                        "onHandFbm": "",
                        "prepGuide": "",
                        "dimensionalWeight": "",
                        "hazmat": "",
                        "oversized": "",
                        "category": "",
                        "upc": "",
                        "ean": ""
                    }

                    // Create new item to set purchase as      
                    this.attach(`Payload Create new item to set purchase as: ${JSON.stringify(this.payloadCreateItem, undefined, 4)}`)

                    const createItemResponse = await itemRequest.createItem(this.request, Links.API_ITEMS, this.payloadCreateItem, this.headers);
                    const responseBodyText = await createItemResponse.text();

                    if (createItemResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
                        const responseBodyOfAItemObject = JSON.parse(responseBodyText);
                        this.lotMultipleItemName = responseBodyOfAItemObject.name
                        this.lotMultipleItemKey = responseBodyOfAItemObject.key
                        logger.log('info', `Response POST Create new item to set purchase as ${link}` + JSON.stringify(responseBodyOfAItemObject, undefined, 4));
                        this.attach(`Response POST Create new item to set purchase as ${link}` + JSON.stringify(responseBodyOfAItemObject, undefined, 4))
                    }
                    else {
                        this.lotMultipleItemName = null
                        this.lotMultipleItemKey = null
                        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
                        logger.log('info', `Response POST Create new item to set purchase as ${link} has status code ${createItemResponse.status()} ${createItemResponse.statusText()} and response body ${responseBodyText}`);
                        this.attach(`Response POST Create new item to set purchase as ${link} has status code ${createItemResponse.status()} ${createItemResponse.statusText()} and response body ${actualResponseText}`)
                    }
                } else {
                    const excludedItemKey = this.itemKey
                    // Filter out the excluded item have already set as purchase as of other items in the list items
                    const filteredArray = this.getItemsResponseBody.filter((item: any) => ((item.key !== excludedItemKey) && (!this.listItemsAlreadySetAsPurchaseAsOfOrtherItem.includes(item.key))));
                    const randomItem = filteredArray[Math.floor(Math.random() * filteredArray.length)];

                    this.lotMultipleItemName = randomItem.name
                    this.lotMultipleItemKey = randomItem.key
                }
            } else if (value == 'null') {
                this.lotMultipleItemName = null
                this.lotMultipleItemKey = null
            } else if (value == 'itself') {
                this.lotMultipleItemName = this.itemName;
                this.lotMultipleItemKey = this.itemKey;
            } else if (value == 'hard') {
                this.lotMultipleItemName = this.itemPurchaseAsName;
                this.lotMultipleItemKey = this.itemPurchaseAsKey;
            } else if (value == "dynamic") {
                const excludedItemKey = this.itemKey
                // Filter out the excluded item have already set as purchase as of other items the list items
                const filteredArray = this.getItemsResponseBody.filter((item: any) => ((item.key !== excludedItemKey) && (!this.listItemsAlreadySetAsPurchaseAsOfOrtherItem.includes(item.key))));
                const randomItem = filteredArray[Math.floor(Math.random() * filteredArray.length)];

                this.lotMultipleItemName = randomItem.name
                this.lotMultipleItemKey = randomItem.key
            }

            logger.log('info', `New ${editColumn}: ${this.lotMultipleItemName}`);
            this.attach(`New ${editColumn}: ${this.lotMultipleItemName}`);

            this.payLoad.lotMultipleItemName = this.lotMultipleItemName
            this.payLoad.lotMultipleItemKey = this.lotMultipleItemKey
            break;
        case 'useBackfill':
            if (value == 'random') {
                this.useBackfill = !(Boolean(this.responseBodyOfAItemObject.useBackfill));
            }
            else {
                this.useBackfill = Boolean(value);
            }
            logger.log('info', `New ${editColumn}: ${this.useBackfill}`);
            this.attach(`New ${editColumn}: ${this.useBackfill}`);

            this.payLoad.useBackfill = this.useBackfill
            break;
        case 'doNotOrder':
            if (value == 'random') {
                this.doNotOrder = !(Boolean(this.responseBodyOfAItemObject.doNotOrder));
            }
            else {
                this.doNotOrder = value;
            }
            logger.log('info', `New ${editColumn}: ${this.doNotOrder}`);
            this.attach(`New ${editColumn}: ${this.doNotOrder}`);

            this.payLoad.doNotOrder = this.doNotOrder
            break;
        case 'forecastDirty':
            if (value == 'random') {
                this.forecastDirty = !(Boolean(this.responseBodyOfAItemObject.forecastDirty));
            }
            else {
                this.forecastDirty = value;
            }
            logger.log('info', `New ${editColumn}: ${this.forecastDirty}`);
            this.attach(`New ${editColumn}: ${this.forecastDirty}`);

            this.payLoad.forecastDirty = this.forecastDirty
            break;
        default:
            break;
    }

    logger.log('info', `Payload` + JSON.stringify(this.payLoad, undefined, 4));
    this.attach(`Payload` + JSON.stringify(this.payLoad, undefined, 4))
});

When('User sends a PUT request to edit the item', async function () {
    // Send PUT request
    this.response = await itemRequest.editItem(this.request, link, this.payLoad, this.headers)
    if (this.response.status() == 200) {
        this.responseBodyOfAItemObject = this.editItemResponseBody = JSON.parse(await this.response.text());
        logger.log('info', `Edit Item Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()} and editItemResponse body ${JSON.stringify(this.editItemResponseBody, undefined, 4)}`)
        this.attach(`Edit Item Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()} and editItemResponse body ${JSON.stringify(this.editItemResponseBody, undefined, 4)}`)
    } else {
        logger.log('info', `Edit Item Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
        this.attach(`Edit Item Response edit ${link} has status code ${this.response.status()} ${this.response.statusText()}`)
    }
});

Then('The new {} of item must be updated successfully', function (editColumn: string) {
    switch (editColumn) {
        case 'itemName':
            expect(this.name).toEqual(this.editItemResponseBody.name)
            break;
        case 'asin':
            expect(this.asin).toEqual(this.editItemResponseBody.asin)
            break;
        case 'fnsku':
            expect(this.fnsku).toEqual(this.editItemResponseBody.fnsku)
            break;
        case 'description':
            expect(this.description).toEqual(this.editItemResponseBody.description)
            break;
        case 'supplierName':
            expect(this.vendorKey).toEqual(this.editItemResponseBody.vendorKey)
            expect(this.vendorName).toEqual(this.editItemResponseBody.vendorName)
            break;
        case 'supplierPrice':
            expect(this.vendorPrice).toEqual(this.editItemResponseBody.vendorPrice)
            break;
        case 'moq':
            expect(this.moq).toEqual(this.editItemResponseBody.moq)
            break;
        case 'leadTime':
            expect(this.leadTime).toEqual(this.editItemResponseBody.leadTime)
            break;
        case 'orderInterval':
            expect(this.orderInterval).toEqual(this.editItemResponseBody.orderInterval)
            break;
        case 'serviceLevel':
            expect(this.serviceLevel).toEqual(this.editItemResponseBody.serviceLevel)
            break;
        case 'onHanQty':
            expect(this.onHand).toEqual(this.editItemResponseBody.onHand)
            break;
        case 'onHanFBAQty':
            expect(this.onHand).toEqual(this.editItemResponseBody.onHand)
            break;
        case 'onHandQtyMin':
            expect(this.onHandMin).toEqual(this.editItemResponseBody.onHandMin)
            break;
        case 'warehouseQty':
            expect(this.onHandThirdParty).toEqual(this.editItemResponseBody.onHandThirdParty)
            break;
        case 'warehouseQtyMin':
            expect(this.onHandThirdPartyMin).toEqual(this.editItemResponseBody.onHandThirdPartyMin)
            break;
        case 'onHandFBMQty':
            expect(this.onHandFbm).toEqual(this.editItemResponseBody.onHandFbm)
            break;
        case 'skuNotes':
            expect(this.skuNotes).toEqual(this.editItemResponseBody.skuNotes)
            break;
        case 'prepNotes':
            expect(this.prepNotes).toEqual(this.editItemResponseBody.prepNotes)
            break;
        case 'supplierRebate':
            expect(this.supplierRebate).toEqual(this.editItemResponseBody.supplierRebate)
            break;
        case 'inboundShippingCost':
            expect(this.inboundShippingCost).toEqual(this.editItemResponseBody.inboundShippingCost)
            break;
        case 'reshippingCost':
            expect(this.reshippingCost).toEqual(this.editItemResponseBody.reshippingCost)
            break;
        case 'repackagingMaterialCost':
            expect(this.repackagingMaterialCost).toEqual(this.editItemResponseBody.repackagingMaterialCost)
            break;
        case 'repackingLaborCost':
            expect(this.repackingLaborCost).toEqual(this.editItemResponseBody.repackingLaborCost)
            break;
        case 'isHidden':
            expect(this.isHidden).toEqual(this.editItemResponseBody.isHidden)
            this.nameOfHiddenItem = this.editItemResponseBody.name
            break;
        case 'useHistoryOverride':
            expect(this.useHistoryOverride).toEqual(this.editItemResponseBody.useHistoryOverride)
            break;
        case 'casePackQty':
            expect(this.lotMultipleQty).toEqual(this.editItemResponseBody.lotMultipleQty)
            break;
        case 'inventorySourcePreference':
            expect(this.inventorySourcePreference).toEqual(this.editItemResponseBody.inventorySourcePreference)
            break;
        case 'purchaseAs':
            expect(this.lotMultipleItemName).toEqual(this.editItemResponseBody.lotMultipleItemName)
            expect(this.lotMultipleItemKey).toEqual(this.editItemResponseBody.lotMultipleItemKey)
            break;
        case 'useBackfill':
            expect(this.useBackfill).toEqual(this.editItemResponseBody.useBackfill)
            break;
        default:
            break;
    }

});

Given(`User sets GET api endpoint to get a item in "Manage Company > Item" to assign supplier`, function () {
    // Use items with name have New_Auto to check
    const name = 'New_Auto';
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

Then('User saves needed value to check Automatically Adjusted Weightings setting', function () {
    // RestockAMZ
    this.actualRestockAMZPercent2Day = this.restockCalculationResponseBody.salesVelocitySettingData.percent2Day;
    this.actualRestockAMZPercent7Day = this.restockCalculationResponseBody.salesVelocitySettingData.percent7Day;
    this.actualRestockAMZPercent14Day = this.restockCalculationResponseBody.salesVelocitySettingData.percent14Day;
    this.actualRestockAMZPercent30Day = this.restockCalculationResponseBody.salesVelocitySettingData.percent30Day;
    this.actualRestockAMZPercent60Day = this.restockCalculationResponseBody.salesVelocitySettingData.percent60Day;
    this.actualRestockAMZPercent90Day = this.restockCalculationResponseBody.salesVelocitySettingData.percent90Day;
    this.actualRestockAMZPercent180Day = this.restockCalculationResponseBody.salesVelocitySettingData.percent180Day;
    this.actualRestockAMZPercentForecasted = this.restockCalculationResponseBody.salesVelocitySettingData.percentForecasted;
    //Purchasing
    this.actualPurchasingPercent2Day = this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent2Day;
    this.actualPurchasingPercent7Day = this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent7Day;
    this.actualPurchasingPercent14Day = this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent14Day;
    this.actualPurchasingPercent30Day = this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent30Day;
    this.actualPurchasingPercent60Day = this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent60Day;
    this.actualPurchasingPercent90Day = this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent90Day;
    this.actualPurchasingPercent180Day = this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percent180Day;
    this.actualPurchasingPercentForecasted = this.getRestockSuggestionPurchasingResponseBody.salesVelocitySettingData.percentForecasted;
});

Then('User checks Automatically Adjusted setting has been applied in Purchasing and RestockAMZ', function () {
    if (this.itemHistoryLengthInDay < 31) {
        this.expectedS2 = 10;
        this.expectedS7 = 45;
        this.expectedS14 = 45;
        this.expectedS30 = 0;
        this.expectedS60 = 0;
        this.expectedS90 = 0;
        this.expectedS180 = 0;
        this.expectedForecast = 0;
    }
    if (this.itemHistoryLengthInDay > 30 && this.itemHistoryLengthInDay < 61) {
        this.expectedS2 = 10;
        this.expectedS7 = 30;
        this.expectedS14 = 30;
        this.expectedS30 = 30;
        this.expectedS60 = 0;
        this.expectedS90 = 0;
        this.expectedS180 = 0;
        this.expectedForecast = 0;
    }
    if (this.itemHistoryLengthInDay > 60 && this.itemHistoryLengthInDay < 91) {
        this.expectedS2 = 10;
        this.expectedS7 = 10;
        this.expectedS14 = 10;
        this.expectedS30 = 40;
        this.expectedS60 = 30;
        this.expectedS90 = 0;
        this.expectedS180 = 0;
        this.expectedForecast = 0;
    }
    if (this.itemHistoryLengthInDay > 90 && this.itemHistoryLengthInDay < 121) {
        this.expectedS2 = 10;
        this.expectedS7 = 10;
        this.expectedS14 = 10;
        this.expectedS30 = 30;
        this.expectedS60 = 15;
        this.expectedS90 = 25;
        this.expectedS180 = 0;
        this.expectedForecast = 0;
    }
    if (this.itemHistoryLengthInDay > 120 && this.itemHistoryLengthInDay < 151) {
        this.expectedS2 = 10;
        this.expectedS7 = 10;
        this.expectedS14 = 10;
        this.expectedS30 = 30;
        this.expectedS60 = 20;
        this.expectedS90 = 20;
        this.expectedS180 = 0;
        this.expectedForecast = 0;
    }
    if (this.itemHistoryLengthInDay > 150 && this.itemHistoryLengthInDay < 181) {
        this.expectedS2 = 10;
        this.expectedS7 = 10;
        this.expectedS14 = 10;
        this.expectedS30 = 30;
        this.expectedS60 = 20;
        this.expectedS90 = 20;
        this.expectedS180 = 0;
        this.expectedForecast = 0;
    }
    if (this.itemHistoryLengthInDay > 180 && this.itemHistoryLengthInDay < 361) {
        this.expectedS2 = 10;
        this.expectedS7 = 10;
        this.expectedS14 = 10;
        this.expectedS30 = 20;
        this.expectedS60 = 20;
        this.expectedS90 = 20;
        this.expectedS180 = 10;
        this.expectedForecast = 0;
    }
    if (this.itemHistoryLengthInDay > 360 && this.itemHistoryLengthInDay < 751) {
        this.expectedS2 = 10;
        this.expectedS7 = 10;
        this.expectedS14 = 10;
        this.expectedS30 = 20;
        this.expectedS60 = 10;
        this.expectedS90 = 10;
        this.expectedS180 = 10;
        this.expectedForecast = 20;
    }
    if (this.itemHistoryLengthInDay > 750) {
        this.expectedS2 = 10;
        this.expectedS7 = 10;
        this.expectedS14 = 10;
        this.expectedS30 = 0;
        this.expectedS60 = 0;
        this.expectedS90 = 0;
        this.expectedS180 = 0;
        this.expectedForecast = 70;
    }
    //RestockAMZ
    //Percent 2-D
    logger.log('info', `RestockAMZ Percent 2-D: Actual: ${this.actualRestockAMZPercent2Day} and Expected: ${this.expectedS2}`);
    this.attach(`RestockAMZ Percent 2-D: Actual: ${this.actualRestockAMZPercent2Day} and Expected: ${this.expectedS2}`);
    expect(this.actualRestockAMZPercent2Day, `In response body, the expected RestockAMZ Percent of 2-D: ${this.expectedS2}`).toBe(this.expectedS2);
    //Percent 7-D
    logger.log('info', `RestockAMZ Percent 7-D: Actual: ${this.actualRestockAMZPercent7Day} and Expected: ${this.expectedS7}`);
    this.attach(`RestockAMZ Percent 7-D: Actual: ${this.actualRestockAMZPercent7Day} and Expected: ${this.expectedS7}`);
    expect(this.actualRestockAMZPercent7Day, `In response body, the expected RestockAMZ Percent of 7-D: ${this.expectedS7}`).toBe(this.expectedS7);
    //Percent 14-D
    logger.log('info', `RestockAMZ Percent 14-D: Actual: ${this.actualRestockAMZPercent14Day} and Expected: ${this.expectedS14}`);
    this.attach(`RestockAMZ Percent 14-D: Actual: ${this.actualRestockAMZPercent14Day} and Expected: ${this.expectedS14}`);
    expect(this.actualRestockAMZPercent14Day, `In response body, the expected RestockAMZ Percent of 14-D: ${this.expectedS14}`).toBe(this.expectedS14);
    //Percent 30-D
    logger.log('info', `RestockAMZ Percent 30-D: Actual: ${this.actualRestockAMZPercent30Day} and Expected: ${this.expectedS30}`);
    this.attach(`RestockAMZ Percent 30-D: Actual: ${this.actualRestockAMZPercent30Day} and Expected: ${this.expectedS30}`);
    expect(this.actualRestockAMZPercent30Day, `In response body, the expected RestockAMZ Percent of 30-D: ${this.expectedS30}`).toBe(this.expectedS30);
    //Percent 60-D
    logger.log('info', `RestockAMZ Percent 60-D: Actual: ${this.actualRestockAMZPercent60Day} and Expected: ${this.expectedS60}`);
    this.attach(`RestockAMZ Percent 60-D: Actual: ${this.actualRestockAMZPercent60Day} and Expected: ${this.expectedS60}`);
    expect(this.actualRestockAMZPercent60Day, `In response body, the expected RestockAMZ Percent of 60-D: ${this.expectedS60}`).toBe(this.expectedS60);
    //Percent 90-D
    logger.log('info', `RestockAMZ Percent 90-D: Actual: ${this.actualRestockAMZPercent90Day} and Expected: ${this.expectedS90}`);
    this.attach(`RestockAMZ Percent 90-D: Actual: ${this.actualRestockAMZPercent90Day} and Expected: ${this.expectedS90}`);
    expect(this.actualRestockAMZPercent90Day, `In response body, the expected RestockAMZ Percent of 90-D: ${this.expectedS90}`).toBe(this.expectedS90);
    //Percent 180-D
    logger.log('info', `RestockAMZ Percent 180-D: Actual: ${this.actualRestockAMZPercent180Day} and Expected: ${this.expectedS180}`);
    this.attach(`RestockAMZ Percent 180-D: Actual: ${this.actualRestockAMZPercent180Day} and Expected: ${this.expectedS180}`);
    expect(this.actualRestockAMZPercent180Day, `In response body, the expected RestockAMZ Percent of 180-D: ${this.expectedS180}`).toBe(this.expectedS180);
    //Percent Forecast
    logger.log('info', `RestockAMZ Percent Forecast: Actual: ${this.actualRestockAMZPercentForecasted} and Expected: ${this.expectedForecast}`);
    this.attach(`RestockAMZ Percent Forecast: Actual: ${this.actualRestockAMZPercentForecasted} and Expected: ${this.expectedForecast}`);
    expect(this.actualRestockAMZPercentForecasted, `In response body, the expected RestockAMZ Percent of Forecast: ${this.expectedForecast}`).toBe(this.expectedForecast);

    //Purchasing
    //Percent 2-D
    logger.log('info', `Purchasing Percent 2-D: Actual: ${this.actualPurchasingPercent2Day} and Expected: ${this.expectedS2}`);
    this.attach(`Purchasing Percent 2-D: Actual: ${this.actualPurchasingPercent2Day} and Expected: ${this.expectedS2}`);
    expect(this.actualPurchasingPercent2Day, `In response body, the expected Purchasing Percent of 2-D: ${this.expectedS2}`).toBe(this.expectedS2);
    //Percent 7-D
    logger.log('info', `Purchasing Percent 7-D: Actual: ${this.actualPurchasingPercent7Day} and Expected: ${this.expectedS7}`);
    this.attach(`Purchasing Percent 7-D: Actual: ${this.actualPurchasingPercent7Day} and Expected: ${this.expectedS7}`);
    expect(this.actualPurchasingPercent7Day, `In response body, the expected Purchasing Percent of 7-D: ${this.expectedS7}`).toBe(this.expectedS7);
    //Percent 14-D
    logger.log('info', `Purchasing Percent 14-D: Actual: ${this.actualPurchasingPercent14Day} and Expected: ${this.expectedS14}`);
    this.attach(`Purchasing Percent 14-D: Actual: ${this.actualPurchasingPercent14Day} and Expected: ${this.expectedS14}`);
    expect(this.actualPurchasingPercent14Day, `In response body, the expected Purchasing Percent of 14-D: ${this.expectedS14}`).toBe(this.expectedS14);
    //Percent 30-D
    logger.log('info', `Purchasing Percent 30-D: Actual: ${this.actualPurchasingPercent30Day} and Expected: ${this.expectedS30}`);
    this.attach(`Purchasing Percent 30-D: Actual: ${this.actualPurchasingPercent30Day} and Expected: ${this.expectedS30}`);
    expect(this.actualPurchasingPercent30Day, `In response body, the expected Purchasing Percent of 30-D: ${this.expectedS30}`).toBe(this.expectedS30);
    //Percent 60-D
    logger.log('info', `Purchasing Percent 60-D: Actual: ${this.actualPurchasingPercent60Day} and Expected: ${this.expectedS60}`);
    this.attach(`Purchasing Percent 60-D: Actual: ${this.actualPurchasingPercent60Day} and Expected: ${this.expectedS60}`);
    expect(this.actualPurchasingPercent60Day, `In response body, the expected Purchasing Percent of 60-D: ${this.expectedS60}`).toBe(this.expectedS60);
    //Percent 90-D
    logger.log('info', `Purchasing Percent 90-D: Actual: ${this.actualPurchasingPercent90Day} and Expected: ${this.expectedS90}`);
    this.attach(`Purchasing Percent 90-D: Actual: ${this.actualPurchasingPercent90Day} and Expected: ${this.expectedS90}`);
    expect(this.actualPurchasingPercent90Day, `In response body, the expected Purchasing Percent of 90-D: ${this.expectedS90}`).toBe(this.expectedS90);
    //Percent 180-D
    logger.log('info', `Purchasing Percent 180-D: Actual: ${this.actualPurchasingPercent180Day} and Expected: ${this.expectedS180}`);
    this.attach(`Purchasing Percent 180-D: Actual: ${this.actualPurchasingPercent180Day} and Expected: ${this.expectedS180}`);
    expect(this.actualPurchasingPercent180Day, `In response body, the expected Purchasing Percent of 180-D: ${this.expectedS180}`).toBe(this.expectedS180);
    //Percent Forecast
    logger.log('info', `Purchasing Percent Forecast: Actual: ${this.actualPurchasingPercentForecasted} and Expected: ${this.expectedForecast}`);
    this.attach(`Purchasing Percent Forecast: Actual: ${this.actualPurchasingPercentForecasted} and Expected: ${this.expectedForecast}`);
    expect(this.actualPurchasingPercentForecasted, `In response body, the expected Purchasing Percent of Forecast: ${this.expectedForecast}`).toBe(this.expectedForecast);
});

Then('User sets GET api endpoint to get item sales velocity settings', function () {
    linkGetItemSalesVelocitySettings = `${Links.API_ITEM_SALES_VELOCITY}/${this.itemKey}/purchasing`
    logger.log('info', `linkGetItemSalesVelocitySettings:: ` + linkGetItemSalesVelocitySettings);
    this.attach(`linkGetItemSalesVelocitySettings:: ` + linkGetItemSalesVelocitySettings);
});

Then('User sends GET request to get item sales velocity settings', async function () {
    const options = {
        headers: this.headers
    }

    this.getItemSalesVelocitySettingsResponse = this.response = await itemRequest.getItemSalesVelocitySettings(this.request, linkGetItemSalesVelocitySettings, options);
    const responseBodyText = await this.getItemSalesVelocitySettingsResponse.text();

    if (this.getItemSalesVelocitySettingsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemSalesVelocitySettingsResponseBody = await this.getItemSalesVelocitySettingsResponse.text();
        logger.log('info', `Response GET ${linkGetItemSalesVelocitySettings} ` + this.getItemSalesVelocitySettingsResponseBody);
        this.attach(`Response GET ${linkGetItemSalesVelocitySettings} ` + this.getItemSalesVelocitySettingsResponseBody);
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkGetItemSalesVelocitySettings} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${linkGetItemSalesVelocitySettings} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
});

Given(`User sets GET api endpoint to get items in "Manage Company > Item"`, function () {
    // Get items that its purchase as is null and its name is not contain DefaultPurchasingSaleVelocity
    linkGetItemsWithFilter = `${Links.API_ITEMS}?offset=0&limit=50&where={"filters":[{"filters":[{"field":"name","operator":"doesnotcontain","value":"DefaultPurchasingSaleVelocity"}],"logic":"and"},{"filters":[{"field":"vendorName","operator":"isnull","value":null}],"logic":"and"},{"filters":[{"field":"lotMultipleItemName","operator":"isnull","value":null}],"logic":"and"}],"logic":"and"}`
});

Given(`User sets GET api endpoint to get default 30 items in "Edit Item History"`, function () {
    // Get default 30 active items
    linkGetItemsWithFilter = `${Links.API_ITEMS}?offset=0&limit=30&where={"logic":"and","filters":[{"logic":"and","filters":[{"field":"isHidden","operator":"eq","value":false}]}]}`
});

Given(`User sends GET request to get items in {string}`, async function (string) {
    const options = {
        headers: this.headers
    }
    this.getItemsResponse = this.response = await itemRequest.getItems(this.request, linkGetItemsWithFilter, options);
    const responseBodyText = await this.getItemsResponse.text();
    if (this.getItemsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemsResponseBody = JSON.parse(await this.getItemsResponse.text());
        this.responseBodyOfAItemObject = await this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
        logger.log('info', `Response GET ${linkGetItemsWithFilter} returns total items >>>>>` + JSON.stringify(this.getItemsResponseBody.length, undefined, 4));
        this.attach(`Response GET ${linkGetItemsWithFilter} total items >>>>>>` + JSON.stringify(this.getItemsResponseBody.length, undefined, 4))
        logger.log('info', `A random in response GET ${linkGetItemsWithFilter} >>>>>` + JSON.stringify(this.responseBodyOfAItemObject, undefined, 4));
        this.attach(`A random in response GET ${linkGetItemsWithFilter} >>>>>>` + JSON.stringify(this.responseBodyOfAItemObject, undefined, 4))
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

When('User sends PUT request to update item {} sales velocity setting type {} with the total percentage is {}%', async function (salesVelocitySettingsType: string, velocityType: string, percentage: string) {
    switch (velocityType) {
        case '"Average"':
            const isNumber = !isNaN(parseFloat(percentage)) && isFinite(+percentage);

            this.randomWeightNumbers = []

            if (isNumber) {
                 // The function returns the array of 8 numbers that add up to the desired sum (here is percentage of purchasing daily sales)
                this.randomWeightNumbers = keyword.generateRandomNumbers(Number(percentage), 8);

                this.payLoad = {
                    "companyType": `${this.responseBodyOfAItemObject.companyType}`,
                    "companyKey": `${this.responseBodyOfAItemObject.companyKey}`,
                    "itemKey": `${this.responseBodyOfAItemObject.key === undefined ? this.responseBodyOfAItemObject.itemKey : this.responseBodyOfAItemObject.key}`,
                    "salesVelocitySettingsType": `${salesVelocitySettingsType}`,
                    "restockModel": "DIRECT_SHIP",
                    "localLeadTime": 7,
                    "targetQtyOnHandMin": 30,
                    "targetQtyOnHandMax": 60,
                    "salesVelocityType": "average",
                    "salesVelocitySettingData": {
                            "percent2Day": this.randomWeightNumbers[0],
                            "percent7Day": this.randomWeightNumbers[1],
                            "percent14Day": this.randomWeightNumbers[2],
                            "percent30Day": this.randomWeightNumbers[3],
                            "percent60Day": this.randomWeightNumbers[4],
                            "percent90Day": this.randomWeightNumbers[5],
                            "percent180Day": this.randomWeightNumbers[6],
                            "percentForecasted": this.randomWeightNumbers[7]
                    }
                }
            }
            break;
        case '"Automatically Adjusted Weightings"':
            this.payLoad = {
                "companyType": `${this.responseBodyOfAItemObject.companyType}`,
                "companyKey": `${this.responseBodyOfAItemObject.companyKey}`,
                "itemKey": `${this.responseBodyOfAItemObject.key === undefined ? this.responseBodyOfAItemObject.itemKey : this.responseBodyOfAItemObject.key}`,
                "salesVelocitySettingsType": `${salesVelocitySettingsType}`,
                "restockModel": "DIRECT_SHIP",
                "localLeadTime": 7,
                "targetQtyOnHandMin": 30,
                "targetQtyOnHandMax": 60,
                "salesVelocityType": "auto"                
            }
            break;
        default:
            break;
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

// Edit Item History
Then(`{} sets GET api endpoint to filter item by name or asin contains {}`, async function (actor, searchCriteria: string) {
    if (searchCriteria.includes('Random')) {
        searchCriteria = this.responseBodyOfAItemObject.name || this.responseBodyOfAItemObject.asin;
    }

    linkGetItems = linkGetFilterItem = encodeURI(`${Links.API_ITEMS}?offset=0&limit=30&where={"logic":"and","filters":[{"logic":"and","filters":[{"field":"isHidden","operator":"eq","value":false}]},{"logic":"or","filters":[{"field":"name","operator":"contains","value":"${searchCriteria}"},{"field":"asin","operator":"contains","value":"${searchCriteria}"}]}]}`);
});

Then(`{} sets GET api endpoint to get Item by Item key`, async function (actor: string) {
    linkItemKey = `${Links.API_ITEMS}/${this.itemKey}`;
});

Then(`{} sets GET api endpoint to get item by filtered`, async function (actor: string) {
    linkItemByFiltered = `${Links.API_ITEMS}?offset=0&limit=100&where={"filters":[{"filters":[{"field":"name","operator":"contains","value":"${this.itemName}"}],"logic":"and"}],"logic":"and"}`;
});

Then('User sends a GET request to get Item by Item key', async function () {
    const options = {
        headers: this.headers
    }

    this.getItemByItemKeyResponse = this.response = await itemRequest.getItems(this.request, linkItemKey, options);
    const responseBodyText = await this.getItemByItemKeyResponse.text();

    if (this.getItemByItemKeyResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBodyOfAItemObject = this.responseBody = this.getItemByItemKeyResponseBody = JSON.parse(await this.getItemByItemKeyResponse.text());
        logger.log('info', `Response GET ${linkItemKey}` + JSON.stringify(this.getItemByItemKeyResponseBody, undefined, 4));
        this.attach(`Response GET ${linkItemKey}` + JSON.stringify(this.getItemByItemKeyResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkItemKey} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${linkItemKey} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
    
    this.vendorPriceOfItem = this.getItemByItemKeyResponseBody.vendorPrice;
    this.packageWeightOfItem = this.getItemByItemKeyResponseBody.packageWeight;
});

Then('User sends a GET request to get item by by filtered', async function () {
    const options = {
        headers: this.headers
    }

    this.getItemByFilteredResponse = this.response = await itemRequest.getItems(this.request, linkItemByFiltered, options);
    const responseBodyText = await this.getItemByFilteredResponse.text();

    if (this.getItemByFilteredResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBodyOfAItemObject = this.responseBody = this.getItemByFilteredResponseBody = JSON.parse(await this.getItemByFilteredResponse.text());
        logger.log('info', `Response GET ${linkItemByFiltered}` + JSON.stringify(this.getItemByFilteredResponseBody, undefined, 4));
        this.attach(`Response GET ${linkItemByFiltered}` + JSON.stringify(this.getItemByFilteredResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkItemByFiltered} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET ${linkItemByFiltered} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
});

Then('{} checks API contract of get Item by Item key api', async function (actor: string) {
    itemInfoResponseSchema.parse(this.getItemByItemKeyResponseBody);
});

Then('{} checks new values of item in "Manage Company > Items" must be display exactly', async function (actor: string) {
    expect(this.editItemResponseBody.vendorKey).toBe(this.payLoad.vendorKey)
    expect(this.editItemResponseBody.vendorName).toBe(this.payLoad.vendorName)
    expect(this.editItemResponseBody.vendorPrice).toBe(this.payLoad.vendorPrice)
    expect(this.editItemResponseBody.moq).toBe(this.payLoad.moq)
    expect(this.editItemResponseBody.onHand).toBe(this.payLoad.onHand)
    expect(this.editItemResponseBody.onHandFbm).toBe(this.payLoad.onHandFbm)
    expect(this.editItemResponseBody.serviceLevel).toBe(this.payLoad.serviceLevel)
    expect(this.editItemResponseBody.onHandThirdParty).toBe(this.payLoad.onHandThirdParty)
    expect(this.editItemResponseBody.description).toBe(this.payLoad.description)
    expect(this.editItemResponseBody.leadTime).toBe(this.payLoad.leadTime)
    expect(this.editItemResponseBody.orderInterval).toBe(this.payLoad.orderInterval)
    expect(this.editItemResponseBody.otMultipleQty).toBe(this.payLoad.otMultipleQty)
    expect(this.editItemResponseBody.tags).toStrictEqual(this.payLoad.tags)
    expect(this.editItemResponseBody.onHandMin).toBe(this.payLoad.onHandMin)
    expect(this.editItemResponseBody.onHandThirdParty).toBe(this.payLoad.onHandThirdParty)
    expect(this.editItemResponseBody.inventorySourcePreference).toBe(this.payLoad.inventorySourcePreference)
});

Then('{} checks API contract essential types in the response of edit item are correct', async function (actor: string) {
    itemInfoResponseSchema.parse(this.editItemResponseBody);
});

Given(`User sets api endpoint to get consolidated of item`, function () {
    this.linkApiGetConsolidatedQtyItem = `${Links.API_ITEMS}/${this.itemKey}/get-consolidated-qty`
});

Given(`User sends a GET request to get consolidated of item`, async function () {
    const options = {
        headers: this.headers
    }
    this.getConsolidatedQtyResponse = this.response = await itemRequest.getConsolidatedQty(this.request, this.linkApiGetConsolidatedQtyItem, options);
    const responseBodyText = await this.getConsolidatedQtyResponse.text();
    if (this.getConsolidatedQtyResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getConsolidatedQtyResponseBody = JSON.parse(await this.getConsolidatedQtyResponse.text());
        logger.log('info', `Response GET consolidated qty ${this.linkApiGetConsolidatedQtyItem}  >>>>>` + JSON.stringify(this.getConsolidatedQtyResponseBody, undefined, 4));
        this.attach(`Response GET consolidated qty ${this.linkApiGetConsolidatedQtyItem}  >>>>>>` + JSON.stringify(this.getConsolidatedQtyResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET consolidated qty ${this.linkApiGetConsolidatedQtyItem} has status code ${this.response.status()} ${this.response.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response GET consolidated qty ${this.linkApiGetConsolidatedQtyItem} has status code ${this.response.status()} ${this.response.statusText()} and response body ${actualResponseText}`)
    }
});

Given(`User saves the forecast recommended qty`, function () {
    this.forecastRecommendQty = (this.getConsolidatedQtyResponseBody[0].consolidatedQty)

    logger.log('info', `Forecast Recommended Qty >>>>>>> ${this.forecastRecommendQty}`);
    this.attach(`Forecast Recommended Qty >>>>>>> ${this.forecastRecommendQty}`);
});

Given(`User sets api endpoint to get a item in PO  of vendor key in My Suggested`, function () {
    this.linkGetItemsInPO = encodeURI(`${Links.API_SUMMARY_VENDOR_ITEMS_IN_PO}?offset=0&limit=1&where={"filters":[{"filters":[{"field":"itemName","operator":"contains","value":"${this.editItemResponseBody.name}"}],"logic":"and"}],"logic":"and"}&vendorKey=${this.editItemResponseBody.vendorKey}`);
});

Given(`User sets api endpoint to get a item in Custom`, function () {
    this.linkGetItemsInCustom = encodeURI(`${Links.API_SUMMARY_ITEMS_IN_PURCHASING_CUSTOM}?offset=0&limit=100&where={"filters":[{"filters":[{"field":"itemName","operator":"contains","value":"${this.editItemResponseBody.name}"}],"logic":"and"}],"logic":"and"}`);
});

Given(`{} sets api endpoint to get a Purchase As item in Custom`, function (actor: string) {
    this.linkGetPurchaseAsItemsInCustom = encodeURI(`${Links.API_SUMMARY_ITEMS_IN_PURCHASING_CUSTOM}?offset=0&limit=100&where={"filters":[{"filters":[{"field":"itemName","operator":"contains","value":"${this.editItemResponseBody.lotMultipleItemName}"}],"logic":"and"}],"logic":"and"}`);
});

Given(`User sends a POST request to get a item in PO by vendor key in My Suggested`, async function () {
    if (Number(this.forecastRecommendQty) > 0) {
        const payload = { "removedItemKeys": [] };
        this.getItemsinPOResponse = this.response = await vendorRequest.getItemsInPO(this.request, this.linkGetItemsInPO, payload, this.headers);
        const responseBodyText = await this.getItemsinPOResponse.text();
        if (this.getItemsinPOResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
            this.responseBody = this.getItemsInPOResponseBody = JSON.parse(await this.getItemsinPOResponse.body());
            this.getItemsResponseBody = this.getItemsInPOResponseBody.model;
            this.randomAItemObject = this.getItemsInPOResponseBody.model[Math.floor(Math.random() * this.getItemsInPOResponseBody.model.length)];

            logger.log('info', `Response POST get item in po ${this.linkGetItemsInPO} >>>>>>` + JSON.stringify(this.randomAItemObject, undefined, 4));
            this.attach(`Response POST get item in po ${this.linkGetItemsInPO} >>>>>>` + JSON.stringify(this.randomAItemObject, undefined, 4))
        }
        else {
            const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
            logger.log('info', `Response POST ${this.linkGetItemsInPO} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
            this.attach(`Response POST ${this.linkGetItemsInPO} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
        }
    } else {
        logger.log('info', `Forecast Recommended Qty = ${this.forecastRecommendQty} < 0`);
        this.attach(`Forecast Recommended Qty = ${this.forecastRecommendQty} < 0`)
    }
});

Given(`User sends a GET request to get a item in Custom`, async function () {
    const options = {
        headers: this.headers
    }
    this.getItemsInPurchasingCustomResponse = this.response = await itemRequest.getItemsInPurchasingCustom(this.request, this.linkGetItemsInCustom, options);
    const responseBodyText = await this.getItemsInPurchasingCustomResponse.text();
    if (this.getItemsInPurchasingCustomResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemsInPurchasingCustomResponseBody = this.getItemsResponseBody = JSON.parse(await this.getItemsInPurchasingCustomResponse.body());
        this.randomAItemObject = this.getItemsInPurchasingCustomResponseBody[Math.floor(Math.random() * this.getItemsInPurchasingCustomResponseBody.length)];
        logger.log('info', `Random object in response GET ${this.linkGetItemsInCustom} >>>>>>` + JSON.stringify(this.randomAItemObject, undefined, 4));
        this.attach(`Random object in response GET ${this.linkGetItemsInCustom} >>>>>>` + JSON.stringify(this.randomAItemObject, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Random object in Response GET ${this.linkGetItemsInCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Random object in Response GET ${this.linkGetItemsInCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
});

Given(`User verify that values of item in "Purchasing > My Suggested" must be updated after update values of item in "Manage Company > Items" and run forecast`, function () {
    // expect(this.getItemsInPOResponseBody.model[0].vendorKey).toBe(this.editItemResponseBody.vendorKey)
    // expect(this.getItemsInPOResponseBody.model[0].vendorName).toBe(this.editItemResponseBody.vendorName)
    // expect(this.getItemsInPOResponseBody.model[0].vendorPrice).toBe(this.editItemResponseBody.vendorPrice)
    // expect(this.getItemsInPOResponseBody.model[0].moq).toBe(this.editItemResponseBody.moq)
    // expect(this.getItemsInPOResponseBody.model[0].onHand).toBe(this.editItemResponseBody.onHand)
    // expect(this.getItemsInPOResponseBody.model[0].onHandFbm).toBe(this.editItemResponseBody.onHandFbm)
    // expect(this.getItemsInPOResponseBody.model[0].serviceLevel).toBe(this.editItemResponseBody.serviceLevel)
    // expect(this.getItemsInPOResponseBody.model[0].onHandThirdParty).toBe(this.editItemResponseBody.onHandThirdParty)
    // expect(this.getItemsInPOResponseBody.model[0].description).toBe(this.editItemResponseBody.description)
    // expect(this.getItemsInPOResponseBody.model[0].leadTime).toBe(this.editItemResponseBody.leadTime)
    // expect(this.getItemsInPOResponseBody.model[0].orderInterval).toBe(this.editItemResponseBody.orderInterval)
    // expect(this.getItemsInPOResponseBody.model[0].otMultipleQty).toBe(this.editItemResponseBody.otMultipleQty)
    // expect(this.getItemsInPOResponseBody.model[0].tags).toBe(this.editItemResponseBody.tags)
    // expect(this.getItemsInPOResponseBody.model[0].onHandMin).toBe(this.editItemResponseBody.onHandMin)
    // expect(this.getItemsInPOResponseBody.model[0].onHandThirdParty).toBe(this.editItemResponseBody.onHandThirdParty)
    // expect(this.getItemsInPOResponseBody.model[0].inventorySourcePreference).toBe(this.editItemResponseBody.inventorySourcePreference)    
    if (Number(this.forecastRecommendQty) > 0) {
        this.softAssert(this.getItemsInPOResponseBody.model[0].vendorKey == this.editItemResponseBody.vendorKey, `Vendor key - Expected: ${this.editItemResponseBody.vendorKey}, Actual: ${this.getItemsInPOResponseBody.model[0].vendorKey}`)
        this.softAssert(this.getItemsInPOResponseBody.model[0].vendorName == this.editItemResponseBody.vendorName, `vendorName - Expected: ${this.editItemResponseBody.vendorName}, Actual: ${this.getItemsInPOResponseBody.model[0].vendorName}`)
        this.softAssert(this.getItemsInPOResponseBody.model[0].vendorPrice == this.editItemResponseBody.vendorPrice, `vendorPrice - Expected: ${this.editItemResponseBody.vendorPrice}, Actual: ${this.getItemsInPOResponseBody.model[0].vendorPrice}`)
        this.softAssert(this.getItemsInPOResponseBody.model[0].moq == this.editItemResponseBody.moq, `moq - Expected: ${this.editItemResponseBody.moq}, Actual: ${this.getItemsInPOResponseBody.model[0].moq}`)
        this.softAssert(this.getItemsInPOResponseBody.model[0].onHand == this.editItemResponseBody.onHand, `onHand - Expected: ${this.editItemResponseBody.onHand}, Actual: ${this.getItemsInPOResponseBody.model[0].onHand}`)
        this.softAssert(this.getItemsInPOResponseBody.model[0].onHandFbm == this.editItemResponseBody.onHandFbm, `onHandFbm - Expected: ${this.editItemResponseBody.onHandFbm}, Actual: ${this.getItemsInPOResponseBody.model[0].onHandFbm}`)
        // this.softAssert(this.getItemsInPOResponseBody.model[0].serviceLevel == this.editItemResponseBody.serviceLevel, `serviceLevel - Expected: ${this.editItemResponseBody.serviceLevel}, Actual: ${this.getItemsInPOResponseBody.model[0].serviceLevel}`)
        this.softAssert(this.getItemsInPOResponseBody.model[0].onHandThirdParty == this.editItemResponseBody.onHandThirdParty, `onHandThirdParty - Expected: ${this.editItemResponseBody.onHandThirdParty}, Actual: ${this.getItemsInPOResponseBody.model[0].onHandThirdParty}`)
        this.softAssert(this.getItemsInPOResponseBody.model[0].description == this.editItemResponseBody.description, `description - Expected: ${this.editItemResponseBody.description}, Actual: ${this.getItemsInPOResponseBody.model[0].description}`)
        this.softAssert(this.getItemsInPOResponseBody.model[0].leadTime == this.editItemResponseBody.leadTime, `leadTime - Expected: ${this.editItemResponseBody.leadTime}, Actual: ${this.getItemsInPOResponseBody.model[0].leadTime}`)
        this.softAssert(this.getItemsInPOResponseBody.model[0].orderInterval == this.editItemResponseBody.orderInterval, `orderInterval - Expected: ${this.editItemResponseBody.orderInterval}, Actual: ${this.getItemsInPOResponseBody.model[0].orderInterval}`)
        this.softAssert(this.getItemsInPOResponseBody.model[0].otMultipleQty == this.editItemResponseBody.otMultipleQty, `otMultipleQty - Expected: ${this.editItemResponseBody.otMultipleQty}, Actual: ${this.getItemsInPOResponseBody.model[0].otMultipleQty}`)
        this.softAssert(_.isEqual(this.getItemsInPOResponseBody.model[0].tags, this.editItemResponseBody.tags), `tags - Expected: ${this.editItemResponseBody.tags}, Actual: ${this.getItemsInPOResponseBody.model[0].tags}`)
        this.softAssert(this.getItemsInPOResponseBody.model[0].onHandMin == this.editItemResponseBody.onHandMin, `onHandMin - Expected: ${this.editItemResponseBody.onHandMin}, Actual: ${this.getItemsInPOResponseBody.model[0].onHandMin}`)
        this.softAssert(this.getItemsInPOResponseBody.model[0].onHandThirdParty == this.editItemResponseBody.onHandThirdParty, `onHandThirdParty - Expected: ${this.editItemResponseBody.onHandThirdParty}, Actual: ${this.getItemsInPOResponseBody.model[0].onHandThirdParty}`)
        this.softAssert(this.getItemsInPOResponseBody.model[0].inventorySourcePreference == this.editItemResponseBody.inventorySourcePreference, `inventorySourcePreference - Expected: ${this.editItemResponseBody.inventorySourcePreference}, Actual: ${this.getItemsInPOResponseBody.model[0].inventorySourcePreference}`)
        expect(this.countErrors).toBe(0)
    } else {
        logger.log('info', `Forecast Recommended Qty = ${this.forecastRecommendQty} < 0`);
        this.attach(`Forecast Recommended Qty = ${this.forecastRecommendQty} < 0`)
    }
});

Given(`User verify that values of item in "Purchasing > Custom" must be updated after update values of item in "Manage Company > Items" and run forecast`, function () {
    // expect(this.getItemsInPurchasingCustomResponseBody[0].vendorKey).toBe(this.editItemResponseBody.vendorKey)
    // expect(this.getItemsInPurchasingCustomResponseBody[0].vendorName).toBe(this.editItemResponseBody.vendorName)
    // expect(this.getItemsInPurchasingCustomResponseBody[0].vendorPrice).toBe(this.editItemResponseBody.vendorPrice)
    // expect(this.getItemsInPurchasingCustomResponseBody[0].moq).toBe(this.editItemResponseBody.moq)
    // expect(this.getItemsInPurchasingCustomResponseBody[0].onHand).toBe(this.editItemResponseBody.onHand)
    // expect(this.getItemsInPurchasingCustomResponseBody[0].onHandFbm).toBe(this.editItemResponseBody.onHandFbm)
    // expect(this.getItemsInPurchasingCustomResponseBody[0].serviceLevel).toBe(this.editItemResponseBody.serviceLevel)
    // expect(this.getItemsInPurchasingCustomResponseBody[0].onHandThirdParty).toBe(this.editItemResponseBody.onHandThirdParty)
    // expect(this.getItemsInPurchasingCustomResponseBody[0].description).toBe(this.editItemResponseBody.description)
    // expect(this.getItemsInPurchasingCustomResponseBody[0].leadTime).toBe(this.editItemResponseBody.leadTime)
    // expect(this.getItemsInPurchasingCustomResponseBody[0].orderInterval).toBe(this.editItemResponseBody.orderInterval)
    // expect(this.getItemsInPurchasingCustomResponseBody[0].otMultipleQty).toBe(this.editItemResponseBody.otMultipleQty)
    // expect(this.getItemsInPurchasingCustomResponseBody[0].tags).toBe(this.editItemResponseBody.tags)
    // expect(this.getItemsInPurchasingCustomResponseBody[0].onHandMin).toBe(this.editItemResponseBody.onHandMin)
    // expect(this.getItemsInPurchasingCustomResponseBody[0].onHandThirdParty).toBe(this.editItemResponseBody.onHandThirdParty)
    // expect(this.getItemsInPurchasingCustomResponseBody[0].inventorySourcePreference).toBe(this.editItemResponseBody.inventorySourcePreference) 
    this.softAssert(this.getItemsInPurchasingCustomResponseBody[0].vendorKey == this.editItemResponseBody.vendorKey, `Vendor key - Expected: ${this.editItemResponseBody.vendorKey}, Actual: ${this.getItemsInPurchasingCustomResponseBody[0].vendorKey}`)
    this.softAssert(this.getItemsInPurchasingCustomResponseBody[0].vendorName == this.editItemResponseBody.vendorName, `vendorName - Expected: ${this.editItemResponseBody.vendorName}, Actual: ${this.getItemsInPurchasingCustomResponseBody[0].vendorName}`)
    this.softAssert(this.getItemsInPurchasingCustomResponseBody[0].vendorPrice == this.editItemResponseBody.vendorPrice, `vendorPrice - Expected: ${this.editItemResponseBody.vendorPrice}, Actual: ${this.getItemsInPurchasingCustomResponseBody[0].vendorPrice}`)
    this.softAssert(this.getItemsInPurchasingCustomResponseBody[0].moq == this.editItemResponseBody.moq, `moq - Expected: ${this.editItemResponseBody.moq}, Actual: ${this.getItemsInPurchasingCustomResponseBody[0].moq}`)
    this.softAssert(this.getItemsInPurchasingCustomResponseBody[0].onHand == this.editItemResponseBody.onHand, `onHand - Expected: ${this.editItemResponseBody.onHand}, Actual: ${this.getItemsInPurchasingCustomResponseBody[0].onHand}`)
    this.softAssert(this.getItemsInPurchasingCustomResponseBody[0].onHandFbm == this.editItemResponseBody.onHandFbm, `onHandFbm - Expected: ${this.editItemResponseBody.onHandFbm}, Actual: ${this.getItemsInPurchasingCustomResponseBody[0].onHandFbm}`)
    this.softAssert(this.getItemsInPurchasingCustomResponseBody[0].onHandThirdParty == this.editItemResponseBody.onHandThirdParty, `onHandThirdParty - Expected: ${this.editItemResponseBody.onHandThirdParty}, Actual: ${this.getItemsInPurchasingCustomResponseBody[0].onHandThirdParty}`)
    this.softAssert(this.getItemsInPurchasingCustomResponseBody[0].description == this.editItemResponseBody.description, `description - Expected: ${this.editItemResponseBody.description}, Actual: ${this.getItemsInPurchasingCustomResponseBody[0].description}`)
    this.softAssert(this.getItemsInPurchasingCustomResponseBody[0].leadTime == this.editItemResponseBody.leadTime, `leadTime - Expected: ${this.editItemResponseBody.leadTime}, Actual: ${this.getItemsInPurchasingCustomResponseBody[0].leadTime}`)
    this.softAssert(this.getItemsInPurchasingCustomResponseBody[0].orderInterval == this.editItemResponseBody.orderInterval, `orderInterval - Expected: ${this.editItemResponseBody.orderInterval}, Actual: ${this.getItemsInPurchasingCustomResponseBody[0].orderInterval}`)
    this.softAssert(this.getItemsInPurchasingCustomResponseBody[0].otMultipleQty == this.editItemResponseBody.otMultipleQty, `otMultipleQty - Expected: ${this.editItemResponseBody.otMultipleQty}, Actual: ${this.getItemsInPurchasingCustomResponseBody[0].otMultipleQty}`)
    this.softAssert(_.isEqual(this.getItemsInPurchasingCustomResponseBody[0].tags, this.editItemResponseBody.tags), `tags - Expected: ${this.editItemResponseBody.tags}, Actual: ${this.getItemsInPurchasingCustomResponseBody[0].tags}`)
    this.softAssert(this.getItemsInPurchasingCustomResponseBody[0].onHandMin == this.editItemResponseBody.onHandMin), `onHandMin - Expected: ${this.editItemResponseBody.onHandMin}, Actual: ${this.getItemsInPurchasingCustomResponseBody[0].onHandMin}`
    this.softAssert(this.getItemsInPurchasingCustomResponseBody[0].onHandThirdParty == this.editItemResponseBody.onHandThirdParty, `onHandThirdParty - Expected: ${this.editItemResponseBody.onHandThirdParty}, Actual: ${this.getItemsInPurchasingCustomResponseBody[0].onHandThirdParty}`)
    this.softAssert(this.getItemsInPurchasingCustomResponseBody[0].inventorySourcePreference == this.editItemResponseBody.inventorySourcePreference, `inventorySourcePreference - Expected: ${this.editItemResponseBody.inventorySourcePreference}, Actual: ${this.getItemsInPurchasingCustomResponseBody[0].inventorySourcePreference}`)
    expect(this.countErrors).toBe(0)
});

Given(`User checks some values in result must be updated after update values of item in "Manage Company > Items" and run forecast`, function () {
    this.softAssert(this.getResultsResponseBody.model.settingsSources.serviceLevel.value == this.editItemResponseBody.serviceLevel, `serviceLevel - Expected: ${this.editItemResponseBody.serviceLevel}, Actual: ${this.getResultsResponseBody.model.settingsSources.serviceLevel.value}`)
    this.softAssert(this.getResultsResponseBody.model.settingsSources.leadTime.value == this.editItemResponseBody.leadTime, `leadTime - Expected: ${this.editItemResponseBody.leadTime}, Actual: ${this.getResultsResponseBody.model.settingsSources.leadTime.value}`)
    this.softAssert(this.getResultsResponseBody.model.settingsSources.moq.value == this.editItemResponseBody.moq, `moq - Expected: ${this.editItemResponseBody.moq}, Actual: ${this.getResultsResponseBody.model.settingsSources.moq.value}`)
    this.softAssert(this.getResultsResponseBody.model.settingsSources.orderInterval.value == this.editItemResponseBody.orderInterval, `orderInterval - Expected: ${this.editItemResponseBody.orderInterval}, Actual: ${this.getResultsResponseBody.model.settingsSources.orderInterval.value}`)
    expect(this.countErrors).toBe(0)
});

Given(`User verify that "Existing PO Qty" of item in "Purchasing > Custom" must be updated after update values of item in "Manage Company > Supply" and run forecast`, function () {
    this.softAssert(this.getItemsInPurchasingCustomResponseBody[0].openPurchaseOrders == this.expectedOpenTy, `openPurchaseOrders - Expected: ${this.expectedOpenTy}, Actual: ${this.getItemsInPurchasingCustomResponseBody[0].openPurchaseOrders}`)
    expect(this.countErrors).toBe(0)
});

Given(`User verify that "Existing PO Qty" of item in "Purchasing > My Suggested" must be updated after update values of item in "Manage Company > Supply" and run forecast`, function () {
    if (Number(this.forecastRecommendQty) > 0) {
        this.softAssert(this.getItemsInPOResponseBody.model[0].openPurchaseOrders == this.expectedOpenTy, `openPurchaseOrders - Expected: ${this.expectedOpenTy}, Actual: ${this.getItemsInPOResponseBody.model[0].openPurchaseOrders}`)
        expect(this.countErrors).toBe(0)
    }
});

Given(`User verify that "Open Sales Orders" of item in "Purchasing > Custom" must be updated after update values of item in "Manage Company > Demand" and run forecast`, function () {
    this.softAssert(this.getItemsInPurchasingCustomResponseBody[0].openSalesOrders == this.editDemandResponseBody.openQty, `openSalesOrders - Expected: ${this.editDemandResponseBody.openQty}, Actual: ${this.getItemsInPurchasingCustomResponseBody[0].openSalesOrders}`)
    expect(this.countErrors).toBe(0)
});

Given(`User verify that "Open Sales Orders" of item in "Purchasing > My Suggested" must be updated after update values of item in "Manage Company > Demand" and run forecast`, function () {
    if (Number(this.forecastRecommendQty) > 0) {
        this.softAssert(this.getItemsInPOResponseBody.model[0].openSalesOrders == this.editDemandResponseBody.openQty, `openSalesOrders - Expected: ${this.editDemandResponseBody.openQty}, Actual: ${this.getItemsInPOResponseBody.model[0].openSalesOrders}`)
        expect(this.countErrors).toBe(0)
    }
});

Given(`{} sends a GET request to get a Purchase As item in Custom`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getItemsPurchaseAsResponse = this.response = await itemRequest.getItemsInPurchasingCustom(this.request, this.linkGetPurchaseAsItemsInCustom, options);
    const responseBodyText = await this.getItemsPurchaseAsResponse.text();
    if (this.getItemsPurchaseAsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.getItemsPurchaseAsResponseBody = this.getItemsResponseBody = JSON.parse(await this.getItemsPurchaseAsResponse.body());
        this.randomAPurchaseAsItemObject = this.getItemsPurchaseAsResponseBody[Math.floor(Math.random() * this.getItemsInPurchasingCustomResponseBody.length)];
        logger.log('info', `Random object in response GET ${this.linkGetPurchaseAsItemsInCustom} >>>>>>` + JSON.stringify(this.randomAPurchaseAsItemObject, undefined, 4));
        this.attach(`Random object in response GET ${this.linkGetPurchaseAsItemsInCustom} >>>>>>` + JSON.stringify(this.randomAPurchaseAsItemObject, undefined, 4));
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Random object in Response GET ${this.linkGetPurchaseAsItemsInCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${responseBodyText}`);
        this.attach(`Random object in Response GET ${this.linkGetPurchaseAsItemsInCustom} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>> ${actualResponseText}`)
    }
});

Then(`{} saves the purchase as item key`, async function (actor: string) {
    this.itemPurchaseAsKey = this.responseBodyOfAItemObject.key;
    this.itemPurchaseAsName = this.responseBodyOfAItemObject.name;
    logger.log('info', `Item name: ${this.itemPurchaseAsName}`);
    this.attach(`Item name: ${this.itemPurchaseAsName}`);
    logger.log('info', `Item key: ${this.itemPurchaseAsKey}`);
    this.attach(`Item key: ${this.itemPurchaseAsKey}`);
});

Given('{} sets request body of edit item api with payload', async function (actor: string, dataTable: DataTable) {
    // Prepare endpoint for request to edit item
    link = `${Links.API_ITEMS}/${this.itemKey === undefined ? this.responseBodyOfAItemObject.key : this.itemKey}`
    var editColumn: string = dataTable.hashes()[0].editColumn;
    var companyType: string = dataTable.hashes()[0].companyType;
    var value: string = dataTable.hashes()[0].value;
    switch (editColumn) {
        case 'doNotRestock':
            if (value == 'random') {
                this.responseBodyOfAItemObject.doNotRestock = this.doNotRestock = !(Boolean(this.responseBodyOfAItemObject.doNotRestock));
            }

            logger.log('info', `New ${editColumn}: ${this.doNotRestock}`);
            this.attach(`New ${editColumn}: ${this.doNotRestock}`);
            break;
        case 'doNotOrder':
            if (value == 'random') {
                this.responseBodyOfAItemObject.doNotOrder = this.doNotOrder = !(Boolean(this.responseBodyOfAItemObject.doNotOrder));
            }

            logger.log('info', `New ${editColumn}: ${this.doNotOrder}`);
            this.attach(`New ${editColumn}: ${this.doNotOrder}`);
            break;
        case 'itemName':
            if (value == 'random') {
                this.name = `${faker.random.alphaNumeric(10).toUpperCase()}-${faker.datatype.number(500)}-Auto`;
            }

            logger.log('info', `New ${editColumn}: ${this.name}`);
            this.attach(`New ${editColumn}: ${this.name}`);
            break;
        case 'asin':
            if (value == 'random') {
                this.asin = `${faker.random.alphaNumeric(10).toUpperCase()}`;
            }

            logger.log('info', `New ${editColumn}: ${this.asin}`);
            this.attach(`New ${editColumn}: ${this.asin}`);
            break;
        case 'fnsku':
            if (value == 'random') {
                this.fnsku = `${faker.random.alphaNumeric(10).toUpperCase()}`;
            }

            logger.log('info', `New ${editColumn}: ${this.fnsku}`);
            this.attach(`New ${editColumn}: ${this.fnsku}`);
            break;
        case 'itemHistoryLength':
            if (value == 'random') {
                this.responseBodyOfAItemObject.itemHistoryLength = this.itemHistoryLength = Number(faker.random.numeric());
            }

            logger.log('info', `New ${editColumn}: ${this.itemHistoryLength}`);
            this.attach(`New ${editColumn}: ${this.itemHistoryLength}`);
            break;
        case 'description':
            if (value == 'random') {
                this.description = faker.lorem.words(3);
            }

            logger.log('info', `New ${editColumn}: ${this.description}`);
            this.attach(`New ${editColumn}: ${this.description}`);
            break;
        case 'supplierName':
            if (value == 'random') {
                const excludedSupplierKey = this.responseBodyOfAItemObject.vendorKey

                // Filter out the excluded supplier have excludedSupplierKey from the list suppliers                
                const filteredArray = this.getSupplierResponseBody.filter((supplier: any) => supplier.key !== excludedSupplierKey);
                const randomSupplier = filteredArray[Math.floor(Math.random() * filteredArray.length)];
                logger.log('info', `Random supplier` + JSON.stringify(randomSupplier, undefined, 4));
                this.attach(`Random supplier` + JSON.stringify(randomSupplier, undefined, 4))

                this.vendorKey = randomSupplier.key;
                this.vendorName = randomSupplier.name;
            } else if (value == 'supplierUpdatedSalesVelocity') {
                this.vendorKey = this.supplierKey;
                this.vendorName = this.supplierName;
            } else if (value == 'null') {
                this.vendorKey = null
                this.vendorName = null
            }

            logger.log('info', `New ${editColumn}: ${this.vendorName} - ${this.supplierKey}`);
            this.attach(`New ${editColumn}: ${this.vendorName} - ${this.supplierKey}`);
            break;
        case 'supplierPrice':
            if (value == 'random') {
                this.vendorPrice = Number(faker.random.numeric());
            }

            logger.log('info', `New ${editColumn}: ${this.vendorPrice}`);
            this.attach(`New ${editColumn}: ${this.vendorPrice}`);
            break;
        case 'moq':
            if (value == 'random') {
                this.moq = Number(faker.random.numeric());
            }

            logger.log('info', `New ${editColumn}: ${this.moq}`);
            this.attach(`New ${editColumn}: ${this.moq}`);
            break;
        case 'leadTime':
            if (value == 'random') {
                this.leadTime = Number(faker.datatype.number({
                    'min': 1,
                    'max': 365
                }));
            }

            logger.log('info', `New ${editColumn}: ${this.leadTime}`);
            this.attach(`New ${editColumn}: ${this.leadTime}`);
            break;
        case 'orderInterval':
            if (value == 'random') {
                this.orderInterval = Number(faker.random.numeric());
            }

            logger.log('info', `New ${editColumn}: ${this.orderInterval}`);
            this.attach(`New ${editColumn}: ${this.orderInterval}`);
            break;
        case 'serviceLevel':
            if (value == 'random') {
                this.serviceLevel = Number(faker.random.numeric(2));
            }

            logger.log('info', `New ${editColumn}: ${this.serviceLevel}`);
            this.attach(`New ${editColumn}: ${this.serviceLevel}`);
            break;
        case 'onHanFBAQty':
            if (value == 'random') {
                this.onHand = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.onHand}`);
            this.attach(`New ${editColumn}: ${this.onHand}`);
            break;
        case 'onHandQtyMin':
            if (value == 'random') {
                this.onHandMin = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.onHandMin}`);
            this.attach(`New ${editColumn}: ${this.onHandMin}`);
            break;
        case 'warehouseQty':
            if (value == 'random') {
                this.onHandThirdParty = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.onHandThirdParty}`);
            this.attach(`New ${editColumn}: ${this.onHandThirdParty}`);
            break;
        case 'warehouseQtyMin':
            if (value == 'random') {
                this.onHandThirdPartyMin = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.onHandThirdPartyMin}`);
            this.attach(`New ${editColumn}: ${this.onHandThirdPartyMin}`);
            break;
        case 'onHandFBMQty':
            if (value == 'random') {
                this.onHandFbm = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.onHandFbm}`);
            this.attach(`New ${editColumn}: ${this.onHandFbm}`);
            break;
        case 'skuNotes':
            if (value == 'random') {
                this.skuNotes = `SkuNotes ${faker.lorem.word(2)}`;
            }

            logger.log('info', `New ${editColumn}: ${this.skuNotes}`);
            this.attach(`New ${editColumn}: ${this.skuNotes}`);
            break;
        case 'prepNotes':
            if (value == 'random') {
                this.prepNotes = `PrepNotes ${faker.lorem.word(2)}`;
            }

            logger.log('info', `New ${editColumn}: ${this.prepNotes}`);
            this.attach(`New ${editColumn}: ${this.prepNotes}`);
            break;
        case 'supplierRebate':
            if (value == 'random') {
                this.supplierRebate = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.supplierRebate}`);
            this.attach(`New ${editColumn}: ${this.supplierRebate}`);
            break;
        case 'inboundShippingCost':
            if (value == 'random') {
                this.inboundShippingCost = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.supplierRebate}`);
            this.attach(`New ${editColumn}: ${this.supplierRebate}`);
            break;
        case 'reshippingCost':
            if (value == 'random') {
                this.reshippingCost = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.reshippingCost}`);
            this.attach(`New ${editColumn}: ${this.reshippingCost}`);
            break;
        case 'repackagingMaterialCost':
            if (value == 'random') {
                this.repackagingMaterialCost = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.repackagingMaterialCost}`);
            this.attach(`New ${editColumn}: ${this.repackagingMaterialCost}`);
            break;
        case 'repackingLaborCost':
            if (value == 'random') {
                this.repackingLaborCost = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.repackingLaborCost}`);
            this.attach(`New ${editColumn}: ${this.repackingLaborCost}`);
            break;
        case 'isHidden':
            if (value == 'random') {
                this.isHidden = !Boolean(this.responseBodyOfAItemObject.isHidden);
            } else {
                this.isHidden = Boolean(value)
            }

            logger.log('info', `New ${editColumn}: ${this.isHidden}`);
            this.attach(`New ${editColumn}: ${this.isHidden}`);
            break;
        case 'useHistoryOverride':
            if (value == 'random') {
                this.useHistoryOverride = !(Boolean(this.responseBodyOfAItemObject.useHistoryOverride));
            }
            else {
                this.useHistoryOverride = true;
            }
            logger.log('info', `New ${editColumn}: ${this.useHistoryOverride}`);
            this.attach(`New ${editColumn}: ${this.useHistoryOverride}`);
            break;
        case 'casePackQty':
            if (value == 'random') {
                this.lotMultipleQty = Number(faker.random.numeric(3));
            }

            logger.log('info', `New ${editColumn}: ${this.lotMultipleQty}`);
            this.attach(`New ${editColumn}: ${this.lotMultipleQty}`);
            break;
        case 'inventorySourcePreference':
            if (value == 'random') {
                const inventorySources = ['FBA', 'FBM', 'FBA+FBM'];
                const excludedInventorySource = this.responseBodyOfAItemObject.inventorySourcePreference;

                // Filter out the excluded inventory source value from the inventorySources array
                const filteredArray = inventorySources.filter((value) => value !== excludedInventorySource);
                this.inventorySourcePreference = filteredArray[Math.floor(Math.random() * filteredArray.length)];
            }

            logger.log('info', `New ${editColumn}: ${this.inventorySourcePreference}`);
            this.attach(`New ${editColumn}: ${this.inventorySourcePreference}`);
            break;
        case 'purchaseAs':
            if (value == 'random') {
                if (companyType !== "QBFS") {
                    this.payloadCreateItem = {
                        "key": "",
                        "name": `${faker.random.alphaNumeric(6).toUpperCase()}-${faker.datatype.number(500)}-Auto`,
                        "asin": companyType === "ASC" ? `${faker.random.alphaNumeric(10).toUpperCase()}` : "",
                        "fnsku": companyType === "ASC" ? `${faker.random.alphaNumeric(10).toUpperCase()}` : "",
                        "description": "",
                        "vendorKey": null,
                        "vendorName": null,
                        "vendorPrice": 0,
                        "moq": 1,
                        "leadTime": 1,
                        "orderInterval": 0,
                        "serviceLevel": 85,
                        "onHand": 0,
                        "onHandMin": "",
                        "onHandThirdParty": 0,
                        "onHandThirdPartyMin": "",
                        "growthTrend": 0,
                        "isHidden": false,
                        "useHistoryOverride": false,
                        "lotMultipleQty": 1,
                        "lotMultipleItemKey": null,
                        "lotMultipleItemName": null,
                        "forecastDirty": false,
                        "forecastTags": [],
                        "tags": [],
                        "useBackfill": false,
                        "useLostSalesOverride": false,
                        "createdAt": "2023-04-11T08:09:03.909Z",
                        "isFbm": false,
                        "inventorySourcePreference": "",
                        "skuNotes": "",
                        "prepNotes": "",
                        "supplierRebate": "",
                        "inboundShippingCost": 0,
                        "reshippingCost": 0,
                        "repackagingMaterialCost": 0,
                        "repackingLaborCost": 0,
                        "inboundShipped": 0,
                        "inboundReceiving": 0,
                        "inbound": 0,
                        "inboundFcTransfer": 0,
                        "referralFee": 0,
                        "fbaFee": 0,
                        "rank": 0,
                        "variableClosingFee": 0,
                        "lowestFba": 0,
                        "newBuyBox": 0,
                        "listPrice": 0,
                        "average7DayPrice": 0,
                        "itemHistoryLength": 0,
                        "history": null,
                        "links": null,
                        "packageWeight": "",
                        "onHandFbm": "",
                        "prepGuide": "",
                        "dimensionalWeight": "",
                        "hazmat": "",
                        "oversized": "",
                        "category": "",
                        "upc": "",
                        "ean": ""
                    }

                    // Create new item to set purchase as      
                    this.attach(`Payload Create new item to set purchase as: ${JSON.stringify(this.payloadCreateItem, undefined, 4)}`)

                    const createItemResponse = await itemRequest.createItem(this.request, Links.API_ITEMS, this.payloadCreateItem, this.headers);
                    const responseBodyText = await createItemResponse.text();

                    if (createItemResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
                        const responseBodyOfAItemObject = JSON.parse(responseBodyText);
                        this.lotMultipleItemName = responseBodyOfAItemObject.name
                        this.lotMultipleItemKey = responseBodyOfAItemObject.key
                        logger.log('info', `Response POST Create new item to set purchase as ${link}` + JSON.stringify(responseBodyOfAItemObject, undefined, 4));
                        this.attach(`Response POST Create new item to set purchase as ${link}` + JSON.stringify(responseBodyOfAItemObject, undefined, 4))
                    }
                    else {
                        this.lotMultipleItemName = null
                        this.lotMultipleItemKey = null
                        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
                        logger.log('info', `Response POST Create new item to set purchase as ${link} has status code ${createItemResponse.status()} ${createItemResponse.statusText()} and response body ${responseBodyText}`);
                        this.attach(`Response POST Create new item to set purchase as ${link} has status code ${createItemResponse.status()} ${createItemResponse.statusText()} and response body ${actualResponseText}`)
                    }
                } else {
                    const excludedItemKey = this.itemKey
                    // Filter out the excluded item have already set as purchas as of orther items the list items
                    const filteredArray = this.getItemsResponseBody.filter((item: any) => ((item.key !== excludedItemKey) && (!this.listItemsAlreadySetAsPurchaseAsOfOrtherItem.includes(item.key))));
                    const randomItem = filteredArray[Math.floor(Math.random() * filteredArray.length)];

                    this.lotMultipleItemName = randomItem.name
                    this.lotMultipleItemKey = randomItem.key
                }
            } else if (value == 'null') {
                this.lotMultipleItemName = null
                this.lotMultipleItemKey = null
            } else if (value == 'itself') {
                this.lotMultipleItemName = this.itemName;
                this.lotMultipleItemKey = this.itemKey;
            } else if (value == 'hard') {
                this.lotMultipleItemName = this.itemPurchaseAsName;
                this.lotMultipleItemKey = this.itemPurchaseAsKey;
            } else if (value == "dynamic") {
                const excludedItemKey = this.itemKey
                // Filter out the excluded item have already set as purchase as of other items the list items
                const filteredArray = this.getItemsResponseBody.filter((item: any) => ((item.key !== excludedItemKey) && (!this.listItemsAlreadySetAsPurchaseAsOfOrtherItem.includes(item.key))));
                const randomItem = filteredArray[Math.floor(Math.random() * filteredArray.length)];

                this.lotMultipleItemName = randomItem.name
                this.lotMultipleItemKey = randomItem.key
            }

            logger.log('info', `New ${editColumn}: ${this.lotMultipleItemName}`);
            this.attach(`New ${editColumn}: ${this.lotMultipleItemName}`);
            break;
        case 'useBackfill':
            if (value == 'random') {
                this.useBackfill = !(Boolean(this.responseBodyOfAItemObject.useBackfill));
            }
            else {
                this.useBackfill = Boolean(value);
            }
            logger.log('info', `New ${editColumn}: ${this.useBackfill}`);
            this.attach(`New ${editColumn}: ${this.useBackfill}`);
            break;
        default:
            break;
    }

    // Prepare payload for request to edit item
    if (companyType === 'ASC') {
        this.payLoad = {
            companyType: `${this.responseBodyOfAItemObject.companyType}`,
            companyKey: `${this.responseBodyOfAItemObject.companyKey}`,
            key: `${this.responseBodyOfAItemObject.key === undefined ? this.responseBodyOfAItemObject.itemKey : this.responseBodyOfAItemObject.key}`,
            name: this.name === undefined ? this.responseBodyOfAItemObject.name : `${this.name}`,
            asin: this.asin === undefined ? this.responseBodyOfAItemObject.asin : `${this.asin}`,
            fnsku: this.fnsku === undefined ? this.responseBodyOfAItemObject.fnsku : `${this.fnsku}`,
            description: this.description === undefined ? this.responseBodyOfAItemObject.description : `${this.description}`,
            packageWeight: this.responseBodyOfAItemObject.packageWeight,
            vendorKey: this.vendorKey === undefined ? this.responseBodyOfAItemObject.vendorKey : this.vendorKey === null ? null : `${this.vendorKey}`,
            vendorName: this.vendorName === undefined ? this.responseBodyOfAItemObject.vendorName : this.vendorName === null ? null : `${this.vendorName}`,
            vendorPrice: this.vendorPrice === undefined ? this.responseBodyOfAItemObject.vendorPrice : this.vendorPrice,
            moq: this.moq === undefined ? this.responseBodyOfAItemObject.moq : this.moq,
            leadTime: this.leadTime === undefined ? this.responseBodyOfAItemObject.leadTime : this.leadTime,
            orderInterval: this.orderInterval === undefined ? this.responseBodyOfAItemObject.orderInterval : this.orderInterval,
            serviceLevel: this.serviceLevel === undefined ? this.responseBodyOfAItemObject.serviceLevel : this.serviceLevel,
            onHand: this.onHand === undefined ? this.responseBodyOfAItemObject.onHand : this.onHand,
            onHandMin: this.onHandMin === undefined ? this.responseBodyOfAItemObject.onHandMin : this.onHandMin,
            onHandThirdParty: this.onHandThirdParty === undefined ? this.responseBodyOfAItemObject.onHandThirdParty : this.onHandThirdParty,
            onHandThirdPartyMin: this.onHandThirdPartyMin === undefined ? this.responseBodyOfAItemObject.onHandThirdPartyMin : this.onHandThirdPartyMin,
            onHandFbm: this.onHandFbm === undefined ? this.responseBodyOfAItemObject.onHandFbm : this.onHandFbm,
            skuNotes: this.skuNotes === undefined ? this.responseBodyOfAItemObject.skuNotes : `${this.skuNotes}`,
            prepGuide: this.responseBodyOfAItemObject.prepGuide,
            prepNotes: this.prepNotes === undefined ? this.responseBodyOfAItemObject.prepNotes : `${this.prepNotes}`,
            supplierRebate: this.supplierRebate === undefined ? this.responseBodyOfAItemObject.supplierRebate : this.supplierRebate,
            inboundShippingCost: this.inboundShippingCost === undefined ? this.responseBodyOfAItemObject.inboundShippingCost : this.inboundShippingCost,
            reshippingCost: this.reshippingCost === undefined ? this.responseBodyOfAItemObject.reshippingCost : this.reshippingCost,
            repackagingMaterialCost: this.repackagingMaterialCost === undefined ? this.responseBodyOfAItemObject.repackagingMaterialCost : this.repackagingMaterialCost,
            repackingLaborCost: this.repackingLaborCost === undefined ? this.responseBodyOfAItemObject.repackingLaborCost : this.repackingLaborCost,
            dimensionalWeight: this.responseBodyOfAItemObject.dimensionalWeight,
            hazmat: this.responseBodyOfAItemObject.hazmat,
            oversized: this.responseBodyOfAItemObject.oversized,
            category: this.responseBodyOfAItemObject.category,
            rank: this.responseBodyOfAItemObject.rank,
            doNotOrder: this.responseBodyOfAItemObject.doNotOrder,
            doNotRestock: this.responseBodyOfAItemObject.doNotRestock,
            growthTrend: this.responseBodyOfAItemObject.growthTrend,
            isHidden: this.isHidden === undefined ? this.responseBodyOfAItemObject.isHidden : this.isHidden,
            useHistoryOverride: this.useHistoryOverride === undefined ? this.responseBodyOfAItemObject.useHistoryOverride : this.useHistoryOverride,
            useLostSalesOverride: this.responseBodyOfAItemObject.useLostSalesOverride,
            lotMultipleQty: this.lotMultipleQty === undefined ? this.responseBodyOfAItemObject.lotMultipleQty : this.lotMultipleQty,
            lotMultipleItemKey: this.lotMultipleItemKey === undefined ? this.responseBodyOfAItemObject.lotMultipleItemKey : this.lotMultipleItemKey === null ? null : `${this.lotMultipleItemKey}`,
            lotMultipleItemName: this.lotMultipleItemName === undefined ? this.responseBodyOfAItemObject.lotMultipleItemName : this.lotMultipleItemName === null ? null : `${this.lotMultipleItemName}`,
            // forecastDirty is true => Run forecast for this item
            forecastDirty: true,
            forecastTags: this.responseBodyOfAItemObject.forecastTags,
            tag: this.responseBodyOfAItemObject.tag,
            tags: this.responseBodyOfAItemObject.tags,
            useBackfill: this.useBackfill === undefined ? this.responseBodyOfAItemObject.useHistoryOverride : this.useBackfill,
            createdAt: `${this.responseBodyOfAItemObject.created_at}`,
            inbound: this.responseBodyOfAItemObject.inbound,
            inboundPrice: this.responseBodyOfAItemObject.inboundPrice,
            inboundSalesLast30Days: this.responseBodyOfAItemObject.inboundSalesLast30Days,
            inboundAvailable: this.responseBodyOfAItemObject.inboundAvailable,
            inboundFcTransfer: this.responseBodyOfAItemObject.inboundFcTransfer,
            inboundFcProcessing: this.responseBodyOfAItemObject.inboundFcProcessing,
            inboundCustomerOrder: this.responseBodyOfAItemObject.inboundCustomerOrder,
            inboundUnfulfillable: this.responseBodyOfAItemObject.inboundUnfulfillable,
            inboundAlert: this.responseBodyOfAItemObject.inboundAlert,
            inboundWorking: this.responseBodyOfAItemObject.inboundWorking,
            mwsFulfillmentFee: this.responseBodyOfAItemObject.mwsFulfillmentFee,
            inventorySourcePreference: this.inventorySourcePreference === undefined ? this.responseBodyOfAItemObject.inventorySourcePreference : `${this.inventorySourcePreference}`,
            reserved: this.responseBodyOfAItemObject.reserved,
            imageUrl: this.responseBodyOfAItemObject.imageUrl,
            fba: this.responseBodyOfAItemObject.fba,
            lowestFba: this.responseBodyOfAItemObject.lowestFba,
            nonFba: this.responseBodyOfAItemObject.nonFba,
            lowestNonFba: this.responseBodyOfAItemObject.lowestNonFba,
            soldBy: this.responseBodyOfAItemObject.soldBy,
            fbaFee: this.responseBodyOfAItemObject.fbaFee,
            variableClosingFee: this.responseBodyOfAItemObject.variableClosingFee,
            newBuyBox: this.responseBodyOfAItemObject.newBuyBox,
            inboundShipped: this.responseBodyOfAItemObject.inboundShipped,
            inboundReceiving: this.responseBodyOfAItemObject.inboundReceiving,
            referralFee: this.responseBodyOfAItemObject.referralFee,
            listPrice: this.responseBodyOfAItemObject.listPrice,
            average7DayPrice: this.responseBodyOfAItemObject.average7DayPrice,
            condition: this.responseBodyOfAItemObject.condition,
            syncedFields: this.responseBodyOfAItemObject.syncedFields,
            isFbm: this.responseBodyOfAItemObject.isFbm,
            itemHistoryLength: this.responseBodyOfAItemObject.itemHistoryLength,
            itemHistoryLengthInDay: this.responseBodyOfAItemObject.itemHistoryLengthInDay,
            created_at: `${this.responseBodyOfAItemObject.created_at}`,
            updated_at: `${this.responseBodyOfAItemObject.updated_at}`,
            s2d: this.responseBodyOfAItemObject.s2d,
            s7d: this.responseBodyOfAItemObject.s7d,
            s14d: this.responseBodyOfAItemObject.s14d,
            s30d: this.responseBodyOfAItemObject.s30d,
            s60d: this.responseBodyOfAItemObject.s60d,
            s90d: this.responseBodyOfAItemObject.s90d,
            s180d: this.responseBodyOfAItemObject.s180d,
            s365d: this.responseBodyOfAItemObject.s365d,
            outOfStock2d: this.responseBodyOfAItemObject.outOfStock2d,
            outOfStock7d: this.responseBodyOfAItemObject.outOfStock7d,
            outOfStock14d: this.responseBodyOfAItemObject.outOfStock14d,
            outOfStock30d: this.responseBodyOfAItemObject.outOfStock30d,
            outOfStock60d: this.responseBodyOfAItemObject.outOfStock60d,
            outOfStock90d: this.responseBodyOfAItemObject.outOfStock90d,
            outOfStock180d: this.responseBodyOfAItemObject.outOfStock180d,
            history: this.responseBodyOfAItemObject.history === undefined ? null : this.responseBodyOfAItemObject.history,
            links: this.responseBodyOfAItemObject.links === undefined ? null : this.responseBodyOfAItemObject.links
        }
    } else if (companyType === 'CSV' || companyType === 'QBFS') {
        this.payLoad = {
            companyType: `${this.responseBodyOfAItemObject.companyType}`,
            companyKey: `${this.responseBodyOfAItemObject.companyKey}`,
            key: `${this.responseBodyOfAItemObject.key}`,
            name: this.name === undefined ? this.responseBodyOfAItemObject.name : `${this.name}`,
            asin: this.asin === undefined ? this.responseBodyOfAItemObject.asin : `${this.asin}`,
            fnsku: this.fnsku === undefined ? this.responseBodyOfAItemObject.fnsku : `${this.fnsku}`,
            description: this.description === undefined ? this.responseBodyOfAItemObject.description : `${this.description}`,
            packageWeight: this.responseBodyOfAItemObject.packageWeight,
            vendorKey: this.vendorKey === undefined ? this.responseBodyOfAItemObject.vendorKey : `${this.vendorKey}`,
            vendorName: this.vendorName === undefined ? this.responseBodyOfAItemObject.vendorName : `${this.vendorName}`,
            vendorPrice: this.vendorPrice === undefined ? this.responseBodyOfAItemObject.vendorPrice : this.vendorPrice,
            moq: this.moq === undefined ? this.responseBodyOfAItemObject.moq : this.moq,
            leadTime: this.leadTime === undefined ? this.responseBodyOfAItemObject.leadTime : this.leadTime,
            orderInterval: this.orderInterval === undefined ? this.responseBodyOfAItemObject.orderInterval : this.orderInterval,
            serviceLevel: this.serviceLevel === undefined ? this.responseBodyOfAItemObject.serviceLevel : this.serviceLevel,
            onHand: this.onHand === undefined ? this.responseBodyOfAItemObject.onHand : this.onHand,
            onHandMin: this.onHandMin === undefined ? this.responseBodyOfAItemObject.onHandMin : this.onHandMin,
            onHandThirdParty: this.onHandThirdParty === undefined ? this.responseBodyOfAItemObject.onHandThirdParty : this.onHandThirdParty,
            onHandThirdPartyMin: this.onHandThirdPartyMin === undefined ? this.responseBodyOfAItemObject.onHandThirdPartyMin : this.onHandThirdPartyMin,
            onHandFbm: this.onHandFbm === undefined ? this.responseBodyOfAItemObject.onHandFbm : this.onHandFbm,
            skuNotes: this.skuNotes === undefined ? this.responseBodyOfAItemObject.skuNotes : `${this.skuNotes}`,
            prepGuide: this.responseBodyOfAItemObject.prepGuide,
            prepNotes: this.prepNotes === undefined ? this.responseBodyOfAItemObject.prepNotes : `${this.prepNotes}`,
            supplierRebate: this.supplierRebate === undefined ? this.responseBodyOfAItemObject.supplierRebate : this.supplierRebate,
            inboundShippingCost: this.inboundShippingCost === undefined ? this.responseBodyOfAItemObject.inboundShippingCost : this.inboundShippingCost,
            reshippingCost: this.reshippingCost === undefined ? this.responseBodyOfAItemObject.reshippingCost : this.reshippingCost,
            repackagingMaterialCost: this.repackagingMaterialCost === undefined ? this.responseBodyOfAItemObject.repackagingMaterialCost : this.repackagingMaterialCost,
            repackingLaborCost: this.repackingLaborCost === undefined ? this.responseBodyOfAItemObject.repackingLaborCost : this.repackingLaborCost,
            dimensionalWeight: this.responseBodyOfAItemObject.dimensionalWeight,
            hazmat: this.responseBodyOfAItemObject.hazmat,
            oversized: this.responseBodyOfAItemObject.oversized,
            category: this.responseBodyOfAItemObject.category,
            rank: this.responseBodyOfAItemObject.rank,
            growthTrend: this.responseBodyOfAItemObject.growthTrend,
            isHidden: this.isHidden === undefined ? this.responseBodyOfAItemObject.isHidden : this.isHidden,
            useHistoryOverride: this.useHistoryOverride === undefined ? this.responseBodyOfAItemObject.useHistoryOverride : this.useHistoryOverride,
            useLostSalesOverride: this.responseBodyOfAItemObject.useLostSalesOverride,
            lotMultipleQty: this.lotMultipleQty === undefined ? this.responseBodyOfAItemObject.lotMultipleQty : this.lotMultipleQty,
            lotMultipleItemKey: this.lotMultipleItemKey === undefined ? this.responseBodyOfAItemObject.lotMultipleItemKey : this.lotMultipleItemKey === null ? null : `${this.lotMultipleItemKey}`,
            lotMultipleItemName: this.lotMultipleItemName === undefined ? this.responseBodyOfAItemObject.lotMultipleItemName : this.lotMultipleItemName === null ? null : `${this.lotMultipleItemName}`,
            // forecastDirty is true => Run forecast for this item
            forecastDirty: true,
            forecastTags: this.responseBodyOfAItemObject.forecastTags,
            tag: this.responseBodyOfAItemObject.tag,
            tags: this.responseBodyOfAItemObject.tags,
            useBackfill: this.useBackfill === undefined ? this.responseBodyOfAItemObject.useHistoryOverride : this.useBackfill,
            createdAt: `${this.responseBodyOfAItemObject.created_at}`,
            inbound: this.responseBodyOfAItemObject.inbound,
            doNotRestock: this.responseBodyOfAItemObject.doNotRestock,
            doNotOrder: this.responseBodyOfAItemObject.doNotOrder,
            inboundPrice: this.responseBodyOfAItemObject.inboundPrice,
            inboundSalesLast30Days: this.responseBodyOfAItemObject.inboundSalesLast30Days,
            inboundAvailable: this.responseBodyOfAItemObject.inboundAvailable,
            inboundFcTransfer: this.responseBodyOfAItemObject.inboundFcTransfer,
            inboundFcProcessing: this.responseBodyOfAItemObject.inboundFcProcessing,
            inboundCustomerOrder: this.responseBodyOfAItemObject.inboundCustomerOrder,
            inboundUnfulfillable: this.responseBodyOfAItemObject.inboundUnfulfillable,
            inboundAlert: this.responseBodyOfAItemObject.inboundAlert,
            inboundWorking: this.responseBodyOfAItemObject.inboundWorking,
            mwsFulfillmentFee: this.responseBodyOfAItemObject.mwsFulfillmentFee,
            inventorySourcePreference: this.inventorySourcePreference === undefined ? this.responseBodyOfAItemObject.inventorySourcePreference : `${this.inventorySourcePreference}`,
            reserved: this.responseBodyOfAItemObject.reserved,
            imageUrl: this.responseBodyOfAItemObject.imageUrl,
            fba: this.responseBodyOfAItemObject.fba,
            lowestFba: this.responseBodyOfAItemObject.lowestFba,
            nonFba: this.responseBodyOfAItemObject.nonFba,
            lowestNonFba: this.responseBodyOfAItemObject.lowestNonFba,
            soldBy: this.responseBodyOfAItemObject.soldBy,
            fbaFee: this.responseBodyOfAItemObject.fbaFee,
            variableClosingFee: this.responseBodyOfAItemObject.variableClosingFee,
            newBuyBox: this.responseBodyOfAItemObject.newBuyBox,
            inboundShipped: this.responseBodyOfAItemObject.inboundShipped,
            inboundReceiving: this.responseBodyOfAItemObject.inboundReceiving,
            referralFee: this.responseBodyOfAItemObject.referralFee,
            listPrice: this.responseBodyOfAItemObject.listPrice,
            average7DayPrice: this.responseBodyOfAItemObject.average7DayPrice,
            condition: this.responseBodyOfAItemObject.condition,
            syncedFields: this.responseBodyOfAItemObject.syncedFields,
            isFbm: this.responseBodyOfAItemObject.isFbm,
            itemHistoryLength: this.responseBodyOfAItemObject.itemHistoryLength,
            itemHistoryLengthInDay: this.responseBodyOfAItemObject.itemHistoryLengthInDay,
            created_at: `${this.responseBodyOfAItemObject.created_at}`,
            updated_at: `${this.responseBodyOfAItemObject.updated_at}`,
            s2d: this.responseBodyOfAItemObject.s2d,
            s7d: this.responseBodyOfAItemObject.s7d,
            s14d: this.responseBodyOfAItemObject.s14d,
            s30d: this.responseBodyOfAItemObject.s30d,
            s60d: this.responseBodyOfAItemObject.s60d,
            s90d: this.responseBodyOfAItemObject.s90d,
            s180d: this.responseBodyOfAItemObject.s180d,
            s365d: this.responseBodyOfAItemObject.s365d,
            outOfStock2d: this.responseBodyOfAItemObject.outOfStock2d,
            outOfStock7d: this.responseBodyOfAItemObject.outOfStock7d,
            outOfStock14d: this.responseBodyOfAItemObject.outOfStock14d,
            outOfStock30d: this.responseBodyOfAItemObject.outOfStock30d,
            outOfStock60d: this.responseBodyOfAItemObject.outOfStock60d,
            outOfStock90d: this.responseBodyOfAItemObject.outOfStock90d,
            outOfStock180d: this.responseBodyOfAItemObject.outOfStock180d,
            history: this.responseBodyOfAItemObject.history === undefined ? null : this.responseBodyOfAItemObject.history,
        }
    }

    logger.log('info', `Payload` + JSON.stringify(this.payLoad, undefined, 4));
    this.attach(`Payload` + JSON.stringify(this.payLoad, undefined, 4))
});