import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  preferences: {
    categories: [{
      type: String,
      enum: ['Tech Meetups', 'Cultural', 'Music', 'Sports', 'Food', 'Workshops']
    }],
    locationRadius: {
      type: String,
      enum: ['Dhangadhi 10km', 'Kailali 50km', 'Sudurpashchim', 'All Nepal'],
      default: 'Dhangadhi 10km'
    },
    frequency: {
      type: String,
      enum: ['Weekly', 'Monthly', 'Big Events Only'],
      default: 'Weekly'
    },
    budgetRange: {
      type: String,
      enum: ['Free', '<500 NPR', '<2000 NPR', 'Any'],
      default: 'Any'
    }
  },
  location: {
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  notificationSettings: {
    eventUpdates: { type: Boolean, default: true },
    seatAlerts: { type: Boolean, default: true },
    recommendations: { type: Boolean, default: true },
    rsvpStatus: { type: Boolean, default: true }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);