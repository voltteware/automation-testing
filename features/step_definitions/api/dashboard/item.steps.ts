import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as itemRequest from '../../../../src/api/request/item.service';
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

Then(`{} sets GET api endpoint to get item summary`, async function (actor: string) {
    link = `${Links.API_ITEMS}?summary=true&companyKey=${this.companyKey}&companyType=${this.companyType}`;
});

Then(`{} sets GET api endpoint to get item with limit row: {}`, async function (actor, limitRow: string) {
    linkGetItems = `${Links.API_ITEMS}?offset=0&limit=${limitRow}`;
});

Then(`{} sets GET api endpoint to get items that have purchase as`, async function (actor) {
    linkGetItems = `${Links.API_ITEMS}?offset=0&limit=100&where={"filters":[{"filters":[{"field":"lotMultipleItemName","operator":"isnotnull","value":null}],"logic":"and"}],"logic":"and"}`    
});

Then(`{} sets GET api endpoint to get items that have not purchase as`, async function (actor) {
    linkGetItems = `${Links.API_ITEMS}?offset=0&limit=50&where={"filters":[{"filters":[{"field":"lotMultipleItemName","operator":"isnull","value":null}],"logic":"and"}],"logic":"and"}`    
});

Then(`{} set GET api endpoint to get items with name contains {string}`, async function (actor, containText: string) {
    linkGetItems = `${Links.API_ITEMS}?offset=0&limit=2&where={"filters":[{"filters":[{"field":"name","operator":"contains","value":"${containText}"}],"logic":"and"}],"logic":"and"}`    
});

Then(`{} set GET api endpoint to get item that is hidden`, async function (actor) {
    linkGetItems = `${Links.API_ITEMS}?offset=0&limit=1&where={"filters":[{"filters":[{"field":"name","operator":"eq","value":"${this.nameOfHiddenItem}"}],"logic":"and"}],"logic":"and"}`    
});

