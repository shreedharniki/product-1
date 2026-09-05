"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBodyOwnership = exports.requirePermission = exports.authenticate = void 0;
const db_1 = __importDefault(require("../config/db"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer '))
        return res.status(401).json({ message: 'Unauthorized' });
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, String(process.env.JWT_SECRET));
        const hash = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const [rows] = await db_1.default.execute(`SELECT s.id as session_id, u.id as user_id, u.organization_id, u.temple_id, u.user_type
             FROM user_auth_sessions s
             JOIN users u ON s.user_id = u.id
             WHERE s.access_token_hash = ? AND s.revoked = 0 AND s.token_expires_at > NOW() AND u.deleted_at IS NULL`, [hash]);
        if (!rows.length)
            return res.status(401).json({ message: 'Invalid session' });
        const { user_id, organization_id, temple_id, session_id, user_type } = rows[0];
        // Validate temple belongs to organization (skip for super_admin and org_admin)
        if (temple_id && !['super_admin', 'org_admin'].includes(user_type)) {
            const [temples] = await db_1.default.execute(`SELECT id FROM temples WHERE id = ? AND organization_id = ? AND deleted_at IS NULL`, [temple_id, organization_id]);
            if (!temples.length)
                return res.status(403).json({ message: 'Temple does not belong to your organization' });
        }
        req.user = {
            id: user_id,
            user_type: decoded.user_type,
            organization_id,
            temple_id,
            session_id,
            permissions: decoded.permissions || {}
        };
        next();
    }
    catch (e) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
exports.authenticate = authenticate;
const requirePermission = (code, minLevel = 1) => async (req, res, next) => {
    if (!req.user)
        return res.status(401).json({ message: 'Unauthorized' });
    if (['super_admin', 'org_admin'].includes(req.user.user_type))
        return next();
    const userLevel = req.user.permissions[code] || 0;
    if (userLevel < minLevel) {
        return res.status(403).json({
            message: `Access denied: Required level ${minLevel} for ${code}`
        });
    }
    next();
};
exports.requirePermission = requirePermission;
const validateBodyOwnership = (req, res, next) => {
    if (!req.user)
        return res.status(401).json({ message: 'Unauthorized' });
    const bodyOrgId = req.body.organization_id;
    const bodyTempleId = req.body.temple_id;
    if (bodyOrgId !== undefined && Number(bodyOrgId) !== req.user.organization_id) {
        return res.status(403).json({ message: 'organization_id does not match your account' });
    }
    if (bodyTempleId !== undefined && Number(bodyTempleId) !== req.user.temple_id) {
        return res.status(403).json({ message: 'temple_id does not match your account' });
    }
    next();
};
exports.validateBodyOwnership = validateBodyOwnership;
