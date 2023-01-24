const crypto = require('crypto');
const log = require('fancy-log');
const { UniqueConstraintError } = require('sequelize');
const { User } = require('../models');

const createUser = async (req, res) => {
  const id = crypto.randomUUID();
  const { email, username, firstName, lastName, password } = req.body;

  if (!id || !email || !username || !firstName || !lastName || !password) {
    return res.status(400).json({ msg: 'required fields are missing' });
  }

  try {
    await User.create({ id, email, username, firstName, lastName, password });
    res.status(200).json({ id });
  } catch (error) {
    log.error(error);
    if (error instanceof UniqueConstraintError) {
      res.status(400).json({ err: 'email already exists' });
    } else {
      res.sendStatus(500);
    }
  }
};

module.exports = {
  createUser
};
