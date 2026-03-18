import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['event_update', 'seat_alert', 'recommendation', 'rsvp_status'],
    required: true
  },
  title: String,
  message: String,
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Notification', notificationSchema);