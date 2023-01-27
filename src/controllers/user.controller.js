const crypto = require('crypto');
const log = require('fancy-log');
const { UniqueConstraintError } = require('sequelize');
const errorMsgSender = require('../utils/error_msg_sender');
const { User } = require('../models');

const signup = async (req, res) => {
  const id = crypto.randomUUID();
  const { email, username, firstName, lastName, password } = req.body;

  if (!id || !email || !username || !firstName || !lastName || !password) {
    return errorMsgSender(res, 400, 'required fields are missing');
  }

  try {
    await User.create({ id, email, username, firstName, lastName, password });
    res.status(200).json({ id });
  } catch (error) {
    log.error(error);
    if (error instanceof UniqueConstraintError) {
      const [alreadyExist] = error.fields;
      if (alreadyExist) {
        res.status(400).json({ err: `${alreadyExist} already exists` });
      }
    } else {
      res.sendStatus(500);
    }
  }
};

module.exports = {
  signup
};
