// backend/routes/proposals.js
const express = require('express');
const router = express.Router();
const { 
  getProposals, 
  getProposalById, 
  createProposal, 
  updateProposal, 
  deleteProposal,
  getAcceptedProposals
} = require('../controllers/proposalController');

// Get all proposals
router.get('/', getProposals);

// Get accepted proposals
router.get('/accepted', getAcceptedProposals);

// Get single proposal
router.get('/:id', getProposalById);

// Create new proposal
router.post('/', createProposal);

// Update proposal
router.put('/:id', updateProposal);

// Delete proposal
router.delete('/:id', deleteProposal);

module.exports = router;