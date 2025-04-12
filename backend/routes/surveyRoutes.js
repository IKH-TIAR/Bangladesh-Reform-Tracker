const express = require('express');
const router = express.Router();
const Survey = require('../models/Survey');
const auth = require('../middleware/authMiddleware');

// @route   GET api/surveys
// @desc    Get all surveys
// @access  Public (but typically would be protected)
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
// @access  Public (but typically would be protected)
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

// @route   POST api/surveys/:id/responses
// @desc    Submit a response to a survey
// @access  Private
router.post('/:id/responses', auth.protect, async (req, res) => {
    try {
      const { answers } = req.body;
      
       
      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ msg: 'Invalid response format' });
      }
      
      const survey = await Survey.findById(req.params.id);
      if (!survey) {
        return res.status(404).json({ msg: 'Survey not found' });
      }
      
       
      const hasResponded = survey.responses.some(response => 
        response.userId.toString() === req.user.id.toString()
      );
      
      if (hasResponded) {
        return res.status(400).json({ msg: 'You have already submitted a response to this survey' });
      }
      
       
      survey.responses.push({
        userId: req.user.id,  
        answers: answers,
        submittedAt: Date.now()
      });
      
      await survey.save();
      
      res.json({ msg: 'Survey response submitted successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});
  
// @route   GET api/surveys/:id/user-response
// @desc    Check if the current user has already responded to this survey
// @access  Private
router.get('/:id/user-response', auth.protect, async (req, res) => {
    try {
      const survey = await Survey.findById(req.params.id);
      if (!survey) {
        return res.status(404).json({ msg: 'Survey not found' });
      }
      
       
      const hasResponded = survey.responses.some(response => 
        response.userId.toString() === req.user.id.toString()
      );
      
      res.json({ hasResponded });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;