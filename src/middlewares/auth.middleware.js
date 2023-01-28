const jwt = require('jsonwebtoken');
const { User } = require('../models');
const errorMsgSender = require('../utils/error_msg_sender');

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    errorMsgSender(res, 401, 'user not authorized');
  }

  const token = authorization.split(' ')[1];
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = User.findByPk(userId);
    if (!user) {
      return errorMsgSender(res, 401, 'user not authorized');
    }
    res.locals.userId = userId;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      errorMsgSender(res, 401, 'token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorMsgSender(res, 401, 'user not authorized');
    } else {
      res.sendStatus(500);
    }
  }
};

module.exports = authMiddleware;
