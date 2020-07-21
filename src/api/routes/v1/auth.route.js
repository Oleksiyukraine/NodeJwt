const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/auth.controller');
const oAuthLogin = require('../../middlewares/auth').oAuth;
const {
  login,
  register,
} = require('../../validations/auth.validation');

const router = express.Router();

router.route('/register')
  .post(validate(register), controller.register);

router.route('/login')
  .post(validate(login), controller.login);

module.exports = router;
