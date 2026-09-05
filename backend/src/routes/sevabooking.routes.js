"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sevabooking_controller_1 = require("../controllers/sevabooking.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// protect all routes
router.use(auth_middleware_1.authenticate);
// GET all bookings
router.get("/", (0, auth_middleware_1.requirePermission)('manage_sevabooking', 1), sevabooking_controller_1.getSevaBookings);
// GET single booking
router.get("/:id", (0, auth_middleware_1.requirePermission)('manage_sevabooking', 1), sevabooking_controller_1.getSevaBookingById);
// CREATE booking
router.post("/", (0, auth_middleware_1.requirePermission)('manage_sevabooking', 2), sevabooking_controller_1.createSevaBooking);
// UPDATE booking
router.put("/:id", (0, auth_middleware_1.requirePermission)('manage_sevabooking', 3), sevabooking_controller_1.updateSevaBooking);
// DELETE booking
router.delete("/:id", (0, auth_middleware_1.requirePermission)('manage_sevabooking', 4), sevabooking_controller_1.deleteSevaBooking);
router.put("/:id/cancel", (0, auth_middleware_1.requirePermission)('manage_sevabooking', 3), sevabooking_controller_1.cancelSevaBooking);
exports.default = router;
