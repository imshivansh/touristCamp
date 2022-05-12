const {campgroundSchema,reviewSchema} = require('./schemas.js')
const expressError = require('./utils/expressError')
const Campground = require('./models/camp')
const Review = require('./models/review')




module.exports.authenticatelogin =function(req, res, next){
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error',"Must be Logged in First")
        return res.redirect('/login') }
    next()
}

module.exports.validateSchema = (req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new expressError(msg,400)

    }else{
        next()
    }
}

module.exports.isAuthor = async(req,res,next)=>{
    const{id} = req.params
    const camps = await Campground.findById(id)
    if(!camps.author.equals(req.user._id)){
        req.flash('error',"you dont have permission to do that")
         return res.redirect(`/campgrounds/${camps._id}`)
    }
    next();
}

module.exports.validateReview = (req,res,next)=>{
    const{error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new expressError(msg,400)
    }else{
        next()
    }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId} =req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)){
        req.flash("error","YOu don't have permission to do that");
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
