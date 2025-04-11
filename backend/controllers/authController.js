// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is verified
    // if (!user.isVerified) {
    //   return res.status(401).json({ message: 'Please verify your email before logging in' });
    // }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = generateToken(user._id);

    // Return user data (exclude password)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      nid: user.nid,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      division: user.division,
      district: user.district,
      address: user.address,
      profileImage: user.profileImage,
      token
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify token and return user data
// @route   GET /api/auth/verify
// @access  Private
exports.verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      nid: user.nid,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      division: user.division,
      district: user.district,
      address: user.address,
      profileImage: user.profileImage
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
exports.logoutUser = async (req, res) => {
  try {
    // Safely extract token from header if it exists
    const authHeader = req.header('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      // If you want to blacklist the token, do it here
      // await BlacklistedToken.create({ token });
    }
    
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};