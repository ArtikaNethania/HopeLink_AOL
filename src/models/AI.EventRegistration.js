const { DataTypes } = require('sequelize');
const sequelize = require('../config/AI.database');

const EventRegistration = sequelize.define('EventRegistration', {
  registration_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  event_id:        { type: DataTypes.INTEGER, allowNull: false },
  user_id:         { type: DataTypes.INTEGER, allowNull: false },
  status:          { type: DataTypes.ENUM('registered', 'cancelled'), defaultValue: 'registered' }
}, { tableName: 'event_registrations' });

EventRegistration.associate = (models) => {
  EventRegistration.belongsTo(models.Event, { foreignKey: 'event_id' });
  EventRegistration.belongsTo(models.User, { foreignKey: 'user_id' });
};

module.exports = EventRegistration;