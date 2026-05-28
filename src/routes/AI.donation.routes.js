const express = require('express');
const donationController = require('../controllers/AI.donationController');
const { authenticate } = require('../middleware/AG.authentication');

const router = express.Router();

router.post('/', authenticate, donationController.submitDonation);
router.get('/user/:userId', donationController.getUserDonations);
router.get('/community/:communityId', authenticate, donationController.getDonationsByCommunity);

module.exports = router;