import express from 'express';
import { 
    getBulkAvailability, 
    createBulkRequest, 
    getUserBulkRequests,
    
} from '../Controllers/BulkResourceController.js';

import{
    getPendingRequests,
    approveBulkRequest,
    rejectBulkRequest,
    addResource

}
from '../Controllers/AdminController.js';
const router = express.Router();

router.post('/availability', getBulkAvailability);
router.post('/request', createBulkRequest);
router.post('/user-requests', getUserBulkRequests);

// New routes for admin functionality
router.get('/requests', getPendingRequests);
router.patch('/approve/:requestId', approveBulkRequest);
router.patch('/reject/:requestId', rejectBulkRequest);
router.post('/add-resource', addResource);

export default router;