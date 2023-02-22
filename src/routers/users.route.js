const express = require('express');
const { signup, login, logout } = require('../controllers/user.controller');
const userAuthentication = require('../middlewares/user_auth.middleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', userAuthentication, logout);

module.exports = router;
