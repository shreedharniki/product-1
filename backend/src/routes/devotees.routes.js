"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const devotees_controller_1 = require("../controllers/devotees.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.authenticate);
//  SEARCH ROUTE (MUST BE BEFORE /:id)
router.get("/search", (0, auth_middleware_1.requirePermission)("manage_devotees", 1), devotees_controller_1.searchDevotees);
router.get("/", (0, auth_middleware_1.requirePermission)('manage_devotees', 1), devotees_controller_1.getDevotees);
router.get("/:id", (0, auth_middleware_1.requirePermission)('manage_devotees', 1), devotees_controller_1.getDevoteeById);
router.post("/", (0, auth_middleware_1.requirePermission)('manage_devotees', 2), devotees_controller_1.createDevotee);
router.put("/:id", (0, auth_middleware_1.requirePermission)('manage_devotees', 3), devotees_controller_1.updateDevotee);
router.delete("/:id", (0, auth_middleware_1.requirePermission)('manage_devotees', 4), devotees_controller_1.deleteDevotee);
exports.default = router;
