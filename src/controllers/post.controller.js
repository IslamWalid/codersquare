const log = require('fancy-log');
const crypto = require('crypto');
const errorMsgSender = require('../utils/error_msg_sender');
const { ForeignKeyConstraintError } = require('sequelize');
const Post = require('../models/post.model');

const createPost = async (req, res) => {
  const id = crypto.randomUUID();
  const { userId, title, body } = req.body;

  if (!userId || !title || !body) {
    return errorMsgSender(res, 400, 'required fields are missing');
  }

  try {
    await Post.create({ id, userId, title, body });
    res.status(200).json({ id });
  } catch (error) {
    log.error(error);
    if (error instanceof ForeignKeyConstraintError) {
      errorMsgSender(res, 400, 'userId does not belong to existing user');
    } else {
      res.sendStatus(500);
    }
  }
};

const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await Post.findByPk(id);
    if (post) {
      res.status(200).json(post);
    } else {
      errorMsgSender(res, 404, 'post not found');
    }
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
};

const getAllPosts = async (req, res) => {
  try {
    res.status(200).json(await Post.findAll());
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
};

const deletePost = async (req, res) => {
  const id = req.params.id;

  try {
    await Post.destroy({ where: { id } });
    res.sendStatus(200);
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
};

module.exports = {
  createPost,
  getPost,
  getAllPosts,
  deletePost
};
