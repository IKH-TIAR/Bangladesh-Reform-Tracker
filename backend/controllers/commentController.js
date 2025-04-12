const Comment = require('../models/Comment');
const User = require('../models/User');
const Proposal = require('../models/Proposal');

 
exports.getCommentsByReform = async (req, res) => {
  try {
    const comments = await Comment.find({ reformId: req.params.reformId })
      .populate('userId', 'name profileImage')
      .sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

 
exports.addComment = async (req, res) => {
  try {
    const { reformId, content, parentId } = req.body;
    const userId = req.user.id;  

     
    const reform = await Proposal.findById(reformId);
    if (!reform) {
      return res.status(404).json({ message: 'Reform not found' });
    }

     
    const newComment = new Comment({
      reformId,
      userId,
      content,
      parentId: parentId || null,
      votes: { upvotes: [], downvotes: [] }
    });

    const savedComment = await newComment.save();
    
     
    const populatedComment = await Comment.findById(savedComment._id)
      .populate('userId', 'name profileImage');

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

 
exports.voteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { voteType } = req.body;
    const userId = req.user.id;  

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const upvoted = comment.votes.upvotes.includes(userId);
    const downvoted = comment.votes.downvotes.includes(userId);

     
    if (voteType === 'upvote') {
      if (upvoted) {
         
        comment.votes.upvotes = comment.votes.upvotes.filter(id => id.toString() !== userId);
      } else {
         
        comment.votes.upvotes.push(userId);
        comment.votes.downvotes = comment.votes.downvotes.filter(id => id.toString() !== userId);
      }
    } 
     
    else if (voteType === 'downvote') {
      if (downvoted) {
         
        comment.votes.downvotes = comment.votes.downvotes.filter(id => id.toString() !== userId);
      } else {
         
        comment.votes.downvotes.push(userId);
        comment.votes.upvotes = comment.votes.upvotes.filter(id => id.toString() !== userId);
      }
    } else {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    await comment.save();
    
    res.json({ 
      upvotes: comment.votes.upvotes.length,
      downvotes: comment.votes.downvotes.length,
      voteCount: comment.votes.upvotes.length - comment.votes.downvotes.length
    });
  } catch (error) {
    console.error('Error voting on comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};