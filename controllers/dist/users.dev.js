"use strict";

var User = require('../models/user');

module.exports.renderRegisterForm = function (req, res) {
  res.render('users/register');
};

module.exports.registerUser = function _callee(req, res, next) {
  var _req$body, username, email, password, user, validUser;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, username = _req$body.username, email = _req$body.email, password = _req$body.password;
          user = new User({
            username: username,
            email: email
          });
          _context.next = 5;
          return regeneratorRuntime.awrap(User.register(user, password));

        case 5:
          validUser = _context.sent;

          if (validUser) {
            req.login(validUser, function (err) {
              if (err) {
                req.flash('error', "something went wrong");
                return next(err);
              }

              req.flash('success', "User Created successfully");
              res.redirect('/campgrounds');
            });
          }

          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          req.flash('error', _context.t0.message);
          res.redirect('/register');

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

module.exports.renderLoginForm = function (req, res) {
  res.render('users/login');
};

module.exports.loginUser = function _callee2(req, res) {
  var redirectUrl;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          req.flash('success', "welcome back");
          redirectUrl = req.session.returnTo || '/campgrounds';
          delete req.session.returnTo;
          res.redirect(redirectUrl);

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.logOutUser = function (req, res) {
  req.logout();
  req.flash('success', "Successfully LoggedOut");
  res.redirect('/campgrounds');
};