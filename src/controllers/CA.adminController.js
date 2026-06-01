const Community = require('../models/AI.Community');
const User = require('../models/AI.User');
const Notification = require('../models/AI.Notification');

async function createNotif(userId, type, title, body) {
  try {
    await Notification.create({ user_id: userId, type, title, body });
  } catch (e) {
    console.error('Notification error:', e.message);
  }
}

const adminController = {
  async getPendingCommunities(req, res, next) {
    try {
      const communities = await Community.findAll({
        where: { verification_status: 'pending' },
        include: [{ model: User, as: 'representative', attributes: ['user_id', 'name', 'email', 'phone_number'] }]
      });
      res.json({ success: true, data: communities });
    } catch (error) { next(error); }
  },

  async getAllCommunities(req, res, next) {
    try {
      const communities = await Community.findAll({
        include: [{ model: User, as: 'representative', attributes: ['user_id', 'name', 'email', 'phone_number'] }]
      });
      res.json({ success: true, data: communities });
    } catch (error) { next(error); }
  },

  async verifyCommunity(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Status must be either approved or rejected' });
      }

      const community = await Community.findByPk(id);
      if (!community) {
        return res.status(404).json({ success: false, message: 'Community not found' });
      }

      community.verification_status = status;
      await community.save();

      // Notify community representative
      if (community.community_rep_id) {
        if (status === 'approved') {
          await createNotif(
            community.community_rep_id,
            'approved',
            'Community Verified',
            `Congratulations! Your community "${community.name}" has been verified and is now live on HopeLink.`
          );
        } else {
          await createNotif(
            community.community_rep_id,
            'rejected',
            'Community Registration Not Approved',
            `Unfortunately, your community registration for "${community.name}" was not approved. You may register again with updated information.`
          );
        }
      }

      res.json({
        success: true,
        message: `Community ${status} successfully`,
        data: community
      });
    } catch (error) { next(error); }
  },

  async getAllUsers(req, res, next) {
    try {
      const users = await User.findAll({ attributes: { exclude: ['password'] } });
      res.json({ success: true, data: users });
    } catch (error) { next(error); }
  },

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      if (user.role === 'admin') {
        return res.status(403).json({ success: false, message: 'Cannot delete an admin account' });
      }
      await user.destroy();
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) { next(error); }
  }
};

module.exports = adminController;