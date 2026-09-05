"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlanModules = exports.assignModulesToPlan = exports.deleteSubscriptionPlan = exports.updateSubscriptionPlan = exports.getSubscriptionPlanById = exports.getSubscriptionPlans = exports.createSubscriptionPlan = void 0;
const db_1 = __importDefault(require("../config/db"));
/**
 * ============================================================
 * CREATE SUBSCRIPTION PLAN
 * ============================================================
 */
const createSubscriptionPlan = async (req, res) => {
    let conn;
    try {
        conn = await db_1.default.getConnection();
        const { plan_name, plan_code, description, display_order, monthly_price, quarterly_price, half_yearly_price, yearly_price, discount_percent, trial_days, enable_free_trial, organization_limit, temple_limit, user_limit, devotee_limit, trustee_limit, volunteer_limit, status, } = req.body;
        // ---------------------------------------------------------
        // VALIDATION
        // ---------------------------------------------------------
        if (!plan_name || !String(plan_name).trim()) {
            return res.status(400).json({
                success: false,
                message: "Plan Name is required.",
            });
        }
        if (!plan_code || !String(plan_code).trim()) {
            return res.status(400).json({
                success: false,
                message: "Plan Code is required.",
            });
        }
        const cleanPlanName = String(plan_name).trim();
        const cleanPlanCode = String(plan_code).trim();
        // ---------------------------------------------------------
        // CHECK DUPLICATE PLAN CODE
        // ---------------------------------------------------------
        const [existingPlans] = await conn.execute(`
      SELECT id
      FROM subscription_plans
      WHERE plan_code = ?
        AND deleted_at IS NULL
      LIMIT 1
      `, [cleanPlanCode]);
        if (existingPlans.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Plan Code already exists.",
            });
        }
        // ---------------------------------------------------------
        // INSERT PLAN
        // ---------------------------------------------------------
        const [result] = await conn.execute(`
      INSERT INTO subscription_plans (
        plan_name,
        plan_code,
        description,
        display_order,

        monthly_price,
        quarterly_price,
        half_yearly_price,
        yearly_price,

        discount_percent,

        trial_days,
        enable_free_trial,

        organization_limit,
        temple_limit,
        user_limit,
        devotee_limit,
        trustee_limit,
        volunteer_limit,

        status
      )
      VALUES (
        ?, ?, ?, ?,

        ?, ?, ?, ?,

        ?,

        ?, ?,

        ?, ?, ?, ?, ?, ?,

        ?
      )
      `, [
            cleanPlanName,
            cleanPlanCode,
            description ? String(description).trim() : null,
            Number(display_order) || 0,
            Number(monthly_price) || 0,
            Number(quarterly_price) || 0,
            Number(half_yearly_price) || 0,
            Number(yearly_price) || 0,
            Number(discount_percent) || 0,
            Number(trial_days) || 0,
            enable_free_trial ? 1 : 0,
            Number(organization_limit) || 1,
            Number(temple_limit) || 1,
            Number(user_limit) || 10,
            Number(devotee_limit) || 100,
            Number(trustee_limit) || 5,
            Number(volunteer_limit) || 5,
            status || "active",
        ]);
        // ---------------------------------------------------------
        // GET INSERTED ID
        // ---------------------------------------------------------
        const planId = result.insertId;
        console.log("Created Subscription Plan ID:", planId);
        if (!planId) {
            throw new Error("Subscription plan created but insert ID was not returned.");
        }
        // ---------------------------------------------------------
        // GET CREATED PLAN
        // ---------------------------------------------------------
        const [createdPlan] = await conn.execute(`
      SELECT *
      FROM subscription_plans
      WHERE id = ?
      LIMIT 1
      `, [planId]);
        // ---------------------------------------------------------
        // SUCCESS RESPONSE
        // ---------------------------------------------------------
        return res.status(201).json({
            success: true,
            message: "Subscription Plan Created Successfully.",
            // ID
            id: planId,
            plan_id: planId,
            // Created plan
            data: createdPlan[0] || {
                id: planId,
            },
        });
    }
    catch (err) {
        console.error("CREATE SUBSCRIPTION PLAN ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err?.sqlMessage ||
                err?.message ||
                "Server Error",
        });
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
};
exports.createSubscriptionPlan = createSubscriptionPlan;
/**
 * ============================================================
 * GET ALL SUBSCRIPTION PLANS
 * ============================================================
 */
