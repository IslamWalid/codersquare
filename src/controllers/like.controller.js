const log = require('fancy-log');
const errorMsgSender = require('../utils/error_msg_sender');
const { ForeignKeyConstraintError, UniqueConstraintError } = require('sequelize');
const Like = require('../models/like.model');

const createLike = async (req, res) => {
  const { postId } = req.body;

  if (!postId) {
    return errorMsgSender(res, 400, 'required fields are missing');
  }

  try {
    await Like.create({ userId: res.locals.userId, postId });
    res.sendStatus(200);
  } catch (error) {
    log.error(error);
    if (error instanceof ForeignKeyConstraintError) {
      errorMsgSender(res, 404, 'post not found');
    } else if (error instanceof UniqueConstraintError) {
      errorMsgSender(res, 409, 'like already exists');
    } else {
      res.sendStatus(500);
    }
  }
};

const getPostLikes = async (req, res) => {
  const userId = res.locals.userId;
  const postId = req.params.postid;

  try {
    const count = await Like.count({ where: { postId } });
    const isLiked = await Like.findOne({ where: { userId, postId } }) !== null;
    res.status(200).json({ count, isLiked });
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
};

const deleteLike = async (req, res) => {
  const postId = req.params.postid;

  try {
    await Like.destroy({ where: { userId: res.locals.userId, postId } });
    res.sendStatus(200);
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
};

module.exports = {
  createLike,
  getPostLikes,
  deleteLike
};
