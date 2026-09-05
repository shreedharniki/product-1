"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const panchangaController_1 = require("../controllers/panchangaController");
const router = (0, express_1.Router)();
router.get("/", panchangaController_1.getPanchang);
exports.default = router;