const getSubscriptionPlans = async (req, res) => {
    let conn;
    try {
        conn = await db_1.default.getConnection();
        const [rows] = await conn.execute(`
      SELECT
        sp.*,
        COUNT(spm.module_id) AS total_modules

      FROM subscription_plans sp

      LEFT JOIN subscription_plan_modules spm
        ON sp.id = spm.plan_id

      WHERE sp.deleted_at IS NULL

      GROUP BY sp.id

      ORDER BY sp.display_order ASC, sp.id DESC
      `);
        return res.json({
            success: true,
            total: rows.length,
            data: rows,
        });
    }
    catch (err) {
        console.error("GET SUBSCRIPTION PLANS ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err?.sqlMessage ||
                err?.message ||
                "Server Error",
        });
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
};
exports.getSubscriptionPlans = getSubscriptionPlans;
/**
 * ============================================================
 * GET SUBSCRIPTION PLAN BY ID
 * ============================================================
 */
const getSubscriptionPlanById = async (req, res) => {
    let conn;
    try {
        conn = await db_1.default.getConnection();
        const planId = Number(req.params.id);
        if (!planId || planId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Plan ID.",
            });
        }
        const [rows] = await conn.execute(`
      SELECT
        sp.*,
        COUNT(spm.module_id) AS total_modules

      FROM subscription_plans sp

      LEFT JOIN subscription_plan_modules spm
        ON sp.id = spm.plan_id

      WHERE sp.id = ?
        AND sp.deleted_at IS NULL

      GROUP BY sp.id

      LIMIT 1
      `, [planId]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Plan Not Found.",
            });
        }
        return res.json({
            success: true,
            data: rows[0],
        });
    }
    catch (err) {
        console.error("GET SUBSCRIPTION PLAN ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err?.sqlMessage ||
                err?.message ||
                "Server Error",
        });
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
};
exports.getSubscriptionPlanById = getSubscriptionPlanById;
/**
 * ============================================================
 * UPDATE SUBSCRIPTION PLAN
 * ============================================================
 */
