

// import { z } from "zod"

// import type {
//   RegistrationBundleType,
//   RegistrationFormValues,
//   RegistrationPaymentMethod,
//   RegistrationSelectionType,
// } from "./organizationsTypes"

// /* =========================================================
//    COMMON
// ========================================================= */

// const nullableNumber = z
//   .number()
//   .nullable()

// const requiredNumber = (
//   message: string,
// ) =>
//   z
//     .number()
//     .nullable()
//     .refine(
//       (value) =>
//         value !== null &&
//         Number.isFinite(value),
//       {
//         message,
//       },
//     )

// const positiveNumber = (
//   message: string,
// ) =>
//   z
//     .number()
//     .nullable()
//     .refine(
//       (value) =>
//         value !== null &&
//         Number.isFinite(value) &&
//         value > 0,
//       {
//         message,
//       },
//     )

// const nonNegativeNumber = (
//   message: string,
// ) =>
//   z
//     .number()
//     .nullable()
//     .refine(
//       (value) =>
//         value !== null &&
//         Number.isFinite(value) &&
//         value >= 0,
//       {
//         message,
//       },
//     )

// const percentageNumber = z
//   .number()
//   .nullable()
//   .refine(
//     (value) =>
//       value !== null &&
//       Number.isFinite(value) &&
//       value >= 0 &&
//       value <= 100,
//     {
//       message: "GST must be between 0 and 100",
//     },
//   )

// const optionalPercentageNumber = z
//   .number()
//   .nullable()
//   .refine(
//     (value) =>
//       value === null ||
//       (Number.isFinite(value) &&
//         value >= 0 &&
//         value <= 100),
//     {
//       message: "GST must be between 0 and 100",
//     },
//   )

// const positiveInteger = (
//   message: string,
// ) =>
//   z
//     .number()
//     .nullable()
//     .refine(
//       (value) =>
//         value !== null &&
//         Number.isInteger(value) &&
//         value > 0,
//       {
//         message,
//       },
//     )

// /* =========================================================
//    STEP 1 - ORGANIZATION
// ========================================================= */

// export const organizationStepSchema =
//   z.object({
//     organization_name: z
//       .string()
//       .trim()
//       .min(
//         2,
//         "Organization name is required",
//       )
//       .max(
//         150,
//         "Organization name must not exceed 150 characters",
//       ),

//     contact_person_name: z
//       .string()
//       .trim()
//       .min(
//         2,
//         "Contact person name is required",
//       )
//       .max(
//         100,
//         "Contact person name must not exceed 100 characters",
//       ),

//     email: z
//       .string()
//       .trim()
//       .email(
//         "Enter a valid email address",
//       ),

//     phone: z
//       .string()
//       .trim()
//       .regex(
//         /^\+?[1-9]\d{9,14}$/,
//         "Enter a valid phone number",
//       ),
//   })

// /* =========================================================
//    STEP 2 - SUBSCRIPTION
// ========================================================= */

// export const subscriptionStepSchema =
//   z
//     .object({
//       selection_type:
//         z.enum([
//           "plan",
//           "bundle",
//         ]),

//       plan_id: z.string(),

//       bundle_id: z.string(),

//       bundle_type:
//         z
//           .enum([
//             "subscription",
//             "perpetual",
//           ])
//           .nullable(),
//     })
//     .superRefine(
//       (value, ctx) => {
//         if (
//           value.selection_type ===
//           "plan"
//         ) {
//           if (
//             !value.plan_id.trim()
//           ) {
//             ctx.addIssue({
//               code: "custom",
//               path: ["plan_id"],
//               message:
//                 "Please select a subscription plan",
//             })
//           }

//           if (
//             value.bundle_id.trim()
//           ) {
//             ctx.addIssue({
//               code: "custom",
//               path: ["bundle_id"],
//               message:
//                 "Bundle must not be selected when plan is selected",
//             })
//           }

//           if (
//             value.bundle_type !==
//             null
//           ) {
//             ctx.addIssue({
//               code: "custom",
//               path: ["bundle_type"],
//               message:
//                 "Bundle type must be empty when plan is selected",
//             })
//           }
//         }

