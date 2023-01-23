const log = require('fancy-log');

const errorHandler = (error, req, res, next) => {
  log.error(error);
  res.status(500).end();
};

module.exports = errorHandler;
