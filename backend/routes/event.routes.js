import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createEvent, attendEvent } from '../controllers/events.controller.js';

const router = express.Router();

router.post('/events', protectRoute, createEvent);
router.post('/events/attend/:id',protectRoute, attendEvent);

export default router;