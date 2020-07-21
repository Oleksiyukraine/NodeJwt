const Joi = require('joi');

module.exports = {
  // POST /v1/auth/register
  register: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6).max(128),
      name: Joi.string().max(64).required(),
    },
  },

  // POST /v1/auth/login
  login: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required().max(128),
    },
  },

  changePassword: {
    body: {
      id: Joi.number().integer(16).max(16).required(),
      oldPassword: Joi.string().required().max(128),
      newPassword: Joi.string().required().max(128),
    },
  },

  update: {
    body: {
      id: Joi.number().integer(16).max(16).required(),
      name: [Joi.string().optional(), Joi.allow(null)],
      email: Joi.string().email().required(),
      password: Joi.string().required().max(128),
      phone:  Joi.string().regex(/^[0-9]{6,14}$/).required(),
    },
  },
  // post UpdateAdmin
  updateAdmin: {
    body: {
      id: Joi.number().integer(16).max(9999999).required(),
      name: [Joi.string().optional(), Joi.allow(null)],
      role: [Joi.string().optional(), Joi.allow(null)],
      email: Joi.string().email().required(),
      password: Joi.string().optional().max(128),
      phone:[Joi.string().regex(/^[0-9]{6,14}$/).required(), Joi.allow(null)],
    },
  },

  // POST /v1/auth/facebook
  // POST /v1/auth/google
  oAuth: {
    body: {
      access_token: Joi.string().required(),
    },
  },
  updateUserPass: {
    body: {
      id: Joi.number().integer(),
      oldpass: Joi.string().min(6).max(128),
      newpass: Joi.string().min(6).max(128),
      newpass2: Joi.string().min(6).max(128),
    },
  },

  // POST /v1/auth/refresh
  refresh: {
    body: {
      email: Joi.string().email().required(),
      refreshToken: Joi.string().required(),
    },
  },
};
