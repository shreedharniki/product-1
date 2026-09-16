import { z } from "zod";

export const createSubscriptionPlanSchema = z.object({
  module_id: z.number().int().positive().nullable().optional(),

  plan_name: z
    .string()
    .trim()
    .min(2, "Plan name is required")
    .max(100),

  plan_code: z
    .string()
    .trim()
    .min(2, "Plan code is required")
    .max(50),

  plan_type: z.enum([
    // "users",
    // "sms",
    // "email",
    // "whatsapp",
    // "storage",
    // "custom",
    "subscription",
    "perpetual"

  ]),

  plan_quantity: z
    .number()
    .int()
    .min(0),

  plan_duration_months: z
    .number()
    .int()
    .positive(),

  plan_price: z
    .number()
    .min(0),

  plan_gst_percentage: z
    .number()
    .min(0)
    .max(100),

  plan_total_price: z
    .number()
    .min(0)
    .optional(),

  plan_amc_price: z
    .number()
    .min(0)
       .nullable()
      .optional(),

  plan_amc_duration_months: z
    .number()
    .int()
    .min(0)
       .nullable()
      .optional()
      .default(0),

  plan_amc_gst_percentage: z
    .number()
    .min(0)
    .max(100),

  plan_amc_start_date: z
    .string()
    .nullable()
    .optional(),

  plan_status: z
    .enum(["active", "inactive"])
    .optional()
    .default("active"),
});

export const updateSubscriptionPlanSchema =
  createSubscriptionPlanSchema.partial();

export const subscriptionPlanIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});