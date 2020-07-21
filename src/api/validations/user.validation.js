const Joi = require('joi');

module.exports = {
  validateemail: {
    body: {
      email: Joi.string().required(),
    }
  },
  validatephone: {
    body: {
      phone: Joi.string().min(11).max(13).required(),
    }
  },
  pay: {
    body: {
      data: {
        comments: Joi.string().required(),
        price: Joi.required(),
      }
    }
  },
  updateUser: {
    body: {
      id: Joi.number().min(1).max(999999999).required(),
      name: [Joi.string().optional(), Joi.allow(null)],
      role: [Joi.string().optional(), Joi.allow(null)],
      email: Joi.string().email().required(),
      password: Joi.string().optional().max(128),
    },
  },
};