//         if (
//           value.selection_type ===
//           "bundle"
//         ) {
//           if (
//             !value.bundle_id.trim()
//           ) {
//             ctx.addIssue({
//               code: "custom",
//               path: ["bundle_id"],
//               message:
//                 "Please select a subscription bundle",
//             })
//           }

//           if (
//             value.plan_id.trim()
//           ) {
//             ctx.addIssue({
//               code: "custom",
//               path: ["plan_id"],
//               message:
//                 "Plan must not be selected when bundle is selected",
//             })
//           }

//           if (
//             value.bundle_type ===
//             null
//           ) {
//             ctx.addIssue({
//               code: "custom",
//               path: ["bundle_type"],
//               message:
//                 "Bundle type is required",
//             })
//           }
//         }
//       },
//     )

// /* =========================================================
//    STEP 3 - PRICING
// ========================================================= */

// const pricingBaseSchema =
//   z.object({
//     selection_type:
//       z.enum([
//         "plan",
//         "bundle",
//       ]),

//     bundle_type:
//       z
//         .enum([
//           "subscription",
//           "perpetual",
//         ])
//         .nullable(),

//     price: requiredNumber(
//       "Price is required",
//     ).refine(
//       (value) =>
//         value !== null &&
//         value >= 0,
//       {
//         message:
//           "Price cannot be negative",
//       },
//     ),

//     gst_percentage:
//       percentageNumber,

//     total_price:
//       requiredNumber(
//         "Total price is required",
//       ).refine(
//         (value) =>
//           value !== null &&
//           value >= 0,
//         {
//           message:
//             "Total price cannot be negative",
//         },
//       ),

//     duration_months:
//       nullableNumber,

//     amc_price:
//       nullableNumber,

//     amc_duration_months:
//       nullableNumber,

//     amc_gst_percentage:
//       optionalPercentageNumber,

//     amc_start_date:
//       z.string(),

//     amc_end_date:
//       z.string(),
//   })

// export const pricingStepSchema =
//   pricingBaseSchema.superRefine(
//     (value, ctx) => {
//       /* -----------------------------------------
//          PRICE + GST
//       ----------------------------------------- */

//       if (
//         value.price !== null &&
//         value.gst_percentage !== null &&
//         value.total_price !== null
//       ) {
//         const expectedTotal =
//           Number(
//             (
//               value.price +
//               (value.price *
//                 value.gst_percentage) /
//                 100
//             ).toFixed(2),
//           )

//         const actualTotal =
//           Number(
//             value.total_price.toFixed(
//               2,
//             ),
//           )

//         if (
//           Math.abs(
//             expectedTotal -
//               actualTotal,
//           ) > 0.01
//         ) {
//           ctx.addIssue({
//             code: "custom",
//             path: [
//               "total_price",
//             ],
//             message:
//               "Total price does not match price + GST",
//           })
//         }
//       }

//       /* -----------------------------------------
//          PLAN
//       ----------------------------------------- */

//       if (
//         value.selection_type ===
//         "plan"
//       ) {
//         if (
//           value.duration_months ===
//             null ||
//           !Number.isInteger(
//             value.duration_months,
//           ) ||
//           value.duration_months <=
//             0
//         ) {
//           ctx.addIssue({
//             code: "custom",
//             path: [
//               "duration_months",
//             ],
//             message:
//               "Duration is required and must be greater than 0",
//           })
//         }

//         if (
//           value.amc_price !== null ||
//           value.amc_duration_months !==
//             null ||
//           value.amc_gst_percentage !==
//             null ||
//           value.amc_start_date.trim() !==
//             "" ||
//           value.amc_end_date.trim() !==
//             ""
//         ) {
//           ctx.addIssue({
//             code: "custom",
//             path: ["amc_price"],
//             message:
//               "AMC details are not allowed for a plan",
//           })
//         }

//         return
//       }

//       /* -----------------------------------------
//          BUNDLE
//       ----------------------------------------- */

//       if (
//         value.selection_type ===
//         "bundle"
//       ) {
//         if (
//           value.bundle_type ===
//           null
//         ) {
//           ctx.addIssue({
//             code: "custom",
//             path: [
//               "bundle_type",
//             ],
//             message:
//               "Bundle type is required",
//           })

//           return
//         }

