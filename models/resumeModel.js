import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      default: '',
    },
    atsScore: {
      type: Number,
      default: 0,
    },
    skillsDetected: {
      type: [String],
      default: [],
    },
    formattingIntegrity: {
      pdfValidation: { type: String, default: 'INCOMPLETE' },
      fontCompatibility: { type: String, default: 'INCOMPLETE' },
      structuralScan: { type: String, default: 'INCOMPLETE' },
    },
    keywordMap: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
