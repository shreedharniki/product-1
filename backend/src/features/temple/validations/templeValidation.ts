import { z } from "zod"

export const createTempleSchema = z.object({
  temp_name: z
    .string()
    .trim()
    .min(2, "Temple name must be at least 2 characters")
    .max(150, "Temple name cannot exceed 150 characters"),

  temp_img_name: z
    .string()
    .max(50)
    .nullable()
    .optional(),

  temp_legal_name: z
    .string()
    .max(200)
    .nullable()
    .optional(),

  temp_registration_number: z
    .string()
    .max(100)
    .nullable()
    .optional(),

  temp_gst_number: z
    .string()
    .max(20)
    .nullable()
    .optional(),

  temp_email: z
    .string()
    .email("Invalid temple email")
    .max(150)
    .nullable()
    .optional(),

  temp_phone: z
    .string()
    .max(10)
    .nullable()
    .optional(),

  temp_address_line1: z
    .string()
    .max(255)
    .nullable()
    .optional(),

  temp_address_line2: z
    .string()
    .max(255)
    .nullable()
    .optional(),

  temp_city: z
    .string()
    .max(100)
    .nullable()
    .optional(),

  temp_state: z
    .string()
    .max(100)
    .nullable()
    .optional(),

  temp_country: z
    .string()
    .max(100)
    .optional()
    .default("India"),

  temp_pincode: z
    .string()
    .max(20)
    .nullable()
    .optional(),

  temp_lat: z
    .number()
    .min(-90)
    .max(90)
    .nullable()
    .optional(),

  temp_lng: z
    .number()
    .min(-180)
    .max(180)
    .nullable()
    .optional(),

  temp_slug: z
    .string()
    .max(150)
    .nullable()
    .optional(),

  temp_is_primary: z
    .boolean()
    .optional()
    .default(false),

  temp_status: z
    .enum(["active", "inactive", "suspended"])
    .optional()
    .default("active"),

  temp_timezone: z
    .string()
    .max(50)
    .optional()
    .default("Asia/Kolkata"),
})

export const updateTempleSchema =
  createTempleSchema.partial()