const Donation = require('../models/AI.Donation');
const Community = require('../models/AI.Community');

const donationController = {
  async submitDonation(req, res, next) {
    try {
      const { community_id, amount } = req.body;
      const { userId } = req.user;

      if (!community_id || !amount) {
        return res.status(400).json({
          success: false,
          message: 'Komunitas dan jumlah donasi harus diisi'
        });
      }

      const community = await Community.findByPk(community_id);
      if (!community) {
        return res.status(404).json({
          success: false,
          message: 'Komunitas tidak ditemukan'
        });
      }

      const donation = await Donation.create({
        user_id: userId,
        community_id,
        amount,
        status: 'completed'
      });

      community.total_donations = parseFloat(community.total_donations) + parseFloat(amount);
      await community.save();

      res.status(201).json({
        success: true,
        message: 'Donasi berhasil disubmit',
        data: donation
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserDonations(req, res, next) {
    try {
      const { userId } = req.params;

      const donations = await Donation.findAll({
        where: { user_id: userId },
        include: [{
          model: Community,
          attributes: ['community_id', 'name', 'location']
        }]
      });

      res.json({
        success: true,
        data: donations
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = donationController;
