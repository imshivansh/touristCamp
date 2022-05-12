const express = require('express')
const router = express.Router({mergeParams:true})
const{validateReview,isReviewAuthor, authenticatelogin} = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const expressError = require('../utils/expressError')
const {reviewSchema} = require('../schemas.js')
const Campground = require('../models/camp')
const Review = require('../models/review')
const reviews = require('../controllers/review')


router.post('/',authenticatelogin,validateReview,catchAsync(reviews.createReview))

router.delete('/:reviewId',authenticatelogin,isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;