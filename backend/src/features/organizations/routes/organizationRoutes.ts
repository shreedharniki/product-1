import { Router } from "express"

import {
  getOrganizations,
} from "../controllers/organizationController"

const router = Router()

router.get(
  "/organizations",
  getOrganizations,
)

export default router