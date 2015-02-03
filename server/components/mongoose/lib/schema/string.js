
/*!
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    SchemaString = mongoose.SchemaTypes.String,
    SchemaType = require('../schematype'),
    CastError = SchemaType.CastError,
    Document;

/**
 * Casts to String
 *
 * @api private
 */

SchemaString.prototype.cast = function (value, doc, init) {
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
        if ('string' == typeof value) {
            return value;
        } else if (Buffer.isBuffer(value) || 'object' !== typeof value) {
            throw new CastError('string', value, this.path);
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

    if (value === null) {
        return value;
    }

    if ('undefined' !== typeof value) {
        // handle documents being passed
        if (value._id && 'string' == typeof value._id) {
            return value._id;
        }
        if (value.toString) {
            return value.toString();
        }
    }


    throw new CastError('string', value, this.path);
};

/*!
 * Module exports.
 */

module.exports = SchemaString;
