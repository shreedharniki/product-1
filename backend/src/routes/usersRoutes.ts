import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/usersController";
import { authenticate, requirePermission } from "../middleware/auth.middleware";
const router = Router();
router.use(authenticate);
router.get("/" ,requirePermission('manage_users', 1), getUsers);
router.get("/:id",requirePermission('manage_users', 1), getUser);
router.post("/", requirePermission('manage_users', 1),createUser);
router.put("/:id",requirePermission('manage_users', 1), updateUser);
router.delete("/:id",requirePermission('manage_users', 1),deleteUser);

export default router;