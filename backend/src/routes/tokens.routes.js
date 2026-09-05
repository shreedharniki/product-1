"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/tokens.routes.ts
const express_1 = __importDefault(require("express"));
const tokens_controller_1 = require("../controllers/tokens.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// All routes require auth
router.use(auth_middleware_1.authenticate);
// Level 1: View
router.get("/", (0, auth_middleware_1.requirePermission)("manage_tokens", 1), tokens_controller_1.getTokens);
router.get("/:id", (0, auth_middleware_1.requirePermission)("manage_tokens", 1), tokens_controller_1.getTokenById);
// Level 2: Create
router.post("/", (0, auth_middleware_1.requirePermission)("manage_tokens", 1), tokens_controller_1.createToken);
// Level 3: Update
router.put("/:id", (0, auth_middleware_1.requirePermission)("manage_tokens", 3), tokens_controller_1.updateToken);
// Level 4: Delete
router.delete("/:id", (0, auth_middleware_1.requirePermission)("manage_tokens", 4), tokens_controller_1.deleteToken);
// Level 4 update 
router.post("/token-issues", (0, auth_middleware_1.requirePermission)("manage_tokens", 2), tokens_controller_1.issueToken);
exports.default = router;
