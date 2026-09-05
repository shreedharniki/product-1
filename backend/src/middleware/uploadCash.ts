import multer from 'multer';
import path from 'path';
import fs from 'fs';

const CASH_DIR = path.join(process.cwd(), 'src', 'public', 'cash');

if (!fs.existsSync(CASH_DIR)) fs.mkdirSync(CASH_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, CASH_DIR),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `denom_${Date.now()}${ext}`);
    }
});

export const uploadCashImage = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only image files are allowed'));
    }
});