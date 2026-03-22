import express from 'express';
import { updateUserPreferences, saveEvent, getSavedEvents, getUserRSVPs, updateUserRole } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.put('/preferences', protect, updateUserPreferences);
router.patch('/role', protect, updateUserRole);
router.post('/saved-events/:id', protect, saveEvent);
router.get('/saved-events', protect, getSavedEvents);
router.get('/rsvps', protect, getUserRSVPs);

export default router;