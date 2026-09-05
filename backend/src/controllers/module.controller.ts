import { Request, Response } from "express";
import db from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// ============================
// Get All Modules
// ============================

export const getModules = async (
  req: Request,
  res: Response
) => {
  let conn;

  try {
    conn = await db.getConnection();

    const [rows] = await conn.execute<RowDataPacket[]>(`
      SELECT *
      FROM modules
      WHERE deleted_at IS NULL
      ORDER BY display_order ASC
    `);

    return res.json({
      success: true,
      data: rows,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  } finally {
    if (conn) conn.release();
  }
};

// ============================
// Get Module By ID
// ============================

export const getModuleById = async (
  req: Request,
  res: Response
) => {
  let conn;

  try {
    conn = await db.getConnection();

    const { id } = req.params;

    const [rows] = await conn.execute<RowDataPacket[]>(
      `
      SELECT *
      FROM modules
      WHERE id=?
      AND deleted_at IS NULL
      `,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    return res.json({
      success: true,
      data: rows[0],
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  } finally {
    if (conn) conn.release();
  }
};

// ============================
// Create Module
// ============================

export const createModule = async (
  req: Request,
  res: Response
) => {

  let conn;

  try {

    conn = await db.getConnection();

    const {
      code,
      module_name,
      module_type,
      capacity_type,
      consumable_type,
      duration_months,
      credits_per_unit,
      unit_price,
      status,
      display_order,
    } = req.body;

    const [result] =
      await conn.execute<ResultSetHeader>(
        `
        INSERT INTO modules
        (
          code,
          module_name,
          module_type,
          capacity_type,
          consumable_type,
          duration_months,
          credits_per_unit,
          unit_price,
          status,
          display_order
        )
        VALUES (?,?,?,?,?,?,?,?,?,?)
        `,
        [
          code,
          module_name,
          module_type,
          capacity_type,
          consumable_type,
          duration_months,
          credits_per_unit,
          unit_price,
          status,
          display_order,
        ]
      );

    return res.status(201).json({
      success: true,
      message: "Module Created",
      id: result.insertId,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  } finally {
    if (conn) conn.release();
  }
};

// ============================
// Update Module
// ============================




export const updateModule = async (
  req: Request,
  res: Response
) => {
  let conn;

  try {
    conn = await db.getConnection();

    const { id } = req.params;

    const {
      code,
      module_name,
      module_type,
      capacity_type,
      consumable_type,
      duration_months,
      credits_per_unit,
      unit_price,
      status,
      display_order,
    } = req.body;

    await conn.execute(
      `
      UPDATE modules
      SET
        code=?,
        module_name=?,
        module_type=?,
        capacity_type=?,
        consumable_type=?,
        duration_months=?,
        credits_per_unit=?,
        unit_price=?,
        status=?,
        display_order=?,
        updated_at=NOW()
      WHERE id=?
      `,
      [
        code,
        module_name,
        module_type,
        capacity_type,
        consumable_type,
        duration_months,
        credits_per_unit,
        unit_price,
        status,
        display_order,
        id,
      ]
    );

    const [rows]: any = await conn.query(
      "SELECT * FROM modules WHERE id=?",
      [id]
    );

    return res.json({
      success: true,
      message: "Module Updated Successfully",
      data: rows[0],
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  } finally {
    if (conn) conn.release();
  }
};
// ============================
// Delete Module
// ============================

export const deleteModule = async (
  req: Request,
  res: Response
) => {

  let conn;

  try {

    conn = await db.getConnection();

    const { id } = req.params;

    await conn.execute(
      `
      UPDATE modules
      SET deleted_at=NOW()
      WHERE id=?
      `,
      [id]
    );

    return res.json({
      success: true,
      message: "Module Deleted",
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  } finally {
    if (conn) conn.release();
  }
};