const Rating = require('../models/AI.Rating');
const Event = require('../models/AI.Event');
const EventRegistration = require('../models/AI.EventRegistration');
const Community = require('../models/AI.Community');
const Notification = require('../models/AI.Notification');

async function createNotif(userId, type, title, body) {
  try { await Notification.create({ user_id: userId, type, title, body }); } catch(e) {}
}

const ratingController = {
  // Donor rates community after event ended
  async donorRateCommunity(req, res, next) {
    try {
      const { eventId } = req.params;
      const { score, review } = req.body;
      const { userId } = req.user;

      if (!score || score < 1 || score > 5) {
        return res.status(400).json({ success: false, message: 'Score must be between 1 and 5' });
      }

      const event = await Event.findByPk(eventId);
      if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

      // Check event is past
      const isPast = event.event_date && new Date(event.event_date) < new Date();
      if (!isPast) return res.status(400).json({ success: false, message: 'Can only rate after the event has ended' });

      // Check donor was registered
      const registration = await EventRegistration.findOne({
        where: { event_id: eventId, user_id: userId, status: 'registered' }
      });
      if (!registration) return res.status(403).json({ success: false, message: 'You must have participated in this event to rate' });

      // Check not already rated
      const existing = await Rating.findOne({
        where: { event_id: eventId, rater_id: userId, rater_type: 'donor' }
      });
      if (existing) return res.status(409).json({ success: false, message: 'You have already rated this event' });

      const rating = await Rating.create({
        event_id: eventId,
        rater_id: userId,
        ratee_id: event.community_id,
        rater_type: 'donor',
        score,
        review: review || null
      });

      // Notify community rep
      const community = await Community.findByPk(event.community_id);
      if (community?.community_rep_id) {
        await createNotif(community.community_rep_id, 'system', 'New Rating Received',
          `Your community received a ${score}/5 rating for "${event.title}".`);
      }

      res.status(201).json({ success: true, data: rating });
    } catch(error) { next(error); }
  },

  // Community rep rates donor after event ended
  async communityRateDonor(req, res, next) {
    try {
      const { eventId, donorId } = req.params;
      const { score, review } = req.body;
      const { userId } = req.user;

      if (!score || score < 1 || score > 5) {
        return res.status(400).json({ success: false, message: 'Score must be between 1 and 5' });
      }

      const event = await Event.findByPk(eventId);
      if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

      // Check event is past
      const isPast = event.event_date && new Date(event.event_date) < new Date();
      if (!isPast) return res.status(400).json({ success: false, message: 'Can only rate after the event has ended' });

      // Check not already rated
      const existing = await Rating.findOne({
        where: { event_id: eventId, rater_id: userId, ratee_id: donorId, rater_type: 'community' }
      });
      if (existing) return res.status(409).json({ success: false, message: 'Already rated this volunteer' });

      const rating = await Rating.create({
        event_id: eventId,
        rater_id: userId,
        ratee_id: donorId,
        rater_type: 'community',
        score,
        review: review || null
      });

      // Notify donor
      await createNotif(donorId, 'system', 'You Received a Rating',
        `A community rated your participation in "${event.title}" as ${score}/5.`);

      res.status(201).json({ success: true, data: rating });
    } catch(error) { next(error); }
  },

  // Get ratings for a community (avg score)
  async getCommunityRatings(req, res, next) {
    try {
      const { communityId } = req.params;
      const ratings = await Rating.findAll({
        where: { ratee_id: communityId, rater_type: 'donor' }
      });
      const avg = ratings.length ? ratings.reduce((s, r) => s + r.score, 0) / ratings.length : null;
      res.json({ success: true, data: ratings, average: avg ? Math.round(avg * 10) / 10 : null, count: ratings.length });
    } catch(error) { next(error); }
  },

  // Get ratings received by a donor
  async getDonorRatings(req, res, next) {
    try {
      const { donorId } = req.params;
      const ratings = await Rating.findAll({
        where: { ratee_id: donorId, rater_type: 'community' }
      });
      const avg = ratings.length ? ratings.reduce((s, r) => s + r.score, 0) / ratings.length : null;
      res.json({ success: true, data: ratings, average: avg ? Math.round(avg * 10) / 10 : null, count: ratings.length });
    } catch(error) { next(error); }
  },

  // Check if donor already rated an event
  async checkRating(req, res, next) {
    try {
      const { eventId } = req.params;
      const { userId } = req.user;
      const rating = await Rating.findOne({
        where: { event_id: eventId, rater_id: userId, rater_type: 'donor' }
      });
      res.json({ success: true, rated: !!rating, data: rating });
    } catch(error) { next(error); }
  },

  // Admin: get all ratings
  async getAllRatings(req, res, next) {
    try {
      const Rating = require('../models/AI.Rating');
      const Event = require('../models/AI.Event');
      const User = require('../models/AI.User');
      const ratings = await Rating.findAll({
        include: [
          { model: Event, attributes: ['event_id', 'title', 'community_id'] },
          { model: User, as: 'rater', attributes: ['user_id', 'name', 'role'], foreignKey: 'rater_id' },
          { model: User, as: 'ratee', attributes: ['user_id', 'name', 'role'], foreignKey: 'ratee_id' }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.json({ success: true, data: ratings });
    } catch(error) { next(error); }
  }
};

module.exports = ratingController;