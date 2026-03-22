import User from '../models/Users.js';

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
export const updateUserPreferences = async (req, res) => {
  try {
    const { preferences } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.preferences = preferences;
    await user.save();

    res.json({
      message: 'Preferences updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating preferences', error: error.message });
  }
};

// SAVE EVENT
export const saveEvent = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (user.savedEvents.includes(eventId)) {
      user.savedEvents = user.savedEvents.filter(id => id.toString() !== eventId);
      await user.save();
      return res.json({ message: 'Event removed from saved list', saved: false });
    }

    user.savedEvents.push(eventId);
    await user.save();
    res.json({ message: 'Event saved successully', saved: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SAVED EVENTS
export const getSavedEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedEvents');
    res.json({ events: user.savedEvents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET USER RSVPS
import Event from '../models/Events.js';
export const getUserRSVPs = async (req, res) => {
  try {
    const rsvps = await Event.find({
      'attendees.user': req.user.id
    }).populate('organizer', 'name email');
    res.json({ rsvps });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE USER ROLE
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    res.json({
      message: `Role updated to ${role}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
