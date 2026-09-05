import { Request, Response } from 'express';
import db from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import fs from 'fs';
import path from 'path';

const banksData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'banks.json'), 'utf-8'));

const bankPrefixMap = new Map<string, { code: string; type: string }>();
for (const key in banksData) {
    const bank = banksData[key];
    if (bank.ifsc) bankPrefixMap.set(String(bank.ifsc).slice(0, 4).toUpperCase(), { code: bank.code, type: bank.type });
}

export const lookupIfsc = async (req: Request, res: Response) => {
    const { organization_id } = req.user!;
    const ifsc = String(req.params.ifsc).toUpperCase();
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) return res.json({ success: true, found: false });
    const meta = bankPrefixMap.get(ifsc.slice(0, 4));
    const apiRes = await fetch(`https://ifsc.razorpay.com/${ifsc}`).catch(() => null);
    if (apiRes && apiRes.ok) {
        const d = await apiRes.json();
        return res.json({
            success: true,
            found: true,
            is_custom: false,
            data: {
                ifsc: d.IFSC,
                bank_name: d.BANK,
                branch: d.BRANCH,
                branch_address: d.ADDRESS,
                city: d.CITY,
                state: d.STATE,
                bank_type: meta ? meta.type : null,
                bank_code: meta ? meta.code : null
            }
        });
    }
    const [custom] = await db.query<RowDataPacket[]>(
        `SELECT bank_name, branch_address FROM hundi_bank_details
         WHERE organization_id = ? AND ifsc_code = ? AND is_custom = 1
         ORDER BY created_at DESC LIMIT 1`,
        [organization_id, ifsc]
    );
    if (custom.length === 0) return res.json({ success: true, found: false });
    res.json({
        success: true,
        found: true,
        is_custom: true,
        data: {
            ifsc,
            bank_name: custom[0].bank_name,
            branch: 'Custom Bank',
            branch_address: custom[0].branch_address,
            city: null,
            state: null,
            bank_type: meta ? meta.type : null,
            bank_code: meta ? meta.code : null
        }
    });
};

