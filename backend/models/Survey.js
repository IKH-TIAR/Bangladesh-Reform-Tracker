const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  questions: [
    {
      questionText: {
        type: String,
        required: true
      },
      options: [String],
      questionType: {
        type: String,
        enum: ['multiple-choice', 'open-ended', 'rating'],
        required: true
      }
    }
  ],
  responses: [
    {
      answers: [
        {
          questionId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
          },
          answer: mongoose.Schema.Types.Mixed
        }
      ],
      submittedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('survey', SurveySchema);