const mongoose = require('mongoose');

const hrProfileSchema = new mongoose.Schema({
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
  company_name: {
    type: String,
    required: true
  },
  company_industry: {
    type: String
  },
  location: {
    type: String,
    required: true
  },
  contact_email: {
    type: String,
    required: true
  },
  // Vector embedding for HR organization profile or aggregate needs (optional)
  profile_embedding: [{ type: Number }],
  roles_hiring_for: [{
    title: {
      type: String,
      required: true
    },
    job_summary: {
      type: String
    },
    skills_required: [{
      type: String,
      required: true
    }],
    experience_level: {
      type: String,
      enum: ['entry', 'mid', 'senior'],
      default: 'mid'
    },
    job_type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'remote'],
      default: 'full-time'
    },
    salary_range: {
      type: String
    },
    description: {
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
hrProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('HRProfile', hrProfileSchema);
