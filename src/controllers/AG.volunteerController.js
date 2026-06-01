const VolunteerApplication = require('../models/AI.VolunteerApplication');
const Service = require('../models/AI.Service');
const User = require('../models/AI.User');
const Community = require('../models/AI.Community');
const Notification = require('../models/AI.Notification');

async function createNotif(userId, type, title, body) {
  try {
    await Notification.create({ user_id: userId, type, title, body });
  } catch (e) {
    console.error('Notification error:', e.message);
  }
}

const volunteerController = {
  async applyAsVolunteer(req, res, next) {
    try {
      const { community_id, skills, availability, motivation } = req.body;
      const { userId } = req.user;

      if (!community_id) {
        return res.status(400).json({ success: false, message: 'Community is required' });
      }

      const community = await Community.findByPk(community_id);
      if (!community) {
        return res.status(404).json({ success: false, message: 'Community not found' });
      }

      const existing = await VolunteerApplication.findOne({
        where: { user_id: userId, community_id }
      });

      if (existing && existing.status === 'pending') {
        return res.status(409).json({ success: false, message: 'You already have a pending application for this community' });
      }

      const application = await VolunteerApplication.create({
        user_id: userId,
        community_id,
        skills,
        availability,
        motivation,
        status: 'pending'
      });

      // Notify community representative
      if (community.community_rep_id) {
        await createNotif(
          community.community_rep_id,
          'volunteer',
          'New Volunteer Application',
          `A new volunteer has applied to join ${community.name}`
        );
      }

      res.status(201).json({
        success: true,
        message: 'Volunteer application submitted successfully',
        data: application
      });
    } catch (error) {
      next(error);
    }
  },

  // FIXED: now sends notification to applicant on approve/reject
  async approveApplication(req, res, next) {
    try {
      const { applicationId } = req.params;
      const { status } = req.body;

      const application = await VolunteerApplication.findByPk(applicationId);
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      application.status = status;
      await application.save();

      if (status === 'approved') {
        await Service.create({
          community_id: application.community_id,
          volunteer_id: application.user_id,
          status: 'in_progress'
        });

        // Notify the applicant — FIXED: was missing
        await createNotif(
          application.user_id,
          'approved',
          'Volunteer Application Approved',
          'Congratulations! Your volunteer application has been approved by the community representative.'
        );
      } else if (status === 'rejected') {
        // Notify the applicant on rejection too
        await createNotif(
          application.user_id,
          'rejected',
          'Volunteer Application Rejected',
          'Unfortunately, your volunteer application was not accepted this time.'
        );
      }

      res.json({ success: true, message: 'Application updated successfully', data: application });
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
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      application.status = status;
      await application.save();

      // Notify the applicant
      if (status === 'approved') {
        await createNotif(
          application.user_id,
          'approved',
          'Volunteer Application Approved',
          'Congratulations! Your volunteer application has been approved by the community representative.'
        );
      } else if (status === 'rejected') {
        await createNotif(
          application.user_id,
          'rejected',
          'Volunteer Application Rejected',
          'Unfortunately, your volunteer application was not accepted this time.'
        );
      }

      res.json({ success: true, message: 'Status updated successfully', data: application });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = volunteerController;