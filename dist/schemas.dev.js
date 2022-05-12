"use strict";

var BaseJoi = require('joi');

var sanitizeHtml = require('sanitize-html');

var extension = function extension(joi) {
  return {
    type: 'string',
    base: joi.string(),
    messages: {
      'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
      escapeHTML: {
        validate: function validate(value, helpers) {
          var clean = sanitizeHtml(value, {
            allowedTags: [],
            allowedAttributes: {}
          });
          if (clean !== value) return helpers.error('string.escapeHTML', {
            value: value
          });
          return clean;
        }
      }
    }
  };
};

var Joi = BaseJoi.extend(extension);
module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(1),
    // img:Joi.string().required(),
    description: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML()
  }).required(),
  deleteImages: Joi.array()
});
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML()
  }).required()
});