import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a job title'],
    },
    company: {
      type: String,
      required: [true, 'Please add a company name'],
    },
    location: {
      type: String,
      default: 'Remote',
    },
    description: {
      type: String,
      required: [true, 'Please add a job description'],
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
    salary: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;
