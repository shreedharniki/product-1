"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTemple = exports.updateTemple = exports.getTempleById = exports.getAllTemples = exports.createTemple = void 0;
const db_1 = __importDefault(require("../config/db"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uploadDir = path_1.default.join(__dirname, "../public/temple");
/**
 * Create Temple
 */
const createTemple = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const data = { ...req.body, organization_id };
        const [result] = await db_1.default.query("INSERT INTO temples SET ?", [data]);
        return res.status(201).json({
            success: true,
            message: "Temple created successfully",
            id: result.insertId,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createTemple = createTemple;
/**
 * Get All Temples (Organization Based)
 */
const getAllTemples = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const [rows] = await db_1.default.query(`SELECT * FROM temples
       WHERE organization_id = ?
       AND deleted_at IS NULL
       ORDER BY id DESC`, [organization_id]);
        return res.json({
            success: true,
            data: rows,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getAllTemples = getAllTemples;
/**
 * Get Temple By ID
 */
const getTempleById = async (req, res) => {
    try {
        const { id } = req.params;
        const organization_id = req.user.organization_id;
        const [rows] = await db_1.default.query(`SELECT * FROM temples
       WHERE id = ?
       AND organization_id = ?
       AND deleted_at IS NULL`, [id, organization_id]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Temple not found",
            });
        }
        return res.json({
            success: true,
            data: rows[0],
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getTempleById = getTempleById;
// export const updateTemple = async (req: Request, res: Response) => {
//   const connection = await db.getConnection();
//   try {
//     await connection.beginTransaction();
//     const { id } = req.params;
//     const organization_id = req.user!.organization_id;
//     const updated_by_user_id = req.user!.id;
//     // =====================================
//     // 1. Get existing temple
//     // =====================================
//     const [oldRows]: any = await connection.query(
//       `SELECT *
//        FROM temples
//        WHERE id = ?
//        AND organization_id = ?
//        AND deleted_at IS NULL`,
//       [id, organization_id]
//     );
//     if (!oldRows.length) {
//       await connection.rollback();
//       if (req.file && fs.existsSync(req.file.path)) {
//         fs.unlinkSync(req.file.path);
//       }
//       return res.status(404).json({
//         success: false,
//         message: "Temple not found or unauthorized",
//       });
//     }
//     const oldTemple = oldRows[0];
//     // =====================================
//     // 2. Prepare update data
//     // =====================================
//     const {
//       name,
//       legal_name,
//       registration_number,
//       email,
//       phone,
//       address_line1,
//       address_line2,
//       city,
//       state,
//       country,
//       pincode,
//       lat,
//       lng,
//       is_primary,
//       status,
//       timezone,
//     } = req.body;
//     const updateData: Record<string, any> = {
//       name,
//       legal_name,
//       registration_number,
//       email,
//       phone,
//       address_line1,
//       address_line2,
//       city,
//       state,
//       country,
//       pincode,
//       lat,
//       lng,
//       is_primary,
//       status,
//       timezone,
//       updated_at: new Date(),
//     };
//     // Remove undefined values
//     Object.keys(updateData).forEach((key) => {
//       if (updateData[key] === undefined) {
//         delete updateData[key];
//       }
//     });
//     // =====================================
//     // 3. Handle image
//     // =====================================
//     if (req.file) {
//       updateData.img_name = req.file.filename;
//     }
//     // =====================================
//     // 4. Update temple
//     // =====================================
//     const [result] = await connection.query<ResultSetHeader>(
//       `UPDATE temples
//        SET ?
//        WHERE id = ?
//        AND organization_id = ?
//        AND deleted_at IS NULL`,
//       [updateData, id, organization_id]
//     );
//     if (result.affectedRows === 0) {
//       await connection.rollback();
//       if (req.file && fs.existsSync(req.file.path)) {
//         fs.unlinkSync(req.file.path);
//       }
//       return res.status(404).json({
//         success: false,
//         message: "Temple not found",
//       });
//     }
//     // =====================================
//     // 5. Delete old image
//     // =====================================
//     if (
//       req.file &&
//       oldTemple.img_name &&
//       oldTemple.img_name !== req.file.filename
//     ) {
//       const oldImagePath = path.join(
//         uploadDir,
//         oldTemple.img_name
//       );
//       if (fs.existsSync(oldImagePath)) {
//         fs.unlinkSync(oldImagePath);
//       }
//     }
//     // =====================================
//     // 6. Get updated temple
//     // =====================================
//     const [updatedRows]: any = await connection.query(
//       `SELECT *
//        FROM temples
//        WHERE id = ?
//        AND organization_id = ?
//        AND deleted_at IS NULL`,
//       [id, organization_id]
//     );
//     // =====================================
//     // 7. Commit
//     // =====================================
//     await connection.commit();
//     return res.json({
//       success: true,
//       message: "Temple updated successfully",
//       data: updatedRows[0],
//     });
//   } catch (error: any) {
//     await connection.rollback();
//     // Delete newly uploaded image if update failed
//     if (req.file && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to update temple",
//     });
//   } finally {
//     connection.release();
//   }
// };
const updateTemple = async (req, res) => {
    const connection = await db_1.default.getConnection();
    let newImagePath = null;
    try {
        await connection.beginTransaction();
        const { id } = req.params;
        const organization_id = req.user.organization_id;
        // =========================================
        // 1. GET EXISTING TEMPLE
        // =========================================
        const [oldRows] = await connection.query(`SELECT *
       FROM temples
       WHERE id = ?
       AND organization_id = ?
       AND deleted_at IS NULL`, [id, organization_id]);
        if (!oldRows.length) {
            await connection.rollback();
            // Delete newly uploaded file
            if (req.file && fs_1.default.existsSync(req.file.path)) {
                fs_1.default.unlinkSync(req.file.path);
            }
            return res.status(404).json({
                success: false,
                message: "Temple not found",
            });
        }
        const oldTemple = oldRows[0];
        // =========================================
        // 2. PREPARE UPDATE DATA
        // =========================================
        const updateData = {
            ...req.body,
            updated_at: new Date(),
        };
        // =========================================
        // VERY IMPORTANT
        // NEVER SAVE req.body.img_name
        // =========================================
        delete updateData.img_name;
        // =========================================
        // REMOVE PROTECTED FIELDS
        // =========================================
        delete updateData.id;
        delete updateData.organization_id;
        delete updateData.created_at;
        delete updateData.deleted_at;
        // =========================================
        // 3. HANDLE IMAGE
        // =========================================
        if (req.file) {
            updateData.img_name = req.file.filename;
            newImagePath = req.file.path;
            console.log("New image:");
            console.log("filename:", req.file.filename);
            console.log("path:", req.file.path);
            console.log("original:", req.file.originalname);
        }
        // =========================================
        // 4. UPDATE DATABASE
        // =========================================
        const [result] = await connection.query(`UPDATE temples
       SET ?
       WHERE id = ?
       AND organization_id = ?
       AND deleted_at IS NULL`, [
            updateData,
            id,
            organization_id,
        ]);
        if (result.affectedRows === 0) {
            await connection.rollback();
            // Delete new image
            if (newImagePath &&
                fs_1.default.existsSync(newImagePath)) {
                fs_1.default.unlinkSync(newImagePath);
            }
            return res.status(404).json({
                success: false,
                message: "Temple not found",
            });
        }
        // =========================================
        // 5. COMMIT DATABASE FIRST
        // =========================================
        await connection.commit();
        // =========================================
        // 6. DELETE OLD IMAGE
        // ONLY IF NEW IMAGE WAS UPLOADED
        // =========================================
        if (req.file &&
            oldTemple.img_name &&
            oldTemple.img_name !== req.file.filename) {
            const oldImagePath = path_1.default.join(uploadDir, oldTemple.img_name);
            if (fs_1.default.existsSync(oldImagePath)) {
                fs_1.default.unlinkSync(oldImagePath);
                console.log("Old image deleted:", oldImagePath);
            }
        }
        // =========================================
        // 7. GET UPDATED TEMPLE
        // =========================================
        const [updatedRows] = await connection.query(`SELECT *
         FROM temples
         WHERE id = ?
         AND organization_id = ?
         AND deleted_at IS NULL`, [id, organization_id]);
        // =========================================
        // 8. RESPONSE
        // =========================================
        return res.json({
            success: true,
            message: "Temple updated successfully",
            data: updatedRows[0],
        });
    }
    catch (error) {
        // =========================================
        // ROLLBACK
        // =========================================
        await connection.rollback();
        // =========================================
        // DELETE NEW IMAGE IF UPDATE FAILED
        // =========================================
        if (newImagePath &&
            fs_1.default.existsSync(newImagePath)) {
            fs_1.default.unlinkSync(newImagePath);
        }
        console.error("Update temple error:", error);
        return res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to update temple",
        });
    }
    finally {
        connection.release();
    }
};
exports.updateTemple = updateTemple;
/**
 * Soft Delete Temple
 */
const deleteTemple = async (req, res) => {
    try {
        const { id } = req.params;
        const organization_id = req.user.organization_id;
        const [result] = await db_1.default.query(`UPDATE temples
       SET deleted_at = NOW()
       WHERE id = ?
       AND organization_id = ?`, [id, organization_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Temple not found or unauthorized",
            });
        }
        return res.json({
            success: true,
            message: "Temple deleted successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.deleteTemple = deleteTemple;
