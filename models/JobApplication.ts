import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  dateApplied: {
    type: Date,
    required: true,
    default: Date.now,
  },
  salary: {
    type: String,
    required: false,
  },
  jobType: {
    type: String,
    enum: ['remote', 'hybrid', 'on-site'],
    required: true,
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'contract', 'part-time'],
    required: true,
  },
  jobLink: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['applied', 'interviewing', 'rejected', 'accepted'],
    default: 'applied',
  },
});

const JobApplication =
  mongoose.models.JobApplication || mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;
