import express from 'express';
import { getQuestions, startSession, submitAnswer, completeSession } from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/questions', protect, getQuestions);
router.post('/mock', protect, startSession);
router.put('/answer/:id', protect, submitAnswer);
router.put('/complete/:id', protect, completeSession);

export default router;
