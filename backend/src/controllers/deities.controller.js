"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDeity = exports.updateDeity = exports.createDeity = exports.getDeityById = exports.getDeities = void 0;
const db_1 = __importDefault(require("../config/db"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// import { logAudit } from "../utils/auditLogger";
const uploadDir = path_1.default.join(__dirname, "../public/deities");
/** GET ALL DEITIES */
const getDeities = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const temple_id = req.user.temple_id;
        const [rows] = await db_1.default.query(`SELECT * FROM deities
       WHERE organization_id=? AND temple_id=?
       ORDER BY created_at DESC`, [organization_id, temple_id]);
        res.json({ success: true, data: rows });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getDeities = getDeities;
/** GET SINGLE DEITY */
const getDeityById = async (req, res) => {
    try {
        const { id } = req.params;
        const organization_id = req.user.organization_id;
        const temple_id = req.user.temple_id;
        const [rows] = await db_1.default.query(`SELECT * FROM deities
       WHERE id=? AND organization_id=? AND temple_id=?`, [id, organization_id, temple_id]);
        if (!rows.length)
            return res.status(404).json({ success: false, message: "Deity not found" });
        res.json({ success: true, data: rows[0] });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getDeityById = getDeityById;
/** CREATE DEITY */
const createDeity = async (req, res) => {
    let img_name = null;
    try {
        const organization_id = req.user.organization_id;
        const temple_id = req.user.temple_id;
        const { name, code, description, status } = req.body;
        if (!name) {
            if (req.file)
                fs_1.default.unlinkSync(req.file.path);
            return res.status(400).json({ success: false, message: "Deity name is required" });
        }
        if (req.file)
            img_name = req.file.filename;
        const [result] = await db_1.default.query(`INSERT INTO deities
       (organization_id, temple_id, name, img_name, code, description, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, [organization_id, temple_id, name, img_name, code || null, description || null, status || "active"]);
        res.status(201).json({ success: true, message: "Deity created successfully", id: result.insertId });
    }
    catch (error) {
        if (req.file)
            fs_1.default.unlinkSync(req.file.path);
        if (error.code === "ER_DUP_ENTRY")
            return res.status(400).json({ success: false, message: "Deity already exists" });
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createDeity = createDeity;
/** UPDATE DEITY */
const updateDeity = async (req, res) => {
    const connection = await db_1.default.getConnection();
    try {
        await connection.beginTransaction();
        const { id } = req.params;
        const organization_id = req.user.organization_id;
        const temple_id = req.user.temple_id;
        const updated_by_user_id = req.user.id;
        // =====================================
        // 1 Fetch old record snapshot
        // =====================================
        const [oldRows] = await connection.query(`SELECT * FROM deities WHERE id=? AND organization_id=? AND temple_id=?`, [id, organization_id, temple_id]);
        if (!oldRows.length) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: "Deity not found" });
        }
        const oldData = oldRows[0];
        let img_name = oldData.img_name;
        // =====================================
        // 2 Handle file upload (image)
        // =====================================
        if (req.file) {
            if (img_name) {
                const filePath = path_1.default.join(uploadDir, img_name);
                if (fs_1.default.existsSync(filePath))
                    fs_1.default.unlinkSync(filePath);
            }
            img_name = req.file.filename;
        }
        const { name, code, description, status } = req.body;
        // =====================================
        // 3 Update deity
        // =====================================
        await connection.query(`UPDATE deities SET name=?, img_name=?, code=?, description=?, status=?, updated_at=NOW()
       WHERE id=? AND organization_id=? AND temple_id=?`, [name, img_name, code, description, status, id, organization_id, temple_id]);
        // =====================================
        // 4 Insert audit log
        // =====================================
        const newData = { name, img_name, code, description, status };
        await connection.query(`INSERT INTO audit_logs
        (actor_user_id, organization_id, temple_id, table_name, record_id, action, old_data, new_data, created_at)
       VALUES (?, ?, ?, 'deities', ?, 'update', ?, ?, NOW())`, [
            updated_by_user_id,
            organization_id,
            temple_id,
            id,
            JSON.stringify(oldData),
            JSON.stringify(newData),
        ]);
        //     await logAudit({
        //   connection,
        //   actor_user_id: updated_by_user_id,
        //   organization_id,
        //   temple_id,
        //   table_name: "deities",
        //   record_id: Number(id),
        //   action: "update",
        //   old_data: oldData,
        //   new_data: { name, img_name, code, description, status }
        // });
        await connection.commit();
        res.json({ success: true, message: "Deity updated successfully" });
    }
    catch (error) {
        await connection.rollback();
        if (req.file && fs_1.default.existsSync(req.file.path))
            fs_1.default.unlinkSync(req.file.path);
        res.status(500).json({ success: false, message: error.message });
    }
    finally {
        connection.release();
    }
};
exports.updateDeity = updateDeity;
/** DELETE DEITY */
const deleteDeity = async (req, res) => {
    try {
        const { id } = req.params;
        const organization_id = req.user.organization_id;
        const temple_id = req.user.temple_id;
        const [rows] = await db_1.default.query(`SELECT img_name FROM deities
       WHERE id=? AND organization_id=? AND temple_id=?`, [id, organization_id, temple_id]);
        if (!rows.length)
            return res.status(404).json({ success: false, message: "Not found" });
        if (rows[0].img_name) {
            const filePath = path_1.default.join(uploadDir, rows[0].img_name);
            if (fs_1.default.existsSync(filePath))
                fs_1.default.unlinkSync(filePath);
        }
        await db_1.default.query(`DELETE FROM deities WHERE id=? AND organization_id=? AND temple_id=?`, [id, organization_id, temple_id]);
        res.json({ success: true, message: "Deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteDeity = deleteDeity;
