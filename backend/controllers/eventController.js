import Event from '../models/Events.js';

// CREATE EVENT
export const createEvent = async (req, res) => {
  try {
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
    const { location, category } = req.query;
    let query = {};
    if (location && location !== 'All Nepal') {
      // Basic match for location string if it's sent as 'Dhangadhi 10km'
      // In a real app we'd use lat/lng radius search
      query['location.city'] = { $regex: location.split(' ')[0], $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email');

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
      .populate('organizer', 'name email');

    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RSVP TO EVENT
export const rsvpEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { guests, status = 'confirmed' } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check if user already RSVP'd
    const alreadyRSVP = event.attendees.find(a => a.user.toString() === req.user.id);
    if (alreadyRSVP) {
      alreadyRSVP.guests = guests;
      alreadyRSVP.status = status;
    } else {
      event.attendees.push({ user: req.user.id, guests, status });
    }

    await event.save();
    res.json({ message: 'RSVP successful', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};