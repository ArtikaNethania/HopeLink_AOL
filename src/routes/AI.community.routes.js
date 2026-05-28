const express = require('express');
const communityController = require('../controllers/AI.communityController');
const { authenticate } = require('../middleware/AG.authentication');

const router = express.Router();

router.post('/register', authenticate, communityController.registerCommunity);
router.get('/my', authenticate, communityController.getMyCommunity);
router.get('/', communityController.getAllCommunities);
router.get('/:id', communityController.getCommunityDetail);

module.exports = router;
