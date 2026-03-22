import Organizer from '../models/Organizers.js';
import User from '../models/Users.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register organizer
// @route   POST /api/organizers/register
// @access  Public
export const registerOrganizer = async (req, res) => {
  try {
    const { name, email, password, organizationName, bio } = req.body;

    // Check if account already exists in either collection
    const organizerExists = await Organizer.findOne({ email });
    const userExists = await User.findOne({ email });

    if (organizerExists || userExists) {
      return res.status(400).json({ message: 'Account already exists with this email' });
    }

    const organizer = await Organizer.create({
      name,
      email,
      password,
      organizationName,
      bio
    });

    const token = generateToken(organizer._id, 'organizer');

    res.status(201).json({
      token,
      user: {
        id: organizer._id,
        name: organizer.name,
        email: organizer.email,
        organizationName: organizer.organizationName,
        role: 'organizer'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login organizer
// @route   POST /api/organizers/login
// @access  Public
export const loginOrganizer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const organizer = await Organizer.findOne({ email }).select('+password');
    if (!organizer || !(await organizer.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(organizer._id, 'organizer');

    res.json({
      token,
      user: {
        id: organizer._id,
        name: organizer.name,
        email: organizer.email,
        organizationName: organizer.organizationName,
        role: 'organizer'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current organizer
// @route   GET /api/organizers/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.user.id);
    res.json({ organizer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