//         /* ---------------------------------------
//            SUBSCRIPTION BUNDLE
//         --------------------------------------- */

//         if (
//           value.bundle_type ===
//           "subscription"
//         ) {
//           if (
//             value.duration_months ===
//               null ||
//             !Number.isInteger(
//               value.duration_months,
//             ) ||
//             value.duration_months <=
//               0
//           ) {
//             ctx.addIssue({
//               code: "custom",
//               path: [
//                 "duration_months",
//               ],
//               message:
//                 "Bundle duration is required",
//             })
//           }

//           if (
//             value.amc_price !== null ||
//             value.amc_duration_months !==
//               null ||
//             value.amc_gst_percentage !==
//               null ||
//             value.amc_start_date.trim() !==
//               "" ||
//             value.amc_end_date.trim() !==
//               ""
//           ) {
//             ctx.addIssue({
//               code: "custom",
//               path: [
//                 "amc_price",
//               ],
//               message:
//                 "AMC details are not allowed for a subscription bundle",
//             })
//           }

//           return
//         }

//         /* ---------------------------------------
//            PERPETUAL BUNDLE
//         --------------------------------------- */

//         if (
//           value.bundle_type ===
//           "perpetual"
//         ) {
//           if (
//             value.duration_months !==
//             null
//           ) {
//             ctx.addIssue({
//               code: "custom",
//               path: [
//                 "duration_months",
//               ],
//               message:
//                 "Duration is not required for a perpetual bundle",
//             })
//           }

//           if (
//             value.amc_price ===
//               null ||
//             !Number.isFinite(
//               value.amc_price,
//             ) ||
//             value.amc_price < 0
//           ) {
//             ctx.addIssue({
//               code: "custom",
//               path: [
//                 "amc_price",
//               ],
//               message:
//                 "AMC price is required",
//             })
//           }

//           if (
//             value.amc_duration_months ===
//               null ||
//             !Number.isInteger(
//               value.amc_duration_months,
//             ) ||
//             value.amc_duration_months <=
//               0
//           ) {
//             ctx.addIssue({
//               code: "custom",
//               path: [
//                 "amc_duration_months",
//               ],
//               message:
//                 "AMC duration is required",
//             })
//           }

//           if (
//             value.amc_gst_percentage ===
//               null ||
//             !Number.isFinite(
//               value.amc_gst_percentage,
//             ) ||
//             value.amc_gst_percentage <
//               0 ||
//             value.amc_gst_percentage >
//               100
//           ) {
//             ctx.addIssue({
//               code: "custom",
//               path: [
//                 "amc_gst_percentage",
//               ],
//               message:
//                 "AMC GST must be between 0 and 100",
//             })
//           }

//           if (
//             !value.amc_start_date.trim()
//           ) {
//             ctx.addIssue({
//               code: "custom",
//               path: [
//                 "amc_start_date",
//               ],
//               message:
//                 "AMC start date is required",
//             })
//           }

//           if (
//             value.amc_end_date.trim()
//           ) {
//             if (
//               value.amc_start_date &&
//               value.amc_end_date <
//                 value.amc_start_date
//             ) {
//               ctx.addIssue({
//                 code: "custom",
//                 path: [
//                   "amc_end_date",
//                 ],
//                 message:
//                   "AMC end date cannot be before start date",
//               })
//             }
//           }
//         }
//       }
//     },
//   )

// /* =========================================================
//    STEP 4 - PAYMENT
// ========================================================= */

// export const paymentStepSchema =
//   z.object({
//     payment_method:
//       z.literal(
//         "manual",
//       ),

//     payment_reference:
//       z
//         .string()
//         .trim()
//         .min(
//           1,
//           "Payment reference is required",
//         )
//         .max(
//           100,
//           "Payment reference must not exceed 100 characters",
//         ),

//     payment_date:
//       z
//         .string()
//         .trim()
//         .min(
//           1,
//           "Payment date is required",
//         ),

//     payment_amount:
//       positiveNumber(
//         "Payment amount must be greater than 0",
//       ),

//     payment_notes:
//       z
//         .string()
//         .trim()
//         .max(
//           500,
//           "Payment notes must not exceed 500 characters",
//         ),
//   })

