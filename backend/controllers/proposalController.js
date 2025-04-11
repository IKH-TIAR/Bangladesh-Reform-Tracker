const Proposal = require('../models/Proposal');

// Get all accepted proposals
exports.getAcceptedProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ status: 'accepted' })
      .sort({ submissionDate: -1 });
    
    res.json(proposals);
  } catch (error) {
    console.error('Error fetching accepted proposals:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single proposal by ID
exports.getProposalById = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }
    
    res.json(proposal);
  } catch (error) {
    console.error('Error fetching proposal:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get limited information about accepted proposals for public view
exports.getPublicProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ status: 'accepted' })
      .select('title description submittedBy submissionDate progress milestones')
      .sort({ submissionDate: -1 })
      .limit(6); // Limiting to 6 most recent reforms for the public page
    
    // For each proposal, calculate the number of completed milestones
    const publicProposals = proposals.map(proposal => {
      const completedMilestones = proposal.milestones.filter(m => m.completed).length;
      const totalMilestones = proposal.milestones.length;
      
      // Return a formatted version with just the essential data
      return {
        _id: proposal._id,
        title: proposal.title,
        description: proposal.description,
        submittedBy: proposal.submittedBy,
        submissionDate: proposal.submissionDate,
        progress: proposal.progress,
        milestones: proposal.milestones.map(m => ({
          title: m.title,
          completed: m.completed
        }))
      };
    });
    
    res.json(publicProposals);
  } catch (error) {
    console.error('Error fetching public proposals:', error);
    res.status(500).json({ message: 'Server error' });
  }
};