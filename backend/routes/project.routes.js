import express, { Router } from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { suggestProject, getProjects, markProject } from '../controllers/project.controller.js';

const router = express.Router();

router.post('/suggestproject', protectRoute, suggestProject);
router.get('/',protectRoute, getProjects);
router.post('/complete/:id',protectRoute,markProject);

export default router;