const { DataTypes } = require('sequelize');
const sequelize = require('../config/AI.database');
const User = require('./AI.User');

const Notification = sequelize.define('Notification', {
  notification_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'user_id' }
  },
  type: {
    type: DataTypes.ENUM('donation', 'volunteer', 'approved', 'rejected', 'system'),
    defaultValue: 'system'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  body: {
    type: DataTypes.TEXT
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'notifications',
  timestamps: true
});

Notification.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Notification;