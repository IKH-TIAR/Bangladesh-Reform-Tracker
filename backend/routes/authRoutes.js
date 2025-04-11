// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { loginUser, verifyToken, logoutUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Login route
router.post('/login', loginUser);

// Verify token route
router.get('/verify', protect, verifyToken);

// Logout route
router.get('/logout', logoutUser);

module.exports = router;