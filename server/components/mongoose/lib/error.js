'use strict';

/*!
 * Module dependencies.
 */
var MongooseError = require('mongoose').Error;

/*!
 * Module exports.
 */
module.exports = MongooseError;

/*!
 * Expose subclasses
 */
MongooseError.CastError = require('./error/cast');
MongooseError.ValidatorError = require('./error/validator');