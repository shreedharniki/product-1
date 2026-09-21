// "use client"

// import {
//   useMemo,
//   useState,
// } from "react"

// import {
//   useForm,
// } from "@tanstack/react-form"

// import {
//   Check,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react"

// import {
//   Button,
// } from "@/components/ui/button"

// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"

// import {
//   Field,
//   FieldDescription,
//   FieldError,
//   FieldGroup,
//   FieldLabel,
// } from "@/components/ui/field"

// import {
//   Input,
// } from "@/components/ui/input"



// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

// import type {
//   CreateRegistrationPayload,
//   RegistrationBundleOption,
//   RegistrationFormValues,
//   RegistrationPlanOption,
// } from "../organizationsTypes"

// import {
//   validateRegistrationStep,
// } from "../organizationsValidation"

// /* =========================================================
//    WIZARD STEP

//    UI has only 3 steps:
//    1. Organization
//    2. Subscription
//    3. Payment

//    Existing validation file still treats payment as step 4.
// ========================================================= */

// type WizardStep = 1 | 2 | 3

// interface FieldErrors {
//   [key: string]: string
// }

// /* =========================================================
//    TEMPORARY DATA

//    Replace these with Redux/API data later.
// ========================================================= */

// const plans: RegistrationPlanOption[] = [
//   {
//     id: 1,
//     plan_name: "Basic Plan",
//     plan_code: "BASIC",
//     plan_type: "subscription",
//     price: 4999,
//     gst_percentage: 18,
//     duration_months: 12,
//   },
//   {
//     id: 2,
//     plan_name: "Professional Plan",
//     plan_code: "PRO",
//     plan_type: "subscription",
//     price: 9999,
//     gst_percentage: 18,
//     duration_months: 12,
//   },
//   {
//     id: 3,
//     plan_name: "Enterprise Plan",
//     plan_code: "ENTERPRISE",
//     plan_type: "subscription",
//     price: 19999,
//     gst_percentage: 18,
//     duration_months: 12,
//   },
// ]

// const bundles: RegistrationBundleOption[] = [
//   {
//     id: 1,
//     bundle_name: "Temple Starter Bundle",
//     bundle_code: "TSB",
//     bundle_type: "subscription",
//     price: 7999,
//     gst_percentage: 18,
//     duration_months: 12,
//   },
//   {
//     id: 2,
//     bundle_name: "Temple Perpetual Bundle",
//     bundle_code: "TPB",
//     bundle_type: "perpetual",
//     price: 29999,
//     gst_percentage: 18,
//     duration_months: null,
//   },
// ]

// /* =========================================================
//    COMPONENT
// ========================================================= */

// export default function OrganizationForm() {
//   const [
//     currentStep,
//     setCurrentStep,
//   ] = useState<WizardStep>(1)

//   const [
//     fieldErrors,
//     setFieldErrors,
//   ] = useState<FieldErrors>({})

//   const [
//     submitting,
//     setSubmitting,
//   ] = useState(false)

//   /* =========================================================
//      FORM
//   ========================================================= */

//   const form = useForm<RegistrationFormValues>({
//     defaultValues: {
//       organization_name: "",
//       contact_person_name: "",
//       email: "",
//       phone: "",

//       selection_type: "plan",

//       plan_id: "",
//       bundle_id: "",
//       bundle_type: null,

//       price: null,
//       gst_percentage: null,
//       total_price: null,
//       duration_months: null,

//       amc_price: null,
//       amc_duration_months: null,
//       amc_gst_percentage: null,
//       amc_start_date: "",
//       amc_end_date: "",

//       payment_method: "manual",
//       payment_reference: "",
//       payment_date: "",
//       payment_amount: null,
//       payment_notes: "",
//     },

//     onSubmit: async ({ value }) => {
//       /*
//        * Payment is UI Step 3,
//        * but existing validation keeps payment as Step 4.
//        */
//       const paymentValidation =
//         validateRegistrationStep(
//           4,
//           value,
//         )

//       if (!paymentValidation.success) {
//         setValidationErrors(
//           paymentValidation.error.issues,
//         )

//         setCurrentStep(3)

//         return
//       }

//       const fullPayloadValidation =
//         validateAllSteps(value)

//       if (!fullPayloadValidation) {
//         return
//       }

//       try {
//         setSubmitting(true)

//         /*
//          * Calculate final registration pricing
//          * automatically from selected plan/bundle.
//          */
//         const selectedPlan =
//           plans.find(
//             (plan) =>
//               String(plan.id) ===
//               value.plan_id,
//           ) ?? null

//         const selectedBundle =
//           bundles.find(
//             (bundle) =>
//               String(bundle.id) ===
//               value.bundle_id,
//           ) ?? null

//         const pricingItem =
//           value.selection_type === "plan"
//             ? selectedPlan
//             : selectedBundle

//         const price =
//           pricingItem?.price ?? 0

//         const gstPercentage =
//           pricingItem?.gst_percentage ?? 0

//         const totalPrice =
//           Number(
//             (
//               price +
//               (price * gstPercentage) /
//                 100
//             ).toFixed(2),
//           )

//         const payload: CreateRegistrationPayload =
//           {
//             organization: {
//               organization_name:
//                 value.organization_name.trim(),

//               contact_person_name:
//                 value.contact_person_name.trim(),

//               email:
//                 value.email.trim(),

//               phone:
//                 value.phone.trim(),
//             },

//             selection: {
//               type:
//                 value.selection_type,

//               plan_id:
//                 value.selection_type ===
//                   "plan" &&
//                 value.plan_id
//                   ? Number(value.plan_id)
//                   : null,

//               bundle_id:
//                 value.selection_type ===
//                   "bundle" &&
//                 value.bundle_id
//                   ? Number(value.bundle_id)
//                   : null,

//               price,

//               gst_percentage:
//                 gstPercentage,

//               total_price:
//                 totalPrice,

//               duration_months:
//                 pricingItem?.duration_months ??
//                 null,
//             },

//             amc: {
//               price:
//                 value.selection_type ===
//                   "bundle" &&
//                 value.bundle_type ===
//                   "perpetual"
//                   ? value.amc_price
//                   : null,

//               duration_months:
//                 value.selection_type ===
//                   "bundle" &&
//                 value.bundle_type ===
//                   "perpetual"
//                   ? value.amc_duration_months
//                   : null,

//               gst_percentage:
//                 value.selection_type ===
//                   "bundle" &&
//                 value.bundle_type ===
//                   "perpetual"
//                   ? value.amc_gst_percentage
//                   : null,

//               start_date:
//                 value.selection_type ===
//                   "bundle" &&
//                 value.bundle_type ===
//                   "perpetual"
//                   ? value.amc_start_date ||
//                     null
//                   : null,

//               end_date:
//                 value.selection_type ===
//                   "bundle" &&
//                 value.bundle_type ===
//                   "perpetual"
//                   ? value.amc_end_date ||
//                     null
//                   : null,
//             },

//             payment: {
//               payment_method:
//                 value.payment_method,

//               payment_reference:
//                 value.payment_reference.trim(),

//               payment_date:
//                 value.payment_date,

//               payment_amount:
//                 Number(
//                   value.payment_amount ??
//                     totalPrice,
//                 ),

//               payment_notes:
//                 value.payment_notes.trim(),
//             },
//           }

//         console.log(
//           "Registration Payload:",
//           payload,
//         )

//         /*
//          * Replace with Redux/API later:
//          *
//          * await dispatch(
//          *   createRegistration(payload),
//          * ).unwrap()
//          */

//         alert(
//           "Registration submitted successfully",
//         )
//       } catch (error) {
//         console.error(
//           "Registration failed:",
//           error,
//         )
//       } finally {
//         setSubmitting(false)
//       }
//     },
//   })

//   /* =========================================================
//      FORM VALUES
//   ========================================================= */

//   const values =
//     form.state.values

//   /* =========================================================
//      SELECTED PLAN
//   ========================================================= */

//   const selectedPlan =
//     useMemo(
//       () =>
//         plans.find(
//           (plan) =>
//             String(plan.id) ===
//             values.plan_id,
//         ) ?? null,
//       [values.plan_id],
//     )

//   /* =========================================================
//      SELECTED BUNDLE
//   ========================================================= */

//   const selectedBundle =
//     useMemo(
//       () =>
//         bundles.find(
//           (bundle) =>
//             String(bundle.id) ===
//             values.bundle_id,
//         ) ?? null,
//       [values.bundle_id],
//     )

//   /* =========================================================
//      REGISTRATION PRICING

//      Pricing is calculated automatically.
//      There is NO pricing step anymore.
//   ========================================================= */

//   const pricingItem =
//     values.selection_type === "plan"
//       ? selectedPlan
//       : selectedBundle

//   const registrationPrice =
//     pricingItem?.price ?? 0

