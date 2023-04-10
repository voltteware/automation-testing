import { Then } from '@cucumber/cucumber';
import * as shipmentRequest from '../../../../src/api/request/shipment.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";

let link: any;
let payload: any;

Then('{} sets PUT api endpoint to modify shipment details', async function (actor: string) {
    link = `${Links.API_SHIPMENT}/${this.shipmentKey}/modify`;
});

Then('{} sends a PUT request to modify shipment details', async function (actor: string) {
    payload = {
        status: "DELETED",
        shipmentName: `${this.shipmentName}`,
        key: `${this.shipmentKey}`,
        shipmentId: `${this.shipmentId}`,
        shipmentSource: `${this.shipmentSource}`
    }

    logger.log('info', `Payload: ` + JSON.stringify(payload, undefined, 4));
    this.attach(`Payload: ` + JSON.stringify(payload, undefined, 4));
    this.response = await shipmentRequest.putShipment(this.request, link, payload, this.headers);
    if (this.response.status() == 200) {
        this.modifyShipmentResponseBody = JSON.parse(await this.response.text())
        logger.log('info', `Modify Shipment Details Response ${link} has status code ${this.response.status()} ${this.response.statusText()} and modifyShipmentResponse body ${JSON.stringify(this.modifyShipmentResponseBody, undefined, 4)}`);
        this.attach(`Modify Shipment Details Response ${link} has status code ${this.response.status()} ${this.response.statusText()} and modifyShipmentResponse body ${JSON.stringify(this.modifyShipmentResponseBody, undefined, 4)}`);
    } else {
        logger.log('info', `Modify Shipment Details Response ${link} has status code ${this.response.status()} ${this.response.statusText()}`);
        this.attach(`Modify Shipment Details Response ${link} has status code ${this.response.status()} ${this.response.statusText()}`);
    }
});

Then(`{} sets GET api endpoint to get shipment details in Manage Shipments`, async function (actor: string) {
    link = `${Links.API_SHIPMENT}/${this.shipmentKey}?address=true&total=true`;
});

Then(`{} sends a GET request to get shipment details in Manage Shipments`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getShipmentDetailsResponse = this.response = await shipmentRequest.getShipmentInfo(this.request, link, options);
    const responseBodyText = await this.getShipmentDetailsResponse.text();
    if (this.getShipmentDetailsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getShipmentDetailsResponseBody = JSON.parse(await this.getShipmentDetailsResponse.text());
        logger.log('info', `Response GET ${link}: ` + JSON.stringify(this.getShipmentDetailsResponseBody, undefined, 4));
        this.attach(`Response GET ${link}: ` + JSON.stringify(this.getShipmentDetailsResponseBody, undefined, 4));
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.getShipmentDetailsResponse.status()} ${this.getShipmentDetailsResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.getShipmentDetailsResponse.status()} ${this.getShipmentDetailsResponse.statusText()} and response body ${actualResponseText}`);
    }
});