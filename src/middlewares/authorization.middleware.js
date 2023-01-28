const log = require('fancy-log');
const Like = require('../models/like.model');
const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const errorMsgSender = require('../utils/error_msg_sender');

const deleteLikeAuth = async (req, res, next) => {
  const postId = req.params.postid;
  const userId = res.locals.userId;

  try {
    const like = await Like.findOne({ where: { userId, postId } });
    if (!like) {
      return errorMsgSender(res, 401, 'user not authorized');
    }
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }

  next();
};

const deleteCommentAuth = async (req, res, next) => {
  const id = req.params.id;
  const userId = res.locals.userId;

  try {
    const comment = await Comment.findOne({ where: { id, userId } });
    if (!comment) {
      return errorMsgSender(res, 401, 'user not authorized');
    }
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }

  next();
};

const deletePostAuth = async (req, res, next) => {
  const id = req.params.id;
  const userId = res.locals.userId;

  try {
    const post = await Post.findOne({ where: { id, userId } });
    if (!post) {
      return errorMsgSender(res, 401, 'user not authorized');
    }
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }

  next();
};

module.exports = {
  deleteLikeAuth,
  deleteCommentAuth,
  deletePostAuth
};
