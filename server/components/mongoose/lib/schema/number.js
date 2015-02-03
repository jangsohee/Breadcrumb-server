/*!
 * Module requirements.
 */

var mongoose = require('mongoose'),
    SchemaNumber = mongoose.SchemaTypes.Number,
    SchemaType = require('../schematype'),
    CastError = SchemaType.CastError,
    Document;

/**
 * Casts to number
 *
 * @param {Object} value value to cast
 * @param {Document} doc document that triggers the casting
 * @param {Boolean} init
 * @api private
 */

SchemaNumber.prototype.cast = function (value, doc, init) {
    if (SchemaType._isRef(this, value, doc, init)) {
        // wait! we may need to cast this to a document

        if (null == value) {
            return value;
        }

        // lazy load
        Document || (Document = require('./../document'));

        if (value instanceof Document) {
            value.$__.wasPopulated = true;
            return value;
        }

        // setting a populated path
        if ('number' == typeof value) {
            return value;
        } else if (Buffer.isBuffer(value) || 'object' !== typeof value) {
            throw new CastError('number', value, this.path);
        }

        // Handle the case where user directly sets a populated
        // path to a plain object; cast to the Model used in
        // the population query.
        var path = doc.$__fullPath(this.path);
        var owner = doc.ownerDocument ? doc.ownerDocument() : doc;
        var pop = owner.populated(path, true);
        var ret = new pop.options.model(value);
        ret.$__.wasPopulated = true;
        return ret;
    }

    var val = value && value._id
        ? value._id // documents
        : value;

    if (!isNaN(val)){
        if (null === val) return val;
        if ('' === val) return null;
        if ('string' == typeof val) val = Number(val);
        if (val instanceof Number) return val
        if ('number' == typeof val) return val;
        if (val.toString && !Array.isArray(val) &&
            val.toString() == Number(val)) {
            return new Number(val)
        }
    }

    throw new CastError('number', value, this.path);
};

/*!
 * Module exports.
 */

module.exports = SchemaNumber;
