import { DataTable, Then } from '@cucumber/cucumber';
import * as shipmentRequest from '../../../../src/api/request/shipment.service';
import * as s3Request from '../../../../src/api/request/s3.service';
import * as syncRequest from '../../../../src/api/request/sync.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";
import { getListShipmentsResponseSchema } from '../assertion/restockAMZ/shipmentAssertionSchema';
import { expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

Then('{} sets GET api to get shipments in Manage Shipments by status:', async function (actor: string, dataTable: DataTable) {
    const { shipmentStatus, limit } = dataTable.hashes()[0]
    this.linkGetShipmentsByStatus = `${Links.API_SHIPMENT}?offset=0&limit=${limit}&sort=[{"field":"restockType","direction":"desc"}]&where={"filters":[{"filters":[{"field":"status","operator":"eq","value":"${shipmentStatus}"}],"logic":"and"}],"logic":"and"}`;
});

Then(`{} send a GET request to get shipments in Manage Shipments`, async function (action: string) {
    const options = {
        headers: this.headers
    }
    this.getListShipmentsResponse = this.response = await shipmentRequest.getListShipments(this.request, this.linkGetShipmentsByStatus, options);
    const responseBodyText = await this.getListShipmentsResponse.text();
    if (this.getListShipmentsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getListShipmentsResponseBody = JSON.parse(await this.getListShipmentsResponse.text());
        logger.log('info', `Response GET ${this.linkGetShipmentsByStatus}: ` + JSON.stringify(this.getListShipmentsResponseBody, undefined, 4));
        this.attach(`Response GET ${this.linkGetShipmentsByStatus}: ` + JSON.stringify(this.getListShipmentsResponseBody, undefined, 4));
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${this.linkGetShipmentsByStatus} has status code ${this.getListShipmentsResponse.status()} ${this.getListShipmentsResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${this.linkGetShipmentsByStatus} has status code ${this.getListShipmentsResponse.status()} ${this.getListShipmentsResponse.statusText()} and response body ${actualResponseText}`);
    }
});

Then(`User picks a shipment in Manage Shipments`, async function () {
    this.aShipmentResponseBody = await this.getListShipmentsResponseBody[Math.floor(Math.random() * this.getListShipmentsResponseBody.length)];
    this.shipmentKey = this.aShipmentResponseBody.key;
    this.shipmentName = this.aShipmentResponseBody.shipmentName;
})

Then('User sets GET api to search item in shipment detail with following data:', async function (dataTable: DataTable) {
    const { restockType, searchText } = dataTable.hashes()[0];
    switch (searchText) {
        case 'nameOfAboveRandomItem':
            this.searchText = this.responseBodyOfAItemInShipmentObject.itemName
            break;
        default:
            break;
    }
    this.linkSearchItemInShipmentDetail = encodeURI(`${Links.API_SHIPMENT}-detail?offset=0&limit=20&where={"logic":"and","filters":[{"logic":"or","filters":[{"field":"itemName","operator":"contains","value":"${this.searchText}"},{"field":"supplierSku","operator":"contains","value":"${this.searchText}"},{"field":"asin","operator":"contains","value":"${this.searchText}"},{"field":"fnsku","operator":"contains","value":"${this.searchText}"},{"field":"description","operator":"contains","value":"${this.searchText}"}]}]}&key=${this.shipmentKey}&restockType=${restockType}`);
});

Then(`{} sends a GET request to get items in shipment detail by search function`, async function (actor) {
    const options = {
        headers: this.headers
    }
    this.getShipmentItemsResponse = this.response = await shipmentRequest.getShipmentInfo(this.request, this.linkSearchItemInShipmentDetail, options);
    const responseBodyText = await this.getShipmentItemsResponse.text();
    if (this.getShipmentItemsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getShipmentItemsResponseBody = JSON.parse(await this.getShipmentItemsResponse.text());
        logger.log('info', `Response GET ${this.linkSearchItemInShipmentDetail}: ` + JSON.stringify(this.getShipmentItemsResponseBody, undefined, 4));
        this.attach(`Response GET ${this.linkSearchItemInShipmentDetail}: ` + JSON.stringify(this.getShipmentItemsResponseBody, undefined, 4));

        this.shipmentItemKey = this.getShipmentItemsResponseBody[0].shipmentItemKey;
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${this.linkSearchItemInShipmentDetail} has status code ${this.getShipmentItemsResponse.status()} ${this.getShipmentItemsResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${this.linkSearchItemInShipmentDetail} has status code ${this.getShipmentItemsResponse.status()} ${this.getShipmentItemsResponse.statusText()} and response body ${actualResponseText}`);
    }
});

Then(`User checks the system display the correct item list in shipment detail by search function`, async function () {
    this.getShipmentItemsResponseBody.forEach((item: any) => {
        this.attach(`searchText:` + this.searchText)
        this.attach(`itemName:` + item.itemName)
        this.attach(`supplierSku:` + item.supplierSku)
        this.attach(`asin:` + item.asin)
        this.attach(`fnsku:` + item.fnsku)
        this.attach(`description:` + item.description)
        this.attach(`---------`)
        expect(item.itemName?.toLowerCase().includes(this.searchText.toLowerCase()) || item.supplierSku?.toLowerCase().includes(this.searchText.toLowerCase()) || item.asin?.toLowerCase().includes(this.searchText.toLowerCase()) || item.fnsku?.toLowerCase().includes(this.searchText.toLowerCase()) || item.description?.toLowerCase().includes(this.searchText.toLowerCase())).toBeTruthy()
    });
})

Then(`User prepares the {} list as following data:`, async function (section: string, dataTable: DataTable) {
    console.log(dataTable.rowsHash())
})

Then(`Get singed request`, async function () {
    this.fileName = 'supplier-template-test.csv'   
    this.linkGetSignedRequest = `https://preprod-my.forecastrx.com/api/file/auth/${this.companyKey}?fileName=${this.fileName}&os=mac`
    const options = {
        headers: this.headers
    }
    this.getSignedRequestResponse = this.response = await shipmentRequest.getShipmentInfo(this.request, this.linkGetSignedRequest, options);
    const responseBodyText = await this.getSignedRequestResponse.text();
    if (this.getSignedRequestResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getSignedRequestResponseBody = JSON.parse(await this.getSignedRequestResponse.text());
        logger.log('info', `Response GET ${this.linkGetSignedRequest}: ` + JSON.stringify(this.getSignedRequestResponseBody, undefined, 4));
        this.attach(`Response GET ${this.linkGetSignedRequest}: ` + JSON.stringify(this.getSignedRequestResponseBody, undefined, 4));
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${this.linkGetSignedRequest} has status code ${this.getSignedRequestResponse.status()} ${this.getSignedRequestResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${this.linkGetSignedRequest} has status code ${this.getSignedRequestResponse.status()} ${this.getSignedRequestResponse.statusText()} and response body ${actualResponseText}`);
    }
})

Then(`Upload to s3`, async function() {    
    const file = path.resolve("./src/data/", `${this.fileName}`)
    const csv_buffer = fs.readFileSync(file)
    const file_blob = new Blob([csv_buffer], {type: 'text/csv'})
    console.log(file_blob)

    this.uploadFileToS3 = this.response = await s3Request.uploadFileToS3(this.getSignedRequestResponseBody.signedRequest, this.companyKey, this.companyType, csv_buffer);
    console.log(this.response.status())
})

Then(`Sync file`, async function () {
    const link = `${Links.API_SYNC}/supplier`;
    const payload = {
        "fileName": `${this.fileName}`,
        "fileType": "supplier",
        "append": false,
        "zero": false,
        "userId": "",
        "isCreateNew": true,
        "isInitialUpload": false
    }
    this.runSyncResponse = this.response = await syncRequest.postSync(this.request, link, payload, this.headers);
    const responseBodyText = await this.runSyncResponse.text();
    if (this.runSyncResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        // this.runSyncResponseBody = JSON.parse(await this.runSyncResponse.text());
        logger.log('info', `Response POST ${link}` + JSON.stringify(this.runSyncResponse, undefined, 4));
        this.attach(`Response POST ${link} ` + JSON.stringify(this.runSyncResponse, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.runSyncResponse.status()} ${this.runSyncResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.runSyncResponse.status()} ${this.runSyncResponse.statusText()} and response body ${actualResponseText}`)
    }
    const sleep = (milliseconds: number) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    await sleep(6000);
})

