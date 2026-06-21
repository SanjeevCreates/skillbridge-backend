import mongoose from 'mongoose';

const transcriptSchema = new mongoose.Schema({
  speaker: {
    type: String,
    enum: ['USER', 'INTERVIEWER'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    default: '',
  },
  insights: {
    type: String,
    default: '',
  },
  annotation: {
    type: String,
    default: '',
  },
});

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vitals: {
      clarity: { type: Number, default: 0 },
      confidence: { type: Number, default: 0 },
      contentIndex: { type: Number, default: 0 },
    },
    transcript: {
      type: [transcriptSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
    feedback: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
