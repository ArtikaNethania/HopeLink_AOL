const VolunteerApplication = require('../models/AI.VolunteerApplication');
const Service = require('../models/AI.Service');
const User = require('../models/AI.User');
const Community = require('../models/AI.Community');

const volunteerController = {
  async applyAsVolunteer(req, res, next) {
    try {
      const { community_id, skills, availability, motivation } = req.body;
      const { userId } = req.user;

      if (!community_id) {
        return res.status(400).json({ success: false, message: 'Komunitas harus diisi' });
      }

      const community = await Community.findByPk(community_id);
      if (!community) {
        return res.status(404).json({ success: false, message: 'Komunitas tidak ditemukan' });
      }

      const existing = await VolunteerApplication.findOne({
        where: { user_id: userId, community_id }
      });

      if (existing && existing.status === 'pending') {
        return res.status(409).json({ success: false, message: 'Sudah ada aplikasi pending' });
      }

      const application = await VolunteerApplication.create({
        user_id: userId,
        community_id,
        skills,
        availability,
        motivation,
        status: 'pending'
      });

      res.status(201).json({ success: true, message: 'Aplikasi volunteer berhasil disubmit', data: application });
    } catch (error) {
      next(error);
    }
  },

  async approveApplication(req, res, next) {
    try {
      const { applicationId } = req.params;
      const { status } = req.body;

      const application = await VolunteerApplication.findByPk(applicationId);
      if (!application) {
        return res.status(404).json({ success: false, message: 'Aplikasi tidak ditemukan' });
      }

      application.status = status;
      await application.save();

      if (status === 'approved') {
        await Service.create({
          community_id: application.community_id,
          volunteer_id: application.user_id,
          status: 'in_progress'
        });
      }

      res.json({ success: true, message: 'Aplikasi diupdate', data: application });
    } catch (error) {
      next(error);
    }
  },

  async getVolunteerHistory(req, res, next) {
    try {
      const { userId } = req.params;

      const applications = await VolunteerApplication.findAll({
        where: { user_id: userId },
        include: [{ model: Community, attributes: ['community_id', 'name', 'location'] }]
      });

      res.json({ success: true, data: applications });
    } catch (error) {
      next(error);
    }
  },

  async getVolunteersByCommunity(req, res, next) {
    try {
      const { communityId } = req.params;

      const applications = await VolunteerApplication.findAll({
        where: { community_id: communityId },
        include: [{ model: User, attributes: ['user_id', 'name', 'email', 'phone_number'] }],
        order: [['createdAt', 'DESC']]
      });

      res.json({ success: true, data: applications });
    } catch (error) {
      next(error);
    }
  },

  async updateVolunteerStatus(req, res, next) {
    try {
      const { applicationId } = req.params;
      const { status } = req.body;

      const application = await VolunteerApplication.findByPk(applicationId);
      if (!application) {
        return res.status(404).json({ success: false, message: 'Aplikasi tidak ditemukan' });
      }

      application.status = status;
      await application.save();

      res.json({ success: true, message: 'Status diupdate', data: application });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = volunteerController;