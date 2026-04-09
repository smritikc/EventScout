import User from '../models/Users.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Generate JWT Token
export const generateToken = (id, isOrganizer, role) => {
  return jwt.sign({ id, isOrganizer, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Account already exists with this email' });
    }

    // Create user. Everyone starts as standard user.
    const user = await User.create({
      name,
      email,
      password,
      phone,
      isOrganizer: false
    });

    // Generate token
    const token = generateToken(user._id, user.isOrganizer, user.role);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isOrganizer: user.isOrganizer,
        role: user.role,
        preferences: user.preferences,
        themePreference: user.themePreference
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
    const { email, password } = req.body;

    const account = await User.findOne({ email }).select('+password');

    if (!account) {
      return res.status(401).json({ message: 'Email not registered' });
    }

    // Check password
    const isPasswordMatch = await account.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate token
    const token = generateToken(account._id, account.isOrganizer, account.role);

    res.json({
      token,
      user: {
        id: account._id,
        name: account.name,
        email: account.email,
        isOrganizer: account.isOrganizer,
        role: account.role,
        organizationName: account.organizationName,
        preferences: account.preferences,
        themePreference: account.themePreference
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