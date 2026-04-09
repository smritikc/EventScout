import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import session from 'express-session';
import passport from 'passport';

import './config/passport.js';

import userRoutes from './routes/user.js'
import eventRoutes from './routes/events.js';
import notificationRoutes from './routes/notification.js';
import organizerRoutes from './routes/organizers.js';
import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payments.js';


const app = express();

//  Middleware
app.use(cors());
app.use(express.json());


app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventscout')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

//  Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/organizers', organizerRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});