//   const registrationGstPercentage =
//     pricingItem?.gst_percentage ?? 0

//   const gstAmount =
//     useMemo(() => {
//       return Number(
//         (
//           (registrationPrice *
//             registrationGstPercentage) /
//           100
//         ).toFixed(2),
//       )
//     }, [
//       registrationPrice,
//       registrationGstPercentage,
//     ])

//   const registrationTotal =
//     useMemo(() => {
//       return Number(
//         (
//           registrationPrice +
//           gstAmount
//         ).toFixed(2),
//       )
//     }, [
//       registrationPrice,
//       gstAmount,
//     ])

//   /* =========================================================
//      ERROR HELPER
//   ========================================================= */

//   const getError = (
//     name: string,
//   ) => {
//     return fieldErrors[name]
//   }

//   const clearFieldError = (
//     name: string,
//   ) => {
//     setFieldErrors(
//       (previous) => {
//         if (!previous[name]) {
//           return previous
//         }

//         const next = {
//           ...previous,
//         }

//         delete next[name]

//         return next
//       },
//     )
//   }

//   /* =========================================================
//      SET VALIDATION ERRORS
//   ========================================================= */

//   const setValidationErrors = (
//     issues: Array<{
//       path: PropertyKey[]
//       message: string
//     }>,
//   ) => {
//     const errors: FieldErrors =
//       {}

//     for (const issue of issues) {
//       const path =
//         issue.path
//           .map(String)
//           .join(".")

//       if (!errors[path]) {
//         errors[path] =
//           issue.message
//       }
//     }

//     setFieldErrors(errors)
//   }

//   /* =========================================================
//      VALIDATION STEP MAPPING

//      UI:
//        1 = Organization
//        2 = Subscription
//        3 = Payment

//      Existing validation:
//        1 = Organization
//        2 = Subscription
//        4 = Payment
//   ========================================================= */

//   const getValidationStep = (
//     step: WizardStep,
//   ): 1 | 2 | 4 => {
//     if (step === 3) {
//       return 4
//     }

//     return step
//   }

//   /* =========================================================
//      VALIDATE ALL STEPS
//   ========================================================= */

//   const validateAllSteps = (
//     formValues: RegistrationFormValues,
//   ) => {
//     const allErrors: FieldErrors =
//       {}

//     const steps: WizardStep[] = [
//       1,
//       2,
//       3,
//     ]

//     for (const step of steps) {
//       const validationStep =
//         getValidationStep(step)

//       const result =
//         validateRegistrationStep(
//           validationStep,
//           formValues,
//         )

//       if (!result.success) {
//         for (
//           const issue of
//             result.error.issues
//         ) {
//           const path =
//             issue.path
//               .map(String)
//               .join(".")

//           if (!allErrors[path]) {
//             allErrors[path] =
//               issue.message
//           }
//         }

//         setCurrentStep(step)
//         setFieldErrors(
//           allErrors,
//         )

//         return false
//       }
//     }

//     setFieldErrors({})

//     return true
//   }

//   /* =========================================================
//      VALIDATE CURRENT STEP
//   ========================================================= */

//   const validateStep = (
//     step: WizardStep,
//   ) => {
//     const validationStep =
//       getValidationStep(step)

//     const result =
//       validateRegistrationStep(
//         validationStep,
//         form.state.values,
//       )

//     if (result.success) {
//       setFieldErrors({})

//       return true
//     }

//     setValidationErrors(
//       result.error.issues,
//     )

//     return false
//   }

//   /* =========================================================
//      NEXT
//   ========================================================= */

//   const handleNext = () => {
//     if (
//       !validateStep(
//         currentStep,
//       )
//     ) {
//       return
//     }

//     if (currentStep < 3) {
//       /*
//        * When moving from Subscription
//        * to Payment, automatically set
//        * payment amount to registration total.
//        */
//       if (
//         currentStep === 2
//       ) {
//         form.setFieldValue(
//           "payment_amount",
//           registrationTotal,
//         )
//       }

//       setCurrentStep(
//         (currentStep + 1) as WizardStep,
//       )
//     }
//   }

//   /* =========================================================
//      PREVIOUS
//   ========================================================= */

//   const handlePrevious = () => {
//     if (currentStep > 1) {
//       setCurrentStep(
//         (currentStep - 1) as WizardStep,
//       )

//       setFieldErrors({})
//     }
//   }

//   /* =========================================================
//      SELECTION TYPE CHANGE
//   ========================================================= */

//   const handleSelectionTypeChange = (
//     type: "plan" | "bundle",
//   ) => {
//     form.setFieldValue(
//       "selection_type",
//       type,
//     )

//     form.setFieldValue(
//       "plan_id",
//       "",
//     )

//     form.setFieldValue(
//       "bundle_id",
//       "",
//     )

//     form.setFieldValue(
//       "bundle_type",
//       null,
//     )

//     form.setFieldValue(
//       "price",
//       null,
//     )

//     form.setFieldValue(
//       "gst_percentage",
//       null,
//     )

//     form.setFieldValue(
//       "total_price",
//       null,
//     )

//     form.setFieldValue(
//       "duration_months",
//       null,
//     )

//     form.setFieldValue(
//       "amc_price",
//       null,
//     )

//     form.setFieldValue(
//       "amc_duration_months",
//       null,
//     )

//     form.setFieldValue(
//       "amc_gst_percentage",
//       null,
//     )

//     form.setFieldValue(
//       "amc_start_date",
//       "",
//     )

//     form.setFieldValue(
//       "amc_end_date",
//       "",
//     )

//     form.setFieldValue(
//       "payment_amount",
//       null,
//     )

//     setFieldErrors({})
//   }

//   /* =========================================================
//      PLAN CHANGE
//   ========================================================= */

//   const handlePlanChange = (
//     value: string,
//   ) => {
//     const plan =
//       plans.find(
//         (item) =>
//           String(item.id) ===
//           value,
//       )

//     form.setFieldValue(
//       "plan_id",
//       value,
//     )

//     form.setFieldValue(
//       "bundle_id",
//       "",
//     )

//     form.setFieldValue(
//       "bundle_type",
//       null,
//     )

//     if (!plan) {
//       form.setFieldValue(
//         "price",
//         null,
//       )

//       form.setFieldValue(
//         "gst_percentage",
//         null,
//       )

//       form.setFieldValue(
//         "total_price",
//         null,
//       )

//       form.setFieldValue(
//         "duration_months",
//         null,
//       )

//       form.setFieldValue(
//         "payment_amount",
//         null,
//       )

//       clearFieldError(
//         "plan_id",
//       )

//       return
//     }

//     const total =
//       Number(
//         (
//           plan.price +
//           (plan.price *
//             plan.gst_percentage) /
//             100
//         ).toFixed(2),
//       )

//     form.setFieldValue(
//       "price",
//       plan.price,
//     )

//     form.setFieldValue(
//       "gst_percentage",
//       plan.gst_percentage,
//     )

//     form.setFieldValue(
//       "total_price",
//       total,
//     )

//     form.setFieldValue(
//       "duration_months",
//       plan.duration_months,
//     )

//     form.setFieldValue(
//       "payment_amount",
//       total,
//     )

//     /*
//      * Clear AMC values because plan
//      * does not use AMC.
//      */
//     form.setFieldValue(
//       "amc_price",
//       null,
//     )

//     form.setFieldValue(
//       "amc_duration_months",
//       null,
//     )

//     form.setFieldValue(
//       "amc_gst_percentage",
//       null,
//     )

//     form.setFieldValue(
//       "amc_start_date",
//       "",
//     )

//     form.setFieldValue(
//       "amc_end_date",
//       "",
//     )

//     clearFieldError(
//       "plan_id",
//     )
//   }

//   /* =========================================================
//      BUNDLE CHANGE
//   ========================================================= */

//   const handleBundleChange = (
//     value: string,
//   ) => {
//     const bundle =
//       bundles.find(
//         (item) =>
//           String(item.id) ===
//           value,
//       )

//     form.setFieldValue(
//       "bundle_id",
//       value,
//     )

//     form.setFieldValue(
//       "plan_id",
//       "",
//     )

//     if (!bundle) {
//       form.setFieldValue(
//         "bundle_type",
//         null,
//       )

//       form.setFieldValue(
//         "price",
//         null,
//       )

//       form.setFieldValue(
//         "gst_percentage",
//         null,
//       )

//       form.setFieldValue(
//         "total_price",
//         null,
//       )

//       form.setFieldValue(
//         "duration_months",
//         null,
//       )

//       form.setFieldValue(
//         "payment_amount",
//         null,
//       )

//       clearFieldError(
//         "bundle_id",
//       )

//       return
//     }

//     const total =
//       Number(
//         (
//           bundle.price +
//           (bundle.price *
//             bundle.gst_percentage) /
//             100
//         ).toFixed(2),
//       )

