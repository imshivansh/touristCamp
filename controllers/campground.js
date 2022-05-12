const Campground = require('../models/camp')
const { update } = require('../models/user')
const {cloudinary} = require('../cloudinary')
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeoCoding({ accessToken: mapBoxToken });





 module.exports.showCampgroundList = async(req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}
module.exports.renderNewCampForm = (req,res)=>{
    res.render('campgrounds/new')
}
module.exports.createNewCampground = async(req,res,next)=>{
    // if(!req.body.campground) throw new expressError("invalid campground data",400)
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit:1,
    }).send()
    console.log(geoData.body.features[0].geometry)
    const newCamp = new Campground(req.body.campground);
    newCamp.geometry = geoData.body.features[0].geometry;
    newCamp.images = req.files.map(f =>({url:f.path,filename:f.filename}))
    newCamp.author = req.user._id;
    await newCamp.save()
    console.log(newCamp)
    req.flash('success','Successfully Created A campground')
    res.redirect(`campgrounds/${newCamp._id}`)
    
}

module.exports.showCampground = async(req,res,)=>{
    const camp = await Campground.findById(req.params.id).populate(
        {path:'reviews',populate:{
            path:'author'
        }}).populate('author');

        console.log(camp)
    if(!camp){
        req.flash('error','Campground Not Found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{camp})

}
module.exports.campgroundEditForm = async(req,res,next)=>{
    const camp = await Campground.findById(req.params.id)
    if(!camp){
        req.flash('error','Campground Not Found to be edited')
        return res.redirect('/campgrounds')
    }
           res.render('campgrounds/edit',{camp})
        
    }

module.exports.modifyCampground = async (req,res)=>{
    const {id} = req.params;
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit:1,
    }).send()
    // console.log(geoData.body.features[0].geometry)
    // const camp = await Campground.findById(id)
    // camp.geometry = geoData.body.features[0].geometry
    
    const updateCamp = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    updateCamp.geometry = geoData.body.features[0].geometry
    

    const imgs = req.files.map(f =>({url:f.path,filename:f.filename}))
    updateCamp.images.push(...imgs)
    await updateCamp.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            cloudinary.uploader.destroy(filename)
        }
       await updateCamp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    console.log(updateCamp)

    req.flash('success','successfully edited the campground');
    res.redirect(`/campgrounds/${updateCamp._id}`)
    }

 module.exports.deleteCampground = async(req,res)=>{
    const{id} = req.params
   
    const deletedCamp = await Campground.findByIdAndDelete(id).populate('reviews')
    req.flash('success','Successfully Deleted The campground')

    res.redirect('/campgrounds')
}