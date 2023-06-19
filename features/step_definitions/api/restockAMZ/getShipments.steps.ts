import { Then, When, Given } from '@cucumber/cucumber';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import * as shipmentRequest from '../../../../src/api/request/shipment.service';
import * as itemRequest from '../../../../src/api/request/item.service';

let countAllShipmentsLink: any;
let getListShipmentsLink: any;
let countAllSKUsInShipmentDetailsLink: any;
let getListSKUsInShipmentDetailsLink: any;
let getSKUsInShipmentDetailsLink: any;

When(`User sets GET endpoint api to count all shipments`, async function () {
    countAllShipmentsLink = encodeURI(`${Links.API_SHIPMENT_COUNT}`);
});

When(`User sends GET endpoint api to count all shipments`, async function () {
    this.getAllShipmentsResponse = this.response = await shipmentRequest.getAllShipmentsInManageShipments(this.request, countAllShipmentsLink, this.headers);
    const responseBodyText = await this.getAllShipmentsResponse.text();
    if (this.getAllShipmentsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getAllShipmentsResponseBody = JSON.parse(await this.getAllShipmentsResponse.text());
        this.responseOfAItem = await this.getAllShipmentsResponseBody[Math.floor(Math.random() * this.getAllShipmentsResponseBody.length)];
        this.countItem = this.getAllShipmentsResponseBody;
        logger.log('info', `Response GET list items ${countAllShipmentsLink}: ` + JSON.stringify(this.getAllShipmentsResponseBody, undefined, 4));
        this.attach(`Response GET list items ${countAllShipmentsLink}: ` + JSON.stringify(this.getAllShipmentsResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response list items ${countAllShipmentsLink} has status code ${this.getAllShipmentsResponse.status()} ${this.getAllShipmentsResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response list items ${countAllShipmentsLink} has status code ${this.getAllShipmentsResponse.status()} ${this.countAllItemInItemListResponse.statusText()} and response body ${actualResponseText}`)
    }
});

// Get all shipments in Manage Shipments with filter, sort and search
When(`{} sends GET endpoint api with filter {} column, value {} {}, sort {} column {} and search {} value to count all shipments`, async function (actor, columnName: string, operator: string, value: string, columnNameSort: string, sort: string, searchValue: string) {
    this.getAllShipmentsWithFSSResponse = this.response = await shipmentRequest.getAllShipmentsInManageShipmentsWithFSS(this.request, countAllShipmentsLink, this.headers, columnName, operator, value, columnNameSort, sort, searchValue);
    const responseBodyText = await this.getAllShipmentsWithFSSResponse.text();
    if (this.getAllShipmentsWithFSSResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getAllShipmentsWithFSSResponseBody = JSON.parse(await this.getAllShipmentsWithFSSResponse.text());
        this.responseOfAItem = await this.getAllShipmentsWithFSSResponseBody[Math.floor(Math.random() * this.getAllShipmentsWithFSSResponseBody.length)];
        this.countItem = this.getAllShipmentsWithFSSResponseBody;
        logger.log('info', `Response GET list items ${countAllShipmentsLink}: ` + JSON.stringify(this.getAllShipmentsWithFSSResponseBody, undefined, 4));
        this.attach(`Response GET list items ${countAllShipmentsLink}: ` + JSON.stringify(this.getAllShipmentsWithFSSResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response list items ${countAllShipmentsLink} has status code ${this.getAllShipmentsWithFSSResponse.status()} ${this.getAllShipmentsWithFSSResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response list items ${countAllShipmentsLink} has status code ${this.getAllShipmentsWithFSSResponse.status()} ${this.countAllItemInItemListResponse.statusText()} and response body ${actualResponseText}`)
    }
});

When(`{} sets GET endpoint API to get list shipments with limit row: {}`, async function (actor, limitRow: number) {
    getListShipmentsLink = encodeURI(`${Links.API_SHIPMENT}`);
    this.limitRow = limitRow;
});

When(`{} sends GET endpoint API to get list shipments`, async function (actor) {
    this.getListShipmentWithLimitRowResponse = this.response = await shipmentRequest.getListShipmentsWithLimitRow(this.request, getListShipmentsLink, this.headers, this.limitRow);
    const responseBodyText = await this.getListShipmentWithLimitRowResponse.text();
    if (this.getListShipmentWithLimitRowResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getListShipmentWithLimitRowResponseBody = JSON.parse(await this.getListShipmentWithLimitRowResponse.text());
        this.responseOfAItem = await this.getListShipmentWithLimitRowResponseBody[Math.floor(Math.random() * this.getListShipmentWithLimitRowResponseBody.length)];
        this.listToPickRandom = this.getListShipmentWithLimitRowResponseBody;
        logger.log('info', `Response GET list shipment with limit row ${getListShipmentsLink}: ` + JSON.stringify(this.getListShipmentWithLimitRowResponseBody, undefined, 4));
        this.attach(`Response GET list shipment with limit row ${getListShipmentsLink}: ` + JSON.stringify(this.getListShipmentWithLimitRowResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response list shipment with limit row ${getListShipmentsLink} has status code ${this.getListShipmentWithLimitRowResponse.status()} ${this.getListShipmentWithLimitRowResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response list shipment with limit row ${getListShipmentsLink} has status code ${this.getListShipmentWithLimitRowResponse.status()} ${this.countAllItemInItemListResponse.statusText()} and response body ${actualResponseText}`)
    }
})

// Get all items in Manage Shipment with filter, sort and search
When(`{} sends GET endpoint API with filter {} column, value {} {}, sort {} column {} and search {} value to get list shipments`, async function (actor, columnName: string, operator: string, value: string, columnNameSort: string, sort: string, searchValue: string) {
    this.getListShipmentWithFSSResponse = this.response = await shipmentRequest.getListShipmentsWithFSS(this.request, getListShipmentsLink, this.headers, columnName, operator, value, columnNameSort, sort, searchValue);
    const responseBodyText = await this.getListShipmentWithFSSResponse.text();
    if (this.getListShipmentWithFSSResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getListShipmentWithFSSResponseBody = JSON.parse(await this.getListShipmentWithFSSResponse.text());
        this.responseOfAItem = await this.getListShipmentWithFSSResponseBody[Math.floor(Math.random() * this.getListShipmentWithFSSResponseBody.length)];
        this.listToPickRandom = this.getListShipmentWithFSSResponseBody;
        this.pickFirstAndEndRow = this.getListShipmentWithFSSResponseBody;
        logger.log('info', `Response GET list shipment with limit row ${getListShipmentsLink}: ` + JSON.stringify(this.getListShipmentWithFSSResponseBody, undefined, 4));
        this.attach(`Response GET list shipment with limit row ${getListShipmentsLink}: ` + JSON.stringify(this.getListShipmentWithFSSResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response list shipment with limit row ${getListShipmentsLink} has status code ${this.getListShipmentWithFSSResponse.status()} ${this.getListShipmentWithFSSResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response list shipment with limit row ${getListShipmentsLink} has status code ${this.getListShipmentWithFSSResponse.status()} ${this.countAllItemInItemListResponse.statusText()} and response body ${actualResponseText}`)
    }
})

// Get all items in Manage Shipment > Shipment Details with filter
When(`{} sends GET endpoint api in Shipment Details with filter {} column, value {} {} to get list SKUs`, async function (actor, columnName: string, operator: string, value: string) {
    this.pickRandomShipment = this.getListShipmentWithLimitRowResponseBody[Math.floor(Math.random()*this.getListShipmentWithLimitRowResponseBody.length)];
    console.log("pickRandomShipment >>>>> ", this.pickRandomShipment);
    this.getListSKUInShipmentDetailWithFilterResponse = await shipmentRequest.getSKUInShipmentDetailsWithFilter(this.request, getSKUsInShipmentDetailsLink, this.headers, columnName, operator, value, this.pickRandomShipment.key, this.pickRandomShipment.restockType);
    const responseBodyText = await this.getListSKUInShipmentDetailWithFilterResponse.text();
    if (this.getListSKUInShipmentDetailWithFilterResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getListSKUInShipmentDetailWithFilterResponseBody = JSON.parse(await this.getListSKUInShipmentDetailWithFilterResponse.text());
        console.log("getListSKUInShipmentDetailWithFilterResponse: ", this.getListSKUInShipmentDetailWithFilterResponseBody);
        this.responseOfAItem = await this.getListSKUInShipmentDetailWithFilterResponseBody[Math.floor(Math.random() * this.getListSKUInShipmentDetailWithFilterResponseBody.length)];
        this.searchValue = this.responseOfAItem.itemName;
        console.log("Pick random SKU to search: ", this.searchValue);
        // this.listToPickRandom = this.getListSKUInShipmentDetailWithFilterResponseBody;
        // this.pickFirstAndEndRow = this.getListSKUInShipmentDetailWithFilterResponseBody;
        logger.log('info', `Response GET list shipment with limit row ${getSKUsInShipmentDetailsLink}: ` + JSON.stringify(this.getListSKUInShipmentDetailWithFilterResponseBody, undefined, 4));
        this.attach(`Response GET list shipment with limit row ${getSKUsInShipmentDetailsLink}: ` + JSON.stringify(this.getListSKUInShipmentDetailWithFilterResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response list shipment with limit row ${getSKUsInShipmentDetailsLink} has status code ${this.getListSKUInShipmentDetailWithFilterResponse.status()} ${this.getListSKUInShipmentDetailWithFilterResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response list shipment with limit row ${getSKUsInShipmentDetailsLink} has status code ${this.getListSKUInShipmentDetailWithFilterResponse.status()} ${this.countAllItemInItemListResponse.statusText()} and response body ${actualResponseText}`)
    }
})

// Get all items in Manage Shipment > Shipment Details with filter, sort and search
When(`{} sends GET endpoint api with filter {} column, value {} {}, sort {} column {} and search {} value to get list SKUs in Shipment Details`, async function (actor, columnName: string, operator: string, value: string, columnNameSort: string, sort: string, searchValue: string) {
    this.attach(`Search Value in here >>>>>: ` + this.searchValue);
    this.getListSKUInShipmentDetailWithFSSResponse = this.response = await shipmentRequest.getSKUInShipmentDetailsWithFSS(this.request, getListShipmentsLink, this.headers, columnName, operator, value, columnNameSort, sort, this.searchValue, this.pickRandomShipment.key, this.pickRandomShipment.restockType);
    const responseBodyText = await this.getListSKUInShipmentDetailWithFSSResponse.text();
    if (this.getListSKUInShipmentDetailWithFSSResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getListSKUInShipmentDetailWithFSSResponseBody = JSON.parse(await this.getListSKUInShipmentDetailWithFSSResponse.text());
        this.responseOfAItem = await this.getListSKUInShipmentDetailWithFSSResponseBody[Math.floor(Math.random() * this.getListSKUInShipmentDetailWithFSSResponseBody.length)];
        this.listToPickRandom = this.getListSKUInShipmentDetailWithFSSResponseBody;
        this.pickFirstAndEndRow = this.getListSKUInShipmentDetailWithFSSResponseBody;
        logger.log('info', `Response GET list shipment with limit row ${getListShipmentsLink}: ` + JSON.stringify(this.getListSKUInShipmentDetailWithFSSResponseBody, undefined, 4));
        this.attach(`Response GET list shipment with limit row ${getListShipmentsLink}: ` + JSON.stringify(this.getListSKUInShipmentDetailWithFSSResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response list shipment with limit row ${getListShipmentsLink} has status code ${this.getListSKUInShipmentDetailWithFSSResponse.status()} ${this.getListSKUInShipmentDetailWithFSSResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response list shipment with limit row ${getListShipmentsLink} has status code ${this.getListSKUInShipmentDetailWithFSSResponse.status()} ${this.countAllItemInItemListResponse.statusText()} and response body ${actualResponseText}`)
    }
})

Then('{} picks {} random shipment in above list shipments', async function (actor: string, quantity) {
    console.log("Here: ", this.listToPickRandom);
    this.itemsPickedRandomArray =  itemRequest.getMultipleRandom(this.listToPickRandom, quantity);
    console.log("ItemInItemListPickedRandomArray: ", this.itemsPickedRandomArray);
    return this.itemsPickedRandomArray;
});

When(`User sets GET endpoint api to count all SKUs in Shipment Details`, async function () {
    countAllSKUsInShipmentDetailsLink = encodeURI(`${Links.API_SHIPMENT_DETAILS_COUNT}`);
});

When(`User sends GET endpoint api to count all SKUs in Shipment Details`, async function () {
    this.pickRandomShipment = this.getListShipmentWithLimitRowResponseBody[Math.floor(Math.random()*this.getListShipmentWithLimitRowResponseBody.length)];
    console.log("pickRandomShipment >>>>> ", this.pickRandomShipment);
    this.countAllSKUsInShipmentDetailsResponse = this.response = await shipmentRequest.countAllSKUsInShipmentDetails(this.request, countAllSKUsInShipmentDetailsLink, this.headers, this.pickRandomShipment.key, this.pickRandomShipment.restockType);
    const responseBodyText = await this.countAllSKUsInShipmentDetailsResponse.text();
    if (this.countAllSKUsInShipmentDetailsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.countAllSKUsInShipmentDetailsResponseBody = JSON.parse(await this.countAllSKUsInShipmentDetailsResponse.text());
        this.responseOfAItem = await this.countAllSKUsInShipmentDetailsResponseBody[Math.floor(Math.random() * this.countAllSKUsInShipmentDetailsResponseBody.length)];
        this.countItem = this.countAllSKUsInShipmentDetailsResponseBody;
        logger.log('info', `Response GET list items ${countAllSKUsInShipmentDetailsLink}: ` + JSON.stringify(this.countAllSKUsInShipmentDetailsResponseBody, undefined, 4));
        this.attach(`Response GET list items ${countAllSKUsInShipmentDetailsLink}: ` + JSON.stringify(this.countAllSKUsInShipmentDetailsResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response list items ${countAllSKUsInShipmentDetailsLink} has status code ${this.countAllSKUsInShipmentDetailsResponse.status()} ${this.countAllSKUsInShipmentDetailsResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response list items ${countAllSKUsInShipmentDetailsLink} has status code ${this.countAllSKUsInShipmentDetailsResponse.status()} ${this.countAllItemInItemListResponse.statusText()} and response body ${actualResponseText}`)
    }
});

// Get API endpoint with filter, sort and search to count all SKUs in Shipment Details
When(`{} sends GET endpoint api with filter {} column, value {} {}, sort {} column {} and search {} value to count all SKUs in Shipment Details`, async function (actor, columnName: string, operator: string, value: string, columnNameSort: string, sort: string, searchValue: string) {
    this.pickRandomShipment = this.getListShipmentWithLimitRowResponseBody[Math.floor(Math.random()*this.getListShipmentWithLimitRowResponseBody.length)];
    this.attach("pickRandomShipment >>>>> " + this.pickRandomShipment);
    this.countAllSKUsInShipmentDetailsWithFSSResponse = this.response = await shipmentRequest.countAllSKUsInShipmentDetailsWithFSS(this.request, countAllSKUsInShipmentDetailsLink, this.headers, this.pickRandomShipment.key, this.pickRandomShipment.restockType, columnName, operator, value, columnNameSort, sort, this.searchValue);
    const responseBodyText = await this.countAllSKUsInShipmentDetailsWithFSSResponse.text();
    if (this.countAllSKUsInShipmentDetailsWithFSSResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.countAllSKUsInShipmentDetailsWithFSSResponseBody = JSON.parse(await this.countAllSKUsInShipmentDetailsWithFSSResponse.text());
        this.responseOfAItem = await this.countAllSKUsInShipmentDetailsWithFSSResponseBody[Math.floor(Math.random() * this.countAllSKUsInShipmentDetailsWithFSSResponseBody.length)];
        this.countItem = this.countAllSKUsInShipmentDetailsWithFSSResponseBody;
        logger.log('info', `Response GET list items ${countAllSKUsInShipmentDetailsLink}: ` + JSON.stringify(this.countAllSKUsInShipmentDetailsWithFSSResponseBody, undefined, 4));
        this.attach(`Response GET list items ${countAllSKUsInShipmentDetailsLink}: ` + JSON.stringify(this.countAllSKUsInShipmentDetailsWithFSSResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response list items ${countAllSKUsInShipmentDetailsLink} has status code ${this.countAllSKUsInShipmentDetailsWithFSSResponse.status()} ${this.countAllSKUsInShipmentDetailsWithFSSResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response list items ${countAllSKUsInShipmentDetailsLink} has status code ${this.countAllSKUsInShipmentDetailsWithFSSResponse.status()} ${this.countAllItemInItemListResponse.statusText()} and response body ${actualResponseText}`)
    }
});

When(`User sets GET endpoint api to get list SKUs in Shipment Details`, async function () {
    getSKUsInShipmentDetailsLink = encodeURI(`${Links.API_SHIPMENT_DETAILS}`);
});

When(`User sends GET endpoint api to get list SKUs in Shipment Details`, async function () {
    // this.pickRandomShipment = this.getListShipmentWithLimitRowResponseBody[Math.floor(Math.random()*this.getListShipmentWithLimitRowResponseBody.length)];
    console.log("pickRandomShipment >>>>> ", this.pickRandomShipment);
    this.getSKUsInShipmentDetailsResponse = this.response = await shipmentRequest.getSKUsInShipmentDetails(this.request, getSKUsInShipmentDetailsLink, this.headers, this.pickRandomShipment.key, this.pickRandomShipment.restockType);
    const responseBodyText = await this.getSKUsInShipmentDetailsResponse.text();
    if (this.getSKUsInShipmentDetailsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getSKUsInShipmentDetailsResponseBody = JSON.parse(await this.getSKUsInShipmentDetailsResponse.text());
        this.responseOfAItem = await this.getSKUsInShipmentDetailsResponseBody[Math.floor(Math.random() * this.getSKUsInShipmentDetailsResponseBody.length)];
        logger.log('info', `Response GET list items ${getSKUsInShipmentDetailsLink}: ` + JSON.stringify(this.getSKUsInShipmentDetailsResponseBody, undefined, 4));
        this.attach(`Response GET list items ${getSKUsInShipmentDetailsLink}: ` + JSON.stringify(this.getSKUsInShipmentDetailsResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response list items ${getSKUsInShipmentDetailsLink} has status code ${this.getSKUsInShipmentDetailsResponse.status()} ${this.getSKUsInShipmentDetailsResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response list items ${getSKUsInShipmentDetailsLink} has status code ${this.getSKUsInShipmentDetailsResponse.status()} ${this.countAllItemInItemListResponse.statusText()} and response body ${actualResponseText}`)
    }
});

When(`{} sets GET endpoint API to get list SKUs in Shipment Details with limit row: {}`, async function (actor, limitRow: number) {
    getListSKUsInShipmentDetailsLink = encodeURI(`${Links.API_SHIPMENT}`);
    this.limitRow = limitRow;
});

When(`{} sends GET endpoint API to get list SKUs in Shipment Details`, async function (actor) {
    this.getListSKUsInShipmentDetailsResponse = this.response = await shipmentRequest.getListSKUsInShipmentDetails(this.request, getListSKUsInShipmentDetailsLink, this.headers, this.limitRow);
    const responseBodyText = await this.getListSKUsInShipmentDetailsResponse.text();
    if (this.getListSKUsInShipmentDetailsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getListSKUsInShipmentDetailsResponseBody = JSON.parse(await this.getListSKUsInShipmentDetailsResponse.text());
        this.responseOfAItem = await this.getListSKUsInShipmentDetailsResponseBody[Math.floor(Math.random() * this.getListSKUsInShipmentDetailsResponseBody.length)];
        logger.log('info', `Response GET list SKUs in Shipment Details with limit row ${getListSKUsInShipmentDetailsLink}: ` + JSON.stringify(this.getListSKUsInShipmentDetailsResponseBody, undefined, 4));
        this.attach(`Response GET list SKUs in Shipment Details with limit row ${getListSKUsInShipmentDetailsLink}: ` + JSON.stringify(this.getListSKUsInShipmentDetailsResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response list SKUs in Shipment Details with limit row ${getListSKUsInShipmentDetailsLink} has status code ${this.getListSKUsInShipmentDetailsResponse.status()} ${this.getListSKUsInShipmentDetailsResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response list SKUs in Shipment Details with limit row ${getListSKUsInShipmentDetailsLink} has status code ${this.getListSKUsInShipmentDetailsResponse.status()} ${this.countAllItemInItemListResponse.statusText()} and response body ${actualResponseText}`)
    }
})