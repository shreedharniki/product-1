import type { PoolConnection } from "mysql2/promise"

import {
  createTemple,
  findAllTemples,
  findTempleById,
  softDeleteTemple,
  updateTemple,
} from "../repositories/templeRepository"

import type {
  CreateTemplePayload,
  UpdateTemplePayload,
} from "../templeTypes"

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export async function createTempleService(
  connection: PoolConnection,
  organizationId: number,
  data: CreateTemplePayload,
) {
  const slug =
    data.temp_slug ||
    generateSlug(data.temp_name)

  const templeId = await createTemple(
    connection,
    organizationId,
    {
      ...data,
      temp_slug: slug,
    },
  )

  return findTempleById(
    connection,
    organizationId,
    templeId,
  )
}

export async function getTemplesService(
  connection: PoolConnection,
  organizationId: number,
) {
  return findAllTemples(
    connection,
    organizationId,
  )
}

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

export async function updateTempleService(
  connection: PoolConnection,
  organizationId: number,
  id: number,
  data: UpdateTemplePayload,
) {
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