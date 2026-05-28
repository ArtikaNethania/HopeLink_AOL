const Community = require('../models/AI.Community');
const User = require('../models/AI.User');

const adminController = {

  // Get all pending communities
  async getPendingCommunities(req, res, next) {
    try {
      const communities = await Community.findAll({
        where: { verification_status: 'pending' },
        include: [{
          model: User,
          as: 'representative',
          attributes: ['user_id', 'name', 'email', 'phone_number']
        }]
      });
      res.json({ success: true, data: communities });
    } catch (error) {
      next(error);
    }
  },

  // Get all communities (any status)
  async getAllCommunities(req, res, next) {
    try {
      const communities = await Community.findAll({
        include: [{
          model: User,
          as: 'representative',
          attributes: ['user_id', 'name', 'email', 'phone_number']
        }]
      });
      res.json({ success: true, data: communities });
    } catch (error) {
      next(error);
    }
  },

  // Approve or reject a community
  async verifyCommunity(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be approved or rejected'
        });
      }

      const community = await Community.findByPk(id);
      if (!community) {
        return res.status(404).json({
          success: false,
          message: 'Community not found'
        });
      }

      community.verification_status = status;
      await community.save();

      res.json({
        success: true,
        message: `Community ${status} successfully`,
        data: community
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all users
  async getAllUsers(req, res, next) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] }
      });
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

};

module.exports = adminController;