import express from 'express';
import { registerOrganizer, loginOrganizer, getMe } from '../controllers/organizerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerOrganizer);
router.post('/login', loginOrganizer);
router.get('/me', protect, getMe);

export default router;
