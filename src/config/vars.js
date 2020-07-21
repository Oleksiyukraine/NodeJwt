const path = require('path');

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  postgres: {
    host: process.env.PGRE_HOST,
    db: process.env.PGRE_DB,
    login: process.env.PGRE_LOGIN,
    password: process.env.PGRE_PASS,
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};
