import { Then } from '@cucumber/cucumber';
import * as shipmentRequest from '../../../../src/api/request/shipment.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import { expect } from '@playwright/test';

let link: any;

Then(`{} sets DELETE api endpoint to delete shipment`, async function (actor: string) {
    link = `${Links.API_SHIPMENT}/${this.shipmentKey}`;

    logger.log('info', `Shipment will be deleted: ${link}`);
    this.attach(`Shipment will be deleted: ${link}`);
});

Then('{} sends a DELETE request to delete shipment', async function (actor: string) {
    //Delete Shipment does not have response body => Not having response body here
    const options = {
        headers: this.headers,
        isSubtractWarehouse: true
    }
    this.response = await shipmentRequest.deleteShipment(this.request, link, options);
    if (this.response.status() == 200) {
        logger.log('info', `Delete Shipment Response ${link} has status code ${this.response.status()} ${this.response.statusText()}`);
        this.attach(`Delete Shipment Response ${link} has status code ${this.response.status()} ${this.response.statusText()}`);

    } else {
        logger.log('info', `Delete Shipment Response ${link} has status code ${this.response.status()}`);
        this.attach(`Delete Shipment Response ${link} has status code ${this.response.status()}`);
    }
});

Then(`{} checks the deleted shipments does not exist in the list`, async function (actor: string) {
    console.log(" this.getListShipmentsResponseBody:: " +  this.getListShipmentsResponseBody);
    const actual = this.getListShipmentsResponseBody.includes(this.shipmentName);
    expect(actual,`This ${this.shipmentName} should be deleted`).toBe(false);
});

Then(`{} checks the deleted shipments must be existed in the list`, async function (actor: string) {
    this.softAssert(this.getListShipmentsResponseBody.length == 1, `List shipment must contain 1 shipment object. Actual length: ${this.getListShipmentsResponseBody.length}`)
    this.softAssert(this.getListShipmentsResponseBody[0].status == 'DELETED', `The shipment status must be DELETED, after delete shipment. Actual status: ${this.getListShipmentsResponseBody.status}`)
    this.softAssert(this.getListShipmentsResponseBody[0].shipmentName == this.shipmentName, `Expected name: ${this.shipmentName} - Actual name: ${this.getListShipmentsResponseBody[0].shipmentName}`)
    expect(this.countErrors).toBe(0)      
});