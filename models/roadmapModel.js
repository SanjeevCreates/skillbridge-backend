import mongoose from 'mongoose';

const roadmapStepSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  estComp: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['locked', 'active', 'completed'],
    default: 'locked',
  },
  description: {
    type: String,
    default: '',
  },
});

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    steps: {
      type: [roadmapStepSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Roadmap = mongoose.model('Roadmap', roadmapSchema);
export default Roadmap;
