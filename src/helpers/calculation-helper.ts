import { expect } from '@playwright/test';
import logger from '../Logger/logger';
import _ from "lodash";
import { ICreateAttachment } from '@cucumber/cucumber/lib/runtime/attachment_manager';

// Parse number
function parseNumber(number: number) {
    if (!number) {
        return 0;
    };
    return !isNaN(number) ? Number(number) : 0;
};

// Rounding 2 decimals
function roundFloatNumber(number: number) {
    return Math.round((parseNumber(number) + Number.EPSILON) * 100) / 100;
};

// Refer the mind map here: https://whimsical.com/restockamz-beta-restock-from-supplier-2y8q1eQFoikbzF7VcaqvYo
function sumFormulaRestockAMZ(onhand: number, inbound: number, fcTransfer: number, sum: number, attach: ICreateAttachment) {
    let expectedSum = onhand + inbound + fcTransfer;
    expect(sum, `In response body, the expected Sum should be: ${expectedSum}`).toBe(expectedSum);
    logger.log('info', `Sum: Actual: ${sum} and Expected: ${expectedSum}`);
    attach(`Sum: Actual: ${sum} and Expected: ${expectedSum}`);
};

function totalInboundFormulaRestockAMZ(inboundWorking: number, inboundShipped: number, inboundReceiving: number, inboundTotal: number, attach: ICreateAttachment) {
    let expectedTotalInbound = inboundWorking + inboundShipped + inboundReceiving;
    expect(inboundTotal, `In response body, the expected totalInbound should be: ${expectedTotalInbound}`).toBe(expectedTotalInbound);
    logger.log('info', `Total Inbound: Actual: ${inboundTotal} and Expected: ${expectedTotalInbound}`);
    attach(`Total Inbound: Actual: ${inboundTotal} and Expected: ${expectedTotalInbound}`);
};

function estimatedMarginFormulaRestockAMZ(price: number, totalCost: number, totalAmazonFees: number, estimatedMargin: number, estimatedMarginPercentage: number, estimatedMarkupPercentage: number, attach: ICreateAttachment) {
    // EstimatedMargin = price - totalCost - totalAmazonFees
    let expectedEstimatedMargin = roundFloatNumber(price - totalCost - totalAmazonFees);
    expect(estimatedMargin, `In response body, the expected estimatedMargin should be: ${expectedEstimatedMargin}`).toBe(expectedEstimatedMargin);
    logger.log('info', `Estimated Margin: Actual: ${estimatedMargin} and Expected: ${expectedEstimatedMargin}`);
    attach(`Estimated Margin: Actual: ${estimatedMargin} and Expected: ${expectedEstimatedMargin}`);

    // EstimatedMarginPercentage = estimatedMargin / price * 100
    if (price === 0) {
        let expectedEstimatedMarginPercentage = 0
        expect(estimatedMarginPercentage, `In response body, the expected estimatedMarginPercentage should be: ${expectedEstimatedMarginPercentage}`).toBe(expectedEstimatedMarginPercentage);
        logger.log('info', `Estimated Margin Percentage: Actual: ${estimatedMarginPercentage} and Expected: ${expectedEstimatedMarginPercentage}`);
        attach(`Estimated Margin Percentage: Actual: ${estimatedMarginPercentage} and Expected: ${expectedEstimatedMarginPercentage}`);
    }
    else {
        let expectedEstimatedMarginPercentage = roundFloatNumber((estimatedMargin / price) * 100);
        expect(estimatedMarginPercentage, `In response body, the expected estimatedMarginPercentage should be: ${expectedEstimatedMarginPercentage}`).toBe(expectedEstimatedMarginPercentage);
        logger.log('info', `Estimated Margin Percentage: Actual: ${estimatedMarginPercentage} and Expected: ${expectedEstimatedMarginPercentage}`);
        attach(`Estimated Margin Percentage: Actual: ${estimatedMarginPercentage} and Expected: ${expectedEstimatedMarginPercentage}`);
    }

    // estimatedMarkupPercentage = EstimatedMarkup / TotalCost * 100
    if (totalCost === 0) {
        let expectedEstimatedMarkupPercentage = 0;
        expect(estimatedMarkupPercentage, `In response body, the expected estimatedMarkupPercentage should be: ${expectedEstimatedMarkupPercentage}`).toBe(expectedEstimatedMarkupPercentage);
        logger.log('info', `Estimated Markup Percentage: Actual: ${estimatedMarkupPercentage} and Expected: ${expectedEstimatedMarkupPercentage}`);
        attach(`Estimated Markup Percentage: Actual: ${estimatedMarkupPercentage} and Expected: ${expectedEstimatedMarkupPercentage}`);
    }
    else {
        let expectedEstimatedMarkupPercentage = Math.round(estimatedMargin / totalCost * 100);
        expect(estimatedMarkupPercentage, `In response body, the expected estimatedMarkupPercentage should be: ${expectedEstimatedMarkupPercentage}`).toBe(expectedEstimatedMarkupPercentage);
        logger.log('info', `Estimated Markup Percentage: Actual: ${estimatedMarkupPercentage} and Expected: ${expectedEstimatedMarkupPercentage}`);
        attach(`Estimated Markup Percentage: Actual: ${estimatedMarkupPercentage} and Expected: ${expectedEstimatedMarkupPercentage}`);
    };
};

