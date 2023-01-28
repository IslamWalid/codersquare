const express = require('express');
const { createComment, getPostComments, deleteComment } = require('../controllers/comment.controller');
const { deleteCommentAuth } = require('../middlewares/authorization.middleware');

const router = express.Router();

router.post('/', createComment);
router.get('/:postid', getPostComments);
router.delete('/:id', deleteCommentAuth, deleteComment);

module.exports = router;