// /* =========================================================
//    COMPLETE FORM SCHEMA
// ========================================================= */

// export const registrationFormSchema =
//   z
//     .object({
//       organization_name:
//         z.string(),

//       contact_person_name:
//         z.string(),

//       email: z.string(),

//       phone: z.string(),

//       selection_type:
//         z.enum([
//           "plan",
//           "bundle",
//         ]),

//       plan_id: z.string(),

//       bundle_id: z.string(),

//       bundle_type:
//         z
//           .enum([
//             "subscription",
//             "perpetual",
//           ])
//           .nullable(),

//       price:
//         z.number().nullable(),

//       gst_percentage:
//         z.number().nullable(),

//       total_price:
//         z.number().nullable(),

//       duration_months:
//         z.number().nullable(),

//       amc_price:
//         z.number().nullable(),

//       amc_duration_months:
//         z.number().nullable(),

//       amc_gst_percentage:
//         z.number().nullable(),

//       amc_start_date:
//         z.string(),

//       amc_end_date:
//         z.string(),

//       payment_method:
//         z.literal("manual"),

//       payment_reference:
//         z.string(),

//       payment_date:
//         z.string(),

//       payment_amount:
//         z.number().nullable(),

//       payment_notes:
//         z.string(),
//     })
//     .superRefine(
//       (value, ctx) => {
//         const organizationResult =
//           organizationStepSchema.safeParse(
//             {
//               organization_name:
//                 value.organization_name,
//               contact_person_name:
//                 value.contact_person_name,
//               email: value.email,
//               phone: value.phone,
//             },
//           )

//         if (
//           !organizationResult.success
//         ) {
//           for (const issue of
//             organizationResult.error
//               .issues) {
//             ctx.addIssue({
//               code: "custom",
//               path: issue.path,
//               message:
//                 issue.message,
//             })
//           }
//         }

//         const subscriptionResult =
//           subscriptionStepSchema.safeParse(
//             {
//               selection_type:
//                 value.selection_type,
//               plan_id:
//                 value.plan_id,
//               bundle_id:
//                 value.bundle_id,
//               bundle_type:
//                 value.bundle_type,
//             },
//           )

//         if (
//           !subscriptionResult.success
//         ) {
//           for (const issue of
//             subscriptionResult.error
//               .issues) {
//             ctx.addIssue({
//               code: "custom",
//               path: issue.path,
//               message:
//                 issue.message,
//             })
//           }
//         }

//         const pricingResult =
//           pricingStepSchema.safeParse(
//             {
//               selection_type:
//                 value.selection_type,
//               bundle_type:
//                 value.bundle_type,
//               price: value.price,
//               gst_percentage:
//                 value.gst_percentage,
//               total_price:
//                 value.total_price,
//               duration_months:
//                 value.duration_months,
//               amc_price:
//                 value.amc_price,
//               amc_duration_months:
//                 value.amc_duration_months,
//               amc_gst_percentage:
//                 value.amc_gst_percentage,
//               amc_start_date:
//                 value.amc_start_date,
//               amc_end_date:
//                 value.amc_end_date,
//             },
//           )

//         if (
//           !pricingResult.success
//         ) {
//           for (const issue of
//             pricingResult.error
//               .issues) {
//             ctx.addIssue({
//               code: "custom",
//               path: issue.path,
//               message:
//                 issue.message,
//             })
//           }
//         }

//         const paymentResult =
//           paymentStepSchema.safeParse(
//             {
//               payment_method:
//                 value.payment_method,
//               payment_reference:
//                 value.payment_reference,
//               payment_date:
//                 value.payment_date,
//               payment_amount:
//                 value.payment_amount,
//               payment_notes:
//                 value.payment_notes,
//             },
//           )

//         if (
//           !paymentResult.success
//         ) {
//           for (const issue of
//             paymentResult.error
//               .issues) {
//             ctx.addIssue({
//               code: "custom",
//               path: issue.path,
//               message:
//                 issue.message,
//             })
//           }
//         }
//       },
//     )

// export type RegistrationFormSchema =
//   z.infer<
//     typeof registrationFormSchema
//   >

// /* =========================================================
//    STEP VALIDATOR
// ========================================================= */

