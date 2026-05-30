const { DataTypes } = require('sequelize');
const sequelize = require('../config/AI.database');
const User = require('./AI.User');
const Community = require('./AI.Community');

const VolunteerApplication = sequelize.define('VolunteerApplication', {
  application_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'user_id'
    },
    allowNull: false
  },
  community_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'communities',
      key: 'community_id'
    },
    allowNull: false
  },
  application_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  skills: {
  type: DataTypes.STRING(255)
  },
  availability: {
    type: DataTypes.STRING(50)
  },
  motivation: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'withdrawn'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'volunteer_applications',
  timestamps: true
});

VolunteerApplication.belongsTo(User, { foreignKey: 'user_id' });
VolunteerApplication.belongsTo(Community, { foreignKey: 'community_id' });

module.exports = VolunteerApplication;

