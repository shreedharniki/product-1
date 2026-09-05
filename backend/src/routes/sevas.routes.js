"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sevas_controller_1 = require("../controllers/sevas.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// All seva routes require a valid token
router.use(auth_middleware_1.authenticate);
router.get("/search", (0, auth_middleware_1.requirePermission)('manage_sevas', 1), sevas_controller_1.searchSevas);
// Level 1: View permission
router.get("/", (0, auth_middleware_1.requirePermission)('manage_sevas', 1), sevas_controller_1.getSevas);
router.get("/:id", (0, auth_middleware_1.requirePermission)('manage_sevas', 1), sevas_controller_1.getSevaById);
// Level 2: Add/Create permission
router.post("/", (0, auth_middleware_1.requirePermission)('manage_sevas', 2), sevas_controller_1.createSeva);
// Level 3: Update/Edit permission
router.put("/:id", (0, auth_middleware_1.requirePermission)('manage_sevas', 3), sevas_controller_1.updateSeva);
// Level 4: Delete permission
router.delete("/:id", (0, auth_middleware_1.requirePermission)('manage_sevas', 4), sevas_controller_1.deleteSeva);
exports.default = router;