const updateSubscriptionPlan = async (req, res) => {
    let conn;
    try {
        conn = await db_1.default.getConnection();
        const planId = Number(req.params.id);
        if (!planId || planId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Plan ID.",
            });
        }
        const { plan_name, plan_code, description, display_order, monthly_price, quarterly_price, half_yearly_price, yearly_price, discount_percent, trial_days, enable_free_trial, organization_limit, temple_limit, user_limit, devotee_limit, trustee_limit, volunteer_limit, status, } = req.body;
        // ---------------------------------------------------------
        // VALIDATION
        // ---------------------------------------------------------
        if (!plan_name || !String(plan_name).trim()) {
            return res.status(400).json({
                success: false,
                message: "Plan Name is required.",
            });
        }
        if (!plan_code || !String(plan_code).trim()) {
            return res.status(400).json({
                success: false,
                message: "Plan Code is required.",
            });
        }
        // ---------------------------------------------------------
        // CHECK PLAN EXISTS
        // ---------------------------------------------------------
        const [existingPlan] = await conn.execute(`
      SELECT id
      FROM subscription_plans
      WHERE id = ?
        AND deleted_at IS NULL
      LIMIT 1
      `, [planId]);
        if (existingPlan.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Plan Not Found.",
            });
        }
        // ---------------------------------------------------------
        // CHECK DUPLICATE PLAN CODE
        // ---------------------------------------------------------
        const [duplicateCode] = await conn.execute(`
      SELECT id
      FROM subscription_plans
      WHERE plan_code = ?
        AND id != ?
        AND deleted_at IS NULL
      LIMIT 1
      `, [
            String(plan_code).trim(),
            planId,
        ]);
        if (duplicateCode.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Plan Code already exists.",
            });
        }
        // ---------------------------------------------------------
        // UPDATE
        // ---------------------------------------------------------
        const [result] = await conn.execute(`
      UPDATE subscription_plans
      SET
        plan_name = ?,
        plan_code = ?,
        description = ?,
        display_order = ?,

        monthly_price = ?,
        quarterly_price = ?,
        half_yearly_price = ?,
        yearly_price = ?,

        discount_percent = ?,

        trial_days = ?,
        enable_free_trial = ?,

        organization_limit = ?,
        temple_limit = ?,
        user_limit = ?,
        devotee_limit = ?,
        trustee_limit = ?,
        volunteer_limit = ?,
      

        status = ?

      WHERE id = ?
        AND deleted_at IS NULL
      `, [
            String(plan_name).trim(),
            String(plan_code).trim(),
            description ? String(description).trim() : null,
            Number(display_order) || 0,
            Number(monthly_price) || 0,
            Number(quarterly_price) || 0,
            Number(half_yearly_price) || 0,
            Number(yearly_price) || 0,
            Number(discount_percent) || 0,
            Number(trial_days) || 0,
            enable_free_trial ? 1 : 0,
            Number(organization_limit) || 1,
            Number(temple_limit) || 1,
            Number(user_limit) || 10,
            Number(devotee_limit) || 100,
            Number(trustee_limit) || 5,
            Number(volunteer_limit) || 5,
            status || "active",
            planId,
        ]);
        // ---------------------------------------------------------
        // GET UPDATED PLAN
        // ---------------------------------------------------------
        const [updatedPlan] = await conn.execute(`
      SELECT *
      FROM subscription_plans
      WHERE id = ?
        AND deleted_at IS NULL
      LIMIT 1
      `, [planId]);
        return res.json({
            success: true,
            message: "Plan Updated Successfully.",
            id: planId,
            plan_id: planId,
            affectedRows: result.affectedRows,
            data: updatedPlan[0] || null,
        });
    }
    catch (err) {
        console.error("UPDATE SUBSCRIPTION PLAN ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err?.sqlMessage ||
                err?.message ||
                "Server Error",
        });
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
};
exports.updateSubscriptionPlan = updateSubscriptionPlan;
/**
 * ============================================================
 * DELETE SUBSCRIPTION PLAN
 * ============================================================
 */
const deleteSubscriptionPlan = async (req, res) => {
    let conn;
    try {
        conn = await db_1.default.getConnection();
        const planId = Number(req.params.id);
        if (!planId || planId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Plan ID.",
            });
        }
        // ---------------------------------------------------------
        // CHECK PLAN EXISTS
        // ---------------------------------------------------------
        const [existingPlan] = await conn.execute(`
      SELECT id
      FROM subscription_plans
      WHERE id = ?
        AND deleted_at IS NULL
      LIMIT 1
      `, [planId]);
        if (existingPlan.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Plan Not Found.",
            });
        }
        // ---------------------------------------------------------
        // SOFT DELETE
        // ---------------------------------------------------------
        await conn.execute(`
      UPDATE subscription_plans
      SET deleted_at = NOW()
      WHERE id = ?
        AND deleted_at IS NULL
      `, [planId]);
        return res.json({
            success: true,
            message: "Plan Deleted Successfully.",
            id: planId,
            plan_id: planId,
        });
    }
    catch (err) {
        console.error("DELETE SUBSCRIPTION PLAN ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err?.sqlMessage ||
                err?.message ||
                "Server Error",
        });
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
};
exports.deleteSubscriptionPlan = deleteSubscriptionPlan;
/**
 * ============================================================
 * ASSIGN MODULES TO SUBSCRIPTION PLAN
 * ============================================================
 */
