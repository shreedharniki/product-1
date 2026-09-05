"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAudit = void 0;
const logAudit = async ({ connection, actor_user_id, organization_id, temple_id, table_name, record_id, action, old_data = null, new_data = null, }) => {
    await connection.query(`INSERT INTO audit_logs
     (actor_user_id, organization_id, temple_id, table_name, record_id, action, old_data, new_data, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`, [
        actor_user_id,
        organization_id,
        temple_id,
        table_name,
        record_id,
        action,
        old_data ? JSON.stringify(old_data) : null,
        new_data ? JSON.stringify(new_data) : null,
    ]);
};
exports.logAudit = logAudit;
