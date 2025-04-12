
const User = require('../models/User');
const jwt = require('jsonwebtoken');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Public
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      nid,
      phone,
      dateOfBirth,
      gender,
      division,
      district,
      address,
      password
    } = req.body;

    
    const userExistsByEmail = await User.findOne({ email });
    if (userExistsByEmail) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists'
      });
    }

    const userExistsByNID = await User.findOne({ nid });
    if (userExistsByNID) {
      return res.status(400).json({
        success: false,
        message: 'A user with this National ID already exists'
      });
    }

    
    const user = await User.create({
      name,
      email,
      nid,
      phone,
      dateOfBirth,
      gender,
      division,
      district,
      address,
      password
    });

    if (user) {
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please verify your email.',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          nid: user.nid,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data'
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'production' ? {} : error.message
    });
  }
};

// @desc    Verify user exists (for checking email/NID before signup completion)
// @route   POST /api/users/verify
// @access  Public
const verifyUserExists = async (req, res) => {
  try {
    const { email, nid } = req.body;
    
    
    if (!email && !nid) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either email or National ID'
      });
    }

    
    if (email) {
      const userByEmail = await User.findOne({ email });
      if (userByEmail) {
        return res.status(200).json({
          success: true,
          exists: true,
          field: 'email'
        });
      }
    }

    
    if (nid) {
      const userByNID = await User.findOne({ nid });
      if (userByNID) {
        return res.status(200).json({
          success: true,
          exists: true,
          field: 'nid'
        });
      }
    }

    
    res.status(200).json({
      success: true,
      exists: false
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during verification',
      error: process.env.NODE_ENV === 'production' ? {} : error.message
    });
  }
};

module.exports = {
  registerUser,
  verifyUserExists
};