import { DataTable, Then } from '@cucumber/cucumber';
import * as shipmentRequest from '../../../../src/api/request/shipment.service';
import * as syncRequest from '../../../../src/api/request/sync.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";
import { expect } from '@playwright/test';
import { simpleShipmentResponseSchema, updateItemInfoWithLastStepResponseSchema, getListShipmentsResponseSchema, addSKUsResponseSchema } from '../assertion/restockAMZ/shipmentAssertionSchema';
import { itemInfoInShipmentResponseSchema } from '../assertion/dashboard/itemAssertionSchema';

let link: any;
let payload: any;
let linkCount: any;
let linkListShipments: any;
let itemKeyTmp: any;

Then('{} sets POST api endpoint to create Shipment', async function (actor: string) {
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
        vendorKey: `${this.supplierKey}`
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

Then(`{} sends a GET request to get specific item and expedite recommendation in Item list`, async function (actor: string) {
    link = `${Links.API_GET_RESTOCK_SUGGESTION}?offset=0&limit=100&where={"logic":"and","filters":[{"logic":"or","filters":[{"filters":[],"logic":"or"},{"filters":[],"logic":"or"}],"currentSupplierFilters":[{"text":"[All Suppliers]","value":"[All Suppliers]"}]},{"logic":"or","filters":[{"field":"sku","operator":"contains","value":"${this.itemName}"},{"field":"productName","operator":"contains","value":"${this.itemName}"},{"field":"category","operator":"contains","value":"${this.itemName}"},{"field":"supplier","operator":"contains","value":"${this.itemName}"},{"field":"supplierSku","operator":"contains","value":"${this.itemName}"},{"field":"asin","operator":"contains","value":"${this.itemName}"}]},{"logic":"and","filters":[]},{"filters":[{"field":"expeditedRecommendationQty","operator":"gt","value":0}],"logic":"and"}]}`
    const options = {
        headers: this.headers
    }
    this.getExpediteResponse = this.response = await shipmentRequest.getShipmentInfo(this.request, link, options);
    const responseBodyText = await this.getExpediteResponse.text();
    if (this.getExpediteResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getExpediteResponseBody = JSON.parse(await this.getExpediteResponse.text());
        logger.log('info', `Response GET ${link}: ` + JSON.stringify(this.getExpediteResponseBody, undefined, 4));
        this.attach(`Response GET ${link}: ` + JSON.stringify(this.getExpediteResponseBody, undefined, 4));
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.getExpediteResponse.status()} ${this.getExpediteResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.getExpediteResponse.status()} ${this.getExpediteResponse.statusText()} and response body ${actualResponseText}`);
    }
});

Then(`{} checks expedite recommendations`, async function (actor: string) {
    this.averageDailySaleRate = this.getExpediteResponseBody[0].demand;
    this.onHand = this.getExpediteResponseBody[0].forecastconstant.onHand;
    this.inboundFcTransfer = this.getExpediteResponseBody[0].inboundFcTransfer;
    this.dayLeftInStock = Math.round((Number(this.inboundFcTransfer) + Number(this.onHand)) / Number(this.averageDailySaleRate));
    this.actualExpeditedRecommendationQty = this.getExpediteResponseBody[0].expeditedRecommendationQty;
    this.expectedExpeditedRecommendationQty = (this.receiveDate.getTime() - (new Date((new Date()).getTime() + (this.dayLeftInStock * 86400000))).getTime()) * this.averageDailySalesRate;
    logger.log('info', `this.expectedExpeditedRecommendationQty: ` + this.expectedExpeditedRecommendationQty);
    this.attach(`this.expectedExpeditedRecommendationQty: ` + this.expectedExpeditedRecommendationQty);
});

Then('{} sets GET api endpoint to get items in shipments by restockType: {}', async function (actor, restockType: string) {
    link = encodeURI(`${Links.API_SHIPMENT}-detail?offset=0&limit=20&where={"logic":"and","filters":[]}&key=${this.shipmentKey}&restockType=${restockType}`);
    const sleep = (milliseconds: number) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    await sleep(5000);
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
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.getShipmentItemsResponse.status()} ${this.getShipmentItemsResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.getShipmentItemsResponse.status()} ${this.getShipmentItemsResponse.statusText()} and response body ${actualResponseText}`);
    }

    this.shipmentItemKey = this.getShipmentItemsResponseBody[0]?.shipmentItemKey;
    this.itemName = this.getShipmentItemsResponseBody[0]?.itemName;
    this.itemKey = this.getShipmentItemsResponseBody[0]?.itemKey;
});

Then('{} sets PUT api endpoint to update shipment', async function (actor: string) {
    link = `${Links.API_SHIPMENT}/${this.shipmentKey}`;
});

