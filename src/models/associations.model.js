const User = require('./user.model');
const Post = require('./post.model');
const Like = require('./like.model');
const Comment = require('./comment.model');

const userAssociations = () => {
  User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
  User.hasMany(Like, { foreignKey: 'userId', onDelete: 'CASCADE' });
  User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
};

const postAssociations = () => {
  Post.hasMany(Like, { foreignKey: 'postId', onDelete: 'CASCADE' });
  Post.hasMany(Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });
  Post.belongsTo(User, { as: 'postAuthor', foreignKey: 'userId', onDelete: 'CASCADE' });
};

const likeAssociations = () => {
  Like.belongsTo(User, { as: 'user', foreignKey: 'userId', onDelete: 'CASCADE' });
  Like.belongsTo(Post, { foreignKey: 'postId', onDelete: 'CASCADE' });
};

const commentAssociations = () => {
  Comment.belongsTo(User, { as: 'commentAuthor', foreignKey: 'userId', onDelete: 'CASCADE' });
  Comment.belongsTo(Post, { foreignKey: 'postId', onDelete: 'CASCADE' });
};

const setAssociations = () => {
  userAssociations();
  postAssociations();
  likeAssociations();
  commentAssociations();
};

module.exports = setAssociations;
