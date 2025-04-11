// backend/models/Proposal.js
const mongoose = require('mongoose');

const ProposalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String, 
    required: true
  },
  submittedBy: {
    type: String,
    required: true
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  milestones: [{
    title: String,
    completed: {
      type: Boolean,
      default: false
    },
    dueDate: Date
  }]
});

module.exports = mongoose.model('Proposal', ProposalSchema);