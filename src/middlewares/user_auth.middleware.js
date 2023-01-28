const jwt = require('jsonwebtoken');
const log = require('fancy-log');
const User = require('../models/user.model');
const errorMsgSender = require('../utils/error_msg_sender');

const userAuthentication = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    errorMsgSender(res, 401, 'user not authorized');
  }

  const token = authorization.split(' ')[1];
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = User.findByPk(id);
    if (!user) {
      return errorMsgSender(res, 401, 'user not authorized');
    }
    res.locals.userId = id;
    next();
  } catch (error) {
    log.error(error);
    if (error instanceof jwt.TokenExpiredError) {
      errorMsgSender(res, 401, 'token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorMsgSender(res, 401, 'user not authorized');
    } else {
      res.sendStatus(500);
    }
  }
};

module.exports = userAuthentication;
