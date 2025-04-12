
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
