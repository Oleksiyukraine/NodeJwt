const express = require('express');
const controller = require('../../controllers/user.controller');
const { authorize, ADMIN, LOGGED_USER_USER } = require('../../middlewares/auth');
const router = express.Router();

router.param('userId', controller.load);

router.route('/')
  .get(authorize(ADMIN), controller.list);

router.route('/profile')
  .get(authorize(), controller.loggedIn);

router.route('/:userId')
  .get(controller.get)
  .patch(authorize(LOGGED_USER_USER), controller.update)

module.exports = router;
