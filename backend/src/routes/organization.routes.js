"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/organization.routes.ts
const express_1 = require("express");
const organization_controller_1 = require("../controllers/organization.controller");
const hundi_controller_1 = require("../controllers/hundi.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const uploadOrganization_1 = require("../middleware/uploadOrganization");
const router = (0, express_1.Router)();
router.post('/register', organization_controller_1.registerOrganization);
router.get("/plan-requests", organization_controller_1.getPendingRequests);
router.get("/plan-requests/count", organization_controller_1.getPendingRequestCount);
router.get("/plan-requests/:organization_id", organization_controller_1.GetRequest);
router.use(auth_middleware_1.authenticate);
// GET → list organizations
router.get('/register', organization_controller_1.getRegisterOrganization);
router.get('/register/:id', organization_controller_1.getOrganizationById);
router.put('/register/:id', uploadOrganization_1.uploadOrganization.single('image'), organization_controller_1.updateOrganization);
router.delete('/register/:id', organization_controller_1.deleteOrganization);
router.get('/modules', organization_controller_1.getAvailableModules);
router.get('/:id/modules', organization_controller_1.getOrganizationModules);
router.post('/:id/modules', organization_controller_1.assignModuleToOrganization);
router.get('/:orgId/temples', hundi_controller_1.getTemplesByOrg);
router.post("/organizations/:id/assign-plan", organization_controller_1.assignPlanToOrganization);
router.get("/organizations/:id/plan", organization_controller_1.getOrgPlan);
router.post("/plan-requests", organization_controller_1.createRequest);
// Plan Request
router.put("/plan-requests/:requestId/approve", organization_controller_1.approvePlanRequest);
router.put("/plan-requests/:requestId/reject", organization_controller_1.rejectPlanRequest);
router.put("/register/:id/suspend", organization_controller_1.suspendOrganization);
router.put("/register/:id/activate", organization_controller_1.activateOrganization);
exports.default = router;
