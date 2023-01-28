const express = require('express');
const { createLike, getPostLikes, deleteLike } = require('../controllers/like.controller');
const { deleteLikeAuth } = require('../middlewares/authorization.middleware');

const router = express.Router();

router.post('/', createLike);
router.get('/:postid', getPostLikes);
router.delete('/:postid', deleteLikeAuth, deleteLike);

module.exports = router;
