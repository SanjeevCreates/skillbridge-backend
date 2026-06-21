import Job from '../models/jobModel.js';
import User from '../models/userModel.js';
import { detectSkillGap } from '../services/mockAIService.js';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });

    // Calculate match percentage dynamically for the requesting user
    const userSkills = req.user.skills || [];
    const jobsWithMatch = jobs.map(job => {
      const required = job.skillsRequired || [];
      const matched = required.filter(skill => userSkills.includes(skill));
      const matchPercentage = required.length > 0 
        ? Math.round((matched.length / required.length) * 100)
        : 50; // default baseline

      return {
        ...job.toObject(),
        matchPercentage,
      };
    });

    res.status(200).json({
      success: true,
      data: jobsWithMatch,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recommended jobs
// @route   POST /api/jobs/recommend
// @access  Private
export const recommendJobs = async (req, res) => {
  try {
    const userSkills = req.user.skills || [];
    const jobs = await Job.find({});

    const recommended = jobs
      .map(job => {
        const required = job.skillsRequired || [];
        const matched = required.filter(skill => userSkills.includes(skill));
        const matchPercentage = required.length > 0
          ? Math.round((matched.length / required.length) * 100)
          : 50;

        return {
          ...job.toObject(),
          matchPercentage,
        };
      })
      // Filter for high match (>60%)
      .filter(job => job.matchPercentage >= 60)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json({
      success: true,
      data: recommended,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create job listing (Recruiters / Admins)
// @route   POST /api/jobs
// @access  Private (Recruiter/Admin)
export const createJob = async (req, res) => {
  try {
    const { title, company, location, description, skillsRequired, salary } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      description,
      skillsRequired,
      salary,
    });

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