//     form.setFieldValue(
//       "bundle_type",
//       bundle.bundle_type,
//     )

//     form.setFieldValue(
//       "price",
//       bundle.price,
//     )

//     form.setFieldValue(
//       "gst_percentage",
//       bundle.gst_percentage,
//     )

//     form.setFieldValue(
//       "total_price",
//       total,
//     )

//     form.setFieldValue(
//       "payment_amount",
//       total,
//     )

//     if (
//       bundle.bundle_type ===
//       "subscription"
//     ) {
//       form.setFieldValue(
//         "duration_months",
//         bundle.duration_months,
//       )

//       form.setFieldValue(
//         "amc_price",
//         null,
//       )

//       form.setFieldValue(
//         "amc_duration_months",
//         null,
//       )

//       form.setFieldValue(
//         "amc_gst_percentage",
//         null,
//       )

//       form.setFieldValue(
//         "amc_start_date",
//         "",
//       )

//       form.setFieldValue(
//         "amc_end_date",
//         "",
//       )
//     } else {
//       /*
//        * Perpetual bundle:
//        * no subscription duration.
//        */
//       form.setFieldValue(
//         "duration_months",
//         null,
//       )

//       /*
//        * Default AMC values.
//        */
//       form.setFieldValue(
//         "amc_price",
//         0,
//       )

//       form.setFieldValue(
//         "amc_duration_months",
//         null,
//       )

//       form.setFieldValue(
//         "amc_gst_percentage",
//         18,
//       )

//       form.setFieldValue(
//         "amc_start_date",
//         "",
//       )

//       form.setFieldValue(
//         "amc_end_date",
//         "",
//       )
//     }

//     clearFieldError(
//       "bundle_id",
//     )
//   }

//   /* =========================================================
//      ERROR MESSAGE COMPONENT
//   ========================================================= */

//   const ErrorMessage = ({
//     name,
//   }: {
//     name: string
//   }) => {
//     const error =
//       getError(name)

//     if (!error) {
//       return null
//     }

//     return (
//       <FieldError>
//         {error}
//       </FieldError>
//     )
//   }

//   /* =========================================================
//      RENDER
//   ========================================================= */

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>
//           Organization Registration
//         </CardTitle>

//         {/* =====================================================
//             STEP INDICATOR
//         ====================================================== */}

//         <div className="flex items-center justify-between pt-4">
//           {[
//             {
//               id: 1,
//               label: "Organization",
//             },
//             {
//               id: 2,
//               label: "Subscription",
//             },
//             {
//               id: 3,
//               label: "Payment",
//             },
//           ].map(
//             (
//               step,
//               index,
//             ) => (
//               <div
//                 key={step.id}
//                 className="flex flex-1 items-center"
//               >
//                 <div className="flex flex-col items-center">
//                   <div
//                     className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium ${
//                       currentStep >=
//                       step.id
//                         ? "bg-primary text-primary-foreground"
//                         : "bg-muted"
//                     }`}
//                   >
//                     {currentStep >
//                     step.id ? (
//                       <Check className="h-4 w-4" />
//                     ) : (
//                       step.id
//                     )}
//                   </div>

//                   <span className="mt-1 text-xs">
//                     {step.label}
//                   </span>
//                 </div>

//                 {index < 2 && (
//                   <div className="mx-2 h-px flex-1 bg-border" />
//                 )}
//               </div>
//             ),
//           )}
//         </div>
//       </CardHeader>

//       <CardContent>
//         {/* =====================================================
//             STEP 1 - ORGANIZATION
//         ====================================================== */}

//         {currentStep === 1 && (
//           <FieldGroup>
//             {/* ORGANIZATION NAME */}

//             <form.Field
//               name="organization_name"
//               children={(field) => (
//                 <Field>
//                   <FieldLabel>
//                     Organization Name{" "}
//                     <span className="text-destructive">
//                       *
//                     </span>
//                   </FieldLabel>

//                   <Input
//                     value={
//                       field.state.value
//                     }
//                     onChange={(event) => {
//                       field.handleChange(
//                         event.target.value,
//                       )

//                       clearFieldError(
//                         "organization_name",
//                       )
//                     }}
//                     placeholder="Enter organization name"
//                   />

//                   <ErrorMessage
//                     name="organization_name"
//                   />
//                 </Field>
//               )}
//             />

//             {/* CONTACT PERSON */}

//             <form.Field
//               name="contact_person_name"
//               children={(field) => (
//                 <Field>
//                   <FieldLabel>
//                     Contact Person Name{" "}
//                     <span className="text-destructive">
//                       *
//                     </span>
//                   </FieldLabel>

//                   <Input
//                     value={
//                       field.state.value
//                     }
//                     onChange={(event) => {
//                       field.handleChange(
//                         event.target.value,
//                       )

//                       clearFieldError(
//                         "contact_person_name",
//                       )
//                     }}
//                     placeholder="Enter contact person name"
//                   />

//                   <ErrorMessage
//                     name="contact_person_name"
//                   />
//                 </Field>
//               )}
//             />

//             {/* EMAIL */}

//             <form.Field
//               name="email"
//               children={(field) => (
//                 <Field>
//                   <FieldLabel>
//                     Email{" "}
//                     <span className="text-destructive">
//                       *
//                     </span>
//                   </FieldLabel>

//                   <Input
//                     type="email"
//                     value={
//                       field.state.value
//                     }
//                     onChange={(event) => {
//                       field.handleChange(
//                         event.target.value,
//                       )

//                       clearFieldError(
//                         "email",
//                       )
//                     }}
//                     placeholder="organization@example.com"
//                   />

//                   <FieldDescription>
//                     This email will be used
//                     for the organization admin.
//                   </FieldDescription>

//                   <ErrorMessage
//                     name="email"
//                   />
//                 </Field>
//               )}
//             />

//             {/* PHONE */}

//             <form.Field
//               name="phone"
//               children={(field) => (
//                 <Field>
//                   <FieldLabel>
//                     Phone{" "}
//                     <span className="text-destructive">
//                       *
//                     </span>
//                   </FieldLabel>

//                   <Input
//                     type="tel"
//                     value={
//                       field.state.value
//                     }
//                     onChange={(event) => {
//                       field.handleChange(
//                         event.target.value,
//                       )

//                       clearFieldError(
//                         "phone",
//                       )
//                     }}
//                     placeholder="9876543210"
//                   />

//                   <FieldDescription>
//                     Enter a valid phone number.
//                   </FieldDescription>

//                   <ErrorMessage
//                     name="phone"
//                   />
//                 </Field>
//               )}
//             />

//             {/* ADMIN INFO */}

//             <div className="rounded-lg border bg-muted/30 p-4">
//               <p className="font-medium">
//                 Organization Admin
//               </p>

//               <p className="mt-1 text-sm text-muted-foreground">
//                 The contact person will be
//                 created as the Organization
//                 Admin after registration.
//               </p>
//             </div>
//           </FieldGroup>
//         )}

//         {/* =====================================================
//             STEP 2 - SUBSCRIPTION
//         ====================================================== */}

//         {currentStep === 2 && (
//           <FieldGroup>
//             {/* SELECTION TYPE */}

//             <form.Field
//               name="selection_type"
//               children={(field) => (
//                 <Field>
//                   <FieldLabel>
//                     Selection Type{" "}
//                     <span className="text-destructive">
//                       *
//                     </span>
//                   </FieldLabel>

//                   <Select
//                     value={
//                       field.state.value
//                     }
//                     onValueChange={(value) => {
//                       if (
//                         value === "plan" ||
//                         value === "bundle"
//                       ) {
//                         handleSelectionTypeChange(
//                           value,
//                         )
//                       }
//                     }}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select type" />
//                     </SelectTrigger>

//                     <SelectContent>
//                       <SelectItem value="plan">
//                         Subscription Plan
//                       </SelectItem>

//                       <SelectItem value="bundle">
//                         Subscription Bundle
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>

//                   <ErrorMessage
//                     name="selection_type"
//                   />
//                 </Field>
//               )}
//             />

//             {/* =================================================
//                 PLAN
//             ================================================== */}

//             {values.selection_type ===
//               "plan" && (
//               <form.Field
//                 name="plan_id"
//                 children={(field) => (
//                   <Field>
//                     <FieldLabel>
//                       Subscription Plan{" "}
//                       <span className="text-destructive">
//                         *
//                       </span>
//                     </FieldLabel>

//                     <Select
//                       value={
//                         field.state.value
//                       }
//                       onValueChange={
//                         handlePlanChange
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select plan" />
//                       </SelectTrigger>