// export type RegistrationStep =
//   | 1
//   | 2
//   | 3
//   | 4

// export function validateRegistrationStep(
//   step: RegistrationStep,
//   values: RegistrationFormValues,
// ) {
//   switch (step) {
//     case 1:
//       return organizationStepSchema.safeParse(
//         {
//           organization_name:
//             values.organization_name,
//           contact_person_name:
//             values.contact_person_name,
//           email: values.email,
//           phone: values.phone,
//         },
//       )

//     case 2:
//       return subscriptionStepSchema.safeParse(
//         {
//           selection_type:
//             values.selection_type,
//           plan_id:
//             values.plan_id,
//           bundle_id:
//             values.bundle_id,
//           bundle_type:
//             values.bundle_type,
//         },
//       )

//     case 3:
//       return pricingStepSchema.safeParse(
//         {
//           selection_type:
//             values.selection_type,
//           bundle_type:
//             values.bundle_type,
//           price: values.price,
//           gst_percentage:
//             values.gst_percentage,
//           total_price:
//             values.total_price,
//           duration_months:
//             values.duration_months,
//           amc_price:
//             values.amc_price,
//           amc_duration_months:
//             values.amc_duration_months,
//           amc_gst_percentage:
//             values.amc_gst_percentage,
//           amc_start_date:
//             values.amc_start_date,
//           amc_end_date:
//             values.amc_end_date,
//         },
//       )

//     case 4:
//       return paymentStepSchema.safeParse(
//         {
//           payment_method:
//             values.payment_method,
//           payment_reference:
//             values.payment_reference,
//           payment_date:
//             values.payment_date,
//           payment_amount:
//             values.payment_amount,
//           payment_notes:
//             values.payment_notes,
//         },
//       )
//   }
// }


import { z } from "zod"

import type {
  RegistrationFormValues,
} from "./organizationsTypes"

/* =========================================================
   COMMON HELPERS
========================================================= */

const nullableNumber = z.number().nullable()

const requiredNumber = (message: string) =>
  z
    .number()
    .nullable()
    .refine(
      (value) =>
        value !== null &&
        Number.isFinite(value),
      {
        message,
      },
    )

const positiveNumber = (message: string) =>
  z
    .number()
    .nullable()
    .refine(
      (value) =>
        value !== null &&
        Number.isFinite(value) &&
        value > 0,
      {
        message,
      },
    )

const percentageNumber = z
  .number()
  .nullable()
  .refine(
    (value) =>
      value !== null &&
      Number.isFinite(value) &&
      value >= 0 &&
      value <= 100,
    {
      message: "GST must be between 0 and 100",
    },
  )

const optionalPercentageNumber = z
  .number()
  .nullable()
  .refine(
    (value) =>
      value === null ||
      (Number.isFinite(value) &&
        value >= 0 &&
        value <= 100),
    {
      message: "GST must be between 0 and 100",
    },
  )

/* =========================================================
   STEP 1 - ORGANIZATION
========================================================= */

export const organizationStepSchema = z.object({
  organization_name: z
    .string()
    .trim()
    .min(
      2,
      "Organization name is required",
    )
    .max(
      150,
      "Organization name must not exceed 150 characters",
    ),

  contact_person_name: z
    .string()
    .trim()
    .min(
      2,
      "Contact person name is required",
    )
    .max(
      100,
      "Contact person name must not exceed 100 characters",
    ),

  email: z
    .string()
    .trim()
    .email(
      "Enter a valid email address",
    ),

  phone: z
    .string()
    .trim()
    .regex(
      /^\+?[1-9]\d{9,14}$/,
      "Enter a valid phone number",
    ),
})

/* =========================================================
   STEP 2 - PLAN / BUNDLE SELECTION
========================================================= */

