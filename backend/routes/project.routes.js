import express, { Router } from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { suggestProject, getProjects, markProject, deleteProject } from '../controllers/project.controller.js';

const router = express.Router();

router.post('/suggestproject', protectRoute, suggestProject);
router.get('/',protectRoute, getProjects);
router.post('/complete/:id',protectRoute,markProject);
router.delete('/delete/:id',deleteProject);

export default router;