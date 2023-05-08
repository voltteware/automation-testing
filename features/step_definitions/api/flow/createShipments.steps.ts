import { Then } from '@cucumber/cucumber';
import * as shipmentRequest from '../../../../src/api/request/shipment.service';
import * as syncRequest from '../../../../src/api/request/sync.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";
import { expect } from '@playwright/test';
import { simpleShipmentResponseSchema, updateItemInfoWithLastStepResponseSchema, getListShipmentsResponseSchema } from '../assertion/restockAMZ/shipmentAssertionSchema';
import { itemInfoInShipmentResponseSchema } from '../assertion/dashboard/itemAssertionSchema';

let link: any;
let payload: any;
let linkCount: any;
let linkListShipments: any;
let itemKeyTmp: any;

Then('{} sets POST api endpoint to create Shipment', async function (actor: string) {
    // Hard item to make sure create shipments successfully
    link = `${Links.API_SHIPMENT}`
    itemKeyTmp = this.itemKey;
    this.payLoad = {
        shipmentName: `ITC_Shipment_Auto_${Number(faker.datatype.number({ 'min': 1, 'max': 1000 }))}${faker.company.name()}`,
        shipmentItem: {
            caseQty: 0,
            destinationFulfillmentCenterId: "",
            itemKey: itemKeyTmp,
            labelType: "",
            localQty: 0,
            orderQty: 0,
            receivedQty: 0,
            restockKey: "",
            shipmentId: "",
            shipmentQty: Number(faker.datatype.number({ 'min': 1, 'max': 5 })),
            stickerQty: 0,
            whoPreps: "",
        },
        supplierCost: 0,
    }

    logger.log('info', `Payload: ` + JSON.stringify(this.payLoad, undefined, 4));
    this.attach(`Payload: ` + JSON.stringify(this.payLoad, undefined, 4));
});

Then('{} sends a POST request to create Shipment', async function (actor: string) {
    // Send POST request
    this.response = await shipmentRequest.postShipment(this.request, link, this.payLoad, this.headers);
    if (this.response.status() == 200) {
        this.createShipmentResponseBody = JSON.parse(await this.response.text())
        logger.log('info', `Create Shipment Response ${link} has status code ${this.response.status()} ${this.response.statusText()} and createShipmentResponse body ${JSON.stringify(this.createShipmentResponseBody, undefined, 4)}`);
        this.attach(`Create Shipment Response ${link} has status code ${this.response.status()} ${this.response.statusText()} and createShipmentResponse body ${JSON.stringify(this.createShipmentResponseBody, undefined, 4)}`);

        this.shipmentKey = this.createShipmentResponseBody.key;
        this.shipmentName = this.createShipmentResponseBody.shipmentName;
        this.restockType = this.createShipmentResponseBody.restockType;
        this.requestedQty = this.createShipmentResponseBody.requestedQty;
    } else {
        logger.log('info', `Create Shipment Response ${link} has status code ${this.response.status()} ${this.response.statusText()}`);
        this.attach(`Create Shipment Response ${link} has status code ${this.response.status()} ${this.response.statusText()}`);
    }
});

Then(`{} sets GET api endpoint to get Shipment info`, async function (actor: string) {
    link = `${Links.API_SHIPMENT}/${this.shipmentKey}`;
});

