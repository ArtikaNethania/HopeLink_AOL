const { DataTypes } = require('sequelize');
const sequelize = require('../config/AI.database');

const Rating = sequelize.define('Rating', {
  rating_id:  { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  event_id:   { type: DataTypes.INTEGER, allowNull: false },
  rater_id:   { type: DataTypes.INTEGER, allowNull: false },
  ratee_id:   { type: DataTypes.INTEGER, allowNull: false },
  rater_type: { type: DataTypes.ENUM('donor', 'community'), allowNull: false },
  score:      { type: DataTypes.INTEGER, allowNull: false },
  review:     { type: DataTypes.TEXT, allowNull: true }
}, { tableName: 'ratings' });

Rating.associate = (models) => {
  Rating.belongsTo(models.Event, { foreignKey: 'event_id' });
  Rating.belongsTo(models.User, { as: 'rater', foreignKey: 'rater_id' });
  Rating.belongsTo(models.User, { as: 'ratee', foreignKey: 'ratee_id' });
};

module.exports = Rating;