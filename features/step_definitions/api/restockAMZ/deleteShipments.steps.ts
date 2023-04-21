import { Then } from '@cucumber/cucumber';
import * as shipmentRequest from '../../../../src/api/request/shipment.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import { expect } from '@playwright/test';

let link: any;

Then(`{} sets DELETE api endpoint to delete shipment`, async function (actor: string) {
    link = `${Links.API_SHIPMENT}/${this.shipmentKey}`;
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