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

  User.initAssociations();
  Post.initAssociations();
  Like.initAssociations();
  Comment.initAssociations();

  await sequelize.sync();
};

module.exports = {
  connectDatabase,
  initDatabase
};
