const express = require('express');
const { createPost, deletePost, getPost, getAllPosts } = require('../controllers/post.controller');
const { deletePostAuth } = require('../middlewares/authorization.middleware');

const router = express.Router();

router.post('/', createPost);
router.get('/:id', getPost);
router.get('/', getAllPosts);
router.delete('/:id', deletePostAuth, deletePost);

module.exports = router;