Then(`{} sends a PUT request to update shipment with casePackOption: {}`, async function (actor, casePackOption: string) {
    if (casePackOption == 'No') {
        payload = {
            key: `${this.shipmentKey}`,
            shipmentName: `${this.shipmentName}`,
            labelPrepPreference: 'SELLER_LABEL',
            stepProgress: {
                uploadInventory: true,
                isFromRestockSuggestion: true,
                inventorySelection: true,
                shipmentSummary: true,
                shipmentOptions: true,
                shipmentReview: true
            }
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
    this.expectedShipmentSource = this.updateShipmentInfoResponseBody?.shipmentSource;
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
            addressLine2: `${this.addressLine2}`,
            city: `${this.city}`,
            stateOrProvinceCode: `${this.stateOrProvinceCode}`,
            postalCode: `${this.postalCode}`,
            phoneNumber: `${this.phoneNumber}`
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
    const sleep = (milliseconds: number) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    await sleep(5000);
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
    await sleep(8000);
});

Then(`{} sets GET api endpoint to count items in Shipment Review with restockType: {}`, async function (actor, restockType: string) {
    const sleep = (milliseconds: number) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    await sleep(5000);
    linkCount = `${Links.API_SHIPMENT}-detail/count?where=%7B%22logic%22:%22and%22,%22filters%22:%5B%5D%7D&key=${this.shipmentKey}&type=amazon&restockType=${restockType}`;
});

Then(`{} checks and waits for Items can be updated in Shipment Review by restockType: {}`, async function (actor, restockType: string) {
    if (this.getAmountItemsResponseBody == 0) {
        const linkCount = `${Links.API_SHIPMENT}-detail/count?where=%7B%22logic%22:%22and%22,%22filters%22:%5B%5D%7D&key=${this.shipmentKey}&type=amazon&restockType=${restockType}`;
        const options = {
            headers: this.headers
        }

        // Check complete until count > 0
        await expect.poll(async () => {
            const getAmountItemsResponse = await shipmentRequest.getShipmentDetail(this.request, linkCount, options);
            const getAmountItemsResponseBody = JSON.parse(await getAmountItemsResponse.text());
            console.log(`getAmountItemsResponseBody is: >>>>>> `, getAmountItemsResponseBody);
            logger.log('info', `getAmountItemsResponseBody is: >>>>>> ` + getAmountItemsResponseBody);
            this.attach(`getAmountItemsResponseBody is: >>>>>> ` + getAmountItemsResponseBody);
            return getAmountItemsResponseBody;
        }, {
            // Custom error message, optional.
            message: `make sure count > 0 to pass this step`, // custom error message
            // Probe, wait 1s, probe, wait 5s, probe, wait 10s, probe, wait 10s, probe, .... Defaults to [100, 250, 500, 1000].
            intervals: [1_000, 2_000, 5_000],
            timeout: 8 * 60 * 1000,
        }).toBeGreaterThan(0);
    }
    else {
        expect(this.getAmountItemsResponseBody, `The amount of items would be greater than 0`).toBeGreaterThan(0);
    }
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

Then('{} sends a PUT request to update shipment Item key casePackOption: {}', async function (actor, casePackOption: string) {
    if (casePackOption == 'Yes') {
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
    }
    else {
        payload = {
            shipmentQty: 2,
            restockKey: `${this.shipmentKey}`,
            itemKey: `${this.itemKey}`,
            itemName: `${this.itemName}`,
        }
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
    linkListShipments = encodeURI(`${Links.API_SHIPMENT}?offset=0&limit=20&sort=[{"field":"updatedAt","direction":"desc"}]&where={"logic":"and","filters":[{"logic":"or","filters":[{"field":"shipmentName","operator":"contains","value":"${this.shipmentName}"},{"field":"shipmentSource","operator":"contains","value":"${this.shipmentName}"},{"field":"destinationFulfillmentCenterId","operator":"contains","value":"${this.shipmentName}"},{"field":"status","operator":"contains","value":"${this.shipmentName}"}]}]}`);
});

Then('{} sets GET api endpoint to find itc auto shipments', async function (actor: string) {
    linkListShipments = `${Links.API_SHIPMENT}?offset=0&limit=200&where={"logic":"and","filters":[{"filters":[{"field":"status","operator":"contains","value":"working"}],"logic":"and"},{"logic":"or","filters":[{"field":"shipmentName","operator":"contains","value":"ITC_shipment_auto"},{"field":"shipmentSource","operator":"contains","value":"ITC_shipment_auto"},{"field":"destinationFulfillmentCenterId","operator":"contains","value":"ITC_shipment_auto"},{"field":"status","operator":"contains","value":"ITC_shipment_auto"}]}]}`;
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

Then(`User picks a just created shipment`, async function () {
    expect(this.getListShipmentsResponseBody.length).toBeGreaterThan(0)
    const justCreatedShipment = this.getListShipmentsResponseBody[Math.floor(Math.random() * this.getListShipmentsResponseBody.length)];
    logger.log('info', `Just created shipment >>>>> ` + JSON.stringify(justCreatedShipment, undefined, 4));
    this.attach(`Just created shipment >>>>> ` + JSON.stringify(justCreatedShipment, undefined, 4));
    this.shipmentName = this.getListShipmentsResponseBody[0]?.shipmentName;
    this.shipmentKey = this.key = this.getListShipmentsResponseBody[0]?.key;
});

Then('{} checks the new created shipment: {}', async function (actor, shipmentStatus: string) {
    this.shipmentStatus = this.getListShipmentsResponseBody[0].status;
    this.name = this.getListShipmentsResponseBody[0]?.shipmentName;
    this.key = this.getListShipmentsResponseBody[0]?.key;
    expect(this.shipmentStatus, `In response body, the expected shipmentStatus should be: ${shipmentStatus}`).toBe(shipmentStatus);
    expect(this.name.includes(this.shipmentName), `In response body, the expected shipmentName should be: ${this.shipmentName}`).toBeTruthy();
});

Then('{} checks results in the search shipments api', async function (actor: string) {
    if (!this.getListShipmentsResponseBody.length) {
        logger.log('info', 'The result does not match with conditions, please find on the UI:: ' + this.getListShipmentsResponseBody.length);
        this.attach('Cannot find the result, please find on the UI:: ' + this.getListShipmentsResponseBody.length);
        // If do not have any results will stop the progress
        expect(this.getListShipmentsResponseBody.length, 'Have the result in Search shipment API').toBeGreaterThan(0);
    }
    else {
        expect(this.getListShipmentsResponseBody.length, 'Have the result in Search shipment API').toBeGreaterThan(0);
    }
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

Then(`User sets POST api to add SKU as the following data:`, async function (dataTable: DataTable) {
    this.linkAddSKUs = `${Links.API_SHIPMENT}-detail`
    const { sku, warehouseQty, casePackQty, QtySent } = dataTable.hashes()[0]
    this.payloadAddSKUs = {
        "shipmentItemKey": "",
        "itemKey": `${this.itemKey}`,
        "itemName": `${this.itemName}`,
        "restockKey": `${this.shipmentKey}`,
        "shipmentId": "",
        "caseQty": Number(casePackQty),
        "localQty": Number(warehouseQty),
        "shipmentQty": Number(QtySent)
    }

    logger.log('info', `Payload add SKUs >>>` + JSON.stringify(this.payloadAddSKUs, undefined, 4));
    this.attach(`Payload add SKUs >>> ` + JSON.stringify(this.payloadAddSKUs, undefined, 4))
})

Then(`User sends a POST request to add SKU`, async function () {
    this.addSKUsResponse = this.response = await shipmentRequest.postShipment(this.request, this.linkAddSKUs, this.payloadAddSKUs, this.headers);
    const responseBodyText = await this.addSKUsResponse.text();
    if (this.addSKUsResponse.status() == 200) {
        this.addSKUsResponseBody = JSON.parse(await this.addSKUsResponse.text());
        logger.log('info', `Response add SKUs ${this.linkAddSKUs}` + JSON.stringify(this.addSKUsResponseBody, undefined, 4));
        this.attach(`Response add SKUs ${this.linkAddSKUs} ` + JSON.stringify(this.addSKUsResponseBody, undefined, 4))
    } else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${this.linkAddSKUs} has status code ${this.addSKUsResponse.status()} ${this.addSKUsResponse.statusText()} and response body ${actualResponseText}`);
        this.attach(`Response ${this.linkAddSKUs} has status code ${this.addSKUsResponse.status()} ${this.addSKUsResponse.statusText()} and response body ${actualResponseText}`)
    }
})

Then(`User checks API contract of add SKU response are correct`, async function () {
    addSKUsResponseSchema.parse(this.addSKUsResponseBody)
})

Then(`User checks the new SKU must be found in the above list items`, async function () {
    expect(this.getShipmentItemsResponseBody.length).toBeGreaterThan(0)
    const sku = this.getShipmentItemsResponseBody.find((sku: any) => sku.itemName == this.payloadAddSKUs.itemName)
    expect(sku).not.toBe(undefined)
})

Then(`User sets POST api to create shipment from Warehouse with name:`, function (dataTable: DataTable) {
    const { shipmentName } = dataTable.hashes()[0]
    if (shipmentName === 'ITC_shipment_auto_name') {
        this.shipmentName = `${shipmentName}_${Date.now()}`
    }

    link = `${Links.API_SHIPMENT}/upload-inventory`;
    this.payLoad = {
        "shipmentName": `${this.shipmentName}`,
        "fileDetails": {
            "fileName": `${this.fileName}`,
            "fileType": "shipmentItem",
            "append": false,
            "zero": false,
            "userId": "",
            "isCreateNew": true,
            "isInitialUpload": false
        }
    }

    logger.log('info', `Payload: ` + JSON.stringify(this.payLoad, undefined, 4));
    this.attach(`Payload: ` + JSON.stringify(this.payLoad, undefined, 4));
})