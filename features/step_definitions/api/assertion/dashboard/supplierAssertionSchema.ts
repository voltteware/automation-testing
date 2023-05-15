import { z } from 'zod';

//Refer define schema here: https://morioh.com/p/cc9d89e8a10b
export const supplierAddressResponseSchema = z.object({
    addressLine1: z.string(),
    addressLine2: z.string().nullable(),
    city: z.string(),
    companyKey: z.string(),
    companyType: z.string(),
    countryCode: z.string(),
    fullName: z.string(),
    key: z.string(),
    phoneNumber: z.string().nullable(),
    postalCode: z.string(),
    vendorKey: z.string(),
    stateOrProvinceCode: z.string()
});