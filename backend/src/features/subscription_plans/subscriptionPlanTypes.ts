export type PlanType =
  | "users"
  | "sms"
  | "email"
  | "whatsapp"
  | "storage"
  | "custom";

export type PlanStatus = "active" | "inactive";

export interface SubscriptionPlan {
  id: number;
  module_id: number | null;
  plan_name: string;
  plan_code: string;
  plan_type: PlanType;
  plan_quantity: number;
  plan_duration_months: number;
  plan_price: number;
  plan_gst_percentage: number;
  plan_total_price: number;
  plan_amc_price: number;
  plan_amc_duration_months: number;
  plan_amc_gst_percentage: number;
  plan_amc_start_date: string | null;
  plan_status: PlanStatus;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateSubscriptionPlanPayload {
  module_id?: number | null;
  plan_name: string;
  plan_code: string;
  plan_type: PlanType;
  plan_quantity: number;
  plan_duration_months: number;
  plan_price: number;
  plan_gst_percentage: number;
  plan_total_price?: number;
  plan_amc_price: number;
  plan_amc_duration_months: number;
  plan_amc_gst_percentage: number;
  plan_amc_start_date?: string | null;
  plan_status?: PlanStatus;
}

export interface UpdateSubscriptionPlanPayload {
  module_id?: number | null;
  plan_name?: string;
  plan_code?: string;
  plan_type?: PlanType;
  plan_quantity?: number;
  plan_duration_months?: number;
  plan_price?: number;
  plan_gst_percentage?: number;
  plan_total_price?: number;
  plan_amc_price?: number;
  plan_amc_duration_months?: number;
  plan_amc_gst_percentage?: number;
  plan_amc_start_date?: string | null;
  plan_status?: PlanStatus;
}