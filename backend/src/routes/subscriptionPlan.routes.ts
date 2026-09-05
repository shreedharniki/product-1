import { Router } from "express";
import {
  createSubscriptionPlan,
  getSubscriptionPlans,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  assignModulesToPlan,
  getPlanModules,
} from "../controllers/subscriptionPlan.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

/**
 * Protect all routes
 */
// router.use(authenticate);

/**
 * Subscription Plan CRUD
 */

// Create Plan
router.post("/", createSubscriptionPlan);

// Get All Plans
router.get("/", getSubscriptionPlans);

// Get Single Plan
router.get("/:id", getSubscriptionPlanById);

// Update Plan
router.put("/:id", updateSubscriptionPlan);

// Soft Delete Plan
router.delete("/:id", deleteSubscriptionPlan);

/**
 * Plan Modules
 */

// Assign modules to plan
router.post("/:id/modules", assignModulesToPlan);

// Get modules assigned to a plan
router.get("/:id/modules", getPlanModules);

export default router;