const Donation = require('../models/AI.Donation');
const Community = require('../models/AI.Community');
const User = require('../models/AI.User');
const Notification = require('../models/AI.Notification');

async function createNotif(userId, type, title, body) {
  try {
    await Notification.create({ user_id: userId, type, title, body });
  } catch (e) {
    console.error('Notif error:', e.message);
  }
}

const donationController = {
  async submitDonation(req, res, next) {
    try {
      const { community_id, amount } = req.body;
      const { userId } = req.user;

      if (!community_id || !amount) {
        return res.status(400).json({ success: false, message: 'Community and amount are required' });
      }

      const community = await Community.findByPk(community_id);
      if (!community) {
        return res.status(404).json({ success: false, message: 'Community not found' });
      }

      const donation = await Donation.create({
        user_id: userId,
        community_id,
        amount,
        status: 'completed'
      });

      community.total_donations = parseFloat(community.total_donations) + parseFloat(amount);
      await community.save();

      // Notify community rep
      if (community.community_rep_id) {
        await createNotif(
          community.community_rep_id,
          'donation',
          'Donasi Baru Masuk',
          `Komunitas kamu menerima donasi sebesar Rp${parseFloat(amount).toLocaleString('id-ID')}`
        );
      }

      res.status(201).json({ success: true, message: 'Donation submitted successfully', data: donation });
    } catch (error) {
      next(error);
    }
  },

  async getUserDonations(req, res, next) {
    try {
      const { userId } = req.params;
      const donations = await Donation.findAll({
        where: { user_id: userId },
        include: [{ model: Community, attributes: ['community_id', 'name', 'location'] }],
        order: [['createdAt', 'DESC']]
      });
      res.json({ success: true, data: donations });
    } catch (error) {
      next(error);
    }
  },

  async getDonationsByCommunity(req, res, next) {
    try {
      const { communityId } = req.params;
      const donations = await Donation.findAll({
        where: { community_id: communityId },
        include: [{ model: User, attributes: ['user_id', 'name', 'email'] }],
        order: [['createdAt', 'DESC']]
      });
      res.json({ success: true, data: donations });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = donationController;