//                       <SelectContent>
//                         {plans.map(
//                           (plan) => (
//                             <SelectItem
//                               key={
//                                 plan.id
//                               }
//                               value={String(
//                                 plan.id,
//                               )}
//                             >
//                               {
//                                 plan.plan_name
//                               }{" "}
//                               — ₹
//                               {plan.price.toLocaleString(
//                                 "en-IN",
//                               )}
//                             </SelectItem>
//                           ),
//                         )}
//                       </SelectContent>
//                     </Select>

//                     <ErrorMessage
//                       name="plan_id"
//                     />
//                   </Field>
//                 )}
//               />
//             )}

//             {/* =================================================
//                 BUNDLE
//             ================================================== */}

//             {values.selection_type ===
//               "bundle" && (
//               <>
//                 <form.Field
//                   name="bundle_id"
//                   children={(field) => (
//                     <Field>
//                       <FieldLabel>
//                         Subscription Bundle{" "}
//                         <span className="text-destructive">
//                           *
//                         </span>
//                       </FieldLabel>

//                       <Select
//                         value={
//                           field.state.value
//                         }
//                         onValueChange={
//                           handleBundleChange
//                         }
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select bundle" />
//                         </SelectTrigger>

//                         <SelectContent>
//                           {bundles.map(
//                             (
//                               bundle,
//                             ) => (
//                               <SelectItem
//                                 key={
//                                   bundle.id
//                                 }
//                                 value={String(
//                                   bundle.id,
//                                 )}
//                               >
//                                 {
//                                   bundle.bundle_name
//                                 }{" "}
//                                 — ₹
//                                 {bundle.price.toLocaleString(
//                                   "en-IN",
//                                 )}{" "}
//                                 (
//                                 {
//                                   bundle.bundle_type
//                                 }
//                                 )
//                               </SelectItem>
//                             ),
//                           )}
//                         </SelectContent>
//                       </Select>

//                       <ErrorMessage
//                         name="bundle_id"
//                       />
//                     </Field>
//                   )}
//                 />

//                 {/* BUNDLE DETAILS */}

//                 {selectedBundle && (
//                   <div className="rounded-lg border bg-muted/30 p-4">
//                     <div className="grid gap-4 sm:grid-cols-4">
//                       <div>
//                         <p className="text-sm text-muted-foreground">
//                           Bundle
//                         </p>

//                         <p className="font-medium">
//                           {
//                             selectedBundle.bundle_name
//                           }
//                         </p>
//                       </div>

//                       <div>
//                         <p className="text-sm text-muted-foreground">
//                           Type
//                         </p>

//                         <p className="font-medium capitalize">
//                           {
//                             selectedBundle.bundle_type
//                           }
//                         </p>
//                       </div>

//                       <div>
//                         <p className="text-sm text-muted-foreground">
//                           Price
//                         </p>

//                         <p className="font-medium">
//                           ₹
//                           {selectedBundle.price.toLocaleString(
//                             "en-IN",
//                             {
//                               minimumFractionDigits: 2,
//                             },
//                           )}
//                         </p>
//                       </div>

//                       <div>
//                         <p className="text-sm text-muted-foreground">
//                           Duration
//                         </p>

//                         <p className="font-medium">
//                           {selectedBundle.duration_months
//                             ? `${selectedBundle.duration_months} months`
//                             : "Perpetual"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* PERPETUAL BUNDLE AMC NOTICE */}

//                 {values.bundle_type ===
//                   "perpetual" && (
//                   <div className="rounded-lg border bg-muted/30 p-4">
//                     <p className="font-medium">
//                       AMC Required
//                     </p>

//                     <p className="mt-1 text-sm text-muted-foreground">
//                       This is a perpetual bundle.
//                       AMC details will be handled
//                       automatically according to
//                       the selected bundle configuration.
//                     </p>
//                   </div>
//                 )}
//               </>
//             )}

//             {/* =================================================
//                 AUTOMATIC PRICING SUMMARY
//             ================================================== */}

//             {pricingItem && (
//               <div className="mt-4 rounded-lg border bg-muted/30 p-4">
//                 <h3 className="mb-4 font-semibold">
//                   Subscription Summary
//                 </h3>

//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">
//                       Price
//                     </span>

//                     <span>
//                       ₹
//                       {registrationPrice.toLocaleString(
//                         "en-IN",
//                         {
//                           minimumFractionDigits: 2,
//                         },
//                       )}
//                     </span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">
//                       GST (
//                       {
//                         registrationGstPercentage
//                       }
//                       %)
//                     </span>

//                     <span>
//                       ₹
//                       {gstAmount.toLocaleString(
//                         "en-IN",
//                         {
//                           minimumFractionDigits: 2,
//                         },
//                       )}
//                     </span>
//                   </div>

//                   <div className="flex justify-between border-t pt-2 text-base font-semibold">
//                     <span>
//                       Registration Total
//                     </span>

//                     <span>
//                       ₹
//                       {registrationTotal.toLocaleString(
//                         "en-IN",
//                         {
//                           minimumFractionDigits: 2,
//                         },
//                       )}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </FieldGroup>
//         )}

//         {/* =====================================================
//             STEP 3 - PAYMENT
//         ====================================================== */}

//         {currentStep === 3 && (
//           <FieldGroup>
//             {/* PAYMENT METHOD */}

//             <form.Field
//               name="payment_method"
//               children={(field) => (
//                 <Field>
//                   <FieldLabel>
//                     Payment Method
//                   </FieldLabel>

//                   <Select
//                     value={
//                       field.state.value
//                     }
//                     onValueChange={(value) => {
//                       if (
//                         value ===
//                         "manual"
//                       ) {
//                         field.handleChange(
//                           "manual",
                      
//                         )
//                       }
//                     }}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>

//                     <SelectContent>
//                       <SelectItem value="manual">
//                         Manual Payment
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </Field>
//               )}
//             />

//             {/* PAYMENT REFERENCE */}

//             <form.Field
//               name="payment_reference"
//               children={(field) => (
//                 <Field>
//                   <FieldLabel>
//                     Payment Reference{" "}
//                     <span className="text-destructive">
//                       *
//                     </span>
//                   </FieldLabel>

//                   <Input
//                     value={
//                       field.state.value
//                     }
//                     onChange={(event) => {
//                       field.handleChange(
//                         event.target.value,
//                       )

//                       clearFieldError(
//                         "payment_reference",
//                       )
//                     }}
//                     placeholder="Transaction / receipt number"
//                   />

//                   <ErrorMessage
//                     name="payment_reference"
//                   />
//                 </Field>
//               )}
//             />

//             {/* PAYMENT DATE */}

//             <form.Field
//               name="payment_date"
//               children={(field) => (
//                 <Field>
//                   <FieldLabel>
//                     Payment Date{" "}
//                     <span className="text-destructive">
//                       *
//                     </span>
//                   </FieldLabel>

//                   <Input
//                     type="date"
//                     value={
//                       field.state.value
//                     }
//                     onChange={(event) => {
//                       field.handleChange(
//                         event.target.value,
//                       )

//                       clearFieldError(
//                         "payment_date",
//                       )
//                     }}
//                   />

//                   <ErrorMessage
//                     name="payment_date"
//                   />
//                 </Field>
//               )}
//             />

//             {/* PAYMENT AMOUNT */}

//             {/* <form.Field
//               name="payment_amount"
//               children={(field) => (
//                 <Field>
//                   <FieldLabel>
//                     Payment Amount{" "}
//                     <span className="text-destructive">
//                       *
//                     </span>
//                   </FieldLabel>

//                   <Input
//                     type="number"
//                     min="0.01"
//                     step="0.01"
//                     value={
//                       field.state.value ??
//                       ""
//                     }
//                     onChange={(event) => {
//                       const value =
//                         event.target
//                           .value

//                       field.handleChange(
//                         value === ""
//                           ? null
//                           : Number(value),
//                       )

//                       clearFieldError(
//                         "payment_amount",
//                       )
//                     }}
//                   />

//                   <FieldDescription>
//                     Registration total: ₹
//                     {registrationTotal.toLocaleString(
//                       "en-IN",
//                       {
//                         minimumFractionDigits: 2,
//                       },
//                     )}
//                   </FieldDescription>

//                   <ErrorMessage
//                     name="payment_amount"
//                   />
//                 </Field>
//               )}
//             /> */}

//             {/* PAYMENT NOTES */}

//             {/* <form.Field
//               name="payment_notes"
//               children={(field) => (
//                 <Field>
//                   <FieldLabel>
//                     Payment Notes
//                   </FieldLabel>

//                   <Textarea
//                     value={
//                       field.state.value
//                     }
//                     onChange={(event) => {
//                       field.handleChange(
//                         event.target.value,
//                       )

//                       clearFieldError(
//                         "payment_notes",
//                       )
//                     }}
//                     placeholder="Enter payment notes"
//                     rows={4}
//                   />

//                   <ErrorMessage
//                     name="payment_notes"
//                   />
//                 </Field>
//               )}
//             /> */}

