"use strict";

var express = require('express');

var router = express.Router();

var User = require('../models/user');

var passport = require('passport');

var catchAsync = require('../utils/catchAsync');

var users = require('../controllers/users');

router.route('/register').get(users.renderRegisterForm).post(catchAsync(users.registerUser));
router.route('/login').get(users.renderLoginForm).post(passport.authenticate('local', {
  failureFlash: true,
  failureRedirect: '/login'
}), users.loginUser);
router.get('/logout', users.logOutUser);
module.exports = router;