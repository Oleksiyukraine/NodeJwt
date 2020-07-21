const httpStatus = require('http-status');
const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const moment = require('moment-timezone');
const momentM = require('moment');
const crypto = require('crypto');
const {jwtExpirationInterval} = require('../../config/vars');

const confToken = crypto.randomBytes(64).toString('hex');

function generateTokenResponse(user, accessToken) {
  const tokenType = 'Bearer';
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
  return {
    tokenType, accessToken, refreshToken, expiresIn,
  };
}

exports.register = async (req, res, next) => {
   try {
     const isEmail = await User.findAndCountAll({ where: { email: req.body.email } });
     if (isEmail.count === 0) {
       const user = await User.create({
         name: req.body.name,
         email: req.body.email,
         phone: req.body.phone,
         password: req.body.password,
         role: 'user',
         conf_token: confToken,
       });
       const userTransformed = user.transform();
       const token = generateTokenResponse(user, user.token());

       res.status(httpStatus.CREATED);
       return res.json({token, user: userTransformed });
     } else {
       const error = await User.checkDuplicateEmail(isEmail);
       res.status(httpStatus.IM_USED);
       res.json(error);
     }
  } catch (error) {
    return next();
  }
};

exports.login = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    user.lastlogin = momentM().format();
    user.save();
    res.status(httpStatus.CREATED);
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};
