const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/AI.ratingController');
const { authenticate } = require('../middleware/AG.authentication');

router.post('/event/:eventId/community', authenticate, ratingController.donorRateCommunity);
router.post('/event/:eventId/donor/:donorId', authenticate, ratingController.communityRateDonor);
router.get('/community/:communityId', ratingController.getCommunityRatings);
router.get('/donor/:donorId', authenticate, ratingController.getDonorRatings);
router.get('/event/:eventId/check', authenticate, ratingController.checkRating);
router.get('/all', authenticate, ratingController.getAllRatings);

module.exports = router;