interface Input {
    s2d?: number, s7d?: number, s14d?: number, s30d?: number, s60d?: number, s90d?: number, s180d?: number, sv2d?: number, sv7d?: number, sv14d?: number, sv30d?: number, sv60d?: number, sv90d?: number, sv180d?: number, svDemand?: number, percent2Day?: number, percent7Day?: number, percent14Day?: number, percent30Day?: number, percent60Day?: number, percent90Day?: number, percent180Day?: number, percentForecasted?: number, outOfStock2d?: number, outOfStock7d?: number, outOfStock14d?: number, outOfStock30d?: number, outOfStock60d?: number, outOfStock90d?: number, outOfStock180d?: number, adjSv2d?: number, adjSv7d?: number, adjSv14d?: number, adjSv30d?: number, adjSv60d?: number, adjSv90d?: number, adjSv180d?: number, demand?: number, unitsRequired?: number, qtySupplierLeadTime?: number, qtyToLocalLeadTime?: number, targetQtyOnHand?: number, warehouseLeadTime?: number, targetMaxDays?: number, supplierLeadTime?: number, currentAmazonInventory?: number, amazonInventoryDays?: number, warehouseQty?: number, onOrder?: number, localInventoryDays?: number, onOrderDays?: number, remaining?: number, recommendedWarehouseQty?: number, recommendedSupplierQty?: number, unitsAvailable?: number, unitsOnPO?: number, suggShip?: number, suggReorder?: number, restockNeeded?: number, onHand?: number, sum?: number
};

function averageDailySalesRateFormulaRestockAMZ(input: Input, attach: ICreateAttachment) {
    const { adjSv2d, adjSv7d, adjSv14d, adjSv30d, adjSv60d, adjSv90d, adjSv180d, svDemand, percent2Day, percent7Day, percent14Day, percent30Day, percent60Day, percent90Day, percent180Day, percentForecasted, demand } = input;

    // Weighted (units/day) = Daily Sales Rate * Weight (Settings)
    let weighted2d = roundFloatNumber((adjSv2d || 0) * (percent2Day || 0) / 100);
    let weighted7d = roundFloatNumber((adjSv7d || 0) * (percent7Day || 0) / 100);
    let weighted14d = roundFloatNumber((adjSv14d || 0) * (percent14Day || 0) / 100);
    let weighted30d = roundFloatNumber((adjSv30d || 0) * (percent30Day || 0) / 100);
    let weighted60d = roundFloatNumber((adjSv60d || 0) * (percent60Day || 0) / 100);
    let weighted90d = roundFloatNumber((adjSv90d || 0) * (percent90Day || 0) / 100);
    let weighted180d = roundFloatNumber((adjSv180d || 0) * (percent180Day || 0) / 100);
    let weightedForecast = roundFloatNumber((svDemand || 0) * (percentForecasted || 0) / 100);
    let expectedWeighted = roundFloatNumber(weighted2d + weighted7d + weighted14d + weighted30d + weighted60d + weighted90d + weighted180d + weightedForecast);
    expect(demand, `In response body, the expected Units/day should be: ${expectedWeighted}`).toBe(expectedWeighted);
    logger.log('info', `Weighted (units/day): Actual: ${demand} and Expected: ${expectedWeighted}`);
    attach(`Weighted (units/day): Actual: ${demand} and Expected: ${expectedWeighted}`);
};

