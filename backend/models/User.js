// models/User.js - User data model
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  nid: {
    type: String,
    required: [true, 'Please provide your National ID'],
    unique: true,
    trim: true,
    // 10-digit or 17-digit NID number for Bangladesh
    match: [/^(\d{10}|\d{17})$/, 'NID must be 10 or 17 digits']
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    // Bangladesh phone number format (starts with +880 or 01)
    match: [/^(\+8801|01)[0-9]{9}$/, 'Please provide a valid Bangladesh phone number']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please provide your date of birth']
  },
  gender: {
    type: String,
    required: [true, 'Please select your gender'],
    enum: ['male', 'female', 'other']
  },
  division: {
    type: String,
    required: [true, 'Please select your division'],
    enum: ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh']
  },
  district: {
    type: String,
    required: [true, 'Please provide your district']
  },
  address: {
    type: String,
    required: [true, 'Please provide your full address']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  profileImage: {
    type: String,
    default: 'default-profile.jpg'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to hash the password
userSchema.pre('save', async function(next) {
  // Only run this if password was modified
  if (!this.isModified('password')) return next();
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check if entered password matches the stored hash
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;