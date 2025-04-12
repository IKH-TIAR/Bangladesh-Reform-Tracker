const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');


router.get('/public', proposalController.getPublicProposals);


router.get('/accepted', proposalController.getAcceptedProposals);


router.get('/:id', proposalController.getProposalById);

module.exports = router;