// backend/controllers/proposalController.js
const Proposal = require('../models/Proposal');

// Get all proposals
exports.getProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find();
    res.status(200).json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get accepted proposals
exports.getAcceptedProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ status: 'accepted' });
    res.status(200).json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get proposal by ID
exports.getProposalById = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }
    res.status(200).json(proposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new proposal
exports.createProposal = async (req, res) => {
  try {
    const proposal = new Proposal(req.body);
    const savedProposal = await proposal.save();
    res.status(201).json(savedProposal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update proposal
exports.updateProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }
    
    const updatedProposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedProposal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete proposal
exports.deleteProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }
    
    await Proposal.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Proposal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};