Then(`{} sends a GET request to get Shipment info`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getShipmentInfoResponse = this.response = await shipmentRequest.getShipmentInfo(this.request, link, options);
    const responseBodyText = await this.getShipmentInfoResponse.text();
    if (this.getShipmentInfoResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getShipmentInfoResponseBody = JSON.parse(await this.getShipmentInfoResponse.text());
        logger.log('info', `Response GET ${link}: ` + JSON.stringify(this.getShipmentInfoResponseBody, undefined, 4));
        this.attach(`Response GET ${link}: ` + JSON.stringify(this.getShipmentInfoResponseBody, undefined, 4));
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.getShipmentInfoResponse.status()} ${this.getShipmentInfoResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.getShipmentInfoResponse.status()} ${this.getShipmentInfoResponse.statusText()} and response body ${actualResponseText}`);
    }
});

Then('{} sets GET api endpoint to get items in shipments by restockType: {}', async function (actor, restockType: string) {
    link = encodeURI(`${Links.API_SHIPMENT}-detail?offset=0&limit=20&where={"logic":"and","filters":[]}&key=${this.shipmentKey}&type=forecast-chosen&restockType=${restockType}`);
});

Then(`{} sends a GET request to get items in shipments by restockType: {}`, async function (actor, restockType: string) {
    const options = {
        headers: this.headers
    }
    this.getShipmentItemsResponse = this.response = await shipmentRequest.getShipmentInfo(this.request, link, options);
    const responseBodyText = await this.getShipmentItemsResponse.text();
    if (this.getShipmentItemsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getShipmentItemsResponseBody = JSON.parse(await this.getShipmentItemsResponse.text());
        logger.log('info', `Response GET ${link}: ` + JSON.stringify(this.getShipmentItemsResponseBody, undefined, 4));
        this.attach(`Response GET ${link}: ` + JSON.stringify(this.getShipmentItemsResponseBody, undefined, 4));

        this.shipmentItemKey = this.getShipmentItemsResponseBody[0].shipmentItemKey;
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.getShipmentItemsResponse.status()} ${this.getShipmentItemsResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.getShipmentItemsResponse.status()} ${this.getShipmentItemsResponse.statusText()} and response body ${actualResponseText}`);
    }
});

Then('{} sets PUT api endpoint to update shipment', async function (actor: string) {
    link = `${Links.API_SHIPMENT}/${this.shipmentKey}`;
});

Then(`{} sends a PUT request to update shipment with casePackOption: {}`, async function (actor, casePackOption: string) {
    if (casePackOption == 'No') {
        payload = {
            key: `${this.shipmentKey}`,
            shipmentName: `${this.shipmentName}`,
            stepProgress: {
                uploadInventory: true,
                isFromRestockSuggestion: true,
                inventorySelection: true,
                shipmentSummary: true,
                shipmentOptions: true,
                shipmentReview: true
            }
        }
        logger.log('info', `Payload: ` + JSON.stringify(payload, undefined, 4));
        this.attach(`Payload: ` + JSON.stringify(payload, undefined, 4));

        this.updateShipmentInfoResponse = this.response = await shipmentRequest.putShipment(this.request, link, payload, this.headers);
        const responseBodyText = await this.updateShipmentInfoResponse.text();
        if (this.updateShipmentInfoResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
            this.updateShipmentInfoResponseBody = JSON.parse(await this.updateShipmentInfoResponse.text());
            logger.log('info', `Response PUT ${link}: ` + JSON.stringify(this.updateShipmentInfoResponseBody, undefined, 4));
            this.attach(`Response PUT ${link}: ` + JSON.stringify(this.updateShipmentInfoResponseBody, undefined, 4));
        }
        else {
            const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
            logger.log('info', `Response ${link} has status code ${this.updateShipmentInfoResponse.status()} ${this.updateShipmentInfoResponse.statusText()} and response body ${responseBodyText}`);
            this.attach(`Response ${link} has status code ${this.updateShipmentInfoResponse.status()} ${this.updateShipmentInfoResponse.statusText()} and response body ${actualResponseText}`);
        }
    }
    else {
        payload = {
            companyType: `${this.companyKey}`,
            companyKey: `${this.companyType}`,
            key: `${this.shipmentKey}`,
            restockKey: null,
            shipmentName: `${this.shipmentName}`,
            destinationFulfillmentCenterId: "Amazon",
            status: "PENDING",
            whoPreps: "Amazon",
            isShipByCase: true,
            restockType: `${this.restockType}`,
            receivedQty: 0,
            totalCost: 0,
            requestedQty: 10,
            updatedAt: new Date(),
            selectedShipmentItemKeys: [],
            labelPrepPreference: "SELLER_LABEL",
            stepProgress: {
                uploadInventory: true,
                isFromRestockSuggestion: true,
                inventorySelection: true,
                shipmentSummary: true,
                shipmentCasePack: true,
                shipmentOptions: true,
            },
            updated_at: new Date(),
        }
        logger.log('info', `Payload: ` + JSON.stringify(payload, undefined, 4));
        this.attach(`Payload: ` + JSON.stringify(payload, undefined, 4));

        this.updateShipmentInfoResponse = this.response = await shipmentRequest.putShipment(this.request, link, payload, this.headers);
        const responseBodyText = await this.updateShipmentInfoResponse.text();
        if (this.updateShipmentInfoResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
            this.updateShipmentInfoResponseBody = JSON.parse(await this.updateShipmentInfoResponse.text());
            logger.log('info', `Response PUT ${link}: ` + JSON.stringify(this.updateShipmentInfoResponseBody, undefined, 4));
            this.attach(`Response PUT ${link}: ` + JSON.stringify(this.updateShipmentInfoResponseBody, undefined, 4));
        }
        else {
            const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
            logger.log('info', `Response ${link} has status code ${this.updateShipmentInfoResponse.status()} ${this.updateShipmentInfoResponse.statusText()} and response body ${responseBodyText}`);
            this.attach(`Response ${link} has status code ${this.updateShipmentInfoResponse.status()} ${this.updateShipmentInfoResponse.statusText()} and response body ${actualResponseText}`);
        }
    }
});

