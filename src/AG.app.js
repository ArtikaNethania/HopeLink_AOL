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

const app = express();

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/admin', adminRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/volunteers', volunteerRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route tidak ditemukan'
  });
});

module.exports = app;
