import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createNews, getNews } from '../controllers/news.controller.js';

const router = express.Router();

router.post('/createnews', protectRoute, createNews);
router.get('/getnews',protectRoute, getNews);

export default router;