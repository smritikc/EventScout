import express from 'express';
import { updateUserPreferences } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.put('/preferences', protect, updateUserPreferences);

export default router;