//             {/* =================================================
//                 FINAL SUMMARY
//             ================================================== */}

//             {/* <div className="rounded-lg border bg-muted/30 p-4"> */}
//               {/* <h3 className="mb-4 font-semibold">
//                 Registration Summary
//               </h3> */}

//               {/* <div className="space-y-2 text-sm"> */}
//                 {/* ORGANIZATION */}

//                 {/* <div className="flex justify-between gap-4">
//                   <span className="text-muted-foreground">
//                     Organization
//                   </span>

//                   <span className="text-right font-medium">
//                     {values.organization_name ||
//                       "-"}
//                   </span>
//                 </div> */}

//                 {/* CONTACT */}

//                 {/* <div className="flex justify-between gap-4">
//                   <span className="text-muted-foreground">
//                     Contact Person
//                   </span>

//                   <span className="text-right font-medium">
//                     {values.contact_person_name ||
//                       "-"}
//                   </span>
//                 </div> */}

//                 {/* EMAIL */}

//                 {/* <div className="flex justify-between gap-4">
//                   <span className="text-muted-foreground">
//                     Email
//                   </span>

//                   <span className="text-right font-medium">
//                     {values.email ||
//                       "-"}
//                   </span>
//                 </div> */}

//                 {/* PHONE */}

//                 {/* <div className="flex justify-between gap-4">
//                   <span className="text-muted-foreground">
//                     Phone
//                   </span>

//                   <span className="font-medium">
//                     {values.phone ||
//                       "-"}
//                   </span>
//                 </div> */}

//                 {/* SELECTION */}

//                 {/* <div className="flex justify-between">
//                   <span className="text-muted-foreground">
//                     Selection
//                   </span>

//                   <span className="font-medium capitalize">
//                     {
//                       values.selection_type
//                     }
//                   </span>
//                 </div> */}

//                 {/* PLAN */}

//                 {/* {values.selection_type ===
//                   "plan" && (
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">
//                       Plan
//                     </span>

//                     <span className="font-medium">
//                       {
//                         selectedPlan?.plan_name ??
//                         "-"
//                       }
//                     </span>
//                   </div>
//                 )} */}

//                 {/* BUNDLE */}

//                 {/* {values.selection_type ===
//                   "bundle" && (
//                   <>
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">
//                         Bundle
//                       </span>

//                       <span className="font-medium">
//                         {
//                           selectedBundle?.bundle_name ??
//                           "-"
//                         }
//                       </span>
//                     </div> */}

//                     {/* <div className="flex justify-between">
//                       <span className="text-muted-foreground">
//                         Bundle Type
//                       </span>

//                       <span className="font-medium capitalize">
//                         {
//                           values.bundle_type ??
//                           "-"
//                         }
//                       </span>
//                     </div> */}

//                     {/* {selectedBundle && (
//                       <div className="flex justify-between">
//                         <span className="text-muted-foreground">
//                           Duration
//                         </span>

//                         <span className="font-medium">
//                           {selectedBundle.duration_months
//                             ? `${selectedBundle.duration_months} months`
//                             : "Perpetual"}
//                         </span>
//                       </div>
//                     )} */}
//                   {/* </>
//                 )} */}

//                 {/* PRICE */}

//                 {/* <div className="flex justify-between">
//                   <span className="text-muted-foreground">
//                     Price
//                   </span>

//                   <span>
//                     ₹
//                     {registrationPrice.toLocaleString(
//                       "en-IN",
//                       {
//                         minimumFractionDigits: 2,
//                       },
//                     )}
//                   </span>
//                 </div> */}

//                 {/* GST */}

//                 {/* <div className="flex justify-between">
//                   <span className="text-muted-foreground">
//                     GST
//                   </span>

//                   <span>
//                     {
//                       registrationGstPercentage
//                     }
//                     %
//                   </span>
//                 </div> */}

//                 {/* GST AMOUNT */}
// {/* 
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">
//                     GST Amount
//                   </span>

//                   <span>
//                     ₹
//                     {gstAmount.toLocaleString(
//                       "en-IN",
//                       {
//                         minimumFractionDigits: 2,
//                       },
//                     )}
//                   </span>
//                 </div> */}

//                 {/* TOTAL */}

//                 {/* <div className="flex justify-between border-t pt-2 text-base font-semibold">
//                   <span>
//                     Registration Total
//                   </span>

//                   <span>
//                     ₹
//                     {registrationTotal.toLocaleString(
//                       "en-IN",
//                       {
//                         minimumFractionDigits: 2,
//                       },
//                     )}
//                   </span>
//                 </div> */}

//                 {/* PAYMENT */}

//                 {/* <div className="flex justify-between">
//                   <span className="text-muted-foreground">
//                     Payment Amount
//                   </span>

//                   <span className="font-medium">
//                     ₹
//                     {Number(
//                       values.payment_amount ??
//                         registrationTotal,
//                     ).toLocaleString(
//                       "en-IN",
//                       {
//                         minimumFractionDigits: 2,
//                       },
//                     )}
//                   </span>
//                 </div> */}
//               {/* </div> */}
//             {/* </div> */}
//           </FieldGroup>
//         )}
//       </CardContent>

//       {/* =====================================================
//           FOOTER
//       ====================================================== */}

//       <CardFooter className="flex justify-between">
//         {/* PREVIOUS */}

//         <Button
//           type="button"
//           variant="outline"
//           onClick={
//             handlePrevious
//           }
//           disabled={
//             currentStep === 1 ||
//             submitting
//           }
//         >
//           <ChevronLeft className="mr-2 h-4 w-4" />

//           Previous
//         </Button>

//         {/* NEXT */}

//         {currentStep < 3 ? (
//           <Button
//             type="button"
//             onClick={
//               handleNext
//             }
//             disabled={
//               submitting
//             }
//           >
//             Next

//             <ChevronRight className="ml-2 h-4 w-4" />
//           </Button>
//         ) : (
//           /* =================================================
//              COMPLETE REGISTRATION
//           ================================================== */

//           <Button
//             type="button"
//             disabled={
//               submitting
//             }
//             onClick={() => {
//               const valid =
//                 validateAllSteps(
//                   form.state.values,
//                 )

//               if (!valid) {
//                 return
//               }

//               form.handleSubmit()
//             }}
//           >
//             {submitting
//               ? "Submitting..."
//               : "Complete Registration"}

//             {!submitting && (
//               <Check className="ml-2 h-4 w-4" />
//             )}
//           </Button>
//         )}
//       </CardFooter>
//     </Card>
//   )
// }





"use client"

import {
  useMemo,
  useState,
} from "react"

import {
  useForm,
} from "@tanstack/react-form"