export const subscriptionStepSchema = z
  .object({
    selection_type: z.enum([
      "plan",
      "bundle",
    ]),

    plan_id: z.string(),

    bundle_id: z.string(),

    bundle_type: z
      .enum([
        "subscription",
        "perpetual",
      ])
      .nullable(),
  })
  .superRefine((value, ctx) => {
    if (
      value.selection_type === "plan"
    ) {
      if (!value.plan_id.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["plan_id"],
          message:
            "Please select a subscription plan",
        })
      }

      if (value.bundle_id.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["bundle_id"],
          message:
            "Bundle must not be selected when plan is selected",
        })
      }

      if (value.bundle_type !== null) {
        ctx.addIssue({
          code: "custom",
          path: ["bundle_type"],
          message:
            "Bundle type must be empty when plan is selected",
        })
      }
    }

    if (
      value.selection_type === "bundle"
    ) {
      if (!value.bundle_id.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["bundle_id"],
          message:
            "Please select a subscription bundle",
        })
      }

      if (value.plan_id.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["plan_id"],
          message:
            "Plan must not be selected when bundle is selected",
        })
      }

      if (value.bundle_type === null) {
        ctx.addIssue({
          code: "custom",
          path: ["bundle_type"],
          message:
            "Bundle type is required",
        })
      }
    }
  })

/* =========================================================
   STEP 3 - PRICING
========================================================= */

const pricingBaseSchema = z.object({
  selection_type: z.enum([
    "plan",
    "bundle",
  ]),

  bundle_type: z
    .enum([
      "subscription",
      "perpetual",
    ])
    .nullable(),

  price: requiredNumber(
    "Price is required",
  ).refine(
    (value) =>
      value !== null &&
      value >= 0,
    {
      message:
        "Price cannot be negative",
    },
  ),

  gst_percentage:
    percentageNumber,

  total_price:
    requiredNumber(
      "Total price is required",
    ).refine(
      (value) =>
        value !== null &&
        value >= 0,
      {
        message:
          "Total price cannot be negative",
      },
    ),

  duration_months:
    nullableNumber,

  amc_price:
    nullableNumber,

  amc_duration_months:
    nullableNumber,

  amc_gst_percentage:
    optionalPercentageNumber,

  amc_start_date:
    z.string(),

  amc_end_date:
    z.string(),
})

