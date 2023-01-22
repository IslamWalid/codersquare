const express = require('express');
const { createLike, getPostLikes, deleteLike } = require('../controllers/like.controller');

const router = express.Router();

router.post('/', createLike);
router.get('/:id', getPostLikes);
router.delete('/', deleteLike);

module.exports = router;
