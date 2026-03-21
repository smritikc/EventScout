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
