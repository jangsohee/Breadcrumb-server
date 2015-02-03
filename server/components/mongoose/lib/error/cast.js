var CommonError = require('../../../error'),
    CODE = require('../../../protocol/CODE');

/**
 * From: mongoose/lib/error/cast.js
 * - 캐스팅 에러 리턴
 *
 * @param type
 * @param value
 * @param path
 * @constructor
 */
function CastError (type, value, path) {
    var code = CODE.COMMON.CASTING;
    code.message = 'Cast to ' + type + ' failed for value \'' + JSON.stringify(value) + '\' at path \'' + path + '\'';
    CommonError.call(this, code);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'CastError';
    this.code = code.code;
    this.status = code.status;
    this.message = code.message;
}

/*!
 * toString helper
 */
CastError.prototype.toString = function () {
    return this.message;
};

/*!
 * Inherits from MongooseError.
 */
CastError.prototype.__proto__ = CommonError.prototype;

/*!
 * exports
 */
module.exports = CastError;