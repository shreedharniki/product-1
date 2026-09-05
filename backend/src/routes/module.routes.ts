import { Router } from "express";

import {
  getModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
} from "../controllers/module.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// router.use(authenticate);

router.get("/", getModules);

router.get("/:id", getModuleById);

router.post("/", createModule);

router.put("/:id", updateModule);

router.delete("/:id", deleteModule);

export default router;