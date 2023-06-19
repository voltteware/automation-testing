import { Then } from '@cucumber/cucumber';
import * as shipmentRequest from '../../../../src/api/request/shipment.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import { expect } from '@playwright/test';

let link: any;
let actualStatus: any;

Then(`{} sets PUT api endpoint to refresh status of specific shipment`, async function (actor: string) {
    link = `${Links.API_SHIPMENT}/${this.shipmentKey}/refresh`;

    logger.log('info', `Shipment will be refreshed status: ${link}`);
    this.attach(`Shipment will be refreshed status: ${link}`);
});

Then('{} sends a PUT request to refresh status of specific shipment', async function (actor: string) {
    // API refresh shipment status does not have payload
    this.refreshShipmentStatusResponse = this.response = await shipmentRequest.refreshShipmentStatus(this.request, link, this.headers);
    const responseBodyText = await this.refreshShipmentStatusResponse.text();
    this.refreshShipmentStatusResponseBody = JSON.parse(responseBodyText);
    if (this.response.status() == 200) {
        logger.log('info', `Refresh Shipment Status Response ${link} has status code ${this.refreshShipmentStatusResponse.status()} ${this.refreshShipmentStatusResponse.statusText()} and response body ` + JSON.stringify(this.refreshShipmentStatusResponseBody, undefined, 4));
        this.attach(`Refresh Shipment Status Response ${link} has status code ${this.refreshShipmentStatusResponse.status()} ${this.refreshShipmentStatusResponse.statusText()} and response body ` +  JSON.stringify(this.refreshShipmentStatusResponseBody, undefined, 4));

    } else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.refreshShipmentStatusResponse.status()} ${this.refreshShipmentStatusResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.refreshShipmentStatusResponse.status()} ${this.refreshShipmentStatusResponse.statusText()} and response body ${actualResponseText}`);
    }
    actualStatus = this.refreshShipmentStatusResponseBody.status;
});

Then(`User checks status of this shipment after updated`, async function () {
    expect(actualStatus).toBe("DELETED");
});