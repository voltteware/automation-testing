import { z } from 'zod';

export const generalResponseSchema = z.object({
    err: z.string().nullable()
}).nullable();

export const getHistoryOverrideOfItemResponseSchema = z.object({
    err: z.string().nullable(),
    model: z.array(z.object({
        companyKey: z.string(),
        companyType: z.string(),
        created_at: z.string(),
        forecastKey: z.string(),
        grid: z.string(),
        itemKey: z.string(),
        itemName: z.string(),
        orderQty: z.number(),
        start: z.string(),
        updated_at: z.string(),
    })).nullable(),
    key: z.array(z.string()).nullable()
});