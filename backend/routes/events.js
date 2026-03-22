import express from 'express';
import { createEvent, getEvents, getRecommendedEvents, rsvpEvent } from '../controllers/eventController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createEvent);
router.get('/', getEvents);
router.get('/recommended', protect, getRecommendedEvents);
router.post('/:eventId/rsvp', protect, rsvpEvent);

export default router;