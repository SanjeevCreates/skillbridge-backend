import Roadmap from '../models/roadmapModel.js';
import User from '../models/userModel.js';
import { generateRoadmap as makeRoadmap } from '../services/mockAIService.js';

// @desc    Generate user roadmap
// @route   POST /api/roadmap/generate
// @access  Private
export const generateRoadmap = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const roadmapData = makeRoadmap(user._id, user.skills);

    // Delete existing roadmap to overwrite, or update
    await Roadmap.deleteMany({ userId: user._id });

    const roadmap = await Roadmap.create({
      userId: user._id,
      title: roadmapData.title,
      steps: roadmapData.steps,
    });

    res.status(201).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get roadmap for user
// @route   GET /api/roadmap/:userId
// @access  Private
export const getRoadmapByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify authorized user
    if (req.user.id !== userId && req.user.role !== 'admin' && req.user.role !== 'recruiter') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const roadmap = await Roadmap.findOne({ userId }).sort({ createdAt: -1 });

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'No roadmap found. Please generate one.' });
    }

    res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update roadmap step status (completed, active)
// @route   PUT /api/roadmap/step/:stepId
// @access  Private
export const updateRoadmapStep = async (req, res) => {
  try {
    const { stepId } = req.params;
    const { status } = req.body;

    const roadmap = await Roadmap.findOne({ userId: req.user.id });
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    const step = roadmap.steps.id(stepId);
    if (!step) {
      return res.status(404).json({ success: false, message: 'Step not found' });
    }

    step.status = status;
    await roadmap.save();

    res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
