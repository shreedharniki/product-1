// import type { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise"

// import type {
//   CreateTemplePayload,
//   Temple,
//   UpdateTemplePayload,
// } from "../templeTypes"

// interface TempleRow extends Temple, RowDataPacket {}

// export async function createTemple(
//   connection: PoolConnection,
//   organizationId: number,
//   data: CreateTemplePayload,
// ): Promise<number> {
//   const sql = `
//     INSERT INTO temples (
//       organization_id,
//       temp_name,
//       temp_img_name,
//       temp_legal_name,
//       temp_registration_number,
//       temp_gst_number,
//       temp_email,
//       temp_phone,
//       temp_address_line1,
//       temp_address_line2,
//       temp_city,
//       temp_state,
//       temp_country,
//       temp_pincode,
//       temp_lat,
//       temp_lng,
//       temp_slug,
//       temp_is_primary,
//       temp_status,
//       temp_timezone
//     )
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `

//   const [result] = await connection.execute<ResultSetHeader>(
//     sql,
//     [
//       organizationId,
//       data.temp_name,
//       data.temp_img_name ?? null,
//       data.temp_legal_name ?? null,
//       data.temp_registration_number ?? null,
//       data.temp_gst_number ?? null,
//       data.temp_email ?? null,
//       data.temp_phone ?? null,
//       data.temp_address_line1 ?? null,
//       data.temp_address_line2 ?? null,
//       data.temp_city ?? null,
//       data.temp_state ?? null,
//       data.temp_country ?? "India",
//       data.temp_pincode ?? null,
//       data.temp_lat ?? null,
//       data.temp_lng ?? null,
//       data.temp_slug ?? null,
//       data.temp_is_primary ? 1 : 0,
//       data.temp_status ?? "active",
//       data.temp_timezone ?? "Asia/Kolkata",
//     ],
//   )

//   return result.insertId
// }

// export async function findAllTemples(
//   connection: PoolConnection,
//   organizationId: number,
// ): Promise<Temple[]> {
//   const sql = `
//     SELECT
//       id,
//       organization_id,
//       temp_name,
//       temp_img_name,
//       temp_legal_name,
//       temp_registration_number,
//       temp_gst_number,
//       temp_email,
//       temp_phone,
//       temp_address_line1,
//       temp_address_line2,
//       temp_city,
//       temp_state,
//       temp_country,
//       temp_pincode,
//       temp_lat,
//       temp_lng,
//       temp_slug,
//       temp_is_primary,
//       temp_status,
//       temp_timezone,
//       created_at,
//       updated_at,
//       deleted_at
//     FROM temples
//     WHERE organization_id = ?
//       AND deleted_at IS NULL
//     ORDER BY id DESC
//   `

//   const [rows] = await connection.execute<TempleRow[]>(
//     sql,
//     [organizationId],
//   )

//   return rows
// }

// export async function findTempleById(
//   connection: PoolConnection,
//   organizationId: number,
//   id: number,
// ): Promise<Temple | null> {
//   const sql = `
//     SELECT
//       id,
//       organization_id,
//       temp_name,
//       temp_img_name,
//       temp_legal_name,
//       temp_registration_number,
//       temp_gst_number,
//       temp_email,
//       temp_phone,
//       temp_address_line1,
//       temp_address_line2,
//       temp_city,
//       temp_state,
//       temp_country,
//       temp_pincode,
//       temp_lat,
//       temp_lng,
//       temp_slug,
//       temp_is_primary,
//       temp_status,
//       temp_timezone,
//       created_at,
//       updated_at,
//       deleted_at
//     FROM temples
//     WHERE id = ?
//       AND organization_id = ?
//       AND deleted_at IS NULL
//     LIMIT 1
//   `

//   const [rows] = await connection.execute<TempleRow[]>(
//     sql,
//     [id, organizationId],
//   )

//   return rows[0] ?? null
// }

// export async function updateTemple(
//   connection: PoolConnection,
//   organizationId: number,
//   id: number,
//   data: UpdateTemplePayload,
// ): Promise<boolean> {
//   const fields: string[] = []
//   const values: unknown[] = []

//   const allowedFields: Array<keyof UpdateTemplePayload> = [
//     "temp_name",
//     "temp_img_name",
//     "temp_legal_name",
//     "temp_registration_number",
//     "temp_gst_number",
//     "temp_email",
//     "temp_phone",
//     "temp_address_line1",
//     "temp_address_line2",
//     "temp_city",
//     "temp_state",
//     "temp_country",
//     "temp_pincode",
//     "temp_lat",
//     "temp_lng",
//     "temp_slug",
//     "temp_is_primary",
//     "temp_status",
//     "temp_timezone",
//   ]

//   for (const field of allowedFields) {
//     if (data[field] !== undefined) {
//       fields.push(`${field} = ?`)

//       values.push(
//         field === "temp_is_primary"
//           ? data[field]
//             ? 1
//             : 0
//           : data[field],
//       )
//     }
//   }

//   if (fields.length === 0) {
//     return false
//   }

//   values.push(id)
//   values.push(organizationId)

//   const sql = `
//     UPDATE temples
//     SET ${fields.join(", ")}
//     WHERE id = ?
//       AND organization_id = ?
//       AND deleted_at IS NULL
//   `

//   const [result] = await connection.execute<ResultSetHeader>(
//     sql,
//     values,
//   )

//   return result.affectedRows > 0
// }

// export async function softDeleteTemple(
//   connection: PoolConnection,
//   organizationId: number,
//   id: number,
// ): Promise<boolean> {
//   const sql = `
//     UPDATE temples
//     SET deleted_at = CURRENT_TIMESTAMP
//     WHERE id = ?
//       AND organization_id = ?
//       AND deleted_at IS NULL
//   `

