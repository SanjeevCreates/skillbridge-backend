import express from 'express';
import { getJobs, recommendJobs, createJob } from '../controllers/jobsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getJobs);
router.post('/recommend', protect, recommendJobs);
router.post('/', protect, authorize('recruiter', 'admin'), createJob);

export default router;
