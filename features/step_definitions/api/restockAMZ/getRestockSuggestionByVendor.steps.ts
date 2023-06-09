import { Then } from '@cucumber/cucumber';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import * as restockSuggestion from '../../../../src/api/request/restockSuggestion.service';
import { getRestockSuggestionByVendorResponseSchema } from '../assertion/restockAMZ/getRestockSuggestionByVendorAssertionSchema';

let link: any;

Then(`{} sets GET api method to get restock suggestion by vendor`, async function (actor: string) {
    link = Links.API_GET_RESTOCK_SUGGESTION_BY_VENDOR;
    const sleep = (milliseconds: number) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    await sleep(5000);
});

Then('{} checks API contract of get restock suggestion by vendor api', async function (actor: string) {
    getRestockSuggestionByVendorResponseSchema.parse(this.selectedListSupplier);
});

Then(`{} sends a GET api method to get restock suggestion by vendor`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.restockSuggestionResponse = this.response = await restockSuggestion.getRestockSuggestion(this.request, link, options);
    const responseBodyText = await this.restockSuggestionResponse.text();
    if (this.restockSuggestionResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.responseBody = this.restockSuggestionResponseBody = JSON.parse(await this.restockSuggestionResponse.text());
        logger.log('info', `Response GET ${link}` + JSON.stringify(this.restockSuggestionResponseBody, undefined, 4));
        this.attach(`Response GET ${link}` + JSON.stringify(this.restockSuggestionResponseBody, undefined, 4))
    }
    else if (responseBodyText.includes('<!doctype html>')) {
        logger.log('info', `Response GET ${link} ${responseBodyText}`);
        this.attach(`Response GET ${link} returns html`)
    }
});

Then('{} saves all supplier name from list above', async function (actor) {
    console.log('this.@api-exportData: ', this.restockSuggestionResponseBody)
    const allSuppliersInSupplierListArray = [];
    for(let i = 0; i < this.restockSuggestionResponseBody.length; i++){
        allSuppliersInSupplierListArray.push(this.restockSuggestionResponseBody[i].vendorName);
    }
    this.allSuppliersInSupplierList = allSuppliersInSupplierListArray;
    console.log(`All suppliers in SupplierList: `, this.allSuppliersInSupplierList);
    logger.log(`info`,`All suppliers in SupplierList: ${this.allSuppliersInSupplierList}`);
    this.attach(`info`,`All suppliers in SupplierList: ${this.allSuppliersInSupplierList}`);
})

Then('{} selects the {} in Supplier list', async function (actor, optionListSupplier: string){
    this.selectedListSupplier = await this.restockSuggestionResponseBody.find((sgg: any) => sgg.vendorName == `[${optionListSupplier}]`);
    logger.log('info', `Supplier list option which has ${optionListSupplier}: ${JSON.stringify(this.selectedListSupplier, undefined, 4)}`);
    this.attach(`Supplier list option which has ${optionListSupplier}: ${JSON.stringify(this.selectedListSupplier, undefined, 4)}`);
});

Then('{} saves needed alert items information', async function (actor: string) {
        //All Items have alerts = green + yellow + orange + red + teal
        this.greenAlerts = Number(this.selectedListSupplier.greenAlerts);
        this.orangeAlerts = Number(this.selectedListSupplier.orangeAlerts);
        this.redAlerts = Number(this.selectedListSupplier.redAlerts);
        this.restockTotal = Number(this.selectedListSupplier.restockTotal);
        this.restockUnits = Number(this.selectedListSupplier.restockUnits);
        this.targetOrderValue = Number(this.selectedListSupplier.targetOrderValue);
        this.tealAlerts = Number(this.selectedListSupplier.tealAlerts);
        this.yellowAlerts = Number(this.selectedListSupplier.yellowAlerts);
        this.allAlertItems = this.greenAlerts + this.orangeAlerts + this.redAlerts + this.tealAlerts + this.yellowAlerts;
});