const { ForeignKeyConstraintError } = require('sequelize');
const { Comment } = require('../models');

const createComment = async (req, res) => {
  const { userId, postId, body } = req.body;

  if (!userId || !postId || !body) {
    return res.status(400).json({ msg: 'required fields are missing' });
  }

  try {
    await Comment.create({ userId, postId, body });
    res.status(200).end();
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      res.status(400).json({ msg: 'userId or postId does not belong to existing user or post' });
    } else {
      res.status(500).end();
    }
  }
};

const getPostComments = async (req, res) => {
  const postId = req.params.id;

  try {
    const comments = await Comment.findAll({ where: { postId } });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).end();
  }
};

const deleteComment = async (req, res) => {
  const { userId, postId } = req.body;

  try {
    await Comment.destroy({ where: { userId, postId } });
    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
};

module.exports = {
  createComment,
  getPostComments,
  deleteComment
};
