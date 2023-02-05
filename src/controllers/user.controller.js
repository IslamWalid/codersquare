const crypto = require('crypto');
const bcrypt = require('bcrypt');
const log = require('fancy-log');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const errorMsgSender = require('../utils/error_msg_sender');
const { UniqueConstraintError, Op } = require('sequelize');
const User = require('../models/user.model');

const signup = async (req, res) => {
  const id = crypto.randomUUID();
  const { email, username, firstName, lastName, password } = req.body;

  if (!email || !username || !firstName || !lastName || !password) {
    return errorMsgSender(res, 400, 'required fields are missing');
  }

  if (!validator.isEmail(email)) {
    return errorMsgSender(res, 400, 'invalid email');
  }
  if (!validator.isStrongPassword(password)) {
    return errorMsgSender(res, 400, 'weak password');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  try {
    await User.create({ id, email, username, firstName, lastName, password: hash });
    res.sendStatus(200);
  } catch (error) {
    log.error(error);
    if (error instanceof UniqueConstraintError) {
      const [alreadyExistingField] = error.fields;
      errorMsgSender(res, 409, `${alreadyExistingField} already exists`);
    } else {
      res.sendStatus(500);
    }
  }
};

const login = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return errorMsgSender(res, 400, 'required fields are missing');
  }

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: emailOrUsername },
          { email: emailOrUsername }
        ]
      }
    });

    if (!user) {
      return errorMsgSender(res, 404, 'wrong credentials');
    }

    if (!await bcrypt.compare(password, user.password)) {
      return errorMsgSender(res, 404, 'wrong password');
    }
    res.status(200).json({ token: genJwt(user.id) });
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
};

const genJwt = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = {
  signup,
  login
};
