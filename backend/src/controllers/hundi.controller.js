"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDenomination = exports.deleteDenominationImage = exports.uploadDenominationImage = exports.createDenomination = exports.getDenominations = exports.deleteMasterHundi = exports.createMasterHundi = exports.getMasterHundis = exports.finalizeHundi = exports.getOrgRoles = exports.getWitnessSuggestions = exports.deleteItemUnit = exports.getTemplesByOrg = exports.deleteHundi = exports.updateHundi = exports.createHundi = exports.getHundiById = exports.getAllHundis = exports.getItemUnits = void 0;
const db_1 = __importDefault(require("../config/db"));
const uploadhundi_1 = require("../middleware/uploadhundi");
const uploadCash_1 = require("../middleware/uploadCash");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const processUpload = (req, res) => {
    return new Promise((resolve, reject) => {
        uploadhundi_1.uploadHundiImages.fields([
            { name: 'witness_img', maxCount: 1 },
            { name: 'signature_img', maxCount: 1 }
        ])(req, res, (err) => {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
};
const processCashUpload = (req, res) => {
    return new Promise((resolve, reject) => {
        uploadCash_1.uploadCashImage.single('denom_img')(req, res, (err) => {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
};
const UPLOAD_DIR = path_1.default.join(process.cwd(), 'src', 'public', 'hundi');
const CASH_DIR = path_1.default.join(process.cwd(), 'src', 'public', 'cash');
const deleteFile = (filename, dir = UPLOAD_DIR) => {
    if (!filename)
        return;
    const filePath = path_1.default.join(dir, filename);
    fs_1.default.unlink(filePath, (err) => {
        if (err && err.code !== 'ENOENT')
            console.error(`Failed to delete file: ${filePath}`, err);
    });
};
const getItemUnits = async (req, res) => {
    try {
        const { organization_id, temple_id } = req.user;
        const [rows] = await db_1.default.query(`SELECT unit_name FROM item_units 
             WHERE organization_id = ? AND temple_id = ? AND status = 'active' 
             ORDER BY unit_name ASC`, [organization_id, temple_id]);
        res.json({ success: true, data: rows });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch units' });
    }
};
exports.getItemUnits = getItemUnits;
const getAllHundis = async (req, res) => {
    try {
        const { organization_id, temple_id, user_type } = req.user;
        let query = 'SELECT * FROM hundi WHERE organization_id = ?';
        const params = [organization_id];
        if (!['super_admin', 'org_admin'].includes(user_type)) {
            query += ' AND temple_id = ?';
            params.push(temple_id);
        }
        query += ' ORDER BY opened_at DESC';
        const [rows] = await db_1.default.execute(query, params);
        res.json({ success: true, data: rows });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
exports.getAllHundis = getAllHundis;
const getHundiById = async (req, res) => {
    try {
        const { organization_id } = req.user;
        const hundiId = req.params.id;
        const [hundiRows] = await db_1.default.execute('SELECT * FROM hundi WHERE id = ? AND organization_id = ?', [hundiId, organization_id]);
        if (hundiRows.length === 0)
            return res.status(404).json({ success: false, message: 'Hundi not found' });
        const hundi = hundiRows[0];
        const [witnesses] = await db_1.default.query('SELECT * FROM hundi_witnesses WHERE hundi_id = ?', [hundiId]);
        const [denominations] = await db_1.default.query('SELECT * FROM hundi_denominations WHERE hundi_id = ?', [hundiId]);
        const [items] = await db_1.default.query('SELECT id, item_name, quantity, unit, estimated_value, description, weight_value FROM hundi_items WHERE hundi_id = ?', [hundiId]);
        res.json({ success: true, data: { ...hundi, witnesses, denominations, items } });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch details' });
    }
};
exports.getHundiById = getHundiById;
const createHundi = async (req, res) => {
    try {
        await processUpload(req, res);
        const bodyData = JSON.parse(req.body.data);
        const { organization_id, temple_id } = req.user;
        const { opened_at, deity_id, deity_ids, total_amount, total_items_value, remark, witnesses, denominations, items } = bodyData;
        const files = req.files;
        const witnessImgName = files?.witness_img ? files.witness_img[0].filename : null;
        const signatureImgName = files?.signature_img ? files.signature_img[0].filename : null;
        const connection = await db_1.default.getConnection();
        try {
            await connection.beginTransaction();
            const [hundiResult] = await connection.query(`INSERT INTO hundi (organization_id, temple_id, opened_at, deity_id, deity_ids, total_amount, total_items_value, remark, hundi_img_name, hundi_witness_signature) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [organization_id, temple_id, opened_at, deity_id || null, deity_ids || null, total_amount, total_items_value, remark, witnessImgName, signatureImgName]);
            const hundiId = hundiResult.insertId;
            if (witnesses?.length) {
                await connection.query(`INSERT INTO hundi_witnesses (hundi_id, name, email, phone, designation, address_line1, address_line2, city, pincode, remark) VALUES ?`, [witnesses.map((w) => [hundiId, w.name, w.email, w.phone, w.designation, w.address_line1, w.address_line2, w.city, w.pincode, w.remark])]);
            }
            if (denominations?.length) {
                await connection.query(`INSERT INTO hundi_denominations (hundi_id, denomination_type, denomination_value, quantity, subtotal) VALUES ?`, [denominations.map((d) => [hundiId, d.denomination_type, d.denomination_value, d.quantity, d.denomination_value * d.quantity])]);
            }
            if (items?.length) {
                await connection.query(`INSERT INTO hundi_items (hundi_id, item_name, quantity, unit, description, estimated_value, weight_value) VALUES ?`, [items.map((i) => [hundiId, i.item_name, i.quantity, i.unit, i.description, i.estimated_value, i.weight_value])]);
                const standardUnits = ['gms', 'kgs', 'mg', 'pcs'];
                const uniqueUnits = [...new Set(items.map((i) => String(i.unit)))]
                    .filter((u) => !standardUnits.includes(String(u).toLowerCase()) && u !== 'Other');
                for (const unitName of uniqueUnits) {
                    if (unitName && typeof unitName === 'string') {
                        await connection.query(`INSERT IGNORE INTO item_units (organization_id, temple_id, unit_name) VALUES (?, ?, ?)`, [organization_id, temple_id, unitName]);
                    }
                }
            }
            await connection.commit();
            res.status(201).json({ success: true, message: 'Hundi created successfully', data: { id: hundiId } });
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create hundi' });
    }
};
exports.createHundi = createHundi;
const updateHundi = async (req, res) => {
    try {
        await processUpload(req, res);
        const hundiId = req.params.id;
        const bodyData = JSON.parse(req.body.data);
        const { organization_id, temple_id, opened_at, deity_id, deity_ids, total_amount, total_items_value, remark, witnesses, denominations, items, delete_witness_image } = bodyData;
        const files = req.files;
        const [existingHundi] = await db_1.default.execute('SELECT hundi_img_name, hundi_witness_signature FROM hundi WHERE id = ?', [hundiId]);
        if (existingHundi.length === 0)
            return res.status(404).json({ success: false, message: 'Hundi not found' });
        const currentWitnessImg = existingHundi[0].hundi_img_name;
        const currentSignatureImg = existingHundi[0].hundi_witness_signature;
        const connection = await db_1.default.getConnection();
        try {
            await connection.beginTransaction();
            let updateQuery = `UPDATE hundi SET opened_at=?, deity_id=?, deity_ids=?, total_amount=?, total_items_value=?, remark=?`;
            const queryParams = [opened_at, deity_id || null, deity_ids || null, total_amount, total_items_value, remark];
            if (files?.witness_img) {
                if (currentWitnessImg)
                    deleteFile(currentWitnessImg);
                updateQuery += `, hundi_img_name=?`;
                queryParams.push(files.witness_img[0].filename);
            }
            else if (delete_witness_image) {
                if (currentWitnessImg)
                    deleteFile(currentWitnessImg);
                updateQuery += `, hundi_img_name=NULL`;
            }
            if (files?.signature_img) {
                if (currentSignatureImg)
                    deleteFile(currentSignatureImg);
                updateQuery += `, hundi_witness_signature=?`;
                queryParams.push(files.signature_img[0].filename);
            }
            updateQuery += ` WHERE id=?`;
            queryParams.push(hundiId);
            await connection.query(updateQuery, queryParams);
            await connection.query('DELETE FROM hundi_witnesses WHERE hundi_id = ?', [hundiId]);
            await connection.query('DELETE FROM hundi_denominations WHERE hundi_id = ?', [hundiId]);
            await connection.query('DELETE FROM hundi_items WHERE hundi_id = ?', [hundiId]);
            if (witnesses?.length) {
                await connection.query(`INSERT INTO hundi_witnesses (hundi_id, name, email, phone, designation, address_line1, address_line2, city, pincode, remark) VALUES ?`, [witnesses.map((w) => [hundiId, w.name, w.email, w.phone, w.designation, w.address_line1, w.address_line2, w.city, w.pincode, w.remark])]);
            }
            if (denominations?.length) {
                await connection.query(`INSERT INTO hundi_denominations (hundi_id, denomination_type, denomination_value, quantity, subtotal) VALUES ?`, [denominations.map((d) => [hundiId, d.denomination_type, d.denomination_value, d.quantity, d.denomination_value * d.quantity])]);
            }
            if (items?.length) {
                await connection.query(`INSERT INTO hundi_items (hundi_id, item_name, quantity, unit, description, estimated_value, weight_value) VALUES ?`, [items.map((i) => [hundiId, i.item_name, i.quantity, i.unit, i.description, i.estimated_value, i.weight_value])]);
                const standardUnits = ['gms', 'kgs', 'mg', 'pcs'];
                const uniqueUnits = [...new Set(items.map((i) => String(i.unit)))]
                    .filter((u) => !standardUnits.includes(String(u).toLowerCase()) && u !== 'Other');
                for (const unitName of uniqueUnits) {
                    if (unitName && typeof unitName === 'string') {
                        await connection.query(`INSERT IGNORE INTO item_units (organization_id, temple_id, unit_name) VALUES (?, ?, ?)`, [organization_id, temple_id, unitName]);
                    }
                }
            }
            await connection.commit();
            res.json({ success: true, message: 'Hundi updated successfully' });
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update hundi' });
    }
};
exports.updateHundi = updateHundi;
const deleteHundi = async (req, res) => {
    try {
        const hundiId = req.params.id;
        const [rows] = await db_1.default.execute('SELECT hundi_img_name, hundi_witness_signature FROM hundi WHERE id = ?', [hundiId]);
        if (rows.length > 0) {
            if (rows[0].hundi_img_name)
                deleteFile(rows[0].hundi_img_name);
            if (rows[0].hundi_witness_signature)
                deleteFile(rows[0].hundi_witness_signature);
        }
        await db_1.default.query('DELETE FROM hundi WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Hundi deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete hundi' });
    }
};
exports.deleteHundi = deleteHundi;
const getTemplesByOrg = async (req, res) => {
    const { orgId } = req.params;
    try {
        const [rows] = await db_1.default.execute(`SELECT id, name, address_line1, address_line2, city, state, pincode, phone FROM temples WHERE organization_id = ? AND deleted_at IS NULL`, [orgId]);
        return res.status(200).json({ success: true, data: rows });
    }
    catch (error) {
        return res.status(500).json({ message: 'Database error' });
    }
};
exports.getTemplesByOrg = getTemplesByOrg;
const deleteItemUnit = async (req, res) => {
    try {
        const { temple_id, unit_name } = req.body;
        const organization_id = req.user?.organization_id;
        if (!temple_id || !unit_name)
            return res.status(400).json({ success: false, message: "Missing required fields" });
        await db_1.default.execute(`DELETE FROM item_units WHERE organization_id = ? AND temple_id = ? AND unit_name = ?`, [organization_id, temple_id, unit_name]);
        res.status(200).json({ success: true, message: "Unit deleted" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.deleteItemUnit = deleteItemUnit;
const getWitnessSuggestions = async (req, res) => {
    const { templeId } = req.params;
    const { query } = req.query;
    if (!templeId || !query)
        return res.status(400).json({ success: false, message: "Missing parameters" });
    try {
        const searchTerm = `%${query}%`;
        const [trustees] = await db_1.default.execute(`SELECT name, email, phone, address_line1, address_line2, city, pincode FROM trustees WHERE temple_id = ? AND name LIKE ? LIMIT 5`, [templeId, searchTerm]);
        const trusteeResults = trustees.map((t) => ({ ...t, designation: 'Trustee' }));
        const [witnesses] = await db_1.default.execute(`
            SELECT hw.name, hw.designation, hw.email, hw.phone, hw.address_line1, hw.address_line2, hw.city, hw.pincode 
            FROM hundi_witnesses hw JOIN hundi h ON hw.hundi_id = h.id
            WHERE h.temple_id = ? AND hw.name LIKE ? LIMIT 5
        `, [templeId, searchTerm]);
        res.json({ success: true, data: [...trusteeResults, ...witnesses].slice(0, 5) });
    }
    catch (error) {
        res.json({ success: true, data: [] });
    }
};
exports.getWitnessSuggestions = getWitnessSuggestions;
const getOrgRoles = async (req, res) => {
    const { organization_id, temple_id } = req.query;
    if (!organization_id)
        return res.json({ success: true, data: [{ name: 'Trustee' }, { name: 'Admin' }] });
    try {
        const [rows] = await db_1.default.execute(`SELECT DISTINCT name FROM roles WHERE organization_id = ? AND (temple_id IS NULL OR temple_id = ?) AND deleted_at IS NULL`, [organization_id, temple_id]);
        res.json({ success: true, data: rows.length > 0 ? rows : [{ name: 'Trustee' }, { name: 'Admin' }] });
    }
    catch (error) {
        res.json({ success: true, data: [{ name: 'Trustee' }, { name: 'Admin' }] });
    }
};
exports.getOrgRoles = getOrgRoles;
const finalizeHundi = async (req, res) => {
    try {
        await processUpload(req, res);
        const hundiId = req.params.id;
        const files = req.files;
        if (!files?.signature_img)
            return res.status(400).json({ success: false, message: 'No signature image uploaded' });
        const [existing] = await db_1.default.execute('SELECT hundi_witness_signature FROM hundi WHERE id = ?', [hundiId]);
        if (existing.length > 0 && existing[0].hundi_witness_signature)
            deleteFile(existing[0].hundi_witness_signature);
        await db_1.default.query('UPDATE hundi SET hundi_witness_signature = ? WHERE id = ?', [files.signature_img[0].filename, hundiId]);
        res.json({ success: true, message: 'Signature uploaded successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to upload signature' });
    }
};
exports.finalizeHundi = finalizeHundi;
const getMasterHundis = async (req, res) => {
    try {
        const [rows] = await db_1.default.query('SELECT * FROM define_hundi WHERE status = "active"');
        res.status(200).json({ success: true, data: rows });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getMasterHundis = getMasterHundis;
const createMasterHundi = async (req, res) => {
    try {
        const { organization_id, temple_id, deity_id, hundi_name, hundi_number } = req.body;
        const [existingDeity] = await db_1.default.query(`SELECT id FROM define_hundi WHERE temple_id = ? AND deity_id = ?`, [temple_id, deity_id]);
        if (existingDeity.length > 0)
            return res.status(400).json({ success: false, message: 'A Hundi is already defined for this specific deity.' });
        const [existingNameOrNumber] = await db_1.default.query(`SELECT id FROM define_hundi WHERE temple_id = ? AND (hundi_name = ? OR hundi_number = ?)`, [temple_id, hundi_name, hundi_number]);
        if (existingNameOrNumber.length > 0)
            return res.status(400).json({ success: false, message: 'A Hundi with this Name or Number is already defined in this temple!' });
        await db_1.default.query(`INSERT INTO define_hundi (organization_id, temple_id, deity_id, hundi_name, hundi_number) VALUES (?, ?, ?, ?, ?)`, [organization_id, temple_id, deity_id, hundi_name, hundi_number]);
        res.status(201).json({ success: true, message: 'Hundi defined successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.createMasterHundi = createMasterHundi;
const deleteMasterHundi = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db_1.default.query('DELETE FROM define_hundi WHERE id = ?', [id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ success: false, message: 'Hundi not found' });
        res.status(200).json({ success: true, message: 'Master Hundi deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.deleteMasterHundi = deleteMasterHundi;
const getDenominations = async (req, res) => {
    try {
        const { organization_id } = req.user;
        const [rows] = await db_1.default.query(`SELECT * FROM hundi_denomination_master WHERE organization_id = ? ORDER BY denomination_type ASC, denomination_value ASC`, [organization_id]);
        res.json({ success: true, data: rows });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch denominations' });
    }
};
exports.getDenominations = getDenominations;
const createDenomination = async (req, res) => {
    try {
        await processCashUpload(req, res);
        const { organization_id } = req.user;
        const { denomination_type, denomination_value } = req.body;
        if (!denomination_type || denomination_value === undefined)
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        const [existing] = await db_1.default.query(`SELECT id FROM hundi_denomination_master WHERE organization_id = ? AND denomination_type = ? AND denomination_value = ?`, [organization_id, denomination_type, denomination_value]);
        if (existing.length > 0)
            return res.status(400).json({ success: false, message: 'This denomination already exists' });
        const image_name = req.file?.filename || null;
        await db_1.default.query(`INSERT INTO hundi_denomination_master (organization_id, denomination_type, denomination_value, image_name) VALUES (?, ?, ?, ?)`, [organization_id, denomination_type, denomination_value, image_name]);
        res.status(201).json({ success: true, message: 'Denomination added successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add denomination' });
    }
};
exports.createDenomination = createDenomination;
const uploadDenominationImage = async (req, res) => {
    try {
        await processCashUpload(req, res);
        const { organization_id } = req.user;
        const { id } = req.params;
        if (!req.file)
            return res.status(400).json({ success: false, message: 'No image uploaded' });
        const [existing] = await db_1.default.query(`SELECT image_name FROM hundi_denomination_master WHERE id = ? AND organization_id = ?`, [id, organization_id]);
        if (existing.length === 0)
            return res.status(404).json({ success: false, message: 'Denomination not found' });
        if (existing[0].image_name)
            deleteFile(existing[0].image_name, CASH_DIR);
        await db_1.default.query(`UPDATE hundi_denomination_master SET image_name = ? WHERE id = ? AND organization_id = ?`, [req.file.filename, id, organization_id]);
        res.json({ success: true, message: 'Image uploaded', data: { image_name: req.file.filename } });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to upload image' });
    }
};
exports.uploadDenominationImage = uploadDenominationImage;
const deleteDenominationImage = async (req, res) => {
    try {
        const { organization_id } = req.user;
        const { id } = req.params;
        const [existing] = await db_1.default.query(`SELECT image_name FROM hundi_denomination_master WHERE id = ? AND organization_id = ?`, [id, organization_id]);
        if (existing.length === 0)
            return res.status(404).json({ success: false, message: 'Denomination not found' });
        if (existing[0].image_name)
            deleteFile(existing[0].image_name, CASH_DIR);
        await db_1.default.query(`UPDATE hundi_denomination_master SET image_name = NULL WHERE id = ? AND organization_id = ?`, [id, organization_id]);
        res.json({ success: true, message: 'Image removed' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to remove image' });
    }
};
exports.deleteDenominationImage = deleteDenominationImage;
const deleteDenomination = async (req, res) => {
    try {
        const { organization_id } = req.user;
        const { id } = req.params;
        const [existing] = await db_1.default.query(`SELECT image_name FROM hundi_denomination_master WHERE id = ? AND organization_id = ?`, [id, organization_id]);
        if (existing.length === 0)
            return res.status(404).json({ success: false, message: 'Denomination not found' });
        if (existing[0].image_name)
            deleteFile(existing[0].image_name, CASH_DIR);
        await db_1.default.query(`DELETE FROM hundi_denomination_master WHERE id = ? AND organization_id = ?`, [id, organization_id]);
        res.json({ success: true, message: 'Denomination deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete denomination' });
    }
};
exports.deleteDenomination = deleteDenomination;
