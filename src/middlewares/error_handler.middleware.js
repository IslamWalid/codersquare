const log = require('fancy-log');

const errorHandler = (error, req, res, next) => {
  log.error(error);
  res.sendStatus(500);
};

module.exports = errorHandler;