Then(`{} sends a GET request to check local qty error`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getCheckLocalQtyErrorResponse = this.response = await shipmentRequest.getCheckLocalQtyError(this.request, link, options);
    const responseBodyText = await this.getCheckLocalQtyErrorResponse.text();
    if (this.getCheckLocalQtyErrorResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getCheckLocalQtyErrorResponseBody = JSON.parse(await this.getCheckLocalQtyErrorResponse.text());
        logger.log('info', `Response GET ${link}: ` + JSON.stringify(this.getCheckLocalQtyErrorResponseBody, undefined, 4));
        this.attach(`Response GET ${link}: ` + JSON.stringify(this.getCheckLocalQtyErrorResponseBody, undefined, 4));
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.getCheckLocalQtyErrorResponse.status()} ${this.getCheckLocalQtyErrorResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.getCheckLocalQtyErrorResponse.status()} ${this.getCheckLocalQtyErrorResponse.statusText()} and response body ${actualResponseText}`);
    }
});

Then('{} sets GET api endpoint to check local qty error', async function (actor: string) {
    link = `${Links.API_SHIPMENT}/${this.shipmentKey}/check-local-qty-error`;
});

Then('{} sets POST api endpoint to create shipment plan', async function (actor: string) {
    link = `${Links.API_SHIPMENT}/create-shipment-plan`;
    logger.log('info', `Link: ` + link);
    this.attach(`Link: ` + link);
});

Then(`{} sends a POST request to create shipment plan`, async function (actor: string) {

    payload = {
        restockKey: `${this.shipmentKey}`,
        address: {
            companyType: `${this.companyType}`,
            companyKey: `${this.companyKey}`,
            key: `${this.addressKey}`,
            vendorKey: `${this.vendorKey}`,
            countryCode: `${this.countryCode}`,
            fullName: `${this.fullName}`,
            addressLine1: `${this.addressLine1}`,
            addressLine2: null,
            city: `${this.city}`,
            stateOrProvinceCode: `${this.stateOrProvinceCode}`,
            postalCode: `${this.postalCode}`,
            phoneNumber: null
        },
        labelPrepPreference: "SELLER_LABEL"
    }
    logger.log('info', `Payload: ` + JSON.stringify(payload, undefined, 4));
    this.attach(`Payload: ` + JSON.stringify(payload, undefined, 4));

    this.response = await shipmentRequest.postShipmentPlan(this.request, link, payload, this.headers);
    if (this.response.status() == 200) {
        // Response body of this API is empty so no need to log response body
        logger.log('info', `Create Shipment Plan Response ${link} has status code ${this.response.status()}`);
        this.attach(`Create Shipment Plan Response ${link} has status code ${this.response.status()} ${this.response.statusText()}`);
    } else {
        logger.log('info', `Create Shipment Plan Response ${link} has status code ${this.response.status()} ${this.response.statusText()}`);
        this.attach(`Create Shipment Plan Response ${link} has status code ${this.response.status()} ${this.response.statusText()}`);
    }
    const sleep = (milliseconds: number) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    await sleep(5000);
});

Then('{} picks a random item which does not has Auto in the name in Item list', async function (actor: string) {
    this.selectedItem = await this.restockSuggestionResponseBody.filter((item: any) => !item.forecastconstant.itemName.includes("AUTO") && !item.forecastconstant.itemName.includes("Auto"));
    this.responseOfAItem = await this.selectedItem[Math.floor(Math.random() * this.selectedItem.length)];
    this.itemKey = this.responseOfAItem.forecastconstant.itemKey;

    logger.log('info', `Random Item: ${JSON.stringify(this.responseOfAItem, undefined, 4)}`);
    this.attach(`Random Item: ${JSON.stringify(this.responseOfAItem, undefined, 4)}`);
});

Then('{} sets POST api endpoint to create shipment on Amazon', async function (actor: string) {
    link = `${Links.API_SHIPMENT}/create-shipment`;

    this.payLoad = {
        restockKey: `${this.shipmentKey}`
    }

    logger.log('info', `Payload: ` + JSON.stringify(this.payLoad, undefined, 4));
    this.attach(`Payload: ` + JSON.stringify(this.payLoad, undefined, 4));
});

Then('{} sends a POST request to create shipment on Amazon', async function (actor: string) {
    // Send POST request
    this.response = await shipmentRequest.postShipment(this.request, link, this.payLoad, this.headers);
    if (this.response.status() == 200) {
        logger.log('info', `Create Shipment on Amazon Response ${link} has status code ${this.response.status()}`);
        this.attach(`Create Shipment Response ${link} has status code ${this.response.status()} ${this.response.statusText()}`);
    } else {
        logger.log('info', `Create Shipment on Amazon Response ${link} has status code ${this.response.status()} ${this.response.statusText()}`);
        this.attach(`Create Shipment Response on Amazon ${link} has status code ${this.response.status()} ${this.response.statusText()}`);
    }
    const sleep = (milliseconds: number) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    await sleep(5000);
});

Then('{} sets POST api endpoint to complete shipment', async function (actor: string) {
    link = `${Links.API_SHIPMENT}/complete`;

    this.payLoad = {
        restockKey: `${this.shipmentKey}`
    }

    logger.log('info', `Payload: ` + JSON.stringify(this.payLoad, undefined, 4));
    this.attach(`Payload: ` + JSON.stringify(this.payLoad, undefined, 4));
});

Then('{} sends a POST request to complete shipment', async function (actor: string) {
    // Send POST request
    this.response = await shipmentRequest.completeShipment(this.request, link, this.payLoad, this.headers);
    if (this.response.status() == 200) {
        logger.log('info', `Complete Shipment Response ${link} has status code ${this.response.status()}`);
        this.attach(`Complete Shipment Response ${link} has status code ${this.response.status()} ${this.response.statusText()}`);
    } else {
        logger.log('info', `Complete Shipment on Amazon Response ${link} has status code ${this.response.status()} ${this.response.statusText()}`);
        this.attach(`Complete Shipment Response on Amazon ${link} has status code ${this.response.status()} ${this.response.statusText()}`);
    }
});

Then(`{} sets POST api endpoint to sync`, async function (actor: string) {
    link = `${Links.API_SYNC}/sync`;
});

Then('{} sends a POST request to sync', async function (actor: string) {
    this.runSyncResponse = this.response = await syncRequest.postSync(this.request, link, this.getCompanyInfoResponseBody, this.headers);
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
});

Then(`{} sets GET api endpoint to count items in Shipment Review`, async function (actor: string) {
    const sleep = (milliseconds: number) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    await sleep(5000);
    linkCount = `${Links.API_SHIPMENT}-detail/count?where=%7B%22logic%22:%22and%22,%22filters%22:%5B%5D%7D&key=${this.shipmentKey}&type=amazon&restockType=SUPPLIER`;
});

Then(`{} checks Items in Shipment Review`, async function (actor: string) {
    expect(this.getAmountItemsResponseBody, `The amount of items would be greater than 0`).toBeGreaterThan(0);
});

Then(`{} sends a GET request to count items in Shipment Review`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getAmountItemsResponse = this.response = await shipmentRequest.getShipmentDetail(this.request, linkCount, options);
    const responseBodyText = await this.getAmountItemsResponse.text();
    if (this.getAmountItemsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getAmountItemsResponseBody = JSON.parse(await this.getAmountItemsResponse.text());
        logger.log('info', `Response GET ${linkCount}: ` + JSON.stringify(this.getAmountItemsResponseBody, undefined, 4));
        this.attach(`Response GET ${linkCount}: ` + JSON.stringify(this.getAmountItemsResponseBody, undefined, 4));
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.getAmountItemsResponse.status()} ${this.getAmountItemsResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.getAmountItemsResponse.status()} ${this.getAmountItemsResponse.statusText()} and response body ${actualResponseText}`);
    }
});

