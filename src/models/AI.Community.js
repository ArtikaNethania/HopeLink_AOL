const { DataTypes } = require('sequelize');
const sequelize = require('../config/AI.database');
const User = require('./AI.User');

const Community = sequelize.define('Community', {
  community_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  code: {
    type: DataTypes.STRING(50),
    unique: true
  },
  location: {
    type: DataTypes.STRING(255)
  },
  description: {
    type: DataTypes.TEXT
  },
  verification_status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  community_rep_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  total_donations: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  }
}, {
  tableName: 'communities',
  timestamps: true
});

Community.belongsTo(User, {
  as: 'representative',
  foreignKey: 'community_rep_id'
});

module.exports = Community;

