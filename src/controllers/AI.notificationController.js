const Notification = require('../models/AI.Notification');

const notificationController = {
  async getNotifications(req, res, next) {
    try {
      const { userId } = req.user;
      const notifications = await Notification.findAll({
        where: { user_id: userId },
        order: [['createdAt', 'DESC']]
      });
      res.json({ success: true, data: notifications });
    } catch (error) {
      next(error);
    }
  },

  async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      await Notification.update({ is_read: true }, { where: { notification_id: id } });
      res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
      next(error);
    }
  },

  async markAllRead(req, res, next) {
    try {
      const { userId } = req.user;
      await Notification.update({ is_read: true }, { where: { user_id: userId } });
      res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = notificationController;