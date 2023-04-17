import { z } from 'zod';

export const addUserToCompanyResponseSchema = z.object({    
        err: z.string({ invalid_type_error: "updated_at must be string" }).nullable(),
        model: z.object({
            companyKey: z.string({ invalid_type_error: "companyKey must be string" }),
            companyType: z.string({ invalid_type_error: "companyType must be string" }),
            companyName: z.string({ invalid_type_error: "companyName must be string" }),
            userId: z.string({ invalid_type_error: "userId must be string" }),
            updated_at: z.string({ invalid_type_error: "updated_at must be string" })
        })
})