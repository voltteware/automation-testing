import { Then } from '@cucumber/cucumber';
import * as shipmentRequest from '../../../../src/api/request/shipment.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";
import { modifyShipmentSchema, shipmentDetailSchema } from '../assertion/restockAMZ/shipmentAssertionSchema';

Then('{} sets PUT api endpoint to modify shipment details', async function (actor: string) {
    this.linkApiModifyShipment = `${Links.API_SHIPMENT}/${this.shipmentKey}/modify`;
});

Then(`{} sends a PUT request to modify: {} shipment details`, async function (actor: string, action: string) {    
    this.payloadModifyShipment = this.getShipmentDetailsResponseBody
    if (action === 'DELETE') {
        this.payloadModifyShipment.status = "DELETED"
    }

    logger.log('info', `Payload delete shipment : ` + JSON.stringify(this.payloadModifyShipment, undefined, 4));
    this.attach(`Payload delete shipment : ` + JSON.stringify(this.payloadModifyShipment, undefined, 4));
    this.response = await shipmentRequest.putShipment(this.request, this.linkApiModifyShipment, this.payloadModifyShipment, this.headers);
    if (this.response.status() == 200) {
        this.modifyShipmentResponseBody = JSON.parse(await this.response.text())
        logger.log('info', `Modify Shipment Details Response ${this.linkApiModifyShipment} has status code ${this.response.status()} ${this.response.statusText()} and modifyShipmentResponse body ${JSON.stringify(this.modifyShipmentResponseBody, undefined, 4)}`);
        this.attach(`Modify Shipment Details Response ${this.linkApiModifyShipment} has status code ${this.response.status()} ${this.response.statusText()} and modifyShipmentResponse body ${JSON.stringify(this.modifyShipmentResponseBody, undefined, 4)}`);
    } else {
        logger.log('info', `Modify Shipment Details Response ${this.linkApiModifyShipment} has status code ${this.response.status()} ${this.response.statusText()}`);
        this.attach(`Modify Shipment Details Response ${this.linkApiModifyShipment} has status code ${this.response.status()} ${this.response.statusText()}`);
    }
});

Then(`{} sets GET api endpoint to get shipment details in Manage Shipments`, async function (actor: string) {
    this.linkApiGetShipmentDetail = `${Links.API_SHIPMENT}/${this.shipmentKey}?address=true&total=true`;
});

Then(`{} sends a GET request to get shipment details in Manage Shipments`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.getShipmentDetailsResponse = this.response = await shipmentRequest.getShipmentInfo(this.request, this.linkApiGetShipmentDetail, options);
    const responseBodyText = await this.getShipmentDetailsResponse.text();
    if (this.getShipmentDetailsResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getShipmentDetailsResponseBody = JSON.parse(await this.getShipmentDetailsResponse.text());
        logger.log('info', `Response GET ${this.linkApiGetShipmentDetail}: ` + JSON.stringify(this.getShipmentDetailsResponseBody, undefined, 4));
        this.attach(`Response GET ${this.linkApiGetShipmentDetail}: ` + JSON.stringify(this.getShipmentDetailsResponseBody, undefined, 4));
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${this.linkApiGetShipmentDetail} has status code ${this.getShipmentDetailsResponse.status()} ${this.getShipmentDetailsResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${this.linkApiGetShipmentDetail} has status code ${this.getShipmentDetailsResponse.status()} ${this.getShipmentDetailsResponse.statusText()} and response body ${actualResponseText}`);
    }
    // Check information in Shipment Details
    this.actualTotalCost = this.getShipmentDetailsResponseBody.totalCost;
    this.actualTotalSKUs = this.getShipmentDetailsResponseBody.totalSKUs;
    this.actualTotalWeight = this.getShipmentDetailsResponseBody.totalWeight;
    this.actualDestinationFulfillmentCenterId = this.getShipmentDetailsResponseBody.destinationFulfillmentCenterId;
    this.actualRestockType = this.getShipmentDetailsResponseBody.restockType;
    this.actualShipmentName = this.getShipmentDetailsResponseBody.shipmentName;
    this.actualStatus = this.getShipmentDetailsResponseBody.status;
    this.actualLabelPrepPreference = this.getShipmentDetailsResponseBody.labelPrepPreference;
    // Information of Ship from - Ship to
    this.actualAddressLine1 = this.getShipmentDetailsResponseBody.shipFromAddress.addressLine1;
    this.actualAddressLine2 = this.getShipmentDetailsResponseBody.shipFromAddress.addressLine2;
    this.actualCity = this.getShipmentDetailsResponseBody.shipFromAddress.city;
    this.actualCountryCode = this.getShipmentDetailsResponseBody.shipFromAddress.countryCode;
    this.actualFullName = this.getShipmentDetailsResponseBody.shipFromAddress.fullName;
    this.actualPhoneNumber = this.getShipmentDetailsResponseBody.shipFromAddress.phoneNumber;
    this.actualPostalCode = this.getShipmentDetailsResponseBody.shipFromAddress.postalCode;
    this.actualStateOrProvinceCode = this.getShipmentDetailsResponseBody.shipFromAddress.stateOrProvinceCode;
    this.actualShipmentSource = this.getShipmentDetailsResponseBody.shipmentSource;
});

Then(`User checks API contract essential types in shipment details are correct`, async function () {
    shipmentDetailSchema.parse(this.getShipmentDetailsResponseBody)
});

Then(`User checks API contract essential types in modify shipment object are correct`, async function () {
    modifyShipmentSchema.parse(this.modifyShipmentResponseBody)
});