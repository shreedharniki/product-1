"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscriptionPlan_controller_1 = require("../controllers/subscriptionPlan.controller");
const router = (0, express_1.Router)();
/**
 * Protect all routes
 */
// router.use(authenticate);
/**
 * Subscription Plan CRUD
 */
// Create Plan
router.post("/", subscriptionPlan_controller_1.createSubscriptionPlan);
// Get All Plans
router.get("/", subscriptionPlan_controller_1.getSubscriptionPlans);
// Get Single Plan
router.get("/:id", subscriptionPlan_controller_1.getSubscriptionPlanById);
// Update Plan
router.put("/:id", subscriptionPlan_controller_1.updateSubscriptionPlan);
// Soft Delete Plan
router.delete("/:id", subscriptionPlan_controller_1.deleteSubscriptionPlan);
/**
 * Plan Modules
 */
// Assign modules to plan
router.post("/:id/modules", subscriptionPlan_controller_1.assignModulesToPlan);
// Get modules assigned to a plan
router.get("/:id/modules", subscriptionPlan_controller_1.getPlanModules);
exports.default = router;
