/*!
 * Module dependencies.
 */
var Mongoose = require('mongoose'),
    Document = Mongoose.Document,
    ValidatorError = require('./schematype').ValidatorError,
    ValidationError = Mongoose.Error.ValidationError;

/**
 * From: mongoose/lib/document.js
 * - 유효성 검사를 통과하지 못하였을 경우 발생하는 ValidationError 수정.
 *
 * @param path
 * @param err
 * @param val
 */
Document.prototype.invalidate = function (path, err, val) {
    // 기존 코드와 분기처리
    if ('undefined' === typeof err.code) {
        if (!this.$__.validationError) {
            this.$__.validationError = new ValidationError(this);
        }
        if (!err || 'string' === typeof err) {
            err = new ValidatorError(path, err, 'user defined', val)
        }

        if (this.$__.validationError == err) return;

        this.$__.validationError.errors[path] = err;
    } else {
        this.$__.validationError = err;
    }
};

/*!
 * Module exports.
 */
module.exports = exports = Document;
