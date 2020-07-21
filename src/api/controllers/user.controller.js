const httpStatus = require('http-status');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {omit} = require('lodash');
const User = require('../models/user.model');
const {handler: errorHandler} = require('../middlewares/error');
const axios = require('axios');


exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

exports.loggedIn = async (req, res, next) => {
  try {
    let user = req.user.transform();
    res.json(user);
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const user = await User.get(req.body.id);
    //if user edit own number ser validate to false
    if (user.phone[0].fullPhoneNumber !== req.body.phone[0].fullPhoneNumber) {
      req.body.phone[0].validate = false;
    }
    await user.update(req.body);
    res.status(httpStatus.OK);
    res.json(user.transform());
  } catch (error) {
    next(error)
  }
};

exports.list = async (req, res, next) => {
  try {
    const users = await User.clientList();
    const transformedUsers = users.map(user => user.transform());
    res.json(transformedUsers);
  } catch (error) {
    next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    User.findByPk(req.params.userId, {include: 'orders'}).then(user => {
      user.orders = user.orders.filter(order => order.dataValues.data !== false);
      const transformedUser = user.transform();
      res.status(httpStatus.OK);
      res.json(transformedUser);
    }).catch(error => {
      throw error
    })

  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    // make remove method
  } catch (e) {
    next(e);
  }
};
