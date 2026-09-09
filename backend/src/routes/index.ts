import { Router } from "express"

// import organizationRoutes from "../features/organizations/routes/organizationRoutes"
import moduleRoutes from "../features/modules/routes/moduleRoutes"
import subModuleRoutes from "../features/submodule/routes/subModuleRoutes"

const router = Router()

// router.use(organizationRoutes)
router.use(moduleRoutes)
router.use("/sub-modules", subModuleRoutes)
export default router