const assignModulesToPlan = async (req, res) => {
    let conn;
    try {
        conn = await db_1.default.getConnection();
        const planId = Number(req.params.id);
        const { modules } = req.body;
        if (!planId || planId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Plan ID.",
            });
        }
        if (!Array.isArray(modules)) {
            return res.status(400).json({
                success: false,
                message: "modules must be an array.",
            });
        }
        // Remove duplicate module IDs
        const moduleIds = [
            ...new Set(modules
                .map((moduleId) => Number(moduleId))
                .filter((moduleId) => moduleId > 0)),
        ];
        // ---------------------------------------------------------
        // CHECK PLAN
        // ---------------------------------------------------------
        const [plan] = await conn.execute(`
      SELECT id
      FROM subscription_plans
      WHERE id = ?
        AND deleted_at IS NULL
      LIMIT 1
      `, [planId]);
        if (plan.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Plan Not Found.",
            });
        }
        await conn.beginTransaction();
        // ---------------------------------------------------------
        // DELETE OLD MODULES
        // ---------------------------------------------------------
        await conn.execute(`
      DELETE FROM subscription_plan_modules
      WHERE plan_id = ?
      `, [planId]);
        // ---------------------------------------------------------
        // INSERT NEW MODULES
        // ---------------------------------------------------------
        for (const moduleId of moduleIds) {
            await conn.execute(`
        INSERT INTO subscription_plan_modules (
          plan_id,
          module_id
        )
        VALUES (?, ?)
        `, [
                planId,
                moduleId,
            ]);
        }
        await conn.commit();
        return res.json({
            success: true,
            message: "Modules assigned successfully.",
            plan_id: planId,
            total_modules: moduleIds.length,
        });
    }
    catch (err) {
        if (conn) {
            await conn.rollback();
        }
        console.error("ASSIGN MODULES ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err?.sqlMessage ||
                err?.message ||
                "Server Error",
        });
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
};
exports.assignModulesToPlan = assignModulesToPlan;
/**
 * ============================================================
 * GET PLAN MODULES
 * ============================================================
 */
// export const getPlanModules = async (
//   req: Request,
//   res: Response
// ) => {
//   let conn;
//   try {
//     conn = await db.getConnection();
//     const planId = Number(req.params.id);
//     if (!planId || planId <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Plan ID.",
//       });
//     }
//     const [rows] = await conn.execute<RowDataPacket[]>(
//       `
//       SELECT
//         m.id,
//         m.module_name,
//         m.code
//       FROM subscription_plan_modules spm
//       INNER JOIN modules m
//         ON m.id = spm.module_id
//       WHERE spm.plan_id = ?
//         AND m.deleted_at IS NULL
//       ORDER BY m.display_order ASC
//       `,
//       [planId]
//     );
//     return res.json({
//       success: true,
//       plan_id: planId,
//       total: rows.length,
//       data: rows,
//     });
//   } catch (err: any) {
//     console.error(
//       "GET PLAN MODULES ERROR:",
//       err
//     );
//     return res.status(500).json({
//       success: false,
//       message:
//         err?.sqlMessage ||
//         err?.message ||
//         "Server Error",
//     });
//   } finally {
//     if (conn) {
//       conn.release();
//     }
//   }
// };
const getPlanModules = async (req, res) => {
    let conn;
    try {
        conn = await db_1.default.getConnection();
        const planId = Number(req.params.id);
        if (!planId || planId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Plan ID.",
            });
        }
        const [rows] = await conn.execute(`
        SELECT
          m.id,
          m.module_name,
          m.code

        FROM subscription_plan_modules spm

        INNER JOIN modules m
          ON m.id = spm.module_id

        WHERE spm.plan_id = ?
          AND m.deleted_at IS NULL

        ORDER BY m.display_order ASC
        `, [planId]);
        return res.json({
            success: true,
            plan_id: planId,
            total: rows.length,
            data: rows,
        });
    }
    catch (err) {
        console.error("GET PLAN MODULES ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err?.sqlMessage ||
                err?.message ||
                "Server Error",
        });
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
};
exports.getPlanModules = getPlanModules;
