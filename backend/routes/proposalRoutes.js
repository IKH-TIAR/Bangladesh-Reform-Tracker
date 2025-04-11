const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');

// Get reforms for public view (no authentication required)
router.get('/public', proposalController.getPublicProposals);

// Get all accepted proposals
router.get('/accepted', proposalController.getAcceptedProposals);

// Get a single proposal by ID
router.get('/:id', proposalController.getProposalById);

module.exports = router;