function adjDailySalesRateFormulaRestockAMZ(input: Input, attach: ICreateAttachment) {
    const { adjSv2d, adjSv7d, adjSv14d, adjSv30d, adjSv60d, adjSv90d, adjSv180d, outOfStock2d, outOfStock7d, outOfStock14d, outOfStock30d, outOfStock60d, outOfStock90d, outOfStock180d, s2d, s7d, s14d, s30d, s60d, s90d, s180d } = input;

    // AdjV = Total Sale / in-stock days
    let expectedAdj2d = roundFloatNumber((s2d || 0) / (2 - (outOfStock2d || 0)));
    expect(adjSv2d, `In response body, the expected Adjusted Daily Sales Rate for 2-day should be: ${expectedAdj2d}`).toBe(expectedAdj2d);
    logger.log('info', `Adj2d: Actual: ${adjSv2d} and Expected: ${expectedAdj2d}`);
    attach(`Adj2d: Actual: ${adjSv2d} and Expected: ${expectedAdj2d}`);

    let expectedAdj7d = roundFloatNumber((s7d || 0) / (7 - (outOfStock7d || 0)));
    expect(adjSv7d, `In response body, the expected Adjusted Daily Sales Rate for 7-day should be: ${expectedAdj7d}`).toBe(expectedAdj7d);
    logger.log('info', `Adj7d: Actual: ${adjSv7d} and Expected: ${expectedAdj7d}`);
    attach(`Adj7d: Actual: ${adjSv7d} and Expected: ${expectedAdj7d}`);

    let expectedAdj14d = roundFloatNumber((s14d || 0) / (14 - (outOfStock14d || 0)));
    expect(adjSv14d, `In response body, the expected Adjusted Daily Sales Rate for 14-day should be: ${expectedAdj14d}`).toBe(expectedAdj14d);
    logger.log('info', `Adj14d: Actual: ${adjSv14d} and Expected: ${expectedAdj14d}`);
    attach(`Adj14d: Actual: ${adjSv14d} and Expected: ${expectedAdj14d}`);

    let expectedAdj30d = roundFloatNumber((s30d || 0) / (30 - (outOfStock30d || 0)));
    expect(adjSv30d, `In response body, the expected Adjusted Daily Sales Rate for 30-day should be: ${expectedAdj30d}`).toBe(expectedAdj30d);
    logger.log('info', `Adj30d: Actual: ${adjSv30d} and Expected: ${expectedAdj30d}`);
    attach(`Adj30d: Actual: ${adjSv30d} and Expected: ${expectedAdj30d}`);

    let expectedAdj60d = roundFloatNumber((s60d || 0) / (60 - (outOfStock60d || 0)));
    expect(adjSv60d, `In response body, the expected Adjusted Daily Sales Rate for 60-day should be: ${expectedAdj60d}`).toBe(expectedAdj60d);
    logger.log('info', `Adj60d: Actual: ${adjSv60d} and Expected: ${expectedAdj60d}`);
    attach(`Adj60d: Actual: ${adjSv60d} and Expected: ${expectedAdj60d}`);

    let expectedAdj90d = roundFloatNumber((s90d || 0) / (90 - (outOfStock90d || 0)));
    expect(adjSv90d, `In response body, the expected Adjusted Daily Sales Rate for 90-day should be: ${expectedAdj90d}`).toBe(expectedAdj90d);
    logger.log('info', `Adj90d: Actual: ${adjSv90d} and Expected: ${expectedAdj90d}`);
    attach(`Adj90d: Actual: ${adjSv90d} and Expected: ${expectedAdj90d}`);

    let expectedAdj180d = roundFloatNumber((s180d || 0) / (180 - (outOfStock180d || 0)));
    expect(adjSv180d, `In response body, the expected Adjusted Daily Sales Rate for 180-day should be: ${expectedAdj180d}`).toBe(expectedAdj180d);
    logger.log('info', `Adj180d: Actual: ${adjSv180d} and Expected: ${expectedAdj180d}`);
    attach(`Adj180d: Actual: ${adjSv180d} and Expected: ${expectedAdj180d}`);
};

