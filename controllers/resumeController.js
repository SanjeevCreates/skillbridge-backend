import Resume from '../models/resumeModel.js';
import User from '../models/userModel.js';
import { analyzeResume } from '../services/mockAIService.js';

// @desc    Upload and Analyze Resume
// @route   POST /api/resume/upload
// @access  Private
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const fileName = req.file.originalname;
    
    // Simulate reading file text content
    const textContent = `Resume of ${req.user.name}. Experienced in building React applications, Node.js servers, using Express framework with MongoDB and Postgres databases. Worked with Tailwind CSS, Docker containers, AWS clouds. Interested in neural systems and Python coding.`;

    // Analyze resume via Mock AI Service
    const analysis = analyzeResume(fileName, textContent);

    // Save Resume to DB
    const resume = await Resume.create({
      userId: req.user.id,
      fileName,
      fileUrl: req.file.path || '',
      atsScore: analysis.atsScore,
      skillsDetected: analysis.skillsDetected,
      formattingIntegrity: analysis.formattingIntegrity,
      keywordMap: analysis.keywordMap,
      suggestions: analysis.suggestions,
    });

    // Update user's skills and parsed resumeData
    await User.findByIdAndUpdate(req.user.id, {
      skills: analysis.keywordMap,
      resumeData: {
        latestResumeId: resume._id,
        atsScore: analysis.atsScore,
        fileName,
        uploadedAt: resume.createdAt,
      }
    });

    res.status(201).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Latest Resume Analysis
// @route   GET /api/resume/analyze
// @access  Private
export const getResumeAnalysis = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id }).sort({ createdAt: -1 });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'No resume analysis found. Please upload a resume first.',
      });
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
