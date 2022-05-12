"use strict";

var mongoose = require('mongoose');

var Campground = require('./camp');

var Schema = mongoose.Schema;

var User = require('./user');

var reviewSchema = Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  rating: {
    type: Number,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});
var Review = mongoose.model('Review', reviewSchema);
module.exports = Review;