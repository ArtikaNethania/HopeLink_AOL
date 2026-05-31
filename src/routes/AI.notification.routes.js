const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/AG.authentication');
const notificationController = require('../controllers/AI.notificationController');

router.get('/', authenticate, notificationController.getNotifications);
router.patch('/:id/read', authenticate, notificationController.markAsRead);
router.patch('/read-all', authenticate, notificationController.markAllRead);

module.exports = router;