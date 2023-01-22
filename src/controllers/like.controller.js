const { ForeignKeyConstraintError } = require('sequelize');
const { Like } = require('../models');

const createLike = async (req, res) => {
  const { userId, postId } = req.body;

  if (!userId || !postId) {
    return res.status(400).json({ msg: 'required fields are missing' });
  }

  try {
    await Like.create({ userId, postId });
    res.status(200).end();
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      res.status(400).json({ msg: 'userId or postId does not belong to existing user or post' });
    } else {
      res.status(500).end();
    }
  }
};

const getPostLikes = async (req, res) => {
  const postId = req.params.id;

  try {
    const likes = await Like.findAll({ where: { postId } });
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).end();
  }
};

const deleteLike = async (req, res) => {
  const { userId, postId } = req.body;

  try {
    await Like.destroy({ where: { userId, postId } });
    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
};

module.exports = {
  createLike,
  getPostLikes,
  deleteLike
};
