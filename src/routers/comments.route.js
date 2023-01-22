const express = require('express');
const { createComment, getPostComments, deleteComment } = require('../controllers/comment.controller');

const router = express.Router();

router.post('/', createComment);
router.get('/:id', getPostComments);
router.delete('/', deleteComment);

module.exports = router;
