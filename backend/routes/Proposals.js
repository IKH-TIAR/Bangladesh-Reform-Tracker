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


// Create new proposal
router.post('/', createProposal);
module.exports = router;
