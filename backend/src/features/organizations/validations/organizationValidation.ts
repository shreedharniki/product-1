import type {
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from "../organizationTypes"

export interface OrganizationValidationErrors {
  name?: string
  legal_name?: string
  email?: string
  phone?: string
  city?: string
  state?: string
  country?: string
  status?: string
}

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const phoneRegex =
  /^[0-9+\-\s()]{7,20}$/

export const validateCreateOrganization = (
  data: CreateOrganizationInput,
): OrganizationValidationErrors => {
  const errors: OrganizationValidationErrors = {}

  if (!data.name?.trim()) {
    errors.name = "Organization name is required"
  } else if (data.name.trim().length < 2) {
    errors.name =
      "Organization name must be at least 2 characters"
  } else if (data.name.trim().length > 150) {
    errors.name =
      "Organization name must not exceed 150 characters"
  }

  if (!data.email?.trim()) {
    errors.email = "Email is required"
  } else if (!emailRegex.test(data.email.trim())) {
    errors.email = "Enter a valid email address"
  }

  if (data.phone?.trim()) {
    if (!phoneRegex.test(data.phone.trim())) {
      errors.phone = "Enter a valid phone number"
    }
  }

  if (data.legal_name?.trim().length! > 200) {
    errors.legal_name =
      "Legal name must not exceed 200 characters"
  }

  if (data.city?.trim().length! > 100) {
    errors.city = "City must not exceed 100 characters"
  }

  if (data.state?.trim().length! > 100) {
    errors.state = "State must not exceed 100 characters"
  }

  if (data.country?.trim().length! > 100) {
    errors.country =
      "Country must not exceed 100 characters"
  }

  return errors
}

export const validateUpdateOrganization = (
  data: UpdateOrganizationInput,
): OrganizationValidationErrors => {
  const errors: OrganizationValidationErrors = {}

  if (
    data.name !== undefined &&
    !data.name.trim()
  ) {
    errors.name = "Organization name cannot be empty"
  }

  if (
    data.name !== undefined &&
    data.name.trim().length < 2
  ) {
    errors.name =
      "Organization name must be at least 2 characters"
  }

  if (
    data.email !== undefined &&
    !emailRegex.test(data.email.trim())
  ) {
    errors.email = "Enter a valid email address"
  }

  if (
    data.phone !== undefined &&
    data.phone.trim() &&
    !phoneRegex.test(data.phone.trim())
  ) {
    errors.phone = "Enter a valid phone number"
  }

  if (
    data.status !== undefined &&
    !["active", "inactive"].includes(data.status)
  ) {
    errors.status = "Invalid organization status"
  }

  return errors
}

export const hasValidationErrors = (
  errors: OrganizationValidationErrors,
): boolean => {
  return Object.keys(errors).length > 0
}