Then(`{} sets PUT api endpoint to update shipment Item key`, async function (actor: string) {
    link = `${Links.API_SHIPMENT}-detail/${this.shipmentItemKey}`;
});

Then('{} sends a PUT request to update shipment Item key', async function (actor: string) {
    payload = {
        isShipByCase: true,
        itemKey: `${this.itemKey}`,
        itemName: `${this.itemName}`,
        caseQty: 2,
        shipmentItemKey: `${this.shipmentItemKey}`,
        shipmentQty: 10,
        restockKey: `${this.shipmentKey}`,
        vendorKey: `${this.vendorKey}`,
        vendorName: `${this.fullName}`,
        boxHeight: Number(faker.datatype.number({ 'min': 1, 'max': 5 })),
        boxLength: Number(faker.datatype.number({ 'min': 1, 'max': 5 })),
        boxWeight: Number(faker.datatype.number({ 'min': 1, 'max': 5 })),
        boxWidth: Number(faker.datatype.number({ 'min': 1, 'max': 5 })),
        whoPreps: "Amazon"
    }

    // Send PUT request
    this.updateShipmentItemKeyResponse = this.response = await shipmentRequest.putShipment(this.request, link, payload, this.headers);
    const responseBodyText = await this.updateShipmentItemKeyResponse.text();
    if (this.response.status() == 200) {
        this.updateShipmentItemKeyResponseBody = JSON.parse(await this.updateShipmentItemKeyResponse.text());
        logger.log('info', `Response PUT ${link}` + JSON.stringify(this.updateShipmentItemKeyResponseBody, undefined, 4));
        this.attach(`Response PUT ${link} ` + JSON.stringify(this.updateShipmentItemKeyResponseBody, undefined, 4))
    } else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.runSyncResponse.status()} ${this.runSyncResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.runSyncResponse.status()} ${this.runSyncResponse.statusText()} and response body ${actualResponseText}`)
    }
});

Then(`{} sets GET api endpoint to export file`, async function (actor: string) {
    link = `${Links.API_SHIPMENT}-detail/workflow-export?key=${this.shipmentKey}&type=forecast-chosen&restockType=SUPPLIER`;
});

Then('{} sends a GET request to export file', async function (actor: string) {
    this.response = await shipmentRequest.getWorkflowExport(this.request, link, this.headers);
    this.body = this.response.body();
    if (this.response.status() == 200) {
        logger.log('info', `Export File Response ${link} has status code ${this.response.status()} ${this.response.statusText()} and body`);
        this.attach(`Export File Response ${link} has status code ${this.response.status()} ${this.response.statusText()}`);

    } else {
        logger.log('info', `Export File Response ${link} has status code ${this.response.status()}`);
        this.attach(`Export File Response ${link} has status code ${this.response.status()}`);
    }
});

Then('{} sets GET api endpoint to find the new created shipment', async function (actor: string) {
    linkListShipments = encodeURI(`${Links.API_SHIPMENT}?offset=0&limit=100&sort=[{"field":"createdAt","direction":"desc"}]&where={"logic":"and","filters":[{"logic":"or","filters":[{"field":"shipmentName","operator":"contains","value":"${this.shipmentName}"},{"field":"shipmentSource","operator":"contains","value":"${this.shipmentName}"},{"field":"destinationFulfillmentCenterId","operator":"contains","value":"${this.shipmentName}"},{"field":"status","operator":"contains","value":"${this.shipmentName}"}]}]}`);
});

Then(`{} sends a GET request to find the new created shipment`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getListShipmentsResponse = this.response = await shipmentRequest.getListShipments(this.request, linkListShipments, options);
    const responseBodyText = await this.getListShipmentsResponse.text();
    if (this.getListShipmentsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getListShipmentsResponseBody = JSON.parse(await this.getListShipmentsResponse.text());
        logger.log('info', `Response GET ${linkListShipments}: ` + JSON.stringify(this.getListShipmentsResponseBody, undefined, 4));
        this.attach(`Response GET ${linkListShipments}: ` + JSON.stringify(this.getListShipmentsResponseBody, undefined, 4));
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${linkListShipments} has status code ${this.getListShipmentsResponse.status()} ${this.getListShipmentsResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${linkListShipments} has status code ${this.getListShipmentsResponse.status()} ${this.getListShipmentsResponse.statusText()} and response body ${actualResponseText}`);
    }
});

