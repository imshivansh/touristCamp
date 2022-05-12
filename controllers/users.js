const User = require('../models/user')

module.exports.renderRegisterForm = (req,res)=>{
    res.render('users/register')
}

module.exports.registerUser = async(req,res,next)=>{
    try{
        const{username,email,password}= req.body;
        const user = new User({username,email});
        const validUser = await User.register(user,password);
        if(validUser){
            req.login(validUser,function(err){
                if(err){
                    req.flash('error',"something went wrong")
                    return next(err)
                }
                req.flash('success',"User Created successfully");
                res.redirect('/campgrounds')
            })

        }
        

    }catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login')
}

module.exports.loginUser = async(req,res)=>{
    req.flash('success',"welcome back")
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}
module.exports.logOutUser =(req,res)=>{
    req.logout();
    req.flash('success',"Successfully LoggedOut")
    res.redirect('/campgrounds')
}