// import { Router } from "express"

// import {
//   getModules,
// } from "../controllers/modulesController"

// const router = Router()

// router.get(
//   "/modules",
//   getModules,
// )

// export default router

import { Router } from "express"

import {
  getModules,
  getModule,
  postModule,
   putModule,
  removeModule,
} from "../controllers/modulesController"

const router = Router()
// Get all modules
router.get(
  "/modules",
  getModules,
)

// Get module by ID
router.get(
  "/modules/:id",
  getModule,
)
// Create module
router.post(
  "/modules",
  postModule,
)

// Update module
router.put(
  "/modules/:id",
  putModule,
)

// Soft delete module
router.delete(
  "/modules/:id",
  removeModule,
)
export default router