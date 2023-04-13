import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import logger from '../../../../src/Logger/logger';
import { Links } from '../../../../src/utils/links';
import _ from "lodash";
import * as restockSuggestion from '../../../../src/api/request/restockSuggestion.service';
import { sumFormulaRestockAMZ, totalInboundFormulaRestockAMZ, estimatedMarginFormulaRestockAMZ, dailySalesRateFormulaRestockAMZ, adjDailySalesRateFormulaRestockAMZ, averageDailySalesRateFormulaRestockAMZ, requiredInventoryFormulaRestockAMZ, inventoryAvailableFormulaRestockAMZ, recommendationsFormulaRestockAMZ, suggestionsFormulaRestockAMZ } from '../../../../src/helpers/calculation-helper';
import { itemInfoResponseSchema } from '../assertion/dashboard/itemAssertionSchema';

let link: any;

Then(`{} sends a GET api method to count all Items have alerts in {}`, async function (actor, optionListSupplier: string) {
    const options = {
        headers: this.headers
    }
    let link = encodeURI(`${Links.API_GET_RESTOCK_SUGGESTION}/count?where={"logic":"and","filters":[{"logic":"or","filters":[{"filters":[{"field":"flag","operator":"eq","value":"RED"},{"field":"flag","operator":"eq","value":"YELLOW"},{"field":"flag","operator":"eq","value":"ORANGE"},{"field":"flag","operator":"eq","value":"TEAL"},{"field":"flag","operator":"eq","value":"GREEN"}],"logic":"or"},{"filters":[],"logic":"or"}],"currentSupplierFilters":[{"text":"[${optionListSupplier}]","value":"[${optionListSupplier}]"}]},{"logic":"and","filters":[]},{"logic":"and","filters":[{"field":"status","operator":"neq","value":"IGNORE"}]},{"logic":"and","filters":[{"field":"status","operator":"neq","value":"INACTIVE"}]}]}`);
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
    link = encodeURI(`${Links.API_GET_RESTOCK_SUGGESTION}?offset=0&limit=5&sort=[{"field":"recommendedSupplierQty","direction":"${direction}"}]&where={"logic":"and","filters":[{"logic":"or","filters":[{"filters":[{"field":"flag","operator":"eq","value":"RED"},{"field":"flag","operator":"eq","value":"YELLOW"},{"field":"flag","operator":"eq","value":"ORANGE"},{"field":"flag","operator":"eq","value":"TEAL"},{"field":"flag","operator":"eq","value":"GREEN"}],"logic":"or"},{"filters":[],"logic":"or"}],"currentSupplierFilters":[{"text":"[${supplierOption}]","value":"[${supplierOption}]"}]},{"logic":"and","filters":[]},{"logic":"and","filters":[{"field":"status","operator":"neq","value":"IGNORE"}]},{"logic":"and","filters":[{"field":"status","operator":"neq","value":"INACTIVE"}]}]}`);
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
    itemInfoResponseSchema.parse(this.responseOfAItem);
});

Then('{} picks random item in Item list', async function (actor: string) {
    this.responseOfAItem = await this.restockSuggestionResponseBody[Math.floor(Math.random() * this.restockSuggestionResponseBody.length)];
    this.itemKey = this.responseOfAItem.forecastconstant.itemKey;

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

Then(`{} sets GET api method to get restock calculation of specific Item`, async function (actor: string) {
    link = `${Links.API_GET_RESTOCK_SUGGESTION}/${this.itemKey}/restockAMZ`;
});

Then(`{} sends a GET api method to get restock calculation of specific Item`, async function (actor: string) {
    const options = {
        headers: this.headers
    }
    this.restockCalculationResponse = this.response = await restockSuggestion.getRestockSuggestion(this.request, link, options);
    const responseBodyText = await this.restockCalculationResponse.text();
    if (this.restockCalculationResponse.status() == 200 && !responseBodyText.includes('<!doctype html>')) {
        this.restockCalculationResponseBody = JSON.parse(await this.restockCalculationResponse.text());
        logger.log('info', `Response GET ${link}: ` + JSON.stringify(this.restockCalculationResponseBody, undefined, 4));
        this.attach(`Response GET ${link}: ` + JSON.stringify(this.restockCalculationResponseBody, undefined, 4))
    }
    else {
        const actualResponseText = responseBodyText.includes('<!doctype html>') ? 'html' : responseBodyText;
        logger.log('info', `Response ${link} has status code ${this.restockCalculationResponse.status()} ${this.restockCalculationResponse.statusText()} and response body ${responseBodyText}`);
        this.attach(`Response ${link} has status code ${this.restockCalculationResponse.status()} ${this.restockCalculationResponse.statusText()} and response body ${actualResponseText}`)
    }
});

Then('{} saves values in Restock model for calculations', async function (actor: string) {
    // Data Sales
    this.s2d = this.restockCalculationResponseBody.s2d;
    this.s7d = this.restockCalculationResponseBody.s7d;
    this.s14d = this.restockCalculationResponseBody.s14d;
    this.s30d = this.restockCalculationResponseBody.s30d;
    this.s60d = this.restockCalculationResponseBody.s60d;
    this.s90d = this.restockCalculationResponseBody.s90d;
    this.s180d = this.restockCalculationResponseBody.s180d;

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
    itemInfoResponseSchema.parse(this.restockCalculationResponseBody);
});