Then(`{} sets GET api endpoint to count items that is active and have lotMultipleItemKey is NULL`, async function (actor: string) {
    linkCountItems = linkGetActiveAndHasLotMultipleItemKeyNullItem = encodeURI(`${Links.API_ITEM_COUNT}?where={"filters":[{"filters":[{"field":"isHidden","operator":"eq","value":false},{"field":"isHidden","operator":"eq","value":null},{"field":"isHidden","operator":"eq","value":null}],"logic":"or"},{"filters":[{"field":"lotMultipleItemName","operator":"isnull","value":null}],"logic":"and"}],"logic":"and"}`);
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
        logger.log('info', `Response GET ${linkCountItems}>>>>>` + JSON.stringify(this.getCountItemsActiveResponseBody, undefined, 4));
        this.attach(`Response GET ${linkCountItems}>>>>>>` + JSON.stringify(this.getCountItemsActiveResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response GET ${linkCountItems} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>>${responseBodyText}`);
        this.attach(`Response GET ${linkCountItems} has status code ${this.response.status()} ${this.response.statusText()} and response body >>>>>>${actualResponseText}`)
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
    expect(this.getItemsResponseBody.length, 'There is at least 1 item to pick random').toBeGreaterThanOrEqual(1);
    this.responseBodyOfAItemObject = await this.getItemsResponseBody[Math.floor(Math.random() * this.getItemsResponseBody.length)];
    logger.log('info', `Random Item: ${JSON.stringify(this.responseBodyOfAItemObject, undefined, 4)}`);
    this.attach(`Random Item: ${JSON.stringify(this.responseBodyOfAItemObject, undefined, 4)}`);
});

Given('User saves list items that have already set as purchas as of orther items', async function () {
    expect(this.getItemsResponseBody.length, 'There is at least 1 item to pick random').toBeGreaterThanOrEqual(1);
    this.listItemsAlreadySetAsPurchaseAsOfOrtherItem = this.getItemsResponseBody.map((item: any) => item.lotMultipleItemKey)
    logger.log('info', `list items that have already set as purchas as of orther items: ${JSON.stringify(this.listItemsAlreadySetAsPurchaseAsOfOrtherItem, undefined, 4)}`);
    this.attach(`list items that have already set as purchas as of orther items: ${JSON.stringify(this.listItemsAlreadySetAsPurchaseAsOfOrtherItem, undefined, 4)}`);
});

Given('{} picks a random item which does not have Purchase As', async function (actor: string){
    expect(this.getItemsResponseBody.length, 'There is at least 1 item to pick random').toBeGreaterThanOrEqual(1);
    // Get items which are not related to Purchase As
    this.listItemsNotPurchaseAs = this.getItemsResponseBody.filter((item: any) => item.lotMultipleItemKey == null && item.lotMultipleItemName == null);
    this.responseBodyOfAItemObject = await this.listItemsNotPurchaseAs[Math.floor(Math.random() * this.listItemsNotPurchaseAs.length)];
    logger.log('info', `Random Item: ${JSON.stringify(this.responseBodyOfAItemObject, undefined, 4)}`);
    this.attach(`Random Item: ${JSON.stringify(this.responseBodyOfAItemObject, undefined, 4)}`);
});

Given('User picks max 10 random items in above list items', async function () {
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

Given('User sets PUT api endpoint to edit {} of the above item for company type {} with new value: {}', async function (editColumn: string, companyType: string, value: string) {    
    // Prepare endpoint for request to edit item
    link = `${Links.API_ITEMS}/${this.itemKey === undefined ? this.responseBodyOfAItemObject.key : this.itemKey}`

    switch (editColumn) {
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
                const randomSupplier = filteredArray[Math.floor(Math.random() * this.getSupplierResponseBody.length)];
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
        case 'onHanQty':
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
                if(companyType !== "QBFS"){
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
                    
                    // Create new item Item has already set as Purchase As of other items            
                    this.attach(`Payload Create new item: ${JSON.stringify(this.payloadCreateItem, undefined, 4)}`)
    
                    const createItemResponse = await itemRequest.createItem(this.request, Links.API_ITEMS, this.payloadCreateItem, this.headers);
                    const responseBodyOfAItemObject = JSON.parse(await createItemResponse.text());

                    this.lotMultipleItemName = responseBodyOfAItemObject.name
                    this.lotMultipleItemKey = responseBodyOfAItemObject.key
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
            }

            logger.log('info', `New ${editColumn}: ${this.lotMultipleItemName}`);
            this.attach(`New ${editColumn}: ${this.lotMultipleItemName}`);
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
            useBackfill: this.responseBodyOfAItemObject.useBackfill,
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
            useBackfill: this.responseBodyOfAItemObject.useBackfill,
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
        }
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

Then('User sets GET api endpoint to get item sales velocity settings', function () {
    linkGetItemSalesVelocitySettings = `${Links.API_ITEM_SALES_VELOCITY}/${this.itemKey}/purchasing`
});

Then('User sends GET request to get item sales velocity settings', async function () {
    const options = {
        headers: this.headers
    }

    this.getItemSalesVelocitySettingsResponse = this.response = await itemRequest.getItemSalesVelocitySettings(this.request, linkGetItemSalesVelocitySettings, options);
    const responseBodyText = await this.getItemSalesVelocitySettingsResponse.text();

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

When('User sends PUT request to update item sales velocity setting type {} with the total percentage is {}%', async function (velocityType: string, percentage: string) {
    const isNumber = !isNaN(parseFloat(percentage)) && isFinite(+percentage);

    this.randomWeightNumbers = []

    if (isNumber) {
        // The function returns the array of 8 numbers that add up to the desired sum (here is percentage of purchasing daily sales)
        this.randomWeightNumbers = keyword.generateRandomNumbers(Number(percentage), 8);

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
});

Then('{} checks API contract of get Item by Item key api', async function (actor: string) {
    itemInfoResponseSchema.parse(this.getItemByItemKeyResponseBody);
});