function dailySalesRateFormulaRestockAMZ(input: Input, attach: ICreateAttachment) {
    const { s2d, s7d, s14d, s30d, s60d, s90d, s180d, sv2d, sv7d, sv14d, sv30d, sv60d, sv90d, sv180d } = input;

    // Daily Sales Rate = Data Sales / The corresponding number of days
    let expectedSv2d = roundFloatNumber((s2d || 0) / 2);
    expect(sv2d, `In response body, the expected Daily Sales Rate for 2-day should be: ${expectedSv2d}`).toBe(expectedSv2d);
    logger.log('info', `Daily Sales Rate 2-D: Actual: ${sv2d} and Expected: ${expectedSv2d}`);
    attach(`Daily Sales Rate 2-D: Actual: ${sv2d} and Expected: ${expectedSv2d}`);

    let expectedSv7d = roundFloatNumber((s7d || 0) / 7);
    expect(sv7d, `In response body, the expected Daily Sales Rate for 7-day should be: ${expectedSv7d}`).toBe(expectedSv7d);
    logger.log('info', `Daily Sales Rate 7-D: Actual: ${sv7d} and Expected: ${expectedSv7d}`);
    attach(`Daily Sales Rate 7-D: Actual: ${sv7d} and Expected: ${expectedSv7d}`);

    let expectedSv14d = roundFloatNumber((s14d || 0) / 14);
    expect(sv14d, `In response body, the expected Daily Sales Rate for 14-day should be: ${expectedSv14d}`).toBe(expectedSv14d);
    logger.log('info', `Daily Sales Rate 14-D: Actual: ${sv14d} and Expected: ${expectedSv14d}`);
    attach(`Daily Sales Rate 14-D: Actual: ${sv14d} and Expected: ${expectedSv14d}`);

    let expectedSv30d = roundFloatNumber((s30d || 0) / 30);
    expect(sv30d, `In response body, the expected Daily Sales Rate for 30-day should be: ${expectedSv30d}`).toBe(expectedSv30d);
    logger.log('info', `Daily Sales Rate 30-D: Actual: ${sv30d} and Expected: ${expectedSv30d}`);
    attach(`Daily Sales Rate 30-D: Actual: ${sv30d} and Expected: ${expectedSv30d}`);

    let expectedSv60d = roundFloatNumber((s60d || 0) / 60);
    expect(sv60d, `In response body, the expected Daily Sales Rate for 60-day should be: ${expectedSv60d}`).toBe(expectedSv60d);
    logger.log('info', `Daily Sales Rate 60-D: Actual: ${sv60d} and Expected: ${expectedSv60d}`);
    attach(`Daily Sales Rate 60-D: Actual: ${sv60d} and Expected: ${expectedSv60d}`);

    let expectedSv90d = roundFloatNumber((s90d || 0) / 90);
    expect(sv90d, `In response body, the expected Daily Sales Rate for 90-day should be: ${expectedSv90d}`).toBe(expectedSv90d);
    logger.log('info', `Daily Sales Rate 90-D: Actual: ${sv90d} and Expected: ${expectedSv90d}`);
    attach(`Daily Sales Rate 90-D: Actual: ${sv90d} and Expected: ${expectedSv90d}`);

    let expectedSv180d = roundFloatNumber((s180d || 0) / 180);
    expect(sv180d, `In response body, the expected Daily Sales Rate for 180-day should be: ${expectedSv180d}`).toBe(expectedSv180d);
    logger.log('info', `Daily Sales Rate 180-D: Actual: ${sv180d} and Expected: ${expectedSv180d}`);
    attach(`Daily Sales Rate 180-D: Actual: ${sv180d} and Expected: ${expectedSv180d}`);
};

