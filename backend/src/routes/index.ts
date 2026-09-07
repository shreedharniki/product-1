import { Router } from "express"

import organizationRoutes from "../features/organizations/routes/organizationRoutes"
import moduleRoutes from "../features/modules/routes/moduleRoutes"
const router = Router()

router.use(organizationRoutes)
router.use(moduleRoutes)
export default router