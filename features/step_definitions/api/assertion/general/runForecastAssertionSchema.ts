import { z } from 'zod';

export const RunForecastResponseSchema = z.object({
    err: z.null({invalid_type_error: "err must be null and required if don't have any issues"})
});