function requiredInventoryFormulaRestockAMZ(input: Input, attach: ICreateAttachment) {
    const { demand, targetMaxDays, warehouseLeadTime, targetQtyOnHand, qtySupplierLeadTime, qtyToLocalLeadTime, supplierLeadTime } = input;

    // Ideal FBA Inventory (units) = Ideal FBA Inventory (days) * Average Daily Sales Rate
    let expectedTargetQtyOnHand = roundFloatNumber((targetMaxDays || 0) * (demand || 0));
    expect(targetQtyOnHand, `In response body, the expected Target Qty on Hand should be: ${expectedTargetQtyOnHand}`).toBe(expectedTargetQtyOnHand);
    logger.log('info', `Target Qty on Hand: Actual: ${targetQtyOnHand} and Expected: ${expectedTargetQtyOnHand}`);
    attach(`Target Qty on Hand: Actual: ${targetQtyOnHand} and Expected: ${expectedTargetQtyOnHand}`);

    // Warehouse Lead Time (units) = Warehouse Lead Time (days) * Average Daily Sales Rate
    let expectedQtyToLocalLeadTime = roundFloatNumber((warehouseLeadTime || 0) * (demand || 0));
    expect(qtyToLocalLeadTime, `In response body, the expected Qty to Warehouse Lead Time should be: ${expectedQtyToLocalLeadTime}`).toBe(expectedQtyToLocalLeadTime);
    logger.log('info', `Qty to Warehouse Lead Time: Actual: ${qtyToLocalLeadTime} and Expected: ${expectedQtyToLocalLeadTime}`);
    attach(`Qty to Warehouse Lead Time: Actual: ${qtyToLocalLeadTime} and Expected: ${expectedQtyToLocalLeadTime}`);

    // Supplier Lead Time (units) = Supplier Lead Time (days) * Average Daily Sales Rate
    let expectedQtySupplierLeadTime = roundFloatNumber((supplierLeadTime || 0) * (demand || 0));
    expect(qtySupplierLeadTime, `In response body, the expected Qty Supplier Lead Time should be: ${expectedQtySupplierLeadTime}`).toBe(expectedQtySupplierLeadTime);
    logger.log('info', `Qty Supplier Lead Time: Actual: ${qtySupplierLeadTime} and Expected: ${expectedQtySupplierLeadTime}`);
    attach(`Qty Supplier Lead Time: Actual: ${qtySupplierLeadTime} and Expected: ${expectedQtySupplierLeadTime}`);
};

