import { DataTable, Then } from '@cucumber/cucumber';
import * as shipmentRequest from '../../../../src/api/request/shipment.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";
import { getListShipmentsResponseSchema } from '../assertion/restockAMZ/shipmentAssertionSchema';
import { expect } from '@playwright/test';

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
    const {restockType, searchText} = dataTable.hashes()[0];
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
