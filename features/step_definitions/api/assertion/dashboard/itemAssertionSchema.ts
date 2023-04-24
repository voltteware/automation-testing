import { z } from 'zod';

//Refer define schema here: https://morioh.com/p/cc9d89e8a10b
export const itemSummaryResponseSchema = z.object({
    err: z.string().nullable(),
    model: z.object({
        missingVendorCount: z.string({ invalid_type_error: "missingVendorCount must be string" }).nullable(),
        olderThan30DaysCount: z.string({ invalid_type_error: "olderThan30DaysCount must be string" }).nullable(),
        onHandCount: z.string({ invalid_type_error: "onHandCount must be string" }).nullable(),
        onHandThirdPartyCount: z.string({ invalid_type_error: "onHandThirdPartyCount must be string" }).nullable()
    })
});

// Define type of payload
// export type ItemSummaryRequest = z.infer<typeof ItemSummaryRequestSchema>;

// Can use or() method => const stringOrNumber = z.string().or(z.number());
// Combine two schemas 
/*
const Person = z.object({
    name: z.string(),
});
const Employee = z.object({
    role: z.number(),
});
const EmployedPerson = Person.merge(Employee) 
*/

export const itemRestockAMZInfoResponseSchema = z.object({
    adjSv2d: z.number(),
    adjSv7d: z.number(),
    adjSv14d: z.number(),
    adjSv30d: z.number(),
    adjSv60d: z.number(),
    adjSv90d: z.number(),
    adjSv180d: z.number(),
    alertDate: z.string(),
    amazonInventoryDays: z.number(),
    asin: z.string(),
    average7DayPrice: z.number(),
    casePackQuantity: z.number(),
    companyKey: z.string(),
    companyType: z.string(),
    hazmat: z.string().or(z.boolean()).nullable(),
    coverageAvailable: z.number(),
    coverageOrderQty: z.number(),
    coverageRequired: z.number(),
    currentAmazonInventory: z.number(),
    demand: z.number(),
    dimensionalWeight: z.number(),
    ean: z.string(),
    estimatedMargin: z.number(),
    estimatedMarginPercentage: z.number(),
    estimatedMarkupPercentage: z.number(),
    estimatedPriceType: z.string(),
    imageUrl: z.string().nullable(),
    fba: z.number(),
    fbaFee: z.number(),
    flag: z.string(),
    fnsku: z.string(),
    forecastRecommendedQty: z.number(),
    forecastconstant: z.object({
        asin: z.string(),
        companyKey: z.string(),
        companyType: z.string(),
        description: z.string().nullable(),
        fnsku: z.string(),
        inbound: z.number(),
        inboundAlert: z.string().nullable(),
        inboundAvailable: z.number(),
        inboundCustomerOrder: z.number(),
        inboundFcProcessing: z.number(),
        inboundFcTransfer: z.number(),
        inboundPrice: z.number(),
        inboundSalesLast30Days: z.number(),
        inboundUnfulfillable: z.number(),
        inboundWorking: z.number(),
        isFbm: z.boolean(),
        itemKey: z.string(),
        itemName: z.string().nullable(),
        leadTime: z.number(),
        lotMultipleItemKey: z.string().nullable(),
        lotMultipleItemName: z.string().nullable(),
        lotMultipleQty: z.number(),
        moq: z.number(),
        mwsFulfillmentFee: z.number(),
        onHand: z.number(),
        onHandFbm: z.number(),
        onHandMin: z.number(),
        onHandThirdParty: z.number(),
        onHandThirdPartyMin: z.number(),
        openPurchaseOrders: z.number(),
        openSalesOrders: z.number(),
        orderInterval: z.number(),
        tags: z.array(z.string().nullable()), /* z.string().optional().array(); => (string | undefined)[]  or z.string().array().optional(); => string[] | undefined */
        type: z.string(),
        useBackfill: z.boolean(),
        useHistoryOverride: z.boolean(),
        useLostSalesOverride: z.boolean(),
        vendorKey: z.string().nullable(),
        vendorName: z.string().nullable(),
        vendorPrice: z.number(),
    }),
    inbound: z.number(),
    inboundFcTransfer: z.number(),
    inboundReceiving: z.number(),
    inboundShipped: z.number(),
    inboundShippingCost: z.number(),
    inboundWorking: z.number(),
    inboundTotal: z.number(),
    key: z.string(),
    leadTime: z.number(),
    listPrice: z.number(),
    localInventoryDays: z.number(),
    localLeadTimeDays: z.number(),
    localQty: z.number(),
    lowestFba: z.number(),
    lowestNonFba: z.number(),
    maximumShipmentQty: z.number(),
    monthlyStorageFee: z.number().nullable(),
    moq: z.number().nullable(),
    newBuyBox: z.number(),
    nonFba: z.number(),
    onOrder: z.number(),
    onOrderDays: z.number(),
    orderQty: z.number(),
    outOfStockPercentage: z.number(),
    oversized: z.string().nullable(),
    packageWeight: z.number(),
    pending: z.number(),
    percentOutOfStock2d: z.number().nullable(),
    percentOutOfStock7d: z.number().nullable(),
    percentOutOfStock60d: z.number().nullable(),
    percentOutOfStock90d: z.number().nullable(),
    percentOutOfStock180d: z.number().nullable(),
    prepGuide: z.string().nullable(),
    prepNotes: z.string().nullable(),
    productName: z.string().nullable(),
    qoh: z.number(),
    qtySupplierLeadTime: z.number(),
    qtyToLocalLeadTime: z.number(),
    rank: z.number(),
    recommendedSupplierQty: z.number(),
    recommendedWarehouseQty: z.number(),
    referralFee: z.number(),
    remaining: z.string().or(z.number()).nullable(),
    repackagingMaterialCost: z.number(),
    repackingLaborCost: z.number(),
    reserved: z.number(),
    reshippingCost: z.number(),
    restockModel: z.string(),
    restockNeeded: z.number(),
    s2d: z.number(),
    s7d: z.number(),
    s14d: z.number(),
    s30d: z.number(),
    s60d: z.number(),
    s90d: z.number(),
    s180d: z.number(),
    sDateRange: z.number(),
    salesVelocitySettingData: z.object({
        percent2Day: z.number(),
        percent7Day: z.number(),
        percent14Day: z.number(),
        percent30Day: z.number(),
        percent60Day: z.number(),
        percent90Day: z.number(),
        percent180Day: z.number(),
        percentForecasted: z.number(),
    }),
    salesVelocitySettingsType: z.string(),
    salesVelocityType: z.string(),
    sku: z.string().nullable(),
    skuNotes: z.string().nullable(),
    soldBy: z.string().nullable(),
    status: z.string(),
    suggReorder: z.number(),
    suggShip: z.number(),
    sum: z.number(),
    supplierCost: z.number(),
    supplierLeadTime: z.number(),
    supplierRebate: z.number(),
    supplierSku: z.string().nullable(),
    sv2d: z.number(),
    sv7d: z.number(),
    sv14d: z.number(),
    sv30d: z.number(),
    sv60d: z.number(),
    sv90d: z.number(),
    sv180d: z.number(),
    svDateRange: z.number().nullable(),
    svDemand: z.number(),
    tags: z.array(z.string().nullable()),
    targetDays: z.number(),
    targetMaxDays: z.number(),
    targetQtyOnHand: z.number(),
    trueRestockModel: z.string(),
    unfulfillable: z.number(),
    upc: z.string(),
    variableClosingFee: z.string().or(z.number()).nullable(),
    vendorKey: z.string().nullable(),
    warehouseQtyUpdatedDate: z.string(),
});