export const pricingStepSchema =
  pricingBaseSchema.superRefine(
    (value, ctx) => {
      if (
        value.price !== null &&
        value.gst_percentage !== null &&
        value.total_price !== null
      ) {
        const expectedTotal =
          Number(
            (
              value.price +
              (value.price *
                value.gst_percentage) /
                100
            ).toFixed(2),
          )

        const actualTotal =
          Number(
            value.total_price.toFixed(2),
          )

        if (
          Math.abs(
            expectedTotal -
              actualTotal,
          ) > 0.01
        ) {
          ctx.addIssue({
            code: "custom",
            path: [
              "total_price",
            ],
            message:
              "Total price does not match price + GST",
          })
        }
      }

      /* PLAN */

      if (
        value.selection_type ===
        "plan"
      ) {
        if (
          value.duration_months ===
            null ||
          !Number.isInteger(
            value.duration_months,
          ) ||
          value.duration_months <=
            0
        ) {
          ctx.addIssue({
            code: "custom",
            path: [
              "duration_months",
            ],
            message:
              "Duration is required and must be greater than 0",
          })
        }

        const hasAmc =
          value.amc_price !== null ||
          value.amc_duration_months !==
            null ||
          value.amc_gst_percentage !==
            null ||
          value.amc_start_date.trim() !==
            "" ||
          value.amc_end_date.trim() !==
            ""

        if (hasAmc) {
          ctx.addIssue({
            code: "custom",
            path: ["amc_price"],
            message:
              "AMC details are not allowed for a plan",
          })
        }

        return
      }

      /* BUNDLE */

      if (
        value.selection_type ===
        "bundle"
      ) {
        if (
          value.bundle_type ===
          null
        ) {
          ctx.addIssue({
            code: "custom",
            path: [
              "bundle_type",
            ],
            message:
              "Bundle type is required",
          })

          return
        }

        /* SUBSCRIPTION BUNDLE */

        if (
          value.bundle_type ===
          "subscription"
        ) {
          if (
            value.duration_months ===
              null ||
            !Number.isInteger(
              value.duration_months,
            ) ||
            value.duration_months <=
              0
          ) {
            ctx.addIssue({
              code: "custom",
              path: [
                "duration_months",
              ],
              message:
                "Bundle duration is required and must be greater than 0",
            })
          }

          const hasAmc =
            value.amc_price !== null ||
            value.amc_duration_months !==
              null ||
            value.amc_gst_percentage !==
              null ||
            value.amc_start_date.trim() !==
              "" ||
            value.amc_end_date.trim() !==
              ""

          if (hasAmc) {
            ctx.addIssue({
              code: "custom",
              path: [
                "amc_price",
              ],
              message:
                "AMC details are not allowed for a subscription bundle",
            })
          }

          return
        }

        /* PERPETUAL BUNDLE */

        if (
          value.bundle_type ===
          "perpetual"
        ) {
          if (
            value.duration_months !==
            null
          ) {
            ctx.addIssue({
              code: "custom",
              path: [
                "duration_months",
              ],
              message:
                "Duration is not required for a perpetual bundle",
            })
          }

          if (
            value.amc_price === null ||
            !Number.isFinite(
              value.amc_price,
            ) ||
            value.amc_price < 0
          ) {
            ctx.addIssue({
              code: "custom",
              path: [
                "amc_price",
              ],
              message:
                "AMC price is required",
            })
          }

          if (
            value.amc_duration_months ===
              null ||
            !Number.isInteger(
              value.amc_duration_months,
            ) ||
            value.amc_duration_months <=
              0
          ) {
            ctx.addIssue({
              code: "custom",
              path: [
                "amc_duration_months",
              ],
              message:
                "AMC duration is required and must be greater than 0",
            })
          }

          if (
            value.amc_gst_percentage ===
              null ||
            !Number.isFinite(
              value.amc_gst_percentage,
            ) ||
            value.amc_gst_percentage <
              0 ||
            value.amc_gst_percentage >
              100
          ) {
            ctx.addIssue({
              code: "custom",
              path: [
                "amc_gst_percentage",
              ],
              message:
                "AMC GST must be between 0 and 100",
            })
          }

          if (
            !value.amc_start_date.trim()
          ) {
            ctx.addIssue({
              code: "custom",
              path: [
                "amc_start_date",
              ],
              message:
                "AMC start date is required",
            })
          }

          if (
            value.amc_end_date.trim()
          ) {
            if (
              value.amc_start_date &&
              value.amc_end_date <
                value.amc_start_date
            ) {
              ctx.addIssue({
                code: "custom",
                path: [
                  "amc_end_date",
                ],
                message:
                  "AMC end date cannot be before start date",
              })
            }
          }
        }
      }
    },
  )

/* =========================================================
   STEP 4 - PAYMENT
========================================================= */

export const paymentStepSchema =
  z.object({
    payment_method:
      z.literal("manual"),

    payment_reference:
      z
        .string()
        .trim()
        .min(
          1,
          "Payment reference is required",
        )
        .max(
          100,
          "Payment reference must not exceed 100 characters",
        ),

    payment_date:
      z
        .string()
        .trim()
        .min(
          1,
          "Payment date is required",
        ),

    payment_amount:
      positiveNumber(
        "Payment amount must be greater than 0",
      ),

    payment_notes:
      z
        .string()
        .trim()
        .max(
          500,
          "Payment notes must not exceed 500 characters",
        ),
  })

/* =========================================================
   COMPLETE REGISTRATION FORM
========================================================= */