export const getBankDetails = async (req: Request, res: Response) => {
    const { organization_id } = req.user!;
    const { temple_id } = req.query;
    const params: (string | number)[] = [organization_id];
    let query = 'SELECT * FROM hundi_bank_details WHERE organization_id = ?';
    if (temple_id) {
        query += ' AND temple_id = ?';
        params.push(Number(temple_id));
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await db.query(query, params);
    res.json({ success: true, data: rows });
};

export const createBankDetail = async (req: Request, res: Response) => {
    const { temple_id, ifsc_code, bank_name, account_number, account_holder_name, account_type, branch_address, is_custom } = req.body;
    const [temple] = await db.query<RowDataPacket[]>('SELECT organization_id FROM temples WHERE id = ?', [temple_id]);
    if (temple.length === 0) return res.status(404).json({ success: false, message: 'Temple not found' });
    const organization_id = temple[0].organization_id;
    const [result] = await db.query<ResultSetHeader>(
        `INSERT INTO hundi_bank_details (organization_id, temple_id, ifsc_code, bank_name, account_number, account_holder_name, account_type, branch_address, is_custom) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [organization_id, temple_id, ifsc_code, bank_name, account_number, account_holder_name, account_type, branch_address, is_custom ? 1 : 0]
    );
    res.status(201).json({ success: true, message: 'Bank details saved successfully', data: { id: result.insertId } });
};

export const updateBankDetail = async (req: Request, res: Response) => {
    const { organization_id } = req.user!;
    const { id } = req.params;
    const { ifsc_code, bank_name, account_number, account_holder_name, account_type, branch_address, is_custom } = req.body;
    const [result] = await db.query<ResultSetHeader>(
        `UPDATE hundi_bank_details SET ifsc_code = ?, bank_name = ?, account_number = ?, account_holder_name = ?, account_type = ?, branch_address = ?, is_custom = ? WHERE id = ? AND organization_id = ?`,
        [ifsc_code, bank_name, account_number, account_holder_name, account_type, branch_address, is_custom ? 1 : 0, id, organization_id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Bank account not found' });
    res.json({ success: true, message: 'Bank details updated successfully' });
};

export const deleteBankDetail = async (req: Request, res: Response) => {
    const { organization_id } = req.user!;
    const { id } = req.params;
    const [result] = await db.query<ResultSetHeader>(
        `DELETE FROM hundi_bank_details WHERE id = ? AND organization_id = ?`,
        [id, organization_id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Bank account not found' });
    res.json({ success: true, message: 'Bank account deleted successfully' });
};

export const getTrackingStatus = async (req: Request, res: Response) => {
    const { organization_id } = req.user!;
    const [rows] = await db.query(
        `SELECT hundi_id,
            SUM(CASE WHEN amount_type = 'cash' THEN deposited_amount ELSE 0 END) AS deposited_cash,
            SUM(CASE WHEN amount_type = 'items' THEN deposited_amount ELSE 0 END) AS deposited_items,
            SUM(CASE WHEN amount_type = 'both' THEN deposited_amount ELSE 0 END) AS deposited_both,
            COUNT(*) AS entries
         FROM hundi_tracking WHERE organization_id = ? GROUP BY hundi_id`,
        [organization_id]
    );
    res.json({ success: true, data: rows });
};

export const getTrackingList = async (req: Request, res: Response) => {
    const { organization_id, temple_id, user_type } = req.user!;
    const params: (string | number)[] = [organization_id];
    let scope = '';
    if (!['super_admin', 'org_admin'].includes(user_type)) {
        scope = ' AND h.temple_id = ?';
        params.push(temple_id);
    }
    const [rows] = await db.query(
        `SELECT h.id, h.opened_at, h.temple_id, h.total_amount, h.total_items_value,
                t.name AS temple_name,
                COALESCE(SUM(CASE WHEN tr.amount_type = 'cash' THEN tr.deposited_amount ELSE 0 END), 0) AS deposited_cash,
                COALESCE(SUM(CASE WHEN tr.amount_type = 'items' THEN tr.deposited_amount ELSE 0 END), 0) AS deposited_items,
                COALESCE(SUM(CASE WHEN tr.amount_type = 'both' THEN tr.deposited_amount ELSE 0 END), 0) AS deposited_both,
                COUNT(tr.id) AS entries
         FROM hundi h
         JOIN temples t ON h.temple_id = t.id
         LEFT JOIN hundi_tracking tr ON tr.hundi_id = h.id
         WHERE h.organization_id = ?${scope}
         GROUP BY h.id ORDER BY h.opened_at DESC`,
        params
    );
    res.json({ success: true, data: rows });
};

export const getTrackingByHundi = async (req: Request, res: Response) => {
    const { organization_id } = req.user!;
    const { hundiId } = req.params;
    const [hundiRows] = await db.query<RowDataPacket[]>(
        `SELECT h.id, h.temple_id, h.total_amount, h.total_items_value,
                t.name AS temple_name, t.organization_id, o.name AS organization_name
         FROM hundi h
         JOIN temples t ON h.temple_id = t.id
         JOIN organizations o ON t.organization_id = o.id
         WHERE h.id = ? AND h.organization_id = ?`,
        [hundiId, organization_id]
    );
    if (hundiRows.length === 0) return res.status(404).json({ success: false, message: 'Hundi not found' });
    const [entries] = await db.query(
        `SELECT tr.*, bd.bank_name, bd.account_number, bd.ifsc_code
         FROM hundi_tracking tr
         LEFT JOIN hundi_bank_details bd ON tr.bank_detail_id = bd.id
         WHERE tr.hundi_id = ? ORDER BY tr.deposited_at DESC`,
        [hundiId]
    );
    res.json({ success: true, data: { hundi: hundiRows[0], entries } });
};

export const createTracking = async (req: Request, res: Response) => {
    const { organization_id } = req.user!;
    const { hundi_id, temple_id, bank_detail_id, amount_type, deposited_amount, deposited_at, deposit_mode, deposit_reference } = req.body;
    const [result] = await db.query<ResultSetHeader>(
        `INSERT INTO hundi_tracking (hundi_id, organization_id, temple_id, bank_detail_id, amount_type, deposited_amount, deposited_at, deposit_mode, deposit_reference) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [hundi_id, organization_id, temple_id, bank_detail_id, amount_type, deposited_amount, deposited_at, deposit_mode, deposit_reference]
    );
    res.status(201).json({ success: true, message: 'Tracking entry saved successfully', data: { id: result.insertId } });
};