export interface Organization {
  id: number
  name: string
  legal_name: string | null
  email: string
  phone: string | null
  city: string | null
  state: string | null
  country: string | null
  status: string
  created_at: Date | string
}

export interface CreateOrganizationInput {
  name: string
  legal_name?: string
  email: string
  phone?: string
  city?: string
  state?: string
  country?: string
}

export interface UpdateOrganizationInput {
  name?: string
  legal_name?: string
  email?: string
  phone?: string
  city?: string
  state?: string
  country?: string
  status?: "active" | "inactive"
}