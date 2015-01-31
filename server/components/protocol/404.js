'use strict';

/**
 * if res._code and res._data are undefined, req.url is 404.
 * @param req
 * @param res
 * @param next
 */
module.exports = function (req, res, next) {
    if (!res._code && !res._data) res._code = require('./CODE').COMMON.NOT_FOUND;
    next();
};