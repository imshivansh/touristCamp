if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const session = require('express-session');
const flash = require('connect-flash');
const Campground = require('./models/camp')
const Review = require('./models/review')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const expressError = require('./utils/expressError')
const {campgroundSchema,reviewSchema} = require('./schemas.js')
const campgrounds = require('./routes/campground')
const reviews = require('./routes/review')
const userRoutes = require('./routes/users')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
const MongoDBStore = require('connect-mongo')



// const options = {
//     // autoIndex: false, // Don't build indexes
//     maxPoolSize: 1, // Maintain up to 10 socket connections
//     // serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
//     // socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
//     // family: 4 // Use IPv4, skip trying IPv6
//   };



const dbUrl  = process.env.databaseURL || 'mongodb://127.0.0.1:27017/yelp-camp';
;

mongoose.connect(dbUrl,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();



app.engine('ejs',ejsMate)

app.set("view engine","ejs")
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
  );

  const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
  const store = MongoDBStore.create({  
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});
store.on('error', function(e) {
  console.log(e);
});


const configSession = {
    store,
    name:"session",
    secret,
    resave:false,
    saveUninitialized :true,
    cookie:{
        expire: Date.now()+1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        httpOnly: true,
        // secure:true,
    }

}

app.use(session(configSession))
app.use(flash());
// app.use(helmet())


// app.use(helmet.crossOriginResourcePolicy({ policy: "same-site" }));

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    'https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.js',
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",


];

const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
    'https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.css'

];
;
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:",],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/doowbulgn/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
    console.log(req.query)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error');

    next()
})



app.use('/',userRoutes)
app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews/',reviews)

app.get('/', (req, res) => {
    res.render('./home')
});


app.all("*",(req,res,next)=>{
     next(new expressError("page not found",404))
 })

 app.use((err,req,res,next)=>{
     const{status =501} = err
     if(!err.message)err.message = "ohh no something went wrong"
     res.status(status).render('error',{err})
 })

 const port = process.env.PORT || 3000;

 
app.listen(port,function(){
    console.log(`Listening on Port ${port}`)
})