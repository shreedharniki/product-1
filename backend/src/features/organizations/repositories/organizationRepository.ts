import db from "../../../config/database"

export const getOrganizations = async () => {
  let conn

  try {
    conn = await db.getConnection()

    const [rows] = await conn.execute<any[]>(`
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