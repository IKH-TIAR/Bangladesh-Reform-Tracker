const express = require('express');
const router = express.Router();
const Survey = require('../models/Survey');

// @route   POST api/surveys
// @desc    Create a new survey
// @access  Public
router.post('/', async (req, res) => {
  try {
    const newSurvey = new Survey(req.body);
    const survey = await newSurvey.save();
    res.json(survey);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/surveys
// @desc    Get all surveys
// @access  Public
router.get('/', async (req, res) => {
  try {
    const surveys = await Survey.find().sort({ createdAt: -1 });
    res.json(surveys);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/surveys/:id
// @desc    Get survey by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ msg: 'Survey not found' });
    }
    res.json(survey);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Survey not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/surveys/:id
// @desc    Delete a survey
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ msg: 'Survey not found' });
    }
    await Survey.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Survey deleted successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Survey not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/surveys/:id/respond
// @desc    Submit a response to a survey
// @access  Public
router.post('/:id/respond', async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ msg: 'Survey not found' });
    }

    survey.responses.push({
      answers: req.body.answers
    });

    await survey.save();
    res.json(survey);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/surveys/:id/summary
// @desc    Get summary of survey responses
// @access  Public
router.get('/:id/summary', async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ msg: 'Survey not found' });
    }
    
    // Basic summary stats
    const summary = {
      totalResponses: survey.responses.length,
      questions: survey.questions.map(question => {
        const questionSummary = {
          questionText: question.questionText,
          questionType: question.questionType,
          totalAnswers: 0
        };
        
        if (question.questionType === 'multiple-choice') {
          questionSummary.optionCounts = {};
          question.options.forEach(option => {
            questionSummary.optionCounts[option] = 0;
          });
        } else if (question.questionType === 'rating') {
          questionSummary.averageRating = 0;
          questionSummary.ratings = {};
        }
        
        return questionSummary;
      })
    };
    
    // Process the responses
    survey.responses.forEach(response => {
      response.answers.forEach(answer => {
        const questionIndex = survey.questions.findIndex(
          q => q._id.toString() === answer.questionId.toString()
        );
        
        if (questionIndex !== -1) {
          const question = survey.questions[questionIndex];
          const summaryQuestion = summary.questions[questionIndex];
          
          summaryQuestion.totalAnswers++;
          
          if (question.questionType === 'multiple-choice' && answer.answer) {
            if (summaryQuestion.optionCounts[answer.answer] !== undefined) {
              summaryQuestion.optionCounts[answer.answer]++;
            }
          } else if (question.questionType === 'rating' && !isNaN(answer.answer)) {
            const rating = Number(answer.answer);
            if (!summaryQuestion.ratings[rating]) {
              summaryQuestion.ratings[rating] = 0;
            }
            summaryQuestion.ratings[rating]++;
            
            // Recalculate average
            let sum = 0;
            let count = 0;
            Object.entries(summaryQuestion.ratings).forEach(([rating, ratingCount]) => {
              sum += Number(rating) * ratingCount;
              count += ratingCount;
            });
            summaryQuestion.averageRating = count > 0 ? (sum / count).toFixed(1) : 0;
          }
        }
      });
    });
    
    res.json(summary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;