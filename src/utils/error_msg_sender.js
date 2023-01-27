const errorMsgSender = (res, statusCode, msg) => {
  res.status(statusCode).json({ msg });
};

module.exports = errorMsgSender;
