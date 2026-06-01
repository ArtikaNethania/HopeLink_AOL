const { DataTypes } = require('sequelize');
const sequelize = require('../config/AI.database');

const Event = sequelize.define('Event', {
  event_id:     { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  community_id: { type: DataTypes.INTEGER, allowNull: false },
  title:        { type: DataTypes.STRING(255), allowNull: false },
  description:  { type: DataTypes.TEXT },
  event_date:   { type: DataTypes.DATEONLY },
  deadline:     { type: DataTypes.DATEONLY },
  slots:        { type: DataTypes.INTEGER, defaultValue: 0 },
  type:         { type: DataTypes.ENUM('volunteer', 'donation_drive', 'community_event'), defaultValue: 'volunteer' },
  status:       { type: DataTypes.ENUM('active', 'ended'), defaultValue: 'active' }
}, { tableName: 'events' });

Event.associate = (models) => {
  Event.belongsTo(models.Community, { foreignKey: 'community_id' });
  Event.hasMany(models.EventRegistration, { foreignKey: 'event_id' });
};

module.exports = Event;