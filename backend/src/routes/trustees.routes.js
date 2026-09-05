"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const trustees_controller_1 = require("../controllers/trustees.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.authenticate);
router.get('/', (0, auth_middleware_1.requirePermission)('trustees', 1), trustees_controller_1.getTrustees);
router.get("/:id", (0, auth_middleware_1.requirePermission)("trustees", 1), trustees_controller_1.getTrusteeById);
router.post('/', (0, auth_middleware_1.requirePermission)('trustees', 2), trustees_controller_1.createTrustee);
router.put('/:id', (0, auth_middleware_1.requirePermission)('trustees', 3), trustees_controller_1.updateTrustee);
router.delete('/:id', (0, auth_middleware_1.requirePermission)('trustees', 4), trustees_controller_1.deleteTrustee);
exports.default = router;