export const itemInfoResponseSchema = z.object({
    companyKey: z.string(),
    companyType: z.string(),
    asin: z.string().nullable(),
    key: z.string(),
    name: z.string(),
    fnsku: z.string().nullable(),
    description: z.string().nullable(),
    packageWeight: z.number(),
    vendorKey: z.string().nullable(),
    vendorName: z.string().nullable(),
    vendorPrice: z.number(),
    moq: z.number().nullable(),
    leadTime: z.number().nullable(),
    orderInterval: z.number().nullable(),
    serviceLevel: z.number().nullable(),
    onHand: z.number(),
    onHandFbm: z.number(),
    onHandMin: z.number(),
    onHandThirdParty: z.number(),
    onHandThirdPartyMin: z.number(),
    skuNotes: z.string().nullable(),
    prepGuide: z.string().nullable(),
    prepNotes: z.string().nullable(),
    supplierRebate: z.number(),
    inboundShippingCost: z.number(),
    reshippingCost: z.number(),
    repackagingMaterialCost: z.number(),
    repackingLaborCost: z.number(),
    dimensionalWeight: z.number(),
    hazmat: z.string().or(z.boolean()).nullable(),
    oversized: z.string().nullable(),
    category: z.string().nullable(),
    upc: z.string(),
    ean: z.string(),
    rank: z.number(),
    growthTrend: z.number().nullable(),
    isHidden: z.boolean(),
    useHistoryOverride: z.boolean(),
    useLostSalesOverride: z.boolean(),
    useBackfill: z.boolean(),
    lotMultipleItemKey: z.string().nullable(),
    lotMultipleItemName: z.string().nullable(),
    lotMultipleQty: z.number(),
    forecastDirty: z.boolean(),
    forecastTags: z.array(z.string().nullable()),
    tags: z.array(z.string().nullable()),
    inbound: z.number(),
    inboundPrice: z.number(),
    inboundAvailable: z.number(),
    inboundCustomerOrder: z.number(),
    inboundFcProcessing: z.number(),
    inboundFcTransfer: z.number(),
    inboundSalesLast30Days: z.number(),
    inboundAlert: z.string().nullable(),
    inboundUnfulfillable: z.number(),
    inboundWorking: z.number(),
    mwsFulfillmentFee: z.number(),
    inventorySourcePreference: z.string().nullable(),
    imageUrl: z.string().nullable(),
    fba: z.number().nullable(),
    lowestFba: z.number(),
    soldBy: z.string().nullable(),
    fbaFee: z.number(),
    variableClosingFee: z.string().or(z.number()).nullable(),
    newBuyBox: z.number(),
    inboundReceiving: z.number(),
    inboundShipped: z.number(),
    referralFee: z.number(),
    listPrice: z.number(),
    average7DayPrice: z.number(),
    condition: z.string().nullable(),
    syncedFields: z.array(z.string()).nullable(),
    isFbm: z.boolean(),
    itemHistoryLength: z.number(),
    warehouseQtyUpdatedDate: z.string(),
    itemHistoryLengthInDay: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
});

