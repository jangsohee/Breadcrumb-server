/*!
 * Module requirements.
 */

var mongoose = require('mongoose'),
    SchemaDate = mongoose.SchemaTypes.Date,
    SchemaType = require('../schematype'),
    CastError = SchemaType.CastError;

/**
 * Casts to date
 *
 * @param {Object} value to cast
 * @api private
 */

SchemaDate.prototype.cast = function (value) {
    if (value === null || value === '')
        return null;

    if (value instanceof Date)
        return value;

    var date;

    // support for timestamps
    if (value instanceof Number || 'number' == typeof value
        || String(value) == Number(value))
        date = new Date(Number(value));

    // support for date strings
    else if (value.toString)
        date = new Date(value.toString());

    if (date.toString() != 'Invalid Date')
        return date;

    throw new CastError('date', value, this.path);
};

/*!
 * Module exports.
 */

module.exports = SchemaDate;
