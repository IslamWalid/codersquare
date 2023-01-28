const log = require('fancy-log');
const crypto = require('crypto');
const { ForeignKeyConstraintError } = require('sequelize');
const errorMsgSender = require('../utils/error_msg_sender');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');

const createComment = async (req, res) => {
  const id = crypto.randomUUID();
  const { postId, body } = req.body;

  if (!postId || !body) {
    return errorMsgSender(res, 400, 'required fields are missing');
  }

  try {
    await Comment.create({ id, userId: res.locals.userId, postId, body });
    res.status(200).json({ id });
  } catch (error) {
    log.error(error);
    if (error instanceof ForeignKeyConstraintError) {
      errorMsgSender(res, 404, 'post not found');
    } else {
      res.sendStatus(500);
    }
  }
};

const getPostComments = async (req, res) => {
  const postId = req.params.postid;

  try {
    const comments = await Comment.findAll({
      attributes: { exclude: ['userId', 'postId'] },
      include: {
        model: User,
        as: 'user',
        attributes: ['username', 'firstName', 'lastName']
      },
      where: { postId }
    });
    res.status(200).json(comments);
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
};

const deleteComment = async (req, res) => {
  const id = req.params.id;

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
