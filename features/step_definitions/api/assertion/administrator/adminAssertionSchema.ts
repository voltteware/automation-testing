import { z } from "zod"

export const renewTrialSchema = z.object({
  id: z.string(),
  customer: z.string(),
  status: z.string(),
  trial_start: z.number(),
  trial_end: z.number(),
  current_period_start: z.number(),
  current_period_end: z.number(),
  cancel_at_period_end: z.boolean(),
  plan: z.object({
    id: z.string(),
    object: z.string(),
    active: z.boolean(),
    aggregate_usage: z.null(),
    amount: z.number(),
    amount_decimal: z.string(),
    billing_scheme: z.string(),
    created: z.number(),
    currency: z.string(),
    interval: z.string(),
    interval_count: z.number(),
    livemode: z.boolean(),
    metadata: z.object({}),
    name: z.string(),
    nickname: z.null(),
    product: z.string(),
    statement_descriptor: z.null(),
    tiers: z.null(),
    tiers_mode: z.null(),
    transform_usage: z.null(),
    trial_period_days: z.number(),
    usage_type: z.string()
  }),
  metadata: z.object({ 
    companyKey: z.string({ invalid_type_error: "companyKey must be string" }), 
    companyType: z.string({ invalid_type_error: "companyType must be string" }) 
    }),
  default_payment_method: z.null()
})
