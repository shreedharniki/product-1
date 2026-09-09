import { z } from "zod"

export const subModulePermissionSchema = z.object({
  role_id: z.number().int().positive(),
  permission: z.number().int().min(0).max(7).nullable(),
})

export const subModuleSchema = z.object({
  module_id: z.number().int().positive(),

  sub_module_code: z
    .string()
    .trim()
    .min(1, "Sub module code is required")
    .max(50, "Sub module code must not exceed 50 characters"),

  sub_module_name: z
    .string()
    .trim()
    .min(1, "Sub module name is required")
    .max(100, "Sub module name must not exceed 100 characters"),

  sub_module_status: z.enum([
    "active",
    "inactive",
  ]),

  display_order: z
    .number()
    .int()
    .min(0, "Display order cannot be negative"),

  note: z
    .string()
    .trim()
    .max(500, "Note must not exceed 500 characters")
    .nullable()
    .optional(),

  permissions: z
    .array(subModulePermissionSchema)
    .min(1, "At least one role permission is required"),
})

export type SubModulePermission =
  z.infer<typeof subModulePermissionSchema>

export type SubModuleFormData =
  z.infer<typeof subModuleSchema>