function inventoryAvailableFormulaRestockAMZ(input: Input, attach: ICreateAttachment) {
    const { demand, currentAmazonInventory, amazonInventoryDays, warehouseQty, onOrder, onOrderDays, localInventoryDays, remaining } = input;

    // Current Amazon Inventory = Local Inventory Days / Average Daily Sales Rate
    if (demand === 0) {
        let expectedCurrentAmazonInventory = 0;
        expect(amazonInventoryDays, `In response body, the expected Current Amazon Inventory should be: ${expectedCurrentAmazonInventory}`).toBe(expectedCurrentAmazonInventory);
        logger.log('info', `Current Amazon Inventory: Actual: ${amazonInventoryDays} and Expected: ${expectedCurrentAmazonInventory}`);
        attach(`Current Amazon Inventory: Actual: ${amazonInventoryDays} and Expected: ${expectedCurrentAmazonInventory}`);
    }
    else {
        let expectedCurrentAmazonInventory = roundFloatNumber((currentAmazonInventory || 0) / (demand || 0));
        expect(amazonInventoryDays, `In response body, the expected Current Amazon Inventory should be: ${expectedCurrentAmazonInventory}`).toBe(expectedCurrentAmazonInventory);
        logger.log('info', `Current Amazon Inventory: Actual: ${amazonInventoryDays} and Expected: ${expectedCurrentAmazonInventory}`);
        attach(`Current Amazon Inventory: Actual: ${amazonInventoryDays} and Expected: ${expectedCurrentAmazonInventory}`);
    }

    // Current Warehouse Qty = Warehouse Qty Days / Average Daily Sales Rate
    if (demand === 0) {
        let expectedCurrentWarehouseQty = 0;
        expect(localInventoryDays, `In response body, the expected Current Warehouse Qty should be: ${expectedCurrentWarehouseQty}`).toBe(expectedCurrentWarehouseQty);
        logger.log('info', `Current Warehouse Qty: Actual: ${localInventoryDays} and Expected: ${expectedCurrentWarehouseQty}`);
        attach(`Current Warehouse Qty: Actual: ${localInventoryDays} and Expected: ${expectedCurrentWarehouseQty}`);
    }
    else {
        let expectedCurrentWarehouseQty = roundFloatNumber((warehouseQty || 0) / (demand || 0));
        expect(localInventoryDays, `In response body, the expected Current Warehouse Qty should be: ${expectedCurrentWarehouseQty}`).toBe(expectedCurrentWarehouseQty);
        logger.log('info', `Current Warehouse Qty: Actual: ${localInventoryDays} and Expected: ${expectedCurrentWarehouseQty}`);
        attach(`Current Warehouse Qty: Actual: ${localInventoryDays} and Expected: ${expectedCurrentWarehouseQty}`);
    }

    // Current On Order = On Order Days / Average Daily Sales Rate
    if (demand === 0) {
        let expectedCurrentOnOrder = 0;
        expect(onOrderDays, `In response body, the expected Current On Order should be: ${expectedCurrentOnOrder}`).toBe(expectedCurrentOnOrder);
        logger.log('info', `Current On Order: Actual: ${onOrderDays} and Expected: ${expectedCurrentOnOrder}`);
        attach(`Current On Order: Actual: ${onOrderDays} and Expected: ${expectedCurrentOnOrder}`);
    }
    else {
        let expectedCurrentOnOrder = roundFloatNumber((onOrder || 0) / (demand || 0));
        expect(onOrderDays, `In response body, the expected Current On Order should be: ${expectedCurrentOnOrder}`).toBe(expectedCurrentOnOrder);
        logger.log('info', `Current On Order: Actual: ${onOrderDays} and Expected: ${expectedCurrentOnOrder}`);
        attach(`Current On Order: Actual: ${onOrderDays} and Expected: ${expectedCurrentOnOrder}`);
    }

    // Remaining Days at Amazon = Local Inventory Days / Average Daily Sales Rate ; if Average Daily Sales Rate = 0 => Remaining = Infinite
    if (demand === 0) {
        let expectedRemaining = 'Infinite';
        expect(remaining, `In response body, the expected Remaining Days at Amazon should be: ${expectedRemaining}`).toBe(expectedRemaining);
        logger.log('info', `Remaining Days at Amazon: Actual: ${remaining} and Expected: ${expectedRemaining}`);
        attach(`Remaining Days at Amazon: Actual: ${remaining} and Expected: ${expectedRemaining}`);
    }
    else {
        let expectedRemaining = Math.round((currentAmazonInventory || 0) / (demand || 0));
        expect(remaining, `In response body, the expected Remaining Days at Amazon should be: ${expectedRemaining}`).toBe(expectedRemaining);
        logger.log('info', `Remaining Days at Amazon: Actual: ${remaining} and Expected: ${expectedRemaining}`);
        attach(`Remaining Days at Amazon: Actual: ${remaining} and Expected: ${expectedRemaining}`);
    }
};