Then (`User picks a just created shipment`, async function () {
    expect(this.getListShipmentsResponseBody.length).toBeGreaterThan(0)
    const justCreatedShipment = this.getListShipmentsResponseBody[Math.floor(Math.random() * this.getListShipmentsResponseBody.length)];
    logger.log('info', `Just created shipment >>>>> ` + JSON.stringify(justCreatedShipment, undefined, 4));
    this.attach(`Just created shipment >>>>> ` + JSON.stringify(justCreatedShipment, undefined, 4));
    this.shipmentKey = justCreatedShipment.key
    this.shipmentName = justCreatedShipment.shipmentName
});

Then('{} checks the new created shipment: {}', async function (actor, shipmentStatus: string) {
    this.shipmentStatus = this.getListShipmentsResponseBody[0].status;
    this.name = this.getListShipmentsResponseBody[0].shipmentName;
    expect(this.shipmentStatus, `In response body, the expected shipmentStatus should be: ${shipmentStatus}`).toBe(shipmentStatus);
    expect(this.name.includes(this.shipmentName), `In response body, the expected shipmentName should be: ${this.shipmentName}`).toBeTruthy();
});

Then('{} checks API contract of create shipment api', async function (actor: string) {
    simpleShipmentResponseSchema.parse(this.createShipmentResponseBody);
});

