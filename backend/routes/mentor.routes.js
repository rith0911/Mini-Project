import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { mentorReq, mentorshipList } from '../controllers/mentorship.controller.js';

const router = express.Router();

router.post('/request', protectRoute,mentorReq);
router.get('/mentorships',protectRoute, mentorshipList);

export default router;