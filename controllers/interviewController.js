import Interview from '../models/interviewModel.js';
import { generateInterviewQuestions, evaluateInterviewAnswer } from '../services/mockAIService.js';

// @desc    Get questions for mock interview
// @route   GET /api/interview/questions
// @access  Private
export const getQuestions = async (req, res) => {
  try {
    const questions = generateInterviewQuestions();
    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Initialize a mock interview session
// @route   POST /api/interview/mock
// @access  Private
export const startSession = async (req, res) => {
  try {
    // End any current active sessions
    await Interview.updateMany({ userId: req.user.id, status: 'active' }, { status: 'completed' });

    const newSession = await Interview.create({
      userId: req.user.id,
      vitals: { clarity: 50, confidence: 50, contentIndex: 50 },
      status: 'active',
      transcript: [
        {
          speaker: 'INTERVIEWER',
          text: 'Welcome to the SkillBridge AI mock session. Let us initialize the sequence. How would you approach scaling our neural pipeline while maintaining sub-100ms latency for architectural-level synthesis?',
          timestamp: '00:00',
          insights: 'Starting baseline question. Listening for keywords.'
        }
      ],
      feedback: [],
    });

    res.status(201).json({
      success: true,
      data: newSession,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit user speech/text answer and get real-time evaluations
// @route   PUT /api/interview/answer/:id
// @access  Private
export const submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { answerText, questionIndex } = req.body;

    const session = await Interview.findById(id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    if (session.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Session already completed' });
    }

    // Evaluate answer via mock AI service
    const evaluation = evaluateInterviewAnswer(questionIndex, answerText);

    // Save transcription
    session.transcript.push({
      speaker: 'USER',
      text: answerText,
      timestamp: '00:45',
      insights: evaluation.insights,
      annotation: evaluation.annotation,
    });

    // Update vitals
    session.vitals = evaluation.vitals;

    // Transition questions (Interviewer replies)
    const questionsList = generateInterviewQuestions();
    const nextQIdx = (questionIndex + 1) % questionsList.length;
    
    // Add next question to transcript
    session.transcript.push({
      speaker: 'INTERVIEWER',
      text: questionsList[nextQIdx].text,
      timestamp: '01:00',
      insights: `Follow-up question index: ${nextQIdx + 1}`
    });

    await session.save();

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Complete session and compile feedback
// @route   PUT /api/interview/complete/:id
// @access  Private
export const completeSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Interview.findById(id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    session.status = 'completed';
    
    // Compile dynamic feedback list
    const finalVitals = session.vitals;
    const feedback = [];

    if (finalVitals.confidence < 75) {
      feedback.push('Practice steady pacing and cut filler words (e.g. "uhm", "actually") to reinforce confidence metrics.');
    } else {
      feedback.push('Excellent vocal steadiness and high confidence projection confirmed during challenging technical sequences.');
    }

    if (finalVitals.contentIndex < 70) {
      feedback.push('Include specific system architecture names (e.g. sharding, caching levels, zero-copy buffers) in your responses to lift technical content index.');
    } else {
      feedback.push('Technical responses showed high density of target keywords indicating robust framework understanding.');
    }

    session.feedback = feedback;
    await session.save();

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
