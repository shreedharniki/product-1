// import db from "../../../config/database"

// export const getOrganizations = async () => {
//   let conn

//   try {
//     conn = await db.getConnection()

//     const [rows] = await conn.execute<any[]>(`
//       SELECT
//        *
//       FROM organizations
 
//     `)

//     return rows
//   } finally {
//     if (conn) {
//       conn.release()
//     }
//   }
// }

import type { RowDataPacket } from "mysql2"

import db from "../../../config/database"

export interface OrganizationRow
  extends RowDataPacket {
  id: number
  or_name: string
 
  org_status: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export const getOrganizations = async (): Promise<
  OrganizationRow[]
> => {
  let conn

  try {
    conn = await db.getConnection()

    const [rows] =
      await conn.execute<OrganizationRow[]>(`
        SELECT
          *
        FROM organizations
      `)

    return rows
  } finally {
    if (conn) {
      conn.release()
    }
  }
}