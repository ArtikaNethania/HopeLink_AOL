const express = require('express');
const adminController = require('../controllers/CA.adminController');
const { authenticate, authorize } = require('../middleware/AG.authentication');

const router = express.Router();

// All admin routes require authentication + admin role
router.get('/communities/pending', authenticate, authorize('admin'), adminController.getPendingCommunities);
router.get('/communities', authenticate, authorize('admin'), adminController.getAllCommunities);
router.patch('/communities/:id/verify', authenticate, authorize('admin'), adminController.verifyCommunity);
router.get('/users', authenticate, authorize('admin'), adminController.getAllUsers);
router.delete('/users/:id', authenticate, authorize('admin'), adminController.deleteUser);

module.exports = router;