function recommendationsFormulaRestockAMZ(input: Input, attach: ICreateAttachment) {
    const { targetQtyOnHand, qtyToLocalLeadTime, currentAmazonInventory, unitsRequired, unitsAvailable, unitsOnPO, recommendedWarehouseQty, recommendedSupplierQty } = input;

    // Warehouse Restock Recommendation = Ideal Max Quantity at FBA + Required Inventory to cover Warehouse Lead-Time - Current Amazon On Hand
    let expectedWarehouseRecommendation = Math.ceil((targetQtyOnHand || 0) + (qtyToLocalLeadTime || 0) - (currentAmazonInventory || 0));
    expect(recommendedWarehouseQty, `In response body, the expected Warehouse Restock Recommendation should be: ${expectedWarehouseRecommendation}`).toBe(expectedWarehouseRecommendation);
    logger.log('info', `Warehouse Restock Recommendation: Actual: ${recommendedWarehouseQty} and Expected: ${expectedWarehouseRecommendation}`);
    attach(`Warehouse Restock Recommendation: Actual: ${recommendedWarehouseQty} and Expected: ${expectedWarehouseRecommendation}`);

    // Supplier Restock Recommendation = Units Required - Units Available - Units on PO
    let expectedSupplierRecommendation = Math.ceil((unitsRequired || 0) - (unitsAvailable || 0) - (unitsOnPO || 0));
    expect(recommendedSupplierQty, `In response body, the expected Supplier Restock Recommendation should be: ${expectedSupplierRecommendation}`).toBe(expectedSupplierRecommendation);
    logger.log('info', `Supplier Restock Recommendation: Actual: ${recommendedSupplierQty} and Expected: ${expectedSupplierRecommendation}`);
    attach(`Supplier Restock Recommendation: Actual: ${recommendedSupplierQty} and Expected: ${expectedSupplierRecommendation}`);

    // TO DO Forecast Recommended Qty
    // The formula of these are being calculated on UI currently
};

function suggestionsFormulaRestockAMZ(input: Input, attach: ICreateAttachment) {
    const { suggReorder, suggShip, recommendedWarehouseQty, recommendedSupplierQty, restockNeeded, targetQtyOnHand, sum } = input;

    // suggShip = Warehouse Restock Recommendation
    expect(suggShip, `In response body, the expected Sugg Ship should be: ${recommendedWarehouseQty}`).toBe(recommendedWarehouseQty);
    logger.log('info', `Sugg Ship: Actual: ${suggShip} and Expected: ${recommendedWarehouseQty}`);
    attach(`Sugg Ship: Actual: ${suggShip} and Expected: ${recommendedWarehouseQty}`);

    // suggReorder = Supplier Restock Recommendation
    expect(suggReorder, `In response body, the expected Sugg Reorder should be: ${recommendedSupplierQty}`).toBe(recommendedSupplierQty);
    logger.log('info', `Sugg Reorder: Actual: ${suggReorder} and Expected: ${recommendedSupplierQty}`);
    attach(`Sugg Reorder: Actual: ${suggReorder} and Expected: ${recommendedSupplierQty}`);

    // Restock Needed =  Ideal max quantity on hand - Sum
    let expectedRestockNeeded = Math.round((targetQtyOnHand || 0) - (sum || 0));
    expect(restockNeeded, `In response body, the expected Restock Needed should be: ${expectedRestockNeeded}`).toBe(expectedRestockNeeded);
    logger.log('info', `Restock Needed: Actual: ${restockNeeded} and Expected: ${expectedRestockNeeded}`);
    attach(`Restock Needed: Actual: ${restockNeeded} and Expected: ${expectedRestockNeeded}`);
};

export {
    sumFormulaRestockAMZ,
    totalInboundFormulaRestockAMZ,
    estimatedMarginFormulaRestockAMZ,
    parseNumber,
    roundFloatNumber,
    dailySalesRateFormulaRestockAMZ,
    averageDailySalesRateFormulaRestockAMZ,
    adjDailySalesRateFormulaRestockAMZ,
    requiredInventoryFormulaRestockAMZ,
    inventoryAvailableFormulaRestockAMZ,
    recommendationsFormulaRestockAMZ,
    suggestionsFormulaRestockAMZ
};