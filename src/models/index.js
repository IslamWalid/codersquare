const { Sequelize } = require('sequelize');
const User = require('./user.model');
const Post = require('./post.model');
const Like = require('./like.model');
const Comment = require('./comment.model');

const connectDatabase = (dbFile) => {
  return new Sequelize({
    dialect: 'sqlite',
    storage: dbFile,
    dialectOptions: {
      foreign_keys: 'ON'
    }
  });
};

const initDatabase = async (sequelize) => {
  User.init(sequelize);
  Post.init(sequelize);
  Like.init(sequelize);
  Comment.init(sequelize);

  User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Post.belongsTo(User, { as: 'user', foreignKey: 'userId', onDelete: 'CASCADE' });
  User.belongsToMany(Post, { through: Like, foreignKey: 'userId' });
  Post.belongsToMany(User, { through: Like, foreignKey: 'postId' });
  User.belongsToMany(Post, { through: { model: Comment, unique: false }, foreignKey: 'userId' });
  Post.belongsToMany(User, { through: { model: Comment, unique: false }, foreignKey: 'postId' });

  User.hasMany(Like, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Like.belongsTo(User, { as: 'user', foreignKey: 'userId', onDelete: 'CASCADE' });

  User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Comment.belongsTo(User, { as: 'user', foreignKey: 'userId', onDelete: 'CASCADE' });

  await sequelize.sync();
};

module.exports = {
  connectDatabase,
  initDatabase
};
