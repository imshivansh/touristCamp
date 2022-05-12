"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Campground = require('../models/camp');

var _require = require('../models/user'),
    update = _require.update;

var _require2 = require('../cloudinary'),
    cloudinary = _require2.cloudinary;

var mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');

var mapBoxToken = process.env.MAPBOX_TOKEN;
var geoCoder = mbxGeoCoding({
  accessToken: mapBoxToken
});

module.exports.showCampgroundList = function _callee(req, res) {
  var campgrounds;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Campground.find({}));

        case 2:
          campgrounds = _context.sent;
          res.render('campgrounds/index', {
            campgrounds: campgrounds
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.renderNewCampForm = function (req, res) {
  res.render('campgrounds/new');
};

module.exports.createNewCampground = function _callee2(req, res, next) {
  var geoData, newCamp;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(geoCoder.forwardGeocode({
            query: req.body.campground.location,
            limit: 1
          }).send());

        case 2:
          geoData = _context2.sent;
          console.log(geoData.body.features[0].geometry);
          newCamp = new Campground(req.body.campground);
          newCamp.geometry = geoData.body.features[0].geometry;
          newCamp.images = req.files.map(function (f) {
            return {
              url: f.path,
              filename: f.filename
            };
          });
          newCamp.author = req.user._id;
          _context2.next = 10;
          return regeneratorRuntime.awrap(newCamp.save());

        case 10:
          console.log(newCamp);
          req.flash('success', 'Successfully Created A campground');
          res.redirect("campgrounds/".concat(newCamp._id));

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.showCampground = function _callee3(req, res) {
  var camp;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Campground.findById(req.params.id).populate({
            path: 'reviews',
            populate: {
              path: 'author'
            }
          }).populate('author'));

        case 2:
          camp = _context3.sent;
          console.log(camp);

          if (camp) {
            _context3.next = 7;
            break;
          }

          req.flash('error', 'Campground Not Found');
          return _context3.abrupt("return", res.redirect('/campgrounds'));

        case 7:
          res.render('campgrounds/show', {
            camp: camp
          });

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.campgroundEditForm = function _callee4(req, res, next) {
  var camp;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Campground.findById(req.params.id));

        case 2:
          camp = _context4.sent;

          if (camp) {
            _context4.next = 6;
            break;
          }

          req.flash('error', 'Campground Not Found to be edited');
          return _context4.abrupt("return", res.redirect('/campgrounds'));

        case 6:
          res.render('campgrounds/edit', {
            camp: camp
          });

        case 7:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports.modifyCampground = function _callee5(req, res) {
  var _updateCamp$images;

  var id, geoData, updateCamp, imgs, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, filename;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          id = req.params.id;
          _context5.next = 3;
          return regeneratorRuntime.awrap(geoCoder.forwardGeocode({
            query: req.body.campground.location,
            limit: 1
          }).send());

        case 3:
          geoData = _context5.sent;
          _context5.next = 6;
          return regeneratorRuntime.awrap(Campground.findByIdAndUpdate(id, _objectSpread({}, req.body.campground)));

        case 6:
          updateCamp = _context5.sent;
          updateCamp.geometry = geoData.body.features[0].geometry;
          imgs = req.files.map(function (f) {
            return {
              url: f.path,
              filename: f.filename
            };
          });

          (_updateCamp$images = updateCamp.images).push.apply(_updateCamp$images, _toConsumableArray(imgs));

          _context5.next = 12;
          return regeneratorRuntime.awrap(updateCamp.save());

        case 12:
          if (!req.body.deleteImages) {
            _context5.next = 34;
            break;
          }

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context5.prev = 16;

          for (_iterator = req.body.deleteImages[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            filename = _step.value;
            cloudinary.uploader.destroy(filename);
          }

          _context5.next = 24;
          break;

        case 20:
          _context5.prev = 20;
          _context5.t0 = _context5["catch"](16);
          _didIteratorError = true;
          _iteratorError = _context5.t0;

        case 24:
          _context5.prev = 24;
          _context5.prev = 25;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 27:
          _context5.prev = 27;

          if (!_didIteratorError) {
            _context5.next = 30;
            break;
          }

          throw _iteratorError;

        case 30:
          return _context5.finish(27);

        case 31:
          return _context5.finish(24);

        case 32:
          _context5.next = 34;
          return regeneratorRuntime.awrap(updateCamp.updateOne({
            $pull: {
              images: {
                filename: {
                  $in: req.body.deleteImages
                }
              }
            }
          }));

        case 34:
          console.log(updateCamp);
          req.flash('success', 'successfully edited the campground');
          res.redirect("/campgrounds/".concat(updateCamp._id));

        case 37:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[16, 20, 24, 32], [25,, 27, 31]]);
};

module.exports.deleteCampground = function _callee6(req, res) {
  var id, deletedCamp;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = req.params.id;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Campground.findByIdAndDelete(id).populate('reviews'));

        case 3:
          deletedCamp = _context6.sent;
          req.flash('success', 'Successfully Deleted The campground');
          res.redirect('/campgrounds');

        case 6:
        case "end":
          return _context6.stop();
      }
    }
  });
};