import {
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import {
  Button,
} from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import {
  Input,
} from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type {
  CreateRegistrationPayload,
  RegistrationBundleOption,
  RegistrationFormValues,
  RegistrationPlanOption,
} from "../organizationsTypes"

import {
  validateRegistrationStep,
} from "../organizationsValidation"

/* =========================================================
   WIZARD STEP

   UI:
   1. Organization
   2. Subscription
   3. Payment

   Existing validation:
   1. Organization
   2. Subscription
   4. Payment
========================================================= */

type WizardStep = 1 | 2 | 3

interface FieldErrors {
  [key: string]: string
}

/* =========================================================
   TEMPORARY DATA

   Replace with Redux/API data later.
========================================================= */

const plans: RegistrationPlanOption[] = [
  {
    id: 1,
    plan_name: "Basic Plan",
    plan_code: "BASIC",
    plan_type: "subscription",
    price: 4999,
    gst_percentage: 18,
    duration_months: 12,
  },
  {
    id: 2,
    plan_name: "Professional Plan",
    plan_code: "PRO",
    plan_type: "subscription",
    price: 9999,
    gst_percentage: 18,
    duration_months: 12,
  },
  {
    id: 3,
    plan_name: "Enterprise Plan",
    plan_code: "ENTERPRISE",
    plan_type: "subscription",
    price: 19999,
    gst_percentage: 18,
    duration_months: 12,
  },
]

const bundles: RegistrationBundleOption[] = [
  {
    id: 1,
    bundle_name: "Temple Starter Bundle",
    bundle_code: "TSB",
    bundle_type: "subscription",
    price: 7999,
    gst_percentage: 18,
    duration_months: 12,
  },
  {
    id: 2,
    bundle_name: "Temple Perpetual Bundle",
    bundle_code: "TPB",
    bundle_type: "perpetual",
    price: 29999,
    gst_percentage: 18,
    duration_months: null,
  },
]

/* =========================================================
   COMPONENT
========================================================= */

export default function OrganizationForm() {
  const [
    currentStep,
    setCurrentStep,
  ] = useState<WizardStep>(1)

  const [
    fieldErrors,
    setFieldErrors,
  ] = useState<FieldErrors>({})

  const [
    submitting,
    setSubmitting,
  ] = useState(false)

  /* =========================================================
     FORM
  ========================================================= */

  const form = useForm({
    defaultValues: {
      organization_name: "",
      contact_person_name: "",
      email: "",
      phone: "",

      selection_type: "plan" as "plan" | "bundle",

      plan_id: "",
      bundle_id: "",
      bundle_type:
        null as
          | "subscription"
          | "perpetual"
          | null,

      price: null as number | null,
      gst_percentage: null as number | null,
      total_price: null as number | null,
      duration_months: null as number | null,

      amc_price: null as number | null,
      amc_duration_months:
        null as number | null,
      amc_gst_percentage:
        null as number | null,
      amc_start_date: "",
      amc_end_date: "",

      payment_method:
        "manual" as "manual",
      payment_reference: "",
      payment_date: "",
      payment_amount:
        null as number | null,
      payment_notes: "",
    },

    onSubmit: async ({ value }) => {
      /*
       * Payment is UI Step 3,
       * existing validation uses Step 4.
       */
      const paymentValidation =
        validateRegistrationStep(
          4,
          value as RegistrationFormValues,
        )

      if (!paymentValidation.success) {
        setValidationErrors(
          paymentValidation.error.issues,
        )

        setCurrentStep(3)

        return
      }

      const fullPayloadValidation =
        validateAllSteps(
          value as RegistrationFormValues,
        )

      if (!fullPayloadValidation) {
        return
      }

      try {
        setSubmitting(true)

        const formValues =
          value as RegistrationFormValues

        /*
         * Find selected plan.
         */
        const selectedPlan =
          plans.find(
            (plan) =>
              String(plan.id) ===
              formValues.plan_id,
          ) ?? null

        /*
         * Find selected bundle.
         */
        const selectedBundle =
          bundles.find(
            (bundle) =>
              String(bundle.id) ===
              formValues.bundle_id,
          ) ?? null

        /*
         * Determine pricing item.
         */
        const pricingItem =
          formValues.selection_type ===
          "plan"
            ? selectedPlan
            : selectedBundle

        const price =
          pricingItem?.price ?? 0

        const gstPercentage =
          pricingItem?.gst_percentage ?? 0

        const totalPrice =
          Number(
            (
              price +
              (price * gstPercentage) /
                100
            ).toFixed(2),
          )

        const payload: CreateRegistrationPayload =
          {
            organization: {
              organization_name:
                formValues.organization_name.trim(),

              contact_person_name:
                formValues.contact_person_name.trim(),

              email:
                formValues.email.trim(),

              phone:
                formValues.phone.trim(),
            },

            selection: {
              type:
                formValues.selection_type,

              plan_id:
                formValues.selection_type ===
                  "plan" &&
                formValues.plan_id
                  ? Number(
                      formValues.plan_id,
                    )
                  : null,

              bundle_id:
                formValues.selection_type ===
                  "bundle" &&
                formValues.bundle_id
                  ? Number(
                      formValues.bundle_id,
                    )
                  : null,

              price,

              gst_percentage:
                gstPercentage,

              total_price:
                totalPrice,

              duration_months:
                pricingItem?.duration_months ??
                null,
            },

            amc: {
              price:
                formValues.selection_type ===
                  "bundle" &&
                formValues.bundle_type ===
                  "perpetual"
                  ? formValues.amc_price
                  : null,

              duration_months:
                formValues.selection_type ===
                  "bundle" &&
                formValues.bundle_type ===
                  "perpetual"
                  ? formValues.amc_duration_months
                  : null,

              gst_percentage:
                formValues.selection_type ===
                  "bundle" &&
                formValues.bundle_type ===
                  "perpetual"
                  ? formValues.amc_gst_percentage
                  : null,

              start_date:
                formValues.selection_type ===
                  "bundle" &&
                formValues.bundle_type ===
                  "perpetual"
                  ? formValues.amc_start_date ||
                    null
                  : null,

              end_date:
                formValues.selection_type ===
                  "bundle" &&
                formValues.bundle_type ===
                  "perpetual"
                  ? formValues.amc_end_date ||
                    null
                  : null,
            },

            payment: {
              payment_method:
                formValues.payment_method,

              payment_reference:
                formValues.payment_reference.trim(),

              payment_date:
                formValues.payment_date,

              payment_amount:
                Number(
                  formValues.payment_amount ??
                    totalPrice,
                ),

              payment_notes:
                formValues.payment_notes.trim(),
            },
          }

        console.log(
          "Registration Payload:",
          payload,
        )

        /*
         * Replace with Redux/API later:
         *
         * await dispatch(
         *   createRegistration(payload),
         * ).unwrap()
         */

        alert(
          "Registration submitted successfully",
        )
      } catch (error) {
        console.error(
          "Registration failed:",
          error,
        )
      } finally {
        setSubmitting(false)
      }
    },
  })

  /* =========================================================
     FORM VALUES
  ========================================================= */

  const values =
    form.state.values as RegistrationFormValues

  /* =========================================================
     SELECTED PLAN
  ========================================================= */

  const selectedPlan =
    useMemo(
      () =>
        plans.find(
          (plan) =>
            String(plan.id) ===
            values.plan_id,
        ) ?? null,
      [values.plan_id],
    )

  /* =========================================================
     SELECTED BUNDLE
  ========================================================= */

  const selectedBundle =
    useMemo(
      () =>
        bundles.find(
          (bundle) =>
            String(bundle.id) ===
            values.bundle_id,
        ) ?? null,
      [values.bundle_id],
    )

  /* =========================================================
     REGISTRATION PRICING
  ========================================================= */

  const pricingItem =
    values.selection_type === "plan"
      ? selectedPlan
      : selectedBundle

  const registrationPrice =
    pricingItem?.price ?? 0

  const registrationGstPercentage =
    pricingItem?.gst_percentage ?? 0

  const gstAmount =
    useMemo(() => {
      return Number(
        (
          (registrationPrice *
            registrationGstPercentage) /
          100
        ).toFixed(2),
      )
    }, [
      registrationPrice,
      registrationGstPercentage,
    ])

  const registrationTotal =
    useMemo(() => {
      return Number(
        (
          registrationPrice +
          gstAmount
        ).toFixed(2),
      )
    }, [
      registrationPrice,
      gstAmount,
    ])

  /* =========================================================
     ERROR HELPER
  ========================================================= */

  const getError = (
    name: string,
  ) => {
    return fieldErrors[name]
  }

  const clearFieldError = (
    name: string,
  ) => {
    setFieldErrors(
      (previous) => {
        if (!previous[name]) {
          return previous
        }

        const next = {
          ...previous,
        }

        delete next[name]

        return next
      },
    )
  }

  /* =========================================================
     SET VALIDATION ERRORS
  ========================================================= */

  const setValidationErrors = (
    issues: Array<{
      path: PropertyKey[]
      message: string
    }>,
  ) => {
    const errors: FieldErrors = {}

    for (const issue of issues) {
      const path =
        issue.path
          .map(String)
          .join(".")

      if (!errors[path]) {
        errors[path] =
          issue.message
      }
    }

    setFieldErrors(errors)
  }

  /* =========================================================
     VALIDATION STEP MAPPING
  ========================================================= */

  const getValidationStep = (
    step: WizardStep,
  ): 1 | 2 | 4 => {
    if (step === 3) {
      return 4
    }

    return step
  }

  /* =========================================================
     VALIDATE ALL STEPS
  ========================================================= */

  const validateAllSteps = (
    formValues: RegistrationFormValues,
  ) => {
    const allErrors: FieldErrors =
      {}

    const steps: WizardStep[] = [
      1,
      2,
      3,
    ]

    for (const step of steps) {
      const validationStep =
        getValidationStep(step)

      const result =
        validateRegistrationStep(
          validationStep,
          formValues,
        )

      if (!result.success) {
        for (
          const issue of
            result.error.issues
        ) {
          const path =
            issue.path
              .map(String)
              .join(".")

          if (!allErrors[path]) {
            allErrors[path] =
              issue.message
          }
        }

        setCurrentStep(step)
        setFieldErrors(
          allErrors,
        )

        return false
      }
    }

    setFieldErrors({})

    return true
  }

  /* =========================================================
     VALIDATE CURRENT STEP
  ========================================================= */

  const validateStep = (
    step: WizardStep,
  ) => {
    const validationStep =
      getValidationStep(step)

    const result =
      validateRegistrationStep(
        validationStep,
        values,
      )

    if (result.success) {
      setFieldErrors({})

      return true
    }

    setValidationErrors(
      result.error.issues,
    )

    return false
  }

  /* =========================================================
     NEXT
  ========================================================= */

  const handleNext = () => {
    if (
      !validateStep(
        currentStep,
      )
    ) {
      return
    }

    if (currentStep < 3) {
      /*
       * Moving from Subscription
       * to Payment.
       */
      if (
        currentStep === 2
      ) {
        form.setFieldValue(
          "payment_amount",
          registrationTotal,
        )
      }

      setCurrentStep(
        (currentStep + 1) as WizardStep,
      )
    }
  }

  /* =========================================================
     PREVIOUS
  ========================================================= */

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(
        (currentStep - 1) as WizardStep,
      )

      setFieldErrors({})
    }
  }

  /* =========================================================
     SELECTION TYPE CHANGE
  ========================================================= */

  const handleSelectionTypeChange = (
    type: "plan" | "bundle",
  ) => {
    form.setFieldValue(
      "selection_type",
      type,
    )

    form.setFieldValue(
      "plan_id",
      "",
    )

    form.setFieldValue(
      "bundle_id",
      "",
    )

    form.setFieldValue(
      "bundle_type",
      null,
    )

    form.setFieldValue(
      "price",
      null,
    )

    form.setFieldValue(
      "gst_percentage",
      null,
    )

    form.setFieldValue(
      "total_price",
      null,
    )

    form.setFieldValue(
      "duration_months",
      null,
    )

    form.setFieldValue(
      "amc_price",
      null,
    )

    form.setFieldValue(
      "amc_duration_months",
      null,
    )

    form.setFieldValue(
      "amc_gst_percentage",
      null,
    )

    form.setFieldValue(
      "amc_start_date",
      "",
    )

    form.setFieldValue(
      "amc_end_date",
      "",
    )

    form.setFieldValue(
      "payment_amount",
      null,
    )

    setFieldErrors({})
  }

  /* =========================================================
     PLAN CHANGE
  ========================================================= */

  const handlePlanChange = (
    value: string,
  ) => {
    const plan =
      plans.find(
        (item) =>
          String(item.id) ===
          value,
      )

    form.setFieldValue(
      "plan_id",
      value,
    )

    form.setFieldValue(
      "bundle_id",
      "",
    )

    form.setFieldValue(
      "bundle_type",
      null,
    )

    if (!plan) {
      form.setFieldValue(
        "price",
        null,
      )

      form.setFieldValue(
        "gst_percentage",
        null,
      )

      form.setFieldValue(
        "total_price",
        null,
      )

      form.setFieldValue(
        "duration_months",
        null,
      )

      form.setFieldValue(
        "payment_amount",
        null,
      )

      clearFieldError(
        "plan_id",
      )

      return
    }

    const total =
      Number(
        (
          plan.price +
          (plan.price *
            plan.gst_percentage) /
            100
        ).toFixed(2),
      )

    form.setFieldValue(
      "price",
      plan.price,
    )

    form.setFieldValue(
      "gst_percentage",
      plan.gst_percentage,
    )

    form.setFieldValue(
      "total_price",
      total,
    )

    form.setFieldValue(
      "duration_months",
      plan.duration_months,
    )

    form.setFieldValue(
      "payment_amount",
      total,
    )

    /*
     * Plan does not use AMC.
     */
    form.setFieldValue(
      "amc_price",
      null,
    )

    form.setFieldValue(
      "amc_duration_months",
      null,
    )

    form.setFieldValue(
      "amc_gst_percentage",
      null,
    )

    form.setFieldValue(
      "amc_start_date",
      "",
    )

    form.setFieldValue(
      "amc_end_date",
      "",
    )

    clearFieldError(
      "plan_id",
    )
  }

  /* =========================================================
     BUNDLE CHANGE
  ========================================================= */

  const handleBundleChange = (
    value: string,
  ) => {
    const bundle =
      bundles.find(
        (item) =>
          String(item.id) ===
          value,
      )

    form.setFieldValue(
      "bundle_id",
      value,
    )

    form.setFieldValue(
      "plan_id",
      "",
    )

    if (!bundle) {
      form.setFieldValue(
        "bundle_type",
        null,
      )

      form.setFieldValue(
        "price",
        null,
      )

      form.setFieldValue(
        "gst_percentage",
        null,
      )

      form.setFieldValue(
        "total_price",
        null,
      )

      form.setFieldValue(
        "duration_months",
        null,
      )

      form.setFieldValue(
        "payment_amount",
        null,
      )

      clearFieldError(
        "bundle_id",
      )

      return
    }

    const total =
      Number(
        (
          bundle.price +
          (bundle.price *
            bundle.gst_percentage) /
            100
        ).toFixed(2),
      )

    form.setFieldValue(
      "bundle_type",
      bundle.bundle_type,
    )

    form.setFieldValue(
      "price",
      bundle.price,
    )

    form.setFieldValue(
      "gst_percentage",
      bundle.gst_percentage,
    )

    form.setFieldValue(
      "total_price",
      total,
    )

    form.setFieldValue(
      "payment_amount",
      total,
    )

    if (
      bundle.bundle_type ===
      "subscription"
    ) {
      form.setFieldValue(
        "duration_months",
        bundle.duration_months,
      )

      form.setFieldValue(
        "amc_price",
        null,
      )

      form.setFieldValue(
        "amc_duration_months",
        null,
      )

      form.setFieldValue(
        "amc_gst_percentage",
        null,
      )

      form.setFieldValue(
        "amc_start_date",
        "",
      )

      form.setFieldValue(
        "amc_end_date",
        "",
      )
    } else {
      /*
       * Perpetual bundle:
       * no subscription duration.
       */

      form.setFieldValue(
        "duration_months",
        null,
      )

      /*
       * Default AMC values.
       */

      form.setFieldValue(
        "amc_price",
        0,
      )

      form.setFieldValue(
        "amc_duration_months",
        null,
      )

      form.setFieldValue(
        "amc_gst_percentage",
        18,
      )

      form.setFieldValue(
        "amc_start_date",
        "",
      )

      form.setFieldValue(
        "amc_end_date",
        "",
      )
    }

    clearFieldError(
      "bundle_id",
    )
  }

  /* =========================================================
     ERROR MESSAGE
  ========================================================= */

  const ErrorMessage = ({
    name,
  }: {
    name: string
  }) => {
    const error =
      getError(name)

    if (!error) {
      return null
    }

    return (
      <FieldError>
        {error}
      </FieldError>
    )
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          Organization Registration
        </CardTitle>

        {/* =====================================================
            STEP INDICATOR
        ====================================================== */}

        <div className="flex items-center justify-between pt-4">
          {[
            {
              id: 1,
              label: "Organization",
            },
            {
              id: 2,
              label: "Subscription",
            },
            {
              id: 3,
              label: "Payment",
            },
          ].map(
            (
              step,
              index,
            ) => (
              <div
                key={step.id}
                className="flex flex-1 items-center"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium ${
                      currentStep >=
                      step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {currentStep >
                    step.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>

                  <span className="mt-1 text-xs">
                    {step.label}
                  </span>
                </div>

                {index < 2 && (
                  <div className="mx-2 h-px flex-1 bg-border" />
                )}
              </div>
            ),
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* =====================================================
            STEP 1 - ORGANIZATION
        ====================================================== */}

        {currentStep === 1 && (
          <FieldGroup>
            {/* ORGANIZATION NAME */}

            <form.Field
              name="organization_name"
              children={(field) => (
                <Field>
                  <FieldLabel>
                    Organization Name{" "}
                    <span className="text-destructive">
                      *
                    </span>
                  </FieldLabel>

                  <Input
                    value={
                      field.state.value
                    }
                    onChange={(event) => {
                      field.handleChange(
                        event.target.value,
                      )

                      clearFieldError(
                        "organization_name",
                      )
                    }}
                    placeholder="Enter organization name"
                  />

                  <ErrorMessage
                    name="organization_name"
                  />
                </Field>
              )}
            />

            {/* CONTACT PERSON */}

            <form.Field
              name="contact_person_name"
              children={(field) => (
                <Field>
                  <FieldLabel>
                    Contact Person Name{" "}
                    <span className="text-destructive">
                      *
                    </span>
                  </FieldLabel>

                  <Input
                    value={
                      field.state.value
                    }
                    onChange={(event) => {
                      field.handleChange(
                        event.target.value,
                      )

                      clearFieldError(
                        "contact_person_name",
                      )
                    }}
                    placeholder="Enter contact person name"
                  />

                  <ErrorMessage
                    name="contact_person_name"
                  />
                </Field>
              )}
            />

            {/* EMAIL */}

            <form.Field
              name="email"
              children={(field) => (
                <Field>
                  <FieldLabel>
                    Email{" "}
                    <span className="text-destructive">
                      *
                    </span>
                  </FieldLabel>

                  <Input
                    type="email"
                    value={
                      field.state.value
                    }
                    onChange={(event) => {
                      field.handleChange(
                        event.target.value,
                      )

                      clearFieldError(
                        "email",
                      )
                    }}
                    placeholder="organization@example.com"
                  />

                  <FieldDescription>
                    This email will be used
                    for the organization admin.
                  </FieldDescription>

                  <ErrorMessage
                    name="email"
                  />
                </Field>
              )}
            />

            {/* PHONE */}

            <form.Field
              name="phone"
              children={(field) => (
                <Field>
                  <FieldLabel>
                    Phone{" "}
                    <span className="text-destructive">
                      *
                    </span>
                  </FieldLabel>

                  <Input
                    type="tel"
                    value={
                      field.state.value
                    }
                    onChange={(event) => {
                      field.handleChange(
                        event.target.value,
                      )

                      clearFieldError(
                        "phone",
                      )
                    }}
                    placeholder="9876543210"
                  />

                  <FieldDescription>
                    Enter a valid phone number.
                  </FieldDescription>

                  <ErrorMessage
                    name="phone"
                  />
                </Field>
              )}
            />

            {/* ADMIN INFO */}

            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="font-medium">
                Organization Admin
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                The contact person will be
                created as the Organization
                Admin after registration.
              </p>
            </div>
          </FieldGroup>
        )}

        {/* =====================================================
            STEP 2 - SUBSCRIPTION
        ====================================================== */}

        {currentStep === 2 && (
          <FieldGroup>
            {/* SELECTION TYPE */}

            <form.Field
              name="selection_type"
              children={(field) => (
                <Field>
                  <FieldLabel>
                    Selection Type{" "}
                    <span className="text-destructive">
                      *
                    </span>
                  </FieldLabel>

                  <Select
                    value={
                      field.state.value
                    }
                    onValueChange={(value) => {
                      if (
                        value === "plan" ||
                        value === "bundle"
                      ) {
                        handleSelectionTypeChange(
                          value,
                        )
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="plan">
                        Subscription Plan
                      </SelectItem>

                      <SelectItem value="bundle">
                        Subscription Bundle
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <ErrorMessage
                    name="selection_type"
                  />
                </Field>
              )}
            />

            {/* =================================================
                PLAN
            ================================================== */}

            {values.selection_type ===
              "plan" && (
              <form.Field
                name="plan_id"
                children={(field) => (
                  <Field>
                    <FieldLabel>
                      Subscription Plan{" "}
                      <span className="text-destructive">
                        *
                      </span>
                    </FieldLabel>

                    <Select
                      value={
                        field.state.value
                      }
                      onValueChange={(value) => {
                        if (
                          value !== null
                        ) {
                          handlePlanChange(
                            value,
                          )
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>

                      <SelectContent>
                        {plans.map(
                          (plan) => (
                            <SelectItem
                              key={
                                plan.id
                              }
                              value={String(
                                plan.id,
                              )}
                            >
                              {
                                plan.plan_name
                              }{" "}
                              — ₹
                              {plan.price.toLocaleString(
                                "en-IN",
                              )}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>

                    <ErrorMessage
                      name="plan_id"
                    />
                  </Field>
                )}
              />
            )}

            {/* =================================================
                BUNDLE
            ================================================== */}

            {values.selection_type ===
              "bundle" && (
              <>
                <form.Field
                  name="bundle_id"
                  children={(field) => (
                    <Field>
                      <FieldLabel>
                        Subscription Bundle{" "}
                        <span className="text-destructive">
                          *
                        </span>
                      </FieldLabel>

                      <Select
                        value={
                          field.state.value
                        }
                        onValueChange={(value) => {
                          if (
                            value !==
                            null
                          ) {
                            handleBundleChange(
                              value,
                            )
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select bundle" />
                        </SelectTrigger>

                        <SelectContent>
                          {bundles.map(
                            (
                              bundle,
                            ) => (
                              <SelectItem
                                key={
                                  bundle.id
                                }
                                value={String(
                                  bundle.id,
                                )}
                              >
                                {
                                  bundle.bundle_name
                                }{" "}
                                — ₹
                                {bundle.price.toLocaleString(
                                  "en-IN",
                                )}{" "}
                                (
                                {
                                  bundle.bundle_type
                                }
                                )
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>

                      <ErrorMessage
                        name="bundle_id"
                      />
                    </Field>
                  )}
                />

                {/* BUNDLE DETAILS */}

                {selectedBundle && (
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="grid gap-4 sm:grid-cols-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Bundle
                        </p>

                        <p className="font-medium">
                          {
                            selectedBundle.bundle_name
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Type
                        </p>

                        <p className="font-medium capitalize">
                          {
                            selectedBundle.bundle_type
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Price
                        </p>

                        <p className="font-medium">
                          ₹
                          {selectedBundle.price.toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                            },
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Duration
                        </p>

                        <p className="font-medium">
                          {selectedBundle.duration_months
                            ? `${selectedBundle.duration_months} months`
                            : "Perpetual"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* PERPETUAL BUNDLE AMC NOTICE */}

                {values.bundle_type ===
                  "perpetual" && (
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="font-medium">
                      AMC Required
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      This is a perpetual bundle.
                      AMC details will be handled
                      automatically according to
                      the selected bundle configuration.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* =================================================
                AUTOMATIC PRICING SUMMARY
            ================================================== */}

            {pricingItem && (
              <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                <h3 className="mb-4 font-semibold">
                  Subscription Summary
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Price
                    </span>

                    <span>
                      ₹
                      {registrationPrice.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        },
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      GST (
                      {
                        registrationGstPercentage
                      }
                      %)
                    </span>

                    <span>
                      ₹
                      {gstAmount.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        },
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between border-t pt-2 text-base font-semibold">
                    <span>
                      Registration Total
                    </span>

                    <span>
                      ₹
                      {registrationTotal.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        },
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </FieldGroup>
        )}

        {/* =====================================================
            STEP 3 - PAYMENT
        ====================================================== */}

        {currentStep === 3 && (
          <FieldGroup>
            {/* PAYMENT METHOD */}

            <form.Field
              name="payment_method"
              children={(field) => (
                <Field>
                  <FieldLabel>
                    Payment Method
                  </FieldLabel>

                  <Select
                    value={
                      field.state.value
                    }
                    onValueChange={(value) => {
                      if (
                        value ===
                        "manual"
                      ) {
                        field.handleChange(
                          "manual",
                        )
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="manual">
                        Manual Payment
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            {/* PAYMENT REFERENCE */}

            <form.Field
              name="payment_reference"
              children={(field) => (
                <Field>
                  <FieldLabel>
                    Payment Reference{" "}
                    <span className="text-destructive">
                      *
                    </span>
                  </FieldLabel>

                  <Input
                    value={
                      field.state.value
                    }
                    onChange={(event) => {
                      field.handleChange(
                        event.target.value,
                      )

                      clearFieldError(
                        "payment_reference",
                      )
                    }}
                    placeholder="Transaction / receipt number"
                  />

                  <ErrorMessage
                    name="payment_reference"
                  />
                </Field>
              )}
            />

            {/* PAYMENT DATE */}

            <form.Field
              name="payment_date"
              children={(field) => (
                <Field>
                  <FieldLabel>
                    Payment Date{" "}
                    <span className="text-destructive">
                      *
                    </span>
                  </FieldLabel>

                  <Input
                    type="date"
                    value={
                      field.state.value
                    }
                    onChange={(event) => {
                      field.handleChange(
                        event.target.value,
                      )

                      clearFieldError(
                        "payment_date",
                      )
                    }}
                  />

                  <ErrorMessage
                    name="payment_date"
                  />
                </Field>
              )}
            />

            {/* =================================================
                PAYMENT AMOUNT
                Automatically set from registration total.
            ================================================== */}

            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Payment Amount
                </span>

                <span className="text-lg font-semibold">
                  ₹
                  {registrationTotal.toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                    },
                  )}
                </span>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Payment amount is automatically
                calculated from the selected
                plan or bundle.
              </p>
            </div>
          </FieldGroup>
        )}
      </CardContent>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <CardFooter className="flex justify-between">
        {/* PREVIOUS */}

        <Button
          type="button"
          variant="outline"
          onClick={
            handlePrevious
          }
          disabled={
            currentStep === 1 ||
            submitting
          }
        >
          <ChevronLeft className="mr-2 h-4 w-4" />

          Previous
        </Button>

        {/* NEXT / COMPLETE */}

        {currentStep < 3 ? (
          <Button
            type="button"
            onClick={
              handleNext
            }
            disabled={
              submitting
            }
          >
            Next

            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            disabled={
              submitting
            }
            onClick={() => {
              const valid =
                validateAllSteps(
                  values,
                )

              if (!valid) {
                return
              }

              form.handleSubmit()
            }}
          >
            {submitting
              ? "Submitting..."
              : "Complete Registration"}

            {!submitting && (
              <Check className="ml-2 h-4 w-4" />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}