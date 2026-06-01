const express = require('express');
const router = express.Router();
const postController = require('../controllers/AI.postController');
const { authenticate } = require('../middleware/AG.authentication');

router.get('/community/:communityId', postController.getPostsByCommunity);
router.post('/', authenticate, postController.createPost);
router.patch('/:postId/like', authenticate, postController.likePost);
router.delete('/:postId', authenticate, postController.deletePost);

module.exports = router;