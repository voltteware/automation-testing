import { DataTable, Given } from '@cucumber/cucumber';
import * as shipmentRequest from '../../../../src/api/request/shipment.service';
import { Links } from "../../../../src/utils/links";
import { expect } from "@playwright/test";
import { delay } from 'lodash';

let link: any;
let shipmentName: string;
let fileName: string;
let shipmentKey: string;

Given('User chooses the company with the name {string}', async function (companyName: string) {
    // Select company by name
    this.selectedCompany = await this.getRealmResponseBody.find((co: any) => co.companyName == companyName)

    // Save the company key
    this.companyKey = this.selectedCompany.companyKey
    console.log('Company key: ' + this.companyKey)

    // Save the company type
    this.companyType = this.selectedCompany.companyType
    console.log('Company type: ' + this.companyType)
});

Given('User sets POST api endpoint to upload inventory', function () {
    link = Links.API_SHIPMENT_UPLOAD_INVENTORY
});

Given('User enters shipment order name: {string}', function (shipmentOrderNam: string) {
    const timeSendRequest = Date.now();
    if (shipmentOrderNam == 'random') {
        shipmentName = `ITC_Shipment_Auto_${timeSendRequest}`
    }

    console.log(shipmentName)
});

Given('User prepares inventory csv file', function () {
    fileName = 'upload-shipment.csv';
});

Given('User sends a POST request to upload inventory', async function () {
    this.uploadInvetoryResponse = await shipmentRequest.uploadInventory(this.request, link, shipmentName, fileName, this.cookie, this.companyKey, this.companyType)

    // Verify call API successfully
    expect(this.uploadInvetoryResponse.status()).toBe(200);

    this.uploadInventoryResponseBody = JSON.parse(await this.uploadInvetoryResponse.text());
    console.log(this.uploadInventoryResponseBody)
});

Given('User saves the shipment key', function () {
    shipmentKey = this.uploadInventoryResponseBody.key
    console.log(shipmentKey)
});

Given('User sets PUT api endpoint to update shipment', function () {
    link = `${Links.API_SHIPMENT_UPDATE_SHIPMENT}/${shipmentKey}`
});

Given('User sends a PUT request to update shipment', async function () {
    this.updateShipmentResponse = await shipmentRequest.updateShipment(this.request, link, shipmentName, shipmentKey, this.cookie, this.companyKey, this.companyType)

    // Verify call API successfully
    expect(this.updateShipmentResponse.status()).toBe(200);

    this.updateShipmentResponseBody = JSON.parse(await this.updateShipmentResponse.text());
    console.log(this.updateShipmentResponseBody)
});

Given('User sets GET api endpoint to get shipment detail', function () {
    link = Links.API_SHIPMENT_GET_DETAIL
});

Given('User sends a GET request to get shipment detail', async function () {
    this.getShipmentDetailResponse = await shipmentRequest.getShipmentDetail(this.request, link, shipmentKey, this.cookie, this.companyKey, this.companyType)

    // Verify call API successfully
    expect(this.getShipmentDetailResponse.status()).toBe(200);

    this.getShipmentDetailResponseBody = JSON.parse(await this.getShipmentDetailResponse.text());
    console.log(this.getShipmentDetailResponseBody)
});