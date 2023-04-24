import { z } from 'zod';

export const simpleShipmentResponseSchema = z.object({
    addressFromKey: z.string().nullable(),
    companyKey: z.string(),
    companyType: z.string(),
    createdAt: z.string(),
    created_at: z.string(),
    destinationFulfillmentCenterId: z.string(),
    etaDate: z.string().nullable(),
    isShipByCase: z.boolean().nullable(),
    key: z.string(),
    labelPrepPreference: z.string().nullable(),
    orderNotes: z.string().nullable(),
    receivedQty: z.number(),
    requestedQty: z.number(),
    restockKey: z.string().nullable(),
    restockType: z.string(),
    selectedShipmentItemKeys: z.array(z.string()),
    shipmentId: z.string().nullable(),
    shipmentName: z.string(),
    shipmentSource: z.string().nullable(),
    status: z.string(),
    stepProgress: z.object({
        isFromRestockSuggestion: z.boolean(),
        uploadInventory: z.boolean()
    }),
    totalCost: z.number(),
    updatedAt: z.string(),
    updated_at: z.string(),
    whoPreps: z.string().nullable()
});

const stepProgressSchema = z.object({
    stepProgress: z.object({
        inventorySelection: z.boolean(),
        shipmentOptions: z.boolean(),
        shipmentReview: z.boolean().optional(),
        shipmentSummary: z.boolean(),
        shipmentCasePack: z.boolean().optional()
    }),
});

export const updateItemInfoWithLastStepResponseSchema = simpleShipmentResponseSchema.merge(stepProgressSchema);

export const getListShipmentsResponseSchema = z.object({
    addressFromKey: z.string().nullable(),
    companyKey: z.string(),
    companyType: z.string(),
    createdAt: z.string(),
    created_at: z.string(),
    destinationFulfillmentCenterId: z.string(),
    etaDate: z.string().nullable(),
    isShipByCase: z.boolean().nullable(),
    key: z.string(),
    labelPrepPreference: z.string().nullable(),
    orderNotes: z.string().nullable(),
    receivedQty: z.number(),
    requestedQty: z.number(),
    restockKey: z.string().nullable(),
    restockType: z.string(),
    selectedShipmentItemKeys: z.array(z.string()),
    shipmentId: z.string().nullable(),
    shipmentName: z.string(),
    shipmentSource: z.string().nullable(),
    status: z.string(),
    stepProgress: z.object({}),
    totalCost: z.number(),
    updatedAt: z.string(),
    updated_at: z.string(),
    whoPreps: z.string().nullable()
});