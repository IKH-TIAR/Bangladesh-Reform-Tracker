// validators/userValidator.js - Validation for user data
const { body, validationResult } = require('express-validator');

// Set of validators for user signup
const validateUserSignup = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('nid')
    .trim()
    .notEmpty().withMessage('National ID is required')
    .matches(/^(\d{10}|\d{17})$/).withMessage('NID must be either 10 or 17 digits'),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^(\+8801|01)[0-9]{9}$/).withMessage('Please provide a valid Bangladesh phone number'),
  
  body('dateOfBirth')
    .notEmpty().withMessage('Date of birth is required')
    .isDate().withMessage('Please provide a valid date')
    .custom(value => {
      const dob = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      
      if (age < 18) {
        throw new Error('You must be at least 18 years old to register');
      }
      
      return true;
    }),
  
  body('gender')
    .notEmpty().withMessage('Gender is required')
    .isIn(['male', 'female', 'other']).withMessage('Please select a valid gender option'),
  
  body('division')
    .notEmpty().withMessage('Division is required')
    .isIn(['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'])
    .withMessage('Please select a valid division'),
  
  body('district')
    .trim()
    .notEmpty().withMessage('District is required'),
  
  body('address')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ min: 5 }).withMessage('Address is too short'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('confirmPassword')
    .notEmpty().withMessage('Please confirm your password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

// Middleware to check validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array().map(err => ({ field: err.param, message: err.msg }))
    });
  }
  next();
};

module.exports = {
  validateUserSignup,
  handleValidationErrors
};