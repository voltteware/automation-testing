import { Then } from '@cucumber/cucumber';
import * as shipmentRequest from '../../../../src/api/request/shipment.service';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import { faker } from '@faker-js/faker';
import _ from "lodash";
import { modifyShipmentSchema, shipmentDetailSchema } from '../assertion/restockAMZ/shipmentAssertionSchema';
import { formatDate } from '../../../../src/helpers/calculation-helper';

let payload: any;
let linkApiUpdateShipment: any;
let link: any;

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

Then(`{} sends a GET api method to get inbound analyzer`, async function (actor: string) {
    link = `${Links.API_SHIPMENT}/inbound-analyzer/${this.itemKey}`

    const options = {
        headers: this.headers
    }
    this.getInboundAnalyzerResponse = this.response = await shipmentRequest.getInboundAnalyzer(this.request, link, options);
    const responseBodyText = await this.getInboundAnalyzerResponse.text();
    if (this.getInboundAnalyzerResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getInboundAnalyzerResponseBody = JSON.parse(await this.getInboundAnalyzerResponse.text());
        logger.log('info', `Response GET ${link}: ` + JSON.stringify(this.getInboundAnalyzerResponseBody, undefined, 4));
        this.attach(`Response GET ${link}: ` + JSON.stringify(this.getInboundAnalyzerResponseBody, undefined, 4));
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.getInboundAnalyzerResponse.status()} ${this.getInboundAnalyzerResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.getInboundAnalyzerResponse.status()} ${this.getInboundAnalyzerResponse.statusText()} and response body ${actualResponseText}`);
    }
});

Then(`{} picks a random shipment in inbound analyzer`, async function (actor: string) {
    const justCreatedShipment = this.getInboundAnalyzerResponseBody.shipments[0];
    logger.log('info', `justCreatedShipment: ` + JSON.stringify(justCreatedShipment, undefined, 4));
    this.attach(`justCreatedShipment: ` + JSON.stringify(justCreatedShipment, undefined, 4));
    this.shipmentName = justCreatedShipment.shipmentName;

});

Then(`{} sends PUT request to update in RestockAMZ {}`, async function (actor: string, fieldUpdate: string) {
    linkApiUpdateShipment = `${Links.API_SHIPMENT}/${this.key}`
    if (fieldUpdate === 'Estimated Receive Date') {
        payload = {
            "key": `${this.key}`,
            "companyKey": `${this.companyKey}`,
            "companyType": `${this.companyType}`,
            "receiveDate": `${formatDate(new Date((new Date()).getTime() + (360 * 86400000)))}` + "T17:00:00.000Z",
            "shipmentName":`${this.shipmentName}`
        }
    }

    logger.log('info', `Payload update shipment: ` + JSON.stringify(payload, undefined, 4));
    this.attach(`Payload update shipment: ` + JSON.stringify(payload, undefined, 4));
    this.response = await shipmentRequest.putShipment(this.request, linkApiUpdateShipment, payload, this.headers);
    if (this.response.status() == 200) {
        this.updateShipmentResponseBody = JSON.parse(await this.response.text())
        logger.log('info', `Update Shipment Response ${linkApiUpdateShipment} has status code ${this.response.status()} ${this.response.statusText()} and updateShipmentResponse body ${JSON.stringify(this.updateShipmentResponseBody, undefined, 4)}`);
        this.attach(`Update Shipment Response ${linkApiUpdateShipment} has status code ${this.response.status()} ${this.response.statusText()} and updateShipmentResponse body ${JSON.stringify(this.updateShipmentResponseBody, undefined, 4)}`);
    } else {
        logger.log('info', `Update Shipment Response ${linkApiUpdateShipment} has status code ${this.response.status()} ${this.response.statusText()}`);
        this.attach(`Update Shipment Response ${linkApiUpdateShipment} has status code ${this.response.status()} ${this.response.statusText()}`);
    }
    this.receiveDate  = this.updateShipmentResponseBody.receiveDate;
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