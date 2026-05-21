const { DataTypes } = require('sequelize');
const sequelize = require('../config/AI.database');
const Community = require('./AI.Community');
const User = require('./AI.User');

const Service = sequelize.define('Service', {
  service_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  community_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'communities',
      key: 'community_id'
    },
    allowNull: false
  },
  volunteer_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  service_type: {
    type: DataTypes.VARCHAR(100)
  },
  start_date: {
    type: DataTypes.DATE
  },
  end_date: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.ENUM('in_progress', 'completed', 'cancelled'),
    defaultValue: 'in_progress'
  }
}, {
  tableName: 'services',
  timestamps: true
});

Service.belongsTo(Community, { foreignKey: 'community_id' });
Service.belongsTo(User, { foreignKey: 'volunteer_id', as: 'volunteer' });

module.exports = Service;
