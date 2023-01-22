const crypto = require('crypto');
const { ForeignKeyConstraintError } = require('sequelize');
const { Post } = require('../models');

const createPost = async (req, res) => {
  const id = crypto.randomUUID();
  const { userId, title, body } = req.body;

  try {
    await Post.create({
      id,
      userId,
      title,
      body
    });
    res.status(200).json({ id });
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      res.status(400).json({ msg: 'userId does not exist' });
    } else {
      res.status(500).end();
    }
  }
};

const getPost = async (req, res) => {
  const id = req.param('id');
  try {
    const post = await Post.findByPk(id);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ msg: 'post not found' });
    }
  } catch (error) {
    res.status(500).end();
  }
};

const getAllPosts = async (req, res) => {
  try {
    res.status(200).json(await Post.findAll());
  } catch (error) {
    res.status(500).end();
  }
};

const deletePost = async (req, res) => {
  const id = req.param('id');
  try {
    await Post.destroy({
      where: {
        id
      }
    });
    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
};

module.exports = {
  createPost,
  getPost,
  getAllPosts,
  deletePost
};
