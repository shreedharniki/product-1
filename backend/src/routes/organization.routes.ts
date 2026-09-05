// src/routes/organization.routes.ts
import { Router } from 'express';
import {
    registerOrganization,
    getRegisterOrganization,
    getOrganizationById,
    updateOrganization,
    deleteOrganization,
    getAvailableModules,
    getOrganizationModules,
    assignModuleToOrganization,
    assignPlanToOrganization,
    getOrgPlan,createRequest
    ,GetRequest,
     getPendingRequestCount,
     getPendingRequests,
      approvePlanRequest,
  rejectPlanRequest,
  suspendOrganization,
  activateOrganization
} from '../controllers/organization.controller';
import { getTemplesByOrg } from '../controllers/hundi.controller';
import { authenticate } from "../middleware/auth.middleware";
import { uploadOrganization } from "../middleware/uploadOrganization";

const router = Router();
router.post('/register', registerOrganization);
router.get(
  "/plan-requests",
  getPendingRequests
);

router.get(
  "/plan-requests/count",
  getPendingRequestCount
);

router.get(
  "/plan-requests/:organization_id",
  GetRequest
);

router.use(authenticate);
// GET → list organizations
router.get('/register', getRegisterOrganization);
router.get('/register/:id', getOrganizationById);
router.put(
    '/register/:id',
    uploadOrganization.single('image'),
    updateOrganization
);
router.delete('/register/:id', deleteOrganization);

router.get('/modules', getAvailableModules);
router.get('/:id/modules', getOrganizationModules);
router.post('/:id/modules', assignModuleToOrganization);
router.get('/:orgId/temples', getTemplesByOrg);
router.post(
    "/organizations/:id/assign-plan",
    assignPlanToOrganization
);

router.get(
    "/organizations/:id/plan",
    getOrgPlan
);
router.post("/plan-requests", createRequest);
// Plan Request

router.put(
  "/plan-requests/:requestId/approve",
  approvePlanRequest
);

router.put(
  "/plan-requests/:requestId/reject",
  rejectPlanRequest
);


router.put(
  "/register/:id/suspend",
  suspendOrganization
);

router.put(
  "/register/:id/activate",
  activateOrganization
);


export default router;




