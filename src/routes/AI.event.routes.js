const express = require('express');
const router = express.Router();
const eventController = require('../controllers/AI.eventController');
const { authenticate } = require('../middleware/AG.authentication');

// Static routes FIRST (before dynamic /:eventId routes)
router.get('/my/registrations', authenticate, eventController.getMyRegistrations);
router.get('/community/:communityId', eventController.getEventsByCommunity);

// Community rep
router.post('/', authenticate, eventController.createEvent);
router.delete('/:eventId', authenticate, eventController.deleteEvent);
router.get('/:eventId/registrations', authenticate, eventController.getEventRegistrations);

// Donor/volunteer
router.post('/:eventId/register', authenticate, eventController.registerToEvent);
router.delete('/:eventId/register', authenticate, eventController.cancelEventRegistration);

module.exports = router;