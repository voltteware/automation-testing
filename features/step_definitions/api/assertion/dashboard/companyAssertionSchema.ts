import { z } from 'zod';

export const companyResponseSchema = z.object({
    companyType: z.string(),
    companyKey: z.string(),
    companyName: z.string(),
    forecastKey: z.string(),
    forecastName: z.string(),
    moq: z.number(),
    leadTime: z.number(),
    orderInterval: z.number(),
    serviceLevel: z.number(),
    email: z.string().nullable(),
    lastForecastDate: z.string().nullable(),
    lastSyncDate: z.string().nullable(),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
    shipmentLastRefresh: z.string().nullable(),
    sellerId: z.string().nullable(),
    marketplaceId: z.string().nullable(),
    mwsAuthToken: z.string().nullable(),
    ratings: z.array(z.object({ id: z.string(), value: z.number() })),
    spikePercent: z.number(),
    plungePercent: z.number(),
    isManualInventory: z.boolean(),
    requestsOnboarding: z.boolean().nullable(),
    customerId: z.string(),
    subscriptionId: z.string().nullable(),
    subscriptionStatus: z.string().nullable(),
    purchaseItems: z.number().nullable(),
    purchasePrice: z.number().nullable(),
    purchasePriceWithMoq: z.number().nullable(),
    purchaseUniques: z.number().nullable(),
    pastDuePoLines: z.number().nullable(),
    expediteItemLines: z.number().nullable(),
    jobInitiator: z.string().nullable(),
    qbfsSyncStatus: z.null(),
    isNotifyingAfterSync: z.boolean(),
    isNotifyingAfterForecast: z.boolean(),
    isLostSaleTracking: z.boolean().nullable(),
    isLocked: z.boolean().nullable(),
    isPromptedOnLogin: z.boolean().nullable(),
    disabledFeatures: z.object({}),
    displayRestockAMZ: z.boolean().nullable(),
    phone: z.string().nullable(),
    fax: z.null(),
    website: z.null(),
    addressShippingUuid: z.string().nullable(),
    addressBillingUuid: z.string().nullable(),
    criticalErrorCode: z.string().nullable(),
    companyPreferences: z.object({}),
    accessToken: z.string().optional().nullable(),
    refreshToken: z.string().optional().nullable(),
    authorizationCode: z.string(),
    inventorySourcePreference: z.string(),
    restockModel: z.string(),
    localLeadTime: z.number(),
    targetQtyOnHandMin: z.number(),
    targetQtyOnHandMax: z.number(),
    salesVelocityType: z.string(),
    salesVelocitySettingData: z.object({
        percent2Day: z.number().optional(),
        percent7Day: z.number().optional(),
        percent30Day: z.number().optional(),
        percent60Day: z.number().optional(),
        percent90Day: z.number().optional(),
        percent180Day: z.number().optional(),
        percentForecasted: z.number().optional()
    }),
    advanceJobsTo: z.string().nullable(),
    jobProcessing: z.boolean(),
    purchasingSalesVelocityType: z.string(),
    purchasingSalesVelocitySettingData: z.object({
        percent2Day: z.number().optional(),
        percent7Day: z.number().optional(),
        percent30Day: z.number().optional(),
        percent60Day: z.number().optional(),
        percent90Day: z.number().optional(),
        percent180Day: z.number().optional(),
        percentForecasted: z.number().optional()
    }),
    pendingOrderToggle: z.boolean(),
    summaryCounts: z.object({}),
    uploadedColumns: z.array(z.unknown()),
    isUsingAdjustedDailySalesRate: z.boolean(),
    created_at: z.string(),
    updated_at: z.string()
})