const express = require('express');
const volunteerController = require('../controllers/AG.volunteerController');
const { authenticate } = require('../middleware/AG.authentication');

const router = express.Router();

router.post('/apply', authenticate, volunteerController.applyAsVolunteer);
router.put('/applications/:applicationId', authenticate, volunteerController.approveApplication);
router.get('/history/:userId', volunteerController.getVolunteerHistory);
router.get('/community/:communityId', volunteerController.getVolunteersByCommunity);
router.patch('/applications/:applicationId/status', authenticate, volunteerController.updateVolunteerStatus);

module.exports = router;