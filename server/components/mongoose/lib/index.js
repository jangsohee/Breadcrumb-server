'use strict';

var Mongoose = require('mongoose');

Mongoose.Schema = require('./schema');
Mongoose.SchemaType = require('./schematype');
Mongoose.Document = require('./document');
Mongoose.Error = require('./error');

module.exports = Mongoose;