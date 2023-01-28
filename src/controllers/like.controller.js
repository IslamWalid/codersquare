const log = require('fancy-log');
const errorMsgSender = require('../utils/error_msg_sender');
const { ForeignKeyConstraintError } = require('sequelize');
const Like = require('../models/like.model');

const createLike = async (req, res) => {
  const { userId, postId } = req.body;

  if (!userId || !postId) {
    return errorMsgSender(res, 400, 'required fields are missing');
  }

  try {
    await Like.create({ userId, postId });
    res.sendStatus(200);
  } catch (error) {
    log.error(error);
    if (error instanceof ForeignKeyConstraintError) {
      errorMsgSender(res, 400, 'userId or postId does not belong to existing user or post');
    } else {
      res.sendStatus(500);
    }
  }
};

const getPostLikes = async (req, res) => {
  const postId = req.params.id;

  try {
    const likes = await Like.findAll({ where: { postId } });
    res.status(200).json(likes);
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
};

const deleteLike = async (req, res) => {
  const { userId, postId } = req.body;

  try {
    await Like.destroy({ where: { userId, postId } });
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
