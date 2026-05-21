const { DataTypes } = require('sequelize');
const sequelize = require('../config/AI.database');
const User = require('./AI.User');
const Community = require('./AI.Community');

const Donation = sequelize.define('Donation', {
  donation_id: {
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
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  donation_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'donations',
  timestamps: true
});

Donation.belongsTo(User, { foreignKey: 'user_id' });
Donation.belongsTo(Community, { foreignKey: 'community_id' });

module.exports = Donation;

