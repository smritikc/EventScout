import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['Tech Meetups', 'Cultural', 'Music', 'Sports', 'Food', 'Workshops'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: String,
  location: {
    venue: String,
    city: String,
    radius: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  eventType: {
    type: String,
    enum: ['online', 'onsite'],
    default: 'onsite'
  },
  price: {
    type: Number,
    default: 0
  },
  priceCategory: {
    type: String,
    enum: ['Free', '<500 NPR', '<2000 NPR'],
    default: 'Free'
  },
  paymentStatus: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free'
  },
  capacity: Number,
  participationType: {
    type: String,
    enum: ['individual', 'team', 'both'],
    default: 'individual'
  },
  teamSizeLimit: {
    type: Number,
    default: 1
  },
  attendees: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['confirmed', 'maybe', 'waitlist'] },
    guests: { type: Number, default: 0 },
    teamName: String
  }],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  images: [String],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Event', eventSchema);