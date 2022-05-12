"use strict";

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var express = require('express');

var path = require('path');

var mongoose = require('mongoose');

var methodOverride = require('method-override');

var session = require('express-session');

var flash = require('connect-flash');

var Campground = require('./models/camp');

var Review = require('./models/review');

var ejsMate = require('ejs-mate');

var catchAsync = require('./utils/catchAsync');

var expressError = require('./utils/expressError');

var _require = require('./schemas.js'),
    campgroundSchema = _require.campgroundSchema,
    reviewSchema = _require.reviewSchema;

var campgrounds = require('./routes/campground');

var reviews = require('./routes/review');

var userRoutes = require('./routes/users');

var passport = require('passport');

var LocalStrategy = require('passport-local');

var User = require('./models/user');

var helmet = require('helmet');

var mongoSanitize = require('express-mongo-sanitize');

var MongoDBStore = require('connect-mongo'); // const options = {
//     // autoIndex: false, // Don't build indexes
//     maxPoolSize: 1, // Maintain up to 10 socket connections
//     // serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
//     // socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
//     // family: 4 // Use IPv4, skip trying IPv6
//   };


var dbUrl = process.env.databaseURL || 'mongodb://localhost:27017/yelp-camp';
;
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});
var app = express();
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({
  extended: true
}));
app.use(methodOverride('_method'));
app.use(express["static"](path.join(__dirname, 'public')));
app.use(mongoSanitize({
  replaceWith: '_'
}));
var secret = process.env.SECRET || 'thisshouldbeabettersecret!';
var store = MongoDBStore.create({
  mongoUrl: dbUrl,
  secret: secret,
  touchAfter: 24 * 60 * 60
});
store.on('error', function (e) {
  console.log(e);
});
var configSession = {
  store: store,
  name: "session",
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true // secure:true,

  }
};
app.use(session(configSession));
app.use(flash()); // app.use(helmet())
// app.use(helmet.crossOriginResourcePolicy({ policy: "same-site" }));

var scriptSrcUrls = ["https://stackpath.bootstrapcdn.com/", "https://api.tiles.mapbox.com/", "https://api.mapbox.com/", 'https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.js', "https://kit.fontawesome.com/", "https://cdnjs.cloudflare.com/", "https://cdn.jsdelivr.net"];
var styleSrcUrls = ["https://kit-free.fontawesome.com", "https://stackpath.bootstrapcdn.com", "https://api.mapbox.com", "https://api.tiles.mapbox.com", "https://fonts.googleapis.com", "https://use.fontawesome.com", "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css", 'https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.css'];
;
var connectSrcUrls = ["https://api.mapbox.com/", "https://a.tiles.mapbox.com/", "https://b.tiles.mapbox.com/", "https://events.mapbox.com/"];
var fontSrcUrls = [];
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: [],
    connectSrc: ["'self'"].concat(connectSrcUrls),
    scriptSrc: ["'unsafe-inline'", "'self'"].concat(scriptSrcUrls),
    styleSrc: ["'self'", "'unsafe-inline'"].concat(styleSrcUrls),
    workerSrc: ["'self'", "blob:"],
    objectSrc: [],
    imgSrc: ["'self'", "blob:", "data:", "https://res.cloudinary.com/doowbulgn/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
    "https://images.unsplash.com/"],
    fontSrc: ["'self'"].concat(fontSrcUrls)
  }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next) {
  console.log(req.query);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});
app.use('/', userRoutes);
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews/', reviews);
app.get('/', function (req, res) {
  res.render('./home');
});
app.all("*", function (req, res, next) {
  next(new expressError("page not found", 404));
});
app.use(function (err, req, res, next) {
  var _err$status = err.status,
      status = _err$status === void 0 ? 501 : _err$status;
  if (!err.message) err.message = "ohh no something went wrong";
  res.status(status).render('error', {
    err: err
  });
});
var port = process.env.PORT || 3000;
app.listen(3000, function () {
  console.log("Listening on Port ".concat(port));
});