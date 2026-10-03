// import type { PoolConnection } from "mysql2/promise"

// import {
//   createTemple,
//   findAllTemples,
//   findTempleById,
//   softDeleteTemple,
//   updateTemple,
// } from "../repositories/templeRepository"

// import type {
//   CreateTemplePayload,
//   UpdateTemplePayload,
// } from "../templeTypes"

// function generateSlug(name: string): string {
//   return name
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "")
// }

// export async function createTempleService(
//   connection: PoolConnection,
//   organizationId: number,
//   data: CreateTemplePayload,
// ) {
//   const slug =
//     data.temp_slug ||
//     generateSlug(data.temp_name)

//   const templeId = await createTemple(
//     connection,
//     organizationId,
//     {
//       ...data,
//       temp_slug: slug,
//     },
//   )

//   return findTempleById(
//     connection,
//     organizationId,
//     templeId,
//   )
// }

// export async function getTemplesService(
//   connection: PoolConnection,
//   organizationId: number,
// ) {
//   return findAllTemples(
//     connection,
//     organizationId,
//   )
// }

// export async function getTempleService(
//   connection: PoolConnection,
//   organizationId: number,
//   id: number,
// ) {
//   return findTempleById(
//     connection,
//     organizationId,
//     id,
//   )
// }

// export async function updateTempleService(
//   connection: PoolConnection,
//   organizationId: number,
//   id: number,
//   data: UpdateTemplePayload,
// ) {
//   if (data.temp_name && !data.temp_slug) {
//     data.temp_slug = generateSlug(data.temp_name)
//   }

//   const updated = await updateTemple(
//     connection,
//     organizationId,
//     id,
//     data,
//   )

//   if (!updated) {
//     return null
//   }

//   return findTempleById(
//     connection,
//     organizationId,
//     id,
//   )
// }

// export async function deleteTempleService(
//   connection: PoolConnection,
//   organizationId: number,
//   id: number,
// ) {
//   return softDeleteTemple(
//     connection,
//     organizationId,
//     id,
//   )
// }




import type { PoolConnection } from "mysql2/promise"

import {
  countActiveTemples,
  createTemple,
  findAllTemples,
  findTempleById,
  getOrganizationTempleLimit,
  softDeleteTemple,
  updateTemple,
} from "../repositories/templeRepository"

import type {
  CreateTemplePayload,
  UpdateTemplePayload,
} from "../templeTypes"

/**
 * Generate a URL-friendly slug from temple name.
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Create a temple after checking the organization's
 * maximum temple limit.
 */
export async function createTempleService(
  connection: PoolConnection,
  organizationId: number,
  data: CreateTemplePayload,
) {
  /*
   * 1. Check organization temple limit.
   */
  const maxTemples = await getOrganizationTempleLimit(
    connection,
    organizationId,
  )

  /*
   * 2. Count currently active temples.
   */
  const currentTemples = await countActiveTemples(
    connection,
    organizationId,
  )

  /*
   * 3. Prevent creation if the limit is reached.
   */
  if (currentTemples >= maxTemples) {
    throw new Error(
      `Temple limit reached. Your organization can have a maximum of ${maxTemples} temple(s).`,
    )
  }

  /*
   * 4. Generate slug if the user didn't provide one.
   */
  const slug =
    data.temp_slug ||
    generateSlug(data.temp_name)

  /*
   * 5. Create the temple.
   */
  const templeId = await createTemple(
    connection,
    organizationId,
    {
      ...data,
      temp_slug: slug,
    },
  )

  /*
   * 6. Return the newly created temple.
   */
  return findTempleById(
    connection,
    organizationId,
    templeId,
  )
}

/**
 * Get all temples for an organization.
 */
export async function getTemplesService(
  connection: PoolConnection,
  organizationId: number,
) {
  return findAllTemples(
    connection,
    organizationId,
  )
}

/**
 * Get one temple.
 */
export async function getTempleService(
  connection: PoolConnection,
  organizationId: number,
  id: number,
) {
  return findTempleById(
    connection,
    organizationId,
    id,
  )
}

/**
 * Update a temple.
 */
export async function updateTempleService(
  connection: PoolConnection,
  organizationId: number,
  id: number,
  data: UpdateTemplePayload,
) {
  /*
   * Generate a new slug when temple name changes
   * and slug was not explicitly provided.
   */
  if (data.temp_name && !data.temp_slug) {
    data.temp_slug = generateSlug(data.temp_name)
  }

  const updated = await updateTemple(
    connection,
    organizationId,
    id,
    data,
  )

  if (!updated) {
    return null
  }

  return findTempleById(
    connection,
    organizationId,
    id,
  )
}

/**
 * Soft delete a temple.
 */
export async function deleteTempleService(
  connection: PoolConnection,
  organizationId: number,
  id: number,
) {
  return softDeleteTemple(
    connection,
    organizationId,
    id,
  )
}

