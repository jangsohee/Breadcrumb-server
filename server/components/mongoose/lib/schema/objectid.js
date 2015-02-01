/*!
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId;
var SchemaType = require('../schematype'),
    CastError = SchemaType.CastError;
var oid = mongoose.Types.ObjectId,
    Document;

/**
 * Casts to ObjectId
 *
 * @param {Object} value
 * @param {Object} doc
 * @param {Boolean} init whether this is an initialization cast
 * @api private
 */
ObjectId.prototype.cast = function (value, doc, init) {
    if (SchemaType._isRef(this, value, doc, init)) {
        // wait! we may need to cast this to a document

        if (null == value) {
            return value;
        }

        // lazy load
        Document || (Document = mongoose.Document);

        if (value instanceof Document) {
            value.$__.wasPopulated = true;
            return value;
        }

        // setting a populated path
        if (value instanceof oid) {
            return value;
        } else if (Buffer.isBuffer(value)
            || '[object Object]' != Object.prototype.toString.call(value)) {
            throw new CastError('ObjectId', value, this.path);
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

    if (value === null) return value;

    if (value instanceof oid)
        return value;

    if (value._id && value._id instanceof oid)
        return value._id;

    if (value.toString) {
        try {
            return oid.createFromHexString(value.toString());
        } catch (err) {
            throw new CastError('ObjectId', value, this.path);
        }
    }

    throw new CastError('ObjectId', value, this.path);
};

/*!
 * Module exports.
 */

module.exports = ObjectId;
