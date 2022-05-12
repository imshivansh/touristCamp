"use strict";

module.exports.authenticatelogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', "Must be Logged in First");
    return res.redirect('/login');
  }

  next();
};