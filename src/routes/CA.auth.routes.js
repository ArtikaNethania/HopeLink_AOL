const express = require('express');
const authController = require('../controllers/CA.authController');
const { authenticate } = require('../middleware/AG.authentication');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);

module.exports = router;

