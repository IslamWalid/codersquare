const log = require('fancy-log');

const errorHandler = (error, req, res, next) => {
  log.error(error);
  res.sendStatus(error.status);
};

module.exports = errorHandler;
