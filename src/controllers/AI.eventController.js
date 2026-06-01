const Event = require('../models/AI.Event');
const EventRegistration = require('../models/AI.EventRegistration');
const VolunteerApplication = require('../models/AI.VolunteerApplication');
const Notification = require('../models/AI.Notification');
const Community = require('../models/AI.Community');
const User = require('../models/AI.User');

async function createNotif(userId, type, title, body) {
  try {
    await Notification.create({ user_id: userId, type, title, body });
  } catch (e) {
    console.error('Notification error:', e.message);
  }
}

const eventController = {
  async createEvent(req, res, next) {
    try {
      const { title, description, event_date, deadline, slots, type } = req.body;
      const { userId } = req.user;

      // Get community from DB based on user
      const community = await Community.findOne({ where: { community_rep_id: userId } });
      if (!community) return res.status(403).json({ success: false, message: 'No community found for this user' });
      const community_id = community.community_id;

      if (!title) return res.status(400).json({ success: false, message: 'Title is required' });

      const event = await Event.create({
        community_id, title, description, event_date, deadline,
        slots: parseInt(slots) || 0, type: type || 'volunteer'
      });

      // Notify all approved volunteers of this community
      const volunteers = await VolunteerApplication.findAll({
        where: { community_id, status: 'approved' }
      });
      for (const v of volunteers) {
        await createNotif(
          v.user_id,
          'volunteer',
          'New Activity Available',
          `A new activity "${title}" has been posted by ${community.name}. Check it out!`
        );
      }

      res.status(201).json({ success: true, data: event });
    } catch(error) { next(error); }
  },

  async getEventsByCommunity(req, res, next) {
    try {
      const { communityId } = req.params;
      const events = await Event.findAll({
        where: { community_id: communityId },
        order: [['event_date', 'ASC']]
      });
      // Add registered count to each event
      const eventsWithCount = await Promise.all(events.map(async ev => {
        const registeredCount = await EventRegistration.count({ where: { event_id: ev.event_id, status: 'registered' } });
        return { ...ev.toJSON(), registered_count: registeredCount, slots_remaining: ev.slots > 0 ? ev.slots - registeredCount : null };
      }));
      res.json({ success: true, data: eventsWithCount });
    } catch(error) { next(error); }
  },

  async deleteEvent(req, res, next) {
    try {
      const { eventId } = req.params;
      const event = await Event.findByPk(eventId);
      if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
      await event.destroy();
      res.json({ success: true, message: 'Event deleted' });
    } catch(error) { next(error); }
  },

  async registerToEvent(req, res, next) {
    try {
      const { eventId } = req.params;
      const { userId } = req.user;

      const event = await Event.findByPk(eventId);
      if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
      if (event.status === 'ended') return res.status(400).json({ success: false, message: 'Event has already ended' });

      const isVolunteer = await VolunteerApplication.findOne({
        where: { user_id: userId, community_id: event.community_id, status: 'approved' }
      });
      if (!isVolunteer) {
        return res.status(403).json({ success: false, message: 'You must be an approved volunteer of this community to register' });
      }

      const existing = await EventRegistration.findOne({ where: { event_id: eventId, user_id: userId } });
      if (existing && existing.status === 'registered') {
        return res.status(409).json({ success: false, message: 'You are already registered for this event' });
      }

      if (event.slots > 0) {
        const count = await EventRegistration.count({ where: { event_id: eventId, status: 'registered' } });
        if (count >= event.slots) {
          return res.status(400).json({ success: false, message: 'No slots available' });
        }
      }

      if (existing) {
        existing.status = 'registered';
        await existing.save();
      } else {
        await EventRegistration.create({ event_id: eventId, user_id: userId });
      }

      await createNotif(userId, 'volunteer', 'Event Registration Successful', `You have successfully registered for "${event.title}".`);
      
      // Count remaining slots
      const registeredCount = await EventRegistration.count({ where: { event_id: eventId, status: 'registered' } });
      const slotsRemaining = event.slots > 0 ? event.slots - registeredCount : null;

      // Notify community rep
      const community = await Community.findByPk(event.community_id);
      if (community) {
        const volunteer = await User.findByPk(userId, { attributes: ['name'] });
        const repId = community.community_rep_id;
        const slotMsg = slotsRemaining !== null ? ` ${slotsRemaining} slot(s) remaining.` : '';
        await createNotif(repId, 'volunteer', 'New Activity Registration', `${volunteer?.name || 'A volunteer'} has registered for "${event.title}".${slotMsg}`);
      }

      res.status(201).json({ success: true, message: 'Registered to event successfully', slots_remaining: slotsRemaining });
    } catch(error) { next(error); }
  },

  async cancelEventRegistration(req, res, next) {
    try {
      const { eventId } = req.params;
      const { userId } = req.user;
      const registration = await EventRegistration.findOne({ where: { event_id: eventId, user_id: userId, status: 'registered' } });
      if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });
      registration.status = 'cancelled';
      await registration.save();
      res.json({ success: true, message: 'Registration cancelled' });
    } catch(error) { next(error); }
  },

  async getMyRegistrations(req, res, next) {
    try {
      const { userId } = req.user;
      const registrations = await EventRegistration.findAll({
        where: { user_id: userId },
        include: [{ model: Event, attributes: ['event_id', 'title', 'description', 'event_date', 'type', 'status', 'community_id'] }],
        order: [['createdAt', 'DESC']]
      });
      res.json({ success: true, data: registrations });
    } catch(error) { next(error); }
  },

  async getEventRegistrations(req, res, next) {
    try {
      const { eventId } = req.params;
      const registrations = await EventRegistration.findAll({
        where: { event_id: eventId, status: 'registered' },
        include: [{ model: User, attributes: ['user_id', 'name', 'email', 'phone_number'] }]
      });
      res.json({ success: true, data: registrations });
    } catch(error) { next(error); }
  }
};

module.exports = eventController;