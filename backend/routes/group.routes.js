import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createGroup, joinLeaveGroup } from '../controllers/group.controller.js';

const router = express.Router();

router.post('/creategroups',protectRoute, createGroup);
router.post('/join/:id', protectRoute, joinLeaveGroup);
//router.post('/leave/:id',protectRoute, exitGroup);

export default router;