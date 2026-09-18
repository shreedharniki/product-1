import { Router } from "express"

// import organizationRoutes from "../features/organizations/routes/organizationRoutes"
import moduleRoutes from "../features/modules/routes/moduleRoutes"
import subModuleRoutes from "../features/submodule/routes/subModuleRoutes"
import subscriptionPlanRoutes from "../features/subscription_plans/routes/subscriptionPlanRoutes";
import subscriptionBundleRoutes from "../features/subscription_bundles/routes/subscriptionBundleRoutes";

const router = Router()

// router.use(organizationRoutes)
router.use(moduleRoutes)
router.use("/sub-modules", subModuleRoutes)
router.use(
  "/subscription-plans",
  subscriptionPlanRoutes,
);
router.use(
  "/subscription-bundles",
  subscriptionBundleRoutes,
);
export default router