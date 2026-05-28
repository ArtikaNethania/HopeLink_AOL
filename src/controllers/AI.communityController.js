const Community = require('../models/AI.Community');
const User = require('../models/AI.User');

const communityController = {
  async registerCommunity(req, res, next) {
    try {
      const { name, location, description } = req.body;
      const { userId } = req.user;

      if (!name) {
        return res.status(400).json({ success: false, message: 'Community name is required' });
      }

      const existing = await Community.findOne({ where: { name } });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Community name already registered' });
      }

      const code = name.substring(0, 3).toUpperCase() + Date.now();

      const community = await Community.create({
        name, location, description, code,
        community_rep_id: userId,
        verification_status: 'pending'
      });

      res.status(201).json({ success: true, message: 'Community registered successfully', data: community });
    } catch (error) {
      next(error);
    }
  },

  async getAllCommunities(req, res, next) {
    try {
      const communities = await Community.findAll({
        where: { verification_status: 'approved' },
        include: [{ model: User, as: 'representative', attributes: ['user_id', 'name', 'email'] }]
      });
      res.json({ success: true, data: communities });
    } catch (error) {
      next(error);
    }
  },

  async getCommunityDetail(req, res, next) {
    try {
      const { id } = req.params;
      const community = await Community.findByPk(id, {
        include: [{ model: User, as: 'representative', attributes: ['user_id', 'name', 'email'] }]
      });
      if (!community) {
        return res.status(404).json({ success: false, message: 'Community not found' });
      }
      res.json({ success: true, data: community });
    } catch (error) {
      next(error);
    }
  },

  async getMyCommunity(req, res, next) {
    try {
      const { userId } = req.user;
      const community = await Community.findOne({
        where: { community_rep_id: userId },
        include: [{ model: User, as: 'representative', attributes: ['user_id', 'name', 'email'] }]
      });
      if (!community) {
        return res.status(404).json({ success: false, message: 'Community not found' });
      }
      res.json({ success: true, data: community });
    } catch (error) {
      next(error);
    }
  },

  async updateCommunity(req, res, next) {
    try {
      const { userId } = req.user;
      const { description, contact_phone, instagram, website } = req.body;

      const community = await Community.findOne({ where: { community_rep_id: userId } });
      if (!community) {
        return res.status(404).json({ success: false, message: 'Community not found' });
      }

      if (description !== undefined) community.description = description;
      if (contact_phone !== undefined) community.contact_phone = contact_phone;
      if (instagram !== undefined) community.instagram = instagram;
      if (website !== undefined) community.website = website;
      await community.save();

      res.json({ success: true, message: 'Community updated', data: community });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = communityController;