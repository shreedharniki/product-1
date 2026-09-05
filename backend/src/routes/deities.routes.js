"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deities_controller_1 = require("../controllers/deities.controller");
const uploadDeity_1 = require("../middleware/uploadDeity");
// 1. Import the security middleware
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// 2. Require Login for ALL routes
router.use(auth_middleware_1.authenticate);
// 3. Level 1 (View) - Needed for Tables & Dropdowns
// Note: Your Hundi user must have 'manage_deities' (Level 1) to see names in the Hundi table.
router.get("/", (0, auth_middleware_1.requirePermission)('manage_deities', 1), deities_controller_1.getDeities);
// 4. Level 2 (Create/Edit) - For adding new deities
router.post("/", (0, auth_middleware_1.requirePermission)('manage_deities', 2), uploadDeity_1.uploadDeity.single("img_name"), deities_controller_1.createDeity);
router.put("/:id", (0, auth_middleware_1.requirePermission)('manage_deities', 2), uploadDeity_1.uploadDeity.single("img_name"), deities_controller_1.updateDeity);
// 5. Level 4 (Delete) - For removing records
router.delete("/:id", (0, auth_middleware_1.requirePermission)('manage_deities', 4), deities_controller_1.deleteDeity);
exports.default = router;
