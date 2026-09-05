"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadTemple = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadDir = path_1.default.join(__dirname, "../public/temple");
// Ensure directory exists
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const orgId = req.user?.organization_id;
        const templeId = req.user?.temple_id;
        const timestamp = Date.now();
        const ext = path_1.default.extname(file.originalname);
        const fileName = `org_${orgId}_tem_${templeId}_${timestamp}${ext}`;
        cb(null, fileName);
    },
});
exports.uploadTemple = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = [".jpg", ".jpeg", ".png", ".webp"];
        if (!allowed.includes(path_1.default.extname(file.originalname).toLowerCase())) {
            return cb(new Error("Only images are allowed"));
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
