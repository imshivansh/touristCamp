"use strict";

var mongoose = require('mongoose');

var Campground = require('../models/camp');

var _require = require('./seedhelpers'),
    descriptors = _require.descriptors,
    places = _require.places;

var cities = require('./cities'); // const MongoDBStore = require("connect-mongo")(session);


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});

var sample = function sample(array) {
  return array[Math.floor(Math.random() * array.length)];
};

var seedDB = function seedDB() {
  var i, random1000, camp;
  return regeneratorRuntime.async(function seedDB$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          i = 1;

        case 1:
          if (!(i < 200)) {
            _context.next = 9;
            break;
          }

          random1000 = Math.floor(Math.random() * 1000);
          camp = new Campground({
            author: "627cc2bdc1f4f4ffad19fe66",
            title: "".concat(cities[random1000].city, " ").concat(cities[random1000].state),
            location: "".concat(sample(descriptors), " ").concat(sample(places)),
            description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae voluptatibus praesentium eveniet nam ratione ex, consequuntur natus necessitatibus nobis? Eligendi adipisci minima quisquam ipsam dolore animi, ea laborum ipsa quae!",
            geometry: {
              "type": "Point",
              "coordinates": [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: [{
              url: "https://res.cloudinary.com/doowbulgn/image/upload/v1652252908/yelpCamp/f9yzg0nunknoatotmecx.jpg",
              filename: "yelpCamp/f9yzg0nunknoatotmecx.jpg"
            }, {
              url: "https://res.cloudinary.com/doowbulgn/image/upload/v1652252908/yelpCamp/vkaoa3feyolamyxiaf0k.jpg",
              filename: "yelpCamp/vkaoa3feyolamyxiaf0k.jpg"
            }]
          });
          _context.next = 6;
          return regeneratorRuntime.awrap(camp.save());

        case 6:
          i++;
          _context.next = 1;
          break;

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
};

seedDB().then(function () {
  mongoose.connection.close();
});