import express from 'express';
import { generateRoadmap, getRoadmapByUserId, updateRoadmapStep } from '../controllers/roadmapController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateRoadmap);
router.get('/:userId', protect, getRoadmapByUserId);
router.put('/step/:stepId', protect, updateRoadmapStep);

export default router;
