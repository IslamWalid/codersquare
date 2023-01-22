const express = require('express');
const { createPost, deletePost, getPost, getAllPosts } = require('../controllers/post.controller');

const router = express.Router();

router.post('/', createPost);
router.get('/:id', getPost);
router.get('/', getAllPosts);
router.delete('/:id', deletePost);

module.exports = router;
