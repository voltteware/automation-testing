import * as authenticateRequest from '../../../../src/api/request/authentication.service';
import { DataTable, Then } from '@cucumber/cucumber';
import * as s3Request from '../../../../src/api/request/s3.service';
import * as syncRequest from '../../../../src/api/request/sync.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import path from 'path';
import fs from 'fs';
import * as fileHelper from "../../../../src/helpers/file-helper";
import { expect } from '@playwright/test';
import * as exportRequest from '../../../../src/api/request/export.service';
import { isSubset } from '../../../../src/helpers/array-helper';

let expectedValueName: any;
let actualValueName: any;

Then(`User prepares the {} file contains the list {} as following data:`, async function (fileName: string, section: string, dataTable: DataTable) {
    // Write data in table to csv file
    this.fileName = fileName;
    this.section = section;
    const result = fileHelper.convertDataTableToCSVFile(dataTable, section, this.fileName, this.supplierName, this.itemName, this.componentName);
    this.expectedData = result
    logger.log('info', `Content of file: ` + this.expectedData);
    this.attach(`Content of file: ` + this.expectedData);
})

Then(`User sets GET api to get signed request`, function () {
    this.linkGetSignedRequest = `${Links.API_FILE}/auth/${this.companyKey}?fileName=${this.fileName}&os=mac`
})

