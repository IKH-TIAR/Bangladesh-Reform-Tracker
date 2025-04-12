
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
router.get('/accepted', getAcceptedProposals);
