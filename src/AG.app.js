const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/AG.errorHandler');

const authRoutes = require('./routes/CA.auth.routes');
const communityRoutes = require('./routes/AI.community.routes');
const donationRoutes = require('./routes/AI.donation.routes');
const volunteerRoutes = require('./routes/AG.volunteer.routes');
const adminRoutes = require('./routes/CA.admin.routes');
const notificationRoutes = require('./routes/AI.notification.routes');
const postRoutes = require('./routes/AI.post.routes');
const eventRoutes = require('./routes/AI.event.routes');
const ratingRoutes = require('./routes/AI.rating.routes');

const app = express();

// Setup associations
const User = require('./models/AI.User');
const Post = require('./models/AI.Post');
const Event = require('./models/AI.Event');
const Community = require('./models/AI.Community');
const EventRegistration = require('./models/AI.EventRegistration');
const Rating = require('./models/AI.Rating');
const models = { User, Post, Event, Community, EventRegistration, Rating };
Object.values(models).forEach(model => {
  if (model.associate) model.associate(models);
});

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/ratings', ratingRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

module.exports = app;