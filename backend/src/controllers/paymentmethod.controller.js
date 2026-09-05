"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePaymentMethod = exports.updatePaymentMethod = exports.createPaymentMethod = exports.getPaymentMethodById = exports.getPaymentMethods = void 0;
const db_1 = __importDefault(require("../config/db"));
/**
 * GET ALL PAYMENT METHODS
 */
const getPaymentMethods = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const temple_id = req.user.temple_id;
        const [rows] = await db_1.default.query(`SELECT *
       FROM payment_methods
       WHERE organization_id = ?
       AND temple_id = ?
       ORDER BY display_order ASC`, [organization_id, temple_id]);
        res.json({
            success: true,
            data: rows
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.getPaymentMethods = getPaymentMethods;
/**
 * GET PAYMENT METHOD BY ID
 */
const getPaymentMethodById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db_1.default.query(`SELECT *
       FROM payment_methods
       WHERE id = ?`, [id]);
        res.json({
            success: true,
            data: rows[0]
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.getPaymentMethodById = getPaymentMethodById;
/**
 * CREATE PAYMENT METHOD
 */
const createPaymentMethod = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const temple_id = req.user.temple_id;
        const { payment_method, payment_method_type = "offline", remark = null, is_default = "no", display_order = 1, status = "active" } = req.body;
        if (!payment_method) {
            return res.status(400).json({
                success: false,
                message: "Payment method is required"
            });
        }
        const [result] = await db_1.default.query(`INSERT INTO payment_methods
      (
        organization_id,
        temple_id,
        payment_method,
        payment_method_type,
        remark,
        is_default,
        display_order,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            organization_id,
            temple_id,
            payment_method,
            payment_method_type,
            remark,
            is_default,
            display_order,
            status
        ]);
        res.status(201).json({
            success: true,
            message: "Payment Method created successfully",
            id: result.insertId
        });
    }
    catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                success: false,
                message: "Payment Method already exists"
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.createPaymentMethod = createPaymentMethod;
/**
 * UPDATE PAYMENT METHOD
 */
const updatePaymentMethod = async (req, res) => {
    const connection = await db_1.default.getConnection();
    try {
        await connection.beginTransaction();
        const updated_by_user_id = req.user.id; // the actor
        const organization_id = req.user.organization_id;
        const temple_id = req.user.temple_id;
        const { id } = req.params;
        const { payment_method, payment_method_type, remark, is_default, display_order, status } = req.body;
        // =====================================
        // 1 Fetch old record snapshot
        // =====================================
        const [oldRows] = await connection.query(`SELECT * FROM payment_methods WHERE id=?`, [id]);
        if (!oldRows.length) {
            return res.status(404).json({
                success: false,
                message: "Payment Method not found"
            });
        }
        const oldData = oldRows[0];
        // =====================================
        // 2 Update Payment Method
        // =====================================
        const [result] = await connection.query(`UPDATE payment_methods SET
        payment_method = ?,
        payment_method_type = ?,
        remark = ?,
        is_default = ?,
        display_order = ?,
        status = ?,
        updated_at = NOW()
      WHERE id = ?`, [
            payment_method,
            payment_method_type,
            remark,
            is_default,
            display_order,
            status,
            id
        ]);
        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: "Payment Method not found"
            });
        }
        // =====================================
        // 3 Insert audit log
        // =====================================
        const newData = {
            payment_method,
            payment_method_type,
            remark,
            is_default,
            display_order,
            status
        };
        await connection.query(`INSERT INTO audit_logs
        (actor_user_id, organization_id, temple_id, table_name, record_id, action, old_data, new_data, created_at)
       VALUES (?, ?, ?, 'payment_methods', ?, 'update', ?, ?, NOW())`, [
            updated_by_user_id,
            organization_id,
            temple_id,
            id,
            JSON.stringify(oldData),
            JSON.stringify(newData)
        ]);
        await connection.commit();
        res.json({
            success: true,
            message: "Payment Method updated successfully"
        });
    }
    catch (error) {
        await connection.rollback();
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
    finally {
        connection.release();
    }
};
exports.updatePaymentMethod = updatePaymentMethod;
/**
 * DELETE PAYMENT METHOD
 */
const deletePaymentMethod = async (req, res) => {
    try {
        const { id } = req.params;
        await db_1.default.query(`DELETE FROM payment_methods WHERE id = ?`, [id]);
        res.json({
            success: true,
            message: "Payment Method deleted successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.deletePaymentMethod = deletePaymentMethod;
