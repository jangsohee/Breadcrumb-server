var CommonError = require('../../../error');

/**
 * Validator error
 *  - return CODE
 * @param path
 * @param msg
 * @param type
 * @param val
 * @constructor
 */
function ValidatorError (path, msg, type, val) {
    if (arguments.length === 1) msg = path;
    CommonError.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'ValidatorError';
    this.code = msg.code;
    this.status = msg.status;
    this.message = msg.message;
}

/*!
 * toString helper
 */
ValidatorError.prototype.toString = function () {
    return this.message;
};

/*!
 * Inherits from CommonError
 */
ValidatorError.prototype.__proto__ = CommonError.prototype;

/*!
 * exports
 */
module.exports = ValidatorError;