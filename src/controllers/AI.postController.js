const Post = require('../models/AI.Post');
const User = require('../models/AI.User');

const postController = {
  async createPost(req, res, next) {
    try {
      const { community_id, text, photo } = req.body;
      const { userId } = req.user;
      if (!text && !photo) return res.status(400).json({ success: false, message: 'Text or photo is required' });
      const post = await Post.create({ community_id, user_id: userId, text: text?.trim() || null, photo: photo || null });
      res.status(201).json({ success: true, data: post });
    } catch(error) { next(error); }
  },

  async getPostsByCommunity(req, res, next) {
    try {
      const { communityId } = req.params;
      const posts = await Post.findAll({
        where: { community_id: communityId },
        include: [{ model: User, attributes: ['user_id', 'name'] }],
        order: [['createdAt', 'DESC']]
      });
      res.json({ success: true, data: posts });
    } catch(error) { next(error); }
  },

  async likePost(req, res, next) {
    try {
      const { postId } = req.params;
      const { userId } = req.user;
      const post = await Post.findByPk(postId);
      if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
      const likedBy = Array.isArray(post.liked_by) ? post.liked_by : [];
      const alreadyLiked = likedBy.includes(userId);
      if (alreadyLiked) {
        post.liked_by = likedBy.filter(id => id !== userId);
        post.likes = Math.max(0, (post.likes || 0) - 1);
      } else {
        post.liked_by = [...likedBy, userId];
        post.likes = (post.likes || 0) + 1;
      }
      await post.save();
      res.json({ success: true, liked: !alreadyLiked, data: post });
    } catch(error) { next(error); }
  },

  async deletePost(req, res, next) {
    try {
      const { postId } = req.params;
      const { userId } = req.user;
      const post = await Post.findByPk(postId);
      if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
      if (post.user_id !== userId) return res.status(403).json({ success: false, message: 'Unauthorized' });
      await post.destroy();
      res.json({ success: true, message: 'Post deleted' });
    } catch(error) { next(error); }
  }
};

module.exports = postController;