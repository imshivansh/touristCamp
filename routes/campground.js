const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/camp')
const {authenticatelogin,isAuthor,validateSchema} = require('../middleware')
const User = require('../models/user')
const campgrounds = require('../controllers/campground')
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
   .get(catchAsync(campgrounds.showCampgroundList))
   .post(authenticatelogin, upload.array('image'),validateSchema,catchAsync(campgrounds.createNewCampground))
 
   
//    .post(upload.array('image'),(req,res)=>{
//        console.log(req.body)
//        console.log(req.files)
//        res.send('it worked')

//     })

router.get('/new',authenticatelogin,(campgrounds.renderNewCampForm))

router.route('/:id')
.get(catchAsync(campgrounds.showCampground))
.put(authenticatelogin,isAuthor,upload.array('image'),validateSchema,catchAsync(campgrounds.modifyCampground))
.delete(isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',authenticatelogin,isAuthor,catchAsync(campgrounds.campgroundEditForm))

module.exports = router
