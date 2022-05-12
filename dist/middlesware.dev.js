"use strict";

var _require = require('./schemas.js'),
    campgroundSchema = _require.campgroundSchema,
    reviewSchema = _require.reviewSchema;

var expressError = require('./utils/expressError');

var Campground = require('./models/camp');

module.exports.authenticatelogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', "Must be Logged in First");
    return res.redirect('/login');
  }

  next();
};

module.exports.validateSchema = function (req, res, next) {
  var _campgroundSchema$val = campgroundSchema.validate(req.body),
      error = _campgroundSchema$val.error;

  if (error) {
    var msg = error.details.map(function (el) {
      return el.message;
    }).join(',');
    throw new expressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = function _callee(req, res, next) {
  var id, camps;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = req.params.id;
          _context.next = 3;
          return regeneratorRuntime.awrap(Campground.findById(id));

        case 3:
          camps = _context.sent;

          if (camps.author.equals(req.user._id)) {
            _context.next = 7;
            break;
          }

          req.flash('error', "you dont have permission to do that");
          return _context.abrupt("return", res.redirect("/campgrounds/".concat(camps._id)));

        case 7:
          next();

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
}; // for Reviews


module.exports.validateReview = function (req, res, next) {
  var _reviewSchema$validat = reviewSchema.validate(req.body),
      error = _reviewSchema$validat.error;

  if (error) {
    var msg = error.details.map(function (el) {
      return el.message;
    }).join(',');
    throw new expressError(msg, 400);
  } else {
    next();
  }
};