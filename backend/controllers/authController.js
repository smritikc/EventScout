import User from '../models/Users.js';
import Organizer from '../models/Organizers.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Generate JWT Token
export const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists in either collection
    const userExists = await User.findOne({ email });
    const organizerExists = await Organizer.findOne({ email });

    if (userExists || organizerExists) {
      return res.status(400).json({ message: 'Account already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let account = null;

    if (role === 'organizer') {
      account = await Organizer.findOne({ email }).select('+password');
    } else if (role === 'attendee' || role === 'user') {
      account = await User.findOne({ email }).select('+password');
    } else {
      // Fallback: Check both if no role specified (for backward compatibility)
      account = await User.findOne({ email }).select('+password');
      if (!account) {
        account = await Organizer.findOne({ email }).select('+password');
      }
    }

    if (!account) {
      return res.status(401).json({ message: 'Email not registered' });
    }

    // Check password
    const isPasswordMatch = await account.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate token with role
    const token = generateToken(account._id, account.role || (account.organizationName ? 'organizer' : 'user'));

    res.json({
      token,
      user: {
        id: account._id,
        name: account.name,
        email: account.email,
        role: account.role || (account.organizationName ? 'organizer' : 'user'),
        organizationName: account.organizationName,
        preferences: account.preferences
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    // req.user is already set by protect middleware
    res.json({ user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};