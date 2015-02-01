var SchemaType = require('mongoose').SchemaType;
var error = require('./error');
var CastError = error.CastError;
var ValidatorError = error.ValidatorError;

/**
 * From: mongoose/lib/schematype.js
 *
 * required type 변경: string -> object
 *
 * @param required
 * @param message
 * @returns {SchemaType}
 */
SchemaType.prototype.required = function (required, message) {
    if (false === required) {
        this.validators = this.validators.filter(function (v) {
            return v[0] != this.requiredValidator;
        }, this);

        this.isRequired = false;
        return this;
    }

    var self = this;
    this.isRequired = true;

    this.requiredValidator = function (v) {
        // in here, `this` refers to the validating document.
        // no validation when this path wasn't selected in the query.
        if ('isSelected' in this &&
            !this.isSelected(self.path) &&
            !this.isModified(self.path)) return true;
        return self.checkRequired(v, this);
    };

    if ('object' == typeof required) {
        message = required;
        required = undefined;
    }

    var msg = message;
    this.validators.push([this.requiredValidator, msg, 'required']);

    return this;
};

/**
 * From: mongoose/lib/schematype.js
 *
 * ValidatorError 리콰이어를 변경하기 위한 모듈. 수정내역은 없다.
 *
 * @param value
 * @param fn
 * @param scope
 * @returns {*}
 */
SchemaType.prototype.doValidate = function (value, fn, scope) {
    var err = false
        , path = this.path
        , count = this.validators.length;

    if (!count) return fn(null);

    function validate (ok, message, type, val) {
        if (err) return;
        if (ok === undefined || ok) {
            --count || fn(null);
        } else {
            fn(err = new ValidatorError(path, message, type, val));
        }
    }

    this.validators.forEach(function (v) {
        var validator = v[0]
            , message = v[1]
            , type = v[2];

        if (validator instanceof RegExp) {
            validate(validator.test(value), message, type, value);
        } else if ('function' === typeof validator) {
            if (2 === validator.length) {
                validator.call(scope, value, function (ok) {
                    validate(ok, message, type, value);
                });
            } else {
                validate(validator.call(scope, value), message, type, value);
            }
        }
    });
};

/*!
 * Module exports.
 */

module.exports = exports = SchemaType;

exports.CastError = CastError;

exports.ValidatorError = ValidatorError;