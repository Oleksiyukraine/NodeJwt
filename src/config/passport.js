const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { jwtSecret } = require('./vars');
const User = require('../api/models/user.model');

const expires = (Date.now() / 1000) + 60 * 30;
const nbf = Date.now() / 1000;

const jwtOptions = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  nbf: nbf,
  exp: expires,
};

const jwt = async (payload, done) => {
  try {
    const user = await User.findByPk(payload.sub);
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

exports.jwt = new JwtStrategy(jwtOptions, jwt);
