'use strict';

var _ = require('lodash'),
    CODE = require('./CODE');

/**
 * 에러 발생시 리턴 절차
 * @param err
 * @param req
 * @param res
 * @param next
 */
module.exports = function (err, req, res, next) {
    res._code = _.isObject(err) ? err : _.merge(CODE.COMMON.ERROR, { message: err });
    next();
};
