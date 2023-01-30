const log = require('fancy-log');
const crypto = require('crypto');
const errorMsgSender = require('../utils/error_msg_sender');
const User = require('../models/user.model');
const Post = require('../models/post.model');

const createPost = async (req, res) => {
  const id = crypto.randomUUID();
  const { title, body } = req.body;

  if (!title || !body) {
    return errorMsgSender(res, 400, 'required fields are missing');
  }

  try {
    await Post.create({ id, userId: res.locals.userId, title, body });
    res.status(200).json({ id });
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
};

const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await Post.findByPk(id, {
      attributes: { exclude: ['id', 'userId'] },
      include: {
        model: User,
        as: 'postAuthor',
        attributes: ['username', 'firstName', 'lastName']
      }
    });
    if (!post) {
      return errorMsgSender(res, 404, 'post not found');
    }
    res.status(200).json(post);
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        as: 'postAuthor',
        attributes: ['username', 'firstName', 'lastName']
      }
    });
    res.status(200).json({ posts });
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
