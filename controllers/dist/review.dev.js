"use strict";

var Campground = require('../models/camp');

var Review = require('../models/review');

var User = require('../models/user');

module.exports.createReview = function _callee(req, res) {
  var camp, review;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Campground.findById(req.params.id));

        case 2:
          camp = _context.sent;
          review = new Review(req.body.review);
          review.author = req.user._id;
          camp.reviews.push(review);
          _context.next = 8;
          return regeneratorRuntime.awrap(review.save());

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(camp.save());

        case 10:
          req.flash('success', "Created A new Review");
          res.redirect("/campgrounds/".concat(camp._id));

        case 12:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.deleteReview = function _callee2(req, res) {
  var _req$params, id, reviewId;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$params = req.params, id = _req$params.id, reviewId = _req$params.reviewId;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Campground.findByIdAndUpdate(id, {
            $pull: {
              reviews: reviewId
            }
          }));

        case 3:
          _context2.next = 5;
          return regeneratorRuntime.awrap(Review.findByIdAndDelete(reviewId));

        case 5:
          req.flash('success', "Deleted the review");
          res.redirect("/campgrounds/".concat(id));

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
};