export const itemInfoInShipmentResponseSchema = z.object({
    companyKey: z.string(),
    companyType: z.string(),
    alertDate: z.string(),
    amazonRemaining: z.string(),
    asin: z.string(),
    average7DayPrice: z.number(),
    boxHeight: z.number().nullable(),
    boxLength: z.number().nullable(),
    boxWeight: z.number().nullable(),
    boxWidth: z.number().nullable(),
    caseQty: z.number(),
    category: z.string().nullable(),
    condition: z.string(),
    cost: z.number(),
    created_at: z.string(),
    demand: z.number(),
    description: z.string().nullable(),
    destinationFulfillmentCenterId: z.string().nullable(),
    dimensionalWeight: z.number(),
    ean: z.string(),
    estimatedMargin: z.number(),
    estimatedMarginPercentage: z.number(),
    estimatedMarkupPercentage: z.number(),
    fba: z.number().nullable(),
    fbaFee: z.number(),
    fnsku: z.string(),
    forecastedQty: z.number(),
    hasSticker: z.boolean(),
    hazmat: z.string().or(z.boolean()).nullable(),
    imageUrl: z.string().nullable(),
    inbound: z.number(),
    inboundFcTransfer: z.number(),
    inboundReceiving: z.number(),
    inboundShipped: z.number(),
    inboundShippingCost: z.number(),
    inboundWorking: z.number(),
    inboundTotal: z.number(),
    inboundUnfulfillable: z.number(),
    isHidden: z.boolean(),
    isShipByCase: z.boolean(),
    itemKey: z.string(),
    itemName: z.string().nullable(),
    labelType: z.string().nullable(),
    listPrice: z.number(),
    localQty: z.number(),
    localRemaining: z.string(),
    lotMultipleQty: z.number(),
    lowestFba: z.number(),
    lowestNonFba: z.number(),
    maximumShipmentQty: z.number(),
    mwsFulfillmentFee: z.number(),
    newBuyBox: z.number(),
    nonFba: z.number(),
    notes: z.string().nullable(),
    onHand: z.number(),
    openPurchaseOrders: z.number(),
    orderQty: z.number(),
    oversized: z.string().nullable(),
    packageWeight: z.number(),
    pending: z.number(),
    prepDetailsList: z.array(z.string().nullable()),
    rank: z.number(),
    receivedQty: z.number(),
    recommendedQty: z.number(),
    referralFee: z.number(),
    repackagingMaterialCost: z.number(),
    repackingLaborCost: z.number(),
    reserved: z.number(),
    reshippingCost: z.number(),
    restockModel: z.string(),
    restockKey: z.string().uuid(),
    s2d: z.number(),
    s7d: z.number(),
    s14d: z.number(),
    s30d: z.number(),
    s60d: z.number(),
    s90d: z.number(),
    s180d: z.number(),
    shipmentId: z.string().nullable(),
    shipmentItemKey: z.string().uuid(),
    shipmentQty: z.number(),
    status: z.string(),
    stickerQty: z.number(),
    sum: z.number(),
    supplierSku: z.string().nullable(),
    tags: z.array(z.string().nullable()),
    upc: z.string(),
    updated_at: z.string(),
    vendorKey: z.string().nullable(),
    vendorName: z.string().nullable(),
    warehouseQty: z.number(),
    whoPreps: z.string().nullable()
});