export const registrationFormSchema =
  z
    .object({
      organization_name:
        z.string(),

      contact_person_name:
        z.string(),

      email:
        z.string(),

      phone:
        z.string(),

      selection_type:
        z.enum([
          "plan",
          "bundle",
        ]),

      plan_id:
        z.string(),

      bundle_id:
        z.string(),

      bundle_type:
        z
          .enum([
            "subscription",
            "perpetual",
          ])
          .nullable(),

      price:
        z.number().nullable(),

      gst_percentage:
        z.number().nullable(),

      total_price:
        z.number().nullable(),

      duration_months:
        z.number().nullable(),

      amc_price:
        z.number().nullable(),

      amc_duration_months:
        z.number().nullable(),

      amc_gst_percentage:
        z.number().nullable(),

      amc_start_date:
        z.string(),

      amc_end_date:
        z.string(),

      payment_method:
        z.literal("manual"),

      payment_reference:
        z.string(),

      payment_date:
        z.string(),

      payment_amount:
        z.number().nullable(),

      payment_notes:
        z.string(),
    })
    .superRefine(
      (value, ctx) => {
        const organizationResult =
          organizationStepSchema.safeParse(
            {
              organization_name:
                value.organization_name,

              contact_person_name:
                value.contact_person_name,

              email:
                value.email,

              phone:
                value.phone,
            },
          )

        if (
          !organizationResult.success
        ) {
          for (const issue of
            organizationResult
              .error.issues) {
            ctx.addIssue({
              code: "custom",
              path: issue.path,
              message:
                issue.message,
            })
          }
        }

        const subscriptionResult =
          subscriptionStepSchema.safeParse(
            {
              selection_type:
                value.selection_type,

              plan_id:
                value.plan_id,

              bundle_id:
                value.bundle_id,

              bundle_type:
                value.bundle_type,
            },
          )

        if (
          !subscriptionResult.success
        ) {
          for (const issue of
            subscriptionResult
              .error.issues) {
            ctx.addIssue({
              code: "custom",
              path: issue.path,
              message:
                issue.message,
            })
          }
        }

        const pricingResult =
          pricingStepSchema.safeParse(
            {
              selection_type:
                value.selection_type,

              bundle_type:
                value.bundle_type,

              price:
                value.price,

              gst_percentage:
                value.gst_percentage,

              total_price:
                value.total_price,

              duration_months:
                value.duration_months,

              amc_price:
                value.amc_price,

              amc_duration_months:
                value.amc_duration_months,

              amc_gst_percentage:
                value.amc_gst_percentage,

              amc_start_date:
                value.amc_start_date,

              amc_end_date:
                value.amc_end_date,
            },
          )

        if (
          !pricingResult.success
        ) {
          for (const issue of
            pricingResult
              .error.issues) {
            ctx.addIssue({
              code: "custom",
              path: issue.path,
              message:
                issue.message,
            })
          }
        }

        const paymentResult =
          paymentStepSchema.safeParse(
            {
              payment_method:
                value.payment_method,

              payment_reference:
                value.payment_reference,

              payment_date:
                value.payment_date,

              payment_amount:
                value.payment_amount,

              payment_notes:
                value.payment_notes,
            },
          )

        if (
          !paymentResult.success
        ) {
          for (const issue of
            paymentResult
              .error.issues) {
            ctx.addIssue({
              code: "custom",
              path: issue.path,
              message:
                issue.message,
            })
          }
        }
      },
    )

export type RegistrationFormSchema =
  z.infer<
    typeof registrationFormSchema
  >

/* =========================================================
   STEP VALIDATOR
========================================================= */

export type RegistrationStep =
  | 1
  | 2
  | 3
  | 4

export function validateRegistrationStep(
  step: RegistrationStep,
  values: RegistrationFormValues,
) {
  switch (step) {
    case 1:
      return organizationStepSchema.safeParse(
        {
          organization_name:
            values.organization_name,

          contact_person_name:
            values.contact_person_name,

          email:
            values.email,

          phone:
            values.phone,
        },
      )

    case 2:
      return subscriptionStepSchema.safeParse(
        {
          selection_type:
            values.selection_type,

          plan_id:
            values.plan_id,

          bundle_id:
            values.bundle_id,

          bundle_type:
            values.bundle_type,
        },
      )

    case 3:
      return pricingStepSchema.safeParse(
        {
          selection_type:
            values.selection_type,

          bundle_type:
            values.bundle_type,

          price:
            values.price,

          gst_percentage:
            values.gst_percentage,

          total_price:
            values.total_price,

          duration_months:
            values.duration_months,

          amc_price:
            values.amc_price,

          amc_duration_months:
            values.amc_duration_months,

          amc_gst_percentage:
            values.amc_gst_percentage,

          amc_start_date:
            values.amc_start_date,

          amc_end_date:
            values.amc_end_date,
        },
      )

    case 4:
      return paymentStepSchema.safeParse(
        {
          payment_method:
            values.payment_method,

          payment_reference:
            values.payment_reference,

          payment_date:
            values.payment_date,

          payment_amount:
            values.payment_amount,

          payment_notes:
            values.payment_notes,
        },
      )
  }
}