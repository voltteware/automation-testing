import { z } from 'zod';

export const RunForecastResponseSchema = z.object({
    err: z.string({invalid_type_error: "err must be string"}).nullable()
});