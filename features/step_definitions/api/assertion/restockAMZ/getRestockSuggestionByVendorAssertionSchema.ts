import { z } from 'zod';

export const getRestockSuggestionByVendorResponseSchema = z.object({
    companyKey: z.string({invalid_type_error: "companyKey must be string"}),
    companyType: z.string({invalid_type_error: "companyType must be string"}),
    freeFreightMinimum: z.string({invalid_type_error: "freeFreightMinimum must be string"}),
    greenAlerts: z.string({invalid_type_error: "greenAlerts must be string"}),
    orangeAlerts: z.string({invalid_type_error: "orangeAlerts must be string"}),
    redAlerts: z.string({invalid_type_error: "redAlerts must be string"}),
    restockTotal: z.number({invalid_type_error: "restockTotal must be number"}),
    restockUnits: z.string({invalid_type_error: "restockUnits must be string"}),
    targetOrderValue: z.number({invalid_type_error: "targetOrderValue must be number"}),
    tealAlerts: z.string({invalid_type_error: "tealAlerts must be string"}),
    vendorName: z.string({invalid_type_error: "vendorName must be string"}),
    yellowAlerts: z.string({invalid_type_error: "yellowAlerts must be string"}),
});