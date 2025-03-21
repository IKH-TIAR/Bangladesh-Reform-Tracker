// routes/userRoutes.js - User-related routes
const express = require('express');
const router = express.Router();
const { registerUser, verifyUserExists } = require('../controllers/userController');
const { validateUserSignup, handleValidationErrors } = require('../validators/userValidator');

// Register a new user
router.post('/signup', validateUserSignup, handleValidationErrors, registerUser);

// Verify if a user exists (pre-signup check)
router.post('/verify', verifyUserExists);

module.exports = router;