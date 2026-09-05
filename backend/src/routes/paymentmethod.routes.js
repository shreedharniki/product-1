"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentmethod_controller_1 = require("../controllers/paymentmethod.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.authenticate);
router.get("/", (0, auth_middleware_1.requirePermission)('manage_payment_methods', 1), paymentmethod_controller_1.getPaymentMethods);
router.get("/:id", (0, auth_middleware_1.requirePermission)('manage_payment_methods', 1), paymentmethod_controller_1.getPaymentMethodById);
router.post("/", (0, auth_middleware_1.requirePermission)('manage_payment_methods', 2), paymentmethod_controller_1.createPaymentMethod);
router.put("/:id", (0, auth_middleware_1.requirePermission)('manage_payment_methods', 3), paymentmethod_controller_1.updatePaymentMethod);
router.delete("/:id", (0, auth_middleware_1.requirePermission)('manage_payment_methods', 4), paymentmethod_controller_1.deletePaymentMethod);
exports.default = router;
