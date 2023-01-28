const log = require('fancy-log');
const crypto = require('crypto');
const { ForeignKeyConstraintError } = require('sequelize');
const errorMsgSender = require('../utils/error_msg_sender');
const Comment = require('../models/comment.model');

const createComment = async (req, res) => {
  const id = crypto.randomUUID();
  const { userId, postId, body } = req.body;

  if (!userId || !postId || !body) {
    return errorMsgSender(res, 400, 'required fields are missing');
  }

  try {
    await Comment.create({ id, userId, postId, body });
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

const getPostComments = async (req, res) => {
  const postId = req.params.id;

  try {
    const comments = await Comment.findAll({ where: { postId } });
    res.status(200).json(comments);
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return errorMsgSender(res, 400, 'required fields are missing');
  }

  try {
    await Comment.destroy({ where: { id } });
    res.sendStatus(200);
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
};

module.exports = {
  createComment,
  getPostComments,
  deleteComment
};
