

export type RegistrationSelectionType =
  | "plan"
  | "bundle"

export type RegistrationPaymentMethod =
  | "manual"

export type RegistrationBundleType =
  | "subscription"
  | "perpetual"

export interface RegistrationOrganization {
  organization_name: string
  contact_person_name: string
  email: string
  phone: string
}

export interface RegistrationSelection {
  type: RegistrationSelectionType
  plan_id: number | null
  bundle_id: number | null
  price: number
  gst_percentage: number
  total_price: number
  duration_months: number | null
}

export interface RegistrationAmc {
  price: number | null
  duration_months: number | null
  gst_percentage: number | null
  start_date: string | null
  end_date: string | null
}

export interface RegistrationPayment {
  payment_method: RegistrationPaymentMethod
  payment_reference: string
  payment_date: string
  payment_amount: number
  payment_notes: string
}

export interface CreateRegistrationPayload {
  organization: RegistrationOrganization
  selection: RegistrationSelection
  amc: RegistrationAmc
  payment: RegistrationPayment
}

export interface RegistrationResult {
  organization_id: number
  user_id: number
  order_id: number
  subscription_ids: number[]
}

export interface RegistrationFormValues {
  // Step 1
  organization_name: string
  contact_person_name: string
  email: string
  phone: string

  // Step 2
  selection_type: RegistrationSelectionType
  plan_id: string
  bundle_id: string
  bundle_type: RegistrationBundleType | null

  // Step 3
  price: number | null
  gst_percentage: number | null
  total_price: number | null
  duration_months: number | null

  // AMC
  amc_price: number | null
  amc_duration_months: number | null
  amc_gst_percentage: number | null
  amc_start_date: string
  amc_end_date: string

  // Step 4
  payment_method: RegistrationPaymentMethod
  payment_reference: string
  payment_date: string
  payment_amount: number | null
  payment_notes: string
}

export interface RegistrationPlanOption {
  id: number
  plan_name: string
  plan_code?: string
  plan_type?: "subscription" | "perpetual"
  price: number
  gst_percentage: number
  duration_months: number | null
}

export interface RegistrationBundleOption {
  id: number
  bundle_name: string
  bundle_code?: string
  bundle_type: RegistrationBundleType
  price: number
  gst_percentage: number
  duration_months: number | null
}

export interface RegistrationState {
  loading: boolean
  submitting: boolean
  error: string | null
  result: RegistrationResult | null
}