//   const [result] = await connection.execute<ResultSetHeader>(
//     sql,
//     [id, organizationId],
//   )

//   return result.affectedRows > 0
// }



import type {
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise"

import type {
  CreateTemplePayload,
  Temple,
  UpdateTemplePayload,
} from "../templeTypes"

interface TempleRow extends Temple, RowDataPacket {}

/**
 * Values accepted by mysql2 execute().
 */
type MySqlValue =
  | string
  | number
  | boolean
  | null
  | Date
  | Buffer

export async function createTemple(
  connection: PoolConnection,
  organizationId: number,
  data: CreateTemplePayload,
): Promise<number> {
  const sql = `
    INSERT INTO temples (
      organization_id,
      temp_name,
      temp_img_name,
      temp_legal_name,
      temp_registration_number,
      temp_gst_number,
      temp_email,
      temp_phone,
      temp_address_line1,
      temp_address_line2,
      temp_city,
      temp_state,
      temp_country,
      temp_pincode,
      temp_lat,
      temp_lng,
      temp_slug,
      temp_is_primary,
      temp_status,
      temp_timezone
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  const values: MySqlValue[] = [
    organizationId,
    data.temp_name,
    data.temp_img_name ?? null,
    data.temp_legal_name ?? null,
    data.temp_registration_number ?? null,
    data.temp_gst_number ?? null,
    data.temp_email ?? null,
    data.temp_phone ?? null,
    data.temp_address_line1 ?? null,
    data.temp_address_line2 ?? null,
    data.temp_city ?? null,
    data.temp_state ?? null,
    data.temp_country ?? "India",
    data.temp_pincode ?? null,
    data.temp_lat ?? null,
    data.temp_lng ?? null,
    data.temp_slug ?? null,
    data.temp_is_primary ? 1 : 0,
    data.temp_status ?? "active",
    data.temp_timezone ?? "Asia/Kolkata",
  ]

  const [result] = await connection.execute<ResultSetHeader>(
    sql,
    values,
  )

  return result.insertId
}

export async function findAllTemples(
  connection: PoolConnection,
  organizationId: number,
): Promise<Temple[]> {
  const sql = `
    SELECT
      id,
      organization_id,
      temp_name,
      temp_img_name,
      temp_legal_name,
      temp_registration_number,
      temp_gst_number,
      temp_email,
      temp_phone,
      temp_address_line1,
      temp_address_line2,
      temp_city,
      temp_state,
      temp_country,
      temp_pincode,
      temp_lat,
      temp_lng,
      temp_slug,
      temp_is_primary,
      temp_status,
      temp_timezone,
      created_at,
      updated_at,
      deleted_at
    FROM temples
    WHERE organization_id = ?
      AND deleted_at IS NULL
    ORDER BY id DESC
  `

  const [rows] = await connection.execute<TempleRow[]>(
    sql,
    [organizationId],
  )

  return rows
}

export async function findTempleById(
  connection: PoolConnection,
  organizationId: number,
  id: number,
): Promise<Temple | null> {
  const sql = `
    SELECT
      id,
      organization_id,
      temp_name,
      temp_img_name,
      temp_legal_name,
      temp_registration_number,
      temp_gst_number,
      temp_email,
      temp_phone,
      temp_address_line1,
      temp_address_line2,
      temp_city,
      temp_state,
      temp_country,
      temp_pincode,
      temp_lat,
      temp_lng,
      temp_slug,
      temp_is_primary,
      temp_status,
      temp_timezone,
      created_at,
      updated_at,
      deleted_at
    FROM temples
    WHERE id = ?
      AND organization_id = ?
      AND deleted_at IS NULL
    LIMIT 1
  `

  const [rows] = await connection.execute<TempleRow[]>(
    sql,
    [id, organizationId],
  )

  return rows[0] ?? null
}

export async function updateTemple(
  connection: PoolConnection,
  organizationId: number,
  id: number,
  data: UpdateTemplePayload,
): Promise<boolean> {
  const fields: string[] = []
  const values: MySqlValue[] = []

  const allowedFields: Array<keyof UpdateTemplePayload> = [
    "temp_name",
    "temp_img_name",
    "temp_legal_name",
    "temp_registration_number",
    "temp_gst_number",
    "temp_email",
    "temp_phone",
    "temp_address_line1",
    "temp_address_line2",
    "temp_city",
    "temp_state",
    "temp_country",
    "temp_pincode",
    "temp_lat",
    "temp_lng",
    "temp_slug",
    "temp_is_primary",
    "temp_status",
    "temp_timezone",
  ]

  for (const field of allowedFields) {
    const value = data[field]

    if (value !== undefined) {
      fields.push(`${field} = ?`)

      if (field === "temp_is_primary") {
        values.push(value ? 1 : 0)
      } else {
        /*
         * UpdateTemplePayload should contain only values
         * compatible with MySQL.
         */
        values.push(value as MySqlValue)
      }
    }
  }

  if (fields.length === 0) {
    return false
  }

  values.push(id)
  values.push(organizationId)

  const sql = `
    UPDATE temples
    SET ${fields.join(", ")}
    WHERE id = ?
      AND organization_id = ?
      AND deleted_at IS NULL
  `

  const [result] = await connection.execute<ResultSetHeader>(
    sql,
    values,
  )

  return result.affectedRows > 0
}

export async function softDeleteTemple(
  connection: PoolConnection,
  organizationId: number,
  id: number,
): Promise<boolean> {
  const sql = `
    UPDATE temples
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE id = ?
      AND organization_id = ?
      AND deleted_at IS NULL
  `

  const [result] = await connection.execute<ResultSetHeader>(
    sql,
    [id, organizationId],
  )

  return result.affectedRows > 0
}
