"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteModule = exports.updateModule = exports.createModule = exports.getModuleById = exports.getModules = void 0;
const db_1 = __importDefault(require("../config/db"));
// ============================
// Get All Modules
// ============================
const getModules = async (req, res) => {
    let conn;
    try {
        conn = await db_1.default.getConnection();
        const [rows] = await conn.execute(`
      SELECT *
      FROM modules
      WHERE deleted_at IS NULL
      ORDER BY display_order ASC
    `);
        return res.json({
            success: true,
            data: rows,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.getModules = getModules;
// ============================
// Get Module By ID
// ============================
const getModuleById = async (req, res) => {
    let conn;
    try {
        conn = await db_1.default.getConnection();
        const { id } = req.params;
        const [rows] = await conn.execute(`
      SELECT *
      FROM modules
      WHERE id=?
      AND deleted_at IS NULL
      `, [id]);
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
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.getModuleById = getModuleById;
// ============================
// Create Module
// ============================
const createModule = async (req, res) => {
    let conn;
    try {
        conn = await db_1.default.getConnection();
        const { code, module_name, module_type, capacity_type, consumable_type, duration_months, credits_per_unit, unit_price, status, display_order, } = req.body;
        const [result] = await conn.execute(`
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
        `, [
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
        ]);
        return res.status(201).json({
            success: true,
            message: "Module Created",
            id: result.insertId,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.createModule = createModule;
// ============================
// Update Module
// ============================
const updateModule = async (req, res) => {
    let conn;
    try {
        conn = await db_1.default.getConnection();
        const { id } = req.params;
        const { code, module_name, module_type, capacity_type, consumable_type, duration_months, credits_per_unit, unit_price, status, display_order, } = req.body;
        await conn.execute(`
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
      `, [
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
        ]);
        const [rows] = await conn.query("SELECT * FROM modules WHERE id=?", [id]);
        return res.json({
            success: true,
            message: "Module Updated Successfully",
            data: rows[0],
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.updateModule = updateModule;
// ============================
// Delete Module
// ============================
const deleteModule = async (req, res) => {
    let conn;
    try {
        conn = await db_1.default.getConnection();
        const { id } = req.params;
        await conn.execute(`
      UPDATE modules
      SET deleted_at=NOW()
      WHERE id=?
      `, [id]);
        return res.json({
            success: true,
            message: "Module Deleted",
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.deleteModule = deleteModule;
