"use strict";

var express = require('express');

var router = express.Router({
  mergeParams: true
});

var _require = require('../middleware'),
    validateReview = _require.validateReview,
    isReviewAuthor = _require.isReviewAuthor,
    authenticatelogin = _require.authenticatelogin;

var catchAsync = require('../utils/catchAsync');

var expressError = require('../utils/expressError');

var _require2 = require('../schemas.js'),
    reviewSchema = _require2.reviewSchema;

var Campground = require('../models/camp');

var Review = require('../models/review');

var reviews = require('../controllers/review');

router.post('/', authenticatelogin, validateReview, catchAsync(reviews.createReview));
router["delete"]('/:reviewId', authenticatelogin, isReviewAuthor, catchAsync(reviews.deleteReview));
module.exports = router;