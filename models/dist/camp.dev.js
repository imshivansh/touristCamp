"use strict";

var mongoose = require('mongoose');

var Review = require('./review');

var User = require('./user');

var Schema = mongoose.Schema;
var imageSchema = new Schema({
  url: String,
  filename: String
});
imageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});
var opts = {
  toJSON: {
    virtuals: true
  }
};
var CampgroundSchema = new Schema({
  title: String,
  images: [imageSchema],
  geometry: {
    type: {
      type: String,
      "enum": ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  location: String,
  description: String,
  price: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review',
    strictPopulate: false
  }]
}, opts);
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
  return "\n    <strong><a href=\"/campgrounds/".concat(this._id, "\">").concat(this.title, "</a><strong>\n    <p>").concat(this.description.substring(0, 20), "...</p>");
});
CampgroundSchema.post('findOneAndDelete', function _callee(doc) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!doc) {
            _context.next = 3;
            break;
          }

          _context.next = 3;
          return regeneratorRuntime.awrap(Review.deleteMany({
            _id: {
              $in: doc.reviews
            }
          }));

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
});
var Campground = new mongoose.model("Campground", CampgroundSchema);
module.exports = Campground;