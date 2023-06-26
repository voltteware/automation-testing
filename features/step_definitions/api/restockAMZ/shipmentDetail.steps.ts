import { DataTable, Then } from '@cucumber/cucumber';
import * as shipmentRequest from '../../../../src/api/request/shipment.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import { expect } from '@playwright/test';

Then('{} sets GET api to get shipments in Manage Shipments by status:', async function (actor: string, dataTable: DataTable) {
    const { shipmentStatus, limit } = dataTable.hashes()[0]
    this.linkGetShipmentsByStatus = `${Links.API_SHIPMENT}?offset=0&limit=${limit}&sort=[{"field":"restockType","direction":"asc"}]&where={"filters":[{"filters":[{"field":"status","operator":"eq","value":"${shipmentStatus}"}],"logic":"and"}],"logic":"and"}`;
});

Then('{} sets GET api to get lasted shipments in Manage Shipments', async function (actor: string) {
    this.linkGetShipmentsByStatus = `${Links.API_SHIPMENT}?offset=0&limit=10&sort=[{"field":"updatedAt","direction":"desc"}]&where={"logic":"and","filters":[]}`;
});

Then('{} checks information in Shipment Details: {}', async function (actor, restockType: string) {
    const expectedTotalWeight = Number(this.packageWeightOfItem) * Number(this.requestedQty);
    const expectedTotalPrice = Number(this.vendorPriceOfItem) * Number(this.requestedQty);
    logger.log('info', `shipmentName: Actual ${this.actualShipmentName} vs Expected ${this.shipmentName}`);
    this.attach(`shipmentName: Actual ${this.actualShipmentName} vs Expected ${this.shipmentName}`);
    logger.log('info', `DestinationFulfillmentCenterId: Actual ${this.actualDestinationFulfillmentCenterId} vs Expected Amazon`);
    this.attach(`DestinationFulfillmentCenterId: Actual ${this.actualDestinationFulfillmentCenterId} vs Expected Amazon`);
    logger.log('info', `Status: Actual ${this.actualStatus} vs Expected Pending`);
    this.attach(`Status: Actual ${this.actualStatus} vs Expected Pending`);
    logger.log('info', `restockType: Actual ${this.actualRestockType} vs Expected ${restockType}`);
    this.attach(`restockType: Actual ${this.actualRestockType} vs Expected ${restockType}`);
    logger.log('info', `totalCost: Actual ${this.actualTotalCost} vs Expected ${expectedTotalPrice}`);
    this.attach(`totalCost: Actual ${this.actualTotalCost} vs Expected ${expectedTotalPrice}`);
    logger.log('info', `totalSKUs: Actual ${this.actualTotalSKUs} vs Expected 1`);
    this.attach(`totalSKUs: Actual ${this.actualTotalSKUs} vs Expected 1`);
    logger.log('info', `totalWeight: Actual ${this.actualTotalWeight} vs Expected ${expectedTotalWeight}`);
    this.attach(`totalWeight: Actual ${this.actualTotalWeight} vs Expected ${expectedTotalWeight}`);
    logger.log('info', `labelPreference: Actual ${this.actualLabelPrepPreference} vs Expected SELLER_LABEL`);
    this.attach(`labelPreference: Actual ${this.actualLabelPrepPreference} vs Expected SELLER_LABEL`);
    logger.log('info', `addressLine1: Actual ${this.actualAddressLine1} vs Expected ${this.addressLine1}`);
    this.attach(`addressLine1: Actual ${this.actualAddressLine1} vs Expected ${this.addressLine1}`);
    logger.log('info', `addressLine2: Actual ${this.actualAddressLine2} vs Expected ${this.addressLine2}`);
    this.attach(`addressLine2: Actual ${this.actualAddressLine2} vs Expected ${this.addressLine2}`);
    logger.log('info', `city: Actual ${this.actualCity} vs Expected ${this.city}`);
    this.attach(`city: Actual ${this.actualCity} vs Expected ${this.city}`);
    logger.log('info', `countryCode: Actual ${this.actualCountryCode} vs Expected ${this.countryCode}`);
    this.attach(`countryCode: Actual ${this.actualCountryCode} vs Expected ${this.countryCode}`);
    logger.log('info', `fullName: Actual ${this.actualFullName} vs Expected ${this.fullName}`);
    this.attach(`fullName: Actual ${this.actualFullName} vs Expected ${this.fullName}`);
    logger.log('info', `phoneNumber: Actual ${this.actualPhoneNumber} vs Expected ${this.phoneNumber}`);
    this.attach(`phoneNumber: Actual ${this.actualPhoneNumber} vs Expected ${this.phoneNumber}`);
    logger.log('info', `postalCode: Actual ${this.actualPostalCode} vs Expected ${this.postalCode}`);
    this.attach(`postalCode: Actual ${this.actualPostalCode} vs Expected ${this.postalCode}`);
    logger.log('info', `stateOrProvinceCode: Actual ${this.actualStateOrProvinceCode} vs Expected ${this.stateOrProvinceCode}`);
    this.attach(`stateOrProvinceCode: Actual ${this.actualStateOrProvinceCode} vs Expected ${this.stateOrProvinceCode}`);
    logger.log('info', `ShipmentSource: Actual ${this.actualShipmentSource} vs Expected ${this.expectedShipmentSource}`);
    this.attach(`ShipmentSource: Actual ${this.actualShipmentSource} vs Expected ${this.expectedShipmentSource}`);

    expect(this.actualShipmentName).toBe(this.shipmentName);
    expect(this.actualDestinationFulfillmentCenterId).toBe("Amazon");
    expect(this.actualStatus).toBe("PENDING");
    expect(this.actualRestockType).toBe(`${restockType}`);
    expect(Number(this.actualTotalCost)).toEqual(expectedTotalPrice);
    expect(Number(this.actualTotalSKUs)).toEqual(1);
    expect(Number(this.actualTotalWeight)).toEqual(expectedTotalWeight);
    expect(this.actualLabelPrepPreference).toBe("SELLER_LABEL");
    // Check ship from - ship to
    expect(this.actualAddressLine1).toBe(this.addressLine1);
    expect(this.actualAddressLine2).toBe(this.addressLine2);
    expect(this.actualCity).toBe(this.city);
    expect(this.actualCountryCode).toBe(this.countryCode);
    expect(this.actualFullName).toBe(this.fullName);
    expect(this.actualPhoneNumber).toBe(this.phoneNumber);
    expect(this.actualPostalCode).toBe(this.postalCode);
    expect(this.actualStateOrProvinceCode).toBe(this.stateOrProvinceCode);
    expect(this.actualShipmentSource).toBe(this.expectedShipmentSource);
});

Then(`{} sends a GET request to get shipments in Manage Shipments`, async function (action: string) {
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
    this.countItem = this.getListShipmentsResponseBody.length;
});

Then(`User picks a shipment in Manage Shipments`, async function () {
    this.aShipmentResponseBody = await this.getListShipmentsResponseBody[Math.floor(Math.random() * this.getListShipmentsResponseBody.length)];
    logger.log('info', `aShipmentResponseBody: ` + JSON.stringify(this.aShipmentResponseBody, undefined, 4));
    this.attach(`aShipmentResponseBody: ` + JSON.stringify(this.aShipmentResponseBody, undefined, 4));
    this.shipmentKey = this.aShipmentResponseBody.key;
    this.shipmentName = this.aShipmentResponseBody.shipmentName;
    this.status = this.aShipmentResponseBody.status;
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

