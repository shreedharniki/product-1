import type {
  ResultSetHeader,
  RowDataPacket,
  
} from "mysql2"

import pool from "../../../config/database"

import type {
  CreateModuleData,
    UpdateModuleData,
} from "../modulesTypes"

export interface ModuleRow extends RowDataPacket {
  id: number
  module_code: string
  module_name: string
  module_type: string
  capacity_type: string | null
  consumable_type: string | null
  display_order: number
  status: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

// ============================
// Get Modules
// ============================

export const getModules = async (): Promise<ModuleRow[]> => {
  let conn

  try {
    conn = await pool.getConnection()

    const [rows] = await conn.execute<ModuleRow[]>(`
      SELECT
        id,
        module_code,
        module_name,
        module_type,
        capacity_type,
        consumable_type,
        display_order,
        status,
        created_at,
        updated_at,
        deleted_at
      FROM modules
      WHERE deleted_at IS NULL
      ORDER BY display_order ASC
    `)

    return rows
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

// ============================
// Get Module By ID
// ============================

export const getModuleById = async (
  id: number,
): Promise<ModuleRow | null> => {
  let conn

  try {
    conn = await pool.getConnection()

    const [rows] = await conn.execute<ModuleRow[]>(
      `
        SELECT
          id,
          module_code,
          module_name,
          module_type,
          capacity_type,
          consumable_type,
          display_order,
          status,
          created_at,
          updated_at,
          deleted_at
        FROM modules
        WHERE id = ?
          AND deleted_at IS NULL
        LIMIT 1
      `,
      [id],
    )

    return rows[0] ?? null
  } finally {
    if (conn) {
      conn.release()
    }
  }
}
// ============================
// Create Module
// ============================

export const insertModule = async (
  data: CreateModuleData,
): Promise<number> => {
  let conn

  try {
    conn = await pool.getConnection()

    const [result] = await conn.execute<ResultSetHeader>(
      `
        INSERT INTO modules (
          module_code,
          module_name,
          module_type,
          capacity_type,
          consumable_type,
          display_order,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        data.module_code,
        data.module_name,
        data.module_type,
        data.capacity_type ?? null,
        data.consumable_type ?? null,
        data.display_order ?? 1,
        data.status ?? "active",
      ],
    )

    return result.insertId
  } finally {
    if (conn) {
      conn.release()
    }
  }
}



// ============================
// Update Module
// ============================

export const updateModule = async (
  id: number,
  data: UpdateModuleData,
): Promise<boolean> => {
  let conn

  try {
    conn = await pool.getConnection()

    const fields: string[] = []
    const values: (
  | string
  | number
  | null
  | boolean
  | Date
)[] = []

    if (data.module_code !== undefined) {
      fields.push("module_code = ?")
      values.push(data.module_code)
    }

    if (data.module_name !== undefined) {
      fields.push("module_name = ?")
      values.push(data.module_name)
    }

    if (data.module_type !== undefined) {
      fields.push("module_type = ?")
      values.push(data.module_type)
    }

    if (data.capacity_type !== undefined) {
      fields.push("capacity_type = ?")
      values.push(data.capacity_type)
    }

    if (data.consumable_type !== undefined) {
      fields.push("consumable_type = ?")
      values.push(data.consumable_type)
    }

    if (data.display_order !== undefined) {
      fields.push("display_order = ?")
      values.push(data.display_order)
    }

    if (data.status !== undefined) {
      fields.push("status = ?")
      values.push(data.status)
    }

    if (fields.length === 0) {
      return false
    }

    values.push(id)

    const [result] = await conn.execute<ResultSetHeader>(
      `
        UPDATE modules
        SET ${fields.join(", ")}
        WHERE id = ?
          AND deleted_at IS NULL
      `,
      values,
    )

    return result.affectedRows > 0
  } finally {
    if (conn) {
      conn.release()
    }
  }
}

// ============================
// Soft Delete Module
// ============================

export const softDeleteModule = async (
  id: number,
): Promise<boolean> => {
  let conn

  try {
    conn = await pool.getConnection()

    const [result] = await conn.execute<ResultSetHeader>(
      `
        UPDATE modules
        SET deleted_at = NOW()
        WHERE id = ?
          AND deleted_at IS NULL
      `,
      [id],
    )

    return result.affectedRows > 0
  } finally {
    if (conn) {
      conn.release()
    }
  }
}