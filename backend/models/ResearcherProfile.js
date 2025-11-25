const mongoose = require('mongoose');

const researcherProfileSchema = new mongoose.Schema({
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
  affiliation: {
    type: String,
    required: true
  },
  field_of_research: {
    type: String,
    required: true
  },
  research_keywords: [{
    type: String
  }],
  career_objective: {
    type: String
  },
  publications: [{
    title: { type: String, required: true },
    year: { type: String },
    journal_or_conference: { type: String },
    short_bio: { type: String }
  }],
  current_project_title: {
    type: String
  },
  current_project_description: {
    type: String
  },
  skills_needed: [{
    type: String
  }],
  projects: [{
    title: { type: String, required: true },
    description: { type: String },
    tech_stack: [{ type: String }],
    methods_used: [{ type: String }]
  }],
  education: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    year: { type: String }
  }],
  contact_email: {
    type: String,
    required: true
  },
  open_to_connect: {
    type: Boolean,
    default: true
  },
  // Vector embedding for semantic search
  profile_embedding: [{ type: Number }],
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
researcherProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ResearcherProfile', researcherProfileSchema);
