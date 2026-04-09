import express from 'express';
import { requestOrganizerOTP, verifyOrganizerOTP } from '../controllers/organizerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/request-otp', protect, requestOrganizerOTP);
router.post('/verify-otp', protect, verifyOrganizerOTP);

export default router;