Then('{} checks API contract of get Shipment info api', async function (actor: string) {
    simpleShipmentResponseSchema.parse(this.getShipmentInfoResponseBody);
});

Then(`{} picks random item to check api contract`, async function (actor: string) {
    this.responseBodyOfAItemInShipmentObject = await this.getShipmentItemsResponseBody[Math.floor(Math.random() * this.getShipmentItemsResponseBody.length)];
    logger.log('info', `Random Item: ${JSON.stringify(this.responseBodyOfAItemInShipmentObject, undefined, 4)}`);
    this.attach(`Random Item: ${JSON.stringify(this.responseBodyOfAItemInShipmentObject, undefined, 4)}`);
});

Then('{} checks API contract of get items in shipment', async function (actor: string) {
    itemInfoInShipmentResponseSchema.parse(this.responseBodyOfAItemInShipmentObject);
});

Then('{} checks API contract of update shipment by shipment key api', async function (actor: string) {
    updateItemInfoWithLastStepResponseSchema.parse(this.updateShipmentInfoResponseBody);
});

Then('{} checks API contract of get list shipments api', async function (actor: string) {
    getListShipmentsResponseSchema.parse(this.getListShipmentsResponseBody[0]);
});

Then('{} checks API contract of update item shipment key', async function (actor: string) {
    itemInfoInShipmentResponseSchema.parse(this.updateShipmentItemKeyResponseBody);
});