/*!
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    SchemaArray = mongoose.SchemaTypes.Array,
    SchemaType = require('../schematype'),
    CastError = SchemaType.CastError,
    MongooseArray = mongoose.Types.Array;

/**
 * Casts values for set().
 *
 * @param {Object} value
 * @param {Document} doc document that triggers the casting
 * @param {Boolean} init whether this is an initialization cast
 * @api private
 */

SchemaArray.prototype.cast = function (value, doc, init) {
    if (Array.isArray(value)) {

        if (!value.length && doc) {
            var indexes = doc.schema.indexedPaths();

            for (var i = 0, l = indexes.length; i < l; ++i) {
                var pathIndex = indexes[i][0][this.path];
                if ('2dsphere' === pathIndex || '2d' === pathIndex) {
                    return;
                }
            }
        }

        if (!(value instanceof MongooseArray)) {
            value = new MongooseArray(value, this.path, doc);
        }

        if (this.caster) {
            try {
                for (var i = 0, l = value.length; i < l; i++) {
                    value[i] = this.caster.cast(value[i], doc, init);
                }
            } catch (e) {
                // rethrow
                throw new CastError(e.type, value, this.path);
            }
        }

        return value;
    } else {
        return this.cast([value], doc, init);
    }
};

/*!
 * Module exports.
 */

module.exports = SchemaArray;