Then(`User sends a GET request to get signed request`, async function () {
    const options = {
        headers: this.headers
    }

    this.getSignedRequestResponse = this.response = await authenticateRequest.getSignedRequest(this.request, this.linkGetSignedRequest, options);
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

Then(`User sets PUT api to upload file {} to the Amazon S3`, async function (fileName: string) {
    this.linkUpFileToS3 = this.getSignedRequestResponseBody.signedRequest
    const file = path.resolve("./src/data/", `${fileName}`)
    const csv_buffer = fs.readFileSync(file)
    this.payloadUpFileToS3 = csv_buffer
})

Then(`User sends a PUT request to upload file to the Amazon S3`, async function () {
    this.uploadFileToS3Response = this.response = await s3Request.uploadFileToS3(this.linkUpFileToS3, this.companyKey, this.companyType, this.payloadUpFileToS3);
    expect(this.uploadFileToS3Response.status()).toBe(200)
})

Then(`User sets POST api to sync file {} from Amazon S3 with option isCreateNew: {}`, async function (fileName: string, isCreateNew: string) {
    var regexPattern = new RegExp("true");
    var boolValue = regexPattern.test(isCreateNew);

    this.linkSyncFile = `${Links.API_SYNC}/${this.section}`;
    this.payloadSyncFile = {
        "fileName": `${fileName}`,
        "fileType": `${this.section}`,
        "append": false,
        "zero": false,
        "userId": "",
        "isCreateNew": boolValue,
        "isInitialUpload": false
    }
    logger.log('info', `Response POST ${this.linkSyncFile} + payload: ` + JSON.stringify(this.payloadSyncFile, undefined, 4));
    this.attach(`Response POST ${this.linkSyncFile} + payload: ` + JSON.stringify(this.payloadSyncFile, undefined, 4))
})

Then(`User sends a POST request to sync file from Amazon S3`, async function () {
    this.runSyncResponse = this.response = await syncRequest.postSync(this.request, this.linkSyncFile, this.payloadSyncFile, this.headers);
    const responseBodyText = await this.runSyncResponse.text();
    if (this.runSyncResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        // this.runSyncResponseBody = JSON.parse(await this.runSyncResponse.text());
        logger.log('info', `Response POST ${this.linkSyncFile}` + JSON.stringify(this.runSyncResponse, undefined, 4));
        this.attach(`Response POST ${this.linkSyncFile} ` + JSON.stringify(this.runSyncResponse, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${this.linkSyncFile} has status code ${this.runSyncResponse.status()} ${this.runSyncResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${this.linkSyncFile} has status code ${this.runSyncResponse.status()} ${this.runSyncResponse.statusText()} and response body ${actualResponseText}`)
    }
    const sleep = (milliseconds: number) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    await sleep(6000);
})

Then(`{} checks items in the {} must be the same as in csv file`, async function (actor, section: string) {
    // Convert csv file to json data
    const data = await exportRequest.totalItemFromExportFile(`./src/data/${this.fileName}`);

    logger.log('info', `Data: ` + JSON.stringify(data, undefined, 4));
    this.attach(`Data: ` + JSON.stringify(data, undefined, 4));
    switch (section) {
        case "bom":
            expectedValueName = data.map((bom: any) => bom['Component Name'])
            logger.log('info', `expectedValueName: ` + JSON.stringify(expectedValueName, undefined, 4));
            this.attach(`expectedValueName: ` + JSON.stringify(expectedValueName, undefined, 4));

            actualValueName = this.getBomResponseBody.map((bom: any) => bom.childName)
            logger.log('info', `actualValueName: ` + JSON.stringify(actualValueName, undefined, 4));
            this.attach(`actualValueName: ` + JSON.stringify(actualValueName, undefined, 4));

            let expectedKitQty = data.map((bom: any) => bom['Kit Qty']).map(i => Number(i));
            logger.log('info', `expectedKitQty: ` + JSON.stringify(expectedKitQty, undefined, 4));
            this.attach(`expectedKitQty: ` + JSON.stringify(expectedKitQty, undefined, 4));

            let actualKitQty = this.getBomResponseBody.map((bom: any) => bom.qty)
            logger.log('info', `actualKitQty: ` + JSON.stringify(actualKitQty, undefined, 4));
            this.attach(`actualKitQty: ` + JSON.stringify(actualKitQty, undefined, 4));

            let booleanKitQty = isSubset(actualKitQty, expectedKitQty);
            expect(booleanKitQty).toBe(true);

            break;
        case "shipment":
            expectedValueName = data.map((item: any) => item.SKU)
            logger.log('info', `expectedValueName: ` + JSON.stringify(expectedValueName, undefined, 4));
            this.attach(`expectedValueName: ` + JSON.stringify(expectedValueName, undefined, 4));

            actualValueName = this.getShipmentItemsResponseBody.map((item: any) => item.itemName)
            logger.log('info', `actualValueName: ` + JSON.stringify(actualValueName, undefined, 4));
            this.attach(`actualValueName: ` + JSON.stringify(actualValueName, undefined, 4));

            break;
        case "supplier":
            expectedValueName = data.map((supplier: any) => supplier['Supplier Name'])
            logger.log('info', `expectedValueName: ` + JSON.stringify(expectedValueName, undefined, 4));
            this.attach(`expectedValueName: ` + JSON.stringify(expectedValueName, undefined, 4));

            let expectedLeadTime = data.map((supplier: any) => supplier['Lead Time']).map(i => Number(i));
            logger.log('info', `expectedLeadTime: ` + JSON.stringify(expectedLeadTime, undefined, 4));
            this.attach(`expectedLeadTime: ` + JSON.stringify(expectedLeadTime, undefined, 4));

            let expectedOrderInterval = data.map((supplier: any) => supplier['Order Interval']).map(i => Number(i));
            logger.log('info', `expectedOrderInterval: ` + JSON.stringify(expectedOrderInterval, undefined, 4));
            this.attach(`expectedOrderInterval: ` + JSON.stringify(expectedOrderInterval, undefined, 4));

            actualValueName = this.responseBodyOfASupplierObject.map((supplier: any) => supplier.name)
            logger.log('info', `actualValueName: ` + JSON.stringify(actualValueName, undefined, 4));
            this.attach(`actualValueName: ` + JSON.stringify(actualValueName, undefined, 4));

            let actualLeadTime = this.responseBodyOfASupplierObject.map((supplier: any) => supplier.leadTime)
            logger.log('info', `actualLeadTime: ` + JSON.stringify(actualLeadTime, undefined, 4));
            this.attach(`actualLeadTime: ` + JSON.stringify(actualLeadTime, undefined, 4));

            let actualOrderInterval = this.responseBodyOfASupplierObject.map((supplier: any) => supplier.orderInterval)
            logger.log('info', `actualOrderInterval: ` + JSON.stringify(actualOrderInterval, undefined, 4));
            this.attach(`actualOrderInterval: ` + JSON.stringify(actualOrderInterval, undefined, 4));

            let booleanOrderInterval = isSubset(actualOrderInterval, expectedOrderInterval);
            expect(booleanOrderInterval).toBe(true);

            let booleanLeadTime = isSubset(actualLeadTime, expectedLeadTime);
            expect(booleanLeadTime).toBe(true);

            break;
        case "item":
            expectedValueName = data.map((item: any) => item['Item Name'])
            logger.log('info', `expectedValueName: ` + JSON.stringify(expectedValueName, undefined, 4));
            this.attach(`expectedValueName: ` + JSON.stringify(expectedValueName, undefined, 4));

            actualValueName = this.getItemsResponseBody.map((item: any) => item.name)
            logger.log('info', `actualValueName: ` + JSON.stringify(actualValueName, undefined, 4));
            this.attach(`actualValueName: ` + JSON.stringify(actualValueName, undefined, 4));

            let expectedSupplierPrice = data.map((item: any) => item['Supplier Price']).map(i => Number(i));
            logger.log('info', `expectedSupplierPrice: ` + JSON.stringify(expectedSupplierPrice, undefined, 4));
            this.attach(`expectedSupplierPrice: ` + JSON.stringify(expectedSupplierPrice, undefined, 4));

            let actualSupplierPrice = this.getItemsResponseBody.map((item: any) => item.vendorPrice)
            logger.log('info', `actualSupplierPrice: ` + JSON.stringify(actualSupplierPrice, undefined, 4));
            this.attach(`actualSupplierPrice: ` + JSON.stringify(actualSupplierPrice, undefined, 4));

            let booleanSupplierPrice = isSubset(actualSupplierPrice, expectedSupplierPrice);
            expect(booleanSupplierPrice).toBe(true);

            let expectedMOQ = data.map((item: any) => item['MOQ']).map(i => Number(i));
            logger.log('info', `expectedMOQ: ` + JSON.stringify(expectedMOQ, undefined, 4));
            this.attach(`expectedMOQ: ` + JSON.stringify(expectedMOQ, undefined, 4));

            let actualMOQ = this.getItemsResponseBody.map((item: any) => item.moq)
            logger.log('info', `actualMOQ: ` + JSON.stringify(actualMOQ, undefined, 4));
            this.attach(`actualMOQ: ` + JSON.stringify(actualMOQ, undefined, 4));

            let booleanMOQ = isSubset(actualMOQ, expectedMOQ);
            expect(booleanMOQ).toBe(true);

            let expectedServiceLevel = data.map((item: any) => item['Service Level']).map(i => Number(i));
            logger.log('info', `expectedServiceLevel: ` + JSON.stringify(expectedServiceLevel, undefined, 4));
            this.attach(`expectedServiceLevel: ` + JSON.stringify(expectedServiceLevel, undefined, 4));

            let actualServiceLevel = this.getItemsResponseBody.map((item: any) => item.serviceLevel)
            logger.log('info', `actualServiceLevel: ` + JSON.stringify(actualServiceLevel, undefined, 4));
            this.attach(`actualServiceLevel: ` + JSON.stringify(actualServiceLevel, undefined, 4));

            let booleanServiceLevel = isSubset(actualServiceLevel, expectedServiceLevel);
            expect(booleanServiceLevel).toBe(true);

            break;
        case "demand":
            expectedValueName = data.map((item: any) => item['Item Name'])
            logger.log('info', `expectedValueName: ` + JSON.stringify(expectedValueName, undefined, 4));
            this.attach(`expectedValueName: ` + JSON.stringify(expectedValueName, undefined, 4));

            actualValueName = this.getDemandResponseBody.map((demand: any) => demand.itemName)
            logger.log('info', `actualValueName: ` + JSON.stringify(actualValueName, undefined, 4));
            this.attach(`actualValueName: ` + JSON.stringify(actualValueName, undefined, 4));

            let expectedOrderQty = data.map((demand: any) => demand['Sales Order Qty']).map(i => Number(i));
            logger.log('info', `expectedOrderQty: ` + JSON.stringify(expectedOrderQty, undefined, 4));
            this.attach(`expectedOrderQty: ` + JSON.stringify(expectedOrderQty, undefined, 4));

            let actualOrderQty = this.getDemandResponseBody.map((item: any) => item.orderQty)
            logger.log('info', `actualOrderQty: ` + JSON.stringify(actualOrderQty, undefined, 4));
            this.attach(`actualOrderQty: ` + JSON.stringify(actualOrderQty, undefined, 4));

            let booleanOrderQty = isSubset(actualOrderQty, expectedOrderQty);
            expect(booleanOrderQty).toBe(true);

            let expectedOpenQty = data.map((demand: any) => demand['Open Sales Order Qty']).map(i => Number(i));
            logger.log('info', `expectedOpenQty: ` + JSON.stringify(expectedOpenQty, undefined, 4));
            this.attach(`expectedOpenQty: ` + JSON.stringify(expectedOpenQty, undefined, 4));

            let actualOpenQty = this.getDemandResponseBody.map((item: any) => item.openQty)
            logger.log('info', `actualOpenQty: ` + JSON.stringify(actualOpenQty, undefined, 4));
            this.attach(`actualOpenQty: ` + JSON.stringify(actualOpenQty, undefined, 4));

            let booleanOpenQty = isSubset(actualOpenQty, expectedOpenQty);
            expect(booleanOpenQty).toBe(true);

            break;
        case "supply":
            expectedValueName = data.map((item: any) => item['Item Name'])
            logger.log('info', `expectedValueName: ` + JSON.stringify(expectedValueName, undefined, 4));
            this.attach(`expectedValueName: ` + JSON.stringify(expectedValueName, undefined, 4));

            actualValueName = this.getSupplyResponseBody.map((supply: any) => supply.itemName)
            logger.log('info', `actualValueName: ` + JSON.stringify(actualValueName, undefined, 4));
            this.attach(`actualValueName: ` + JSON.stringify(actualValueName, undefined, 4));

            let expectedOrderQtySupply = data.map((supply: any) => supply['Order Qty']).map(i => Number(i));
            logger.log('info', `expectedOrderQtySupply: ` + JSON.stringify(expectedOrderQtySupply, undefined, 4));
            this.attach(`expectedOrderQtySupply: ` + JSON.stringify(expectedOrderQtySupply, undefined, 4));

            let actualOrderQtySupply = this.getSupplyResponseBody.map((item: any) => item.orderQty)
            logger.log('info', `actualOrderQtySupply: ` + JSON.stringify(actualOrderQtySupply, undefined, 4));
            this.attach(`actualOrderQtySupply: ` + JSON.stringify(actualOrderQtySupply, undefined, 4));

            let booleanOrderQtySupply = isSubset(actualOrderQtySupply, expectedOrderQtySupply);
            expect(booleanOrderQtySupply).toBe(true);

            let expectedOpenQtySupply = data.map((supply: any) => supply['Open Qty']).map(i => Number(i));
            logger.log('info', `expectedOpenQtySupply: ` + JSON.stringify(expectedOpenQtySupply, undefined, 4));
            this.attach(`expectedOpenQtySupply: ` + JSON.stringify(expectedOpenQtySupply, undefined, 4));

            let actualOpenQtySupply = this.getSupplyResponseBody.map((item: any) => item.openQty)
            logger.log('info', `actualOpenQtySupply: ` + JSON.stringify(actualOpenQtySupply, undefined, 4));
            this.attach(`actualOpenQtySupply: ` + JSON.stringify(actualOpenQtySupply, undefined, 4));

            let booleanOpenQtySupply = isSubset(actualOpenQtySupply, expectedOpenQtySupply);
            expect(booleanOpenQtySupply).toBe(true);

            break;
        default:
            break;
    }
    let actual = isSubset(actualValueName, expectedValueName);
    expect(actual).toBe(true);
})