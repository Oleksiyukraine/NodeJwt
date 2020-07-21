const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const APIError = require('../utils/APIError');
const refreshToken = require('./refreshToken.model');
const sequelize = require('../../config/sequelize').sequelize;
const {env, jwtSecret, jwtExpirationInterval} = require('../../config/vars');

const roles = ['user', 'admin'];

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true
  },
  name: {
    type: Sequelize.STRING, allowNull: true, required: false
  },
  email: {
    type: Sequelize.STRING, allowNull: false, required: true, unique: 'idx_email',
  },
  emailValidate: {
    type: Sequelize.BOOLEAN, allowNull: true, required: true, defaultValue: false,
  },
  phone: {
    type: Sequelize.JSONB, allowNull: true, required: false, defaultValue: '+007',
  },
  lastLogin: {
    type: Sequelize.DATE, allowNull: false, required: true, defaultValue: Sequelize.NOW,
  },
  password: {
    type: Sequelize.STRING, allowNull: false, required: true
  },
  role: {
    type: Sequelize.STRING, allowNull: false, required: true
  },
});

User.roles = roles;

User.hasOne(refreshToken, { foreignKeyConstraint: true, foreignKey: 'user_id' });

User.prototype.transform = function () {
  const transformed = {};
  const fields = ['id', 'name', 'email', 'emailValidate', 'phone', 'lastLogin', 'role'];
  fields.forEach((field) => {
    transformed[field] = this[field];
  });
  return transformed;
};

User.prototype.token = function () {
  const playload = {
    exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
    iat: moment().unix(),
    sub: this.id,
  };
  return jwt.encode(playload, jwtSecret);
};

User.prototype.passwordMatches = async function (password) {
  return bcrypt.compare(password, this.password);
};


User.get = async function (id) {
  try {
    return await this.findByPk(id);
  } catch (error) {
    throw error;
  }
};

User.clientList = function () {
  return this.findAll({
    where: { role: "user" },
    include: { all: true }
  });
};

User.findAndGenerateToken = async function (options) {
  const {email, password, refreshObject} = options;
  if (!email) throw new APIError({message: 'An email is required to generate a token'});

  const user = await User.findOne({ where: {email} });
  const err = {
    status: httpStatus.UNAUTHORIZED,
    isPublic: true,
  };
  if (password) {
    if (user && await user.passwordMatches(password)) {
      return {user, accessToken: user.token()};
    }
    err.message = 'Incorrect email or password';
  } else if (refreshObject && refreshObject.userEmail === email) {
    return {user, accessToken: user.token()};
  } else {
    err.message = 'Incorrect email or refreshToken';
  }
  throw new APIError(err);
};

User.genHash = async function (pass) {
  const rounds = env === 'test' ? 1 : 10;
  return bcrypt.hashSync(pass, rounds);
};

User.checkDuplicateEmail = function (error) {
  return new APIError({
    message: 'Validation Error',
    errors: [{
      field: 'email',
      location: 'body',
      messages: 'email already exists',
    }],
    status: httpStatus.CONFLICT,
    isPublic: true,
    stack: error,
  });
};
module.exports = User;
