import { Router } from 'express';
import {
    createHundi, getAllHundis, getHundiById, updateHundi, deleteHundi,
    getItemUnits, getWitnessSuggestions, getTemplesByOrg, getOrgRoles,
    finalizeHundi, deleteItemUnit, getMasterHundis, createMasterHundi, deleteMasterHundi,
    getDenominations, createDenomination, uploadDenominationImage, deleteDenominationImage, deleteDenomination
} from '../controllers/hundi.controller';
import {
    lookupIfsc, getBankDetails, createBankDetail, updateBankDetail, deleteBankDetail,
    getTrackingStatus, getTrackingList, getTrackingByHundi, createTracking
} from '../controllers/hundiTracking.controller';
import { authenticate, requirePermission } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/roles', getOrgRoles);
router.get('/item-units', getItemUnits);
router.post('/item-units/delete', requirePermission('hundi_module', 4), deleteItemUnit);
router.get('/witness-suggestions/:templeId', getWitnessSuggestions);
router.get('/master', requirePermission('hundi_module', 1), getMasterHundis);
router.post('/master', requirePermission('hundi_module', 2), createMasterHundi);
router.delete('/master/:id', requirePermission('hundi_module', 4), deleteMasterHundi);
router.get('/denominations', requirePermission('hundi_module', 1), getDenominations);
router.post('/denominations', requirePermission('hundi_module', 2), createDenomination);
router.put('/denominations/:id/image', requirePermission('hundi_module', 2), uploadDenominationImage);
router.delete('/denominations/:id/image', requirePermission('hundi_module', 3), deleteDenominationImage);
router.delete('/denominations/:id', requirePermission('hundi_module', 4), deleteDenomination);

router.get('/bank-lookup/:ifsc', requirePermission('hundi_module', 1), lookupIfsc);
router.get('/bank-details', requirePermission('hundi_module', 1), getBankDetails);
router.post('/bank-details', requirePermission('hundi_module', 2), createBankDetail);
router.put('/bank-details/:id', requirePermission('hundi_module', 3), updateBankDetail);
router.delete('/bank-details/:id', requirePermission('hundi_module', 4), deleteBankDetail);
router.get('/tracking/status', requirePermission('hundi_module', 1), getTrackingStatus);
router.get('/tracking/list', requirePermission('hundi_module', 1), getTrackingList);
router.get('/tracking/:hundiId', requirePermission('hundi_module', 1), getTrackingByHundi);
router.post('/tracking', requirePermission('hundi_module', 2), createTracking);

router.get('/', requirePermission('hundi_module', 1), getAllHundis);
router.get('/:id', requirePermission('hundi_module', 1), getHundiById);
router.post('/', requirePermission('hundi_module', 2), createHundi);
router.put('/:id', requirePermission('hundi_module', 3), updateHundi);
router.delete('/:id', requirePermission('hundi_module', 4), deleteHundi);
router.put('/:id/finalize', requirePermission('hundi_module', 2), finalizeHundi);

export default router;