
const express = require('express');
const router = express.Router();
const { loginUser, verifyToken, logoutUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');


router.post('/login', loginUser);


router.get('/verify', protect, verifyToken);


router.get('/logout', logoutUser);

module.exports = router;