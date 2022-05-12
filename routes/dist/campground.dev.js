"use strict";

var express = require('express');

var router = express.Router();

var catchAsync = require('../utils/catchAsync');

var Campground = require('../models/camp');

var _require = require('../middleware'),
    authenticatelogin = _require.authenticatelogin,
    isAuthor = _require.isAuthor,
    validateSchema = _require.validateSchema;

var User = require('../models/user');

var campgrounds = require('../controllers/campground');

var multer = require('multer');

var _require2 = require('../cloudinary'),
    storage = _require2.storage;

var upload = multer({
  storage: storage
});
router.route('/').get(catchAsync(campgrounds.showCampgroundList)).post(authenticatelogin, upload.array('image'), validateSchema, catchAsync(campgrounds.createNewCampground)); //    .post(upload.array('image'),(req,res)=>{
//        console.log(req.body)
//        console.log(req.files)
//        res.send('it worked')
//     })

router.get('/new', authenticatelogin, campgrounds.renderNewCampForm);
router.route('/:id').get(catchAsync(campgrounds.showCampground)).put(authenticatelogin, isAuthor, upload.array('image'), validateSchema, catchAsync(campgrounds.modifyCampground))["delete"](isAuthor, catchAsync(campgrounds.deleteCampground));
router.get('/:id/edit', authenticatelogin, isAuthor, catchAsync(campgrounds.campgroundEditForm));
module.exports = router;