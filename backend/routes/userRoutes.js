
const express = require('express');
const router = express.Router();
const { registerUser, verifyUserExists } = require('../controllers/userController');
const { validateUserSignup, handleValidationErrors } = require('../validators/userValidator');


router.post('/signup', validateUserSignup, handleValidationErrors, registerUser);


router.post('/verify', verifyUserExists);

module.exports = router;