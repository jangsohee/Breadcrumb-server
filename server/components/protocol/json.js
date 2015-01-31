'use strict';

var _ = require('lodash'),
    CODE = require('./CODE');

/**
 * Json type API protocol.
 * @param req
 * @param res
 */
module.exports = function (req, res) {
    if (res._code) {
        var error = res._code;
        res
            .status(error.status)
            .json({
                code: error.code,
                status: error.status,
                message: error.message
            });
    } else {
        var success = req.method === 'GET' ? CODE.SUCCESS.GET : CODE.SUCCESS.SET;
        res
            .status(success.status)
            .json({
                code: success.code,
                status: success.status,
                message: success.message,
                data: res._data
            });
    }
};