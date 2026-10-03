import { Router } from "express"

// import organizationRoutes from "../features/organizations/routes/organizationRoutes"
import moduleRoutes from "../features/modules/routes/moduleRoutes"
import subModuleRoutes from "../features/submodule/routes/subModuleRoutes"
import subscriptionPlanRoutes from "../features/subscription_plans/routes/subscriptionPlanRoutes";
import subscriptionBundleRoutes from "../features/subscription_bundles/routes/subscriptionBundleRoutes";
import organizationRoutes from "../features/organizations/routes/organizationRoutes"
import systemDefaultsRoutes from "../features/settings/routes/systemDefaultsRoutes"
import roleRoutes from "../features/role/routes/roleRoutes"
import templeRoutes from "../features/temple/routes/templeRoutes"
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

router.use(
  "/organizations",
  organizationRoutes,
)
router.use(
  "/system-defaults",
  systemDefaultsRoutes,
)
router.use(
  "/roles",
  roleRoutes,
)
router.use(
  "/temples",
  templeRoutes,
)
export default router