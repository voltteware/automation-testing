import { Then, DataTable, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import * as restockSuggestion from '../../../../src/api/request/restockSuggestion.service';
import * as itemRequest from '../../../../src/api/request/item.service';
import { sumFormulaRestockAMZ, totalInboundFormulaRestockAMZ, estimatedMarginFormulaRestockAMZ, dailySalesRateFormulaRestockAMZ, adjDailySalesRateFormulaRestockAMZ, averageDailySalesRateFormulaRestockAMZ, requiredInventoryFormulaRestockAMZ, inventoryAvailableFormulaRestockAMZ, recommendationsFormulaRestockAMZ, suggestionsFormulaRestockAMZ } from '../../../../src/helpers/calculation-helper';
import { itemRestockAMZInfoResponseSchema, editItemInItemListSchema } from '../assertion/dashboard/itemAssertionSchema';

let link: any;
let linkRestockAMZ: any;
let countAllItemInItemListLink: any;
let getItemListLink: any;

Then(`{} sends GET api endpoint to get items in RestockAMZ without filtered options`, async function (actor: string) {
    let linkItemRestockAMZ = encodeURI(`${Links.API_GET_RESTOCK_SUGGESTION}?offset=0&limit=100&where={"logic":"and","filters":[{"logic":"or","filters":[{"filters":[],"logic":"or"},{"filters":[],"logic":"or"}],"currentSupplierFilters":[]},{"logic":"or","filters":[{"field":"sku","operator":"contains","value":"${this.itemName}"},{"field":"productName","operator":"contains","value":"${this.itemName}"},{"field":"category","operator":"contains","value":"${this.itemName}"},{"field":"supplier","operator":"contains","value":"${this.itemName}"},{"field":"supplierSku","operator":"contains","value":"${this.itemName}"},{"field":"asin","operator":"contains","value":"${this.itemName}"}]},{"logic":"and","filters":[]},{"logic":"and","filters":[{"field":"status","operator":"neq","value":"IGNORE"}]},{"logic":"and","filters":[{"field":"status","operator":"neq","value":"INACTIVE"}]}]}`);
    const options = {
        headers: this.headers
    }
    this.restockSuggestionResponse = this.response = await restockSuggestion.getRestockSuggestion(this.request, linkItemRestockAMZ, options);
    const responseBodyText = await this.restockSuggestionResponse.text();
    if (this.restockSuggestionResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.restockSuggestionResponseBody = JSON.parse(await this.restockSuggestionResponse.text());
        logger.log('info', `Response GET ${linkItemRestockAMZ}: ` + JSON.stringify(this.restockSuggestionResponseBody, undefined, 4));
        this.attach(`Response GET ${linkItemRestockAMZ}: ` + JSON.stringify(this.restockSuggestionResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${linkItemRestockAMZ} has status code ${this.restockSuggestionResponse.status()} ${this.restockSuggestionResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${linkItemRestockAMZ} has status code ${this.restockSuggestionResponse.status()} ${this.restockSuggestionResponse.statusText()} and response body ${actualResponseText}`)
    }
});

Then(`{} sends a GET api method to count all Items have alerts in {}`, async function (actor, optionListSupplier: string) {
    const options = {
        headers: this.headers
    }
    let link = encodeURI(`${Links.API_GET_RESTOCK_SUGGESTION}/count?where={"logic":"and","filters":[{"logic":"or","filters":[{"filters":[{"field":"flag","operator":"eq","value":"RED"},{"field":"flag","operator":"eq","value":"YELLOW"},{"field":"flag","operator":"eq","value":"ORANGE"},{"field":"flag","operator":"eq","value":"TEAL"},{"field":"flag","operator":"eq","value":"GREEN"}],"logic":"or"},{"filters":[],"logic":"or"}],"currentSupplierFilters":[{"text":"[${optionListSupplier}]","value":"[${optionListSupplier}]"}]},{"logic":"and","filters":[]}]}`);
    this.restockSuggestionResponse = this.response = await restockSuggestion.getRestockSuggestion(this.request, link, options);
    const responseBodyText = await this.restockSuggestionResponse.text();
    if (this.restockSuggestionResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.restockSuggestionResponseBody = JSON.parse(await this.restockSuggestionResponse.text());
        logger.log('info', `Response GET ${link}: ` + JSON.stringify(this.restockSuggestionResponseBody, undefined, 4));
        this.attach(`Response GET ${link}: ` + JSON.stringify(this.restockSuggestionResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.restockSuggestionResponse.status()} ${this.restockSuggestionResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.restockSuggestionResponse.status()} ${this.restockSuggestionResponse.statusText()} and response body ${actualResponseText}`)
    }
});

Then('{} compares and checks the total of Items which have alerts', async function (actor: string) {
    const expectedTotalItems = this.allAlertItems;
    expect(this.restockSuggestionResponseBody, `In response body, the total of Items which have alerts should be: ${expectedTotalItems}`).toBe(expectedTotalItems);
});

Then(`{} sets GET api method to get Items belonged to {} with direction: {}`, async function (actor, supplierOption, direction: string) {
    link = encodeURI(`${Links.API_GET_RESTOCK_SUGGESTION}?offset=0&limit=5&sort=[{"field":"recommendedSupplierQty","direction":"${direction}"}]&where={"logic":"and","filters":[{"logic":"or","filters":[{"filters":[{"field":"flag","operator":"eq","value":"RED"},{"field":"flag","operator":"eq","value":"YELLOW"},{"field":"flag","operator":"eq","value":"ORANGE"},{"field":"flag","operator":"eq","value":"TEAL"},{"field":"flag","operator":"eq","value":"GREEN"}],"logic":"or"},{"filters":[{"field":"status","operator":"eq","value":"WATCH"}],"logic":"or"}],"currentSupplierFilters":[{"text":"[${supplierOption}]","value":"[${supplierOption}]"}]},{"logic":"or","filters":[{"field":"sku","operator":"contains","value":"HB"},{"field":"productName","operator":"contains","value":"HB"},{"field":"category","operator":"contains","value":"HB"},{"field":"supplier","operator":"contains","value":"HB"},{"field":"supplierSku","operator":"contains","value":"HB"},{"field":"asin","operator":"contains","value":"HB"}]},{"logic":"and","filters":[]},{"logic":"and","filters":[{"field":"status","operator":"neq","value":"IGNORE"}]},{"logic":"and","filters":[{"field":"status","operator":"neq","value":"INACTIVE"}]}]}`);
});

Then(`{} sends a GET api method to get Items belonged to {}`, async function (actor, optionListSupplier: string) {
    const options = {
        headers: this.headers
    }
    this.restockSuggestionResponse = this.response = await restockSuggestion.getRestockSuggestion(this.request, link, options);
    const responseBodyText = await this.restockSuggestionResponse.text();
    if (this.restockSuggestionResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.restockSuggestionResponseBody = JSON.parse(await this.restockSuggestionResponse.text());
        logger.log('info', `Response GET ${link}: ` + JSON.stringify(this.restockSuggestionResponseBody, undefined, 4));
        this.attach(`Response GET ${link}: ` + JSON.stringify(this.restockSuggestionResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.restockSuggestionResponse.status()} ${this.restockSuggestionResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.restockSuggestionResponse.status()} ${this.restockSuggestionResponse.statusText()} and response body ${actualResponseText}`)
    }
});

Then('{} checks API contract of get items in Item list', async function (actor: string) {
    itemRestockAMZInfoResponseSchema.parse(this.responseOfAItem);
});

Then('{} picks random item in Item list', async function (actor: string) {
    this.responseOfAItem = await this.restockSuggestionResponseBody[Math.floor(Math.random() * this.restockSuggestionResponseBody.length)];
    this.itemKey = this.responseOfAItem.forecastconstant.itemKey;
    this.itemName = this.responseOfAItem.forecastconstant.itemName;
    logger.log('info', `Random Item: ${JSON.stringify(this.responseOfAItem, undefined, 4)}`);
    this.attach(`Random Item: ${JSON.stringify(this.responseOfAItem, undefined, 4)}`);
});

Then('{} saves needed values for calculations', async function (actor: string) {
    this.onHandFBA = this.responseOfAItem.qoh;
    this.inbound = this.responseOfAItem.inbound;
    this.fcTransfer = this.responseOfAItem.inboundFcTransfer;
    this.sum = this.responseOfAItem.sum;
    this.inboundWorking = this.responseOfAItem.inboundWorking;
    this.inboundShipped = this.responseOfAItem.inboundShipped;
    this.inboundReceiving = this.responseOfAItem.inboundReceiving;
    this.inboundTotal = this.responseOfAItem.inboundTotal;
    this.targetQtyOnHand = this.responseOfAItem.targetQtyOnHand;
    this.onHand = this.responseOfAItem.forecastconstant.onHand;

    // Suggestions
    this.suggShip = this.responseOfAItem.suggShip;
    this.suggReorder = this.responseOfAItem.suggReorder;
    this.restockNeeded = this.responseOfAItem.restockNeeded;

    // Recommendations
    this.forecastRecommendedQty = this.responseOfAItem.forecastRecommendedQty;
    this.recommendedWarehouseQty = this.responseOfAItem.recommendedWarehouseQty;
    this.recommendedSupplierQty = this.responseOfAItem.recommendedSupplierQty;

    // Estimated Margin
    this.estimatedMargin = this.responseOfAItem.estimatedMargin;
    this.estimatedMarginPercentage = this.responseOfAItem.estimatedMarginPercentage;
    this.estimatedMarkupPercentage = this.responseOfAItem.estimatedMarkupPercentage;

    // Cost
    this.supplierCost = this.responseOfAItem.supplierCost;
    this.supplierRebate = this.responseOfAItem.supplierRebate;
    this.repackingLaborCost = this.responseOfAItem.repackingLaborCost;
    this.repackagingMaterialCost = this.responseOfAItem.repackagingMaterialCost;
    this.inboundShippingCost = this.responseOfAItem.inboundShippingCost;
    this.reshippingCost = this.responseOfAItem.reshippingCost;

    this.totalCost = this.supplierCost + this.supplierRebate + this.repackingLaborCost + this.repackagingMaterialCost + this.inboundShippingCost + this.reshippingCost;  //Total cost = Sum all of above cost
    logger.log('info', `Total cost value: ` + this.totalCost);
    this.attach(`Total cost value: ` + this.totalCost);

    // Price
    this.estimatedPriceType = this.responseOfAItem.estimatedPriceType;
    this.chosenPrice = Number(this.responseOfAItem[this.estimatedPriceType]);
    logger.log('info', `Chosen price value: ` + this.chosenPrice);
    this.attach(`Chosen price value: ` + this.chosenPrice);

    // Amazon Fees
    this.fbaFee = this.responseOfAItem.fbaFee;
    this.referralFee = this.responseOfAItem.referralFee;
    this.monthlyStorageFee = this.responseOfAItem.monthlyStorageFee;
    this.variableClosingFee = this.responseOfAItem.variableClosingFee;
    this.totalAmazonFees = Number(this.fbaFee + this.referralFee + this.monthlyStorageFee + this.variableClosingFee);  //Total Amazon Fee = Sum all of above Amazon Fees
    logger.log('info', `Total Amazon Fees value: ` + this.totalAmazonFees);
    this.attach(`Total Amazon Fees value: ` + this.totalAmazonFees);
});

Then(`{} checks value Suggestions on grid`, async function (actor: string) {
    suggestionsFormulaRestockAMZ({ suggReorder: this.suggReorder, suggShip: this.suggShip, recommendedWarehouseQty: this.recommendedWarehouseQty, recommendedSupplierQty: this.recommendedSupplierQty, restockNeeded: this.restockNeeded, targetQtyOnHand: this.targetQtyOnHand, sum: this.sum }, this.attach);
});

Then(`{} checks value Estimated Margin on grid`, async function (actor: string) {
    estimatedMarginFormulaRestockAMZ(this.chosenPrice, this.totalCost, this.totalAmazonFees, this.estimatedMargin, this.estimatedMarginPercentage, this.estimatedMarkupPercentage, this.attach);
});

Then(`{} checks value Total Inbound on grid`, async function (actor: string) {
    totalInboundFormulaRestockAMZ(this.inboundWorking, this.inboundShipped, this.inboundReceiving, this.inboundTotal, this.attach);
});

Then(`{} checks value Sum on grid`, async function (actor: string) {
    sumFormulaRestockAMZ(this.onHandFBA, this.inbound, this.fcTransfer, this.sum, this.attach);
});

Then(`{} sets GET api endpoint to get restock suggestion restockAMZ of an above item`, async function (actor: string) {
    linkRestockAMZ = `${Links.API_GET_RESTOCK_SUGGESTION}/${this.itemKey}/restockAMZ`;
});

Then(`{} sends GET request to get restock suggestion restockAMZ of an above item`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.restockCalculationResponse = this.response = await restockSuggestion.getRestockSuggestion(this.request, linkRestockAMZ, options);
    const responseBodyText = await this.restockCalculationResponse.text();
    if (this.restockCalculationResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.restockCalculationResponseBody = JSON.parse(await this.restockCalculationResponse.text());
        logger.log('info', `Response GET ${linkRestockAMZ}: ` + JSON.stringify(this.restockCalculationResponseBody, undefined, 4));
        this.attach(`Response GET ${linkRestockAMZ}: ` + JSON.stringify(this.restockCalculationResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${linkRestockAMZ} has status code ${this.restockCalculationResponse.status()} ${this.restockCalculationResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${linkRestockAMZ} has status code ${this.restockCalculationResponse.status()} ${this.restockCalculationResponse.statusText()} and response body ${actualResponseText}`)
    }
});

Then('{} saves values in Restock model for calculations', async function (actor: string) {
    // Data Sales
    this.responseBodyOfAFilteredItem = await this.getItemByFilteredResponseBody.find((item: any) => item.name === `${this.itemName}`)
    logger.log('info', `Response of Item: ` + JSON.stringify(this.responseBodyOfAFilteredItem, undefined, 4));
    this.attach(`Response of Item: ` + JSON.stringify(this.responseBodyOfAFilteredItem, undefined, 4));
    this.s2d = this.responseBodyOfAFilteredItem.s2d;
    this.s7d = this.responseBodyOfAFilteredItem.s7d;
    this.s14d = this.responseBodyOfAFilteredItem.s14d;
    this.s30d = this.responseBodyOfAFilteredItem.s30d;
    this.s60d = this.responseBodyOfAFilteredItem.s60d;
    this.s90d = this.responseBodyOfAFilteredItem.s90d;
    this.s180d = this.responseBodyOfAFilteredItem.s180d;
    logger.log('info', `s2d:: ` + this.s2d);
    this.attach(`s2d:: ` + this.s2d);
    logger.log('info', `s7d:: ` + this.s7d);
    this.attach(`s2d:: ` + this.s7d);
    logger.log('info', `s14d:: ` + this.s14d);
    this.attach(`s14d:: ` + this.s14d);
    logger.log('info', `s30d:: ` + this.s30d);
    this.attach(`s30d:: ` + this.s30d);
    logger.log('info', `s60d:: ` + this.s60d);
    this.attach(`s60d:: ` + this.s60d);
    logger.log('info', `s90d:: ` + this.s90d);
    this.attach(`s90d:: ` + this.s90d);
    logger.log('info', `s180d:: ` + this.s180d);
    this.attach(`s180d:: ` + this.s180d);

    // Daily Sales Rate
    this.sv2d = this.restockCalculationResponseBody.sv2d;
    this.sv7d = this.restockCalculationResponseBody.sv7d;
    this.sv14d = this.restockCalculationResponseBody.sv14d;
    this.sv30d = this.restockCalculationResponseBody.sv30d;
    this.sv60d = this.restockCalculationResponseBody.sv60d;
    this.sv90d = this.restockCalculationResponseBody.sv90d;
    this.sv180d = this.restockCalculationResponseBody.sv180d;
    this.svDemand = this.restockCalculationResponseBody.svDemand;
    this.demand = this.restockCalculationResponseBody.demand;

    // Settings RestockAMZ
    this.percent2Day = this.restockCalculationResponseBody.salesVelocitySettingData.percent2Day;
    this.percent7Day = this.restockCalculationResponseBody.salesVelocitySettingData.percent7Day;
    this.percent14Day = this.restockCalculationResponseBody.salesVelocitySettingData.percent14Day;
    this.percent30Day = this.restockCalculationResponseBody.salesVelocitySettingData.percent30Day;
    this.percent60Day = this.restockCalculationResponseBody.salesVelocitySettingData.percent60Day;
    this.percent90Day = this.restockCalculationResponseBody.salesVelocitySettingData.percent90Day;
    this.percent180Day = this.restockCalculationResponseBody.salesVelocitySettingData.percent180Day;
    this.percentForecasted = this.restockCalculationResponseBody.salesVelocitySettingData.percentForecasted;

    // Out of stock day
    this.outOfStock2d = this.restockCalculationResponseBody.outOfStock2d;
    this.outOfStock7d = this.restockCalculationResponseBody.outOfStock7d;
    this.outOfStock14d = this.restockCalculationResponseBody.outOfStock14d;
    this.outOfStock30d = this.restockCalculationResponseBody.outOfStock30d;
    this.outOfStock60d = this.restockCalculationResponseBody.outOfStock60d;
    this.outOfStock90d = this.restockCalculationResponseBody.outOfStock90d;
    this.outOfStock180d = this.restockCalculationResponseBody.outOfStock180d;

    // Adj. Daily Sales Rate
    this.adjSv2d = this.restockCalculationResponseBody.adjSv2d;
    this.adjSv7d = this.restockCalculationResponseBody.adjSv7d;
    this.adjSv14d = this.restockCalculationResponseBody.adjSv14d;
    this.adjSv30d = this.restockCalculationResponseBody.adjSv30d;
    this.adjSv60d = this.restockCalculationResponseBody.adjSv60d;
    this.adjSv90d = this.restockCalculationResponseBody.adjSv90d;
    this.adjSv180d = this.restockCalculationResponseBody.adjSv180d;

    // Required Inventory
    this.targetMaxDays = this.restockCalculationResponseBody.targetMaxDays;
    this.warehouseLeadTime = this.restockCalculationResponseBody.localLeadTimeDays;
    this.targetQtyOnHand = this.restockCalculationResponseBody.targetQtyOnHand;
    this.qtyToLocalLeadTime = this.restockCalculationResponseBody.qtyToLocalLeadTime;
    this.qtySupplierLeadTime = this.restockCalculationResponseBody.qtySupplierLeadTime;
    this.unitsRequired = this.restockCalculationResponseBody.coverageRequired;
    this.supplierLeadTime = this.restockCalculationResponseBody.supplierLeadTime;

    // Inventory Available
    this.currentAmazonInventory = this.restockCalculationResponseBody.currentAmazonInventory;
    this.amazonInventoryDays = this.restockCalculationResponseBody.amazonInventoryDays;
    this.warehouseQty = this.restockCalculationResponseBody.localQty;
    this.onOrder = this.restockCalculationResponseBody.onOrder;
    this.localInventoryDays = this.restockCalculationResponseBody.localInventoryDays;
    this.onOrderDays = this.restockCalculationResponseBody.onOrderDays;
    this.remaining = this.restockCalculationResponseBody.remaining;
    this.unitsAvailable = this.restockCalculationResponseBody.coverageAvailable;
    this.unitsOnPO = this.restockCalculationResponseBody.coverageOrderQty;
    this.sum = this.restockCalculationResponseBody.sum;

    // Recommendations
    this.forecastRecommendedQty = this.restockCalculationResponseBody.forecastRecommendedQty;
    this.recommendedWarehouseQty = this.restockCalculationResponseBody.recommendedWarehouseQty;
    this.recommendedSupplierQty = this.restockCalculationResponseBody.recommendedSupplierQty;
});

Then(`{} checks value Recommendations in Restock Model`, async function (actor: string) {
    recommendationsFormulaRestockAMZ({ targetQtyOnHand: this.targetQtyOnHand, qtyToLocalLeadTime: this.qtyToLocalLeadTime, currentAmazonInventory: this.currentAmazonInventory, unitsAvailable: this.unitsAvailable, unitsOnPO: this.unitsOnPO, recommendedWarehouseQty: this.recommendedWarehouseQty, recommendedSupplierQty: this.recommendedSupplierQty, unitsRequired: this.unitsRequired }, this.attach);
});

Then(`{} checks value Inventory Available in Restock Model`, async function (actor: string) {
    inventoryAvailableFormulaRestockAMZ({ currentAmazonInventory: this.currentAmazonInventory, amazonInventoryDays: this.amazonInventoryDays, warehouseQty: this.warehouseQty, onOrder: this.onOrder, onOrderDays: this.onOrderDays, localInventoryDays: this.localInventoryDays, demand: this.demand, remaining: this.remaining }, this.attach);
});

Then(`{} checks value Required Inventory in Restock Model`, async function (actor: string) {
    requiredInventoryFormulaRestockAMZ({ targetMaxDays: this.targetMaxDays, warehouseLeadTime: this.warehouseLeadTime, targetQtyOnHand: this.targetQtyOnHand, qtySupplierLeadTime: this.qtySupplierLeadTime, qtyToLocalLeadTime: this.qtyToLocalLeadTime, supplierLeadTime: this.supplierLeadTime, demand: this.demand }, this.attach);
});

Then(`{} checks value Average Daily Sales Rate in Restock Model`, async function (actor: string) {
    averageDailySalesRateFormulaRestockAMZ({ adjSv2d: this.adjSv2d, adjSv7d: this.adjSv7d, adjSv14d: this.adjSv14d, adjSv30d: this.adjSv30d, adjSv60d: this.adjSv60d, adjSv90d: this.adjSv90d, adjSv180d: this.adjSv180d, svDemand: this.svDemand, percent2Day: this.percent2Day, percent7Day: this.percent7Day, percent14Day: this.percent14Day, percent30Day: this.percent30Day, percent60Day: this.percent60Day, percent90Day: this.percent90Day, percent180Day: this.percent180Day, percentForecasted: this.percentForecasted, demand: this.demand }, this.attach);
});

Then(`{} checks value Daily Sales Rate in Restock Model`, async function (actor: string) {
    dailySalesRateFormulaRestockAMZ({ s2d: this.s2d, s7d: this.s7d, s14d: this.s14d, s30d: this.s30d, s60d: this.s60d, s90d: this.s90d, s180d: this.s180d, sv2d: this.sv2d, sv7d: this.sv7d, sv14d: this.sv14d, sv30d: this.sv30d, sv60d: this.sv60d, sv90d: this.sv90d, sv180d: this.sv180d }, this.attach);
});

Then(`{} checks value Adj Daily Sales Rate in Restock Model`, async function (actor: string) {
    adjDailySalesRateFormulaRestockAMZ({ s2d: this.s2d, s7d: this.s7d, s14d: this.s14d, s30d: this.s30d, s60d: this.s60d, s90d: this.s90d, s180d: this.s180d, outOfStock2d: this.outOfStock2d, outOfStock7d: this.outOfStock7d, outOfStock14d: this.outOfStock14d, outOfStock30d: this.outOfStock30d, outOfStock60d: this.outOfStock60d, outOfStock90d: this.outOfStock90d, outOfStock180d: this.outOfStock180d, adjSv2d: this.adjSv2d, adjSv7d: this.adjSv7d, adjSv14d: this.adjSv14d, adjSv30d: this.adjSv30d, adjSv60d: this.adjSv60d, adjSv90d: this.adjSv90d, adjSv180d: this.adjSv180d }, this.attach);
});

Then('{} checks API contract of get restock calculation api', async function (actor: string) {
    itemRestockAMZInfoResponseSchema.parse(this.restockCalculationResponseBody);
});

Then('{} checks isHidden is true or false', async function (actor: string) {
    if (this.getItemByItemKeyResponseBody.isHidden == false) {
        logger.log('info', `isHidden: ${this.getItemByItemKeyResponseBody.isHidden} => Please check on the UI`);
        this.attach(`isHidden: ${this.getItemByItemKeyResponseBody.isHidden} => Please check on the UI`);
        expect(this.getItemByItemKeyResponseBody.isHidden).toBe(true);
    }
    expect(this.getItemByItemKeyResponseBody.isHidden).toBe(true);
});

Then(`User sets GET api method to get all items in Item List with search function:`, async function (dataTable: DataTable) {
    const { supplierFilter, keyword } = dataTable.hashes()[0];
    this.keyword = keyword
    link = encodeURI(`${Links.API_GET_RESTOCK_SUGGESTION}?offset=0&limit=50&where={"logic":"and","filters":[{"logic":"or","filters":[{"filters":[],"logic":"or"},{"filters":[],"logic":"or"}],"currentSupplierFilters":[{"text":"${supplierFilter}","value":"${supplierFilter}"}]},{"logic":"or","filters":[{"field":"sku","operator":"contains","value":"${keyword}"},{"field":"productName","operator":"contains","value":"${keyword}"},{"field":"category","operator":"contains","value":"${keyword}"},{"field":"supplier","operator":"contains","value":"${keyword}"},{"field":"supplierSku","operator":"contains","value":"${keyword}"},{"field":"asin","operator":"contains","value":"${keyword}"}]},{"logic":"and","filters":[]},{"logic":"and","filters":[{"field":"status","operator":"neq","value":"IGNORE"}]},{"logic":"and","filters":[{"field":"status","operator":"neq","value":"INACTIVE"}]}]}`);
});

Then(`User sets GET api method to get all items in Item List by filter function with flag, status:`, async function (dataTable: DataTable) {
    const { supplierFilter, flag, status, logic } = dataTable.hashes()[0];
    this.flag = flag
    this.status = status
    link = encodeURI(`${Links.API_GET_RESTOCK_SUGGESTION}?offset=0&limit=50&where={"logic":"and","filters":[{"logic":"${logic}","filters":[{"filters":[{"field":"flag", "operator":"eq", "value":"${flag}"}],"logic":"or"},{"filters":[{"field":"status", "operator":"eq", "value":"${status}"}],"logic":"or"}],"currentSupplierFilters":[{"text":"${supplierFilter}","value":"${supplierFilter}"}]},{"logic":"and","filters":[]}]}`);
});

Then(`User sends a GET api method to get all items in Item List`, async function () {
    const options = {
        headers: this.headers
    }
    this.restockSuggestionResponse = this.response = await restockSuggestion.getRestockSuggestion(this.request, link, options);
    const responseBodyText = await this.restockSuggestionResponse.text();
    if (this.restockSuggestionResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.restockSuggestionResponseBody = JSON.parse(await this.restockSuggestionResponse.text());
        this.responseOfAItem = await this.restockSuggestionResponseBody[Math.floor(Math.random() * this.restockSuggestionResponseBody.length)];
        logger.log('info', `Response GET ${link}: ` + JSON.stringify(this.restockSuggestionResponseBody, undefined, 4));
        this.attach(`Response GET ${link}: ` + JSON.stringify(this.restockSuggestionResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.restockSuggestionResponse.status()} ${this.restockSuggestionResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.restockSuggestionResponse.status()} ${this.restockSuggestionResponse.statusText()} and response body ${actualResponseText}`)
    }
});

Then(`User checks the system display the correct item list with keyword`, async function () {
    this.restockSuggestionResponseBody.forEach((item: any) => {
        this.attach(`keyword:` + this.keyword)
        this.attach(`sku:` + item.sku)
        this.attach(`productName:` + item.productName)
        this.attach(`category:` + item.category)
        this.attach(`supplier:` + item.supplier)
        this.attach(`supplierSku:` + item.supplierSku)
        this.attach(`asin:` + item.asin)
        this.attach(`---------`)
        expect(item.sku?.toLowerCase().includes(this.keyword.toLowerCase()) || item.productName?.toLowerCase().includes(this.keyword.toLowerCase()) || item.category?.toLowerCase().includes(this.keyword.toLowerCase()) || item.supplier?.toLowerCase().includes(this.keyword.toLowerCase()) || item.supplierSku?.toLowerCase().includes(this.keyword.toLowerCase()) || item.asin?.toLowerCase().includes(this.keyword.toLowerCase())).toBeTruthy()
    });
})

Then(`User checks the system display the correct item list by filter function with flag {} status`, async function (logic: string) {
    this.restockSuggestionResponseBody.forEach((item: any) => {
        this.attach(`Item name:` + item.forecastconstant.itemName)
        this.attach(`flag:` + item.flag)
        this.attach(`status:` + item.status)
        this.attach(`---------`)
        if (logic == 'and') {
            expect(item.flag === this.flag && item.status === this.status).toBeTruthy()
        } else if (logic == 'or') {
            expect(item.flag === this.flag || item.status === this.status).toBeTruthy()
        }
    });
})

Then(`User sets PUT api method to edit item in Item List as following data:`, function(dataTable: DataTable) {
    this.linkEditItemInItemList = `${Links.API_GET_RESTOCK_SUGGESTION}/${this.itemKey}/restockAMZ`

    const {status} = dataTable.hashes()[0]
    this.status = status
    this.payloadEditItemInItemList = this.responseOfAItem
    this.payloadEditItemInItemList.status = status
})

Then('User sends a PUT request to edit item in Item List', async function () {
    // Send PUT request
    this.response = await restockSuggestion.editItemInItemList(this.request, this.linkEditItemInItemList, this.payloadEditItemInItemList, this.headers)
    if (this.response.status() == 200) {
        this.responseOfAItem = this.editItemInItemListResponseBody = JSON.parse(await this.response.text());
        logger.log('info', `Edit Item Response edit ${this.linkEditItemInItemList} has status code ${this.response.status()} ${this.response.statusText()} and editItemResponse body ${JSON.stringify(this.editItemInItemListResponseBody, undefined, 4)}`)
        this.attach(`Edit Item Response edit ${this.linkEditItemInItemList} has status code ${this.response.status()} ${this.response.statusText()} and editItemResponse body ${JSON.stringify(this.editItemInItemListResponseBody, undefined, 4)}`)
    } else {
        logger.log('info', `Edit Item Response edit ${this.linkEditItemInItemList} has status code ${this.response.status()} ${this.response.statusText()}`)
        this.attach(`Edit Item Response edit ${this.linkEditItemInItemList} has status code ${this.response.status()} ${this.response.statusText()}`)
    }
});

Then(`User checks just edited item must be found in item list`, function () {
    expect(this.restockSuggestionResponseBody.length).toBeGreaterThan(0)
    this.itemKey = this.responseOfAItem.forecastconstant.itemKey;
    const item = this.restockSuggestionResponseBody.find((item: any) => item.forecastconstant.itemKey = this.itemKey)
    expect(item).not.toBe(undefined)
    expect(item.status).toEqual(this.status)
})

Then('{} checks API contract of edit item in Item list', async function (actor: string) {
    editItemInItemListSchema.parse(this.responseOfAItem);
});
When(`{} sets GET endpoint api to count all item in {}`, async function (actor, section: string) {
    countAllItemInItemListLink = encodeURI(`${Links.API_RESTOCK_SUGGESTION_COUNT}`)
})

When(`{} sends GET endpoint api to count all item in {}`, async function (actor, section: string) {
    // this.supplierNameFilter = this.allSuppliersInSupplierList[Math.floor(Math.random()*this.allSuppliersInSupplierList.length)];
    this.supplierNameFilter = "[All Suppliers]";
    console.log("Supplier Name that just picked: ", this.supplierNameFilter);
    this.countAllItemInItemListResponse = this.response = await restockSuggestion.countAllItemsInItemList(this.request, countAllItemInItemListLink, this.supplierNameFilter, this.headers);
    const responseBodyText = await this.countAllItemInItemListResponse.text();
    if (this.countAllItemInItemListResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.countAllItemInItemListResponseBody = JSON.parse(await this.countAllItemInItemListResponse.text());
        this.responseOfAItem = await this.countAllItemInItemListResponseBody[Math.floor(Math.random() * this.countAllItemInItemListResponseBody.length)];
        this.countItem = this.countAllItemInItemListResponseBody;
        this.attach(`Count Items in Restock from Suggestion > Item List: ${this.countItem}`)
        logger.log('info', `Response GET count item in Item List: ${countAllItemInItemListLink}: ` + JSON.stringify(this.countAllItemInItemListResponseBody, undefined, 4));
        this.attach(`Response GET count item in Item List: ${countAllItemInItemListLink}: ` + JSON.stringify(this.countAllItemInItemListResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response count item in Item List: ${countAllItemInItemListLink} has status code ${this.countAllItemInItemListResponse.status()} ${this.countAllItemInItemListResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response count item in Item List: ${countAllItemInItemListLink} has status code ${this.countAllItemInItemListResponse.status()} ${this.countAllItemInItemListResponse.statusText()} and response body ${actualResponseText}`)
    }
    return this.supplierNameFilter;
})

When(`{} sets GET endpoint API to get list SKUs with limit row: {}`, async function (actor, limitRow: number) {
    getItemListLink = encodeURI(`${Links.API_GET_RESTOCK_SUGGESTION}`);
    this.limitRow = limitRow;
})

When(`{} sends GET endpoint API to get list SKUs`, async function (actor) {
    console.log("Supplier Name that just picked to get item list: ", this.supplierNameFilter);
    this.getItemListResponse = this.response = await restockSuggestion.getItemListInItemList(this.request, getItemListLink, this.supplierNameFilter, this.headers, this.limitRow);
    const responseBodyText = await this.getItemListResponse.text();
    if (this.getItemListResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.getItemListResponseBody = JSON.parse(await this.getItemListResponse.text());
        this.responseOfAItem = await this.getItemListResponseBody[Math.floor(Math.random() * this.getItemListResponseBody.length)];
        logger.log('info', `Response GET list items ${getItemListLink}: ` + JSON.stringify(this.getItemListResponseBody, undefined, 4));
        this.attach(`Response GET list items ${getItemListLink}: ` + JSON.stringify(this.getItemListResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response list items ${getItemListLink} has status code ${this.getItemListResponse.status()} ${this.getItemListResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response list items ${getItemListLink} has status code ${this.getItemListResponse.status()} ${this.countAllItemInItemListResponse.statusText()} and response body ${actualResponseText}`)
    }
})

Then('{} picks {} random SKU in above list items', async function (actor: string, quantity) {
    console.log("Here: ", this.getItemListResponseBody);
    this.itemsPickedRandomArray =  itemRequest.getMultipleRandom(this.getItemListResponseBody, quantity);
    console.log("IteminItemListPickedRandomArray: ", this.itemsPickedRandomArray);
    return this.itemsPickedRandomArray;
})
