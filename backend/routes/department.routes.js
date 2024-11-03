import express from 'express';
import { createDepartment , getDepartments,updateDepartment} from '../controllers/department.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/',protectRoute,getDepartments);
router.post('/create',protectRoute,createDepartment);
router.put('/:departmentId',protectRoute,updateDepartment);

export default router;