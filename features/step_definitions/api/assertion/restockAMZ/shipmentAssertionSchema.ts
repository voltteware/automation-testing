import { z } from "zod";

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
    uploadInventory: z.boolean(),
  }),
  totalCost: z.number(),
  updatedAt: z.string(),
  updated_at: z.string(),
  whoPreps: z.string().nullable(),
});

export const modifyShipmentSchema = simpleShipmentResponseSchema
  .omit({ stepProgress: true })
  .merge(
    z.object({
      stepProgress: z.object({
        isFromRestockSuggestion: z.boolean(),
      }),
    })
  );

const stepProgressSchema = z.object({
  stepProgress: z.object({
    inventorySelection: z.boolean(),
    shipmentOptions: z.boolean(),
    shipmentReview: z.boolean().optional(),
    shipmentSummary: z.boolean(),
    shipmentCasePack: z.boolean().optional(),
  }),
});

export const updateItemInfoWithLastStepResponseSchema =
  simpleShipmentResponseSchema.merge(stepProgressSchema);

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
  whoPreps: z.string().nullable(),
});

export const shipmentDetailSchema = z.object({
  companyType: z.string(),
  companyKey: z.string(),
  key: z.string(),
  restockKey: z.null(),
  shipmentName: z.string(),
  addressFromKey: z.string(),
  labelPrepPreference: z.string(),
  shipmentId: z.string(),
  shipmentSource: z.string(),
  destinationFulfillmentCenterId: z.string(),
  status: z.string(),
  isShipByCase: z.null(),
  whoPreps: z.null(),
  restockType: z.string(),
  requestedQty: z.number(),
  receivedQty: z.number(),
  totalCost: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  orderNotes: z.null(),
  stepProgress: z.object({ isFromRestockSuggestion: z.boolean() }),
  etaDate: z.null(),
  selectedShipmentItemKeys: z.array(z.unknown()),
  created_at: z.string(),
  updated_at: z.string(),
  shipToAddress: z.object({
    destinationFulfillmentCenterId: z.string(),
    countryCode: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
  }).nullable(),
  shipFromAddress: z.object({
    companyType: z.string(),
    companyKey: z.string(),
    key: z.string(),
    vendorKey: z.string(),
    countryCode: z.string(),
    fullName: z.string(),
    addressLine1: z.string(),
    addressLine2: z.null(),
    city: z.string(),
    stateOrProvinceCode: z.string(),
    postalCode: z.string(),
    phoneNumber: z.null(),
  }),
  totalSKUs: z.number(),
  totalWeight: z.number(),
});
