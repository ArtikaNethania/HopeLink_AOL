const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/AG.errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

