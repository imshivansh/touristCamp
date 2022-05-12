const mongoose = require('mongoose');
const Campground = require('./camp')
const {Schema} = mongoose;
const User = require('./user')
const reviewSchema = Schema({
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    rating:{
        type:Number,
        required: true,
    },
    body:{
        type:String,
        required:true
    }


})

const Review = mongoose.model('Review',reviewSchema)

module.exports = Review;





