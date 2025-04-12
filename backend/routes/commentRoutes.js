const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

 
router.get('/reform/:reformId', commentController.getCommentsByReform);

 
router.post('/', protect, commentController.addComment);

 
router.post('/vote/:commentId', protect, commentController.voteComment);

module.exports = router;