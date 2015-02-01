/**
 * API Error
 * @param error
 * @constructor
 */
function CommonError(error) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'CommonError';
    this.code = error.code;
    this.status = error.status;
    this.message = error.message;
}

/*!
 * toString helper
 */
CommonError.prototype.toString = function () {
    return this.message;
};

/*!
 * Inherits from Error
 */
CommonError.prototype.__proto__ = Error.prototype;

/*!
 * exports
 */
module.exports = CommonError;
