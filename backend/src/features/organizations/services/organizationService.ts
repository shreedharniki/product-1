import {
  getOrganizations,
} from "../repositories/organizationRepository"

export const fetchOrganizations = async () => {
  const organizations = await getOrganizations()

  return organizations
}