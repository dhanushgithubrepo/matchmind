const mongoose = require('mongoose');

const jobSeekerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  top_skills: [{
    type: String,
    required: true
  }],
  career_objective: {
    type: String
  },
  years_of_experience: {
    type: String,
    required: true
  },
  expected_salary: {
    type: String
  },
  preferred_job_type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'remote'],
    default: 'full-time'
  },
  resume_link: {
    type: String
  },
  linkedin_url: {
    type: String
  },
  github_url: {
    type: String
  },
  // Vector embedding for semantic search (Gemma-7B via Ollama)
  profile_embedding: [{ type: Number }],
  projects: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    tech_stack: [{
      type: String
    }]
  }],
  education: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    year: {
      type: String
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
jobSeekerProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('JobSeekerProfile', jobSeekerProfileSchema);
