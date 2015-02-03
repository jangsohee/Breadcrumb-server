/*!
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    SchemaBuffer = mongoose.SchemaTypes.Buffer,
    SchemaType = require('../schematype'),
    CastError = SchemaType.CastError,
    MongooseBuffer = mongoose.Types.Buffer,
    Binary = MongooseBuffer.Binary,
    Document;

SchemaBuffer.prototype.cast = function (value, doc, init) {
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
        if (Buffer.isBuffer(value)) {
            return value;
        } else if ('object' !== typeof value) {
            throw new CastError('buffer', value, this.path);
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

    // documents
    if (value && value._id) {
        value = value._id;
    }

    if (Buffer.isBuffer(value)) {
        if (!(value instanceof MongooseBuffer)) {
            value = new MongooseBuffer(value, [this.path, doc]);
        }

        return value;
    } else if (value instanceof Binary) {
        var ret = new MongooseBuffer(value.value(true), [this.path, doc]);
        ret.subtype(value.sub_type);
        // do not override Binary subtypes. users set this
        // to whatever they want.
        return ret;
    }

    if (null === value) return value;

    var type = typeof value;
    if ('string' == type || 'number' == type || Array.isArray(value)) {
        var ret = new MongooseBuffer(value, [this.path, doc]);
        return ret;
    }

    throw new CastError('buffer', value, this.path);
};

/*!
 * Module exports.
 */

module.exports = SchemaBuffer;
