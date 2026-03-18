import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

// Get events with filters
export const getEvents = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_URL}/events?${queryParams}`);
    return response.data.events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Get single event by ID
export const getEventById = async (eventId) => {
  try {
    const response = await axios.get(`${API_URL}/events/${eventId}`);
    return response.data.event;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

// RSVP to an event
export const rsvpEvent = async (eventId, rsvpData = { guests: 1, status: 'confirmed' }) => {
  try {
    const response = await axios.post(`${API_URL}/events/${eventId}/rsvp`, rsvpData);
    return response.data;
  } catch (error) {
    console.error('Error RSVPing to event:', error);
    throw error;
  }
};

// Cancel RSVP
export const cancelRSVP = async (eventId) => {
  try {
    const response = await axios.delete(`${API_URL}/events/${eventId}/rsvp`);
    return response.data;
  } catch (error) {
    console.error('Error canceling RSVP:', error);
    throw error;
  }
};

// Save event to wishlist
export const saveEvent = async (eventId) => {
  try {
    const response = await axios.post(`${API_URL}/users/saved-events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error saving event:', error);
    throw error;
  }
};

// Remove event from wishlist
export const unsaveEvent = async (eventId) => {
  try {
    const response = await axios.delete(`${API_URL}/users/saved-events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing saved event:', error);
    throw error;
  }
};

// Get user's saved events
export const getSavedEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/saved-events`);
    return response.data.events;
  } catch (error) {
    console.error('Error fetching saved events:', error);
    throw error;
  }
};

// Get user's RSVPs
export const getUserRSVPs = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/rsvps`);
    return response.data.rsvps;
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    throw error;
  }
};

// Search events
export const searchEvents = async (query, filters = {}) => {
  try {
    const params = new URLSearchParams({ q: query, ...filters }).toString();
    const response = await axios.get(`${API_URL}/events/search?${params}`);
    return response.data.events;
  } catch (error) {
    console.error('Error searching events:', error);
    throw error;
  }
};

// Get recommended events
export const getRecommendedEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/events/recommended`);
    return response.data.events;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

// Create event (for organizers)
export const createEvent = async (eventData) => {
  try {
    const response = await axios.post(`${API_URL}/events`, eventData);
    toast.success('Event created successfully!');
    return response.data.event;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Update event
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await axios.put(`${API_URL}/events/${eventId}`, eventData);
    toast.success('Event updated successfully!');
    return response.data.event;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Delete event
export const deleteEvent = async (eventId) => {
  try {
    const response = await axios.delete(`${API_URL}/events/${eventId}`);
    toast.success('Event deleted successfully!');
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};