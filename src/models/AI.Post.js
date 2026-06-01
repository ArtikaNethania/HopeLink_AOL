const { DataTypes } = require('sequelize');
const sequelize = require('../config/AI.database');

const Post = sequelize.define('Post', {
  post_id:      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  community_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id:      { type: DataTypes.INTEGER, allowNull: false },
  text:         { type: DataTypes.TEXT, allowNull: true },
  photo:        { type: DataTypes.TEXT('long'), allowNull: true },
  likes:        { type: DataTypes.INTEGER, defaultValue: 0 },
  liked_by:     { type: DataTypes.JSON, defaultValue: [] }
}, { tableName: 'posts' });

Post.associate = (models) => {
  Post.belongsTo(models.User, { foreignKey: 'user_id' });
};

module.exports = Post;