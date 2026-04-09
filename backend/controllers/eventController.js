import Event from '../models/Events.js';

// CREATE EVENT
export const createEvent = async (req, res) => {
  try {
    // Only allow organizers
    if (!req.user.isOrganizer) {
      return res.status(403).json({ message: 'Only organizers can create events' });
    }

    const event = await Event.create({
      ...req.body,
      organizer: req.user.id
    });

    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET EVENTS
export const getEvents = async (req, res) => {
  try {
    const { location, category, eventType, paymentStatus, startDate, endDate } = req.query;
    let query = {};
    
    // Legacy mapping support for basic city search
    if (location && location !== 'All Nepal') {
      const parsedCity = location.split(' ')[0];
      query['location.city'] = { $regex: parsedCity, $options: 'i' };
    }
    
    if (category) query.category = category;
    if (eventType) query.eventType = eventType;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    // Date range filtering
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email organizationName logo');

    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET RECOMMENDED EVENTS
export const getRecommendedEvents = async (req, res) => {
  try {
    const userCategories = req.user.preferences?.categories || [];
    
    let query = {};
    if (userCategories.length > 0) {
      query.category = { $in: userCategories };
    }

    const events = await Event.find(query)
      .limit(10)
      .populate('organizer', 'name email organizationName logo');

    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RSVP TO EVENT
export const rsvpEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { guests, status = 'confirmed', teamName } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.participationType === 'team' && !teamName) {
      return res.status(400).json({ message: 'Team name is required for team participation events' });
    }

    // Check if user already RSVP'd
    const alreadyRSVP = event.attendees.find(a => a.user.toString() === req.user.id);
    if (alreadyRSVP) {
      alreadyRSVP.guests = guests;
      alreadyRSVP.status = status;
      if (teamName) alreadyRSVP.teamName = teamName;
    } else {
      event.attendees.push({ user: req.user.id, guests, status, teamName });
    }

    await event.save();
    res.json({ message: 'RSVP successful', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import nodemailer from 'nodemailer';
import User from '../models/Users.js';

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'test@example.com',
    pass: process.env.EMAIL_PASS || 'password'
  }
});

// UPDATE EVENT
export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Ensure it's the organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this event' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, { new: true });

    // Notification Logic: find all users who saved this event
    const interestedUsers = await User.find({ savedEvents: eventId });
    if (interestedUsers.length > 0 && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const emailList = interestedUsers.map(u => u.email).join(', ');
      const mailOptions = {
        from: process.env.EMAIL_USER,
        bcc: emailList,
        subject: `Update on Event: ${updatedEvent.title}`,
        text: `The organizer has updated details for "${updatedEvent.title}". Check the app for the latest info!`
      };
      
      // Fire and forget email
      transporter.sendMail(mailOptions).catch(err => console.error("Email send failed:", err));
    }

    res.json({ message: 'Event updated', event: updatedEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};