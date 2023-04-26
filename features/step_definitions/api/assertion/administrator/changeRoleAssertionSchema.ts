import { z } from "zod"

export const changeRoleResponseSchema = z.object({
  err: z.string({ invalid_type_error: "updated_at must be string" }).nullable(),
  model: z.array(
    z.object({
      userId: z.string({ invalid_type_error: "userId must be string" }),
      isAdmin: z.boolean(),
      isRestrictAddCSV: z.boolean(),
      updated_at: z.string({ invalid_type_error: "updated_at must be string" })
    })
  )
})
