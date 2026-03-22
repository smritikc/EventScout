import jwt from 'jsonwebtoken';
import User from '../models/Users.js';
import Organizer from '../models/Organizers.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let account = null;
      
      // Use role from token to prioritize lookup
      if (decoded.role === 'organizer') {
        account = await Organizer.findById(decoded.id).select('-password');
      } else if (decoded.role === 'attendee' || decoded.role === 'user') {
        account = await User.findById(decoded.id).select('-password');
      }

      // Fallback for older tokens or edge cases
      if (!account) {
        account = await User.findById(decoded.id).select('-password');
        if (!account) {
          account = await Organizer.findById(decoded.id).select('-password');
        }
      }

      if (!account) {
        return res.status(401).json({ message: 'Not authorized, account not found' });
      }

      req.user = account;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};