const Sequelize = require('sequelize');
const crypto = require('crypto');
const moments = require('moment-timezone');
const seq = require('../../config/sequelize').sequelize;


const refreshToken = seq.define('refreshToken', {
  token: { type: Sequelize.STRING, allowNull: false, required: true },
  expires: { type: Sequelize.DATE, required: true },
});


refreshToken.generate = function (user) {
  const userId = user.id;
  const userEmail = user.email;
  const token = `${userId}.${crypto.randomBytes(40).toString('hex')}`;
  const expires = moments().add(30, 'days').toDate();
  const tokenObject = new refreshToken({
    token, expires, user_id: userId,
  });
  tokenObject.save();
  return tokenObject;
};

refreshToken.generateAdmin = function (user) {
  const userId = user.id;
  const userEmail = user.email;
  const token = `Admin.${userId}.${crypto.randomBytes(40).toString('hex')}`;
  const expires = moments().add(30, 'days').toDate();
  const tokenObject = new refreshToken({
    token, expires, user_id: userId,
  });
  tokenObject.save();
  return tokenObject;
};


module.exports = refreshToken;
