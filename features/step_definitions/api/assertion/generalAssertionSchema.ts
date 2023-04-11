import { z } from 'zod';

//Refer define schema here: https://morioh.com/p/cc9d89e8a10b
export const ItemSummaryRequestSchema = z.object({
    model: z.object({
        missingVendorCount: z.string({invalid_type_error: "missingVendorCount must be a string"}),
        olderThan30DaysCount: z.string({invalid_type_error: "olderThan30DaysCount must be a string"}),
        onHandCount: z.string({invalid_type_error: "onHandCount must be a string"}),
        onHandThirdPartyCount: z.string({invalid_type_error: "onHandThirdPartyCount must be a string"})
    })
});

export type ItemSummaryRequest = z.infer<typeof ItemSummaryRequestSchema>;
