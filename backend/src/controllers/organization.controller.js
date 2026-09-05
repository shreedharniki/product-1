"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateOrganization = exports.suspendOrganization = exports.rejectPlanRequest = exports.approvePlanRequest = exports.GetRequest = exports.getPendingRequests = exports.getPendingRequestCount = exports.createRequest = exports.assignPlanToOrganization = exports.getOrgPlan = exports.deleteOrganization = exports.updateOrganization = exports.assignModuleToOrganization = exports.getOrganizationModules = exports.getAvailableModules = exports.getOrganizationById = exports.getRegisterOrganization = exports.registerOrganization = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../config/db"));
const password_1 = require("../utils/password");
const mail_1 = require("../utils/mail");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const registerOrganization = async (req, res) => {
    const { organization_name, temple_name, user_name, user_email, user_phone } = req.body;
    if (!organization_name || !temple_name || !user_name || !user_email || !user_phone) {
        return res.status(400).json({
            success: false,
            error: 'INVALID_INPUT',
            message: 'All fields are required: organization_name, temple_name, user_name, user_email, user_phone'
        });
    }
    const conn = await db_1.default.getConnection();
    try {
        await conn.beginTransaction();
        // Check if email already exists
        const [existingUsers] = await conn.execute(`SELECT id FROM users WHERE email = ? AND deleted_at IS NULL`, [user_email]);
        if (existingUsers.length > 0)
            throw new Error('EMAIL_ALREADY_EXISTS');
        // Check if phone already exists
        const [existingphoneUsers] = await conn.execute(`SELECT id FROM users WHERE phone = ? AND deleted_at IS NULL`, [user_phone]);
        if (existingphoneUsers.length > 0)
            throw new Error('PHONE_ALREADY_EXISTS');
        // Insert organization
        const [orgRes] = await conn.execute(`INSERT INTO organizations (name, status) VALUES (?, 'active')`, [organization_name]);
        const organizationId = orgRes.insertId;
        // Insert primary temple
        const [templeRes] = await conn.execute(`INSERT INTO temples (organization_id, name, is_primary, status)
       VALUES (?, ?, TRUE, 'active')`, [organizationId, temple_name]);
        const templeId = templeRes.insertId;
        // Get system defaults
        const [defaultsRows] = await conn.execute(`SELECT
         MAX(CASE WHEN key_name='default_max_users' THEN value_int END) AS max_users,
         MAX(CASE WHEN key_name='default_max_temples' THEN value_int END) AS max_temples
       FROM system_defaults`);
        const defaults = defaultsRows[0];
        if (!defaults?.max_users || !defaults?.max_temples)
            throw new Error('SYSTEM_DEFAULTS_MISSING');
        await conn.execute(`INSERT INTO organization_limits (organization_id, max_users, max_temples, source)
       VALUES (?, ?, ?, 'default')`, [organizationId, defaults.max_users, defaults.max_temples]);
        // Create admin user
        const rawPassword = (0, password_1.generatePassword)();
        const passwordHash = await bcrypt_1.default.hash(rawPassword, 12);
        const [userRes] = await conn.execute(`INSERT INTO users (
        organization_id, temple_id, name, email, phone, password_hash,
        user_type, status, force_password_reset
      ) VALUES (?, ?, ?, ?, ?, ?, 'org_admin', 'active', TRUE)`, [organizationId, templeId, user_name, user_email, user_phone, passwordHash]);
        const userId = userRes.insertId;
        // Create roles
        await conn.execute(`INSERT INTO roles (organization_id, temple_id, name, is_system)
       VALUES
         (?, NULL, 'org_admin', 1),
         (?, ?, 'temple_admin', 1),
         (?, ?, 'user', 1)
       ON DUPLICATE KEY UPDATE id=id`, [organizationId, organizationId, templeId, organizationId, templeId]);
        // Map user to role
        const [mapRes] = await conn.execute(`INSERT INTO user_roles (user_id, role_id)
       SELECT ?, id FROM roles
       WHERE organization_id = ? AND name = 'org_admin' AND deleted_at IS NULL
       LIMIT 1`, [userId, organizationId]);
        if (mapRes.affectedRows !== 1)
            throw new Error('ROLE_ASSIGNMENT_FAILED');
        await conn.commit();
        // Send password to admin email
        await (0, mail_1.sendMail)({
            to: user_email,
            subject: 'Your Admin Account Created',
            text: `Hello ${user_name},

Your organization account has been created successfully.

Login details:
Email: ${user_email}
Password: ${rawPassword}

This is a System Ganreated Password
Please log in and change your password immediately.

Thanks,
Team`
        });
        return res.status(201).json({
            success: true,
            organization_id: organizationId,
            admin_user_id: userId,
            message: 'Admin account created. Password sent via email.'
        });
    }
    catch (error) {
        await conn.rollback();
        // let errorMessage = 'REGISTRATION_FAILED';
        let errorCode = 'REGISTRATION_FAILED';
        let message = 'Registration failed. Please try again.';
        // if (error.message === 'PHONE_ALREADY_EXISTS') errorMessage = 'PHONE_ALREADY_EXISTS';
        // if (error.message === 'EMAIL_ALREADY_EXISTS') errorMessage = 'EMAIL_ALREADY_EXISTS';
        // if (error.message === 'SYSTEM_DEFAULTS_MISSING') errorMessage = 'SYSTEM_DEFAULTS_MISSING';
        // if (error.message === 'ROLE_ASSIGNMENT_FAILED') errorMessage = 'ROLE_ASSIGNMENT_FAILED';
        if (error.message === 'PHONE_ALREADY_EXISTS') {
            errorCode = 'PHONE_ALREADY_EXISTS';
            message = 'Phone number already registered';
        }
        if (error.message === 'EMAIL_ALREADY_EXISTS') {
            errorCode = 'EMAIL_ALREADY_EXISTS';
            message = 'Email already registered';
        }
        if (error.message === 'SYSTEM_DEFAULTS_MISSING') {
            errorCode = 'SYSTEM_DEFAULTS_MISSING';
            message = 'System configuration missing. Contact admin.';
        }
        if (error.message === 'ROLE_ASSIGNMENT_FAILED') {
            errorCode = 'ROLE_ASSIGNMENT_FAILED';
            message = 'Failed to assign admin role';
        }
        return res.status(400).json({
            // success: false,
            // error: errorMessage,
            // details: error.message
            success: false,
            error: errorCode,
            message,
        });
    }
    finally {
        conn.release();
    }
};
exports.registerOrganization = registerOrganization;
const getRegisterOrganization = async (req, res) => {
    let conn;
    try {
        conn = await db_1.default.getConnection();
        // Automatically expire old active plans
        await conn.execute(`
      UPDATE org_plans
      SET status = 'expired'
      WHERE status = 'active'
      AND expiry_date < CURDATE()
    `);
        const [rows] = await conn.execute(`
      SELECT
          o.id,
          o.name,
          o.legal_name,
          o.email,
          o.phone,
          o.city,
          o.state,
          o.country,

          sp.plan_name,
          sp.plan_code,

          op.start_date,
          op.expiry_date,

          COALESCE(op.status,'Not Assigned') AS plan_status,

          o.status,
          o.created_at

      FROM organizations o

      LEFT JOIN (
          SELECT p1.*
          FROM org_plans p1
          WHERE p1.id = (
              SELECT p2.id
              FROM org_plans p2
              WHERE p2.organization_id = p1.organization_id
              ORDER BY
                  CASE
                      WHEN p2.status='active' THEN 1
                      WHEN p2.status='pending' THEN 2
                      WHEN p2.status='expired' THEN 3
                      WHEN p2.status='cancelled' THEN 4
                      ELSE 5
                  END,
                  p2.start_date DESC
              LIMIT 1
          )
      ) op
          ON op.organization_id = o.id

      LEFT JOIN subscription_plans sp
          ON sp.id = op.subscription_plan_id

      WHERE o.deleted_at IS NULL

      ORDER BY
          CASE
              WHEN op.status='active' THEN 1
              WHEN op.status='pending' THEN 2
              WHEN op.status='expired' THEN 3
              WHEN op.status='cancelled' THEN 4
              ELSE 5
          END,
          o.created_at DESC
    `);
        return res.status(200).json({
            success: true,
            data: rows,
        });
    }
    catch (error) {
        console.error("GET ORGANIZATIONS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.getRegisterOrganization = getRegisterOrganization;
// automaticalyy expri old date 
// normal get it 
// export const getOrganizationById = async (
//   req: Request,
//   res: Response
// ) => {
//   let conn;
//   try {
//     const { id } = req.params;
//     conn = await db.getConnection();
//     const [rows] = await conn.execute<any[]>(
//       `SELECT 
//         id,
//         name,
//         img_name,
//         legal_name,
//         registration_number,
//         email,
//         phone,
//         address_line1,
//         address_line2,
//         city,
//         state,
//         country,
//         pincode,
//         slug,
//         status,
//         timezone,
//         created_at,
//         updated_at
//       FROM organizations
//       WHERE id = ?
//       AND deleted_at IS NULL`,
//       [id]
//     );
//     if (!rows.length) {
//       return res.status(404).json({
//         success: false,
//         message: "Organization not found"
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       data: rows[0]
//     });
//   } catch (error) {
//     console.error("GET ORGANIZATION BY ID ERROR:", error);
//     return res.status(500).json({ message: "Server error" });
//   } finally {
//     if (conn) conn.release();
//   }
// };
// plane and all details
const getOrganizationById = async (req, res) => {
    let conn;
    try {
        const { id } = req.params;
        conn = await db_1.default.getConnection();
        // Organization Details
        const [orgRows] = await conn.execute(`
      SELECT
          id,
          name,
          img_name,
          legal_name,
          registration_number,
          email,
          phone,
          address_line1,
          address_line2,
          city,
          state,
          country,
          pincode,
          slug,
          status,
          timezone,
          created_at,
          updated_at
      FROM organizations
      WHERE id=?
      AND deleted_at IS NULL
      `, [id]);
        if (!orgRows.length) {
            return res.status(404).json({
                success: false,
                message: "Organization not found",
            });
        }
        const organization = orgRows[0];
        const [currentPlan] = await conn.execute(`
SELECT
    op.id,
    op.subscription_plan_id,
    sp.plan_name,
    sp.plan_code,
    op.start_date,
    op.expiry_date,
    op.status,
    sp.monthly_price,
    sp.quarterly_price,
    sp.half_yearly_price,
    sp.yearly_price
FROM org_plans op
INNER JOIN subscription_plans sp
    ON sp.id = op.subscription_plan_id
WHERE op.organization_id = ?
ORDER BY
CASE
    WHEN op.status='active' THEN 1
    WHEN op.status='pending' THEN 2
    WHEN op.status='expired' THEN 3
    WHEN op.status='cancelled' THEN 4
    ELSE 5
END,
op.start_date DESC
LIMIT 1
`, [id]);
        const [pendingRequest] = await conn.execute(`
SELECT
    spr.id,
    spr.subscription_plan_id,
    sp.plan_name,
    sp.plan_code,
    spr.billing_cycle,
    spr.price,
    spr.request_type,
    spr.payment_status,
    spr.status,
    spr.remarks,
    spr.created_at
FROM subscription_plan_requests spr
INNER JOIN subscription_plans sp
    ON sp.id = spr.subscription_plan_id
WHERE spr.organization_id = ?
AND spr.status = 'pending'
ORDER BY spr.created_at DESC
LIMIT 1
`, [id]);
        const [history] = await conn.execute(`
SELECT
    op.id,
    sp.plan_name,
    sp.plan_code,
    op.start_date,
    op.expiry_date,
    op.status
FROM org_plans op
INNER JOIN subscription_plans sp
    ON sp.id = op.subscription_plan_id
WHERE op.organization_id=?
ORDER BY
CASE
    WHEN op.status='active' THEN 1
    WHEN op.status='pending' THEN 2
    WHEN op.status='expired' THEN 3
    WHEN op.status='cancelled' THEN 4
    ELSE 5
END,
op.start_date DESC
`, [id]);
        // Modules
        // const [modules] = await conn.execute<any[]>(
        //   `
        //   SELECT
        //       om.id,
        //       om.module_code,
        //       om.pricing_type,
        //       om.price,
        //       om.status,
        //       om.created_at
        //   FROM organization_modules om
        //   WHERE om.organization_id=?
        //   AND om.deleted_at IS NULL
        //   ORDER BY om.module_code
        //   `,
        //   [id]
        // );
        //     const [modules] = await conn.execute(
        //   `
        //   SELECT
        //       m.id,
        //       m.module_name,
        //       m.module_code
        //   FROM org_plans op
        //   INNER JOIN subscription_plan_modules spm
        //       ON spm.plan_id = op.subscription_plan_id
        //   INNER JOIN modules m
        //       ON m.id = spm.module_id
        //   WHERE op.organization_id = ?
        //     AND op.status = 'active'
        //   ORDER BY m.module_name
        //   `,
        //   [id]
        // );
        // return res.json({
        //   success: true,
        //   data: {
        //     ...organization,
        //     subscription: currentPlan.length ? currentPlan[0] : null,
        //     history,
        //     // modules,
        //   },
        // });
        return res.json({
            success: true,
            data: {
                ...organization,
                subscription: currentPlan.length ? currentPlan[0] : null,
                pendingRequest: pendingRequest.length
                    ? pendingRequest[0]
                    : null,
                history,
            },
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
exports.getOrganizationById = getOrganizationById;
const getAvailableModules = async (req, res) => {
    let conn;
    try {
        conn = await db_1.default.getConnection();
        const [rows] = await conn.execute(`SELECT code FROM permissions WHERE deleted_at IS NULL AND is_deprecated = 0 ORDER BY code`);
        return res.status(200).json({
            success: true,
            data: rows
        });
    }
    catch (error) {
        console.error('GET AVAILABLE MODULES ERROR:', error);
        return res.status(500).json({ message: 'Server error' });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.getAvailableModules = getAvailableModules;
const getOrganizationModules = async (req, res) => {
    let conn;
    try {
        const organizationId = Number(req.params.id);
        if (Number.isNaN(organizationId)) {
            return res.status(400).json({ success: false, message: 'Invalid organization id' });
        }
        if (req.user?.user_type === 'org_admin' && req.user.organization_id !== organizationId) {
            return res.status(403).json({ success: false, message: 'Cannot access modules for another organization' });
        }
        conn = await db_1.default.getConnection();
        const [rows] = await conn.execute(`SELECT id, module_code, pricing_type, price, custom_details, status, assigned_by, created_at, updated_at
       FROM organization_modules
       WHERE organization_id = ? AND deleted_at IS NULL`, [organizationId]);
        return res.status(200).json({
            success: true,
            data: rows
        });
    }
    catch (error) {
        console.error('GET ORGANIZATION MODULES ERROR:', error);
        return res.status(500).json({ message: 'Server error' });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.getOrganizationModules = getOrganizationModules;
const assignModuleToOrganization = async (req, res) => {
    let conn;
    try {
        const organizationId = Number(req.params.id);
        if (Number.isNaN(organizationId)) {
            return res.status(400).json({ success: false, message: 'Invalid organization id' });
        }
        if (req.user?.user_type === 'org_admin' && req.user.organization_id !== organizationId) {
            return res.status(403).json({ success: false, message: 'Cannot assign modules to another organization' });
        }
        const { module_code, pricing_type, price, custom_details, status = 'active' } = req.body;
        if (!module_code || !pricing_type) {
            return res.status(400).json({ success: false, message: 'module_code and pricing_type are required' });
        }
        const validPricingTypes = ['free', 'paid', 'custom'];
        if (!validPricingTypes.includes(pricing_type)) {
            return res.status(400).json({ success: false, message: 'pricing_type must be one of free, paid, custom' });
        }
        const modulePrice = pricing_type === 'free' ? 0 : Number(price ?? 0);
        if (pricing_type !== 'free' && (Number.isNaN(modulePrice) || modulePrice < 0)) {
            return res.status(400).json({ success: false, message: 'price must be a non-negative number for paid/custom modules' });
        }
        conn = await db_1.default.getConnection();
        await conn.beginTransaction();
        const [moduleRows] = await conn.execute(`SELECT id FROM permissions WHERE code = ? AND deleted_at IS NULL AND is_deprecated = 0 LIMIT 1`, [module_code]);
        if (!moduleRows.length) {
            await conn.rollback();
            return res.status(404).json({ success: false, message: 'Module not found' });
        }
        const [existingRows] = await conn.execute(`SELECT id FROM organization_modules WHERE organization_id = ? AND module_code = ? AND deleted_at IS NULL LIMIT 1`, [organizationId, module_code]);
        if (existingRows.length) {
            const assignmentId = existingRows[0].id;
            await conn.execute(`UPDATE organization_modules
         SET pricing_type = ?, price = ?, custom_details = ?, status = ?, assigned_by = ?, updated_at = NOW()
         WHERE id = ?`, [pricing_type, modulePrice, custom_details || null, status, req.user?.id || null, assignmentId]);
            await conn.commit();
            return res.status(200).json({ success: true, message: 'Module assignment updated successfully' });
        }
        await conn.execute(`INSERT INTO organization_modules
       (organization_id, module_code, pricing_type, price, custom_details, status, assigned_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`, [organizationId, module_code, pricing_type, modulePrice, custom_details || null, status, req.user?.id || null]);
        await conn.commit();
        return res.status(201).json({ success: true, message: 'Module assigned successfully' });
    }
    catch (error) {
        if (conn)
            await conn.rollback();
        console.error('ASSIGN MODULE TO ORGANIZATION ERROR:', error);
        return res.status(500).json({ message: 'Server error' });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.assignModuleToOrganization = assignModuleToOrganization;
const updateOrganization = async (req, res) => {
    let conn;
    try {
        const { id } = req.params;
        conn = await db_1.default.getConnection();
        // =====================
        // GET OLD IMAGE
        // =====================
        const [rows] = await conn.execute("SELECT img_name FROM organizations WHERE id=?", [id]);
        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: "Organization not found"
            });
        }
        const oldImage = rows[0].img_name;
        // =====================
        // NEW IMAGE
        // =====================
        let newImageName = oldImage;
        if (req.file) {
            newImageName = req.file.filename;
            // delete old image safely
            if (oldImage && oldImage !== newImageName) {
                const oldPath = path_1.default.join(__dirname, "../public/organizations", oldImage);
                if (fs_1.default.existsSync(oldPath)) {
                    fs_1.default.unlinkSync(oldPath);
                }
            }
        }
        // =====================
        // BODY DATA
        // =====================
        const { name, legal_name, registration_number, email, phone, address_line1, address_line2, city, state, country, pincode, status, timezone } = req.body;
        // =====================
        // UPDATE DB
        // =====================
        await conn.execute(`UPDATE organizations SET

        name=?,
        legal_name=?,
        img_name=?,
        registration_number=?,
        email=?,
        phone=?,
        address_line1=?,
        address_line2=?,
        city=?,
        state=?,
        country=?,
        pincode=?,
        status=?,
        timezone=?

      WHERE id=?`, [
            name,
            legal_name,
            newImageName,
            registration_number,
            email,
            phone,
            address_line1,
            address_line2,
            city,
            state,
            country,
            pincode,
            status,
            timezone,
            id
        ]);
        return res.json({
            success: true,
            message: "Organization updated successfully"
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.updateOrganization = updateOrganization;
const deleteOrganization = async (req, res) => {
    let conn;
    try {
        const { id } = req.params;
        conn = await db_1.default.getConnection();
        const [result] = await conn.execute(`UPDATE organizations 
       SET deleted_at = NOW()
       WHERE id = ?
       AND deleted_at IS NULL`, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Organization not found or already deleted"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Organization deleted successfully"
        });
    }
    catch (error) {
        console.error("DELETE ORGANIZATION ERROR:", error);
        return res.status(500).json({ message: "Server error" });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.deleteOrganization = deleteOrganization;
const getOrgPlan = async (req, res) => {
    let conn;
    try {
        const organizationId = Number(req.params.id);
        conn = await db_1.default.getConnection();
        const [rows] = await conn.execute(`
      SELECT
          op.id,
          op.organization_id,
          op.subscription_plan_id,
          sp.plan_name,
          sp.plan_code,
          op.start_date,
          op.expiry_date,
          op.status,

          GROUP_CONCAT(
              m.module_name
              ORDER BY m.module_name
              SEPARATOR ', '
          ) AS modules

      FROM org_plans op

      INNER JOIN subscription_plans sp
          ON sp.id = op.subscription_plan_id

      LEFT JOIN subscription_plan_modules spm
          ON spm.plan_id = sp.id

      LEFT JOIN modules m
          ON m.id = spm.module_id

      WHERE op.organization_id = ?

      GROUP BY op.id
      `, [organizationId]);
        return res.json({
            success: true,
            data: rows
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.getOrgPlan = getOrgPlan;
const assignPlanToOrganization = async (req, res) => {
    let conn;
    try {
        const { id } = req.params;
        const { subscription_plan_id, start_date, expiry_date } = req.body;
        conn = await db_1.default.getConnection();
        await conn.execute(`INSERT INTO org_plans
            (
                organization_id,
                subscription_plan_id,
                start_date,
                expiry_date,
                status
            )
            VALUES (?,?,?,?, 'active')`, [
            id,
            subscription_plan_id,
            start_date,
            expiry_date
        ]);
        return res.json({
            success: true,
            message: "Plan assigned successfully"
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.assignPlanToOrganization = assignPlanToOrganization;
// export const createRequest = async (
//  req: Request, res: Response
// ) => {
//   try {
//     const {
//       organization_id,
//       subscription_plan_id,
//       billing_cycle,
//       price,
//       request_type,
//     } = req.body;
//     const sql = `
//       INSERT INTO subscription_plan_requests
//       (
//         organization_id,
//         subscription_plan_id,
//         billing_cycle,
//         price,
//         request_type,
//         status,
//         payment_status
//       )
//       VALUES (?, ?, ?, ?, ?, 'pending', 'pending')
//     `;
//     const [result] = await db.query(sql, [
//       organization_id,
//       subscription_plan_id,
//       billing_cycle,
//       price,
//       request_type,
//     ]);
//     res.status(201).json({
//       success: true,
//       message: "Plan request created successfully.",
//       data: {
//         id: result.insertId,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };
// Send plane Request
const createRequest = async (req, res) => {
    try {
        const { organization_id, subscription_plan_id, billing_cycle, price, request_type, } = req.body;
        // Check existing pending request
        const [existing] = await db_1.default.query(`
      SELECT id
      FROM subscription_plan_requests
      WHERE organization_id = ?
      AND subscription_plan_id = ?
      AND status = 'pending'
      LIMIT 1
      `, [organization_id, subscription_plan_id]);
        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "A pending request already exists for this plan.",
            });
        }
        const [result] = await db_1.default.query(`
      INSERT INTO subscription_plan_requests
      (
        organization_id,
        subscription_plan_id,
        billing_cycle,
        price,
        request_type,
        status,
        payment_status
      )
      VALUES (?, ?, ?, ?, ?, 'pending', 'pending')
      `, [
            organization_id,
            subscription_plan_id,
            billing_cycle,
            price,
            request_type,
        ]);
        return res.status(201).json({
            success: true,
            message: "Plan request created successfully.",
            data: {
                id: result.insertId,
            },
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
exports.createRequest = createRequest;
//Get plan Request with orgnation id
// count get return the pending plan request count.
const getPendingRequestCount = async (req, res) => {
    try {
        // Pending request list
        const [requests] = await db_1.default.query(`
      SELECT
          spr.id,
          o.name AS organization_name,
          sp.plan_name,
          spr.billing_cycle,
          spr.price,
          spr.request_type,
          spr.status,
          spr.created_at
      FROM subscription_plan_requests spr
      INNER JOIN organizations o
          ON o.id = spr.organization_id
      INNER JOIN subscription_plans sp
          ON sp.id = spr.subscription_plan_id
      WHERE spr.status = 'pending'
      ORDER BY spr.created_at DESC
    `);
        // Pending request count
        const [countRows] = await db_1.default.query(`
      SELECT COUNT(*) AS total
      FROM subscription_plan_requests
      WHERE status = 'pending'
    `);
        return res.status(200).json({
            success: true,
            count: countRows[0].total,
            data: requests,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
exports.getPendingRequestCount = getPendingRequestCount;
const getPendingRequests = async (req, res) => {
    try {
        const [requests] = await db_1.default.query(`
      SELECT
          spr.id,
           spr.organization_id,
          o.name AS organization_name,
          sp.plan_name,
          spr.billing_cycle,
          spr.price,
          spr.request_type,
          spr.status,
          spr.created_at
      FROM subscription_plan_requests spr
      INNER JOIN organizations o
          ON o.id = spr.organization_id
      INNER JOIN subscription_plans sp
          ON sp.id = spr.subscription_plan_id
      WHERE spr.status='pending'
      ORDER BY spr.created_at DESC
    `);
        res.json({
            success: true,
            data: requests,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
exports.getPendingRequests = getPendingRequests;
const GetRequest = async (req, res) => {
    try {
        const { organization_id } = req.params;
        const [rows] = await db_1.default.query(`
      SELECT
        spr.id,
        spr.organization_id,
        spr.subscription_plan_id,
        sp.plan_name,
        spr.billing_cycle,
        spr.price,
        spr.request_type,
        spr.status,
        spr.payment_status,
        spr.created_at
      FROM subscription_plan_requests spr
      INNER JOIN subscription_plans sp
        ON sp.id = spr.subscription_plan_id
      WHERE spr.organization_id = ?
      ORDER BY spr.created_at DESC
      `, [organization_id]);
        return res.status(200).json({
            success: true,
            data: rows,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
exports.GetRequest = GetRequest;
const approvePlanRequest = async (req, res) => {
    let conn;
    try {
        const { requestId } = req.params;
        conn = await db_1.default.getConnection();
        await conn.beginTransaction();
        const [rows] = await conn.query(`
      SELECT *
      FROM subscription_plan_requests
      WHERE id=?
      AND status='pending'
      LIMIT 1
      `, [requestId]);
        if (!rows.length) {
            await conn.rollback();
            return res.status(404).json({
                success: false,
                message: "Request not found."
            });
        }
        const request = rows[0];
        // Expire active plan
        await conn.query(`
      UPDATE org_plans
      SET status='expired'
      WHERE organization_id=?
      AND status='active'
      `, [request.organization_id]);
        const startDate = new Date();
        const expiryDate = new Date(startDate);
        switch (request.billing_cycle) {
            case "monthly":
                expiryDate.setMonth(expiryDate.getMonth() + 1);
                break;
            case "quarterly":
                expiryDate.setMonth(expiryDate.getMonth() + 3);
                break;
            case "half_yearly":
                expiryDate.setMonth(expiryDate.getMonth() + 6);
                break;
            case "yearly":
                expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                break;
        }
        expiryDate.setDate(expiryDate.getDate() - 1);
        const format = (date) => date.toISOString().split("T")[0];
        await conn.query(`
      INSERT INTO org_plans
      (
          organization_id,
          subscription_plan_id,
          billing_cycle,
          price,
          start_date,
          expiry_date,
          status,
          payment_status,
          auto_renew
      )
      VALUES
      (?, ?, ?, ?, ?, ?, 'active', 'paid', 0)
      `, [
            request.organization_id,
            request.subscription_plan_id,
            request.billing_cycle,
            request.price,
            format(startDate),
            format(expiryDate)
        ]);
        await conn.query(`
      UPDATE subscription_plan_requests
      SET
          status='approved',
          payment_status='paid',
          approved_at=NOW(),
          updated_at=NOW()
      WHERE id=?
      `, [requestId]);
        await conn.commit();
        return res.json({
            success: true,
            message: "Plan approved successfully."
        });
    }
    catch (err) {
        if (conn)
            await conn.rollback();
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.approvePlanRequest = approvePlanRequest;
const rejectPlanRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        await db_1.default.query(`
      UPDATE subscription_plan_requests
      SET
          status='rejected',
          updated_at=NOW()
      WHERE id=?
      `, [requestId]);
        return res.json({
            success: true,
            message: "Plan request rejected."
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};
exports.rejectPlanRequest = rejectPlanRequest;
const suspendOrganization = async (req, res) => {
    let conn;
    try {
        conn = await db_1.default.getConnection();
        const { id } = req.params;
        await conn.execute(`
      UPDATE organizations
      SET status='suspended'
      WHERE id=?
      `, [id]);
        return res.json({
            success: true,
            message: "Organization suspended successfully."
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.suspendOrganization = suspendOrganization;
const activateOrganization = async (req, res) => {
    let conn;
    try {
        conn = await db_1.default.getConnection();
        const { id } = req.params;
        await conn.execute(`
      UPDATE organizations
      SET status='active'
      WHERE id=?
      `, [id]);
        return res.json({
            success: true,
            message: "Organization activated successfully."
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
    finally {
        if (conn)
            conn.release();
    }
};
exports.activateOrganization = activateOrganization;
