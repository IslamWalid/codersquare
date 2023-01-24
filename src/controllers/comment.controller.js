const log = require('fancy-log');
const { ForeignKeyConstraintError } = require('sequelize');
const { Comment } = require('../models');

const createComment = async (req, res) => {
  const { userId, postId, body } = req.body;

  if (!userId || !postId || !body) {
    return res.status(400).json({ msg: 'required fields are missing' });
  }

  try {
    await Comment.create({ userId, postId, body });
    res.sendStatus(200);
  } catch (error) {
    log.error(error);
    if (error instanceof ForeignKeyConstraintError) {
      res.status(400).json({ msg: 'userId or postId does not belong to existing user or post' });
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
  const { userId, postId } = req.body;

  try {
    await Comment.destroy({ where: { userId, postId } });
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
