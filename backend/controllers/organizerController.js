import User from '../models/Users.js';
import OTP from '../models/OTP.js';
import sendEmail from '../utils/sendEmail.js';
import { generateToken } from './authController.js';

// @desc    Request OTP to become an organizer
// @route   POST /api/organizers/request-otp
// @access  Private
export const requestOrganizerOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isOrganizer) {
      return res.status(400).json({ message: 'You are already an organizer' });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to DB (delete old ones first)
    await OTP.deleteMany({ email });
    await OTP.create({ email, otp: otpCode });

    // Send email via utility (real or Ethereal in dev)
    const emailResult = await sendEmail({
      to: email,
      subject: '🎯 EventScout - Your Organizer Verification Code',
      text: `Your OTP to become an EventScout Organizer is: ${otpCode}. It expires in 5 minutes. Do not share this code.`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #4f46e5; margin-bottom: 0.5rem;">EventScout</h2>
          <p style="color: #6b7280;">You requested to become an Organizer. Use the code below to verify your identity.</p>
          <div style="background: #f3f4f6; border-radius: 8px; padding: 1.5rem; text-align: center; margin: 1.5rem 0;">
            <span style="font-size: 2.5rem; font-weight: 700; letter-spacing: 0.4rem; color: #111827;">${otpCode}</span>
          </div>
          <p style="color: #6b7280; font-size: 0.875rem;">⏱ This code expires in <strong>5 minutes</strong>. Do not share it with anyone.</p>
          <p style="color: #9ca3af; font-size: 0.75rem; margin-top: 1.5rem;">If you did not request this, you can safely ignore this email.</p>
        </div>
      `
    });

    // In dev mode, always expose OTP for easy testing
    const devOtp = process.env.NODE_ENV !== 'production' ? otpCode : undefined;
    if (devOtp) {
      console.log(`\n🔐 [DEV] OTP for ${email}: ${otpCode}\n`);
    }

    res.status(200).json({
      message: emailResult.success
        ? `OTP sent to ${email}. Check your inbox.`
        : `OTP generated (email delivery failed — check server logs)`,
      devOtp
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify OTP and upgrade to Organizer
// @route   POST /api/organizers/verify-otp
// @access  Private
export const verifyOrganizerOTP = async (req, res) => {
  try {
    const { email, otp, organizationName, phone } = req.body;

    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Upgrade user
    const user = await User.findById(req.user.id);
    user.isOrganizer = true;
    user.organizationName = organizationName;
    if (phone) user.phone = phone;
    
    await user.save();

    // Clean up OTP
    await OTP.deleteMany({ email });

    // Generate new token with updated privileges
    const token = generateToken(user._id, user.isOrganizer, user.role);

    res.status(200).json({
      message: 'Successfully upgraded to Organizer',
      token,
      user: {
        id: user._id,
        isOrganizer: user.isOrganizer,
        organizationName: user.organizationName
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
